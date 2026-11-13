import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hmacSha256Hex, safeEqual } from "@/lib/crypto";

export const ADMIN_COOKIE = "mm_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

/** Server-only PIN. Falls back to the old public PIN so existing setups keep working. */
export function adminPin() {
  return process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || "";
}

export function createAdminSessionValue() {
  const exp = Date.now() + SESSION_TTL_MS;
  return `${exp}.${hmacSha256Hex(sessionSecret(), `admin:${exp}`)}`;
}

export function isValidAdminSession(value: string | undefined) {
  if (!value || !sessionSecret()) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!exp || exp < Date.now()) return false;
  return safeEqual(sig, hmacSha256Hex(sessionSecret(), `admin:${exp}`));
}

export async function isAdminSession() {
  const store = await cookies();
  return isValidAdminSession(store.get(ADMIN_COOKIE)?.value);
}

/** Returns a 401 response if the caller is not a logged-in admin, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminSession()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
