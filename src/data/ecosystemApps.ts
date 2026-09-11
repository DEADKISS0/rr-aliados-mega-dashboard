export interface EcosystemApp {
  id: string;
  title: string;
  url: string;
  icon: string;
  blurb: string;
  /** Prefer deep-link chip in the quick row */
  deepLinkPrimary?: boolean;
  /**
   * iframe = require embed (timeout = error overlay).
   * auto = try iframe, fall back to card.
   * card = never iframe (only when known impossible).
   */
  embed: "iframe" | "card" | "auto";
  /** Why card-only, if any — shown in fallback UI */
  embedNote?: string;
}

/**
 * Ecosistema interno consolidado (según definición de Rosas 2026-09-10).
 * Se retiraron: Mega Dashboard (es este sitio), Primer Contacto Web,
 * RR Skills Hub (quedó dentro del propio Hub), Company Hub, Adquisición
 * Clientes y Cuentas de Cobro. Se mantienen por el momento: RR Finanzas y
 * RR Cotizador, más los desarrollos internos vigentes.
 */
export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: "rr-finanzas",
    title: "RR Finanzas",
    url: "https://rr-finanzas.vercel.app/",
    icon: "💰",
    blurb: "Caja, runway, cuentas de cobro y proyecciones",
    deepLinkPrimary: true,
    embed: "auto",
  },
  {
    id: "cotizador",
    title: "RR Cotizador",
    url: "https://rr-kotizador.vercel.app/",
    icon: "🧮",
    blurb: "Cotizaciones comerciales, precios dinámicos",
    deepLinkPrimary: true,
    embed: "auto",
  },
  {
    id: "dashweb",
    title: "DashWeb Core",
    url: "https://dashweb-core-frontend-beta.up.railway.app/login",
    icon: "🔧",
    blurb: "ERP/CRM: proyectos, tareas, RRHH, facturación",
    deepLinkPrimary: true,
    embed: "auto",
    embedNote: "Auth cross-origin: el login puede verse; sesión completa suele requerir pestaña",
  },
];

export const SKILLS_HUB_URL = "https://rr-skills-hub.vercel.app/";

/** Dashboard origins allowed by embedded apps (keep in sync with probe). */
export const DASHBOARD_EMBED_ORIGINS = [
  "https://rr-aliados-mega-dashboard.vercel.app",
  "https://skill-orchestrator-dashboard.vercel.app",
];
