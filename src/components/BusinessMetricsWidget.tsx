"use client";
import { useState, useEffect, useCallback } from "react";
import { STATS } from "@/data/skillsCatalog";
import { getMetrics, Metric } from "@/data/metricsCatalog";

export default function BusinessMetricsWidget() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [predRes, stratRes] = await Promise.all([
        fetch("/reports/predicciones_index.json").then(r => r.json()).catch(() => ({ reports: [] })),
        fetch("/reports/estrategicos_index.json").then(r => r.json()).catch(() => ({ reports: [] })),
      ]);
      const predReports = predRes.reports || [];
      const predCount = predReports.length;
      const predDates: string[] = predReports.map((r: { date?: string }) => r.date).filter(Boolean);
      const stratCount = stratRes.reports?.length || 0;
      setMetrics(
        getMetrics(predCount, stratCount, STATS.installed, STATS.total, {
          latestPredictionDate: predDates[0],
          predictionDates: predDates,
        })
      );
      setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setMetrics(getMetrics(0, 0, STATS.installed, STATS.total));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  return (
    <div className="card p-4 animate-in h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📈</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Métricas del Negocio
        </h3>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="ml-auto text-xs px-2 py-1 rounded transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}
          title="Actualizar"
        >
          ↻
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <div key={m.id} className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{m.icon}</span>
              {m.trend && (
                <span className="text-[10px]" style={{ color: m.trend === "up" ? "var(--success)" : m.trend === "down" ? "var(--danger)" : "var(--text-muted)" }}>
                  {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}
                </span>
              )}
            </div>
            <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</div>
            {m.subtitle && (
              <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{m.subtitle}</div>
            )}
            {m.trendValue && (
              <div className="text-[10px] mt-1" style={{ color: m.trend === "up" ? "var(--success)" : m.trend === "down" ? "var(--danger)" : "var(--text-muted)" }}>
                {m.trendValue}
              </div>
            )}
          </div>
        ))}
      </div>

      {lastUpdate && (
        <div className="mt-3 text-[10px] text-right" style={{ color: "var(--text-muted)" }}>
          Última actualización: {lastUpdate}
        </div>
      )}
    </div>
  );
}
