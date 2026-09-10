"use client";
import { useState, useEffect } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import { financialMetrics, teamCosts, keyDeadlines } from "@/data/financialHealth";
import {
  fetchBusinessContext,
  formatCop,
  type BusinessContext,
} from "@/data/businessContext";

const urgencyColors: Record<string, string> = {
  critico: "var(--danger)",
  alto: "var(--warning)",
  medio: "var(--ember)",
};

const SCENARIO_KEY = "rr-wuunder-scenario";

export default function FinancialHealthWidget() {
  const [ctx, setCtx] = useState<BusinessContext | null>(null);
  const [wuunderClosed, setWuunderClosed] = useState(false);

  useEffect(() => {
    try {
      setWuunderClosed(localStorage.getItem(SCENARIO_KEY) === "yes");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchBusinessContext({ wuunderClosed }).then((c) => {
      if (!cancelled) setCtx(c);
    });
    return () => {
      cancelled = true;
    };
  }, [wuunderClosed]);

  const toggleScenario = (closed: boolean) => {
    setWuunderClosed(closed);
    try {
      localStorage.setItem(SCENARIO_KEY, closed ? "yes" : "no");
    } catch {
      /* ignore */
    }
  };

  if (!ctx) {
    return (
      <WidgetCard title="Salud Financiera" icon="🏦" badge="Q3 2026">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cargando snapshot…</p>
      </WidgetCard>
    );
  }

  const runwayDisplay = ctx.runwayMonths >= 999
    ? "Cash+ (MRR ≥ burn)"
    : `~${Math.floor(ctx.runwayMonths)} meses`;

  const liveMetrics = financialMetrics.map((m) => {
    if (m.label === "Capital Disponible") return { ...m, value: formatCop(ctx.capitalCop) };
    if (m.label === "Runway Estimado") {
      return {
        ...m,
        value: runwayDisplay,
        subtitle: wuunderClosed
          ? `${ctx.runwayDays >= 9999 ? "∞" : ctx.runwayDays} días · escenario Wuunder cerrado`
          : `${ctx.runwayDays} días · sin ingresos nuevos`,
      };
    }
    if (m.label === "Meta Q3 2026") {
      return {
        ...m,
        value: `${ctx.clientsClosed}/${ctx.clientsTargetQ3} clientes`,
        subtitle: ctx.meta5Year.q3MrrTarget + " MRR meta",
      };
    }
    return m;
  });

  return (
    <WidgetCard title="Salud Financiera" icon="🏦" badge="Q3 2026">
      <div
        className="flex items-center justify-between gap-2 mb-3 p-2 rounded-lg"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
        data-internal-only
      >
        <div className="min-w-0">
          <div className="font-mono-label" style={{ color: "var(--text-primary)" }}>
            Escenario Wuunder
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Local · MRR est. {formatCop(ctx.wuunderExpectedMrrCop)}/mes
            {ctx.financeUpdatedAt ? ` · snap ${ctx.financeUpdatedAt}` : ""}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => toggleScenario(false)}
            className="text-[10px] px-2 py-1 rounded"
            style={{
              background: !wuunderClosed ? "var(--ember-20)" : "transparent",
              color: !wuunderClosed ? "var(--ember-light)" : "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            Abierto
          </button>
          <button
            type="button"
            onClick={() => toggleScenario(true)}
            className="text-[10px] px-2 py-1 rounded"
            style={{
              background: wuunderClosed ? "var(--success)" : "transparent",
              color: wuunderClosed ? "var(--parchment)" : "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
              opacity: wuunderClosed ? 0.9 : 1,
            }}
          >
            Cerrado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {liveMetrics.slice(0, 6).map((m) => (
          <div
            key={m.label}
            className="p-3 rounded-lg"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{m.icon}</span>
              <span className="font-mono-label" style={{ color: "var(--text-primary)" }}>{m.label}</span>
            </div>
            <div className="font-display text-base" style={{ color: m.color }}>{m.value}</div>
            {m.subtitle && (
              <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{m.subtitle}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="font-mono-label mb-2" style={{ color: "var(--text-primary)" }}>Costos de Equipo</div>
        <div className="space-y-1">
          {teamCosts.slice(0, 5).map((cost) => (
            <div
              key={cost.name}
              className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg"
              style={{ background: "var(--bg-secondary)" }}
            >
              <span style={{ color: "var(--text-primary)" }}>{cost.name}</span>
              <span className="font-medium font-mono-label" style={{ color: "var(--text-secondary)" }}>
                {cost.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono-label mb-2" style={{ color: "var(--text-primary)" }}>Fechas Clave</div>
        <div className="space-y-1">
          {[
            { event: "Wuunder — decisión firma", deadline: `${ctx.wuunderDaysLeft} días`, urgency: "critico" as const },
            ...keyDeadlines,
          ].map((d) => (
            <div
              key={d.event}
              className="flex items-center gap-2 text-[10px] px-2 py-1.5 rounded-lg"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: urgencyColors[d.urgency] }} />
              <span className="flex-1" style={{ color: "var(--text-primary)" }}>{d.event}</span>
              <span className="font-mono-label" style={{ color: "var(--text-muted)" }}>{d.deadline}</span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
