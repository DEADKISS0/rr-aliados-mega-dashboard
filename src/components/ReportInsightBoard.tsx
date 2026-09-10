"use client";

import { useEffect, useMemo, useState } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

type Action = {
  id: string;
  title: string;
  status: string;
  evidence?: string[];
};

type ProgressPoint = {
  at?: string;
  progress_pct?: number;
  jump_alert?: { type?: string; reason?: string; from?: number; attempted?: number } | null;
};

const STATUS_BUCKETS: { key: string; label: string; match: (s: string, evidence: number) => boolean }[] = [
  {
    key: "pending",
    label: "Pendiente",
    match: (s, evidence) =>
      ["PENDING_NO_EVIDENCE", "PROPOSED"].includes(s) || (s === "CREATED" && evidence === 0),
  },
  {
    key: "evidence",
    label: "Con evidencia",
    match: (s, evidence) => evidence > 0 && !["DONE", "CLOSED"].includes(s),
  },
  { key: "blocked", label: "Bloqueada", match: (s) => s === "BLOCKED" },
  { key: "closed", label: "Cerrada", match: (s) => s === "DONE" || s === "CLOSED" },
];

export default function ReportInsightBoard() {
  const [actions, setActions] = useState<Action[]>([]);
  const [progress, setProgress] = useState<ProgressPoint[]>([]);
  const [charts, setCharts] = useState<string[]>([]);
  const [research, setResearch] = useState<{ status: string; detail: string } | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/action-proposals", { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
      fetch("/data/mirofish/progress_history.json", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("/data/mirofish/charts_index.json", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("/api/automation", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
    ]).then(([ledger, hist, chartsIdx, automation]) => {
      setActions(Array.isArray(ledger.actions) ? ledger.actions : []);
      setUpdatedAt(ledger.updatedAt ?? null);
      const history = Array.isArray(hist?.history) ? hist.history : Array.isArray(hist) ? hist : [];
      setProgress(history.slice(-8));
      setCharts(Array.isArray(chartsIdx?.charts) ? chartsIdx.charts.map((c: { url?: string }) => c.url).filter(Boolean) : []);
      const researchJob = automation?.jobs?.find(
        (j: { id?: string; name?: string; status?: string; detail?: string }) =>
          j.id === "investigacion" || (j.name || "").toLowerCase().includes("investig")
      );
      if (researchJob) {
        setResearch({
          status: researchJob.status,
          detail: researchJob.detail || researchJob.name,
        });
      } else {
        setResearch({ status: "unknown", detail: "Investigación continua no cableada o sin corrida reciente." });
      }
    });
  }, []);

  const matrix = useMemo(() => {
    return STATUS_BUCKETS.map((bucket) => ({
      ...bucket,
      items: actions.filter((a) => bucket.match(a.status, a.evidence?.length ?? 0)),
    }));
  }, [actions]);

  const jumpAlerts = progress.filter((p) => p.jump_alert);

  return (
    <WidgetCard
      title="Tablero de lectura rápida"
      icon="▦"
      badge="Reportes estructurados"
      badgeVariant="context"
    >
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        Matriz de recomendaciones, progreso estratégico y señales. Cada dato indica categoría; no confundir
        actividad documental con tareas CRM.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {matrix.map((bucket) => (
          <div
            key={bucket.key}
            className="rounded p-2"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="font-mono-label text-[10px]" style={{ color: "var(--text-muted)" }}>
              {bucket.label}
            </div>
            <div className="font-display text-2xl" style={{ color: "var(--text-primary)" }}>
              {bucket.items.length}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="font-mono-label text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
          Progreso estratégico (método ponderado) · fuente: metrics_store
        </div>
        <div className="flex items-end gap-1 h-16">
          {progress.length === 0 && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Sin historial de progreso publicado aún.
            </span>
          )}
          {progress.map((point, idx) => {
            const pct = Number(point.progress_pct ?? 0);
            return (
              <div key={`${point.at}-${idx}`} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max(8, pct)}%`,
                    minHeight: 8,
                    background: point.jump_alert ? "var(--warning)" : "var(--ember)",
                  }}
                  title={`${pct}%${point.jump_alert ? " · alerta de salto" : ""}`}
                />
                <span className="font-mono-label text-[9px]" style={{ color: "var(--text-muted)" }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
        {jumpAlerts.length > 0 && (
          <p className="text-xs mt-2" style={{ color: "var(--warning)" }}>
            Alerta de salto: {jumpAlerts[jumpAlerts.length - 1].jump_alert?.reason}
          </p>
        )}
      </div>

      {charts.length > 0 && (
        <div className="mb-3">
          <div className="font-mono-label text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
            Gráficos MiroFish (JSON/assets) · categoría: actividad documental
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {charts.slice(0, 6).map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="Chart MiroFish" className="rounded border" style={{ borderColor: "var(--border-subtle)" }} />
            ))}
          </div>
        </div>
      )}

      <div
        className="rounded p-2 text-xs"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
      >
        <strong style={{ color: "var(--text-primary)" }}>Investigación continua:</strong>{" "}
        <span style={{ color: research?.status === "ok" ? "var(--success)" : "var(--warning)" }}>
          {research?.status === "ok"
            ? "Feed de evidencia disponible"
            : research?.status === "error"
              ? "Estado degradado (error de proveedor)"
              : "Sin insight — estado degradado o no configurado"}
        </span>
        <div className="font-mono-label text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
          {research?.detail}
          {updatedAt ? ` · ledger ${new Date(updatedAt).toLocaleString("es-CO")}` : ""}
        </div>
      </div>
    </WidgetCard>
  );
}
