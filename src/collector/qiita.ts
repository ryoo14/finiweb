import { saveArticle } from "../db.ts";
import { hashId } from "../hash.ts";
import * as logger from "../logger.ts";

const MIN_STOCKS = 50;
const LIMIT = 5;

type QiitaItem = {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  created_at: string;
};

export async function collectQiita(): Promise<number> {
  try {
    const params = new URLSearchParams({
      query: `stocks:>=${MIN_STOCKS}`,
      sort: "stock",
      per_page: String(LIMIT),
    });

    const headers: Record<string, string> = { "User-Agent": "finiweb/1.0" };
    const token = Deno.env.get("QIITA_TOKEN");
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://qiita.com/api/v2/items?${params}`, {
      headers,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const items = (await res.json()) as QiitaItem[];
    let count = 0;

    for (const item of items) {
      const id = await hashId(item.url);
      saveArticle({
        id,
        title: item.title,
        url: item.url,
        source: "qiita",
        category: "dev",
        publishedAt: new Date(item.created_at).toISOString(),
        collectedAt: new Date().toISOString(),
      });
      count++;
    }

    return count;
  } catch (err) {
    logger.error("[qiita] Failed:", (err as Error).message);
    return 0;
  }
}
