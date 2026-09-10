import { NextResponse } from "next/server";
import { fetchSupabaseRows, SupabaseConfigError } from "@/lib/supabaseRest";

interface EntityRow {
  tipo?: string;
  estado?: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const data = await fetchSupabaseRows<EntityRow>("entities", "select=*&order=nombre.asc");

    const stats = {
      total: data.length,
      clientes: data.filter((e) => e.tipo === "cliente").length,
      prospectos: data.filter((e) => e.tipo === "prospecto").length,
      activos: data.filter((e) => e.estado === "activo").length,
    };

    return NextResponse.json({
      entities: data,
      stats,
      live: true,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: error.message, live: false }, { status: 503 });
    }
    console.error("Entities API error:", error);
    return NextResponse.json(
      { error: "Error consultando entidades", live: false },
      { status: 500 }
    );
  }
}
