import * as logger from "../logger.ts";
import type { SourceConfig } from "../types.ts";
import { collectCVE } from "./cve.ts";
import { collectGithubTrending } from "./github-trending.ts";
import { collectHN } from "./hn.ts";
import { collectQiita } from "./qiita.ts";
import { collectRss } from "./rss.ts";
import { collectZenn } from "./zenn.ts";

const RSS_SOURCES: SourceConfig[] = [
  {
    id: "hatebu",
    name: "はてなブックマーク テクノロジー",
    category: "dev",
    type: "rss",
    url: "https://b.hatena.ne.jp/hotentry/it.rss",
    limit: 5,
  },
  {
    id: "gihyo",
    name: "gihyo.jp",
    category: "dev",
    type: "rss",
    url: "https://gihyo.jp/feed/rss2",
    limit: 5,
  },
  {
    id: "publickey",
    name: "Public Key",
    category: "news",
    type: "rss",
    url: "https://www.publickey1.jp/atom.xml",
    limit: 5,
  },
  {
    id: "theregister",
    name: "The Register",
    category: "news",
    type: "rss",
    url: "https://www.theregister.com/headlines.atom",
    limit: 5,
  },
  {
    id: "arstechnica",
    name: "Ars Technica",
    category: "news",
    type: "rss",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    limit: 5,
  },
  {
    id: "bleepingcomputer",
    name: "Bleeping Computer",
    category: "security",
    type: "rss",
    url: "https://www.bleepingcomputer.com/feed/",
    limit: 5,
  },
  {
    id: "darkreading",
    name: "Dark Reading",
    category: "security",
    type: "rss",
    url: "https://www.darkreading.com/rss.xml",
    limit: 5,
  },
  {
    id: "itmedia-enterprise",
    name: "ITmedia エンタープライズ",
    category: "news",
    type: "rss",
    url: "https://rss.itmedia.co.jp/rss/2.0/enterprise.xml",
    limit: 5,
  },
  {
    id: "zdnet-japan",
    name: "ZDNet Japan",
    category: "news",
    type: "rss",
    url: "https://feeds.japan.zdnet.com/rss/zdnet/all.rdf",
    limit: 5,
  },
];

export async function runCollector(): Promise<Record<string, number>> {
  logger.log("[collector] Starting...");
  const results: Record<string, number> = {};

  for (const source of RSS_SOURCES) {
    const n = await collectRss(source);
    logger.log(`  ${source.name}: ${n}`);
    results[source.id] = n;
  }

  results.zenn = await collectZenn();
  logger.log(`  Zenn (trending): ${results.zenn}`);

  results.qiita = await collectQiita();
  logger.log(`  Qiita (trending): ${results.qiita}`);

  results.hn = await collectHN();
  logger.log(`  Hacker News: ${results.hn}`);

  results["github-trending"] = await collectGithubTrending();
  logger.log(`  GitHub Trending: ${results["github-trending"]}`);

  results.nvd = await collectCVE();
  logger.log(`  CVE (NVD): ${results.nvd}`);

  const total = Object.values(results).reduce((a, b) => a + b, 0);
  logger.log(`[collector] Done. Total: ${total} articles`);
  return results;
}
