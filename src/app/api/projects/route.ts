import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ntgtvtzbjwotuwkiflar.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

export async function GET() {
  try {
    if (!SUPABASE_KEY) {
      return NextResponse.json(
        { error: "Supabase no configurado", demo: true },
        { status: 503 }
      );
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 60 }, // Cache 60s
    });

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const data = await res.json();

    // Enriquecer con datos calculados
    const enriched = data.map((p: Record<string, unknown>) => ({
      ...p,
      valor_pendiente: (p.valor_total || 0) - (p.valor_pagado || 0),
      progreso_pago: p.valor_total > 0 ? Math.round(((p.valor_pagado || 0) / p.valor_total) * 100) : 0,
    }));

    const stats = {
      total: enriched.length,
      activos: enriched.filter((p: { estado: string }) => p.estado === "activo").length,
      prospectos: enriched.filter((p: { categoria: string }) => p.categoria === "prospecto").length,
      clientes: enriched.filter((p: { categoria: string }) => p.categoria === "cliente").length,
      valor_total: enriched.reduce((sum: number, p: { valor_total: number }) => sum + (p.valor_total || 0), 0),
      valor_pagado: enriched.reduce((sum: number, p: { valor_pagado: number }) => sum + (p.valor_pagado || 0), 0),
      valor_potencial: enriched.reduce((sum: number, p: { valor_potencial: number }) => sum + (p.valor_potencial || 0), 0),
    };

    return NextResponse.json({
      projects: enriched,
      stats,
      live: true,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { error: "Error consultando proyectos", live: false },
      { status: 500 }
    );
  }
}
