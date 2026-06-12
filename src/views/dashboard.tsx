/** @jsxImportSource hono/jsx */
import type { Article, Category } from "../types.ts";

const CATEGORIES: { id: Category; label: string; accent: string }[] = [
	{ id: "security", label: "Security", accent: "#FD8850" },
	{ id: "cloud", label: "Cloud", accent: "#C9551F" },
	{ id: "oss", label: "OSS", accent: "#292F36" },
	{ id: "infra", label: "Infra", accent: "#8A8782" },
	{ id: "dev", label: "Dev", accent: "#3AAFB9" },
	{ id: "news", label: "News", accent: "#2E8C95" },
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
  --line:        #E9E2D8;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }

/* オーバースクロール領域をヘッダーと同色に */
html { background: var(--ink) }

body {
  font-family: 'Inter', 'IBM Plex Sans JP', -apple-system, BlinkMacSystemFont,
               'Hiragino Sans', 'Noto Sans JP', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none }

::selection { background: var(--teal); color: var(--ink) }

:focus-visible {
  outline: 2px solid var(--teal-deep);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ── Header ── */
.hdr {
  background: var(--ink);
  padding: 0 28px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.hdr-rule {
  height: 3px;
  background: linear-gradient(90deg, var(--orange) 0%, var(--teal) 100%);
}
.hdr-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hdr-icon {
  font-size: 22px;
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
@media (max-width: 640px) {
  .hdr { padding: 0 18px }
  .hdr-divider, .hdr-sub { display: none }
}

/* ── Layout ── */
.wrap {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 24px 48px;
}
@media (max-width: 640px) {
  .wrap { padding: 0 14px 32px }
}

/* ── Sticky controls ── */
.ctrl-wrap {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 252, 249, .88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 16px 0 14px;
  border-bottom: 1px solid var(--line);
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
  border: 1.5px solid var(--line);
  color: var(--ink);
  padding: 7px 30px 7px 12px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
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
  gap: 7px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
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
  border-color: var(--line);
}
/* アクティブタブ: Ink背景 + Base文字 13.4:1 (DESIGN.md コントラスト表) */
.tab.on {
  color: var(--bg);
  background: var(--ink);
  border-color: var(--ink);
}

/* Category dot */
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tab.on .dot { box-shadow: 0 0 0 1.5px rgba(255, 252, 249, .55) }

/* Count */
.cnt {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--mid);
  background: var(--card);
  border: 1px solid var(--line);
  padding: 4px 12px;
  border-radius: 999px;
}

/* ── Article list ── */
.list { display: flex; flex-direction: column; gap: 8px }

.item {
  position: relative;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 18px 14px 21px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  transition: box-shadow .18s, transform .12s, border-color .18s;
}
.item::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--accent, var(--mid));
}
.item:hover {
  border-color: var(--accent, var(--mid));
  box-shadow: 0 6px 16px rgba(41, 47, 54, .08);
  transform: translateY(-1px);
}

/* ── Desktop card grid (≥1200px) ── */
@media (min-width: 1200px) {
  .wrap { max-width: 1560px }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  .item {
    padding: 0 0 16px;
    gap: 12px;
  }

  /* 左ストライプ → 上ストライプ */
  .item::before {
    inset: 0 0 auto 0;
    width: auto;
    height: 3px;
  }

  .item-title {
    font-size: 15px;
    padding: 16px 18px 0;
  }

  .item-meta {
    padding: 0 18px;
  }

  .time { margin-left: 0 }
}

/* タイトルリンク: Teal Deep + 太字 (DESIGN.md rule 3) */
.item-title {
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--ink);
}

/* Meta row */
.item-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 11px;
  color: var(--mid);
  flex-wrap: wrap;
}

/* Category: カラードット + ラベル (ルール4: Mid Grayはラベル用途のみ可) */
.cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--ink);
}

/* CVSS: Orange塗り + Ink文字 7.0:1 (DESIGN.md rule 1) */
.cvss {
  background: var(--orange);
  color: var(--ink);
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  font-variant-numeric: tabular-nums;
}

/* Source chip: Card上の白カード (ルール5の重なり順) */
.source {
  background: #fff;
  border: 1px solid var(--line);
  color: var(--mid);
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 500;
}

/* Time */
.time {
  margin-left: auto;
  font-size: 11px;
  color: var(--mid);
  font-variant-numeric: tabular-nums;
}

/* Empty state */
.empty {
  text-align: center;
  color: var(--mid);
  background: var(--card);
  border: 1px dashed var(--line);
  border-radius: 12px;
  padding: 72px 40px;
  font-size: 14px;
}
.empty-icon { font-size: 34px; display: block; margin-bottom: 12px; opacity: .55 }
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
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossorigin=""
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=IBM+Plex+Sans+JP:wght@400;500;600;700&display=swap"
				/>
				<style dangerouslySetInnerHTML={{ __html: CSS }} />
			</head>
			<body>
				<header class="hdr">
					<div class="hdr-brand">
						<div class="hdr-icon">📡</div>
						<span class="hdr-title">finiweb</span>
					</div>
					<div class="hdr-divider" />
					<span class="hdr-sub">エンジニア向け情報収集ダッシュボード</span>
				</header>
				<div class="hdr-rule" />

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
									>
										<span class="dot" style={`background:${cat.accent}`} />
										{cat.label}
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
								<a
									href={a.url}
									target="_blank"
									rel="noopener noreferrer"
									class="item"
									style={`--accent:${CAT[a.category].accent}`}
								>
									<span class="item-title">{a.title}</span>
									<div class="item-meta">
										<span class="cat">
											<span
												class="dot"
												style={`background:${CAT[a.category].accent}`}
											/>
											{CAT[a.category].label}
										</span>
										<span class="source">{a.source}</span>
										{a.cvssScore !== undefined && (
											<span class="cvss">CVSS {a.cvssScore}</span>
										)}
										<span class="time">{fmtTime(a.publishedAt)}</span>
									</div>
								</a>
							))
						)}
					</div>
				</div>
			</body>
		</html>
	);
}
