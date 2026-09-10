"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import StatPill from "@/components/ui/StatPill";

interface Project {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  estado: string;
  valor_total: number;
  valor_pagado: number;
  valor_potencial: number;
}

interface ProjectsStats {
  total: number;
  activos: number;
  prospectos: number;
  clientes: number;
  valor_total: number;
  valor_pagado: number;
  valor_potencial: number;
}

function formatCOP(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

// Costos fijos estimados de operación RR (mensual)
const FIXED_COSTS = {
  minimo: 450000,
  equipo: 1000000,
};

export default function FinancialHealthWidget() {
  const [stats, setStats] = useState<ProjectsStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [scenario, setScenario] = useState<"open" | "closed">("open");

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch("/api/projects");
      const data = await resp.json();
      if (data.projects) {
        setProjects(data.projects);
        setStats(data.stats);
        setLive(data.live);
      }
    } catch {
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calcular métricas financieras desde datos vivos
  const clientesActivos = projects.filter((p) => p.categoria === "cliente" && p.estado === "activo");
  const valorContratado = clientesActivos.reduce((sum, p) => sum + (p.valor_total || 0), 0);
  valorContratado + (scenario === "open" ? stats?.valor_potencial || 0 : 0);
  const valorCobrado = stats?.valor_pagado || 0;
  const valorPendiente = valorContratado - valorCobrado;
  const valorPipeline = stats?.valor_potencial || 0;

  // Runway: capital cobrado / costo mensual
  const runwayMonths = valorCobrado > 0 ? Math.floor(valorCobrado / FIXED_COSTS.equipo) : 0;
  const runwayDisplay = runwayMonths > 0 ? `~${runwayMonths} meses` : "Crítico";

  const metrics = [
    {
      label: "Contratado",
      value: formatCOP(valorContratado),
      icon: "💰",
      color: "var(--success)",
    },
    {
      label: "Cobrado",
      value: formatCOP(valorCobrado),
      icon: "✅",
      color: "var(--success)",
    },
    {
      label: "Pendiente",
      value: formatCOP(valorPendiente),
      icon: "⏳",
      color: valorPendiente > 0 ? "var(--warning)" : "var(--text-muted)",
    },
    {
      label: "Pipeline",
      value: formatCOP(valorPipeline),
      icon: "🎯",
      color: "var(--ember)",
    },
  ];

  if (loading) {
    return (
      <WidgetCard title="Salud Financiera" icon="🏦" badge="CARGANDO" badgeVariant="default">
        <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          Consultando datos vivos…
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Salud Financiera"
      icon="🏦"
      badge={live ? "EN VIVO" : "OFFLINE"}
      badgeVariant={live ? "success" : "danger"}
    >
      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {metrics.map((m) => (
          <StatPill key={m.label} label={m.label} value={m.value} icon={m.icon} color={m.color} />
        ))}
      </div>

      {/* Escenario Wuunder */}
      <div className="mb-4 p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Escenario Wuundeer
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setScenario("open")}
              className="px-2 py-1 text-[10px] rounded"
              style={{
                background: scenario === "open" ? "var(--success)" : "var(--bg-tertiary)",
                color: scenario === "open" ? "#fff" : "var(--text-secondary)",
              }}
            >
              Abierto
            </button>
            <button
              onClick={() => setScenario("closed")}
              className="px-2 py-1 text-[10px] rounded"
              style={{
                background: scenario === "closed" ? "var(--danger)" : "var(--bg-tertiary)",
                color: scenario === "closed" ? "#fff" : "var(--text-secondary)",
              }}
            >
              Cerrado
            </button>
          </div>
        </div>
        <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
          {scenario === "open"
            ? "Incluye valor potencial de Wuundeer en proyección"
            : "Solo cuenta contratos firmados y activos"}
        </p>
      </div>

      {/* Runway */}
      <div className="mb-4 p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Runway estimado
          </span>
          <span
            className="text-sm font-bold"
            style={{
              color: runwayMonths >= 6 ? "var(--success)" : runwayMonths >= 3 ? "var(--warning)" : "var(--danger)",
            }}
          >
            {runwayDisplay}
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full" style={{ background: "var(--bg-tertiary)" }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(100, (runwayMonths / 12) * 100)}%`,
              background: runwayMonths >= 6 ? "var(--success)" : runwayMonths >= 3 ? "var(--warning)" : "var(--danger)",
            }}
          />
        </div>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>
          Basado en ${(FIXED_COSTS.equipo / 1000000).toFixed(1)}M/mes de costo operativo
        </p>
      </div>

      {/* Breakdown por cliente */}
      {clientesActivos.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Clientes activos ({clientesActivos.length})
          </div>
          <div className="space-y-1">
            {clientesActivos.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded"
                style={{ background: "var(--bg-secondary)" }}
              >
                <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {p.nombre}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>
                    {formatCOP(p.valor_pagado || 0)} / {formatCOP(p.valor_total)}
                  </span>
                  <span
                    className="text-[9px] px-1 rounded"
                    style={{
                      background: (p.valor_pagado || 0) >= p.valor_total ? "var(--success-bg)" : "var(--warning-bg)",
                      color: (p.valor_pagado || 0) >= p.valor_total ? "var(--success)" : "var(--warning)",
                    }}
                  >
                    {p.valor_total > 0 ? Math.round(((p.valor_pagado || 0) / p.valor_total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>
          {live ? "📡 Supabase (tiempo real)" : "📁 Datos estáticos"}
        </span>
      </div>
    </WidgetCard>
  );
}
