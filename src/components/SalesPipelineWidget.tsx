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
  fase: string;
  valor_total: number;
  valor_pagado: number;
  valor_potencial: number;
  servicios_potenciales: string[];
  updated_at: string;
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

const statusColors: Record<string, string> = {
  prospecto: "var(--warning)",
  negociacion: "var(--ember)",
  "pre-contrato": "var(--success)",
  contratado: "var(--success)",
  activo: "var(--success)",
  planificacion: "var(--info)",
  pausado: "var(--danger)",
};

const statusLabels: Record<string, string> = {
  prospecto: "Prospecto",
  negociacion: "Negociación",
  "pre-contrato": "Pre-contrato",
  contratado: "Contratado",
  activo: "Activo",
  planificacion: "Planificación",
  pausado: "Pausado",
};

const categoryLabels: Record<string, string> = {
  cliente: "Cliente",
  prospecto: "Prospecto",
  interno: "Interno",
};

function formatCOP(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function SalesPipelineWidget() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      const resp = await fetch("/api/projects");
      const data = await resp.json();
      if (data.projects) {
        setProjects(data.projects);
        setStats(data.stats);
        setLive(data.live);
        setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch {
      // Fallback silencioso — el widget muestra vacío si no hay datos
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 120000); // Refresh cada 2 min
    return () => clearInterval(interval);
  }, [fetchProjects]);

  // Métricas calculadas desde datos vivos
  const metrics = stats ? [
    { label: "Pipeline Total", value: formatCOP(stats.valor_total + stats.valor_potencial), icon: "💰", color: "var(--success)" },
    { label: "Clientes Activos", value: String(stats.clientes), icon: "👥", color: "var(--ember)" },
    { label: "Prospectos", value: String(stats.prospectos), icon: "🎯", color: "var(--warning)" },
    { label: "Cobrado", value: formatCOP(stats.valor_pagado), icon: "✅", color: "var(--success)" },
  ] : [];

  // Filtrar solo clientes y prospectos (no internos)
  const visibleProjects = projects.filter((p) => p.categoria !== "interno");

  if (loading) {
    return (
      <WidgetCard title="Pipeline de Ventas" icon="💰" badge="CARGANDO" badgeVariant="default">
        <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          Consultando datos vivos…
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Pipeline de Ventas"
      icon="💰"
      badge={live ? "EN VIVO" : "OFFLINE"}
      badgeVariant={live ? "success" : "danger"}
    >
      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {metrics.map((m) => (
          <StatPill key={m.label} label={m.label} value={m.value} icon={m.icon} color={m.color} />
        ))}
      </div>

      {/* Lista de proyectos */}
      <div className="mb-2">
        <div className="font-mono-label mb-2 flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
          <span>Proyectos ({visibleProjects.length})</span>
          {lastUpdate && (
            <span className="text-xs font-normal" style={{ color: "var(--text-secondary)" }}>
              {lastUpdate}
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="p-3 rounded-lg"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: statusColors[project.estado] || "var(--text-secondary)" }}
                  />
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {project.nombre}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: project.categoria === "cliente" ? "var(--success-bg)" : "var(--warning-bg)",
                      color: project.categoria === "cliente" ? "var(--success)" : "var(--warning)",
                    }}
                  >
                    {categoryLabels[project.categoria] || project.categoria}
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                  {formatCOP(project.valor_total)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                  {statusLabels[project.estado] || project.estado} · {project.fase || "Sin fase"}
                </span>
                {project.valor_pagado > 0 && (
                  <span className="text-[10px] font-mono" style={{ color: "var(--success)" }}>
                    {Math.round((project.valor_pagado / project.valor_total) * 100)}% pagado
                  </span>
                )}
              </div>

              {/* Barra de progreso de pago */}
              {project.valor_total > 0 && (
                <div className="mt-2 h-1 rounded-full" style={{ background: "var(--bg-tertiary)" }}>
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((project.valor_pagado / project.valor_total) * 100))}%`,
                      background: "var(--success)",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer con fuente */}
      <div className="mt-3 pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>
          {live ? "📡 Supabase (tiempo real)" : "📁 Datos estáticos"}
        </span>
      </div>
    </WidgetCard>
  );
}
