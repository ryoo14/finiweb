/** @jsxImportSource hono/jsx */
import type { Article, Category } from "../types.ts";

const CATEGORIES: {
  id: Category;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { id: "security", label: "Security", emoji: "🔴", color: "#e85555" },
  { id: "cloud", label: "Cloud", emoji: "☁️", color: "#4488ff" },
  { id: "oss", label: "OSS", emoji: "📦", color: "#44aa55" },
  { id: "infra", label: "Infra", emoji: "🔧", color: "#ff8844" },
  { id: "dev", label: "Dev", emoji: "💻", color: "#9955ff" },
  { id: "news", label: "News", emoji: "📰", color: "#888888" },
];

const COLOR: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.color]),
) as Record<Category, string>;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f0f13;color:#ddd;min-height:100vh}
a{color:inherit;text-decoration:none}
.hdr{background:#15151e;border-bottom:1px solid #252535;padding:14px 24px;display:flex;align-items:center;gap:12px}
.hdr-title{font-size:18px;font-weight:700;color:#fff}
.hdr-sub{font-size:12px;color:#666}
.wrap{max-width:960px;margin:0 auto;padding:20px 24px}
.ctrl{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;align-items:center}
.date-sel{background:#1a1a26;border:1px solid #2a2a3c;color:#ddd;padding:6px 10px;border-radius:6px;font-size:13px;cursor:pointer}
.tabs{display:flex;gap:6px;flex-wrap:wrap}
.tab{padding:4px 12px;border-radius:14px;border:1px solid #2a2a3c;background:#1a1a26;color:#888;font-size:12px;cursor:pointer}
.tab:hover{color:#ccc;border-color:#3a3a4c}
.tab.on{color:#fff;border-color:#4a4a6a;background:#252535}
.cnt{font-size:12px;color:#555;margin-left:auto}
.list{display:flex;flex-direction:column;gap:2px}
.item{background:#15151e;padding:10px 14px;border-radius:6px;display:flex;flex-direction:column;gap:5px}
.item:hover{background:#1a1a26}
.item-title{font-size:14px;line-height:1.45;color:#ddd}
.item-title:hover{color:#fff;text-decoration:underline}
.item-meta{display:flex;gap:8px;align-items:center;font-size:11px;color:#555;flex-wrap:wrap}
.badge{padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;color:#fff}
.cvss{background:#c0392b;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;color:#fff}
.empty{text-align:center;color:#444;padding:60px;font-size:14px}
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
  return `${d.getMonth() + 1}/${d.getDate()} ${
    String(d.getHours()).padStart(2, "0")
  }:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function Dashboard(
  { articles, selectedDate, selectedCategory, dates }: Props,
) {
  const allDates = dates.includes(selectedDate)
    ? dates
    : [selectedDate, ...dates];

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>finiweb</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>
        <div class="hdr">
          <span class="hdr-title">📡 finiweb</span>
          <span class="hdr-sub">インフラSE向け情報収集ダッシュボード</span>
        </div>
        <div class="wrap">
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
                  style={selectedCategory === cat.id
                    ? `border-color:${cat.color};color:${cat.color}`
                    : ""}
                >
                  {cat.emoji} {cat.label}
                </a>
              ))}
            </div>
            <span class="cnt">{articles.length} 件</span>
          </div>

          <div class="list">
            {articles.length === 0
              ? <div class="empty">この日の記事はまだありません</div>
              : (
                articles.map((a) => (
                  <div class="item">
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
                        style={`background:${COLOR[a.category]}`}
                      >
                        {a.category}
                      </span>
                      <span>{a.source}</span>
                      {a.cvssScore !== undefined && (
                        <span class="cvss">CVSS {a.cvssScore}</span>
                      )}
                      <span>{fmtTime(a.publishedAt)}</span>
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
