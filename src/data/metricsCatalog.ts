import { getBusinessContext } from "./businessContext";

/** Parse report index date (e.g. "2026-07-17_0519") to Date at noon local. */
export function parseReportDate(raw?: string): Date | null {
  if (!raw) return null;
  const datePart = raw.split("_")[0];
  const parsed = new Date(`${datePart}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Human-readable age from the latest predicciones_index entry. */
export function formatRelativeReportAge(latestDate?: string): string {
  const parsed = parseReportDate(latestDate);
  if (!parsed) return "Sin reportes recientes";

  const diffDays = Math.floor((Date.now() - parsed.getTime()) / 86_400_000);
  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays}d`;
  if (diffDays < 14) return "Hace 1 sem";
  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "Hace 1 sem" : `Hace ${weeks} sem`;
}

/** Count report entries whose date falls within the last 7 days. */
export function countReportsThisWeek(dates: string[]): number {
  const cutoff = Date.now() - 7 * 86_400_000;
  return dates.filter((d) => {
    const parsed = parseReportDate(d);
    return parsed !== null && parsed.getTime() >= cutoff;
  }).length;
}

export interface ReportTrendContext {
  latestPredictionDate?: string;
  predictionDates?: string[];
}

export interface Metric {
  id: string;
  label: string;
  icon: string;
  value: string | number;
  subtitle?: string;
  color: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

export function getMetrics(
  predictionReports: number,
  strategicReports: number,
  installedSkills: number,
  totalSkills: number,
  reportTrend?: ReportTrendContext
): Metric[] {
  const ctx = getBusinessContext();
  const thisWeek = reportTrend?.predictionDates
    ? countReportsThisWeek(reportTrend.predictionDates)
    : undefined;
  const latestAge = formatRelativeReportAge(reportTrend?.latestPredictionDate);
  const reportsTrendValue =
    thisWeek !== undefined && thisWeek > 0
      ? `+${thisWeek} esta semana · ${latestAge}`
      : predictionReports > 0
        ? `${predictionReports} predicciones · ${latestAge}`
        : latestAge;

  return [
    {
      id: "reports",
      label: "Reportes Totales",
      icon: "📊",
      value: predictionReports + strategicReports,
      subtitle: `${predictionReports} pred · ${strategicReports} estr`,
      color: "var(--ember)",
      trend: (thisWeek ?? 0) > 0 || predictionReports > 0 ? "up" : "stable",
      trendValue: reportsTrendValue,
    },
    {
      id: "skills",
      label: "Skills Instaladas",
      icon: "⚡",
      value: `${installedSkills}/${totalSkills}`,
      subtitle: `${((installedSkills / totalSkills) * 100).toFixed(1)}% del catálogo`,
      color: installedSkills === 36 ? "var(--success)" : "var(--warning)",
      trend: installedSkills === 36 ? "stable" : "down",
      trendValue: installedSkills === 36 ? "Sincronizado" : "Ejecutar sync_skills.py",
    },
    {
      id: "clients",
      label: "Meta Q3 Clientes",
      icon: "🎯",
      value: `${ctx.clientsClosed}/${ctx.clientsTargetQ3}`,
      subtitle: "Objetivo supervivencia 2026",
      color: "var(--ember-light)",
      trend: ctx.clientsClosed > 0 ? "up" : "stable",
      trendValue: ctx.wuunderDaysLeft <= 14 ? `Wuunder: ${ctx.wuunderDaysLeft}d` : "En negociación",
    },
    {
      id: "runway",
      label: "Runway",
      icon: "💰",
      value: `${ctx.runwayDays}d`,
      subtitle: "Días de caja restantes",
      color: ctx.runwayDays < 90 ? "var(--danger)" : "var(--success)",
      trend: ctx.runwayDays < 90 ? "down" : "stable",
      trendValue: `Burn ~${Math.round(ctx.monthlyBurnCop / 1000)}K/mes`,
    },
    {
      id: "apps",
      label: "Apps Integradas",
      icon: "🔗",
      value: 6,
      subtitle: "Ecosistema RR ALIADOS",
      color: "var(--ember)",
      trend: "stable",
    },
    {
      id: "pipeline",
      label: "Pipeline",
      icon: "🔥",
      value: "Wuunder",
      subtitle: "Prioridad #1 — negociación activa",
      color: "var(--ember-light)",
      trend: "up",
      trendValue: `$36M-$42M COP`,
    },
  ];
}
