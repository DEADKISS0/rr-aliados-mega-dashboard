import Link from "next/link";
import { ArrowUpRight, Bot, Calculator, FileText, Landmark, Layers3, RadioTower } from "lucide-react";
import { OPS_DEVELOPMENTS, REMOVED_FROM_INTERNAL } from "@/data/developments";
import OpsNav from "@/components/ops/OpsNav";

const iconByArea = {
  Finanzas: Landmark,
  Comercial: Calculator,
  Contenido: Layers3,
  Documentos: FileText,
  Automatización: Bot,
} as const;

const statusLabel = {
  core: "Operar",
  consolidar: "Unificar",
  soporte: "Soporte",
  retirar: "Migrar",
} as const;

const coreItems = OPS_DEVELOPMENTS.filter((item) => item.status === "core");
const consolidationItems = OPS_DEVELOPMENTS.filter((item) => item.status === "consolidar" || item.status === "retirar");
const financeStack = OPS_DEVELOPMENTS.filter((item) => item.area === "Finanzas");

export default function OperationsHome() {
  return (
    <main className="min-h-screen bg-[#070001] px-5 py-6 text-[#FFFFF3] md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#DED116]">RR Aliados · Interno reconstruido</p>
            <h1 className="mt-2 text-5xl font-black uppercase tracking-tight md:text-7xl">Centro interno</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#D2C7D0]">
              Un solo mando para operar finanzas, contenido, documentos, automatización y cotización sin perseguir herramientas sueltas.
            </p>
          </div>
          <OpsNav active="Hoy" />
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-3xl border border-[#BE076D]/45 bg-[#BE076D]/10 p-6 shadow-2xl shadow-[#BE076D]/10">
            <div className="flex items-center gap-3">
              <RadioTower className="text-[#DED116]" size={24} aria-hidden />
              <p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Decisión base</p>
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-black uppercase leading-tight md:text-5xl">
              El interno se organiza por función, no por historia del proyecto.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-[#D2C7D0]">
              RR Finanzas absorbe duplicados financieros. Content Hub, Precontratos y Commander siguen como sistemas vivos.
              Kotizador entra al flujo comercial. Skills Hub y Primer Contacto salen del menú interno.
            </p>
          </article>

          <aside className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5">
              <span className="font-mono text-[10px] uppercase tracking-[.2em] text-emerald-100">Core</span>
              <strong className="mt-2 block text-4xl font-black">{coreItems.length}</strong>
              <p className="mt-1 text-sm text-[#D2C7D0]">sistemas que quedan vivos.</p>
            </div>
            <div className="rounded-2xl border border-[#DED116]/25 bg-[#DED116]/10 p-5">
              <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#FFF6A3]">Ordenar</span>
              <strong className="mt-2 block text-4xl font-black">{consolidationItems.length}</strong>
              <p className="mt-1 text-sm text-[#D2C7D0]">duplicados o módulos por migrar.</p>
            </div>
            <div className="rounded-2xl border border-[#E43A92]/25 bg-[#E43A92]/10 p-5">
              <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#FFD6EA]">Salen</span>
              <strong className="mt-2 block text-4xl font-black">{REMOVED_FROM_INTERNAL.length}</strong>
              <p className="mt-1 text-sm text-[#D2C7D0]">herramientas fuera del interno.</p>
            </div>
          </aside>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Accesos principales</p>
              <h2 className="mt-2 text-2xl font-black uppercase">Lo que sí vive en el interno</h2>
            </div>
            <Link href="/ops/desarrollos" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold transition hover:border-[#DED116] hover:text-[#DED116]">
              Ver matriz completa <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {coreItems.map((item) => {
              const Icon = iconByArea[item.area];
              const external = item.url.startsWith("http");
              return (
                <a key={item.title} href={item.url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-[#BE076D]/70 hover:bg-white/[.06]">
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="text-[#DED116]" size={22} aria-hidden />
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-emerald-100">{statusLabel[item.status]}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-black uppercase tracking-tight group-hover:text-[#E43A92]">{item.shortName}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-[#D2C7D0]">{item.purpose}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#DED116]">Abrir <ArrowUpRight size={12} aria-hidden /></span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[.025] p-5">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Finanzas</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Una sola fuente financiera</h2>
            <div className="mt-5 space-y-3">
              {financeStack.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{item.title}</strong>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#D2C7D0]">{statusLabel[item.status]}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#D2C7D0]">{item.decision}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#E43A92]/30 bg-[#E43A92]/10 p-5">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-[#FFD6EA]">Limpieza</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Fuera del menú interno</h2>
            <div className="mt-5 space-y-3">
              {REMOVED_FROM_INTERNAL.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <strong>{item.title}</strong>
                  <p className="mt-2 text-sm leading-6 text-[#D2C7D0]">{item.reason}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
