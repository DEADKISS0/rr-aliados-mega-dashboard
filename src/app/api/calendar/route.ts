import { NextResponse } from "next/server";
import { getBusinessContext } from "@/data/businessContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function weekdayEs(d: Date): string {
  return d.toLocaleDateString("es-CO", { weekday: "long" });
}

/** DEMO calendar seeded with MiroFish + Wuunder when OAuth is missing. */
function buildDemoCalendar() {
  const ctx = getBusinessContext();
  const now = new Date();
  const deadline = new Date(ctx.wuunderDeadline);

  const today = [
    { id: "mf-am", time: "05:00", title: "MiroFish — Predicciones + Estratégico", type: "report", color: "var(--ember)" },
    { id: "mf-pm", time: "17:00", title: "MiroFish — regeneración PM", type: "report", color: "var(--ember)" },
  ];

  if (ctx.wuunderDaysLeft <= 14) {
    today.push({
      id: "wuunder-focus",
      time: "10:00",
      title: `Wuunder — seguimiento firma (${ctx.wuunderDaysLeft}d)`,
      type: "deadline",
      color: "var(--danger)",
    });
  }

  const tomorrow = [
    { id: "pipeline", time: "09:30", title: "Pipeline interno: Real Seguros / Fisio", type: "meeting", color: "var(--warning)" },
    { id: "sync", time: "18:15", title: "sync_reports.ps1 + health /api/automation", type: "deploy", color: "var(--success)" },
  ];

  const thisWeek: Array<{ id: string; day: string; title: string; type: string; color: string }> = [
    {
      id: "wuunder-dl",
      day: weekdayEs(deadline),
      title: `Deadline Wuunder (${ctx.wuunderDeadline})`,
      type: "deadline",
      color: "var(--danger)",
    },
    {
      id: "mirofish-loop",
      day: weekdayEs(now),
      title: "Loop MiroFish confiable (generate → sync → deploy)",
      type: "report",
      color: "var(--ember)",
    },
  ];

  return {
    configured: false,
    demo: true,
    message:
      "Google Calendar DEMO. Configura GOOGLE_CALENDAR_CLIENT_ID / SECRET / REFRESH_TOKEN en Vercel para datos reales.",
    cta: {
      label: "Configurar OAuth Calendar",
      docs: "Ver .env.example — GOOGLE_CALENDAR_*",
    },
    business: {
      wuunderDeadline: ctx.wuunderDeadline,
      wuunderDaysLeft: ctx.wuunderDaysLeft,
      runwayDays: ctx.runwayDays,
    },
    today,
    tomorrow,
    thisWeek,
  };
}

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(buildDemoCalendar());
    }

    // OAuth presente pero integración Google Calendar aún no cableada a API live
    const demo = buildDemoCalendar();
    return NextResponse.json({
      ...demo,
      configured: true,
      demo: true,
      message:
        "Credenciales Calendar detectadas; sync live pendiente. Mostrando agenda operativa (MiroFish/Wuunder).",
      cta: {
        label: "Implementar sync live (Sprint 3+)",
        docs: "GOOGLE_CALENDAR_* ya en env",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
