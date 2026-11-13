import crypto from "crypto";

export function hmacSha256Hex(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/** Constant-time string comparison (avoids timing attacks on signatures). */
export function safeEqual(a: string | null | undefined, b: string | null | undefined) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Short token tied to an order id, so the success page URL can't be guessed for other orders. */
export function orderViewToken(orderId: string) {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "dev-only-secret";
  return hmacSha256Hex(secret, `order-view:${orderId}`).slice(0, 16);
}
