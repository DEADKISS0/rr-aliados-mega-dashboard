export interface EcosystemApp {
  id: string;
  title: string;
  url: string;
  icon: string;
  blurb: string;
  /** Prefer deep-link chip in the quick row; implies card-first when embed is slow/blocked */
  deepLinkPrimary?: boolean;
  /**
   * iframe = try embed; card = preview card only (X-Frame / login / slow hosts).
   * auto = try iframe, fall back to card on timeout.
   */
  embed: "iframe" | "card" | "auto";
}

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: "company-hub",
    title: "Company Hub",
    url: "https://x3hlysjfyb4ta.kimi.page/",
    icon: "🏢",
    blurb: "Hub interno — abrir en pestaña (Kimi no embebe)",
    deepLinkPrimary: true,
    embed: "card",
  },
  {
    id: "cotizador",
    title: "RR Cotizador",
    url: "https://rr-kotizador.vercel.app/",
    icon: "🧮",
    blurb: "Cotizaciones comerciales",
    deepLinkPrimary: true,
    embed: "auto",
  },
  {
    id: "altruismo",
    title: "Altruismo",
    url: "https://altruismo-web.vercel.app/es",
    icon: "🤝",
    blurb: "Sitio Altruismo (embed en prod)",
    embed: "iframe",
  },
  {
    id: "skills-hub-app",
    title: "RR Skills Hub",
    url: "https://rr-skills-hub.vercel.app/",
    icon: "📚",
    blurb: "Catálogo de skills ejecutables",
    deepLinkPrimary: true,
    embed: "auto",
  },
  {
    id: "adquisicion",
    title: "Adquisición Clientes",
    url: "https://3mpm6kcgvmpz4.kimi.page/#panel",
    icon: "📈",
    blurb: "Playbook adquisición — abrir en pestaña (Kimi)",
    deepLinkPrimary: true,
    embed: "card",
  },
  {
    id: "adq-talentos",
    title: "Adquisición Talento",
    url: "https://rr-adq-talentos.vercel.app/",
    icon: "👥",
    blurb: "Pipeline de talento — preview o abrir ↗",
    deepLinkPrimary: true,
    embed: "auto",
  },
  {
    id: "dashweb",
    title: "DashWeb Core",
    url: "https://dashweb-core-frontend-beta.up.railway.app/login",
    icon: "🔧",
    blurb: "Core operativo — login en pestaña nueva (auth no embebe)",
    deepLinkPrimary: true,
    embed: "card",
  },
  {
    id: "saas-vertical",
    title: "SaaS Vertical Hub",
    url: "https://rr-saas-vertical.vercel.app/",
    icon: "🥐",
    blurb: "Hub vertical SaaS",
    embed: "auto",
  },
];

export const SKILLS_HUB_URL = "https://rr-skills-hub.vercel.app/";
