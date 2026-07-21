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

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/brand") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // NOTA DE SEGURIDAD: sin AUTH_SECRET el dashboard queda totalmente abierto
  // (modo dev/local). En Vercel SIEMPRE debe existir AUTH_SECRET; ahí aplica el
  // modelo por niveles de abajo.
  if (!authConfigured()) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET!.trim();
  const session = await verifyRoleCookie(request.cookies.get(AUTH_COOKIE)?.value, secret);

  // Sin sesión = visitante público. NUNCA lo mandamos a /login: ve el showcase.
  // El rol efectivo solo restringe qué APIs sensibles puede consumir y qué
  // widgets renderiza el cliente (via data-rr-tier).
  const role: AccessRole = session ? session.role : "public";

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
