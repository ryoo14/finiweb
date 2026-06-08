import Parser from "rss-parser"
import { saveArticle } from "../db.ts"
import { hashId } from "../hash.ts"
import * as logger from "../logger.ts"
import type { SourceConfig } from "../types.ts"

const parser = new Parser({ timeout: 10000 })

export async function collectRss(source: SourceConfig): Promise<number> {
  if (!source.url) throw new Error(`No URL for ${source.id}`)

  try {
    const feed = await parser.parseURL(source.url)
    let count = 0

    const items = source.limit ? feed.items.slice(0, source.limit) : feed.items

    for (const item of items) {
      if (!item.title || !item.link) continue

      const id = await hashId(item.link)
      const publishedAt = item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString()

      saveArticle({
        id,
        title: item.title.trim(),
        url: item.link,
        source: source.id,
        category: source.category,
        publishedAt,
        collectedAt: new Date().toISOString(),
      })
      count++
    }

    return count
  } catch (err) {
    logger.error(`[${source.id}] RSS failed:`, (err as Error).message)
    return 0
  }
}
