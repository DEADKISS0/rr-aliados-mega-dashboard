import { NextResponse } from "next/server";
import { readdirSync, existsSync, statSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREFIX = "Reporte_Prediccion_";

// Formatear timestamp: "2026-07-21_2127" -> "21 jul 2026, 21:27"
function formatLabel(dateStr: string): string {
  if (dateStr === "Ultimo" || dateStr === "build_vercel") return dateStr;
  try {
    const parts = dateStr.split("_");
    if (parts.length !== 2) return dateStr;
    const [datePart, timePart] = parts;
    const hour = timePart.substring(0, 2);
    const min = timePart.substring(2, 4);
    const d = new Date(datePart + "T" + hour + ":" + min + ":00Z");
    return d.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Bogota",
    });
  } catch {
    return dateStr.replace("_", " ");
  }
}

export async function GET() {
  try {
    const reportsDir = join(process.cwd(), "public", "reports");

    let files: string[] = [];
    try {
      files = readdirSync(reportsDir)
        .filter(f => f.startsWith(PREFIX) && f.endsWith(".pdf"))
        .filter(f => statSync(join(reportsDir, f)).size > 50000);
    } catch {
      return NextResponse.json({ reports: [] });
    }

    files.sort().reverse();

    const reports = files.slice(0, 5).map(f => {
      const dateStr = f.replace(PREFIX, "").replace(".pdf", "");
      const pdfPath = join(reportsDir, f);
      const excelPath = join(reportsDir, f.replace(".pdf", ".xlsx"));

      return {
        date: dateStr,
        label: formatLabel(dateStr),
        pdf: `/api/report-file?file=${PREFIX}${dateStr}.pdf`,
        excel: existsSync(excelPath) ? `/api/report-file?file=${PREFIX}${dateStr}.xlsx` : null,
      };
    });

    return NextResponse.json({ reports });
  } catch (err) {
    return NextResponse.json({ reports: [], error: String(err) }, { status: 500 });
  }
}
