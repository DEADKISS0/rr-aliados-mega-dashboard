"use client";
import { competitors, competitorMetrics } from "@/data/competitorData";

const threatColors: Record<string, string> = {
  alto: "var(--danger)",
  medio: "var(--warning)",
  bajo: "var(--success)",
};

export default function CompetitorWidget() {
  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Inteligencia Competitiva</h3>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--danger)" }}>{competitorMetrics.highThreat}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Alta Amenaza</div>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--warning)" }}>{competitorMetrics.mediumThreat}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Media</div>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-lg font-bold" style={{ color: "var(--success)" }}>{competitorMetrics.lowThreat}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Baja</div>
        </div>
      </div>

      {/* Competitors */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Competidores</div>
        <div className="space-y-1">
          {competitors.map((c) => (
            <div key={c.id} className="p-1.5 rounded" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: threatColors[c.threatLevel] }} />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c.name}</span>
                <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{c.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiators */}
      <div>
        <div className="text-[10px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Nuestras Diferenciaciones</div>
        <div className="space-y-0.5">
          {competitorMetrics.keyDifferentiators.map((d, i) => (
            <div key={i} className="text-[10px] flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
