import Link from "next/link";
import { CLIENTS, getActiveClients, getProspects, getTotalContractValue } from "@/data/clients";
import OpsNav from "@/components/ops/OpsNav";

export default function ClientesPage() {
  const active = getActiveClients();
  const prospects = getProspects();
  const totalValue = getTotalContractValue();

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
              ${(totalValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-white/50 text-sm">Valor total contratos</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{active.length}</div>
            <div className="text-white/50 text-sm">Clientes activos</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{prospects.length}</div>
            <div className="text-white/50 text-sm">Prospectos</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="text-2xl font-black">{CLIENTS.length}</div>
            <div className="text-white/50 text-sm">Total</div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="space-y-4">
          {CLIENTS.map((client) => (
            <Link
              key={client.slug}
              href={`/ops/clientes/${client.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-0.5 hover:border-[#BE076D]/70 hover:bg-white/[.06]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
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
                  </div>
                    <p className="mb-2 text-sm text-[#D2C7D0]">{client.industry}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {client.tags.map((tag) => (
                      <span key={tag} className="rounded bg-white/5 px-2 py-1 text-xs text-[#D2C7D0]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {client.contractValue && (
                    <p className="text-sm font-medium text-[#DED116]">
                      Contrato: ${(client.contractValue / 1000000).toFixed(1)}M {client.currency}
                    </p>
                  )}
                </div>
                <div className="text-white/30 text-2xl">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
