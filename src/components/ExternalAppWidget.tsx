"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import type { EcosystemApp } from "@/data/ecosystemApps";

type LoadState = "loading" | "loaded" | "timeout" | "error" | "card";

const LOAD_TIMEOUT_MS = 20000;

interface Props {
  app: EcosystemApp;
}

export default function ExternalAppWidget({ app }: Props) {
  const { title, url, icon, blurb, embed } = app;
  const forceCard = embed === "card";
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [state, setState] = useState<LoadState>(forceCard ? "card" : "loading");
  const [retryKey, setRetryKey] = useState(0);
  const [inView, setInView] = useState(false);
  const [alive, setAlive] = useState<"unknown" | "up" | "down">("unknown");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Health ping (no CORS body needed — opaque ok via no-cors won't give status;
  // use our automation eco jobs when available, else assume unknown)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch("/api/automation");
        const data = await resp.json();
        const job = (data.jobs || []).find((j: { id?: string }) => j.id === `eco-${app.id}`);
        if (!cancelled && job) {
          setAlive(job.status === "ok" ? "up" : job.status === "error" ? "down" : "unknown");
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [app.id]);

  useEffect(() => {
    if (forceCard) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [forceCard]);

  useEffect(() => {
    if (forceCard || !inView) return;
    setState("loading");
    const t = window.setTimeout(() => setSrc(url), 0);
    return () => window.clearTimeout(t);
  }, [forceCard, inView, url, retryKey]);

  useEffect(() => {
    if (forceCard || !src || state === "loaded" || state === "card") return;
    const t = window.setTimeout(() => {
      setState((s) => {
        if (s === "loading") {
          // auto / iframe: fall back to card so UI never looks "broken blank"
          return embed === "iframe" ? "timeout" : "card";
        }
        return s;
      });
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [forceCard, src, state, retryKey, embed]);

  const markLoaded = useCallback(() => setState("loaded"), []);

  const retry = () => {
    if (forceCard) return;
    setSrc(undefined);
    setState("loading");
    setRetryKey((k) => k + 1);
  };

  const showCard = state === "card" || forceCard;
  const showOverlay =
    !showCard && (state === "loading" || state === "timeout" || state === "error");

  const statusDot =
    alive === "up" ? "var(--success)" : alive === "down" ? "var(--danger)" : "var(--ash)";

  return (
    <WidgetCard
      title={title}
      icon={icon}
      badge={showCard ? "Link" : state === "loaded" ? "Embed" : "…"}
      badgeVariant="support"
      action={
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1 !px-2">
          ↗ Abrir
        </a>
      }
    >
      <div
        ref={wrapRef}
        className="report-iframe relative rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--border-subtle)" }}
      >
        {showCard ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center"
            style={{ background: "linear-gradient(160deg, var(--pitch), var(--void))" }}
          >
            <div className="text-4xl">{icon}</div>
            <div>
              <p className="font-display text-lg tracking-wide" style={{ color: "var(--parchment)" }}>
                {title}
              </p>
              <p className="text-[11px] mt-1 max-w-xs" style={{ color: "var(--ash)" }}>
                {blurb}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono-label text-[10px]" style={{ color: "var(--ash)" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: statusDot }} />
              {alive === "up" ? "Online" : alive === "down" ? "Sin respuesta" : "Estado n/d"}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !py-2 !px-4 text-xs"
              >
                Abrir aplicación ↗
              </a>
              {!forceCard && (
                <button type="button" className="btn-ghost !py-2 !px-3 text-xs" onClick={retry}>
                  Probar embed
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {showOverlay && (
              <div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  pointerEvents: state === "timeout" || state === "error" ? "auto" : "none",
                }}
              >
                <div className="text-center px-4 max-w-sm">
                  <div className="text-3xl mb-2">{icon}</div>
                  {state === "loading" && (
                    <p className="text-sm font-mono-label">Cargando {title}…</p>
                  )}
                  {(state === "timeout" || state === "error") && (
                    <>
                      <p className="text-sm font-mono-label mb-3">
                        {state === "error" ? `No se pudo cargar ${title}` : `${title} no embebe (timeout)`}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button type="button" className="btn-ghost !py-1 !px-3" onClick={retry}>
                          Reintentar
                        </button>
                        <button
                          type="button"
                          className="btn-ghost !py-1 !px-3"
                          onClick={() => setState("card")}
                        >
                          Vista tarjeta
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost !py-1 !px-3"
                          style={{ color: "var(--ember)" }}
                        >
                          Abrir ↗
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {src && (
              <iframe
                key={retryKey}
                src={src}
                title={title}
                className="w-full h-full border-0"
                style={{ background: "var(--pitch)", minHeight: "520px" }}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="clipboard-read; clipboard-write; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={markLoaded}
                onError={() => setState(embed === "iframe" ? "error" : "card")}
              />
            )}
          </>
        )}
      </div>
    </WidgetCard>
  );
}
