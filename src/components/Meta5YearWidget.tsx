"use client";
import WidgetCard from "@/components/ui/WidgetCard";
import { getBusinessContext, formatCop } from "@/data/businessContext";

export default function Meta5YearWidget() {
  const ctx = getBusinessContext();
  const clientProgress = Math.round((ctx.meta5Year.currentClients / ctx.meta5Year.targetClients) * 100);
  const q3Progress = Math.round((ctx.clientsClosed / ctx.clientsTargetQ3) * 100);

  return (
    <WidgetCard title={`Meta 5 Años — ${ctx.meta5Year.horizon}`} icon="🚀" badge="Estrategia" badgeVariant="support">
      <p className="text-xs mb-4 font-light" style={{ color: "var(--text-secondary)" }}>
        Ser la empresa #1 en tecnología y posicionamiento digital en Colombia.
        Fundación {ctx.meta5Year.foundationYear}: equipo meta {ctx.meta5Year.teamTarget} personas.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "MRR Objetivo 2031", value: ctx.meta5Year.targetMrr, color: "var(--ember)" },
          { label: "MRR Actual", value: ctx.meta5Year.currentMrr, color: "var(--warning)" },
          { label: "Meta Q3 MRR", value: ctx.meta5Year.q3MrrTarget, color: "var(--success)" },
          { label: "Clientes Meta 2031", value: String(ctx.meta5Year.targetClients), color: "var(--parchment)" },
        ].map((m) => (
          <div
            key={m.label}
            className="stat-tile"
          >
            <span className="font-display text-xl" style={{ color: m.color }}>{m.value}</span>
            <span className="font-mono-label leading-tight" style={{ color: "var(--text-muted)" }}>{m.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between font-mono-label mb-1" style={{ color: "var(--text-muted)" }}>
            <span>Progreso clientes (2031)</span>
            <span>{clientProgress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--void-30)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(clientProgress, 2)}%`,
                background: "linear-gradient(90deg, var(--ember-dark), var(--ember-light))",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono-label mb-1" style={{ color: "var(--text-muted)" }}>
            <span>Meta Q3 2026 ({ctx.clientsClosed}/{ctx.clientsTargetQ3})</span>
            <span>{q3Progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--void-30)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(q3Progress, 2)}%`,
                background: "linear-gradient(90deg, var(--void), var(--success))",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg" style={{ background: "var(--ember-10)", border: "1px solid var(--ember-30)" }}>
          <div className="font-mono-label mb-1" style={{ color: "var(--ember-light)" }}>Wuunder — deadline</div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {ctx.wuunderDaysLeft} días restantes
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <div className="font-mono-label mb-1" style={{ color: "var(--text-muted)" }}>Runway de caja</div>
          <div
            className="text-sm font-semibold"
            style={{ color: ctx.runwayDays < 60 ? "var(--danger)" : "var(--success)" }}
          >
            {ctx.runwayDays} días · {formatCop(ctx.capitalCop)}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
