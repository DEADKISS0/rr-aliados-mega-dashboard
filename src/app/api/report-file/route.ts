import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");
  if (!file) {
    return NextResponse.json({ error: "file param required" }, { status: 400 });
  }
  try {
    const safe = file.replace(/\.\./g, "").replace(/[<>]/g, "");
    const filePath = join(process.cwd(), "public", "reports", safe);
    const buffer = readFileSync(filePath);
    const ext = safe.endsWith(".pdf") ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": ext,
        "Content-Disposition": `inline; filename="${safe}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
