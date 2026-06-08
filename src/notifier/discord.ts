import { getUnnotifiedArticles, markNotified } from "../db.ts"
import * as logger from "../logger.ts"
import type { Article } from "../types.ts"

const MAX_ARTICLES = 15

export async function sendDailyDigest(): Promise<void> {
  const webhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL")
  if (!webhookUrl) {
    logger.warn("[discord] DISCORD_WEBHOOK_URL not set, skipping")
    return
  }

  const articles = getUnnotifiedArticles().slice(0, MAX_ARTICLES)
  if (articles.length === 0) {
    logger.log("[discord] No new articles")
    return
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const security = articles.filter((a) => a.category === "security")
  const others = articles.filter((a) => a.category !== "security")

  const formatList = (list: Article[]) =>
    list
      .map((a) => {
        const cvss = a.cvssScore ? ` \`CVSS ${a.cvssScore}\`` : ""
        return `• **${a.title}**${cvss}\n  <${a.url}>`
      })
      .join("\n")

  const embeds: object[] = []
  if (security.length > 0) {
    embeds.push({ title: "🔴 セキュリティ", description: formatList(security), color: 0xff4444 })
  }
  if (others.length > 0) {
    embeds.push({ title: "📰 技術ニュース", description: formatList(others), color: 0x4488ff })
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `**📡 finiweb 朝刊 — ${today}** (${articles.length}件)`,
      embeds,
    }),
  })

  if (!res.ok) throw new Error(`Discord error: ${res.status}`)

  markNotified(articles.map((a) => a.id))
  logger.log(`[discord] Sent ${articles.length} articles`)
}
