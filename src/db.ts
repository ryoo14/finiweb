import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "@std/path";
import type { Article, Category } from "./types.ts";

function jstToday(): string {
	return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });
}

const DB_PATH =
	Deno.env.get("DB_PATH") ??
	join(import.meta.dirname!, "..", "data", "finiweb.db");

let _db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
	if (!_db) {
		Deno.mkdirSync(dirname(DB_PATH), { recursive: true });
		_db = new DatabaseSync(DB_PATH);
		_db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS articles (
        id           TEXT PRIMARY KEY,
        title        TEXT NOT NULL,
        url          TEXT UNIQUE NOT NULL,
        source       TEXT NOT NULL,
        category     TEXT NOT NULL,
        published_at TEXT NOT NULL,
        collected_at TEXT NOT NULL,
        cvss_score   REAL,
        is_notified  INTEGER NOT NULL DEFAULT 0
      )
    `);
	}
	return _db;
}

type ArticleRow = {
	id: string;
	title: string;
	url: string;
	source: string;
	category: string;
	published_at: string;
	collected_at: string;
	cvss_score: number | null;
	is_notified: number;
};

function rowToArticle(row: ArticleRow): Article {
	return {
		id: row.id,
		title: row.title,
		url: row.url,
		source: row.source,
		category: row.category as Category,
		publishedAt: row.published_at,
		collectedAt: row.collected_at,
		cvssScore: row.cvss_score ?? undefined,
		isNotified: row.is_notified === 1,
	};
}

export function saveArticle(article: Omit<Article, "isNotified">): void {
	const db = getDb();
	db.prepare(`
    INSERT OR IGNORE INTO articles
      (id, title, url, source, category, published_at, collected_at, cvss_score)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
		article.id,
		article.title,
		article.url,
		article.source,
		article.category,
		article.publishedAt,
		article.collectedAt,
		article.cvssScore ?? null,
	);
}

export function getArticlesByDate(
	date: string,
	category?: Category,
): Article[] {
	const db = getDb();
	const rows = category
		? (db
				.prepare(`
          SELECT * FROM articles
          WHERE date(collected_at, '+9 hours') = ? AND category = ?
          ORDER BY
            CASE category WHEN 'security' THEN 0 ELSE 1 END,
            published_at DESC
        `)
				.all(date, category) as ArticleRow[])
		: (db
				.prepare(`
          SELECT * FROM articles
          WHERE date(collected_at, '+9 hours') = ?
          ORDER BY
            CASE category WHEN 'security' THEN 0 ELSE 1 END,
            published_at DESC
        `)
				.all(date) as ArticleRow[]);
	return rows.map(rowToArticle);
}

export function getAvailableDates(): string[] {
	const db = getDb();
	return (
		db
			.prepare(`
        SELECT DISTINCT date(collected_at, '+9 hours') AS d FROM articles ORDER BY d DESC LIMIT 30
      `)
			.all() as { d: string }[]
	).map((r) => r.d);
}

export function getUnnotifiedArticles(): Article[] {
	const db = getDb();
	const today = jstToday();
	return (
		db
			.prepare(`
        SELECT * FROM articles
        WHERE date(collected_at, '+9 hours') = ? AND is_notified = 0
        ORDER BY
          CASE category WHEN 'security' THEN 0 ELSE 1 END,
          published_at DESC
      `)
			.all(today) as ArticleRow[]
	).map(rowToArticle);
}

export function markNotified(ids: string[]): void {
	const db = getDb();
	const stmt = db.prepare("UPDATE articles SET is_notified = 1 WHERE id = ?");
	for (const id of ids) stmt.run(id);
}
