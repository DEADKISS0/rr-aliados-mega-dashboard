// ⚠️ SOLO SERVIDOR — NO importar desde componentes cliente ("use client").
// Aquí viven las CIFRAS FINANCIERAS REALES (capital, burn, salarios). Este módulo
// solo lo importan route handlers y libs de servidor, así que NUNCA llega al
// bundle del navegador. El cliente recibe estos datos únicamente vía la API
// ops-only /api/pipeline (y por tanto solo cuando hay sesión ops).
import {
  buildBusinessContext,
  type BusinessContext,
  type FinanceSnapshot,
} from "@/data/businessContext";

export interface CostItem {
  name: string;
  amount: string;
  period: string;
  type: "fijo" | "variable";
}

export interface FinancialMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend?: "up" | "down" | "stable";
  subtitle?: string;
}

export interface DeadlineItem {
  event: string;
  deadline: string;
  urgency: "critico" | "alto" | "medio";
}

// Snapshot real. Editar aquí (o migrar a variables de entorno) tras eventos de
// capital o cierre de Wuunder. No lee CRM.
export const REAL_FINANCE_SNAPSHOT: FinanceSnapshot = {
  updatedAt: process.env.FINANCE_UPDATED_AT?.trim() || "2026-07-17",
  capitalCop: Number(process.env.FINANCE_CAPITAL_COP ?? 5_000_000),
  monthlyBurnCop: Number(process.env.FINANCE_BURN_COP ?? 450_000),
  wuunderDeadline: process.env.FINANCE_WUUNDER_DEADLINE?.trim() || "2026-07-31",
  wuunderExpectedMrrCop: Number(process.env.FINANCE_WUUNDER_MRR_COP ?? 3_000_000),
  clientsClosed: Number(process.env.FINANCE_CLIENTS_CLOSED ?? 0),
  clientsTargetQ3: Number(process.env.FINANCE_CLIENTS_TARGET_Q3 ?? 3),
  notes: "Snapshot manual. Actualizar tras eventos de capital o cierre Wuunder. No lee CRM.",
};

export const REAL_FINANCIAL_METRICS: FinancialMetric[] = [
  { label: "Capital Disponible", value: "$5M COP", icon: "💰", color: "var(--warning)", subtitle: "Post-auditoría Jul 2026" },
  { label: "Costo Mensual (mín)", value: "$450K COP", icon: "📉", color: "var(--warning)", subtitle: "Suscripciones + honorarios" },
  { label: "Costo Mensual (equipo)", value: "$800K-$1.2M", icon: "👥", color: "var(--danger)", subtitle: "Con equipo activo, sin proyectos" },
  { label: "Runway Estimado", value: "~11 meses", icon: "⏰", color: "var(--ember)", subtitle: "Sin nuevos ingresos" },
  { label: "Ingresos Activos", value: "$0", icon: "⚠️", color: "var(--danger)", subtitle: "Situación crítica — cerrar Wuunder" },
  { label: "Meta Q3 2026", value: "3 clientes", icon: "🎯", color: "var(--success)", subtitle: "Objetivo supervivencia" },
];

export const REAL_TEAM_COSTS: CostItem[] = [
  { name: "Santiago (CEO)", amount: "$300K/mes", period: "Mensual", type: "fijo" },
  { name: "Juan Manuel (COO)", amount: "$600K-$800K/mes", period: "Mensual", type: "fijo" },
  { name: "Dev Backend", amount: "$700K-$2M/mes", period: "Mensual", type: "variable" },
  { name: "Account Manager", amount: "$200K-$800K/mes", period: "Mensual", type: "variable" },
  { name: "Guionista", amount: "$100K-$600K/mes", period: "Mensual", type: "variable" },
  { name: "Supervisor Grabación", amount: "$100K-$500K/mes", period: "Mensual", type: "variable" },
  { name: "Cocos/Julio", amount: "$60K/sesión", period: "Por sesión", type: "variable" },
];

export const REAL_KEY_DEADLINES: DeadlineItem[] = [
  { event: "Cierre contrato crítico", deadline: "6-8 semanas desde Mayo 2026", urgency: "critico" },
  { event: "Primera contratación tiempo completo", deadline: "Mes 9-12", urgency: "alto" },
  { event: "Objetivo: 5 clientes activos", deadline: "12 meses", urgency: "medio" },
];

export function getServerBusinessContext(opts?: { wuunderClosed?: boolean }): BusinessContext {
  return buildBusinessContext(REAL_FINANCE_SNAPSHOT, opts);
}

export interface FinanceDetail {
  teamCosts: CostItem[];
  financialMetrics: FinancialMetric[];
  keyDeadlines: DeadlineItem[];
  snapshotUpdatedAt?: string;
}

export function getServerFinanceDetail(): FinanceDetail {
  return {
    teamCosts: REAL_TEAM_COSTS,
    financialMetrics: REAL_FINANCIAL_METRICS,
    keyDeadlines: REAL_KEY_DEADLINES,
    snapshotUpdatedAt: REAL_FINANCE_SNAPSHOT.updatedAt,
  };
}
