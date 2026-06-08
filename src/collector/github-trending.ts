import { createHash } from "node:crypto"
import * as cheerio from "cheerio"
import { saveArticle } from "../db.js"
import * as logger from "../logger.js"

export async function collectGithubTrending(): Promise<number> {
  try {
    const res = await fetch("https://github.com/trending", {
      headers: { "User-Agent": "finiweb/1.0" },
    })
    const html = await res.text()
    const $ = cheerio.load(html)

    const LIMIT = 5
    let count = 0
    $("article.Box-row").each((_, el) => {
      if (count >= LIMIT) return false
      const href = $(el).find("h2 a").attr("href")
      if (!href) return

      const url = `https://github.com${href}`
      const repoName = href.slice(1)
      const desc = $(el).find("p").text().trim()
      const title = desc ? `${repoName} — ${desc}` : repoName

      const id = createHash("sha256").update(url).digest("hex").slice(0, 16)
      saveArticle({
        id,
        title,
        url,
        source: "github-trending",
        category: "oss",
        publishedAt: new Date().toISOString(),
        collectedAt: new Date().toISOString(),
      })
      count++
    })

    return count
  } catch (err) {
    logger.error("[github-trending] Failed:", (err as Error).message)
    return 0
  }
}
