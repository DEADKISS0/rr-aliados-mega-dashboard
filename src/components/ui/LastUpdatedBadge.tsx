"use client";
import { useLastUpdated } from "@/hooks/useLastUpdated";

interface LastUpdatedBadgeProps {
  /** API path to fetch Last-Modified header from */
  path?: string;
  /** ISO date string from index JSON (for MiroFish/ReporteOptimizaciones) */
  jsonDate?: string;
  /** Local refresh time override */
  localTime?: string;
  className?: string;
}

/**
 * Tiny timestamp badge for widget cards.
 * Priority: jsonDate > localTime > path fetch
 */
export default function LastUpdatedBadge({
  path,
  jsonDate,
  localTime,
  className = "",
}: LastUpdatedBadgeProps) {
  const { display } = useLastUpdated(path);

  const text = (() => {
    if (jsonDate) {
      const d = new Date(jsonDate);
      if (isNaN(d.getTime())) return jsonDate;
      const now = Date.now();
      const diffMin = Math.floor((now - d.getTime()) / 60000);
      if (diffMin < 1) return "Actualizado: ahora";
      if (diffMin < 60) return `Hace ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `Hace ${diffHours}h`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `Hace ${diffDays}d`;
      return d.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (localTime) return `Actualizado: ${localTime}`;
    return display;
  })();

  return (
    <div
      className={`mt-2 text-[9px] font-mono-label text-right opacity-60 ${className}`}
      style={{ color: "var(--text-muted)" }}
      title={text}
    >
      {text}
    </div>
  );
}