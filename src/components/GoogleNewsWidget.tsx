"use client";
import { useState, useEffect, useCallback } from "react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  link: string;
  relative?: string;
  query: string;
}

interface NewsFeed {
  demo?: boolean;
  source?: string;
  message?: string;
  items: NewsItem[];
  queries?: string[];
  updatedAt?: string;
}

const FILTERS = [
  { id: "all", label: "todas", q: null as string | null },
  { id: "tech", label: "tecnología", q: "posicionamiento digital Colombia|IA marketing Colombia" },
  { id: "brand", label: "marca", q: "RR ALIADOS" },
  { id: "local", label: "Medellín", q: "startups Medellín" },
];

export default function GoogleNewsWidget() {
  const [filter, setFilter] = useState("all");
  const [feed, setFeed] = useState<NewsFeed | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (filterId: string) => {
    setLoading(true);
    try {
      const f = FILTERS.find((x) => x.id === filterId);
      const qs = f?.q ? `?q=${encodeURIComponent(f.q)}` : "";
      const resp = await fetch(`/api/news${qs}`);
      const data = await resp.json();
      setFeed(data);
    } catch {
      setFeed(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const items = feed?.items ?? [];
  const isDemo = Boolean(feed?.demo);

  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📰</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Google News Monitor
        </h3>
        <span className={`skill-badge ${isDemo ? "demo" : "context"}`}>
          {isDemo ? "Demo" : feed?.source === "live-rss" ? "LIVE" : "Cache"}
        </span>
      </div>

      {isDemo && (
        <div className="banner-mock mb-3">
          {feed?.message || "Sin feed. Ejecuta scripts/sync_news.ps1 o verifica /api/news."}
        </div>
      )}

      <div className="flex gap-2 mb-3 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{
              background: filter === f.id ? "var(--accent)" : "var(--bg-secondary)",
              color: filter === f.id ? "white" : "var(--text-secondary)",
            }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Cargando noticias…
        </p>
      ) : (
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Sin resultados para este filtro.
            </p>
          ) : (
            items.map((n) => (
              <a
                key={n.id}
                href={n.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 p-2 rounded block hover:opacity-90"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div className="pulse-dot mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {n.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {n.source}
                    {n.relative ? ` · hace ${n.relative}` : ""}
                    {n.query ? ` · ${n.query}` : ""}
                  </p>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {feed?.updatedAt && (
        <div className="mt-2 text-[10px] text-right" style={{ color: "var(--text-muted)" }}>
          Sync: {new Date(feed.updatedAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
        </div>
      )}
    </div>
  );
}
