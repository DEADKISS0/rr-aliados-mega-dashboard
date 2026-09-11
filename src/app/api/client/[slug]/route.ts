import { NextResponse } from "next/server";
import { getClientBySlug } from "@/data/clients";
import { fetchSupabaseRows, SupabaseConfigError } from "@/lib/supabaseRest";

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

function belongsToClient(row: Row, slug: string, name: string): boolean {
  const haystack = normalize([row.slug, row.nombre, row.name, row.entidad, row.cliente].join(" "));
  const needles = [slug, name].map(normalize).filter(Boolean);
  return needles.some((needle) => haystack.includes(needle) || needle.includes(haystack));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const client = getClientBySlug(slug);

  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  try {
    const [projects, entities] = await Promise.all([
      fetchSupabaseRows<Row>("projects", "select=*&order=created_at.desc"),
      fetchSupabaseRows<Row>("entities", "select=*&order=nombre.asc"),
    ]);

    const clientProjects = projects.filter((row) => belongsToClient(row, slug, client.name));
    const clientEntities = entities.filter((row) => belongsToClient(row, slug, client.name));
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
    return NextResponse.json({ client, live: false, error: "Error consultando datos del cliente" }, { status: 500 });
  }
}
