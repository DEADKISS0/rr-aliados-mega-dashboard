"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

interface GAData {
  configured?: boolean;
  live?: boolean;
  demo?: boolean;
  message?: string;
  error?: string;
  cta?: { label?: string; docs?: string };
  realTime: { activeUsers: number; pageViews: number; sessions: number };
  today: { users: number; pageViews: number; sessions: number; bounceRate: string; avgSessionDuration: number };
  topPages: { page: string; views: number; percentage: string }[];
  trafficSources: { source: string; percentage: string }[];
}

export default function GoogleAnalyticsWidget() {
  const [data, setData] = useState<GAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch("/api/analytics");
      const result = await resp.json();
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      console.error("Error fetching analytics:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey, fetchData]);

  if (loading) {
    return (
      <WidgetCard title="Google Analytics" icon="📊">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cargando analytics...</p>
      </WidgetCard>
    );
  }

  if (!data) return null;

  const isLive = Boolean(data.live && !data.demo);

  return (
    <WidgetCard
      title="Google Analytics"
      icon="📊"
      badge={isLive ? "LIVE" : "DEMO"}
      badgeVariant="support"
      action={
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="btn-ghost !py-1 !px-2"
          title="Actualizar"
        >
          ↻
        </button>
      }
    >
      {!isLive && (
        <div className="banner-mock mb-3 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span>⚠️ {data.message || "DEMO — Conecta GA4 en Vercel"}</span>
            <span className="skill-badge demo">Mock</span>
          </div>
          {data.cta?.docs && (
            <span className="font-mono-label text-[9px]" style={{ color: "var(--ash)" }}>
              {data.cta.label}: {data.cta.docs}
            </span>
          )}
          {data.error && (
            <span className="font-mono-label text-[9px]" style={{ color: "var(--danger)" }}>
              {data.error}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--ember)" }}>{data.realTime.activeUsers}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Activos ahora</div>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--success)" }}>{data.realTime.pageViews}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Vistas hoy</div>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--warning)" }}>{data.realTime.sessions}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Sesiones</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>Hoy</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            {data.today.users} usuarios · {data.today.pageViews} vistas
          </div>
        </div>
        <div className="p-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>Engagement</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Rebote: {data.today.bounceRate} · Duración:{" "}
            {data.today.avgSessionDuration
              ? `${Math.floor(data.today.avgSessionDuration / 60)}m`
              : "—"}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Páginas Top</div>
        {data.topPages.slice(0, 3).map((p, i) => (
          <div key={`${p.page}-${i}`} className="flex items-center gap-2 text-[11px] mb-1">
            <span style={{ color: "var(--text-muted)" }}>{i + 1}.</span>
            <span className="flex-1 truncate" style={{ color: "var(--text-primary)" }}>{p.page}</span>
            <span style={{ color: "var(--text-muted)" }}>{p.percentage}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Fuentes</div>
        <div className="flex gap-2 flex-wrap">
          {data.trafficSources.map((s, i) => (
            <div
              key={`${s.source}-${i}`}
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: "var(--border)", color: "var(--text-secondary)" }}
            >
              {s.source} {s.percentage}
            </div>
          ))}
        </div>
      </div>

      {lastUpdate && (
        <div className="mt-2 text-[10px] text-right" style={{ color: "var(--text-muted)" }}>
          Última actualización: {lastUpdate}
          {isLive ? " · GA4 Data API" : ""}
        </div>
      )}
    </WidgetCard>
  );
}
