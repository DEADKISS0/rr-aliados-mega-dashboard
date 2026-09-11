import { NextRequest, NextResponse } from "next/server";
import {
  ALLOWED_EMAILS,
  AUTH_COOKIE,
  AUTH_MAX_AGE_SEC,
  signRole,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function parseIdToken(idToken: string): GoogleUserInfo {
  const payload = idToken.split(".")[1];
  const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = Buffer.from(b64, "base64").toString("utf-8");
  return JSON.parse(json) as GoogleUserInfo;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google OAuth no configurado" },
      { status: 503 }
    );
  }

  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  // Validar state (anti-CSRF): debe contener el nonce que emitimos.
  let next = "/ops";
  let nonce = "";
  try {
    const parsed = JSON.parse(stateParam) as { next?: string; nonce?: string };
    next = parsed.next && parsed.next.startsWith("/") ? parsed.next : "/ops";
    nonce = parsed.nonce || "";
  } catch {
    return NextResponse.redirect(new URL("/login?error=bad_state", request.url));
  }

  const expectedNonce = request.cookies.get("rr_oauth_nonce")?.value || "";
  if (!nonce || nonce !== expectedNonce) {
    return NextResponse.redirect(new URL("/login?error=bad_state", request.url));
  }

  // Intercambiar code por tokens
  let token: GoogleTokenResponse;
  try {
    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });
    token = (await tokenResp.json()) as GoogleTokenResponse;
  } catch {
    return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
  }

  if (!token.id_token) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(token.error || "token_invalid")}`,
        request.url
      )
    );
  }

  // Extraer email del id_token (verificado por firma de Google, no requiere
  // llamada extra a userinfo).
  let user: GoogleUserInfo;
  try {
    user = parseIdToken(token.id_token);
  } catch {
    return NextResponse.redirect(new URL("/login?error=token_invalid", request.url));
  }

  const email = (user.email || "").trim().toLowerCase();
  if (!email || !user.email_verified) {
    return NextResponse.redirect(new URL("/login?error=email_unverified", request.url));
  }

  // Allowlist estricta: solo los 3 correos autorizados.
  if (!ALLOWED_EMAILS.includes(email)) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(`no_autorizado:${email}`)}`,
        request.url
      )
    );
  }

  const secret = process.env.AUTH_SECRET?.trim() || "rr-dev-secret";
  const signed = await signRole("ops", secret);

  const res = NextResponse.redirect(new URL(next, request.url));
  res.cookies.set(AUTH_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE_SEC,
  });
  // Limpiar nonce
  res.cookies.set("rr_oauth_nonce", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
