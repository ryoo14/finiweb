import type { SourceConfig } from "../types.js"
import { collectCVE } from "./cve.js"
import { collectGithubTrending } from "./github-trending.js"
import { collectHN } from "./hn.js"
import { collectRss } from "./rss.js"

const RSS_SOURCES: SourceConfig[] = [
  { id: "zenn", name: "Zenn", category: "dev", type: "rss", url: "https://zenn.dev/feed" },
  {
    id: "qiita",
    name: "Qiita",
    category: "dev",
    type: "rss",
    url: "https://qiita.com/popular-items/feed",
  },
  {
    id: "hatebu",
    name: "はてなブックマーク テクノロジー",
    category: "dev",
    type: "rss",
    url: "https://b.hatena.ne.jp/hotentry/it.rss",
  },
  {
    id: "techcrunch-jp",
    name: "TechCrunch Japan",
    category: "news",
    type: "rss",
    url: "https://jp.techcrunch.com/feed/",
  },
  {
    id: "publickey",
    name: "Public Key",
    category: "news",
    type: "rss",
    url: "https://www.publickey1.jp/atom.xml",
  },
  {
    id: "theregister",
    name: "The Register",
    category: "news",
    type: "rss",
    url: "https://www.theregister.com/headlines.atom",
  },
  {
    id: "arstechnica",
    name: "Ars Technica",
    category: "news",
    type: "rss",
    url: "https://feeds.arstechnica.com/arstechnica/index",
  },
  {
    id: "bleepingcomputer",
    name: "Bleeping Computer",
    category: "security",
    type: "rss",
    url: "https://www.bleepingcomputer.com/feed/",
  },
  {
    id: "darkreading",
    name: "Dark Reading",
    category: "security",
    type: "rss",
    url: "https://www.darkreading.com/rss.xml",
  },
]

export async function runCollector(): Promise<Record<string, number>> {
  console.log("[collector] Starting...")
  const results: Record<string, number> = {}

  for (const source of RSS_SOURCES) {
    process.stdout.write(`  ${source.name}...`)
    const n = await collectRss(source)
    console.log(` ${n}`)
    results[source.id] = n
  }

  process.stdout.write("  Hacker News...")
  results.hn = await collectHN()
  console.log(` ${results.hn}`)

  process.stdout.write("  GitHub Trending...")
  results["github-trending"] = await collectGithubTrending()
  console.log(` ${results["github-trending"]}`)

  process.stdout.write("  CVE (NVD)...")
  results.nvd = await collectCVE()
  console.log(` ${results.nvd}`)

  const total = Object.values(results).reduce((a, b) => a + b, 0)
  console.log(`[collector] Done. Total: ${total} articles`)
  return results
}
