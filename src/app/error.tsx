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
    console.error("RR Dashboard runtime error", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-primary, #0f0f0f)", color: "var(--text-primary, #f5e6d3)" }}>
      <section className="w-full max-w-lg rounded-2xl p-8" style={{ border: "1px solid rgba(206,61,31,.35)", background: "rgba(25,25,25,.9)" }}>
        <p className="font-mono-label text-xs tracking-widest mb-3" style={{ color: "#CE3D1F" }}>RR ALIADOS · RECUPERACIÓN</p>
        <h1 className="font-display text-3xl mb-3">No pudimos cargar esta vista</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary, #968e93)" }}>
          El error quedó aislado para que no se pierda toda la aplicación. Puedes reintentar o volver al inicio público.
        </p>
        <div className="flex gap-3">
          <button onClick={() => reset()} className="px-4 py-2 rounded-lg text-sm" style={{ background: "#CE3D1F", color: "#fff" }}>
            Reintentar
          </button>
          <a href="/" className="px-4 py-2 rounded-lg text-sm" style={{ border: "1px solid rgba(255,255,255,.18)" }}>
            Ir al inicio
          </a>
        </div>
      </section>
    </main>
  );
}
