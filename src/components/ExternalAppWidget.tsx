"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WidgetCard from "@/components/ui/WidgetCard";
import type { EcosystemApp } from "@/data/ecosystemApps";

type LoadState = "loading" | "loaded" | "timeout" | "error" | "card";

const LOAD_TIMEOUT_MS = 12000;

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
  const [expanded, setExpanded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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
    // Cargar de inmediato (evita "Cargando…" eterno si el grid está fuera de viewport)
    setInView(true);
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" }
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
        if (s === "loading") return embed === "iframe" ? "timeout" : "card";
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

  const frameH = expanded ? "min(75vh, 780px)" : undefined;

  return (
    <WidgetCard
      title={title}
      icon={icon}
      badge={showCard ? "Abrir" : state === "loaded" ? "Live" : "…"}
      badgeVariant="support"
      action={
        <div className="flex items-center gap-1">
          {!showCard && state === "loaded" && (
            <button
              type="button"
              className="btn-ghost !py-1 !px-2 text-[10px]"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "−" : "+"}
            </button>
          )}
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1 !px-2">
            ↗ Abrir
          </a>
        </div>
      }
    >
      <div
        ref={wrapRef}
        className="app-preview relative rounded-lg overflow-hidden"
        style={{
          border: "1px solid var(--border-subtle)",
          height: frameH || (showCard ? 280 : 420),
          minHeight: showCard ? 280 : 420,
        }}
      >
        {showCard ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center no-underline"
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
            <span className="btn-primary !py-2 !px-4 text-xs pointer-events-none">
              {forceCard ? "Abrir en nueva pestaña ↗" : "Abrir aplicación ↗"}
            </span>
            <p className="text-[10px] max-w-xs" style={{ color: "var(--ash)" }}>
              {forceCard
                ? "Esta app no se embebe (auth o host). Usa Abrir para verla completa."
                : "Si el embed falla, usa Abrir o Vista tarjeta."}
            </p>
            {!forceCard && (
              <button
                type="button"
                className="btn-ghost !py-1 !px-3 text-[10px]"
                style={{ color: "var(--ash)" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  retry();
                }}
              >
                Reintentar embed
              </button>
            )}
          </a>
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
                        {state === "error" ? `No se pudo cargar ${title}` : `${title} no embebe`}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button type="button" className="btn-ghost !py-1 !px-3" onClick={retry}>
                          Reintentar
                        </button>
                        <button type="button" className="btn-ghost !py-1 !px-3" onClick={() => setState("card")}>
                          Vista tarjeta
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary !py-1 !px-3 text-xs"
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
                className="absolute inset-0 w-full h-full border-0"
                style={{ background: "var(--pitch)" }}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="clipboard-read; clipboard-write; fullscreen"
                onLoad={markLoaded}
                onError={() => setState(embed === "iframe" ? "error" : "card")}
              />
            )}
            {state === "loaded" && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 z-20 btn-primary !py-1 !px-2 text-[10px] shadow-lg"
              >
                Pantalla completa ↗
              </a>
            )}
          </>
        )}
      </div>
    </WidgetCard>
  );
}
