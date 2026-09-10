import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        { error: "Supabase no configurado", live: false },
        { status: 503 }
      );
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/entities?select=*&order=nombre.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const data = await res.json();

    const stats = {
      total: data.length,
      clientes: data.filter((e: { tipo: string }) => e.tipo === "cliente").length,
      prospectos: data.filter((e: { tipo: string }) => e.tipo === "prospecto").length,
      activos: data.filter((e: { estado: string }) => e.estado === "activo").length,
    };

    return NextResponse.json({
      entities: data,
      stats,
      live: true,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Entities API error:", error);
    return NextResponse.json(
      { error: "Error consultando entidades", live: false },
      { status: 500 }
    );
  }
}
