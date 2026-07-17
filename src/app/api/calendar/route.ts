import { NextResponse } from "next/server";
import { fetchLiveCalendar } from "@/lib/googleCalendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await fetchLiveCalendar();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
