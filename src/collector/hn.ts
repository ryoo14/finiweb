import { saveArticle } from "../db.ts";
import { hashId } from "../hash.ts";
import * as logger from "../logger.ts";

const LIMIT = 5;
const MIN_SCORE = 100;
const SCAN_SIZE = 60;

type HNItem = {
  type: string;
  title: string;
  url?: string;
  time: number;
  score: number;
};

export async function collectHN(): Promise<number> {
  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
    );
    const ids = (await res.json()) as number[];

    let count = 0;
    for (const hnId of ids.slice(0, SCAN_SIZE)) {
      if (count >= LIMIT) break;

      const itemRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${hnId}.json`,
      );
      const item = (await itemRes.json()) as HNItem;

      if (!item || item.type !== "story" || !item.url || !item.title) continue;
      if (item.score < MIN_SCORE) continue;

      const id = await hashId(item.url);
      saveArticle({
        id,
        title: item.title,
        url: item.url,
        source: "hn",
        category: "dev",
        publishedAt: new Date(item.time * 1000).toISOString(),
        collectedAt: new Date().toISOString(),
      });
      count++;
    }

    return count;
  } catch (err) {
    logger.error("[hn] Failed:", (err as Error).message);
    return 0;
  }
}
