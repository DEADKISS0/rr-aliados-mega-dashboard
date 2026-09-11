"use client";

import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

interface Payload {
  live: boolean;
  error?: string;
  updated_at?: string;
  metrics?: {
    projects: number;
    entities: number;
    value_total: number;
    value_paid: number;
    value_pending: number;
    payment_progress: number;
  };
  projects?: Array<Record<string, unknown>>;
}

function cop(value: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

export default function ClientLivePanel({ slug }: Props) {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/client/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Payload) => {
        if (!cancelled) setPayload(data);
      })
      .catch(() => {
        if (!cancelled) setPayload({ live: false, error: "No se pudo consultar la API" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const metrics = payload?.metrics;
  const projects = payload?.projects ?? [];

  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Datos operativos</h2>
          <p className="text-white/45 text-sm">Proyectos, entidades y pagos sincronizados.</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${payload?.live ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
          {payload ? (payload.live ? "EN VIVO" : "FICHA LOCAL") : "CARGANDO"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Proyectos", metrics?.projects ?? "—"],
          ["Valor contratado", metrics ? cop(metrics.value_total) : "—"],
          ["Pagado", metrics ? cop(metrics.value_paid) : "—"],
          ["Progreso de pago", metrics ? `${metrics.payment_progress}%` : "—"],
        ].map(([label, value]) => (
          <div key={label} className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="text-white/45 text-xs mb-2">{label}</div>
            <div className="text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {projects.length > 0 ? (
        <div className="border border-white/10 rounded-lg p-5">
          <h3 className="font-bold mb-4">Proyectos relacionados</h3>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={String(project.id ?? index)} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{String(project.nombre ?? project.name ?? project.slug ?? "Proyecto")}</div>
                  <div className="text-xs text-white/45">{String(project.estado ?? project.fase ?? "Sin estado")}</div>
                </div>
                <div className="text-right text-sm text-emerald-300">
                  {project.valor_total == null ? "—" : cop(Number(project.valor_total))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-white/15 rounded-lg p-5 text-sm text-white/45">
          {payload?.error ? "Supabase aún no está conectado para este entorno." : "No hay proyectos relacionados registrados."}
        </div>
      )}
    </section>
  );
}
