import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    // Vamos a loggear a un archivo
    console.error("=== DEBUG ERROR ===");
    console.error(text);
    const data = JSON.parse(text);
    console.error("Message:", data.message);
    console.error("Stack:", data.stack);
    console.error("Digest:", data.digest);
    console.error("Href:", data.href);
    console.error("UA:", data.ua);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
