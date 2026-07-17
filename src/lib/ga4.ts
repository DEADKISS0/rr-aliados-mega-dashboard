import crypto from "crypto";

export interface Ga4ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

export interface Ga4Bundle {
  configured: true;
  live: true;
  demo: false;
  propertyId: string;
  fetchedAt: string;
  realTime: { activeUsers: number; pageViews: number; sessions: number };
  today: {
    users: number;
    pageViews: number;
    sessions: number;
    bounceRate: string;
    avgSessionDuration: number;
  };
  topPages: { page: string; views: number; percentage: string }[];
  trafficSources: { source: string; percentage: string }[];
}

function parseServiceAccount(raw: string): Ga4ServiceAccount {
  const parsed = JSON.parse(raw) as Ga4ServiceAccount;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY inválida (falta client_email/private_key)");
  }
  // Vercel env often stores newlines escaped
  parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  return parsed;
}

function b64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString("base64url");
}

async function getAccessToken(sa: Ga4ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: sa.token_uri || "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(sa.private_key, "base64url");
  const assertion = `${unsigned}.${signature}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OAuth GA4 ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = (await resp.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("OAuth GA4 sin access_token");
  return data.access_token;
}

async function runReport(
  propertyId: string,
  token: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const id = propertyId.replace(/^properties\//, "");
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${id}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`runReport ${resp.status}: ${text.slice(0, 240)}`);
  }
  return (await resp.json()) as Record<string, unknown>;
}

async function runRealtime(
  propertyId: string,
  token: string
): Promise<Record<string, unknown>> {
  const id = propertyId.replace(/^properties\//, "");
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${id}:runRealtimeReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metrics: [{ name: "activeUsers" }],
      }),
    }
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`runRealtime ${resp.status}: ${text.slice(0, 240)}`);
  }
  return (await resp.json()) as Record<string, unknown>;
}

function metricValue(row: unknown, index = 0): number {
  const r = row as { metricValues?: Array<{ value?: string }> } | undefined;
  return Number(r?.metricValues?.[index]?.value ?? 0);
}

function dimValue(row: unknown, index = 0): string {
  const r = row as { dimensionValues?: Array<{ value?: string }> } | undefined;
  return String(r?.dimensionValues?.[index]?.value ?? "");
}

export async function fetchGa4Bundle(propertyId: string, serviceAccountKey: string): Promise<Ga4Bundle> {
  const sa = parseServiceAccount(serviceAccountKey);
  const token = await getAccessToken(sa);

  const [realtime, todayReport, pagesReport, sourcesReport] = await Promise.all([
    runRealtime(propertyId, token).catch(() => null),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: "today", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    }),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 5,
    }),
    runReport(propertyId, token, {
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 4,
    }),
  ]);

  const todayRows = (todayReport.rows as unknown[]) || [];
  const today = todayRows[0];
  const users = metricValue(today, 0);
  const pageViews = metricValue(today, 1);
  const sessions = metricValue(today, 2);
  const bounceRaw = metricValue(today, 3);
  const bouncePct = bounceRaw <= 1 ? bounceRaw * 100 : bounceRaw;
  const avgDur = metricValue(today, 4);

  const pageRows = (pagesReport.rows as unknown[]) || [];
  const pageTotal = pageRows.reduce((acc, row) => acc + metricValue(row, 0), 0) || 1;
  const topPages = pageRows.map((row) => {
    const views = metricValue(row, 0);
    return {
      page: dimValue(row, 0) || "/",
      views,
      percentage: `${Math.round((views / pageTotal) * 100)}%`,
    };
  });

  const sourceRows = (sourcesReport.rows as unknown[]) || [];
  const sourceTotal = sourceRows.reduce((acc, row) => acc + metricValue(row, 0), 0) || 1;
  const trafficSources = sourceRows.map((row) => {
    const n = metricValue(row, 0);
    return {
      source: dimValue(row, 0) || "Other",
      percentage: `${Math.round((n / sourceTotal) * 100)}%`,
    };
  });

  const activeUsers = realtime
    ? metricValue(((realtime.rows as unknown[]) || [])[0], 0)
    : users;

  return {
    configured: true,
    live: true,
    demo: false,
    propertyId: propertyId.replace(/^properties\//, ""),
    fetchedAt: new Date().toISOString(),
    realTime: {
      activeUsers,
      pageViews,
      sessions,
    },
    today: {
      users,
      pageViews,
      sessions,
      bounceRate: `${bouncePct.toFixed(1)}%`,
      avgSessionDuration: Math.round(avgDur),
    },
    topPages,
    trafficSources,
  };
}

/** Deterministic DEMO — never random (avoids looking “live”). */
export function buildGa4Demo() {
  return {
    configured: false,
    live: false,
    demo: true,
    message:
      "GA4 DEMO. Configura GOOGLE_ANALYTICS_PROPERTY_ID + GOOGLE_SERVICE_ACCOUNT_KEY en Vercel.",
    cta: {
      label: "Conectar GA4",
      docs: "Service Account con rol Viewer en la propiedad GA4",
    },
    realTime: { activeUsers: 0, pageViews: 0, sessions: 0 },
    today: {
      users: 0,
      pageViews: 0,
      sessions: 0,
      bounceRate: "—",
      avgSessionDuration: 0,
    },
    topPages: [
      { page: "/ (sin datos)", views: 0, percentage: "—" },
    ],
    trafficSources: [
      { source: "Pending", percentage: "—" },
    ],
  };
}
