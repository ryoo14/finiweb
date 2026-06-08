import { saveArticle } from "../db.ts";
import { hashId } from "../hash.ts";
import * as logger from "../logger.ts";

const LIMIT = 5;

type ZennArticle = {
  id: number;
  slug: string;
  title: string;
  liked_count: number;
  published_at: string;
  user: { username: string };
};

type ZennResponse = {
  articles: ZennArticle[];
};

export async function collectZenn(): Promise<number> {
  try {
    const res = await fetch("https://zenn.dev/api/articles?order=trending", {
      headers: { "User-Agent": "finiweb/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as ZennResponse;
    let count = 0;

    for (const article of data.articles.slice(0, LIMIT)) {
      const url =
        `https://zenn.dev/${article.user.username}/articles/${article.slug}`;
      const id = await hashId(url);

      saveArticle({
        id,
        title: article.title,
        url,
        source: "zenn",
        category: "dev",
        publishedAt: new Date(article.published_at).toISOString(),
        collectedAt: new Date().toISOString(),
      });
      count++;
    }

    return count;
  } catch (err) {
    logger.error("[zenn] Failed:", (err as Error).message);
    return 0;
  }
}
