import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Metricool stub — only returns metrics when METRICOOL_API_TOKEN is set.
 * Without token: empty payload + DEMO CTA (no fake follower counts).
 */
export async function GET() {
  const token = process.env.METRICOOL_API_TOKEN?.trim();
  const brandId = process.env.METRICOOL_BRAND_ID?.trim();

  if (!token) {
    return NextResponse.json({
      configured: false,
      demo: true,
      live: false,
      metrics: [],
      message: "Metricool no configurado. Añade METRICOOL_API_TOKEN (+ METRICOOL_BRAND_ID) en Vercel.",
      cta: {
        label: "Conectar Metricool",
        docs: "https://metricool.com — API token de marca",
      },
    });
  }

  // Token present: ready shape. Live Metricool HTTP wiring pending brand-specific endpoints.
  return NextResponse.json({
    configured: true,
    demo: true,
    live: false,
    brandId: brandId || null,
    metrics: [],
    message:
      "Token Metricool detectado. Endpoints live pendientes — sin datos inventados hasta cablear la API.",
    cta: {
      label: "Completar sync live",
      docs: "Usar METRICOOL_API_TOKEN / METRICOOL_BRAND_ID",
    },
  });
}
