"use client";
import { useState, useEffect, useCallback } from "react";

interface LiveTask {
  id: string;
  name: string;
  schedule: string;
  status: "success" | "failure" | "pending" | "unknown";
  lastRun?: string;
}

const statusColors: Record<string, string> = {
  success: "var(--success)",
  failure: "var(--danger)",
  pending: "var(--warning)",
  unknown: "var(--text-muted)",
};

const statusLabels: Record<string, string> = {
  success: "OK",
  failure: "Err",
  pending: "!",
  unknown: "—",
};

const SCHEDULES: Record<string, string> = {
  "mirofish-daily": "05:00 / 17:00",
  strategic: "05:00 / 17:00",
  "reports-sync": "post-gen",
  "skills-sync": "pre-deploy",
  "vercel-deploy": "post-sync",
};

function mapStatus(s: string): LiveTask["status"] {
  if (s === "ok") return "success";
  if (s === "error") return "failure";
  if (s === "warning") return "pending";
  return "unknown";
}

export default function TaskMonitorWidget() {
  const [tasks, setTasks] = useState<LiveTask[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const resp = await fetch("/api/automation");
      const data = await resp.json();
      const jobs = (data.jobs ?? []) as Array<{
        id: string;
        name: string;
        status: string;
        lastRun?: string;
      }>;
      // Solo jobs de reportes/sync — excluir pings de ecosistema para densidad
      const core = jobs.filter(
        (j) =>
          !["cotizador", "skills-hub", "adq-talentos", "altruismo", "saas-vertical", "dashweb", "company-hub"].includes(
            j.id
          )
      );
      setTasks(
        core.map((j) => ({
          id: j.id,
          name: j.name,
          schedule: SCHEDULES[j.id] ?? "auto",
          status: mapStatus(j.status),
          lastRun: j.lastRun,
        }))
      );
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="card p-3 animate-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">⚙️</span>
        <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
          Tareas
        </h3>
        <span className="ml-auto text-[9px] font-mono-label" style={{ color: "var(--text-muted)" }}>
          {tasks.length}
        </span>
      </div>

      {loading ? (
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          Cargando…
        </p>
      ) : (
        <div className="space-y-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 px-1.5 py-1 rounded"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColors[task.status] }} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate leading-tight" style={{ color: "var(--text-primary)" }}>
                  {task.name}
                </div>
                <div className="text-[9px] truncate leading-tight" style={{ color: "var(--text-muted)" }}>
                  {task.schedule}
                  {task.lastRun ? ` · ${task.lastRun}` : ""}
                </div>
              </div>
              <span
                className="text-[9px] px-1 py-0.5 rounded shrink-0 font-mono-label"
                style={{
                  background: `${statusColors[task.status]}20`,
                  color: statusColors[task.status],
                }}
              >
                {statusLabels[task.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
