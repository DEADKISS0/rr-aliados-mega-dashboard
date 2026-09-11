import { CLIENTS, type Client } from "@/data/clients";
import { fetchSupabaseRows, SupabaseConfigError } from "@/lib/supabaseRest";

interface EntityRow {
  id?: string;
  slug?: string;
  nombre?: string;
  nombre_canonico?: string;
  tipo?: string;
  estado?: string;
  drive_path?: string;
  [key: string]: unknown;
}

interface ProjectRow {
  id?: string;
  slug?: string;
  nombre?: string;
  entity_id?: string | null;
  categoria?: string;
  estado?: string;
  valor_total?: number | string | null;
  valor_pagado?: number | string | null;
  valor_potencial?: number | string | null;
  [key: string]: unknown;
}

/**
 * Vista de cliente que combina la entidad viva de Supabase con los metadatos
 * editoriales de `src/data/clients.ts` (enlaces, tags, notas y drivePath).
 */
export interface LiveClient extends Client {
  live: boolean;
  entityId?: string;
  entityEstado?: string;
  entityTipo?: string;
  projectCount: number;
  liveValueTotal: number;
  liveValuePaid: number;
  liveValuePending: number;
  paymentProgress: number;
  hasEditorial: boolean;
}

export interface LiveClientsResult {
  clients: LiveClient[];
  live: boolean;
  source: string;
  updatedAt: string;
  stats: {
    total: number;
    active: number;
    prospects: number;
    withPrototype: number;
    contractValue: number;
  };
}

/** Entidades que existen como carpetas-herramienta, no como clientes reales. */
const NON_CLIENT_ENTITY_SLUGS = new Set([
  "assets",
  "portafolio",
  "propuestas",
  "prototipos",
  "rr-aliados",
]);

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function distinctiveTokens(value: unknown): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length >= 5);
}

function driveKey(value: unknown): string {
  return normalize(value).replace(/^rr\s+/, "").trim();
}

/** Dos etiquetas comparten identidad si coinciden exacto o comparten un token distintivo. */
function sharesIdentity(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const tokensA = distinctiveTokens(a);
  const tokensB = distinctiveTokens(b);
  return tokensA.some((token) => tokensB.includes(token));
}

function entityMatchesEntity(entity: EntityRow, client: Client): boolean {
  const entitySlug = normalize(entity.slug);
  const entityName = normalize(entity.nombre_canonico || entity.nombre);
  const clientSlug = normalize(client.slug);
  const clientName = normalize(client.name);

  if (entitySlug && entitySlug === clientSlug) return true;
  if (entityName && sharesIdentity(entityName, clientName)) return true;
  if (entityName && sharesIdentity(entityName, clientSlug)) return true;
  if (entitySlug && sharesIdentity(entitySlug, clientName)) return true;

  // Igualdad exacta de ubicación canónica en Drive (nunca por carpeta padre,
  // que agruparía por error a todos los prospectos de una misma bandeja).
  const entityDrive = driveKey(entity.drive_path);
  const clientDrive = driveKey(client.drivePath);
  if (entityDrive && clientDrive && entityDrive === clientDrive) return true;

  return false;
}

function collectProjectsForEntity(
  entity: EntityRow,
  projects: ProjectRow[]
): ProjectRow[] {
  const name = normalize(entity.nombre_canonico || entity.nombre);
  return projects.filter((project) => {
    if (entity.id && project.entity_id && project.entity_id === entity.id) return true;
    return sharesIdentity(normalize(project.nombre), name);
  });
}

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusFromEntity(tipo: string | undefined, fallback: Client["status"]): Client["status"] {
  if (tipo === "cliente") return "active";
  if (tipo === "prospecto") return "prospect";
  return fallback;
}

function editorialDefaults(): Client {
  return {
    slug: "",
    name: "",
    industry: "Sin clasificar",
    status: "prospect",
    priority: "low",
    drivePath: "",
    tags: [],
  };
}

const PRIORITY_ORDER: Record<Client["priority"], number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<Client["status"], number> = { active: 0, prospect: 1, paused: 2, closed: 3 };

function sortClients(clients: LiveClient[]): LiveClient[] {
  return [...clients].sort((a, b) => {
    const status = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (status !== 0) return status;
    const priority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priority !== 0) return priority;
    return a.name.localeCompare(b.name, "es");
  });
}

function buildStats(clients: LiveClient[]): LiveClientsResult["stats"] {
  return {
    total: clients.length,
    active: clients.filter((client) => client.status === "active").length,
    prospects: clients.filter((client) => client.status === "prospect").length,
    withPrototype: clients.filter((client) => Boolean(client.prototypeUrl || client.website)).length,
    contractValue: clients.reduce(
      (sum, client) => sum + (client.liveValueTotal || client.contractValue || 0),
      0
    ),
  };
}

function buildFromEditorialOnly(): LiveClientsResult {
  const clients: LiveClient[] = CLIENTS.map((client) => ({
    ...client,
    live: false,
    projectCount: 0,
    liveValueTotal: client.contractValue ?? 0,
    liveValuePaid: 0,
    liveValuePending: client.contractValue ?? 0,
    paymentProgress: 0,
    hasEditorial: true,
  }));
  return {
    clients: sortClients(clients),
    live: false,
    source: "directorio local",
    updatedAt: new Date().toISOString(),
    stats: buildStats(clients),
  };
}

/**
 * Combina entidades y proyectos vivos de Supabase con los metadatos editoriales.
 * Si Supabase no está configurado, devuelve el registro editorial como respaldo.
 */
export async function getLiveClients(): Promise<LiveClientsResult> {
  let entities: EntityRow[];
  let projects: ProjectRow[];
  try {
    [entities, projects] = await Promise.all([
      fetchSupabaseRows<EntityRow>("entities", "select=*&order=nombre.asc"),
      fetchSupabaseRows<ProjectRow>("projects", "select=*&order=created_at.desc"),
    ]);
  } catch (error) {
    if (error instanceof SupabaseConfigError) return buildFromEditorialOnly();
    console.error("liveClients: Supabase no disponible", error);
    return buildFromEditorialOnly();
  }

  const clientEntities = entities.filter(
    (entity) =>
      (entity.tipo === "cliente" || entity.tipo === "prospecto") &&
      !NON_CLIENT_ENTITY_SLUGS.has(normalize(entity.slug))
  );

  const usedEditorial = new Set<string>();
  const clients: LiveClient[] = [];

  for (const entity of clientEntities) {
    // Nunca reutilizar la misma ficha editorial para dos entidades distintas.
    const editorial = CLIENTS.find(
      (client) => !usedEditorial.has(client.slug) && entityMatchesEntity(entity, client)
    );
    if (editorial) usedEditorial.add(editorial.slug);

    const base: Client = editorial ?? {
      ...editorialDefaults(),
      slug: String(entity.slug ?? "").trim() || normalize(entity.nombre).replace(/\s+/g, "-"),
      name: String(entity.nombre_canonico || entity.nombre || entity.slug || "Sin nombre"),
      drivePath: String(entity.drive_path ?? ""),
    };

    const entityProjects = collectProjectsForEntity(entity, projects);
    const liveValueTotal = entityProjects.reduce((sum, p) => sum + toNumber(p.valor_total), 0);
    const liveValuePaid = entityProjects.reduce((sum, p) => sum + toNumber(p.valor_pagado), 0);
    const declaredTotal = liveValueTotal || (base.contractValue ?? 0);
    const pending = Math.max(declaredTotal - liveValuePaid, 0);

    clients.push({
      ...base,
      status: statusFromEntity(entity.tipo, base.status),
      live: true,
      entityId: entity.id,
      entityEstado: entity.estado,
      entityTipo: entity.tipo,
      projectCount: entityProjects.length,
      liveValueTotal: declaredTotal,
      liveValuePaid,
      liveValuePending: pending,
      paymentProgress: declaredTotal > 0 ? Math.round((liveValuePaid / declaredTotal) * 100) : 0,
      hasEditorial: Boolean(editorial),
    });
  }

  // Metadatos editoriales que aún no tienen entidad viva.
  for (const client of CLIENTS) {
    if (usedEditorial.has(client.slug)) continue;
    clients.push({
      ...client,
      live: false,
      projectCount: 0,
      liveValueTotal: client.contractValue ?? 0,
      liveValuePaid: 0,
      liveValuePending: client.contractValue ?? 0,
      paymentProgress: 0,
      hasEditorial: true,
    });
  }

  return {
    clients: sortClients(clients),
    live: true,
    source: "Supabase · entities + projects",
    updatedAt: new Date().toISOString(),
    stats: buildStats(clients),
  };
}
