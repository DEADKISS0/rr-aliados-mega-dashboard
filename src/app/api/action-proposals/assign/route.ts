import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { assignDashWebTask } from "@/lib/dashweb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActionProposal = {
  id: string;
  dashweb_task_id?: string | null;
  last_seen_at?: string;
};

type LedgerFile = {
  schema_version?: string;
  updated_at?: string;
  actions?: ActionProposal[];
};

export async function POST(request: Request) {
  let body: {
    actionId?: string;
    taskId?: string;
    assigneeId?: string;
    confirmed?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const actionId = String(body.actionId || "").trim();
  const taskId = String(body.taskId || "").trim();
  const assigneeId = String(body.assigneeId || "").trim();
  if (!actionId || !taskId || !assigneeId) {
    return NextResponse.json(
      { error: "actionId, taskId y assigneeId son obligatorios." },
      { status: 400 }
    );
  }
  if (body.confirmed !== true) {
    return NextResponse.json(
      { error: "La asignación requiere confirmed=true en un diálogo separado." },
      { status: 400 }
    );
  }

  const result = await assignDashWebTask({ taskId, assigneeId });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, configured: result.configured },
      { status: result.configured ? 502 : 503 }
    );
  }

  try {
    const ledgerPath = path.join(process.cwd(), "public", "data", "action_ledger.json");
    const raw = await fs.readFile(ledgerPath, "utf8");
    const ledger = JSON.parse(raw) as LedgerFile;
    const actions = Array.isArray(ledger.actions) ? ledger.actions : [];
    const action = actions.find((item) => item.id === actionId);
    if (action) {
      action.last_seen_at = new Date().toISOString();
      ledger.updated_at = new Date().toISOString();
      await fs.writeFile(ledgerPath, JSON.stringify(ledger, null, 2), "utf8");
    }
  } catch {
    // Assignment in DashWeb is the source of truth; ledger write is best-effort.
  }

  return NextResponse.json({
    ok: true,
    actionId,
    taskId,
    assigneeId,
    note: "Asignación confirmada en DashWeb. No se reasigna automáticamente desde reportes.",
  });
}
