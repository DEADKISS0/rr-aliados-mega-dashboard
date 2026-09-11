import Link from "next/link";
import { getLiveClients } from "@/lib/liveClients";
import OpsNav from "@/components/ops/OpsNav";

export const dynamic = "force-dynamic";

function cop(value: number): string {
  if (!value) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

export default async function ClientesPage() {
  const { clients, live, source, updatedAt, stats } = await getLiveClients();

  return (
    <div className="min-h-screen bg-[#070001] p-6 text-[#FFFFF3] md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <Link href="/ops/finanzas" className="mb-3 inline-block font-mono text-xs uppercase tracking-widest text-[#D2C7D0] hover:text-[#DED116]">
              ← Centro operativo
            </Link>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#DED116]">RR Aliados · Relaciones</p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-6xl">Clientes</h1>
            <p className="mt-3 text-sm text-[#D2C7D0]">Prototipos, contexto comercial y recursos de cada alianza.</p>
          </div>
          <OpsNav active="Clientes" />
          <div className="text-right">
            <div className="text-3xl font-black text-[#DED116]">
              ${(stats.contractValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-white/50 text-sm">Valor total contratado</div>
          </div>
        </div>

        {/* Estado de la fuente */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
          <span
            className={`rounded px-2 py-1 ${live ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}
          >
            {live ? "EN VIVO" : "RESPALDO LOCAL"}
          </span>
          <span className="text-white/45">Fuente: {source}</span>
          <span className="text-white/30">
            Actualizado {new Date(updatedAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{stats.active}</div>
            <div className="text-white/50 text-sm">Clientes activos</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{stats.prospects}</div>
            <div className="text-white/50 text-sm">Prospectos</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{stats.withPrototype}</div>
            <div className="text-white/50 text-sm">Con prototipo</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{stats.total}</div>
            <div className="text-white/50 text-sm">Total</div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="space-y-4">
          {clients.map((client) => (
            <Link
              key={client.slug}
              href={`/ops/clientes/${client.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-0.5 hover:border-[#BE076D]/70 hover:bg-white/[.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold">{client.name}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        client.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : client.status === "prospect"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {client.status === "active" ? "Activo" : client.status === "prospect" ? "Prospecto" : client.status}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        client.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : client.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {client.priority === "high" ? "Alta" : client.priority === "medium" ? "Media" : "Baja"}
                    </span>
                    {!client.hasEditorial && (
                      <span className="rounded bg-sky-500/15 px-2 py-1 text-xs text-sky-300">Nueva · sin ficha</span>
                    )}
                  </div>
                  <p className="mb-2 text-sm text-[#D2C7D0]">{client.industry}</p>
                  {client.entityEstado && (
                    <p className="mb-2 text-xs text-white/45">Estado operativo: {client.entityEstado}</p>
                  )}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {client.tags.map((tag) => (
                      <span key={tag} className="rounded bg-white/5 px-2 py-1 text-xs text-[#D2C7D0]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {client.liveValueTotal > 0 && (
                      <span className="font-medium text-[#DED116]">Contrato: {cop(client.liveValueTotal)}</span>
                    )}
                    <span className="text-white/50">
                      {client.projectCount} proyecto{client.projectCount === 1 ? "" : "s"}
                    </span>
                    {client.liveValueTotal > 0 && (
                      <span className="text-white/50">Pagado {client.paymentProgress}%</span>
                    )}
                  </div>
                </div>
                <div className="text-2xl text-white/30">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
