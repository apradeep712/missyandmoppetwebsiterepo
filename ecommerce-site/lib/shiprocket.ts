type ShiprocketAuthResponse = { token?: string; message?: string };

let cachedToken: { token: string; expiresAt: number } | null = null;

// Shiprocket tokens are valid for 10 days; refresh well before that.
const TOKEN_TTL_MS = 8 * 24 * 60 * 60 * 1000;

const BASE = "https://apiv2.shiprocket.in/v1/external";

/** Shiprocket is "on" only when its login and pickup location are configured. */
export function isShiprocketConfigured() {
  return Boolean(
    process.env.SHIPROCKET_EMAIL &&
      process.env.SHIPROCKET_PASSWORD &&
      process.env.SHIPROCKET_PICKUP_LOCATION
  );
}

async function shiprocketLogin(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) throw new Error("Shiprocket is not configured (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)");

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await res.json().catch(() => ({}))) as ShiprocketAuthResponse;
  if (!res.ok || !data.token) {
    throw new Error(`Shiprocket login failed: ${res.status} ${data.message ?? ""}`.trim());
  }
  return data.token;
}

export async function getShiprocketToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > now) return cachedToken.token;

  const token = await shiprocketLogin();
  cachedToken = { token, expiresAt: now + TOKEN_TTL_MS };
  return token;
}

export async function shiprocketFetch<T>(
  path: string,
  opts: RequestInit & { json?: unknown } = {},
  retried = false
): Promise<T> {
  const token = await getShiprocketToken(retried);

  const res = await fetch(`${BASE}/${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  });

  // Token expired/revoked: log in again once and retry.
  if (res.status === 401 && !retried) {
    cachedToken = null;
    return shiprocketFetch<T>(path, opts, true);
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!res.ok) {
    throw new Error(`Shiprocket API error ${res.status}: ${JSON.stringify(parsed)}`);
  }

  return parsed as T;
}
