export type SupervisorEventType = "error" | "decision" | "requirement";
export type SupervisorSeverity = "low" | "medium" | "high" | "critical";

export interface SupervisorEvent {
  type: SupervisorEventType;
  title: string;
  detail?: string;
  severity?: SupervisorSeverity;
  source?: string;
}

export interface SupervisorDecision {
  action: "auto_resolve" | "monitor" | "escalate";
  reason: string;
  safe: boolean;
}

export function triageSupervisorEvent(event: SupervisorEvent): SupervisorDecision {
  const severity = event.severity ?? "medium";
  if (event.type === "error" && severity === "critical") {
    return { action: "escalate", reason: "Error crítico: requiere intervención humana inmediata.", safe: false };
  }
  if (event.type === "error" && severity === "high") {
    return { action: "monitor", reason: "Error de alta prioridad: se registra y se vigila recurrencia.", safe: true };
  }
  if (event.type === "requirement") {
    return { action: "escalate", reason: "Requerimiento: se prepara para decisión antes de modificar sistemas.", safe: false };
  }
  if (event.type === "decision") {
    return { action: "escalate", reason: "Decisión: el supervisor estructura opciones, no decide cambios irreversibles.", safe: false };
  }
  return { action: "auto_resolve", reason: "Incidencia acotada: se puede resolver o normalizar sin efectos irreversibles.", safe: true };
}

export async function runSupervisorChecks(origin: string) {
  const checks = [
    { id: "automation", label: "Automatizaciones", path: "/api/automation" },
    { id: "oauth", label: "Autenticación Google", path: "/api/auth/google" },
  ];
  return Promise.all(checks.map(async (check) => {
    const started = Date.now();
    try {
      const response = await fetch(`${origin}${check.path}`, { cache: "no-store", redirect: "manual" });
      const expectedRedirect = check.id === "oauth" && (response.status === 302 || response.status === 307);
      const ok = response.ok || expectedRedirect;
      return { ...check, status: ok ? "ok" : response.status === 401 || response.status === 503 ? "warning" : "error", httpStatus: response.status, latencyMs: Date.now() - started };
    } catch {
      return { ...check, status: "error", httpStatus: 0, latencyMs: Date.now() - started };
    }
  }));
}
