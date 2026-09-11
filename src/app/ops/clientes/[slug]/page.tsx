import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientBySlug } from "@/data/clients";
import ClientLivePanel from "@/components/ClientLivePanel";
import OpsNav from "@/components/ops/OpsNav";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClienteDetailPage({ params }: Props) {
  const { slug } = await params;
  const client = getClientBySlug(slug);

  if (!client) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070001] p-6 text-[#FFFFF3] md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/ops/clientes" className="mb-3 inline-block font-mono text-xs uppercase tracking-widest text-[#D2C7D0] hover:text-[#DED116]">
            ← Volver a clientes
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black mb-2">{client.name}</h1>
              <p className="text-white/50">{client.industry}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded text-sm ${
                  client.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : client.status === "prospect"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {client.status === "active" ? "Cliente activo" : client.status === "prospect" ? "Prospecto" : client.status}
              </span>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  client.priority === "high"
                    ? "bg-red-500/20 text-red-400"
                    : client.priority === "medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                Prioridad {client.priority === "high" ? "alta" : client.priority === "medium" ? "media" : "baja"}
              </span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Datos generales */}
          <div className="border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Información general</h2>
            <dl className="space-y-3">
              {client.contact && (
                <div>
                  <dt className="text-white/40 text-sm">Contacto</dt>
                  <dd className="text-white">{client.contact}</dd>
                </div>
              )}
              {client.email && (
                <div>
                  <dt className="text-white/40 text-sm">Email</dt>
                  <dd className="text-white">{client.email}</dd>
                </div>
              )}
              {client.phone && (
                <div>
                  <dt className="text-white/40 text-sm">Teléfono</dt>
                  <dd className="text-white">{client.phone}</dd>
                </div>
              )}
              {client.contractValue && (
                <div>
                  <dt className="text-white/40 text-sm">Valor contrato</dt>
                  <dd className="text-green-400 font-bold">
                    ${(client.contractValue / 1000000).toFixed(1)}M {client.currency}
                  </dd>
                </div>
              )}
              {client.startDate && (
                <div>
                  <dt className="text-white/40 text-sm">Fecha inicio</dt>
                  <dd className="text-white">{client.startDate}</dd>
                </div>
              )}
              <div>
                <dt className="text-white/40 text-sm">Drive</dt>
                <dd className="text-white/70 text-sm font-mono">{client.drivePath}</dd>
              </div>
            <OpsNav active="Clientes" />
            </dl>
          </div>

          {/* Links */}
          <div className="border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Links y recursos</h2>
            <div className="space-y-3">
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white transition underline underline-offset-4"
                >
                  🌐 Website →
                </a>
              )}
              {client.prototypeUrl && (
                <a
                  href={client.prototypeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white transition underline underline-offset-4"
                >
                  🧪 Prototipo →
                </a>
              )}
              {client.pitchUrl && (
                <a
                  href={client.pitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white transition underline underline-offset-4"
                >
                  📊 Pitch →
                </a>
              )}
              {client.repoUrl && (
                <a
                  href={client.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white transition underline underline-offset-4"
                >
                  📦 Repo →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="border border-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {client.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/5 rounded text-sm text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Notas */}
        {client.notes && (
          <div className="border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Notas</h2>
            <p className="text-white/70">{client.notes}</p>
          </div>
        )}

        <ClientLivePanel slug={client.slug} />

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="border border-white/10 rounded-lg p-6">
            <h3 className="text-white/40 font-bold mb-2">📈 Métricas</h3>
            <p className="text-white/50 text-sm">KPIs y resultados se agregan aquí cuando estén disponibles en la fuente de datos.</p>
          </div>
          <div className="border border-white/10 rounded-lg p-6">
            <h3 className="text-white/40 font-bold mb-2">📁 Entregables</h3>
            <p className="text-white/50 text-sm">{client.tags.includes("prototipo-web") ? "Prototipo web vinculado arriba." : "Sin entregables publicados en la ficha todavía."}</p>
          </div>
          <div className="border border-white/10 rounded-lg p-6">
            <h3 className="text-white/40 font-bold mb-2">📅 Cronograma</h3>
            <p className="text-white/50 text-sm">{client.startDate ? `Inicio registrado: ${client.startDate}.` : "No hay hitos fechados en la ficha actual."}</p>
          </div>
          <div className="border border-white/10 rounded-lg p-6">
            <h3 className="text-white/40 font-bold mb-2">💬 Comunicaciones</h3>
            <p className="text-white/50 text-sm">{client.notes ?? "Sin notas operativas registradas."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
