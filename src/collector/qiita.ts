import { createHash } from "node:crypto"
import { saveArticle } from "../db.js"
import * as logger from "../logger.js"

const MIN_STOCKS = 50
const LIMIT = 5

type QiitaItem = {
  id: string
  title: string
  url: string
  likes_count: number
  created_at: string
}

export async function collectQiita(): Promise<number> {
  try {
    const params = new URLSearchParams({
      query: `stocks:>=${MIN_STOCKS}`,
      sort: "stock",
      per_page: String(LIMIT),
    })

    const headers: Record<string, string> = { "User-Agent": "finiweb/1.0" }
    if (process.env.QIITA_TOKEN) headers.Authorization = `Bearer ${process.env.QIITA_TOKEN}`

    const res = await fetch(`https://qiita.com/api/v2/items?${params}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const items = (await res.json()) as QiitaItem[]
    let count = 0

    for (const item of items) {
      const id = createHash("sha256").update(item.url).digest("hex").slice(0, 16)
      saveArticle({
        id,
        title: item.title,
        url: item.url,
        source: "qiita",
        category: "dev",
        publishedAt: new Date(item.created_at).toISOString(),
        collectedAt: new Date().toISOString(),
      })
      count++
    }

    return count
  } catch (err) {
    logger.error("[qiita] Failed:", (err as Error).message)
    return 0
  }
}
