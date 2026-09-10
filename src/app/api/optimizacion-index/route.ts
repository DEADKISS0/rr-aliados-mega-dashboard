import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const indexFile = join(process.cwd(), "public", "reports", "optimizacion_index.json");

    if (!existsSync(indexFile)) {
      return NextResponse.json({ reports: [] });
    }

    const raw = await readFile(indexFile, "utf-8");
    const data = JSON.parse(raw);
    const reports = (data.reports || []).slice(0, 5);

    return NextResponse.json({ reports });
  } catch (err) {
    return NextResponse.json({ reports: [], error: String(err) }, { status: 500 });
  }
}