/** @jsxImportSource hono/jsx */
import type { Article, Category } from "../types.ts";

const CATEGORIES: {
	id: Category;
	label: string;
	emoji: string;
	bg: string;
	fg: string;
	accent: string;
}[] = [
	{
		id: "security",
		label: "Security",
		emoji: "🔴",
		bg: "#C9551F",
		fg: "#FFFCF9",
		accent: "#C9551F",
	},
	{
		id: "cloud",
		label: "Cloud",
		emoji: "☁️",
		bg: "#3AAFB9",
		fg: "#292F36",
		accent: "#3AAFB9",
	},
	{
		id: "oss",
		label: "OSS",
		emoji: "📦",
		bg: "#2E8C95",
		fg: "#FFFCF9",
		accent: "#2E8C95",
	},
	{
		id: "infra",
		label: "Infra",
		emoji: "🔧",
		bg: "#FD8850",
		fg: "#292F36",
		accent: "#FD8850",
	},
	{
		id: "dev",
		label: "Dev",
		emoji: "💻",
		bg: "#292F36",
		fg: "#FFFCF9",
		accent: "#292F36",
	},
	{
		id: "news",
		label: "News",
		emoji: "📰",
		bg: "#8A8782",
		fg: "#292F36",
		accent: "#8A8782",
	},
];

const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
	Category,
	(typeof CATEGORIES)[number]
>;

const CSS = `
:root {
  --orange:      #FD8850;
  --orange-deep: #C9551F;
  --teal:        #3AAFB9;
  --teal-deep:   #2E8C95;
  --ink:         #292F36;
  --mid:         #8A8782;
  --card:        #F7F3EE;
  --bg:          #FFFCF9;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }

/* オーバースクロール領域をヘッダーと同色に */
html { background: var(--ink) }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none }

/* ── Header ── */
.hdr {
  background: var(--ink);
  border-bottom: 3px solid var(--orange);
  padding: 0 32px;
  height: 58px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.hdr-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hdr-icon {
  width: 32px;
  height: 32px;
  background: var(--orange);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.hdr-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--bg);
  letter-spacing: -0.3px;
}
.hdr-divider {
  width: 1px;
  height: 20px;
  background: #3f4a55;
}
.hdr-sub {
  font-size: 12px;
  color: #B9BDC2;
  font-weight: 400;
}

/* ── Layout ── */
.wrap {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

/* ── Sticky controls (デスクトップのみ) ── */
.ctrl-wrap {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg);
  padding: 16px 0 14px;
  border-bottom: 1px solid var(--card);
  margin-bottom: 20px;
}
@media (max-width: 640px) {
  .ctrl-wrap { position: static }
}
.ctrl {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

/* Date selector */
.date-sel {
  appearance: none;
  background: var(--card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238A8782'/%3E%3C/svg%3E") no-repeat right 10px center;
  border: 1.5px solid transparent;
  color: var(--ink);
  padding: 7px 30px 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: border-color .15s;
}
.date-sel:hover { border-color: var(--mid) }
.date-sel:focus { border-color: var(--teal-deep) }

/* Tabs */
.tabs { display: flex; gap: 6px; flex-wrap: wrap }
.tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid transparent;
  background: transparent;
  color: var(--mid);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color .15s, background .15s, border-color .15s;
  white-space: nowrap;
}
.tab:hover {
  color: var(--ink);
  background: var(--card);
  border-color: var(--card);
}
.tab.on {
  color: var(--bg);
  background: var(--orange-deep);
  border-color: var(--orange-deep);
}

/* Count */
.cnt {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  color: var(--mid);
  background: var(--card);
  padding: 4px 10px;
  border-radius: 20px;
}

/* ── Article list ── */
.list { display: flex; flex-direction: column; gap: 6px }

.item {
  background: var(--card);
  padding: 14px 18px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 4px solid transparent;
  box-shadow: 0 1px 3px rgba(41,47,54,.06);
  transition: box-shadow .15s, transform .1s;
}
.item:hover {
  box-shadow: 0 4px 12px rgba(41,47,54,.1);
  transform: translateY(-1px);
}

/* タイトルリンク: Teal Deep + 太字 (DESIGN.md rule 3) */
.item-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--teal-deep);
}
.item-title:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--ink);
}

/* Meta row */
.item-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  color: var(--mid);
  flex-wrap: wrap;
}
.meta-sep { color: var(--card); filter: brightness(0.85) }

/* Category badge */
.badge {
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

/* CVSS badge */
.cvss {
  background: var(--orange-deep);
  color: #fff;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
}

/* Source chip */
.source {
  background: var(--bg);
  border: 1px solid #DDD8D2;
  color: var(--mid);
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

/* Time */
.time { font-size: 11px; color: var(--mid) }

/* Empty state */
.empty {
  text-align: center;
  color: var(--mid);
  padding: 80px 40px;
  font-size: 15px;
}
.empty-icon { font-size: 36px; display: block; margin-bottom: 12px; opacity: .5 }
`;

type Props = {
	articles: Article[];
	selectedDate: string;
	selectedCategory?: Category;
	dates: string[];
};

function fmtDate(iso: string) {
	return iso.replace(/-/g, "/");
}

function fmtTime(iso: string) {
	const d = new Date(iso);
	return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(
		2,
		"0",
	)}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function Dashboard({
	articles,
	selectedDate,
	selectedCategory,
	dates,
}: Props) {
	const allDates = dates.includes(selectedDate)
		? dates
		: [selectedDate, ...dates];

	return (
		<html lang="ja">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<meta name="theme-color" content="#292F36" />
				<title>finiweb</title>
				<style dangerouslySetInnerHTML={{ __html: CSS }} />
			</head>
			<body>
				<header class="hdr">
					<div class="hdr-brand">
						<div class="hdr-icon">📡</div>
						<span class="hdr-title">finiweb</span>
					</div>
					<div class="hdr-divider" />
					<span class="hdr-sub">インフラSE向け情報収集ダッシュボード</span>
				</header>

				<div class="wrap">
					<div class="ctrl-wrap">
						<div class="ctrl">
							<select
								class="date-sel"
								onchange={`location.href='/date/'+this.value${
									selectedCategory ? `+'?category=${selectedCategory}'` : ""
								}`}
							>
								{allDates.map((d) => (
									<option value={d} selected={d === selectedDate}>
										{fmtDate(d)}
									</option>
								))}
							</select>

							<div class="tabs">
								<a
									href={`/date/${selectedDate}`}
									class={`tab${!selectedCategory ? " on" : ""}`}
								>
									すべて
								</a>
								{CATEGORIES.map((cat) => (
									<a
										href={`/date/${selectedDate}?category=${cat.id}`}
										class={`tab${selectedCategory === cat.id ? " on" : ""}`}
										style={
											selectedCategory === cat.id
												? `background:${cat.bg};border-color:${cat.bg};color:${cat.fg}`
												: ""
										}
									>
										{cat.emoji} {cat.label}
									</a>
								))}
							</div>

							<span class="cnt">{articles.length} 件</span>
						</div>
					</div>

					<div class="list">
						{articles.length === 0 ? (
							<div class="empty">
								<span class="empty-icon">📭</span>
								この日の記事はまだありません
							</div>
						) : (
							articles.map((a) => (
								<div
									class="item"
									style={`border-left-color:${CAT[a.category].accent}`}
								>
									<a
										href={a.url}
										target="_blank"
										rel="noopener noreferrer"
										class="item-title"
									>
										{a.title}
									</a>
									<div class="item-meta">
										<span
											class="badge"
											style={`background:${CAT[a.category].bg};color:${CAT[a.category].fg}`}
										>
											{a.category}
										</span>
										<span class="source">{a.source}</span>
										{a.cvssScore !== undefined && (
											<span class="cvss">CVSS {a.cvssScore}</span>
										)}
										<span class="time">{fmtTime(a.publishedAt)}</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</body>
		</html>
	);
}
