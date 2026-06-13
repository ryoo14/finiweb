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

/* Date nav */
.date-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}
.date-nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid var(--line);
  background: var(--card);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: border-color .15s, background .15s;
  flex-shrink: 0;
  user-select: none;
}
.date-nav-btn:hover { border-color: var(--mid); background: var(--line) }
.date-nav-btn.off { opacity: .3; pointer-events: none }
.date-nav-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 96px;
  cursor: pointer;
}
.date-nav-label:hover .date-nav-date {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.date-nav-date {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}

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
  margin-top: auto;
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

/* ── Calendar popover ── */
.cal-wrap { position: relative }
.cal {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg);
  border: 1.5px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(41,47,54,.13);
  padding: 14px;
  z-index: 200;
  min-width: 234px;
}
.cal.open { display: block }
.cal-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.cal-month { font-size: 13px; font-weight: 700; color: var(--ink) }
.cal-nav {
  width: 28px; height: 28px;
  border-radius: 7px;
  border: 1.5px solid var(--line);
  background: var(--card);
  color: var(--ink);
  cursor: pointer;
  font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  transition: border-color .15s;
}
.cal-nav:hover { border-color: var(--mid) }
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.cal-dow {
  font-size: 10px; font-weight: 600; color: var(--mid);
  text-align: center; padding: 4px 0;
}
.cal-day {
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; border-radius: 6px;
  color: var(--line);
}
.cal-day.has {
  color: var(--ink); font-weight: 600; cursor: pointer;
  text-decoration: none;
}
.cal-day.has:hover { background: var(--card) }
.cal-day.sel { background: var(--ink) !important; color: var(--bg) }
.cal-day.today { outline: 1.5px solid var(--teal-deep); outline-offset: -1.5px }
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
	const d = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
	return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
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

	const sortedDates = [...allDates].sort((a, b) => b.localeCompare(a)); // desc
	const idx = sortedDates.indexOf(selectedDate);
	const prevDate = idx < sortedDates.length - 1 ? sortedDates[idx + 1] : null;
	const nextDate = idx > 0 ? sortedDates[idx - 1] : null;
	const catQuery = selectedCategory ? `?category=${selectedCategory}` : "";

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
							<div class="date-nav">
								{prevDate ? (
									<a href={`/date/${prevDate}${catQuery}`} class="date-nav-btn">
										‹
									</a>
								) : (
									<span class="date-nav-btn off">‹</span>
								)}
								<div class="cal-wrap">
									<div class="date-nav-label" id="cal-trigger">
										<span class="date-nav-date">{fmtDate(selectedDate)}</span>
									</div>
									<div class="cal" id="cal" />
								</div>
								{nextDate ? (
									<a href={`/date/${nextDate}${catQuery}`} class="date-nav-btn">
										›
									</a>
								) : (
									<span class="date-nav-btn off">›</span>
								)}
							</div>

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
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){
  var DATES=new Set(${JSON.stringify(sortedDates)});
  var SEL=${JSON.stringify(selectedDate)};
  var CAT=${JSON.stringify(catQuery)};
  var trigger=document.getElementById('cal-trigger');
  var cal=document.getElementById('cal');
  var open=false;
  var vY=+SEL.slice(0,4), vM=+SEL.slice(5,7)-1;
  function pad(n){return String(n).padStart(2,'0')}
  function toISO(y,m,d){return y+'-'+pad(m+1)+'-'+pad(d)}
  function todayISO(){var n=new Date(Date.now()+9*3600000);return n.toISOString().slice(0,10)}
  var DOW=['日','月','火','水','木','金','土'];
  var MON=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  function render(){
    var today=todayISO();
    var fd=new Date(vY,vM,1).getDay();
    var dim=new Date(vY,vM+1,0).getDate();
    var h='<div class="cal-hdr"><button class="cal-nav" id="cp">‹</button><span class="cal-month">'+vY+'年'+MON[vM]+'</span><button class="cal-nav" id="cn">›</button></div><div class="cal-grid">';
    for(var i=0;i<7;i++)h+='<div class="cal-dow">'+DOW[i]+'</div>';
    for(var i=0;i<fd;i++)h+='<div class="cal-day"></div>';
    for(var d=1;d<=dim;d++){
      var iso=toISO(vY,vM,d);
      var cls='cal-day'+(DATES.has(iso)?' has':'')+(iso===SEL?' sel':'')+(iso===today?' today':'');
      h+=DATES.has(iso)&&iso!==SEL
        ?'<a class="'+cls+'" href="/date/'+iso+CAT+'">'+d+'</a>'
        :'<div class="'+cls+'">'+d+'</div>';
    }
    cal.innerHTML=h+'</div>';
    document.getElementById('cp').onclick=function(e){e.stopPropagation();vM--;if(vM<0){vM=11;vY--;}render();};
    document.getElementById('cn').onclick=function(e){e.stopPropagation();vM++;if(vM>11){vM=0;vY++;}render();};
  }
  trigger.onclick=function(e){e.stopPropagation();if(open){cal.classList.remove('open');open=false;}else{render();cal.classList.add('open');open=true;}};
  document.addEventListener('click',function(e){if(open&&!cal.contains(e.target)){cal.classList.remove('open');open=false;}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){cal.classList.remove('open');open=false;}});
})();`,
					}}
				/>
			</body>
		</html>
	);
}
