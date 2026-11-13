import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminPin,
  createAdminSessionValue,
  isAdminSession,
} from "@/lib/adminAuth";
import { safeEqual } from "@/lib/crypto";

export const runtime = "nodejs";

/** GET: is the current browser logged in as admin? */
export async function GET() {
  return NextResponse.json({ ok: await isAdminSession() });
}

/** POST { pin }: log in. Sets an httpOnly signed cookie. */
export async function POST(req: Request) {
  const { pin } = (await req.json().catch(() => ({}))) as { pin?: string };
  const expected = adminPin();

  if (!expected || !pin || !safeEqual(String(pin), expected)) {
    // Small delay to slow down guessing.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Invalid PIN" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createAdminSessionValue(), adminCookieOptions);
  return res;
}

/** DELETE: log out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  return res;
}
