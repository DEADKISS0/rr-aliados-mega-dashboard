"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report exact error via navigator.sendBeacon (no fetch needed)
    try {
      const payload = JSON.stringify({
        message: error?.message,
        stack: error?.stack?.substring(0, 500),
        digest: error?.digest,
        href: window.location.href,
        ua: navigator.userAgent,
      });
      navigator.sendBeacon("/api/__debug", payload);
    } catch {}
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center max-w-md px-6">
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: "rgba(234,179,8,0.1)" }}
        >
          ⚠️
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Error inesperado
        </h1>
        <p className="text-sm mb-2 opacity-70" style={{ color: "var(--text-secondary)" }}>
          Algo salió mal al cargar esta página. Puede ser un problema temporal del servidor.
        </p>
        <p className="text-[11px] font-mono mb-4 max-w-sm mx-auto break-all" style={{ color: "var(--text-muted)" }}>
          {error?.message || ""}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
