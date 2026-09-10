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
    name: "Satiro Sushi",
    industry: "Restaurante / Gastronomía",
    status: "active",
    priority: "high",
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
    slug: "alma-y-mente",
    name: "Alma y Mente",
    industry: "Bienestar / Salud mental",
    status: "prospect",
    priority: "medium",
    drivePath: "rr_aliados/06_Clientes/Alma_y_Mente",
    tags: ["bienestar", "salud-mental", "estrategia", "posicionamiento"],
    notes: "Prospecto. Estrategia de posicionamiento y guiones.",
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

export function getTotalContractValue(): number {
  return CLIENTS.filter((c) => c.contractValue).reduce((sum, c) => sum + (c.contractValue || 0), 0);
}
