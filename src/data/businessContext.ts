export interface FinanceSnapshot {
  updatedAt?: string;
  capitalCop: number;
  monthlyBurnCop: number;
  wuunderDeadline?: string;
  wuunderExpectedMrrCop?: number;
  clientsClosed?: number;
  clientsTargetQ3?: number;
  notes?: string;
}

export interface BusinessContext {
  capitalCop: number;
  monthlyBurnCop: number;
  runwayDays: number;
  runwayMonths: number;
  clientsTargetQ3: number;
  clientsClosed: number;
  wuunderDeadline: string;
  wuunderDaysLeft: number;
  wuunderExpectedMrrCop: number;
  financeUpdatedAt?: string;
  meta5Year: {
    targetMrr: string;
    currentMrr: string;
    targetClients: number;
    currentClients: number;
    horizon: string;
    q3MrrTarget: string;
    foundationYear: string;
    teamTarget: number;
  };
}

export const DEFAULT_FINANCE_SNAPSHOT: FinanceSnapshot = {
  updatedAt: "2026-07-17",
  capitalCop: 5_000_000,
  monthlyBurnCop: 450_000,
  wuunderDeadline: "2026-07-31",
  wuunderExpectedMrrCop: 3_000_000,
  clientsClosed: 0,
  clientsTargetQ3: 3,
};

export function daysUntil(isoDate: string, now = new Date()): number {
  const deadline = new Date(isoDate);
  return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Runway given capital, burn, and optional Wuunder MRR offset. */
export function computeRunway(
  capitalCop: number,
  monthlyBurnCop: number,
  opts?: { wuunderClosed?: boolean; wuunderExpectedMrrCop?: number }
): { runwayDays: number; runwayMonths: number; effectiveBurn: number; cashPositive: boolean } {
  const mrr = opts?.wuunderClosed ? (opts.wuunderExpectedMrrCop ?? 0) : 0;
  const effectiveBurn = Math.max(0, monthlyBurnCop - mrr);
  if (effectiveBurn <= 0) {
    return {
      runwayDays: 9999,
      runwayMonths: 999,
      effectiveBurn: 0,
      cashPositive: true,
    };
  }
  const runwayMonths = capitalCop / effectiveBurn;
  const runwayDays = Math.floor(runwayMonths * 30);
  return { runwayDays, runwayMonths, effectiveBurn, cashPositive: false };
}

export function buildBusinessContext(
  snapshot: FinanceSnapshot = DEFAULT_FINANCE_SNAPSHOT,
  opts?: { wuunderClosed?: boolean }
): BusinessContext {
  const capitalCop = snapshot.capitalCop;
  const monthlyBurnCop = snapshot.monthlyBurnCop;
  const wuunderDeadline = snapshot.wuunderDeadline ?? DEFAULT_FINANCE_SNAPSHOT.wuunderDeadline!;
  const wuunderExpectedMrrCop =
    snapshot.wuunderExpectedMrrCop ?? DEFAULT_FINANCE_SNAPSHOT.wuunderExpectedMrrCop!;

  const { runwayDays, runwayMonths } = computeRunway(capitalCop, monthlyBurnCop, {
    wuunderClosed: opts?.wuunderClosed,
    wuunderExpectedMrrCop,
  });

  return {
    capitalCop,
    monthlyBurnCop,
    runwayDays,
    runwayMonths,
    clientsTargetQ3: snapshot.clientsTargetQ3 ?? 3,
    clientsClosed: snapshot.clientsClosed ?? 0,
    wuunderDeadline,
    wuunderDaysLeft: daysUntil(wuunderDeadline),
    wuunderExpectedMrrCop,
    financeUpdatedAt: snapshot.updatedAt,
    meta5Year: {
      targetMrr: "$50M COP/mes",
      currentMrr: "$0",
      targetClients: 50,
      currentClients: 0,
      horizon: "2026 → 2031",
      q3MrrTarget: "$12M COP/mes",
      foundationYear: "2026",
      teamTarget: 7,
    },
  };
}

export function getBusinessContext(opts?: { wuunderClosed?: boolean }): BusinessContext {
  return buildBusinessContext(DEFAULT_FINANCE_SNAPSHOT, opts);
}

export async function fetchFinanceSnapshot(): Promise<FinanceSnapshot> {
  try {
    const resp = await fetch("/data/finance_snapshot.json", { cache: "no-store" });
    if (!resp.ok) return DEFAULT_FINANCE_SNAPSHOT;
    const data = (await resp.json()) as Partial<FinanceSnapshot>;
    return {
      ...DEFAULT_FINANCE_SNAPSHOT,
      ...data,
      capitalCop: Number(data.capitalCop ?? DEFAULT_FINANCE_SNAPSHOT.capitalCop),
      monthlyBurnCop: Number(data.monthlyBurnCop ?? DEFAULT_FINANCE_SNAPSHOT.monthlyBurnCop),
    };
  } catch {
    return DEFAULT_FINANCE_SNAPSHOT;
  }
}

export async function fetchBusinessContext(opts?: {
  wuunderClosed?: boolean;
}): Promise<BusinessContext> {
  const snap = await fetchFinanceSnapshot();
  return buildBusinessContext(snap, opts);
}

export function formatCop(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}
