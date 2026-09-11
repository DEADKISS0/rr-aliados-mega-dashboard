import { NextResponse } from "next/server";
import { buildOperationsSnapshot } from "@/lib/operationsSnapshot";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ ok: true, snapshot: await buildOperationsSnapshot() }); }
  catch { return NextResponse.json({ ok: false, error: "No fue posible construir el briefing operativo." }, { status: 500 }); }
}
