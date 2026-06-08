import * as cheerio from "cheerio"
import { saveArticle } from "../db.ts"
import { hashId } from "../hash.ts"
import * as logger from "../logger.ts"

export async function collectGithubTrending(): Promise<number> {
  try {
    const res = await fetch("https://github.com/trending", {
      headers: { "User-Agent": "finiweb/1.0" },
    })
    const html = await res.text()
    const $ = cheerio.load(html)

    const LIMIT = 5
    let count = 0
    const promises: Promise<void>[] = []

    $("article.Box-row").each((_, el) => {
      if (count >= LIMIT) return false
      const href = $(el).find("h2 a").attr("href")
      if (!href) return

      const url = `https://github.com${href}`
      const repoName = href.slice(1)
      const desc = $(el).find("p").text().trim()
      const title = desc ? `${repoName} — ${desc}` : repoName

      promises.push(
        hashId(url).then((id) => {
          saveArticle({
            id,
            title,
            url,
            source: "github-trending",
            category: "oss",
            publishedAt: new Date().toISOString(),
            collectedAt: new Date().toISOString(),
          })
        }),
      )
      count++
    })

    await Promise.all(promises)
    return count
  } catch (err) {
    logger.error("[github-trending] Failed:", (err as Error).message)
    return 0
  }
}
