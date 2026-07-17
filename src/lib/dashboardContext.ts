import { promises as fs } from "fs";
import path from "path";
import { getBusinessContext, formatCop } from "@/data/businessContext";
import { deals, salesMetrics } from "@/data/salesPipeline";

export interface DashboardGrounding {
  text: string;
  generatedAt: string;
  pitchSections: Array<{ title: string; content: string; type: string }>;
}

async function readJsonSafe<T>(relPublic: string): Promise<T | null> {
  try {
    const full = path.join(process.cwd(), "public", relPublic);
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function buildDashboardGrounding(): Promise<DashboardGrounding> {
  const ctx = getBusinessContext();
  const generatedAt = new Date().toISOString();

  const [pred, strat, finance] = await Promise.all([
    readJsonSafe<{ reports?: Array<{ label?: string; date?: string; summary?: Record<string, unknown> }> }>(
      "reports/predicciones_index.json"
    ),
    readJsonSafe<{ reports?: Array<{ label?: string; date?: string; summary?: Record<string, unknown> }> }>(
      "reports/estrategicos_index.json"
    ),
    readJsonSafe<{ updatedAt?: string; notes?: string }>("data/finance_snapshot.json"),
  ]);

  const latestPred = pred?.reports?.[0];
  const latestStrat = strat?.reports?.[0];

  const dealLines = deals
    .map(
      (d) =>
        `- ${d.name} [${d.status}/${d.priority}] valor ${d.value} · fee ${d.monthlyFee} · next: ${d.nextStep}`
    )
    .join("\n");

  const metricsLine = salesMetrics.map((m) => `${m.label}: ${m.value}`).join(" · ");

  const text = [
    `CONTEXTO VIVO RR ALIADOS (${generatedAt})`,
    `Capital: ${formatCop(ctx.capitalCop)} · Burn/mes: ${formatCop(ctx.monthlyBurnCop)} · Runway: ~${ctx.runwayDays} días (~${Math.floor(ctx.runwayMonths)} meses)`,
    `Q3 clientes: ${ctx.clientsClosed}/${ctx.clientsTargetQ3} · MRR actual: ${ctx.meta5Year.currentMrr} · Meta Q3 MRR: ${ctx.meta5Year.q3MrrTarget}`,
    `Wuunder deadline: ${ctx.wuunderDeadline} (${ctx.wuunderDaysLeft} días) · MRR est. si cierra: ${formatCop(ctx.wuunderExpectedMrrCop)}`,
    `Meta 5 años: ${ctx.meta5Year.horizon} → ${ctx.meta5Year.targetMrr} / ${ctx.meta5Year.targetClients} clientes`,
    finance?.updatedAt ? `Finance snapshot: ${finance.updatedAt}${finance.notes ? ` — ${finance.notes}` : ""}` : "",
    `PIPELINE INTERNO (snapshot TS — NO CRM):`,
    metricsLine,
    dealLines,
    `ÚLTIMO REPORTE PREDICCIONES: ${latestPred?.label || latestPred?.date || "n/d"} · cambios=${String(latestPred?.summary?.total_changes ?? "n/d")} riesgos=${String(latestPred?.summary?.risks ?? "n/d")}`,
    `ÚLTIMO REPORTE ESTRATÉGICO: ${latestStrat?.label || latestStrat?.date || "n/d"} · progreso=${String(latestStrat?.summary?.progreso ?? "n/d")} acciones=${String(latestStrat?.summary?.acciones ?? "n/d")}`,
    `REGLAS: Usa solo este contexto para KPIs/deals/runway. Si falta dato, dilo. No inventes clientes cerrados ni MRR. Deals son snapshot interno, no CRM en vivo.`,
  ]
    .filter(Boolean)
    .join("\n");

  const pitchSections = [
    {
      title: "Resumen ejecutivo",
      type: "text",
      content: `<p><strong>RR ALIADOS S.A.S.</strong> — tecnología en posicionamiento digital (Colombia).</p>
<p>Capital disponible: <strong>${escapeHtml(formatCop(ctx.capitalCop))}</strong> · Burn: <strong>${escapeHtml(formatCop(ctx.monthlyBurnCop))}/mes</strong> · Runway: <strong>~${ctx.runwayDays} días</strong>.</p>
<p>MRR actual: <strong>${escapeHtml(ctx.meta5Year.currentMrr)}</strong> · Clientes Q3: <strong>${ctx.clientsClosed}/${ctx.clientsTargetQ3}</strong> (meta MRR Q3 ${escapeHtml(ctx.meta5Year.q3MrrTarget)}).</p>
<p>Prioridad crítica: cerrar <strong>Wuunder</strong> antes del <strong>${escapeHtml(ctx.wuunderDeadline)}</strong> (${ctx.wuunderDaysLeft} días).</p>`,
    },
    {
      title: "Pipeline comercial (interno)",
      type: "list",
      content: `<p>${escapeHtml(metricsLine)}</p><ul>${deals
        .map(
          (d) =>
            `<li><strong>${escapeHtml(d.name)}</strong> — ${escapeHtml(d.status)} · ${escapeHtml(d.value)} · ${escapeHtml(d.nextStep)}</li>`
        )
        .join("")}</ul><p><em>Snapshot interno del Mega Dashboard — no sincronizado con CRM externo.</em></p>`,
    },
    {
      title: "Señales operativas (MiroFish)",
      type: "text",
      content: `<p><strong>Predicciones:</strong> ${escapeHtml(latestPred?.label || "n/d")} — cambios ${escapeHtml(String(latestPred?.summary?.total_changes ?? "n/d"))}, riesgos ${escapeHtml(String(latestPred?.summary?.risks ?? "n/d"))}.</p>
<p><strong>Estratégico:</strong> ${escapeHtml(latestStrat?.label || "n/d")} — progreso ${escapeHtml(String(latestStrat?.summary?.progreso ?? "n/d"))}, acciones ${escapeHtml(String(latestStrat?.summary?.acciones ?? "n/d"))}.</p>`,
    },
    {
      title: "Visión y próximo hito",
      type: "text",
      content: `<p>Horizonte ${escapeHtml(ctx.meta5Year.horizon)}: ${escapeHtml(ctx.meta5Year.targetMrr)} MRR · ${ctx.meta5Year.targetClients} clientes · equipo ~${ctx.meta5Year.teamTarget}.</p>
<p><strong>Qué hacer hoy:</strong> (1) avanzar firma Wuunder, (2) mantener loop MiroFish sync→deploy, (3) empujar Real Seguros / Fisio según probabilidad.</p>`,
    },
  ];

  return { text, generatedAt, pitchSections };
}
