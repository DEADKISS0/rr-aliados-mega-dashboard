import { NextResponse } from "next/server";
import { fetchSupabaseRows, SupabaseConfigError } from "@/lib/supabaseRest";

export async function GET() {
  try {
    const data = await fetchSupabaseRows("demos", "select=*&order=created_at.desc");

    return NextResponse.json({
      demos: data,
      total: data.length,
      live: true,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: error.message, live: false }, { status: 503 });
    }
    console.error("Demos API error:", error);
    return NextResponse.json(
      { error: "Error consultando demos", live: false },
      { status: 500 }
    );
  }
}
