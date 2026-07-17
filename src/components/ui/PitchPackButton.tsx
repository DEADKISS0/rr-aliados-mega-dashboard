"use client";
import { useState } from "react";

interface PitchPackButtonProps {
  className?: string;
  label?: string;
  compact?: boolean;
}

export default function PitchPackButton({
  className = "",
  label = "Pack Pitch",
  compact = false,
}: PitchPackButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const resp = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: "pitch" }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success || !data.html) {
        throw new Error(data.error || "No se pudo generar el pack");
      }

      const blob = new Blob([data.html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `RR_ALIADOS_Pack_Pitch_${new Date().toISOString().slice(0, 10)}.html`;
      a.click();

      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (win) {
        const tryPrint = () => {
          try {
            win.focus();
            win.print();
          } catch {
            /* manual print */
          }
        };
        win.addEventListener("load", tryPrint);
        window.setTimeout(tryPrint, 800);
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className={`inline-flex flex-col items-end gap-0.5 ${className}`}>
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className={compact ? "btn-ghost !py-1 !px-2 text-xs" : "btn-ghost !py-1.5 !px-2.5 text-xs"}
        title="Genera pack pitch branded (HTML + diálogo imprimir/PDF)"
        aria-label="Descargar pack pitch"
      >
        {busy ? "Generando…" : label}
      </button>
      {error && (
        <span className="font-mono-label text-[9px]" style={{ color: "var(--danger)" }}>
          {error}
        </span>
      )}
    </span>
  );
}
