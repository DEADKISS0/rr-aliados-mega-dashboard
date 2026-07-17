"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  type: string;
  time?: string;
  allDay?: boolean;
};

type CalendarApi = {
  live?: boolean;
  demo?: boolean;
  account?: string;
  message?: string;
  upcoming?: UpcomingEvent[];
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const typeColors: Record<string, string> = {
  report: "var(--accent)",
  deploy: "var(--success)",
  deadline: "var(--danger)",
  meeting: "var(--warning)",
  event: "var(--ember)",
};

export default function CalendarWidget() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [api, setApi] = useState<CalendarApi | null>(null);

  const load = useCallback(async () => {
    try {
      const resp = await fetch("/api/calendar");
      setApi(await resp.json());
    } catch {
      setApi(null);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [load]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, UpcomingEvent[]>();
    for (const e of api?.upcoming ?? []) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [api]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];
  const isLive = Boolean(api?.live && !api?.demo);

  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📅</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Calendario
        </h3>
        <span
          className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono-label"
          style={{
            background: isLive ? "color-mix(in srgb, var(--success) 18%, transparent)" : "var(--bg-secondary)",
            color: isLive ? "var(--success)" : "var(--warning)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {isLive ? "Live" : "DEMO"}
        </span>
      </div>

      {!isLive && (
        <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
          DEMO operativo — no es Google live
          {api?.account ? ` (${api.account})` : ""}. Configura GOOGLE_CALENDAR_* en Vercel.
        </p>
      )}

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="text-xs px-2 py-1 rounded"
          style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}
        >
          ◀
        </button>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="text-xs px-2 py-1 rounded"
          style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold py-1" style={{ color: "var(--text-muted)" }}>
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const events = eventsByDate.get(dateStr) ?? [];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(dateStr)}
              className="relative text-center text-xs py-1 rounded transition-colors"
              style={{
                background: isSelected ? "var(--accent)" : isToday ? "var(--bg-card-hover)" : "transparent",
                color: isSelected ? "white" : "var(--text-primary)",
                fontWeight: isToday ? "bold" : "normal",
              }}
            >
              {day}
              {events.length > 0 && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {events.slice(0, 2).map((e, j) => (
                    <div
                      key={j}
                      className="w-1 h-1 rounded-full"
                      style={{ background: typeColors[e.type] || "var(--text-muted)" }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="border-t pt-2" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Eventos del {selectedDate}
          </div>
          {selectedEvents.length === 0 ? (
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Sin eventos
            </p>
          ) : (
            <div className="space-y-1">
              {selectedEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-2 text-[11px]">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: typeColors[e.type] || "var(--text-muted)" }}
                  />
                  {e.time && (
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {e.time}
                    </span>
                  )}
                  <span style={{ color: "var(--text-primary)" }}>{e.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
