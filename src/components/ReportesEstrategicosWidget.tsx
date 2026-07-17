"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import ReportSelector from "@/components/ui/ReportSelector";

interface EstrategicoEntry {
  date: string;
  label?: string;
  pdf: string;
  excel: string;
  heuristic?: boolean;
  summary?: {
    progreso?: string;
    acciones?: number;
    urgentes?: number;
  };
}

export default function ReportesEstrategicosWidget() {
  const [reports, setReports] = useState<EstrategicoEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedReport = reports[selectedIndex] ?? null;

  const fetchReports = useCallback(() => {
    fetch("/reports/estrategicos_index.json")
      .then((r) => r.json())
      .then((data) => {
        const list: EstrategicoEntry[] = (data.reports || []).map((r: EstrategicoEntry) => ({
          ...r,
          heuristic: r.label?.toLowerCase().includes("heuríst") || false,
        }));
        setReports(list);
        setSelectedIndex(0);
        setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey, fetchReports]);

  if (loading && reports.length === 0) {
    return (
      <WidgetCard title="Optimización Estratégica" icon="🎯">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cargando reportes...</p>
      </WidgetCard>
    );
  }

  const archivedCount = Math.max(0, reports.length - 3);

  return (
    <WidgetCard
      title="Optimización Estratégica"
      icon="🎯"
      badge={archivedCount > 0 ? `${reports.length} (${archivedCount} arch.)` : `${reports.length} reportes`}
      badgeVariant="active"
      action={
        <button onClick={() => setRefreshKey((k) => k + 1)} className="btn-ghost !py-1 !px-2" title="Actualizar">
          ↻
        </button>
      }
    >
      {selectedReport?.heuristic && (
        <span className="skill-badge heuristic mb-2 inline-flex" title="Generado sin IA conectada">
          Modo heurístico
        </span>
      )}
      {!selectedReport?.heuristic && selectedReport && (
        <span className="skill-badge active mb-2 inline-flex">Generado con IA</span>
      )}

      <ReportSelector
        reports={reports}
        selectedDate={selectedReport?.date ?? null}
        onSelect={setSelectedIndex}
        maxRecent={3}
      />

      {selectedReport && (
        <div className="space-y-3">
          {selectedReport.pdf && (
            <iframe
              src={selectedReport.pdf}
              className="w-full rounded-lg border report-iframe"
              style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              title="Reporte Estratégico PDF"
            />
          )}

          <div className="flex gap-2 flex-wrap">
            {selectedReport.pdf && (
              <a href={selectedReport.pdf} download className="btn-primary text-xs">📄 PDF</a>
            )}
            {selectedReport.excel && (
              <a href={selectedReport.excel} download className="btn-primary text-xs" style={{ background: "var(--success)" }}>
                📊 Excel
              </a>
            )}
          </div>

          {selectedReport.summary && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Progreso", value: selectedReport.summary.progreso, color: "var(--ember)" },
                { label: "Acciones", value: selectedReport.summary.acciones, color: "var(--warning)" },
                { label: "Urgentes", value: selectedReport.summary.urgentes, color: "var(--danger)" },
              ].map((m) => (
                <div key={m.label} className="p-2 rounded text-center" style={{ background: "var(--bg-secondary)" }}>
                  <div className="text-lg font-bold" style={{ color: m.color }}>{m.value ?? "—"}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedReport && (
        <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
          <p className="text-sm mb-2">No hay reportes estratégicos generados aún.</p>
          <p className="text-xs font-mono-label">
            Regenerar vía MiroFish-Lite → luego <code>scripts/sync_reports.ps1</code>
          </p>
        </div>
      )}

      {lastUpdate && (
        <div className="mt-2 text-[10px] text-right font-mono-label" style={{ color: "var(--text-muted)" }}>
          Actualizado: {lastUpdate}
        </div>
      )}
    </WidgetCard>
  );
}
