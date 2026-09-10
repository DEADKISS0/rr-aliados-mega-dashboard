import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

interface ProjectRow {
  id: string;
  slug?: string;
  nombre?: string;
  categoria?: string;
  estado?: string;
  fase?: string;
  valor_total?: number | null;
  valor_pagado?: number | null;
  valor_potencial?: number | null;
  [key: string]: unknown;
}

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        { error: "Supabase no configurado", live: false },
        { status: 503 }
      );
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const data = (await res.json()) as ProjectRow[];

    // Enriquecer con datos calculados
    const enriched = data.map((p) => {
      const valorTotal = Number(p.valor_total ?? 0);
      const valorPagado = Number(p.valor_pagado ?? 0);
      return {
      ...p,
      valor_pendiente: valorTotal - valorPagado,
      progreso_pago: valorTotal > 0 ? Math.round((valorPagado / valorTotal) * 100) : 0,
      };
    });

    const stats = {
      total: enriched.length,
      activos: enriched.filter((p) => p.estado === "activo").length,
      prospectos: enriched.filter((p) => p.categoria === "prospecto").length,
      clientes: enriched.filter((p) => p.categoria === "cliente").length,
      valor_total: enriched.reduce((sum, p) => sum + Number(p.valor_total ?? 0), 0),
      valor_pagado: enriched.reduce((sum, p) => sum + Number(p.valor_pagado ?? 0), 0),
      valor_potencial: enriched.reduce((sum, p) => sum + Number(p.valor_potencial ?? 0), 0),
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
