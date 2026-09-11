import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_MAX_AGE_SEC,
  resolveBackupPassword,
  resolveRoleFromPassword,
  signRole,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.AUTH_SECRET?.trim() || "rr-dev-secret";

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const password = String(body.password || "");

  // Clave de respaldo: entra como ops sin importar las claves por rol.
  if (await resolveBackupPassword(password)) {
    const token = await signRole("ops", secret);
    const res = NextResponse.json({ ok: true, role: "ops", forcesPitch: false });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_MAX_AGE_SEC,
    });
    return res;
  }

  if (!password) {
    return NextResponse.json({ ok: false, error: "password requerido" }, { status: 400 });
  }

  // Claves por rol (legacy, se mantienen por compatibilidad).
  const role = resolveRoleFromPassword(password);
  if (!role) {
    return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = await signRole(role, secret);
  const res = NextResponse.json({
    ok: true,
    role,
    forcesPitch: role === "pitch" || role === "client",
  });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE_SEC,
  });
  return res;
}
