"use client";
import { useState, useEffect, useCallback } from "react";

const DASHBOARD_URL = "https://rr-aliados-mega-dashboard.vercel.app";
const QR_API = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(DASHBOARD_URL)}`;

export default function QRCodeModal() {
  const [open, setOpen] = useState(false);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onKey]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(DASHBOARD_URL);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = DASHBOARD_URL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost !p-2 !text-base"
        title="QR del Dashboard"
        aria-label="Mostrar QR del dashboard"
      >
        🔗
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Código QR del dashboard"
        >
          {/* Modal */}
          <div
            className="rounded-2xl p-8 max-w-sm w-full mx-4 text-center"
            style={{
              background: "var(--bg-primary)",
              border: "2px solid var(--ember-30)",
              boxShadow: "0 0 40px rgba(245, 95, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Ventana de código QR"
          >
            <h2
              className="font-display text-lg tracking-wide mb-4"
              style={{ color: "var(--ember-light)" }}
            >
              MEGA DASHBOARD
            </h2>

            {/* QR Image */}
            <div
              className="inline-block p-3 rounded-xl mb-4"
              style={{ background: "#fff", border: "2px solid var(--ember-30)" }}
            >
              <img
                src={QR_API}
                alt="QR Code - Mega Dashboard"
                width={200}
                height={200}
                className="block"
              />
            </div>

            <p className="font-mono-label text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Escanea para abrir el dashboard
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={copyLink}
                className="px-4 py-2 rounded-lg font-mono-label text-sm transition-all hover:brightness-110"
                style={{
                  background: "var(--ember)",
                  color: "var(--parchment)",
                  border: "1px solid var(--ember-30)",
                }}
              >
                📋 Copiar enlace
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg font-mono-label text-sm"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}