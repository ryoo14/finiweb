import { createHash } from "node:crypto"
import * as cheerio from "cheerio"
import { saveArticle } from "../db.js"

export async function collectGithubTrending(): Promise<number> {
  try {
    const res = await fetch("https://github.com/trending", {
      headers: { "User-Agent": "finiweb/1.0" },
    })
    const html = await res.text()
    const $ = cheerio.load(html)

    let count = 0
    $("article.Box-row").each((_, el) => {
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
    console.error("[github-trending] Failed:", (err as Error).message)
    return 0
  }
}
