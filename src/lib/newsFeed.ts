import { promises as fs } from "fs";
import path from "path";

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  link: string;
  publishedAt?: string;
  relative?: string;
  query: string;
}

export interface NewsFeed {
  updatedAt: string;
  source: "live-rss" | "cache" | "demo";
  demo: boolean;
  items: NewsItem[];
  queries: string[];
  message?: string;
}

export const DEFAULT_NEWS_QUERIES = [
  "RR ALIADOS",
  "posicionamiento digital Colombia",
  "IA marketing Colombia",
  "startups Medellín",
];

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diffH = Math.max(0, Math.round((Date.now() - t) / 3_600_000));
  if (diffH < 1) return "<1h";
  if (diffH < 24) return `${diffH}h`;
  const d = Math.round(diffH / 24);
  return `${d}d`;
}

function parseRssItems(xml: string, query: string): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const block of blocks.slice(0, 6)) {
    const title = stripHtml((block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "");
    const link = stripHtml((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "");
    const source =
      stripHtml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1] || "") ||
      "Google News";
    const pub =
      stripHtml((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "") || undefined;
    const publishedAt = pub ? new Date(pub).toISOString() : undefined;
    if (!title) continue;
    items.push({
      id: `${query}-${Buffer.from(title).toString("base64url").slice(0, 16)}`,
      title,
      source,
      link,
      publishedAt,
      relative: relativeTime(publishedAt),
      query,
    });
  }
  return items;
}

export async function fetchGoogleNewsRss(queries: string[] = DEFAULT_NEWS_QUERIES): Promise<NewsItem[]> {
  const all: NewsItem[] = [];
  const seen = new Set<string>();

  await Promise.all(
    queries.map(async (q) => {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=es-419&gl=CO&ceid=CO:es`;
      try {
        const resp = await fetch(url, {
          headers: { "User-Agent": "RR-Aliados-MegaDashboard/1.0" },
          cache: "no-store",
        });
        if (!resp.ok) return;
        const xml = await resp.text();
        for (const item of parseRssItems(xml, q)) {
          const key = item.title.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          all.push(item);
        }
      } catch {
        /* skip query */
      }
    })
  );

  return all
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
    .slice(0, 12);
}

export async function readNewsCache(): Promise<NewsFeed | null> {
  try {
    const full = path.join(process.cwd(), "public", "data", "news_feed.json");
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as NewsFeed;
  } catch {
    return null;
  }
}

export function buildNewsDemo(): NewsFeed {
  return {
    updatedAt: new Date().toISOString(),
    source: "demo",
    demo: true,
    queries: DEFAULT_NEWS_QUERIES,
    message: "News DEMO — RSS no disponible. Ejecuta scripts/sync_news.ps1 o espera /api/news live.",
    items: [
      {
        id: "demo-1",
        title: "Configura sync de noticias para monitoreo de marca RR ALIADOS",
        source: "Mega Dashboard",
        link: "https://rr-aliados-mega-dashboard.vercel.app",
        relative: "—",
        query: "RR ALIADOS",
      },
    ],
  };
}
