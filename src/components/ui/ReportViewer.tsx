"use client";

import { useState } from "react";

interface ReportViewerProps {
  pdf?: string | null;
  excel?: string | null;
  title?: string;
  /** Default true — always show the PDF canvas */
  defaultOpen?: boolean;
  /** Compact toolbar only (no iframe until expanded) — unused when defaultOpen */
  className?: string;
}

/**
 * Visor PDF usable: FitH, alto generoso, abrir en pestaña, expandir.
 */
export default function ReportViewer({
  pdf,
  excel,
  title = "Reporte",
  defaultOpen = true,
  className = "",
}: ReportViewerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [tall, setTall] = useState(false);

  if (!pdf && !excel) return null;

  const pdfSrc = pdf
    ? `${pdf}${pdf.includes("#") ? "&" : "#"}toolbar=1&navpanes=0&scrollbar=1&view=FitH`
    : null;

  const height = tall ? "min(85vh, 920px)" : "min(70vh, 720px)";

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2 items-center">
        {pdf && (
          <>
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-1.5 !px-3 text-[11px]"
            >
              Abrir PDF ↗
            </a>
            <a href={pdf} download className="btn-ghost !py-1.5 !px-3 text-[11px]">
              Descargar
            </a>
          </>
        )}
        {excel && (
          <a
            href={excel}
            download
            className="btn-primary !py-1.5 !px-3 text-[11px]"
            style={{ background: "var(--success)" }}
          >
            Excel
          </a>
        )}
        {pdf && (
          <>
            <button
              type="button"
              className="btn-ghost !py-1.5 !px-3 text-[11px]"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Ocultar vista" : "Mostrar vista"}
            </button>
            {open && (
              <button
                type="button"
                className="btn-ghost !py-1.5 !px-3 text-[11px]"
                onClick={() => setTall((v) => !v)}
              >
                {tall ? "Altura normal" : "Expandir"}
              </button>
            )}
          </>
        )}
      </div>

      {open && pdfSrc && (
        <div
          className="relative w-full rounded-lg overflow-hidden"
          style={{
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            height,
            minHeight: tall ? 640 : 480,
          }}
        >
          <iframe
            src={pdfSrc}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            style={{ background: "#1a1a1a" }}
          />
        </div>
      )}
    </div>
  );
}
