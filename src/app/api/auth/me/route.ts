import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, authConfigured, verifyRoleCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authConfigured()) {
    return NextResponse.json({
      authenticated: true,
      openMode: true,
      role: "ops",
      forcesPitch: false,
    });
  }

  const secret = process.env.AUTH_SECRET!.trim();
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifyRoleCookie(raw, secret);
  if (!session) {
    return NextResponse.json({ authenticated: false, openMode: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    openMode: false,
    role: session.role,
    forcesPitch: session.role === "pitch" || session.role === "client",
    exp: session.exp,
  });
}
