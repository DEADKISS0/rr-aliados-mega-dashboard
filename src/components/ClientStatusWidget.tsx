"use client";
import { clients, prospects, clientMetrics } from "@/data/clientStatus";

const statusColors: Record<string, string> = {
  activo: "var(--success)",
  historico: "var(--text-muted)",
  prospecto: "var(--warning)",
};

const statusLabels: Record<string, string> = {
  activo: "Activo",
  historico: "Histórico",
  prospecto: "Prospecto",
};

export default function ClientStatusWidget() {
  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👥</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Estado de Clientes</h3>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--danger)" }}>{clientMetrics.activeClients}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Activos</div>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>{clientMetrics.historicalClients}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Históricos</div>
        </div>
      </div>

      {/* Clients */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Clientes</div>
        <div className="space-y-1">
          {clients.map((c) => (
            <div key={c.id} className="p-1.5 rounded" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[c.status] }} />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c.name}</span>
                <span className="px-1 rounded" style={{ background: `${statusColors[c.status]}20`, color: statusColors[c.status] }}>
                  {statusLabels[c.status]}
                </span>
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{c.deliverables} entregables</div>
            </div>
          ))}
        </div>
      </div>

      {/* Prospects */}
      <div>
        <div className="text-[10px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Prospectos con Prototipo</div>
        <div className="space-y-1">
          {prospects.map((p) => (
            <div key={p.name} className="p-1.5 rounded" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--warning)" }} />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{p.type}</span>
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Objective */}
      <div className="mt-3 p-2 rounded text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Objetivo 12 meses</div>
        <div className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{clientMetrics.objective}</div>
      </div>
    </div>
  );
}
