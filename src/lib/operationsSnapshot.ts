import { promises as fs } from "fs";
import path from "path";
import { CLIENTS } from "@/data/clients";
import { DEVELOPMENTS } from "@/data/developments";
import { getBusinessContext, formatCop } from "@/data/businessContext";
import { getDashWebTasks, type DashWebTask } from "@/lib/dashweb";
import { getSupabaseServer } from "@/lib/finance/supabase";
import type { CashMovementRecord, FinancialSnapshot, ProjectRecord, SyncRun } from "@/lib/finance/types";

export type OperationsAlert = { id: string; severity: "critical" | "warning" | "info"; title: string; detail: string; href?: string };
export type OperationsSnapshot = {
  generatedAt: string;
  sources: { supabase: "live" | "unavailable" | "error"; dashweb: "live" | "unavailable" | "error"; directory: "static" };
  finance: { available: number | null; burn: number | null; runwayMonths: number | null; syncedAt?: string };
  projects: ProjectRecord[]; tasks: DashWebTask[]; cashMovements: CashMovementRecord[]; syncRuns: SyncRun[];
  alerts: OperationsAlert[];
  counts: { clients: number; activeClients: number; prospects: number; developments: number; projects: number; openTasks: number; blockedTasks: number };
  summary: string;
};
type ReportIndex = { reports?: Array<{ label?: string; date?: string }> };

async function readReportDate(file: string) {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", file), "utf8");
    const data = JSON.parse(raw) as ReportIndex;
    return data.reports?.[0]?.label || data.reports?.[0]?.date;
  } catch { return undefined; }
}
function daysSince(value?: string) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? Math.max(0, (Date.now() - time) / 86_400_000) : null;
}

export async function buildOperationsSnapshot(): Promise<OperationsSnapshot> {
  const generatedAt = new Date().toISOString();
  const supabase = getSupabaseServer();
  const ctx = getBusinessContext();
  const sources: OperationsSnapshot["sources"] = { supabase: supabase ? "live" : "unavailable", dashweb: "unavailable", directory: "static" };
  let projects: ProjectRecord[] = [], cashMovements: CashMovementRecord[] = [], syncRuns: SyncRun[] = [], financial: FinancialSnapshot | null = null;
  if (supabase) {
    const [projectResult, cashResult, syncResult, financialResult] = await Promise.all([
      supabase.from("projects").select("*").order("nombre").limit(200),
      supabase.from("cash_movements").select("*").order("fecha", { ascending: false }).limit(100),
      supabase.from("sync_runs").select("*").order("started_at", { ascending: false }).limit(30),
      supabase.from("financial_snapshots").select("*").order("synced_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    if (projectResult.error || cashResult.error || syncResult.error || financialResult.error) sources.supabase = "error";
    projects = (projectResult.data ?? []) as ProjectRecord[]; cashMovements = (cashResult.data ?? []) as CashMovementRecord[]; syncRuns = (syncResult.data ?? []) as SyncRun[]; financial = (financialResult.data ?? null) as FinancialSnapshot | null;
  }
  const dashweb = await getDashWebTasks();
  if (dashweb.configured) sources.dashweb = dashweb.error ? "error" : "live";
  const tasks = dashweb.tasks;
  const openTasks = tasks.filter((task) => !["DONE", "CANCELLED"].includes(task.status));
  const blockedTasks = tasks.filter((task) => task.status === "BLOCKED");
  const staleTasks = openTasks.filter((task) => (daysSince(task.updatedAt) ?? 0) >= 5);
  const runwayMonths = financial?.runway_meses != null ? Number(financial.runway_meses) : ctx.runwayMonths;
  const available = financial?.disponible_hoy != null ? Number(financial.disponible_hoy) : ctx.capitalCop;
  const burn = financial?.burn_mensual != null ? Number(financial.burn_mensual) : ctx.monthlyBurnCop;
  const alerts: OperationsAlert[] = [];
  if (runwayMonths < 3) alerts.push({ id: "runway-critical", severity: "critical", title: "Runway crítico", detail: `${runwayMonths.toFixed(1)} meses de caja estimados. Revisar burn y cobros hoy.`, href: "/ops/finanzas" });
  else if (runwayMonths < 6) alerts.push({ id: "runway-warning", severity: "warning", title: "Runway en vigilancia", detail: `${runwayMonths.toFixed(1)} meses de caja estimados.`, href: "/ops/finanzas" });
  if (blockedTasks.length) alerts.push({ id: "blocked-tasks", severity: "critical", title: `${blockedTasks.length} tarea${blockedTasks.length === 1 ? "" : "s"} bloqueada${blockedTasks.length === 1 ? "" : "s"}`, detail: blockedTasks.slice(0, 3).map((task) => task.title).join(" · "), href: "/ops/supervisor" });
  if (staleTasks.length) alerts.push({ id: "stale-tasks", severity: "warning", title: `${staleTasks.length} pendiente${staleTasks.length === 1 ? "" : "s"} sin actividad`, detail: "Hay tareas abiertas sin actualización en 5 días o más.", href: "https://dashweb-core-frontend-beta.up.railway.app/login" });
  if (!supabase) alerts.push({ id: "supabase-unavailable", severity: "warning", title: "Finanzas en modo respaldo", detail: "Supabase no está disponible; los KPIs usan el último contexto local conocido.", href: "/ops/finanzas" });
  if (dashweb.error) alerts.push({ id: "dashweb-unavailable", severity: "warning", title: "DashWeb sin respuesta", detail: "El briefing no pudo validar tareas externas en este ciclo.", href: "/ops/supervisor" });
  const [predDate, stratDate] = await Promise.all([readReportDate("reports/predicciones_index.json"), readReportDate("reports/estrategicos_index.json")]);
  if (!predDate && !stratDate) alerts.push({ id: "reports-missing", severity: "info", title: "Sin señales MiroFish recientes", detail: "Revisar la sincronización de reportes.", href: "/ops/supervisor" });
  const topAction = blockedTasks[0]?.title || staleTasks[0]?.title || (ctx.wuunderDaysLeft <= 14 ? "Avanzar cierre de Wuundeer" : "Revisar los pendientes prioritarios");
  const critical = alerts.filter((alert) => alert.severity === "critical").length;
  const summary = critical ? `Hoy hay ${critical} alerta${critical === 1 ? " crítica" : "s críticas"}. Prioridad inmediata: ${topAction}.` : `Operación estable. Prioridad de hoy: ${topAction}. Hay ${openTasks.length} pendiente${openTasks.length === 1 ? "" : "s"} abierto${openTasks.length === 1 ? "" : "s"}.`;
  const liveSources = [sources.supabase === "live" ? "Supabase" : "", sources.dashweb === "live" ? "DashWeb" : ""].filter(Boolean);
  return { generatedAt, sources, finance: { available, burn, runwayMonths, syncedAt: financial?.synced_at }, projects, tasks, cashMovements, syncRuns, alerts: alerts.slice(0, 6), counts: { clients: CLIENTS.length, activeClients: CLIENTS.filter((client) => client.status === "active").length, prospects: CLIENTS.filter((client) => client.status === "prospect").length, developments: DEVELOPMENTS.length, projects: projects.length, openTasks: openTasks.length, blockedTasks: blockedTasks.length }, summary: `${summary} Fuente: ${liveSources.length ? liveSources.join(" + ") : "directorio local"}. Caja: ${formatCop(available)} · burn: ${formatCop(burn)}/mes.` };
}
