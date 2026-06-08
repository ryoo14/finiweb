import { createHash } from "node:crypto"
import { saveArticle } from "../db.js"
import * as logger from "../logger.js"

const NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0"
const CVSS_THRESHOLD = 7.0

type NvdMetrics = {
  cvssMetricV31?: { cvssData: { baseScore: number } }[]
  cvssMetricV30?: { cvssData: { baseScore: number } }[]
  cvssMetricV2?: { cvssData: { baseScore: number } }[]
}

type NvdCve = {
  id: string
  published: string
  descriptions: { lang: string; value: string }[]
  metrics: NvdMetrics
}

function extractCvss(metrics: NvdMetrics): number | undefined {
  return (
    metrics.cvssMetricV31?.[0]?.cvssData.baseScore ??
    metrics.cvssMetricV30?.[0]?.cvssData.baseScore ??
    metrics.cvssMetricV2?.[0]?.cvssData.baseScore
  )
}

export async function collectCVE(): Promise<number> {
  try {
    const pubStartDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .replace("Z", "+00:00")
    const pubEndDate = new Date().toISOString().replace("Z", "+00:00")

    const params = new URLSearchParams({ pubStartDate, pubEndDate })
    const headers: Record<string, string> = { "User-Agent": "finiweb/1.0" }
    if (process.env.NVD_API_KEY) headers.apiKey = process.env.NVD_API_KEY

    const res = await fetch(`${NVD_API}?${params}`, { headers })
    const data = (await res.json()) as { vulnerabilities?: { cve: NvdCve }[] }

    const LIMIT = 5
    let count = 0
    for (const vuln of data.vulnerabilities ?? []) {
      if (count >= LIMIT) break
      const cve = vuln.cve
      const cvssScore = extractCvss(cve.metrics)

      if (cvssScore === undefined || cvssScore < CVSS_THRESHOLD) continue

      const description = cve.descriptions.find((d) => d.lang === "en")?.value ?? cve.id
      const url = `https://nvd.nist.gov/vuln/detail/${cve.id}`
      const id = createHash("sha256").update(url).digest("hex").slice(0, 16)

      saveArticle({
        id,
        title: `[${cve.id}] ${description.slice(0, 120)}`,
        url,
        source: "nvd",
        category: "security",
        publishedAt: new Date(cve.published).toISOString(),
        collectedAt: new Date().toISOString(),
        cvssScore,
      })
      count++
    }

    return count
  } catch (err) {
    logger.error("[nvd] Failed:", (err as Error).message)
    return 0
  }
}
