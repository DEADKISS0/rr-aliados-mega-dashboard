"use client";

import { useEffect, useState } from "react";
import OpsNav from "@/components/ops/OpsNav";

type Check = { id: string; label: string; status: "ok" | "warning" | "error"; httpStatus: number; latencyMs: number };
type Event = { id: string; title: string; decision: string };

export default function SupervisorPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState("Consultando supervisión…");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("error");
  const [result, setResult] = useState<string | null>(null);
  const refresh = async () => {
    const response = await fetch("/api/supervisor", { cache: "no-store" });
    const data = await response.json();
    setChecks(data.checks ?? []);
    setEvents(data.events ?? []);
    setMessage(data.ok ? "Todos los checks operativos están dentro de rango." : "Hay señales que requieren seguimiento.");
  };
  useEffect(() => { void refresh(); }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/supervisor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type, title, severity: type === "error" ? "medium" : "high", source: "panel-supervisor" }) });
    const data = await response.json();
    setResult(data.decision ? `${data.decision.action}: ${data.decision.reason}` : data.error);
    if (response.ok) setTitle("");
  };
  return <main className="min-h-screen bg-[#070001] px-5 py-6 text-[#FFFFF3] md:px-10"><div className="mx-auto max-w-7xl">
    <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6"><div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#DED116]">RR Aliados · Control</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-6xl">Supervisor</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#D2C7D0]">Recibe errores, decisiones y requerimientos; clasifica el riesgo y propone la siguiente acción.</p></div><OpsNav active="Supervisor" /></header>
    <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="rounded-3xl border border-white/10 bg-white/[.035] p-6"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-[#DED116]">Heartbeat operativo</p><h2 className="mt-2 text-2xl font-black uppercase">Estado actual</h2></div><button onClick={() => void refresh()} className="rounded-xl bg-[#BE076D] px-4 py-2 text-xs font-bold">Actualizar</button></div><p className="mt-3 text-sm text-[#D2C7D0]">{message}</p><div className="mt-6 space-y-3">{checks.map((check) => <div key={check.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"><div><p className="font-bold">{check.label}</p><p className="mt-1 font-mono text-[10px] text-[#D2C7D0]">HTTP {check.httpStatus} · {check.latencyMs} ms</p></div><span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase ${check.status === "ok" ? "bg-green-500/15 text-green-300" : check.status === "warning" ? "bg-[#DED116]/15 text-[#DED116]" : "bg-red-500/15 text-red-300"}`}>{check.status}</span></div>)}</div>{events.length > 0 && <div className="mt-6 border-t border-white/10 pt-5"><p className="font-mono text-[10px] uppercase tracking-widest text-[#D2C7D0]">Últimos eventos</p><div className="mt-3 space-y-2">{events.slice(0, 5).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2 text-xs"><span className="truncate">{item.title}</span><span className="shrink-0 font-mono text-[10px] text-[#E43A92]">{item.decision}</span></div>)}</div></div>}</div>
    <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6"><p className="font-mono text-xs uppercase tracking-widest text-[#DED116]">Triage</p><h2 className="mt-2 text-2xl font-black uppercase">Pasar algo al supervisor</h2><form onSubmit={submit} className="mt-6 space-y-4"><select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm"><option value="error">Error</option><option value="decision">Decisión</option><option value="requirement">Requerimiento</option></select><input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Describe el asunto" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm placeholder:text-[#D2C7D0]/50" /><button className="w-full rounded-xl bg-[#DED116] px-4 py-3 text-sm font-black text-[#070001]">Analizar y clasificar</button></form>{result && <p className="mt-5 rounded-2xl border border-[#BE076D]/40 bg-[#BE076D]/10 p-4 text-sm text-[#FFFFF3]">{result}</p>}<p className="mt-6 text-xs leading-5 text-[#D2C7D0]">Las acciones irreversibles siempre se escalan. El supervisor puede diagnosticar y normalizar, pero no borra datos ni publica cambios por sí solo.</p></div></section>
  </div></main>;
}
