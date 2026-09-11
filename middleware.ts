import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  apiAllowed,
  authConfigured,
  verifyRoleCookie,
  type AccessRole,
} from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (landing, login, APIs de auth, estáticos)
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/api/supervisor/heartbeat" ||
    pathname.startsWith("/api/reports-index") ||
    pathname.startsWith("/api/optimizacion-index") ||
    pathname.startsWith("/api/report-file") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/brand") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/login" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // En desarrollo local se permite trabajar sin credenciales. En producción,
  // una configuración sin AUTH_SECRET debe fallar cerrado para /ops y APIs
  // internas; de lo contrario un deploy mal configurado expone datos privados.
  if (!authConfigured()) {
    if (
      process.env.NODE_ENV === "production" &&
      (pathname.startsWith("/ops") ||
        (pathname.startsWith("/api/") && !apiAllowed("public", pathname)))
    ) {
      return NextResponse.json(
        { error: "Autenticación no configurada en producción" },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET!.trim();
  const session = await verifyRoleCookie(request.cookies.get(AUTH_COOKIE)?.value, secret);

  // Sin sesión = visitante público.
  const role: AccessRole = session ? session.role : "public";

  // Proteger rutas /ops: requieren sesión válida
  if (pathname.startsWith("/ops")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Rol pitch/client no puede acceder a /ops (solo ops)
    if (role !== "ops") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/api/") && !apiAllowed(role, pathname)) {
    return NextResponse.json(
      {
        error: role === "public" ? "Requiere iniciar sesión" : "Forbidden para rol",
        role,
        login: "/login",
      },
      { status: role === "public" ? 401 : 403 }
    );
  }

  const res = NextResponse.next();
  res.headers.set("x-rr-role", role);
  return res;
}

export const config = {
  // Excluimos _next y TODO archivo estático con extensión (imágenes, y en especial
  // PDF/XLSX/CSV de los reportes). Sin esto el middleware corría en cada descarga y
  // en cada Range request del visor de PDF, lo que puede provocar errores de Vercel.
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|xlsx|xls|csv|txt|woff|woff2|map)$).*)",
  ],
};
