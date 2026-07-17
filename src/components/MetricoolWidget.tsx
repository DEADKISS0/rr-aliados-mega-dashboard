"use client";
import { useState, useEffect, useCallback } from "react";

interface MetricRow {
  platform: string;
  followers?: string;
  posts?: number | string;
  engagement?: string;
  reach?: string;
}

interface MetricoolData {
  configured?: boolean;
  demo?: boolean;
  live?: boolean;
  message?: string;
  metrics: MetricRow[];
  cta?: { label?: string; docs?: string };
}

export default function MetricoolWidget() {
  const [data, setData] = useState<MetricoolData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const resp = await fetch("/api/metricool");
      setData(await resp.json());
    } catch {
      setData({
        configured: false,
        demo: true,
        metrics: [],
        message: "No se pudo cargar /api/metricool",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const metrics = data?.metrics ?? [];
  const isDemo = Boolean(data?.demo || !data?.live);

  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📱</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Metricool Analytics
        </h3>
        <span className={`skill-badge ${isDemo ? "demo" : "context"}`}>
          {data?.live ? "LIVE" : "Demo"}
        </span>
      </div>

      {isDemo && (
        <div className="banner-mock mb-3 flex flex-col gap-1">
          <span>{data?.message || "Sin token — no se inventan followers."}</span>
          {data?.cta?.docs && (
            <span className="font-mono-label text-[9px]" style={{ color: "var(--ash)" }}>
              {data.cta.label}: {data.cta.docs}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Cargando…
        </p>
      ) : metrics.length === 0 ? (
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: "var(--bg-secondary)", border: "1px dashed var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            0 plataformas conectadas. Añade <code>METRICOOL_API_TOKEN</code> en Vercel cuando esté listo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m, i) => (
            <div key={`${m.platform}-${i}`} className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {m.platform}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Followers
                  </span>
                  <br />
                  <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                    {m.followers ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Posts
                  </span>
                  <br />
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {m.posts ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Engagement
                  </span>
                  <br />
                  <span className="text-sm font-bold" style={{ color: "var(--success)" }}>
                    {m.engagement ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Reach
                  </span>
                  <br />
                  <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                    {m.reach ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
