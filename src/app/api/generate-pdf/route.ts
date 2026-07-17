import { NextRequest, NextResponse } from "next/server";
import { buildDashboardGrounding } from "@/lib/dashboardContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BRAND = {
  PITCH: "#0F0F0F",
  EMBER: "#CE3D1F",
  PARCHMENT: "#F5E6D3",
  VOID: "#3F0035",
  ASH: "#968E93",
} as const;

type Section = { title: string; content: string; type: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const template = body.template as string | undefined;

    let title: string;
    let sections: Section[];

    if (template === "pitch") {
      const grounding = await buildDashboardGrounding();
      title = "RR ALIADOS — Pack Pitch";
      sections = grounding.pitchSections;
    } else {
      title = body.title;
      sections = body.sections;
      if (!title || !sections || !Array.isArray(sections)) {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
      }
    }

    const htmlContent = generateHTMLReport(title, sections, template === "pitch");

    return NextResponse.json({
      success: true,
      html: htmlContent,
      title,
      sections: sections.length,
      template: template === "pitch" ? "pitch" : "custom",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Error generando PDF" }, { status: 500 });
  }
}

function generateHTMLReport(title: string, sections: Section[], isPitch: boolean): string {
  const now = new Date().toLocaleString("es-CO", { dateStyle: "full", timeStyle: "short" });

  const sectionsHTML = sections
    .map(
      (s) => `
    <div class="section">
      <h2>${s.title}</h2>
      <div class="content">${s.content}</div>
    </div>`
    )
    .join("\n");

  const subtitle = isPitch
    ? "Pack Pitch · Cliente / Inversor"
    : "RR ALIADOS S.A.S. — Reporte Generado por IA";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title} - RR ALIADOS</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      background: ${BRAND.PITCH};
      color: ${BRAND.PARCHMENT};
      line-height: 1.6;
    }
    .cover {
      background: linear-gradient(145deg, ${BRAND.PITCH} 0%, ${BRAND.VOID} 100%);
      padding: 48px 40px;
      text-align: center;
      min-height: 92vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 4px solid ${BRAND.EMBER};
    }
    .brand {
      font-size: 13px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: ${BRAND.EMBER};
      margin-bottom: 18px;
    }
    .cover h1 {
      font-size: 34px;
      color: ${BRAND.PARCHMENT};
      margin-bottom: 12px;
      letter-spacing: 0.08em;
      font-weight: 700;
    }
    .cover .subtitle {
      font-size: 16px;
      color: ${BRAND.EMBER};
      margin-bottom: 28px;
    }
    .cover .company {
      font-size: 13px;
      color: ${BRAND.ASH};
      margin-top: 24px;
    }
    .cover .date {
      font-size: 12px;
      color: ${BRAND.ASH};
      margin-top: 8px;
    }
    .section {
      padding: 28px 36px;
      border-bottom: 1px solid ${BRAND.VOID};
    }
    .section h2 {
      font-size: 18px;
      color: ${BRAND.EMBER};
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid ${BRAND.EMBER};
      letter-spacing: 0.04em;
    }
    .section .content {
      font-size: 13.5px;
      color: ${BRAND.PARCHMENT};
      line-height: 1.75;
    }
    .section .content p { margin-bottom: 10px; }
    .section .content ul { margin: 0 0 12px 18px; }
    .section .content li { margin-bottom: 6px; }
    .section .content strong { color: ${BRAND.EMBER}; }
    .section .content em { color: ${BRAND.ASH}; }
    .footer {
      padding: 18px 36px;
      text-align: center;
      font-size: 11px;
      color: ${BRAND.ASH};
      border-top: 2px solid ${BRAND.VOID};
    }
    .print-hint {
      text-align: center;
      padding: 10px;
      font-size: 11px;
      color: ${BRAND.ASH};
      border-bottom: 1px solid ${BRAND.VOID};
    }
    @media print {
      body { background: ${BRAND.PITCH} !important; color: ${BRAND.PARCHMENT} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover { page-break-after: always; min-height: auto; padding: 80px 40px; }
      .print-hint { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-hint">Imprime / Guarda como PDF (Ctrl+P) · Brutalismo Estratégico Colombiano</div>
  <div class="cover">
    <div class="brand">RR ALIADOS</div>
    <h1>${title.toUpperCase()}</h1>
    <div class="subtitle">${subtitle}</div>
    <div class="company">RR ALIADOS S.A.S. — NIT 902.036.366 — Medellín, Colombia</div>
    <div class="date">${now}</div>
  </div>
  ${sectionsHTML}
  <div class="footer">
    <p>RR ALIADOS S.A.S. — Pack generado desde Mega Dashboard (datos vivos + snapshot interno)</p>
    <p>${now}</p>
  </div>
</body>
</html>`;
}
