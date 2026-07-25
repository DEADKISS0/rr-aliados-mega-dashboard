"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import RegenerarReportButton from "@/components/ui/RegenerarReportButton";
import ReportHistorySelector from "@/components/ui/ReportHistorySelector";
import type { ReportEntry } from "@/components/ui/ReportHistorySelector";

export default function ReportesEstrategicosWidget() {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchReports = useCallback(() => {
    fetch("/api/optimizacion-index")
      .then((r) => r.json())
      .then((data) => {
        const list: ReportEntry[] = (data.reports || []).map((r: ReportEntry) => ({
          ...r,
        }));
        setReports(list);
        setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReports();
    intervalRef.current = setInterval(fetchReports, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchReports]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchReports();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchReports, 5 * 60 * 1000);
  }, [fetchReports]);

  if (loading && reports.length === 0) {
    return (
      <WidgetCard title="Optimizacion Estrategica" icon="🎯">
        <div className="skeleton-ember h-8 w-40 mb-2" />
        <div className="skeleton-ember rounded-lg" style={{ height: 480 }} />
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Optimizacion Estrategica"
      icon="🎯"
      badge={reports.length > 0 ? `${reports.length} versiones` : "Sin datos"}
      badgeVariant={reports.length > 0 ? "active" : "support"}
      action={
        <div className="flex items-center gap-1">
          <RegenerarReportButton variant="optimizacion" />
          <button
            onClick={handleRefresh}
            className="btn-ghost !py-1 !px-2"
            title="Actualizar"
            aria-label="Actualizar optimizacion"
          >
            ↻
          </button>
        </div>
      }
    >
      {loading && reports.length > 0 && (
        <div className="text-[10px] text-center py-1 mb-1 animate-pulse" style={{ color: "var(--ember)" }}>
          Actualizando...
        </div>
      )}
      {reports.length === 0 ? (
        <div className="py-4 text-center" style={{ color: "var(--text-muted)" }}>
          <p className="text-xs mb-2">Sin reportes de optimizacion. Genera con MiroFish-Lite.</p>
          <RegenerarReportButton variant="optimizacion" />
        </div>
      ) : (
        <ReportHistorySelector
          reports={reports}
          maxItems={5}
          variantName="Optimizacion Estrategica"
          renderSummary={(report) => {
            const s = report.summary as Record<string, number | undefined>;
            if (!s) return null;
            const items = [
              { label: "Score", value: s.health_score, color: "var(--success)" },
              { label: "Riesgos", value: s.risks, color: "var(--danger)" },
              { label: "Oport.", value: s.opportunities, color: "var(--amber)" },
              { label: "Acciones", value: s.next_actions, color: "var(--ember)" },
            ];
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-2">
                {items.map((m) => (
                  <div
                    key={m.label}
                    className="py-1.5 px-1 rounded text-center"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
                  >
                    <div className="font-display text-base leading-none" style={{ color: m.color }}>
                      {m.value ?? "--"}
                    </div>
                    <div className="text-[9px] mt-0.5 font-mono-label" style={{ color: "var(--text-muted)" }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        />
      )}
    </WidgetCard>
  );
}