import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { assignDashWebTask, createDashWebTask } from "@/lib/dashweb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActionProposal = {
  id: string;
  source_report_id: string;
  title: string;
  rationale?: string;
  priority_proposed?: string;
  due_date_proposed?: string;
  area?: string;
  status: string;
  dashweb_project_id?: string | null;
  dashweb_task_id?: string | null;
  evidence?: string[];
  last_seen_at?: string;
  first_seen_at?: string;
};

type LedgerFile = {
  schema_version?: string;
  updated_at?: string;
  actions?: ActionProposal[];
};

function ledgerPath() {
  return path.join(process.cwd(), "public", "data", "action_ledger.json");
}

async function readLedger(): Promise<LedgerFile> {
  const raw = await fs.readFile(ledgerPath(), "utf8");
  return JSON.parse(raw) as LedgerFile;
}

async function writeLedger(data: LedgerFile): Promise<void> {
  data.updated_at = new Date().toISOString();
  await fs.writeFile(ledgerPath(), JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: Request) {
  let body: {
    actionId?: string;
    projectId?: string;
    confirmed?: boolean;
    assignNow?: boolean;
    assigneeId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const actionId = String(body.actionId || "").trim();
  const projectId = String(body.projectId || "").trim();
  const confirmed = body.confirmed === true;

  if (!actionId || !projectId) {
    return NextResponse.json(
      { error: "actionId y projectId son obligatorios." },
      { status: 400 }
    );
  }
  if (!confirmed) {
    return NextResponse.json(
      {
        error:
          "Confirmación individual requerida. Marca confirmed=true solo tras revisar la propuesta.",
      },
      { status: 400 }
    );
  }

  let ledger: LedgerFile;
  try {
    ledger = await readLedger();
  } catch {
    return NextResponse.json(
      { error: "No hay action_ledger.json publicado." },
      { status: 404 }
    );
  }

  const actions = Array.isArray(ledger.actions) ? ledger.actions : [];
  const action = actions.find((item) => item.id === actionId);
  if (!action) {
    return NextResponse.json({ error: "Propuesta no encontrada en el ledger." }, { status: 404 });
  }
  if (action.dashweb_task_id) {
    return NextResponse.json(
      {
        error: "Esta propuesta ya tiene una tarea DashWeb vinculada.",
        taskId: action.dashweb_task_id,
        projectId: action.dashweb_project_id,
      },
      { status: 409 }
    );
  }

  const description = [
    `Fuente MiroFish: sourceReportId=${action.source_report_id}; sourceActionId=${action.id}`,
    action.rationale ? `Por qué: ${action.rationale}` : null,
    action.area ? `Área sugerida: ${action.area}` : null,
    action.due_date_proposed ? `Fecha propuesta (IA): ${action.due_date_proposed}` : null,
    "Creada sin asignado. La asignación requiere confirmación separada.",
  ]
    .filter(Boolean)
    .join("\n");

  const created = await createDashWebTask({
    title: action.title,
    description,
    projectId,
    priority: action.priority_proposed,
  });

  if (!created.ok) {
    return NextResponse.json(
      {
        error: created.error,
        configured: created.configured,
      },
      { status: created.configured ? 502 : 503 }
    );
  }

  action.status = "CREATED";
  action.dashweb_project_id = projectId;
  action.dashweb_task_id = created.task.id;
  action.last_seen_at = new Date().toISOString();

  let ledgerPersisted = true;
  try {
    await writeLedger({ ...ledger, actions });
  } catch {
    ledgerPersisted = false;
  }

  let assigned: { ok: true; assigneeId: string } | { ok: false; error: string } | null = null;
  if (body.assignNow === true) {
    const assigneeId = String(body.assigneeId || "").trim();
    if (!assigneeId) {
      assigned = {
        ok: false,
        error: "assignNow=true requiere assigneeId y una confirmación explícita de asignación.",
      };
    } else {
      const result = await assignDashWebTask({ taskId: created.task.id, assigneeId });
      assigned = result.ok
        ? { ok: true, assigneeId }
        : { ok: false, error: result.error };
    }
  }

  return NextResponse.json({
    ok: true,
    mode: "confirm_individual",
    actionId: action.id,
    projectId,
    taskId: created.task.id,
    status: action.status,
    ledgerPersisted,
    assigned,
    note:
      assigned == null
        ? "Tarea creada sin asignado. Usa el diálogo de asignación si quieres asignar a una persona."
        : undefined,
  });
}
