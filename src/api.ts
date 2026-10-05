import { Hono } from "hono";
import { runCollector } from "./collector/index.ts";
import { getArticlesByDate, getAvailableDates } from "./db.ts";
import { sendDailyDigest } from "./notifier/discord.ts";
import type { Category } from "./types.ts";
import { Dashboard } from "./views/dashboard.tsx";

export const app = new Hono();

function todayStr() {
	return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });
}

app.get("/", (c) => {
	const today = todayStr();
	const category = c.req.query("category") as Category | undefined;
	const articles = getArticlesByDate(today, category);
	const dates = getAvailableDates();
	return c.html(
		String(
			Dashboard({
				articles,
				selectedDate: today,
				selectedCategory: category,
				dates,
			}),
		),
	);
});

app.get("/date/:date", (c) => {
	const date = c.req.param("date");
	const category = c.req.query("category") as Category | undefined;
	const articles = getArticlesByDate(date, category);
	const dates = getAvailableDates();
	return c.html(
		String(
			Dashboard({
				articles,
				selectedDate: date,
				selectedCategory: category,
				dates,
			}),
		),
	);
});

const CATEGORIES: Category[] = ["security", "cloud", "oss", "infra", "dev", "news"];

app.get("/api/articles", (c) => {
	const date = c.req.query("date") ?? todayStr();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return c.json({ ok: false, error: "date must be YYYY-MM-DD" }, 400);
	}
	const category = c.req.query("category");
	if (category !== undefined && !CATEGORIES.includes(category as Category)) {
		return c.json({ ok: false, error: `category must be one of ${CATEGORIES.join(", ")}` }, 400);
	}
	const articles = getArticlesByDate(date, category as Category | undefined);
	return c.json({ ok: true, date, articles });
});

app.post("/api/collect", async (c) => {
	const results = await runCollector();
	return c.json({ ok: true, results });
});

app.post("/api/notify", async (c) => {
	await sendDailyDigest();
	return c.json({ ok: true });
});

app.get("/health", (c) => c.json({ ok: true }));
