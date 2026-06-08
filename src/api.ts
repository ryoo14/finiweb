import { Hono } from "hono"
import { runCollector } from "./collector/index.ts"
import { getArticlesByDate, getAvailableDates } from "./db.ts"
import { sendDailyDigest } from "./notifier/discord.ts"
import type { Category } from "./types.ts"
import { Dashboard } from "./views/dashboard.tsx"

export const app = new Hono()

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

app.get("/", (c) => {
  const today = todayStr()
  const category = c.req.query("category") as Category | undefined
  const articles = getArticlesByDate(today, category)
  const dates = getAvailableDates()
  return c.html(
    String(Dashboard({ articles, selectedDate: today, selectedCategory: category, dates })),
  )
})

app.get("/date/:date", (c) => {
  const date = c.req.param("date")
  const category = c.req.query("category") as Category | undefined
  const articles = getArticlesByDate(date, category)
  const dates = getAvailableDates()
  return c.html(
    String(Dashboard({ articles, selectedDate: date, selectedCategory: category, dates })),
  )
})

app.post("/api/collect", async (c) => {
  const results = await runCollector()
  return c.json({ ok: true, results })
})

app.post("/api/notify", async (c) => {
  await sendDailyDigest()
  return c.json({ ok: true })
})

app.get("/health", (c) => c.json({ ok: true }))
