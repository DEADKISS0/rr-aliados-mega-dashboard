import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AutomationJob {
  id: string;
  name: string;
  status: "ok" | "warning" | "error" | "unknown";
  lastRun?: string;
  detail: string;
  ageHours?: number;
}

const STALE_OK_H = 24;
const STALE_WARN_H = 72;

function statusFromAge(
  exists: boolean,
  ageHours: number | undefined
): AutomationJob["status"] {
  if (!exists) return "error";
  if (ageHours === undefined) return "unknown";
  if (ageHours <= STALE_OK_H) return "ok";
  if (ageHours <= STALE_WARN_H) return "warning";
  return "error";
}

function formatLastRun(d: Date): string {
  return d.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/** Parse MiroFish index stamps like "2026-07-17 05:19" or "2026-07-17_0519". */
function parseIndexStamp(raw?: string): Date | undefined {
  if (!raw) return undefined;
  const m = raw.match(/(\d{4})-(\d{2})-(\d{2})(?:[_\s](\d{2}):?(\d{2}))?/);
  if (!m) return undefined;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const hh = Number(m[4] ?? "0");
  const mm = Number(m[5] ?? "0");
  if (!y || !mo || !d) return undefined;
  return new Date(y, mo - 1, d, hh, mm);
}

function ageHoursFrom(d: Date): number {
  return (Date.now() - d.getTime()) / 3_600_000;
}

async function readIndexFreshness(relPath: string): Promise<{
  exists: boolean;
  stamp?: Date;
  label?: string;
  ageHours?: number;
  source?: "index" | "mtime";
}> {
  const full = path.join(process.cwd(), "public", relPath);
  try {
    const raw = await fs.readFile(full, "utf8");
    const data = JSON.parse(raw) as {
      reports?:
        | Array<{ label?: string; date?: string }>
        | {
            diarios?: Array<{ label?: string; date?: string; name?: string }>;
          };
      generated_at?: string;
      updatedAt?: string;
    };
    const list = Array.isArray(data.reports)
      ? data.reports
      : data.reports?.diarios ?? [];
    const first = list[0];
    const label =
      first?.label ||
      ("name" in (first ?? {}) ? (first as { name?: string }).name : undefined) ||
      first?.date ||
      data.generated_at ||
      data.updatedAt;
    const fromIndex = parseIndexStamp(label) || parseIndexStamp(first?.date);
    if (fromIndex) {
      return {
        exists: true,
        stamp: fromIndex,
        label,
        ageHours: ageHoursFrom(fromIndex),
        source: "index",
      };
    }
    const st = await fs.stat(full);
    return {
      exists: true,
      stamp: st.mtime,
      label,
      ageHours: ageHoursFrom(st.mtime),
      source: "mtime",
    };
  } catch {
    try {
      const st = await fs.stat(full);
      return {
        exists: true,
        stamp: st.mtime,
        ageHours: ageHoursFrom(st.mtime),
        source: "mtime",
      };
    } catch {
      return { exists: false };
    }
  }
}

async function statPublic(relPath: string): Promise<{
  exists: boolean;
  stamp?: Date;
  ageHours?: number;
}> {
  const full = path.join(process.cwd(), "public", relPath);
  try {
    const st = await fs.stat(full);
    // Prefer content timestamps when file embeds updatedAt (finance snapshot)
    try {
      const raw = await fs.readFile(full, "utf8");
      const data = JSON.parse(raw) as { updatedAt?: string };
      const parsed = parseIndexStamp(data.updatedAt);
      if (parsed) {
        return { exists: true, stamp: parsed, ageHours: ageHoursFrom(parsed) };
      }
    } catch {
      /* binary or non-json */
    }
    return { exists: true, stamp: st.mtime, ageHours: ageHoursFrom(st.mtime) };
  } catch {
    return { exists: false };
  }
}

export async function GET() {
  const now = new Date();

  const [pred, strat, opt, finance] = await Promise.all([
    readIndexFreshness("reports/predicciones_index.json"),
    readIndexFreshness("reports/estrategicos_index.json"),
    readIndexFreshness("optimizacion/reports_index.json"),
    statPublic("data/finance_snapshot.json"),
  ]);

  const syncAge = Math.max(pred.ageHours ?? 999, strat.ageHours ?? 999);

  const jobs: AutomationJob[] = [
    {
      id: "mirofish-daily",
      name: "MiroFish Predicciones",
      status: statusFromAge(pred.exists, pred.ageHours),
      lastRun: pred.stamp ? formatLastRun(pred.stamp) : undefined,
      detail: pred.label
        ? `Índice: ${pred.label} (fuente ${pred.source})`
        : "enhanced_report.py → predicciones_index.json",
      ageHours: pred.ageHours !== undefined ? Math.round(pred.ageHours * 10) / 10 : undefined,
    },
    {
      id: "strategic",
      name: "Reporte Estratégico",
      status: statusFromAge(strat.exists, strat.ageHours),
      lastRun: strat.stamp ? formatLastRun(strat.stamp) : undefined,
      detail: strat.label
        ? `Índice: ${strat.label} (fuente ${strat.source})`
        : "reporte_optimizacion_estrategica.py → estrategicos_index.json",
      ageHours: strat.ageHours !== undefined ? Math.round(strat.ageHours * 10) / 10 : undefined,
    },
    {
      id: "optimization",
      name: "Índice Optimización (archivo)",
      status: statusFromAge(opt.exists, opt.ageHours),
      lastRun: opt.stamp ? formatLastRun(opt.stamp) : undefined,
      detail: "optimization_report.py → optimizacion/reports_index.json (no montado en UI)",
      ageHours: opt.ageHours !== undefined ? Math.round(opt.ageHours * 10) / 10 : undefined,
    },
    {
      id: "reports-sync",
      name: "Sync Reportes PDF",
      status: pred.exists && strat.exists ? statusFromAge(true, syncAge) : "warning",
      lastRun:
        pred.stamp || strat.stamp
          ? formatLastRun(
              new Date(Math.max(pred.stamp?.getTime() ?? 0, strat.stamp?.getTime() ?? 0))
            )
          : undefined,
      detail: "scripts/sync_reports.ps1 — frescura desde fechas del índice (no mtime Vercel)",
    },
    {
      id: "finance-snapshot",
      name: "Finance Snapshot",
      status: finance.exists ? "ok" : "warning",
      lastRun: finance.stamp ? formatLastRun(finance.stamp) : undefined,
      detail: finance.exists
        ? "public/data/finance_snapshot.json — capital/burn (sin CRM)"
        : "Falta finance_snapshot.json",
    },
    {
      id: "skills-sync",
      name: "Skills Sync",
      status: "warning",
      lastRun: "Manual",
      detail: "Catálogo compilado en bundle — ejecutar sync_skills.py antes de deploy (meta 36=36)",
    },
    {
      id: "vercel-deploy",
      name: "Deploy Vercel",
      status: "ok",
      lastRun: "rr-aliados-mega-dashboard.vercel.app",
      detail: "Build en Vercel. Salud de reportes = fecha del índice JSON.",
    },
  ];

  const summary = {
    ok: jobs.filter((j) => j.status === "ok").length,
    warning: jobs.filter((j) => j.status === "warning").length,
    error: jobs.filter((j) => j.status === "error").length,
    total: jobs.length,
    staleThresholdHours: STALE_OK_H,
  };

  return NextResponse.json({
    updatedAt: now.toISOString(),
    jobs,
    summary,
  });
}
