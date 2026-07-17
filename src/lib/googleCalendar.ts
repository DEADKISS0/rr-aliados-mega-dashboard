import { getBusinessContext } from "@/data/businessContext";

export type CalendarEventItem = {
  id: string;
  time?: string;
  day?: string;
  title: string;
  type: string;
  color: string;
  start?: string;
  end?: string;
  allDay?: boolean;
};

export type CalendarPayload = {
  configured: boolean;
  live: boolean;
  demo: boolean;
  calendarId: string;
  account?: string;
  message?: string;
  error?: string;
  cta?: { label?: string; docs?: string };
  fetchedAt?: string;
  business?: {
    wuunderDeadline: string;
    wuunderDaysLeft: number;
    runwayDays: number;
  };
  today: CalendarEventItem[];
  tomorrow: CalendarEventItem[];
  thisWeek: CalendarEventItem[];
  /** Flat list for month grid (#calendar-widget) */
  upcoming: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
    time?: string;
    allDay?: boolean;
  }>;
};

const DEFAULT_CALENDAR_ID = "rraliadosteam@gmail.com";

const TYPE_COLORS: Record<string, string> = {
  report: "var(--ember)",
  deploy: "var(--success)",
  deadline: "var(--danger)",
  meeting: "var(--warning)",
  event: "var(--accent)",
};

function weekdayEs(d: Date): string {
  return d.toLocaleDateString("es-CO", { weekday: "long" });
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatTime(iso: string | undefined, allDay: boolean): string | undefined {
  if (allDay || !iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function inferType(summary: string): string {
  const s = summary.toLowerCase();
  if (s.includes("mirofish") || s.includes("reporte")) return "report";
  if (s.includes("deploy") || s.includes("sync")) return "deploy";
  if (s.includes("deadline") || s.includes("wuunder") || s.includes("firma")) return "deadline";
  if (s.includes("reunión") || s.includes("reunion") || s.includes("meeting") || s.includes("call"))
    return "meeting";
  return "event";
}

/** DEMO operativo (MiroFish + Wuunder) — solo sin credenciales o si live falla. */
export function buildDemoCalendar(opts?: { configured?: boolean; error?: string }): CalendarPayload {
  const ctx = getBusinessContext();
  const now = new Date();
  const deadline = new Date(ctx.wuunderDeadline);
  const todayYmd = ymd(now);
  const tomorrowYmd = ymd(addDays(now, 1));

  const today: CalendarEventItem[] = [
    {
      id: "mf-am",
      time: "05:00",
      title: "MiroFish — Predicciones + Estratégico",
      type: "report",
      color: TYPE_COLORS.report,
      start: `${todayYmd}T05:00:00`,
    },
    {
      id: "mf-pm",
      time: "17:00",
      title: "MiroFish — regeneración PM",
      type: "report",
      color: TYPE_COLORS.report,
      start: `${todayYmd}T17:00:00`,
    },
  ];

  if (ctx.wuunderDaysLeft <= 14) {
    today.push({
      id: "wuunder-focus",
      time: "10:00",
      title: `Wuunder — seguimiento firma (${ctx.wuunderDaysLeft}d)`,
      type: "deadline",
      color: TYPE_COLORS.deadline,
      start: `${todayYmd}T10:00:00`,
    });
  }

  const tomorrow: CalendarEventItem[] = [
    {
      id: "pipeline",
      time: "09:30",
      title: "Pipeline interno: Real Seguros / Fisio",
      type: "meeting",
      color: TYPE_COLORS.meeting,
      start: `${tomorrowYmd}T09:30:00`,
    },
    {
      id: "sync",
      time: "18:15",
      title: "sync_reports.ps1 + health /api/automation",
      type: "deploy",
      color: TYPE_COLORS.deploy,
      start: `${tomorrowYmd}T18:15:00`,
    },
  ];

  const thisWeek: CalendarEventItem[] = [
    {
      id: "wuunder-dl",
      day: weekdayEs(deadline),
      title: `Deadline Wuunder (${ctx.wuunderDeadline})`,
      type: "deadline",
      color: TYPE_COLORS.deadline,
      start: `${ctx.wuunderDeadline}T00:00:00`,
      allDay: true,
    },
    {
      id: "mirofish-loop",
      day: weekdayEs(now),
      title: "Loop MiroFish confiable (generate → sync → deploy)",
      type: "report",
      color: TYPE_COLORS.report,
      start: `${todayYmd}T05:00:00`,
    },
  ];

  const upcoming = [
    ...today.map((e) => ({
      id: e.id,
      title: e.title,
      date: todayYmd,
      type: e.type,
      time: e.time,
    })),
    ...tomorrow.map((e) => ({
      id: e.id,
      title: e.title,
      date: tomorrowYmd,
      type: e.type,
      time: e.time,
    })),
    {
      id: "wuunder-dl",
      title: `Deadline Wuunder (${ctx.wuunderDeadline})`,
      date: ctx.wuunderDeadline,
      type: "deadline",
      allDay: true,
    },
  ];

  const configured = Boolean(opts?.configured);
  return {
    configured,
    live: false,
    demo: true,
    calendarId: DEFAULT_CALENDAR_ID,
    account: DEFAULT_CALENDAR_ID,
    message: configured
      ? "Credenciales Calendar presentes pero la API falló. Mostrando DEMO operativo (MiroFish/Wuunder)."
      : "Google Calendar DEMO. Configura GOOGLE_CALENDAR_CLIENT_ID / SECRET / REFRESH_TOKEN en Vercel para datos live de rraliadosteam@gmail.com.",
    error: opts?.error,
    cta: {
      label: configured ? "Revisar OAuth / scopes" : "Configurar OAuth Calendar en Vercel",
      docs: "README → GOOGLE_CALENDAR_* · cuenta rraliadosteam@gmail.com",
    },
    business: {
      wuunderDeadline: ctx.wuunderDeadline,
      wuunderDaysLeft: ctx.wuunderDaysLeft,
      runwayDays: ctx.runwayDays,
    },
    today,
    tomorrow,
    thisWeek,
    upcoming,
  };
}

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OAuth Calendar ${resp.status}: ${text.slice(0, 240)}`);
  }

  const data = (await resp.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("OAuth Calendar sin access_token");
  return data.access_token;
}

type GoogleEvent = {
  id?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

async function listEvents(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "50",
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Calendar API ${resp.status}: ${text.slice(0, 240)}`);
  }
  const data = (await resp.json()) as { items?: GoogleEvent[] };
  return data.items ?? [];
}

function eventStartDate(ev: GoogleEvent): Date | null {
  const raw = ev.start?.dateTime || ev.start?.date;
  if (!raw) return null;
  const d = new Date(raw.length === 10 ? `${raw}T12:00:00` : raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toItem(ev: GoogleEvent, mode: "today" | "tomorrow" | "week"): CalendarEventItem | null {
  const start = eventStartDate(ev);
  if (!start) return null;
  const title = (ev.summary || "(sin título)").trim();
  const allDay = Boolean(ev.start?.date && !ev.start?.dateTime);
  const type = inferType(title);
  const color = TYPE_COLORS[type] || TYPE_COLORS.event;
  const iso = ev.start?.dateTime || ev.start?.date;

  const base: CalendarEventItem = {
    id: ev.id || `${title}-${iso}`,
    title,
    type,
    color,
    start: iso,
    end: ev.end?.dateTime || ev.end?.date,
    allDay,
  };

  if (mode === "week") {
    return { ...base, day: weekdayEs(start) };
  }
  return { ...base, time: formatTime(iso, allDay) || (allDay ? "todo el día" : undefined) };
}

export async function fetchLiveCalendar(): Promise<CalendarPayload> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();
  const calendarId =
    process.env.GOOGLE_CALENDAR_ID?.trim() ||
    process.env.GOOGLE_CALENDAR_ACCOUNT?.trim() ||
    DEFAULT_CALENDAR_ID;

  if (!clientId || !clientSecret || !refreshToken) {
    return buildDemoCalendar({ configured: false });
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    const now = new Date();
    const today0 = startOfDay(now);
    const tomorrow0 = addDays(today0, 1);
    const dayAfter = addDays(today0, 2);
    const weekEnd = addDays(today0, 7);

    const events = await listEvents(
      accessToken,
      calendarId,
      today0.toISOString(),
      weekEnd.toISOString()
    );

    const todayYmd = ymd(today0);
    const tomorrowYmd = ymd(tomorrow0);

    const today: CalendarEventItem[] = [];
    const tomorrow: CalendarEventItem[] = [];
    const thisWeek: CalendarEventItem[] = [];
    const upcoming: CalendarPayload["upcoming"] = [];

    for (const ev of events) {
      const start = eventStartDate(ev);
      if (!start) continue;
      const dateStr = ymd(start);
      const allDay = Boolean(ev.start?.date && !ev.start?.dateTime);
      const title = (ev.summary || "(sin título)").trim();
      const type = inferType(title);
      const iso = ev.start?.dateTime || ev.start?.date;

      upcoming.push({
        id: ev.id || `${title}-${iso}`,
        title,
        date: dateStr,
        type,
        time: formatTime(iso, allDay),
        allDay,
      });

      if (dateStr === todayYmd) {
        const item = toItem(ev, "today");
        if (item) today.push(item);
      } else if (dateStr === tomorrowYmd) {
        const item = toItem(ev, "tomorrow");
        if (item) tomorrow.push(item);
      } else if (start >= dayAfter && start < weekEnd) {
        const item = toItem(ev, "week");
        if (item) thisWeek.push(item);
      }
    }

    const ctx = getBusinessContext();
    return {
      configured: true,
      live: true,
      demo: false,
      calendarId,
      account: DEFAULT_CALENDAR_ID,
      fetchedAt: new Date().toISOString(),
      message: `Live · ${calendarId}`,
      business: {
        wuunderDeadline: ctx.wuunderDeadline,
        wuunderDaysLeft: ctx.wuunderDaysLeft,
        runwayDays: ctx.runwayDays,
      },
      today,
      tomorrow,
      thisWeek,
      upcoming,
    };
  } catch (e) {
    return buildDemoCalendar({
      configured: true,
      error: e instanceof Error ? e.message : "Calendar error",
    });
  }
}
