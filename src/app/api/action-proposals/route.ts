import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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
  status: "PENDING_NO_EVIDENCE" | "PROPOSED" | "CREATED" | "MATCHED" | "DONE" | "BLOCKED" | "CLOSED";
  dashweb_project_id?: string;
  dashweb_task_id?: string;
  evidence?: string[];
  last_seen_at?: string;
};

export async function GET() {
  const ledgerPath = path.join(process.cwd(), "public", "data", "action_ledger.json");
  try {
    const raw = await fs.readFile(ledgerPath, "utf8");
    const data = JSON.parse(raw) as { updated_at?: string; actions?: ActionProposal[] };
    const actions = Array.isArray(data.actions) ? data.actions : [];
    return NextResponse.json({
      updatedAt: data.updated_at ?? null,
      mode: "read_only",
      source: "public/data/action_ledger.json",
      count: actions.length,
      actions,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({
      updatedAt: null,
      mode: "read_only",
      source: "No action ledger published yet.",
      error: `Missing or unreadable public/data/action_ledger.json (${reason})`,
      count: 0,
      actions: [],
    });
  }
}
