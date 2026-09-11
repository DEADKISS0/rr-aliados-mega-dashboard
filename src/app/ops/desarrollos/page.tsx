import Link from "next/link";
import { DEVELOPMENTS } from "@/data/developments";
import OpsNav from "@/components/ops/OpsNav";

export default function DesarrollosPage() {
  return (
    <main className="min-h-screen bg-[#070001] px-5 py-6 text-[#FFFFF3] md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <Link href="/ops/finanzas" className="mb-3 inline-block text-xs font-mono uppercase tracking-widest text-[#D2C7D0] hover:text-[#DED116]">← Centro operativo</Link>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#DED116]">RR Aliados · Ecosistema</p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-6xl">Desarrollos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#D2C7D0]">Inventario vivo de productos internos, prototipos y sistemas que soportan la operación de RR.</p>
          </div>
          <OpsNav active="Desarrollos" />
        </header>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEVELOPMENTS.map((development) => (
            <a key={development.title} href={development.url} target={development.url.startsWith("/") ? undefined : "_blank"} rel={development.url.startsWith("/") ? undefined : "noreferrer"} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:border-[#BE076D]/70 hover:bg-white/[.06]">
              <span className="font-mono text-xs tracking-widest text-[#DED116]">{development.number} / BUILD</span>
              <h2 className="mt-12 text-2xl font-black uppercase tracking-tight group-hover:text-[#E43A92]">{development.title} <span className="text-[#DED116]">↗</span></h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#D2C7D0]">{development.description}</p>
              <span className="mt-8 block font-mono text-[10px] uppercase tracking-[.18em] text-[#D2C7D0]">Abrir desarrollo</span>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
