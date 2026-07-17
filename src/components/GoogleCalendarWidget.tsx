"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetCard from "@/components/ui/WidgetCard";

interface CalendarEvent {
  id: string;
  time?: string;
  day?: string;
  title: string;
  type: string;
  color: string;
}

interface CalendarData {
  configured?: boolean;
  live?: boolean;
  demo?: boolean;
  account?: string;
  calendarId?: string;
  message?: string;
  error?: string;
  cta?: { label?: string; docs?: string };
  today: CalendarEvent[];
  tomorrow: CalendarEvent[];
  thisWeek: CalendarEvent[];
}

export default function GoogleCalendarWidget() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch("/api/calendar");
      const result = await resp.json();
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      console.error("Error fetching calendar:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey, fetchData]);

  if (loading) {
    return (
      <WidgetCard title="Google Calendar" icon="📅">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Cargando calendario...
        </p>
      </WidgetCard>
    );
  }

  if (!data) return null;

  const isLive = Boolean(data.live && !data.demo);

  return (
    <WidgetCard
      title="Google Calendar"
      icon="📅"
      badge={isLive ? "Live" : "DEMO"}
      badgeVariant={isLive ? "active" : "support"}
      action={
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="btn-ghost !py-1 !px-2"
          title="Actualizar"
        >
          ↻
        </button>
      }
    >
      {(data.demo || !data.live) && (
        <div className="banner-mock mb-3 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span>
              ⚠️ DEMO — no es live de {data.account || "rraliadosteam@gmail.com"}
            </span>
            <span className="skill-badge demo">Mock</span>
          </div>
          {data.message && (
            <span className="text-[10px]" style={{ color: "var(--ash)" }}>
              {data.message}
            </span>
          )}
          {data.error && (
            <span className="text-[10px]" style={{ color: "var(--danger)" }}>
              {data.error}
            </span>
          )}
          {data.cta?.docs && (
            <span className="font-mono-label text-[9px]" style={{ color: "var(--ash)" }}>
              CTA: {data.cta.label || "OAuth"} · {data.cta.docs}
            </span>
          )}
        </div>
      )}

      {isLive && (
        <p className="text-[10px] mb-2 font-mono-label" style={{ color: "var(--text-muted)" }}>
          {data.calendarId || data.account}
        </p>
      )}

      <div className="mb-3">
        <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          HOY
        </div>
        {data.today.length === 0 ? (
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Sin eventos hoy
          </p>
        ) : (
          <div className="space-y-1">
            {data.today.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
                <span className="text-[10px] w-10 shrink-0" style={{ color: "var(--text-muted)" }}>
                  {e.time}
                </span>
                <span style={{ color: "var(--text-primary)" }}>{e.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          MAÑANA
        </div>
        {data.tomorrow.length === 0 ? (
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Sin eventos mañana
          </p>
        ) : (
          <div className="space-y-1">
            {data.tomorrow.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
                <span className="text-[10px] w-10 shrink-0" style={{ color: "var(--text-muted)" }}>
                  {e.time}
                </span>
                <span style={{ color: "var(--text-primary)" }}>{e.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          ESTA SEMANA
        </div>
        {data.thisWeek.length === 0 ? (
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Sin eventos esta semana
          </p>
        ) : (
          <div className="space-y-1">
            {data.thisWeek.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
                <span className="text-[10px] w-16 shrink-0" style={{ color: "var(--text-muted)" }}>
                  {e.day}
                </span>
                <span style={{ color: "var(--text-primary)" }}>{e.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {lastUpdate && (
        <div className="mt-2 text-[10px] text-right" style={{ color: "var(--text-muted)" }}>
          Última actualización: {lastUpdate}
        </div>
      )}
    </WidgetCard>
  );
}
