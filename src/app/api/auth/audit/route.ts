import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AUDIT_PATH = path.join(process.cwd(), "public", "data", "audit_log.json");

interface AuditEntry {
  timestamp: string;
  role: string;
  action: "login" | "logout";
}

interface AuditLogFile {
  schema_version: string;
  updated_at: string;
  entries: AuditEntry[];
}

function readLog(): AuditLogFile {
  try {
    const raw = fs.readFileSync(AUDIT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { schema_version: "1.0", updated_at: new Date().toISOString(), entries: [] };
  }
}

function writeLog(log: AuditLogFile) {
  const dir = path.dirname(AUDIT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(AUDIT_PATH, JSON.stringify(log, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  let body: { role?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const role = String(body.role || "unknown");
  const action = body.action === "logout" ? "logout" : "login";

  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    role,
    action,
  };

  const log = readLog();
  log.entries.unshift(entry);
  log.updated_at = new Date().toISOString();

  // Keep last 500 entries
  if (log.entries.length > 500) {
    log.entries = log.entries.slice(0, 500);
  }

  writeLog(log);

  return NextResponse.json({ ok: true, entry });
}