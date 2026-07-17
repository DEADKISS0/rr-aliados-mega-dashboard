import { NextResponse } from "next/server";
import { buildGa4Demo, fetchGa4Bundle } from "@/lib/ga4";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.trim();

    if (!propertyId || !serviceAccountKey) {
      return NextResponse.json(buildGa4Demo());
    }

    try {
      const live = await fetchGa4Bundle(propertyId, serviceAccountKey);
      return NextResponse.json(live);
    } catch (e) {
      const demo = buildGa4Demo();
      return NextResponse.json({
        ...demo,
        configured: true,
        live: false,
        demo: true,
        error: e instanceof Error ? e.message : "GA4 error",
        message:
          "Credenciales GA4 presentes pero la API falló. Revisar permisos de la service account.",
      });
    }
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
