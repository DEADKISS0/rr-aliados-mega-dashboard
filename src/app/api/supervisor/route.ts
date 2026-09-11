import { NextRequest, NextResponse } from "next/server";
import { runSupervisorChecks, triageSupervisorEvent, type SupervisorEvent } from "@/lib/supervisor";
import { getSupabaseServer } from "@/lib/finance/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const checks = await runSupervisorChecks(request.nextUrl.origin);
  const errors = checks.filter((check) => check.status === "error").length;
  const warnings = checks.filter((check) => check.status === "warning").length;
  const supabase = getSupabaseServer();
  let events: unknown[] = [];
  if (supabase) {
    const result = await supabase.from("supervisor_events").select("id,type,title,severity,decision,created_at").order("created_at", { ascending: false }).limit(20);
    if (!result.error && Array.isArray(result.data)) events = result.data;
  }
  return NextResponse.json({ ok: errors === 0, generatedAt: new Date().toISOString(), summary: { errors, warnings, total: checks.length }, checks, events });
}

export async function POST(request: NextRequest) {
  let event: SupervisorEvent;
  try { event = (await request.json()) as SupervisorEvent; } catch { return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 }); }
  if (!["error", "decision", "requirement"].includes(event.type) || !event.title?.trim()) {
    return NextResponse.json({ ok: false, error: "type y title son obligatorios" }, { status: 400 });
  }
  const decision = triageSupervisorEvent(event);
  const record = { ...event, severity: event.severity ?? "medium", decision: decision.action, decision_reason: decision.reason, source: event.source ?? "unknown" };
  const supabase = getSupabaseServer();
  let persistence = "not_configured";
  if (supabase) {
    const { error } = await supabase.from("supervisor_events").insert(record);
    persistence = error ? "table_pending_migration" : "supabase";
  }
  return NextResponse.json({ ok: true, receivedAt: new Date().toISOString(), event, decision, persistence });
}
