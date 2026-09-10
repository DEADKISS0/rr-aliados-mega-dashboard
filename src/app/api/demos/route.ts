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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/demos?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      demos: data,
      total: data.length,
      live: true,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Demos API error:", error);
    return NextResponse.json(
      { error: "Error consultando demos", live: false },
      { status: 500 }
    );
  }
}
