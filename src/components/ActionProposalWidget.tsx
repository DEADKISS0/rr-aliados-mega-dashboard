"use client";

import { useCallback, useEffect, useState } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

type ActionProposal = {
  id: string;
  title: string;
  rationale?: string;
  priority_proposed?: string;
  due_date_proposed?: string;
  area?: string;
  status: string;
  evidence?: string[];
  dashweb_project_id?: string;
  dashweb_task_id?: string;
};

const statusLabel: Record<string, string> = {
  PENDING_NO_EVIDENCE: "Pendiente sin evidencia",
  PROPOSED: "Propuesta",
  CREATED: "Creada en DashWeb",
  MATCHED: "Vinculada a tarea",
  DONE: "Terminada con evidencia",
  BLOCKED: "Bloqueada",
  CLOSED: "Cerrada",
};

const OPEN_STATUSES = new Set(["PENDING_NO_EVIDENCE", "PROPOSED", "BLOCKED"]);

export default function ActionProposalWidget() {
  const [actions, setActions] = useState<ActionProposal[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/action-proposals", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setActions([]);
        setUpdatedAt(null);
        setLoadError(
          typeof payload.error === "string"
            ? payload.error
            : `No se pudo cargar el ledger (HTTP ${response.status}).`
        );
        return;
      }
      const all = Array.isArray(payload.actions) ? (payload.actions as ActionProposal[]) : [];
      const open = all.filter((action) => OPEN_STATUSES.has(action.status));
      setActions(open);
      setUpdatedAt(payload.updatedAt ?? null);
      setLoadError(null);
    } catch {
      setActions([]);
      setUpdatedAt(null);
      setLoadError("Error de red al consultar /api/action-proposals.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <WidgetCard
      title="Propuestas de Acción"
      icon="🧭"
      badge={`${actions.length} pendientes`}
      badgeVariant="context"
      action={
        <button onClick={load} className="btn-ghost !py-1 !px-2" aria-label="Actualizar propuestas">
          ↻
        </button>
      }
    >
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        Cola de solo lectura. DashWeb Core es la fuente de tareas; cada propuesta requiere elegir proyecto y confirmar antes de crearla.
      </p>
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {actions.map((action) => (
          <article
            key={action.id}
            className="rounded p-3"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="flex justify-between gap-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {action.title}
              </h3>
              <span className="skill-badge warning whitespace-nowrap">
                {statusLabel[action.status] ?? action.status}
              </span>
            </div>
            {action.rationale && (
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                {action.rationale}
              </p>
            )}
            <div className="font-mono-label text-[10px] mt-2 flex flex-wrap gap-x-3 gap-y-1" style={{ color: "var(--text-muted)" }}>
              <span>Área: {action.area || "Por definir"}</span>
              <span>Prioridad propuesta: {action.priority_proposed || "media"}</span>
              <span>Fecha propuesta: {action.due_date_proposed || "Por decidir"}</span>
              <span>Evidencia: {action.evidence?.length ?? 0}</span>
            </div>
          </article>
        ))}
        {!actions.length && (
          <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
            {loadError || "Aún no hay acciones publicadas por un reporte estratégico válido."}
          </p>
        )}
      </div>
      {updatedAt && (
        <p className="font-mono-label text-[10px] mt-3 text-right" style={{ color: "var(--text-muted)" }}>
          Ledger actualizado: {new Date(updatedAt).toLocaleString("es-CO")}
        </p>
      )}
    </WidgetCard>
  );
}
