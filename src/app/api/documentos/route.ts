import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/finance/supabase";
import type { DocumentRecord } from "@/lib/finance/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIPOS = ["contrato", "cuenta_cobro", "factura", "propuesta", "soporte", "otro"];
const ESTADOS = ["borrador", "vigente", "reemplazado", "anulado"];

type DocumentoPayload = {
  titulo?: unknown;
  tipo?: unknown;
  proyecto?: unknown;
  drive_path?: unknown;
  estado?: unknown;
  notas?: unknown;
  fecha?: unknown;
};

function cleanText(value: unknown, max = 240): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

/**
 * Valida y normaliza el payload de un documento contra columnas reales de la
 * tabla `documentos` (título, tipo, proyecto, drive_path, estado, notas).
 */
function normalizePayload(payload: DocumentoPayload): { row: Record<string, unknown> } | { error: string } {
  const titulo = cleanText(payload.titulo);
  if (!titulo) return { error: "titulo_requerido" };

  const tipo = cleanText(payload.tipo, 40) ?? "otro";
  if (!TIPOS.includes(tipo)) return { error: "tipo_invalido" };

  const estado = cleanText(payload.estado, 40) ?? "vigente";
  if (!ESTADOS.includes(estado)) return { error: "estado_invalido" };

  const drivePath = cleanText(payload.drive_path, 400);
  const proyecto = cleanText(payload.proyecto, 160);
  const notas = cleanText(payload.notas, 2000);

  return {
    row: {
      titulo,
      tipo,
      estado,
      proyecto,
      drive_path: drivePath,
      notas,
    },
  };
}

export async function GET() {
  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: true, source: "native", documentos: [] });

  const { data, error } = await supabase
    .from("documentos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, source: "supabase", documentos: (data ?? []) as DocumentRecord[] });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as DocumentoPayload | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "payload_invalido" }, { status: 400 });
  }

  const normalized = normalizePayload(body);
  if ("error" in normalized) {
    return NextResponse.json({ ok: false, error: normalized.error }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    // Sin credenciales: se devuelve el documento indexado solo en memoria del cliente.
    return NextResponse.json({ ok: true, source: "native", documento: { id: `local-${Date.now()}`, ...normalized.row } });
  }

  const { data, error } = await supabase.from("documentos").insert(normalized.row).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, source: "supabase", documento: data as DocumentRecord }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id_requerido" }, { status: 400 });

  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: true, source: "native" });

  const { error } = await supabase.from("documentos").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, source: "supabase" });
}
