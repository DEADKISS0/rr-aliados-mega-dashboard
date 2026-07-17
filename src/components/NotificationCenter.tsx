"use client";
import { useState, useEffect, useCallback } from "react";
import { STATS } from "@/data/skillsCatalog";
import { fetchBusinessContext, formatCop } from "@/data/businessContext";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>("");

  const fetchNotifications = useCallback(async () => {
    try {
      const ctx = await fetchBusinessContext();
      const [predRes, stratRes, autoRes] = await Promise.all([
        fetch("/reports/predicciones_index.json").then((r) => r.json()).catch(() => ({ reports: [] })),
        fetch("/reports/estrategicos_index.json").then((r) => r.json()).catch(() => ({ reports: [] })),
        fetch("/api/automation").then((r) => r.json()).catch(() => null),
      ]);

      const newNotifications: Notification[] = [];

      if (ctx.wuunderDaysLeft <= 14) {
        newNotifications.push({
          id: "wuunder-deadline",
          message: `Wuunder: ${ctx.wuunderDaysLeft} días para deadline de firma`,
          type: "warning",
          timestamp: new Date(),
          read: false,
        });
      }

      if (ctx.runwayDays < 90) {
        newNotifications.push({
          id: "runway-low",
          message: `Runway bajo: ~${ctx.runwayDays} días de caja restantes`,
          type: "error",
          timestamp: new Date(),
          read: false,
        });
      }

      if (ctx.runwayMonths < 3) {
        newNotifications.push({
          id: "capital-months",
          message: `Capital crítico: ~${ctx.runwayMonths.toFixed(1)} meses de burn (${formatCop(ctx.capitalCop)})`,
          type: "error",
          timestamp: new Date(),
          read: false,
        });
      } else if (ctx.runwayMonths < 6) {
        newNotifications.push({
          id: "capital-months-warn",
          message: `Capital en vigilancia: ~${Math.floor(ctx.runwayMonths)} meses de runway`,
          type: "warning",
          timestamp: new Date(),
          read: false,
        });
      }

      if (STATS.installed !== 36) {
        newNotifications.push({
          id: "skills-sync",
          message: `Skills desincronizadas: ${STATS.installed} instaladas (esperado: 36)`,
          type: "warning",
          timestamp: new Date(),
          read: false,
        });
      }

      if (autoRes?.jobs) {
        const bad = (autoRes.jobs as Array<{ id: string; name: string; status: string }>).filter(
          (j) => j.status === "error" || j.status === "warning"
        );
        for (const j of bad.slice(0, 3)) {
          newNotifications.push({
            id: `auto-${j.id}`,
            message: `Automatización ${j.status}: ${j.name}`,
            type: j.status === "error" ? "error" : "warning",
            timestamp: new Date(),
            read: false,
          });
        }
      }

      if (predRes.reports?.length > 0) {
        const latest = predRes.reports[0];
        newNotifications.push({
          id: `pred-${latest.date}`,
          message: `Reporte predicciones disponible: ${latest.label || latest.date}`,
          type: "success",
          timestamp: new Date(),
          read: false,
        });
      }

      if (stratRes.reports?.length > 0) {
        const latest = stratRes.reports[0];
        newNotifications.push({
          id: `strat-${latest.date}`,
          message: `Reporte estratégico: ${latest.label || latest.date}`,
          type: "success",
          timestamp: new Date(),
          read: false,
        });
      }

      setNotifications(newNotifications);
      setLastCheck(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const typeColors: Record<string, string> = {
    info: "var(--ember)",
    success: "var(--success)",
    warning: "var(--warning)",
    error: "var(--danger)",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm px-2 py-1 rounded transition-colors hover:bg-white/10 relative"
        style={{ color: "var(--ash)", background: "var(--void-30)", border: "1px solid var(--border)" }}
        title="Notificaciones"
        aria-label="Centro de notificaciones"
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
            style={{ background: "var(--ember)", color: "var(--parchment)" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-2xl z-50 overflow-hidden"
          style={{ background: "var(--pitch-95)", border: "1px solid var(--ember-30)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--ember-20)" }}>
            <span className="font-display text-sm tracking-wide" style={{ color: "var(--parchment)" }}>
              Alertas
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="font-mono-label px-2 py-0.5 rounded"
                style={{ color: "var(--ember-light)", background: "var(--ember-10)" }}
              >
                Marcar leídas
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center font-mono-label" style={{ color: "var(--ash)" }}>
                Sin alertas
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className="px-4 py-3 border-b cursor-pointer transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--ember-10)", opacity: n.read ? 0.5 : 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColors[n.type] }} />
                    <span className="text-xs" style={{ color: "var(--parchment)" }}>
                      {n.message}
                    </span>
                  </div>
                  <div className="font-mono-label mt-1 ml-4" style={{ color: "var(--ash)" }}>
                    {n.timestamp.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            )}
          </div>

          {lastCheck && (
            <div
              className="px-4 py-2 font-mono-label text-right border-t"
              style={{ borderColor: "var(--ember-10)", color: "var(--ash)" }}
            >
              Verificado: {lastCheck}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
