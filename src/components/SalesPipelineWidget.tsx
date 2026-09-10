"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import StatPill from "@/components/ui/StatPill";
import { deals as staticDeals, salesMetrics as staticMetrics, revenueScenarios as staticScenarios, Deal, SalesMetric } from "@/data/salesPipeline";

const statusColors: Record<string, string> = {
  prospecto: "var(--warning)",
  negociacion: "var(--ember)",
  "pre-contrato": "var(--success)",
  contratado: "var(--success)",
  activo: "var(--success)",
};

const statusLabels: Record<string, string> = {
  prospecto: "Prospecto",
  negociacion: "Negociación",
  "pre-contrato": "Pre-contrato",
  contratado: "Contratado",
  activo: "Activo",
};

const priorityColors: Record<string, string> = {
  critico: "var(--danger)",
  alto: "var(--warning)",
  medio: "var(--ember)",
};

export default function SalesPipelineWidget() {
  const [deals, setDeals] = useState<Deal[]>(staticDeals);
  const [metrics, setMetrics] = useState<SalesMetric[]>(staticMetrics);
  const [scenarios, setScenarios] = useState(staticScenarios);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchPipeline = useCallback(async () => {
    try {
      const resp = await fetch("/api/pipeline");
      const data = await resp.json();
      if (data.deals) setDeals(data.deals);
      if (data.metrics) setMetrics(data.metrics);
      if (data.revenueScenarios) setScenarios(data.revenueScenarios);
      setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setDeals(staticDeals);
      setMetrics(staticMetrics);
      setScenarios(staticScenarios);
    }
  }, []);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  return (
    <WidgetCard title="Pipeline de Ventas" icon="💰" badge="CRÍTICO" badgeVariant="support">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {metrics.map((m) => (
          <StatPill key={m.label} label={m.label} value={m.value} icon={m.icon} color={m.color} />
        ))}
      </div>

      <div className="mb-4">
        <div className="font-mono-label mb-2" style={{ color: "var(--text-primary)" }}>
          Prospectos Activos
        </div>
        <div className="space-y-2">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-3 rounded-lg"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: statusColors[deal.status] }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {deal.name}
                  </span>
                </div>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono-label"
                  style={{ background: `${priorityColors[deal.priority]}20`, color: priorityColors[deal.priority] }}
                >
                  {deal.priority}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
                <span>{deal.value}</span>
                <span>{deal.monthlyFee}</span>
                <span>{deal.timeline}</span>
                <span className="px-1 rounded" style={{ background: `${statusColors[deal.status]}20`, color: statusColors[deal.status] }}>
                  {statusLabels[deal.status]}
                </span>
              </div>
              <div className="text-[10px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
                → {deal.nextStep}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono-label mb-2" style={{ color: "var(--text-primary)" }}>
          Escenarios de Ingresos (12 meses)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {scenarios.slice(0, 4).map((s) => (
            <div
              key={s.name}
              className="p-2 rounded-lg text-center"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{s.name}</div>
              <div className="text-xs font-display mt-1" style={{ color: "var(--ember)" }}>{s.revenue}</div>
            </div>
          ))}
        </div>
      </div>

      {lastUpdate && (
        <div className="mt-3 text-[10px] text-right font-mono-label" style={{ color: "var(--text-muted)" }}>
          Sync: {lastUpdate}
        </div>
      )}
    </WidgetCard>
  );
}
