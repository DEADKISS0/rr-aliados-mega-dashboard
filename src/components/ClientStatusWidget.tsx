"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

interface Entity {
  id: string;
  slug: string;
  nombre: string;
  nombre_canonico: string;
  tipo: string;
  estado: string;
  probabilidad_cierre: number | null;
  drive_path: string;
  notas: string | null;
  metadata: Record<string, unknown>;
}

interface EntitiesStats {
  total: number;
  clientes: number;
  prospectos: number;
  activos: number;
}

const statusColors: Record<string, string> = {
  activo: "var(--success)",
  historico: "var(--text-muted)",
  prospecto: "var(--warning)",
  inactivo: "var(--danger)",
};

const statusLabels: Record<string, string> = {
  activo: "Activo",
  historico: "Histórico",
  prospecto: "Prospecto",
  inactivo: "Inactivo",
};

const tipoLabels: Record<string, string> = {
  cliente: "Cliente",
  prospecto: "Prospecto",
  partner: "Partner",
  proveedor: "Proveedor",
};

export default function ClientStatusWidget() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [stats, setStats] = useState<EntitiesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  const fetchEntities = useCallback(async () => {
    try {
      const resp = await fetch("/api/entities");
      const data = await resp.json();
      if (data.entities) {
        setEntities(data.entities);
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
    fetchEntities();
    const interval = setInterval(fetchEntities, 120000);
    return () => clearInterval(interval);
  }, [fetchEntities]);

  const clientes = entities.filter((e) => e.tipo === "cliente");
  const prospectos = entities.filter((e) => e.tipo === "prospecto");

  if (loading) {
    return (
      <WidgetCard title="Estado de Clientes" icon="👥" badge="CARGANDO" badgeVariant="default">
        <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          Consultando datos vivos…
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Estado de Clientes"
      icon="👥"
      badge={live ? "EN VIVO" : "OFFLINE"}
      badgeVariant={live ? "success" : "danger"}
    >
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        >
          <div className="text-2xl font-bold" style={{ color: "var(--success)" }}>
            {stats?.clientes || 0}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Clientes
          </div>
        </div>
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        >
          <div className="text-2xl font-bold" style={{ color: "var(--warning)" }}>
            {stats?.prospectos || 0}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Prospectos
          </div>
        </div>
      </div>

      {/* Clientes activos */}
      {clientes.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Clientes ({clientes.length})
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {clientes.map((c) => (
              <div
                key={c.id}
                className="p-2 rounded"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div className="flex items-center gap-2 text-[10px]">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: statusColors[c.estado] || "var(--text-muted)" }}
                  />
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {c.nombre}
                  </span>
                  <span
                    className="px-1 rounded text-[9px]"
                    style={{
                      background: `${statusColors[c.estado]}20`,
                      color: statusColors[c.estado],
                    }}
                  >
                    {statusLabels[c.estado] || c.estado}
                  </span>
                </div>
                {c.notas && (
                  <div className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>
                    {c.notas}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prospectos */}
      {prospectos.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Prospectos ({prospectos.length})
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {prospectos.map((p) => (
              <div
                key={p.id}
                className="p-2 rounded"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div className="flex items-center gap-2 text-[10px]">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--warning)" }}
                  />
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {p.nombre}
                  </span>
                  {p.probabilidad_cierre !== null && (
                    <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                      {Math.round(p.probabilidad_cierre * 100)}% cierre
                    </span>
                  )}
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
