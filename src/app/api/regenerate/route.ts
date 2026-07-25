import { NextRequest, NextResponse } from "next/server";
import { REGENERAR_INSTRUCTIONS, type ReportRegenerarVariant } from "@/data/regenerarReports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VARIANTS: ReportRegenerarVariant[] = ["predicciones", "optimizacion"];

export async function POST(req: NextRequest) {
  let body: { variant?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const variant = body.variant as ReportRegenerarVariant | undefined;
  if (!variant || !VARIANTS.includes(variant)) {
    return NextResponse.json(
      { ok: false, error: "variant debe ser predicciones u optimizacion" },
      { status: 400 }
    );
  }

  const webhook = process.env.MIROFISH_WEBHOOK_URL?.trim();
  const secret = process.env.MIROFISH_WEBHOOK_SECRET?.trim();

  if (webhook) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (secret) headers.Authorization = `Bearer ${secret}`;

      const resp = await fetch(webhook, {
        method: "POST",
        headers,
        body: JSON.stringify({
          source: "rr-aliados-mega-dashboard",
          variant,
          requestedAt: new Date().toISOString(),
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        console.error(`[regenerate] webhook HTTP ${resp.status}: ${text.slice(0, 200)}`);
        return NextResponse.json(
          {
            ok: false,
            mode: "webhook",
            error: `Webhook HTTP ${resp.status}`,
            instructions: REGENERAR_INSTRUCTIONS[variant],
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        ok: true,
        mode: "webhook",
        variant,
        message: "Webhook MiroFish disparado. Tras generar, ejecuta sync_reports.ps1 y redeploy.",
      });
    } catch (e) {
      console.error("[regenerate] webhook request failed:", e);
      return NextResponse.json(
        {
          ok: false,
          mode: "webhook",
          error: "No se pudo contactar el webhook de MiroFish.",
          instructions: REGENERAR_INSTRUCTIONS[variant],
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    ok: true,
    mode: "clipboard",
    variant,
    instructions: REGENERAR_INSTRUCTIONS[variant],
    message: "Sin MIROFISH_WEBHOOK_URL — usa instrucciones locales (clipboard).",
  });
}
