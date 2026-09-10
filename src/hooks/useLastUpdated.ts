"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface LastUpdatedResult {
  /** Label passed in (e.g. "Último reporte") */
  label: string;
  /** Current timestamp ISO string */
  timestamp: string;
  /** Relative time string like "hace 3 min" */
  timeAgo: string;
  /** Formatted string like "Actualizado: 10:45 AM" or "Hace 3 min" */
  display: string;
  /** ISO timestamp of the last update */
  iso: string;
  /** Whether currently fetching */
  loading: boolean;
  /** Manually refresh the timestamp */
  refresh: () => void;
}

/**
 * Hook that tracks when data was last refreshed.
 * Pass a path to fetch the Last-Modified header, or a Date to display relative/local time.
 * If no path is provided, it tracks the local refresh time.
 *
 * @param label - Optional label (default "Actualizado")
 * @param path  - Optional URL path to fetch Last-Modified from
 */
export function useLastUpdated(labelOrPath?: string, pathOrUndefined?: string): LastUpdatedResult {
  // Support both signatures: useLastUpdated(path) and useLastUpdated(label, path)
  const label = pathOrUndefined !== undefined ? labelOrPath ?? "Actualizado" : "Actualizado";
  const path = pathOrUndefined !== undefined ? pathOrUndefined : labelOrPath;
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(!!path);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatDisplay = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Actualizado: ahora";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const fetchLastModified = useCallback(async () => {
    if (!path) {
      const now = new Date();
      setLastDate(now);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(path, { method: "HEAD" });
      const lastMod = resp.headers.get("Last-Modified");
      if (lastMod) {
        setLastDate(new Date(lastMod));
      } else {
        // Fallback to now if no Last-Modified header
        setLastDate(new Date());
      }
    } catch {
      setLastDate(new Date());
    } finally {
      setLoading(false);
    }
  }, [path]);

  const refresh = useCallback(() => {
    fetchLastModified();
  }, [fetchLastModified]);

  useEffect(() => {
    fetchLastModified();
  }, [fetchLastModified]);

  // Update the display string every 30 seconds for relative times
  useEffect(() => {
    if (!lastDate) return;
    timerRef.current = setInterval(() => {
      // Force re-render by triggering a state update
      setLastDate((d) => (d ? new Date(d.getTime()) : null));
    }, 30_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lastDate]);

  return {
    label,
    timestamp: lastDate?.toISOString() ?? new Date().toISOString(),
    timeAgo: lastDate ? formatDisplay(lastDate) : "...",
    display: lastDate ? formatDisplay(lastDate) : "Actualizado: ...",
    iso: lastDate?.toISOString() ?? "",
    loading,
    refresh,
  };
}