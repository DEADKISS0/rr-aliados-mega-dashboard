import { NextResponse } from "next/server";
import { getLiveClients } from "@/lib/liveClients";
import { fetchSupabaseRows, SupabaseConfigError } from "@/lib/supabaseRest";

export const dynamic = "force-dynamic";

interface Row {
  id?: string | number;
  slug?: string;
  nombre?: string;
  name?: string;
  entidad?: string;
  cliente?: string;
  estado?: string;
  valor_total?: number | string | null;
  valor_pagado?: number | string | null;
  valor_potencial?: number | string | null;
  [key: string]: unknown;
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function belongsToClient(row: Row, slug: string, name: string, entityId?: string): boolean {
  if (entityId && typeof row.entity_id === "string" && row.entity_id === entityId) return true;
  const haystack = normalize([row.slug, row.nombre, row.name, row.entidad, row.cliente].join(" "));
  const needles = [slug, name].map(normalize).filter(Boolean);
  return needles.some((needle) => haystack.includes(needle) || needle.includes(haystack));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Resuelve el cliente contra la vista viva (incluye entidades sin ficha editorial).
  let client: { slug: string; name: string; entityId?: string } | undefined;
  let clientsLive = false;
  try {
    const result = await getLiveClients();
    clientsLive = result.live;
    const match = result.clients.find((candidate) => candidate.slug === slug);
    if (match) client = { slug: match.slug, name: match.name, entityId: match.entityId };
  } catch (error) {
    console.error("Client API: no se pudo resolver la vista viva", error);
  }

  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  try {
    const [projects, entities] = await Promise.all([
      fetchSupabaseRows<Row>("projects", "select=*&order=created_at.desc"),
      fetchSupabaseRows<Row>("entities", "select=*&order=nombre.asc"),
    ]);

    const clientProjects = projects.filter((row) => belongsToClient(row, slug, client!.name, client!.entityId));
    const clientEntities = entities.filter((row) => belongsToClient(row, slug, client!.name, client!.entityId));
    const total = clientProjects.reduce((sum, row) => sum + Number(row.valor_total ?? 0), 0);
    const paid = clientProjects.reduce((sum, row) => sum + Number(row.valor_pagado ?? 0), 0);

    return NextResponse.json({
      client,
      live: true,
      updated_at: new Date().toISOString(),
      projects: clientProjects,
      entities: clientEntities,
      metrics: {
        projects: clientProjects.length,
        entities: clientEntities.length,
        value_total: total,
        value_paid: paid,
        value_pending: Math.max(total - paid, 0),
        payment_progress: total > 0 ? Math.round((paid / total) * 100) : 0,
      },
    });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ client, live: false, error: error.message, projects: [], entities: [] }, { status: 503 });
    }
    console.error("Client API error:", error);
    return NextResponse.json({ client, live: clientsLive, error: "Error consultando datos del cliente" }, { status: 500 });
  }
}
