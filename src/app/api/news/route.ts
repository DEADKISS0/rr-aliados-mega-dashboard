import { NextRequest, NextResponse } from "next/server";
import {
  buildNewsDemo,
  DEFAULT_NEWS_QUERIES,
  fetchGoogleNewsRss,
  readNewsCache,
  type NewsFeed,
} from "@/lib/newsFeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const qParam = request.nextUrl.searchParams.get("q");
    const queries = qParam
      ? qParam.split("|").map((s) => s.trim()).filter(Boolean)
      : DEFAULT_NEWS_QUERIES;

    // Prefer live RSS
    try {
      const items = await fetchGoogleNewsRss(queries);
      if (items.length > 0) {
        const feed: NewsFeed = {
          updatedAt: new Date().toISOString(),
          source: "live-rss",
          demo: false,
          queries,
          items,
        };
        return NextResponse.json(feed);
      }
    } catch {
      /* fall through */
    }

    const cache = await readNewsCache();
    if (cache?.items?.length) {
      return NextResponse.json({
        ...cache,
        source: "cache" as const,
        demo: Boolean(cache.demo),
        message: cache.message || "Sirviendo cache public/data/news_feed.json",
      });
    }

    return NextResponse.json(buildNewsDemo());
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
