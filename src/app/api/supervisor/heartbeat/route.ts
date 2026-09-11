import { NextRequest, NextResponse } from "next/server";
import { runSupervisorChecks } from "@/lib/supervisor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") || "";
  const isCron = request.headers.get("x-vercel-cron") === "1";
  if (!isCron && (!cronSecret || authorization !== `Bearer ${cronSecret}`)) {
    return NextResponse.json({ ok: false, error: "Supervisor heartbeat no autorizado" }, { status: 401 });
  }
  const checks = await runSupervisorChecks(request.nextUrl.origin);
  const failed = checks.filter((check) => check.status === "error");
  return NextResponse.json({ ok: failed.length === 0, supervisor: "RR Supervisor", checkedAt: new Date().toISOString(), checks, nextAction: failed.length ? "escalate" : "continue_monitoring" }, { status: failed.length ? 503 : 200 });
}
