"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import ReportSelector from "@/components/ui/ReportSelector";
import RegenerarReportButton from "@/components/ui/RegenerarReportButton";
import ReportViewer from "@/components/ui/ReportViewer";

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
    quality?: "verified" | "rejected";
    mode?: "ai_verified" | "deterministic_evidence";
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
          heuristic: r.summary?.quality === "rejected" || r.label?.toLowerCase().includes("heuríst") || false,
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
        <div className="skeleton-ember h-8 w-48 mb-3" />
        <div className="skeleton-ember rounded-lg" style={{ height: 480 }} />
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
        <div className="flex items-center gap-1">
          <RegenerarReportButton variant="estrategicos" />
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="btn-ghost !py-1 !px-2"
            title="Actualizar"
            aria-label="Actualizar reportes estratégicos"
          >
            ↻
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {selectedReport?.heuristic ? (
          <span className="skill-badge heuristic">Heurístico</span>
        ) : selectedReport?.summary?.mode === "deterministic_evidence" ? (
          <span className="skill-badge context">Evidencia verificable</span>
        ) : selectedReport ? (
          <span className="skill-badge active">IA</span>
        ) : null}
        <span className="font-mono-label text-[10px]" style={{ color: "var(--text-muted)" }}>
          {selectedReport?.label || "Sin reporte"}
          {lastUpdate ? ` · ${lastUpdate}` : ""}
        </span>
      </div>

      <ReportSelector
        reports={reports}
        selectedDate={selectedReport?.date ?? null}
        onSelect={setSelectedIndex}
        maxRecent={3}
      />

      {selectedReport?.summary && (
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { label: "Progreso", value: selectedReport.summary.progreso, color: "var(--ember)" },
            { label: "Acciones", value: selectedReport.summary.acciones, color: "var(--warning)" },
            { label: "Urgentes", value: selectedReport.summary.urgentes, color: "var(--danger)" },
          ].map((m) => (
            <div
              key={m.label}
              className="py-1.5 px-1 rounded text-center"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="font-display text-base leading-none" style={{ color: m.color }}>
                {m.value ?? "—"}
              </div>
              <div className="text-[9px] mt-0.5 font-mono-label" style={{ color: "var(--text-muted)" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport && (
        <ReportViewer
          key={selectedReport.date}
          pdf={selectedReport.pdf}
          excel={selectedReport.excel}
          title={`Estratégico ${selectedReport.label || selectedReport.date}`}
          defaultOpen
        />
      )}

      {!selectedReport && (
        <div className="py-4 text-center" style={{ color: "var(--text-muted)" }}>
          <p className="text-xs mb-2">No hay reportes estratégicos aún.</p>
          <RegenerarReportButton variant="estrategicos" />
        </div>
      )}
    </WidgetCard>
  );
}
