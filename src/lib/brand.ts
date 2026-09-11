/**
 * Marca RR ALIADOS — fuente de verdad: Supabase Storage (bucket `brand-assets/rr`).
 *
 * Los activos canónicos (símbolo doble R entrelazada, favicon, iconos, OG) viven en
 * la base de datos. `BRAND_BASE` es configurable para no acoplar el código a un
 * proyecto concreto; si el bucket no responde, los archivos locales equivalentes
 * siguen presentes en `public/brand/` como respaldo.
 */

const DEFAULT_BRAND_BASE =
  "https://ntgtvtzbjwotuwkiflar.supabase.co/storage/v1/object/public/brand-assets/rr";

export const BRAND_BASE = (
  process.env.NEXT_PUBLIC_BRAND_BASE || DEFAULT_BRAND_BASE
).replace(/\/$/, "");

const asset = (name: string) => `${BRAND_BASE}/${name}`;

export const BRAND = {
  // Símbolo (doble R entrelazada) por variante de color
  symbolFucsia: asset("simbolo_transparent_fucsia.png"),
  symbolBlanco: asset("simbolo_transparent_blanco.png"),
  symbolMostaza: asset("simbolo_transparent_mostaza.png"),
  symbolNegro: asset("simbolo_transparent_negro.png"),
  symbolOrquidea: asset("simbolo_transparent_orquidea.png"),

  // Lockups cuadrados (para header / avatar / PWA)
  logo: asset("logo-fucsia-on-negro.png"),
  logoBlanco: asset("logo-blanco-on-negro.png"),
  logoMostaza: asset("logo-negro-on-mostaza.png"),

  // Favicon e iconos de aplicación
  favicon: asset("favicon.ico"),
  favicon192: asset("favicon-192.png"),
  favicon512: asset("favicon-512.png"),
  appleTouch: asset("apple-touch-icon.png"),

  // Social
  ogImage: asset("og-image.png"),
} as const;

/** Host de Supabase Storage, para `images.remotePatterns` en Next. */
export function brandRemotePattern(): { protocol: "https"; hostname: string } {
  try {
    const u = new URL(BRAND_BASE);
    return { protocol: "https", hostname: u.hostname };
  } catch {
    return { protocol: "https", hostname: "ntgtvtzbjwotuwkiflar.supabase.co" };
  }
}
