import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/finance/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CashPayload = { fecha: string; concepto: string; monto: number; tipo: "ingreso" | "egreso"; categoria?: string; proyecto_id?: string };
const isCashPayload = (value: unknown): value is CashPayload => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return typeof item.fecha === "string" && item.fecha.length <= 30 && typeof item.concepto === "string" && item.concepto.trim().length > 1 && item.concepto.length <= 240 && typeof item.monto === "number" && Number.isFinite(item.monto) && item.monto > 0 && (item.tipo === "ingreso" || item.tipo === "egreso");
};

export async function GET() {
  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: true, source: "not_configured", proposals: [] });
  const { data, error } = await supabase.from("operation_proposals").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, source: "supabase", proposals: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { kind?: string; payload?: unknown } | null;
  if (body?.kind !== "cash_movement" || !isCashPayload(body.payload)) return NextResponse.json({ ok: false, error: "propuesta_invalida" }, { status: 400 });
  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase no configurado; no se simula una escritura." }, { status: 503 });
  const { data, error } = await supabase.from("operation_proposals").insert({ kind: body.kind, payload: body.payload, created_by: "ops" }).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, proposal: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null) as { id?: string; action?: "confirm" | "discard" } | null;
  if (!body?.id || !body.action) return NextResponse.json({ ok: false, error: "id_y_accion_requeridos" }, { status: 400 });
  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase no configurado" }, { status: 503 });
  const current = await supabase.from("operation_proposals").select("*").eq("id", body.id).eq("status", "pending").maybeSingle();
  if (current.error) return NextResponse.json({ ok: false, error: current.error.message }, { status: 500 });
  if (!current.data) return NextResponse.json({ ok: false, error: "propuesta_no_pendiente" }, { status: 404 });
  if (body.action === "discard") {
    const { data, error } = await supabase.from("operation_proposals").update({ status: "discarded", confirmed_by: "ops", confirmed_at: new Date().toISOString() }).eq("id", body.id).select("*").single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, proposal: data });
  }
  if (current.data.kind !== "cash_movement" || !isCashPayload(current.data.payload)) return NextResponse.json({ ok: false, error: "payload_no_escribible" }, { status: 400 });
  const inserted = await supabase.from("cash_movements").insert(current.data.payload).select("*").single();
  if (inserted.error) {
    await supabase.from("operation_proposals").update({ status: "failed", error_message: inserted.error.message }).eq("id", body.id);
    return NextResponse.json({ ok: false, error: inserted.error.message }, { status: 500 });
  }
  const updated = await supabase.from("operation_proposals").update({ status: "confirmed", confirmed_by: "ops", confirmed_at: new Date().toISOString() }).eq("id", body.id).select("*").single();
  if (updated.error) return NextResponse.json({ ok: false, error: updated.error.message, record: inserted.data }, { status: 500 });
  return NextResponse.json({ ok: true, proposal: updated.data, record: inserted.data });
}
