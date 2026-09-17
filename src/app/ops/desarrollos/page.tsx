import Link from "next/link";
import { ArrowUpRight, Archive, CheckCircle2, GitBranch, RefreshCcw, ShieldCheck } from "lucide-react";
import { OPS_DEVELOPMENTS, REMOVED_FROM_INTERNAL, type OpsDevelopmentStatus } from "@/data/developments";
import OpsNav from "@/components/ops/OpsNav";

const statusCopy: Record<OpsDevelopmentStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  core: { label: "Core interno", className: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100", icon: ShieldCheck },
  consolidar: { label: "Consolidar", className: "border-[#DED116]/40 bg-[#DED116]/10 text-[#FFF6A3]", icon: RefreshCcw },
  soporte: { label: "Soporte", className: "border-sky-300/30 bg-sky-300/10 text-sky-100", icon: GitBranch },
  retirar: { label: "Retirar / migrar", className: "border-[#E43A92]/40 bg-[#E43A92]/10 text-[#FFD6EA]", icon: Archive },
};

const counts = {
  core: OPS_DEVELOPMENTS.filter((item) => item.status === "core").length,
  consolidar: OPS_DEVELOPMENTS.filter((item) => item.status === "consolidar").length,
  retirar: OPS_DEVELOPMENTS.filter((item) => item.status === "retirar").length,
};

const grouped = OPS_DEVELOPMENTS.reduce<Record<string, typeof OPS_DEVELOPMENTS>>((acc, item) => {
  acc[item.area] = [...(acc[item.area] || []), item];
  return acc;
}, {});

export default function DesarrollosPage() {
  return (
    <main className="min-h-screen bg-[#070001] px-5 py-6 text-[#FFFFF3] md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <Link href="/ops" className="mb-3 inline-block text-xs font-mono uppercase tracking-widest text-[#D2C7D0] hover:text-[#DED116]">← Centro interno</Link>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#DED116]">RR Aliados · Arquitectura interna</p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-6xl">Desarrollos</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#D2C7D0]">
              Registro único del apartado interno: qué se opera, qué se consolida y qué deja de vivir como herramienta activa.
            </p>
          </div>
          <OpsNav active="Desarrollos" />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-emerald-100">Operar</p>
            <strong className="mt-2 block text-4xl font-black">{counts.core}</strong>
            <p className="mt-1 text-sm text-[#D2C7D0]">apps core que quedan vivas y visibles.</p>
          </div>
          <div className="rounded-2xl border border-[#DED116]/25 bg-[#DED116]/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#FFF6A3]">Unificar</p>
            <strong className="mt-2 block text-4xl font-black">{counts.consolidar}</strong>
            <p className="mt-1 text-sm text-[#D2C7D0]">flujo que entra al Mega Dashboard.</p>
          </div>
          <div className="rounded-2xl border border-[#E43A92]/25 bg-[#E43A92]/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#FFD6EA]">Limpiar</p>
            <strong className="mt-2 block text-4xl font-black">{counts.retirar + REMOVED_FROM_INTERNAL.length}</strong>
            <p className="mt-1 text-sm text-[#D2C7D0]">duplicados o herramientas fuera del interno.</p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-5">
          <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Decisión de arquitectura</p>
              <h2 className="mt-2 text-2xl font-black uppercase">Mega Dashboard no será un basurero de links</h2>
            </div>
            <p className="text-sm leading-6 text-[#D2C7D0]">
              El interno queda como centro de mando: Finanzas, Contenido, Precontratos, Commander y Kotizador tienen lugar claro.
              Los duplicados financieros se migran hacia RR Finanzas. Las herramientas que no aportan al flujo diario salen del menú interno.
            </p>
          </div>
        </section>

        <section className="mt-6 space-y-6">
          {Object.entries(grouped).map(([area, items]) => (
            <div key={area}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black uppercase tracking-tight">{area}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#D2C7D0]">{items.length} desarrollos</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {items.map((item) => {
                  const status = statusCopy[item.status];
                  const Icon = status.icon;
                  const external = item.url.startsWith("http");
                  return (
                    <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[.035] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#DED116]">{item.number} / {item.shortName}</span>
                          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold ${status.className}`}>
                          <Icon size={14} aria-hidden />
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#D2C7D0]">{item.purpose}</p>
                      <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#D2C7D0]">Datos</span>
                          <p className="mt-2 text-[#FFFFF3]">{item.dataSource}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#D2C7D0]">Decisión</span>
                          <p className="mt-2 text-[#FFFFF3]">{item.decision}</p>
                        </div>
                      </div>
                      <p className="mt-4 rounded-xl border border-[#DED116]/20 bg-[#DED116]/10 p-3 text-sm leading-6 text-[#FFF6A3]">{item.nextStep}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <a href={item.url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold transition hover:border-[#DED116] hover:text-[#DED116]">
                          Abrir <ArrowUpRight size={14} aria-hidden />
                        </a>
                        {item.repo && <a href={`https://github.com/${item.repo}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-[#D2C7D0] transition hover:border-[#BE076D] hover:text-[#FFFFF3]">Repo</a>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-[#E43A92]/30 bg-[#E43A92]/10 p-5">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-[#FFD6EA]">Fuera del interno</p>
          <h2 className="mt-2 text-2xl font-black uppercase">Borrar del flujo activo</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {REMOVED_FROM_INTERNAL.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <strong>{item.title}</strong>
                <p className="mt-2 text-sm leading-6 text-[#D2C7D0]">{item.reason}</p>
                <p className="mt-3 text-sm text-[#FFFFF3]">Reemplazo: {item.replacement}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
