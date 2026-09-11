import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCOPES = ["openid", "email", "profile"];

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.json(
      { error: "Google OAuth no configurado (GOOGLE_CLIENT_ID)" },
      { status: 503 }
    );
  }

  const next = request.nextUrl.searchParams.get("next") || "/ops";
  // state codifica el destino post-login + nonce anti-CSRF
  const nonce = crypto.randomUUID();
  const state = JSON.stringify({ next, nonce });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/google/callback`,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "online",
    prompt: "select_account",
    state,
    include_granted_scopes: "true",
  });

  // Guardamos el nonce en una cookie httpOnly para validar el estado al volver.
  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  res.cookies.set("rr_oauth_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 min
  });
  return res;
}
