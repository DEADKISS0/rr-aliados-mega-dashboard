export interface Client {
  slug: string;
  name: string;
  industry: string;
  status: "active" | "prospect" | "closed" | "paused";
  priority: "high" | "medium" | "low";
  contact?: string;
  email?: string;
  phone?: string;
  website?: string;
  prototypeUrl?: string;
  pitchUrl?: string;
  repoUrl?: string;
  instagram?: string;
  drivePath: string;
  contractValue?: number;
  currency?: string;
  startDate?: string;
  notes?: string;
  tags: string[];
}

export const CLIENTS: Client[] = [
  {
    slug: "wuundeer",
    name: "Wuundeer",
    industry: "B2B Mayorista de confección colombiana",
    status: "prospect",
    priority: "high",
    website: "https://wuundeer-prototype.vercel.app/",
    prototypeUrl: "https://wuundeer-prototype.vercel.app/",
    pitchUrl: "https://manepeqsicoda.github.io/WuunderPitch/",
    repoUrl: "https://github.com/ManePeqsiCoda/Wuundeer_PreContract",
    drivePath: "rr_aliados/06_Clientes/Wundeer",
    contractValue: 9000000,
    currency: "COP",
    tags: ["b2b", "fashion", "mayorista", "prototipo-web", "precontrato"],
    notes: "Prioridad cierre. Precontrato con Opción A/B/C (entrada escalonada).",
  },
  {
    slug: "satiro-sushi",
    name: "Sátiro Sushi",
    industry: "Restaurante / Gastronomía",
    status: "active",
    priority: "high",
    prototypeUrl: "https://landing-satiro-demo-production.up.railway.app/",
    instagram: "https://www.instagram.com/satirosushi/",
    drivePath: "rr_aliados/06_Clientes/Satiro_Sushi",
    contractValue: 12000000,
    currency: "COP",
    tags: ["restaurante", "gastronomia", "contenido", "redes"],
    notes: "Cliente activo. Contrato $12M.",
  },
  {
    slug: "boga",
    name: "BOGA",
    industry: "Panadería / SaaS Vertical",
    status: "active",
    priority: "high",
    website: "https://junisama.com.co/",
    prototypeUrl: "https://junisama-seven.vercel.app/",
    pitchUrl: "https://junisama-seven.vercel.app/pitch/",
    drivePath: "rr_aliados/06_Clientes/BOGA",
    contractValue: 1200000,
    currency: "COP",
    tags: ["panaderia", "saas-vertical", "landing", "rebrand"],
    notes: "Cliente activo. Contrato $1.2M. Rebrand Junisama → BOGA.",
  },
  {
    slug: "harbin",
    name: "Harbin",
    industry: "Restaurante / Gastronomía",
    status: "prospect",
    priority: "medium",
    prototypeUrl: "https://landing-harbin-demo-production.up.railway.app/",
    instagram: "https://www.instagram.com/harbinrestaurantes/",
    drivePath: "rr_aliados/02_Ventas/Prospectos",
    tags: ["restaurante", "gastronomia", "prototipo-web"],
    notes: "Prototipo en Railway. Ficha comercial por completar.",
  },
  {
    slug: "charly-brown",
    name: "CharlyBrown",
    industry: "Entretenimiento / Billar",
    status: "prospect",
    priority: "medium",
    prototypeUrl: "https://landing-charly-demo-production-8ab7.up.railway.app/",
    instagram: "https://www.instagram.com/charlybrawnbillarclub/",
    drivePath: "rr_aliados/02_Ventas/Prospectos",
    tags: ["entretenimiento", "billar", "prototipo-web"],
    notes: "Charly Brown Billar Club. Prototipo en Railway.",
  },
  {
    slug: "candilejas",
    name: "Candilejas",
    industry: "Entretenimiento / Restaurante",
    status: "prospect",
    priority: "medium",
    prototypeUrl: "https://landing-candilejas-demo-production.up.railway.app/",
    instagram: "https://www.instagram.com/candilejasccentral/",
    drivePath: "rr_aliados/02_Ventas/Prospectos",
    tags: ["entretenimiento", "restaurante", "prototipo-web"],
    notes: "Prototipo en Railway. Ficha comercial por completar.",
  },
  {
    slug: "la-carreta",
    name: "La Carreta",
    industry: "Restaurante / Gastronomía",
    status: "prospect",
    priority: "medium",
    prototypeUrl: "https://landing-carreta-demo-production.up.railway.app/",
    instagram: "https://www.instagram.com/lacarretazipaquira/",
    drivePath: "rr_aliados/02_Ventas/Prospectos",
    tags: ["restaurante", "gastronomia", "prototipo-web"],
    notes: "La Carreta (Zipaquirá). Prototipo en Railway.",
  },
  {
    slug: "mar-y-tierra",
    name: "Mar y Tierra",
    industry: "Restaurante / Gastronomía",
    status: "prospect",
    priority: "medium",
    prototypeUrl: "https://landing-marytierra-demo-production.up.railway.app/",
    drivePath: "rr_aliados/02_Ventas/Prospectos",
    tags: ["restaurante", "gastronomia", "prototipo-web"],
    notes: "Prototipo en Railway. Ficha comercial por completar.",
  },
  {
    slug: "siraitia",
    name: "Siraitia",
    industry: "Agro / Exportación",
    status: "prospect",
    priority: "medium",
    drivePath: "rr_aliados/06_Clientes/Siraitia",
    tags: ["agro", "exportacion", "contenido", "guiones"],
    notes: "Prospecto con documentación extensa: guiones, roadmap, pitch, reuniones.",
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    industry: "Servicios",
    status: "prospect",
    priority: "medium",
    drivePath: "rr_aliados/06_Clientes/Amsterdam",
    tags: ["servicios", "pitch", "transcripciones"],
    notes: "Prospecto. Pitch guías y transcripciones.",
  },
  {
    slug: "zapatos",
    name: "Zapatos",
    industry: "Retail / Calzado",
    status: "prospect",
    priority: "low",
    drivePath: "rr_aliados/06_Clientes/Zapatos",
    tags: ["retail", "calzado", "contexto"],
    notes: "Prospecto. Contexto e historial.",
  },
  {
    slug: "numa-wagyu",
    name: "Numa Wagyu",
    industry: "Gastronomía / Premium",
    status: "prospect",
    priority: "medium",
    drivePath: "rr_aliados/06_Clientes/Numa_Wagyu",
    tags: ["gastronomia", "premium", "wagyu"],
    notes: "Prospecto premium.",
  },
  {
    slug: "arvin",
    name: "Arvin",
    industry: "Por clasificar",
    status: "prospect",
    priority: "low",
    drivePath: "rr_aliados/02_Ventas/Prospectos",
    tags: ["pendiente-ficha"],
    notes: "Cliente/prospecto mencionado por Rosas (nombre exacto por confirmar).",
  },
  {
    slug: "real-seguros",
    name: "Real Seguros",
    industry: "Seguros",
    status: "prospect",
    priority: "medium",
    prototypeUrl: "https://real-seguros-web.vercel.app/",
    drivePath: "rr_aliados/02_Ventas/Prospectos/Real_Seguros",
    tags: ["seguros", "prototipo-web", "cotizador"],
    notes: "Prototipo público registrado en Deploys_Indexer; ficha comercial por completar.",
  },
  {
    slug: "cafe-angustula",
    name: "Café Angústula",
    industry: "Café / Agro",
    status: "prospect",
    priority: "low",
    prototypeUrl: "https://augustula-cafe.vercel.app/",
    drivePath: "rr_aliados/02_Ventas/Prospectos/Cafe_Angustula",
    tags: ["cafe", "agro", "landing", "prototipo-web"],
    notes: "Prototipo público registrado en Deploys_Indexer; ficha comercial por completar.",
  },
  {
    slug: "fisiovida-medellin",
    name: "FisioVida Medellín",
    industry: "Salud / Fisioterapia",
    status: "prospect",
    priority: "low",
    prototypeUrl: "https://fisio-vida-seven.vercel.app/",
    drivePath: "rr_aliados/02_Ventas/Prospectos/Fisioterapia",
    tags: ["salud", "fisioterapia", "prototipo-web"],
    notes: "Prototipo público registrado en Deploys_Indexer; ficha comercial por completar.",
  },
  {
    slug: "unidos-fundacion-social",
    name: "Unidos Fundación Social",
    industry: "Fundación / Impacto social",
    status: "prospect",
    priority: "low",
    prototypeUrl: "https://unidos-fundacion-social.vercel.app/",
    drivePath: "rr_aliados/02_Ventas/Prospectos/Sogamoso",
    tags: ["fundacion", "impacto-social", "spa", "prototipo-web"],
    notes: "Prototipo público registrado en Deploys_Indexer; ficha comercial por completar.",
  },
  {
    slug: "soluciones-agropecuarias-sostenibles",
    name: "Soluciones Agropecuarias Sostenibles",
    industry: "Agro / B2G-B2B",
    status: "prospect",
    priority: "low",
    prototypeUrl: "https://soluciones-agropecuarias-two.vercel.app/",
    drivePath: "rr_aliados/02_Ventas/Prospectos/Sogamoso",
    tags: ["agro", "b2b", "b2g", "catalogo", "prototipo-web"],
    notes: "Prototipo público registrado en Deploys_Indexer; ficha comercial por completar.",
  },
];

export function getClientBySlug(slug: string): Client | undefined {
  return CLIENTS.find((c) => c.slug === slug);
}

export function getClientsByStatus(status: Client["status"]): Client[] {
  return CLIENTS.filter((c) => c.status === status);
}

export function getActiveClients(): Client[] {
  return CLIENTS.filter((c) => c.status === "active");
}

export function getProspects(): Client[] {
  return CLIENTS.filter((c) => c.status === "prospect");
}

export function getClientsWithPrototype(): Client[] {
  return CLIENTS.filter((c) => Boolean(c.prototypeUrl || c.website));
}

export function getClientsWithoutPrototype(): Client[] {
  return CLIENTS.filter((c) => !c.prototypeUrl && !c.website);
}

export function getTotalContractValue(): number {
  return CLIENTS.filter((c) => c.contractValue).reduce((sum, c) => sum + (c.contractValue || 0), 0);
}
