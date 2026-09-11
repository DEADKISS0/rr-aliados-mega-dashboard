import { NextResponse } from "next/server";
import { ECOSYSTEM_APPS } from "@/data/ecosystemApps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type EmbedProbe = {
  id: string;
  title: string;
  url: string;
  configuredEmbed: string;
  httpStatus: number | null;
  xFrameOptions: string | null;
  frameAncestors: string | null;
  /** Server-side heuristic: headers do not hard-block framing */
  headersAllowEmbed: boolean;
  /** soft | hard | ok */
  verdict: "ok" | "soft-block" | "hard-block" | "unreachable";
  detail: string;
};

function parseFrameAncestors(csp: string | null): string | null {
  if (!csp) return null;
  const m = csp.match(/frame-ancestors\s+([^;]+)/i);
  return m ? m[1].trim() : null;
}

function classify(
  xfo: string | null,
  frameAncestors: string | null
): { allow: boolean; verdict: EmbedProbe["verdict"]; detail: string } {
  const x = (xfo || "").toUpperCase();
  if (x.includes("DENY") || x === "SAMEORIGIN") {
    return {
      allow: false,
      verdict: "hard-block",
      detail: `X-Frame-Options: ${xfo}`,
    };
  }
  // Non-standard ALLOWALL — treat as allow
  if (x.includes("ALLOWALL") || x === "") {
    /* continue */
  }
  if (frameAncestors) {
    const fa = frameAncestors.toLowerCase();
    if (fa.includes("'none'")) {
      return { allow: false, verdict: "hard-block", detail: `frame-ancestors ${frameAncestors}` };
    }
    if (fa.includes("*")) {
      return { allow: true, verdict: "ok", detail: "frame-ancestors *" };
    }
    const allowsUs =
      fa.includes("rr-aliados-mega-dashboard.vercel.app") ||
      fa.includes("skill-orchestrator-dashboard.vercel.app");
    if (!allowsUs) {
      return {
        allow: false,
        verdict: "soft-block",
        detail: `frame-ancestors no lista mega-dashboard: ${frameAncestors}`,
      };
    }
  }
  return { allow: true, verdict: "ok", detail: "Sin bloqueo de framing en headers" };
}

async function probeUrl(url: string): Promise<{
  status: number | null;
  xfo: string | null;
  csp: string | null;
}> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const resp = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "RR-Aliados-EmbedCheck/1.0" },
    });
    clearTimeout(t);
    return {
      status: resp.status,
      xfo: resp.headers.get("x-frame-options"),
      csp: resp.headers.get("content-security-policy"),
    };
  } catch {
    return { status: null, xfo: null, csp: null };
  }
}

export async function GET() {
  const results: EmbedProbe[] = [];

  for (const app of ECOSYSTEM_APPS) {
    // Una ruta interna (mismo origen) no se puede sondear por red: es embebible por definición.
    if (app.url.startsWith("/")) {
      results.push({
        id: app.id,
        title: app.title,
        url: app.url,
        configuredEmbed: app.embed,
        httpStatus: 200,
        xFrameOptions: null,
        frameAncestors: null,
        headersAllowEmbed: true,
        verdict: "ok",
        detail: "Ruta interna del propio dashboard (mismo origen)",
      });
      continue;
    }
    const { status, xfo, csp } = await probeUrl(app.url);
    const fa = parseFrameAncestors(csp);
    if (status === null) {
      results.push({
        id: app.id,
        title: app.title,
        url: app.url,
        configuredEmbed: app.embed,
        httpStatus: null,
        xFrameOptions: null,
        frameAncestors: null,
        headersAllowEmbed: false,
        verdict: "unreachable",
        detail: "No responde / timeout",
      });
      continue;
    }
    const { allow, verdict, detail } = classify(xfo, fa);
    results.push({
      id: app.id,
      title: app.title,
      url: app.url,
      configuredEmbed: app.embed,
      httpStatus: status,
      xFrameOptions: xfo,
      frameAncestors: fa,
      headersAllowEmbed: allow,
      verdict,
      detail,
    });
  }

  const hardFails = results.filter(
    (r) =>
      (r.configuredEmbed === "iframe" || r.configuredEmbed === "auto") &&
      (r.verdict === "hard-block" || r.verdict === "unreachable")
  );

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    ok: hardFails.length === 0,
    hardFails: hardFails.map((r) => r.id),
    results,
  });
}
