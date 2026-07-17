"use client";

import { useEffect, useState } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

type Area = { area: string; health_score: number; total_changes: number; status: string };
type PatternData = {
  generated_at?: string;
  area_health?: Area[];
  trends?: Array<{ name: string; direction: string; slope?: number }>;
};

/** Muestra etiquetada cuando no hay snapshot live en public/data/mirofish/patterns.json */
const EJEMPLO: PatternData = {
  generated_at: "ejemplo",
  area_health: [
    { area: "Comercial / Pipeline", health_score: 0.72, total_changes: 14, status: "ok" },
    { area: "Producto / Skills", health_score: 0.61, total_changes: 9, status: "ok" },
    { area: "Ops / Automatización", health_score: 0.48, total_changes: 6, status: "watch" },
    { area: "Finanzas / Wuunder", health_score: 0.55, total_changes: 4, status: "watch" },
  ],
  trends: [
    { name: "Documentos de estrategia", direction: "↑", slope: 0.12 },
    { name: "Actas comerciales", direction: "→", slope: 0.02 },
  ],
};

export default function MiroFishSignalsWidget() {
  const [data, setData] = useState<PatternData | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/data/mirofish/patterns.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("no snapshot");
        return response.json() as Promise<PatternData>;
      })
      .then((json) => {
        const areas = json?.area_health ?? [];
        if (areas.length === 0) {
          setData(EJEMPLO);
          setIsExample(true);
        } else {
          setData(json);
          setIsExample(false);
        }
      })
      .catch(() => {
        setData(EJEMPLO);
        setIsExample(true);
      })
      .finally(() => setLoaded(true));
  }, []);

  const areas = [...(data?.area_health ?? [])]
    .sort((a, b) => b.total_changes - a.total_changes)
    .slice(0, 6);
  const trends = (data?.trends ?? []).slice(0, 4);

  return (
    <WidgetCard
      title="Señales MiroFish"
      icon="📈"
      badge={isExample ? "EJEMPLO" : "Actividad documental"}
      badgeVariant={isExample ? "support" : "active"}
    >
      <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        Esta sección resume <strong style={{ color: "var(--text-primary)" }}>cambios en documentos</strong>{" "}
        que MiroFish observa (actas, reportes, notas). No mide ingresos, clientes ni salud financiera —
        solo ritmo de actividad documental por área.
      </p>

      {isExample && loaded && (
        <div className="banner-mock mb-3 text-[11px]">
          <strong>EJEMPLO</strong> — no hay snapshot live en{" "}
          <code className="font-mono-label text-[10px]">/data/mirofish/patterns.json</code>. Los valores
          de abajo son ilustrativos para pitch/ops; no son datos reales del periodo.
        </div>
      )}

      <div className="space-y-2">
        {areas.map((area) => {
          const normalized = Math.max(0, Math.min(100, area.health_score * 100));
          return (
            <div key={area.area}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "var(--text-primary)" }}>{area.area}</span>
                <span style={{ color: "var(--text-muted)" }}>{area.total_changes} cambios</span>
              </div>
              <div className="h-2 rounded overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <div className="h-full" style={{ width: `${normalized}%`, background: "var(--ember)" }} />
              </div>
            </div>
          );
        })}
        {!loaded && (
          <p className="text-sm py-3 text-center" style={{ color: "var(--text-muted)" }}>
            Cargando señales…
          </p>
        )}
      </div>

      {trends.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {trends.map((trend) => (
            <div
              key={`${trend.name}-${trend.direction}`}
              className="rounded p-2"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="text-xs truncate" style={{ color: "var(--text-primary)" }}>
                {trend.name}
              </div>
              <div className="font-mono-label text-[10px]" style={{ color: "var(--text-muted)" }}>
                {trend.direction} · pendiente {trend.slope ?? "n/d"}
                {isExample ? " · EJEMPLO" : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
