import Link from "next/link";
import { CLIENTS, getActiveClients, getProspects, getTotalContractValue } from "@/data/clients";

export default function ClientesPage() {
  const active = getActiveClients();
  const prospects = getProspects();
  const totalValue = getTotalContractValue();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/ops" className="text-white/50 hover:text-white text-sm mb-2 inline-block">
              ← Volver al dashboard
            </Link>
            <h1 className="text-4xl font-black">Clientes</h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-green-400">
              ${(totalValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-white/50 text-sm">Valor total contratos</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-black">{active.length}</div>
            <div className="text-white/50 text-sm">Clientes activos</div>
          </div>
          <div className="border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-black">{prospects.length}</div>
            <div className="text-white/50 text-sm">Prospectos</div>
          </div>
          <div className="border border-white/10 rounded-lg p-4">
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
              className="block border border-white/10 rounded-lg p-6 hover:border-white/30 transition bg-white/[0.02]"
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
                  <p className="text-white/50 text-sm mb-2">{client.industry}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {client.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded text-white/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {client.contractValue && (
                    <p className="text-sm text-green-400 font-medium">
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
