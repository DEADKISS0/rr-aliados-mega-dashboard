"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ChatbotWidget from "@/components/ChatbotWidget";
import CollapsibleSection from "@/components/CollapsibleSection";

type Alert = { id: string; severity: "critical" | "warning" | "info"; title: string; detail: string; href?: string };
type Snapshot = { generatedAt: string; summary: string; alerts: Alert[]; sources: { supabase: string; dashweb: string }; finance: { available: number | null; burn: number | null; runwayMonths: number | null }; counts: { activeClients: number; prospects: number; developments: number; projects: number; openTasks: number; blockedTasks: number } };
const money = (value: number | null) => value == null ? "—" : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const time = (value: string) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function OperationsHome() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ops/briefing", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.snapshot) throw new Error(payload.error || "Briefing no disponible");
      setSnapshot(payload.snapshot); setError(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Briefing no disponible"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  return <main className="min-h-screen bg-[#070001] px-5 py-6 text-[#FFFFF3] md:px-10"><div className="mx-auto max-w-7xl">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6"><div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#DED116]">RR Aliados · Centro de comando</p><h1 className="mt-2 text-5xl font-black uppercase tracking-tight md:text-7xl">Hoy</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#D2C7D0]">Qué está pasando, qué requiere atención y cuál es el siguiente movimiento.</p></div><button onClick={() => void refresh()} className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold transition hover:border-[#DED116] hover:text-[#DED116]" disabled={loading}>{loading ? "Actualizando…" : "Actualizar briefing"}</button></header>
    {error && <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
    {snapshot && <>
      <section className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]"><article className="rounded-3xl border border-[#BE076D]/50 bg-[#BE076D]/10 p-6 shadow-2xl shadow-[#BE076D]/10"><div className="flex items-center justify-between gap-4"><p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Escupitajo del día</p><span className="rounded-full bg-green-400/10 px-3 py-1 font-mono text-[10px] uppercase text-green-300">Contexto calculado</span></div><p className="mt-5 max-w-3xl text-2xl font-bold leading-tight md:text-4xl">{snapshot.summary}</p><p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-[#D2C7D0]">Actualizado {time(snapshot.generatedAt)}</p></article><article className="rounded-3xl border border-white/10 bg-white/[.035] p-6"><p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Salud financiera</p><p className="mt-4 text-4xl font-black">{snapshot.finance.runwayMonths == null ? "—" : `${snapshot.finance.runwayMonths.toFixed(1)}m`}</p><p className="text-sm text-[#D2C7D0]">runway estimado</p><div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs"><div className="flex justify-between"><span className="text-[#D2C7D0]">Disponible</span><strong>{money(snapshot.finance.available)}</strong></div><div className="flex justify-between"><span className="text-[#D2C7D0]">Burn mensual</span><strong>{money(snapshot.finance.burn)}</strong></div></div></article></section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[snapshot.counts.activeClients,"Clientes activos","/ops/clientes"],[snapshot.counts.prospects,"Prospectos","/ops/clientes"],[snapshot.counts.openTasks,"Pendientes DashWeb","https://dashweb-core-frontend-beta.up.railway.app/login"],[snapshot.counts.developments,"Desarrollos internos","/ops/desarrollos"]].map(([value,label,href]) => <Link key={String(label)} href={String(href)} className="rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-0.5 hover:border-[#BE076D]/60"><p className="text-3xl font-black text-[#DED116]">{String(value)}</p><p className="mt-1 text-xs uppercase tracking-widest text-[#D2C7D0]">{String(label)}</p></Link>)}</section>
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-5"><div className="flex items-center justify-between"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-[#DED116]">Atención</p><h2 className="mt-2 text-2xl font-black uppercase">Alertas y próximos pasos</h2></div><Link href="/ops/supervisor" className="text-xs font-bold text-[#DED116] hover:text-[#E43A92]">Abrir supervisor →</Link></div><div className="mt-5 grid gap-3 md:grid-cols-2">{snapshot.alerts.length ? snapshot.alerts.map((alert) => <Link key={alert.id} href={alert.href || "/ops/supervisor"} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[#DED116]/50"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${alert.severity === "critical" ? "bg-red-400" : alert.severity === "warning" ? "bg-[#DED116]" : "bg-[#E43A92]"}`} /><strong>{alert.title}</strong></div><p className="mt-2 text-sm text-[#D2C7D0]">{alert.detail}</p></Link>) : <p className="rounded-2xl bg-black/20 p-4 text-sm text-[#D2C7D0]">No hay alertas determinísticas activas.</p>}</div></section>
      <CollapsibleSection title="Detalle de fuentes" icon="◌" sectionId="ops-sources"><div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm"><p>Supabase: <strong className="text-[#DED116]">{snapshot.sources.supabase}</strong></p><p className="mt-2">DashWeb: <strong className="text-[#DED116]">{snapshot.sources.dashweb}</strong></p><p className="mt-3 text-xs text-[#D2C7D0]">El directorio de clientes y desarrollos se conserva como catálogo editorial hasta migrarlo a una fuente única.</p></div></CollapsibleSection>
    </>}
  </div><ChatbotWidget /></main>;
}
