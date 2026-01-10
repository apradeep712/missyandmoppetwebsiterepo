type ShiprocketAuthResponse = { token: string };
  
let cachedToken: { token: string; expiresAt: number } | null = null;
  
// Shiprocket tokens expire; caching avoids logging in every request.  
// We conservatively cache for 8 hours.  
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
  
async function shiprocketLogin(): Promise<string> {  
  const email = process.env.SHIPROCKET_EMAIL!;  
  const password = process.env.SHIPROCKET_PASSWORD!;
  
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {  
    method: "POST",  
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify({ email, password }),  
  });
  
  if (!res.ok) {  
    const text = await res.text();  
    throw new Error(`Shiprocket login failed: ${res.status} ${text}`);  
  }
  
  const data = (await res.json()) as ShiprocketAuthResponse;  
  return data.token;  
}
  
export async function getShiprocketToken(): Promise<string> {  
  const now = Date.now();  
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.token;
  
  const token = await shiprocketLogin();  
  cachedToken = { token, expiresAt: now + TOKEN_TTL_MS };  
  return token;  
}
  
export async function shiprocketFetch<T>(  
  path: string,  
  opts: RequestInit & { json?: any } = {}  
): Promise<T> {  
  const token = await getShiprocketToken();
  
  const res = await fetch(`https://apiv2.shiprocket.in/v1/external/${path}`, {  
    ...opts,  
    headers: {  
      Authorization: `Bearer ${token}`,  
      "Content-Type": "application/json",  
      ...(opts.headers ?? {}),  
    },  
    body: opts.json ? JSON.stringify(opts.json) : opts.body,  
  });
  
  const text = await res.text();  
  let parsed: any = null;  
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