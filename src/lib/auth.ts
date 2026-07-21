export type DashboardRole = "ops" | "pitch" | "client";

export const AUTH_COOKIE = "rr_role";
export const AUTH_MAX_AGE_SEC = 60 * 60 * 12; // 12h

const SENSITIVE_API_PREFIXES = [
  "/api/automation",
  "/api/regenerate",
  "/api/chat",
  "/api/metricool",
  "/api/dashweb/users",
];

export function authConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET?.trim());
}

export function roleAllowsApi(role: DashboardRole, pathname: string): boolean {
  if (role === "ops") return true;
  return !SENSITIVE_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function b64urlBytes(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromB64url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSha256(secret: string, payload: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function signRole(
  role: DashboardRole,
  secret: string,
  now = Date.now()
): Promise<string> {
  const exp = now + AUTH_MAX_AGE_SEC * 1000;
  const payload = `${role}.${exp}`;
  const sig = await hmacSha256(secret, payload);
  return `${payload}.${b64urlBytes(sig)}`;
}

export async function verifyRoleCookie(
  value: string | undefined | null,
  secret: string
): Promise<{ role: DashboardRole; exp: number } | null> {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [role, expStr, sig] = parts;
  if (role !== "ops" && role !== "pitch" && role !== "client") return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  const payload = `${role}.${exp}`;
  const expected = await hmacSha256(secret, payload);
  let provided: Uint8Array;
  try {
    provided = fromB64url(sig);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expected, provided)) return null;
  return { role, exp };
}

export function resolveRoleFromPassword(password: string): DashboardRole | null {
  const ops = process.env.AUTH_OPS_PASSWORD?.trim();
  const pitch = process.env.AUTH_PITCH_PASSWORD?.trim();
  const client = process.env.AUTH_CLIENT_PASSWORD?.trim();
  if (ops && password === ops) return "ops";
  if (pitch && password === pitch) return "pitch";
  if (client && password === client) return "client";
  return null;
}

export function roleForcesPitch(role: DashboardRole): boolean {
  return role === "pitch" || role === "client";
}

// ── Modelo de acceso por niveles ──────────────────────────────────────────
// public  = visitante sin sesión → solo showcase (desarrollos + ejemplos).
// client/pitch (secretario) = sesión limitada → showcase + operación (sin ops).
// ops = admin → todo.
export type AccessRole = DashboardRole | "public";

// APIs accesibles SIN sesión (las que alimentan el showcase público).
const PUBLIC_API_PREFIXES = [
  "/api/analytics",
  "/api/news",
  "/api/ecosystem",
  "/api/automation",
];

// APIs SOLO para ops (admin). El resto de APIs no-públicas quedan disponibles
// para secretario (client/pitch) y ops.
const OPS_ONLY_API_PREFIXES = [
  "/api/dashweb/users",
  "/api/pipeline",
  "/api/chat",
  "/api/regenerate",
  "/api/metricool",
  "/api/generate-pdf",
];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function apiAllowed(role: AccessRole, pathname: string): boolean {
  if (!pathname.startsWith("/api/")) return true;
  if (role === "ops") return true;
  if (role === "public") return matchesPrefix(pathname, PUBLIC_API_PREFIXES);
  // secretario (client/pitch): todo salvo lo marcado como ops-only.
  return !matchesPrefix(pathname, OPS_ONLY_API_PREFIXES);
}

export function tierForRole(role: AccessRole): "public" | "auth" | "ops" {
  if (role === "ops") return "ops";
  if (role === "public") return "public";
  return "auth";
}
