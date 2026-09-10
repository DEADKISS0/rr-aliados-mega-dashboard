export type AutomationJob = {
  id?: string;
  name?: string;
  status?: string;
  detail?: string;
  lastRun?: string;
};

export type AutomationResponse = {
  jobs?: AutomationJob[];
  [key: string]: unknown;
};

// Muchos widgets cliente (ExternalAppWidget se monta N veces, TaskMonitor,
// AutomationHealth, NotificationCenter, ReportInsightBoard) piden /api/automation
// casi al mismo tiempo. Compartimos una sola request en vuelo con TTL corto
// para evitar una avalancha de llamadas idénticas en cada carga de la página.
const TTL_MS = 15_000;
let inflight: Promise<AutomationResponse> | null = null;
let cachedAt = 0;

export function getAutomationStatus(force = false): Promise<AutomationResponse> {
  const now = Date.now();
  if (!force && inflight && now - cachedAt < TTL_MS) {
    return inflight;
  }
  cachedAt = now;
  inflight = fetch("/api/automation", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`automation HTTP ${r.status}`);
      return r.json() as Promise<AutomationResponse>;
    })
    .catch((err) => {
      // No cacheamos el fallo: el próximo consumidor puede reintentar de inmediato.
      inflight = null;
      throw err;
    });
  return inflight;
}
