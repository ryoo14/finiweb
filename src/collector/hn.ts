import { createHash } from "node:crypto"
import { saveArticle } from "../db.js"

const LIMIT = 30

type HNItem = {
  type: string
  title: string
  url?: string
  time: number
}

export async function collectHN(): Promise<number> {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
    const ids = (await res.json()) as number[]

    let count = 0
    for (const hnId of ids.slice(0, LIMIT)) {
      const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${hnId}.json`)
      const item = (await itemRes.json()) as HNItem

      if (!item || item.type !== "story" || !item.url || !item.title) continue

      const id = createHash("sha256").update(item.url).digest("hex").slice(0, 16)
      saveArticle({
        id,
        title: item.title,
        url: item.url,
        source: "hn",
        category: "dev",
        publishedAt: new Date(item.time * 1000).toISOString(),
        collectedAt: new Date().toISOString(),
      })
      count++
    }

    return count
  } catch (err) {
    console.error("[hn] Failed:", (err as Error).message)
    return 0
  }
}
