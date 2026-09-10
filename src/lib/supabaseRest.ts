type SupabaseRow = Record<string, unknown>;

const REQUEST_TIMEOUT_MS = 8_000;

export class SupabaseConfigError extends Error {
  constructor() {
    super("Supabase no configurado");
    this.name = "SupabaseConfigError";
  }
}

export class SupabaseRequestError extends Error {
  status: number;

  constructor(status: number) {
    super(`Supabase respondió ${status}`);
    this.name = "SupabaseRequestError";
    this.status = status;
  }
}

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_KEY?.trim();
  if (!url || !key) throw new SupabaseConfigError();
  return { url, key };
}

export async function fetchSupabaseRows<T extends SupabaseRow>(
  table: string,
  query: string
): Promise<T[]> {
  const { url, key } = getConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new SupabaseRequestError(response.status);
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) throw new SupabaseRequestError(502);
    return payload as T[];
  } finally {
    clearTimeout(timeout);
  }
}
