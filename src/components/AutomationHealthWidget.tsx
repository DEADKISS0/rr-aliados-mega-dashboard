"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

interface AutomationJob {
  id: string;
  name: string;
  status: "ok" | "warning" | "error" | "unknown";
  lastRun?: string;
  detail: string;
}

interface AutomationData {
  jobs: AutomationJob[];
  summary: { ok: number; warning: number; error: number; total: number };
}

const statusColors: Record<string, string> = {
  ok: "var(--success)",
  warning: "var(--warning)",
  error: "var(--danger)",
  unknown: "var(--text-muted)",
};

const statusLabels: Record<string, string> = {
  ok: "OK",
  warning: "!",
  error: "Err",
  unknown: "—",
};

export default function AutomationHealthWidget() {
  const [data, setData] = useState<AutomationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch("/api/automation");
      setData(await resp.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [refreshKey, fetchData]);

  if (loading) {
    return (
      <WidgetCard title="Automatizaciones" icon="⚙️" badge="Ops">
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          Cargando…
        </p>
      </WidgetCard>
    );
  }

  if (!data) return null;

  return (
    <WidgetCard
      title="Salud de Automatizaciones"
      icon="⚙️"
      badge={`${data.summary.ok}/${data.summary.total}`}
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
      <div className="flex gap-2 mb-2">
        {[
          { label: "OK", value: String(data.summary.ok), color: "var(--success)" },
          { label: "Revisar", value: String(data.summary.warning), color: "var(--warning)" },
          { label: "Err", value: String(data.summary.error), color: "var(--danger)" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 px-2 py-1 rounded text-center"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <span className="font-display text-sm" style={{ color: s.color }}>
              {s.value}
            </span>
            <span className="font-mono-label text-[9px] ml-1" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {data.jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center gap-2 px-2 py-1 rounded"
            style={{ background: "var(--bg-secondary)" }}
            title={job.detail}
          >
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[job.status] }} />
            <span className="text-[11px] truncate flex-1" style={{ color: "var(--text-primary)" }}>
              {job.name}
            </span>
            <span
              className="text-[9px] font-mono-label shrink-0"
              style={{ color: statusColors[job.status] }}
            >
              {statusLabels[job.status]}
            </span>
            {job.lastRun && (
              <span className="text-[9px] font-mono-label shrink-0 hidden md:inline" style={{ color: "var(--ash)" }}>
                {job.lastRun}
              </span>
            )}
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
