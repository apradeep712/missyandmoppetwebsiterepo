# Security Scan — Missy & Moppet E-Commerce

**Scope:** Whole-system read-only security scan (Next.js 16 / React 19 / Supabase / Razorpay /
Resend). **No application code, config, or dependencies were changed by this scan** — this is a
documentation-only report. Findings are grounded in the actual code with `file:line`
references so they can be acted on later.

---

## Accepted by design — NOT a finding

**Shared staff access to the admin portal is intentional.** Many employees use the same
PIN-gated admin board, and all of them can add and remove data. That is a deliberate business
choice and is **kept as-is** — nothing in this report recommends per-employee roles or
restricting which staff member can do what.

Everything below is a *different* issue: the portal is not actually limited to your staff. As
built, the admin data and the destructive actions are reachable by the **anonymous public
internet** — anyone, with no PIN and no login. "All our employees can edit" is fine; "anyone
on earth can delete our catalog and read our customers' data" is the problem this report is
about.

> **Plain-English summary:** The lock on the door is a sticker. The PIN screen only *hides* the
> admin pages in your own browser — it doesn't stop anyone from reaching the data or the
> delete buttons directly. And because database-level protection (RLS) is currently off,
> customer personal information is readable by anyone who visits the site.

---

## Critical

### C1. Anyone on the internet can delete/overwrite your catalog (no PIN, no login)
- **Where:** `ecommerce-site/app/admin/actions.ts:7-10, 13-36`
- **What:** `updateRequestStatus`, `upsertProduct`, `deleteProduct`, and `upsertFlyer` are
  Next.js **server actions** that run with the Supabase **service-role master key** and perform
  **no authentication check** whatsoever.
- **Why it matters:** Server actions compile into ordinary callable POST endpoints. A stranger
  does not need to pass the PIN or log in — they can invoke `deleteProduct(...)`,
  `upsertProduct(...)`, `upsertFlyer(...)`, or `updateRequestStatus(...)` directly and wipe or
  rewrite your products, homepage flyers, and customer-request statuses. The service-role key
  also **bypasses Row Level Security**, so this works regardless of any database policies.
- **This is independent of the PIN and independent of RLS.** It is the single most dangerous
  item in the system.
- **Fix (keeps shared staff access):** Require a single shared admin secret (verified
  server-side) at the top of each server action, e.g. read an `httpOnly` admin-session cookie
  or a server-only secret and reject if absent. Every employee still uses the one shared
  secret — but a random visitor without it cannot call these. (See "Keep shared access but
  block the public" below.)

### C2. Customer personal data (PII) is publicly readable — RLS is OFF
- **Where (browser reads with the public anon key):**
  `ecommerce-site/app/admin/orders/page.tsx:7-9,17-28`,
  `ecommerce-site/app/admin/requests/page.tsx`,
  `ecommerce-site/app/admin/products/page.tsx`,
  `ecommerce-site/app/admin/home/page.tsx`.
- **What:** These admin pages are client components that query Supabase tables directly from
  the browser using `NEXT_PUBLIC_SUPABASE_ANON_KEY` — a key that is, by design, public and
  shipped inside the JavaScript bundle. The owner has confirmed **Row Level Security (RLS) is
  not configured** on these tables.
- **Why it matters:** With RLS off, the anon key grants full read (and likely write) access to
  those tables to **anyone**. From a browser console on the live site, a stranger can run a
  Supabase query and pull every order and request — **customer names, emails, phone numbers,
  and shipping addresses** (`orders.customer_name/customer_email/customer_phone/shipping_*`,
  and the `requests` table's `name/email/phone/payload`). This is a customer-data breach risk
  and a privacy-law exposure.
- **Fix (highest priority):** Enable RLS on every table and deny the `anon` role. See
  "Supabase RLS — action steps" below. After RLS is on, move admin reads to the server using
  the service-role client (or authenticated policies) so the admin pages keep working.

### C3. The admin PIN is cosmetic
- **Where:** `ecommerce-site/app/admin/PinGate.tsx:11,14-22`
- **What:** `const VALID_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN` — the PIN is a `NEXT_PUBLIC_`
  value, so it is embedded in the client bundle and readable by anyone. Authentication is a
  client-side `sessionStorage.setItem('admin_auth','true')`.
- **Why it matters:** Anyone can (a) read the PIN straight out of the bundle, or (b) skip it
  entirely by typing `sessionStorage.setItem('admin_auth','true')` in the browser console and
  reloading. It gates only the *rendering* of admin pages — it protects no data and no API.
  It is also a 4-digit PIN with no rate limiting (brute-forceable instantly).
- **Fix:** Verify the shared secret **server-side** (route handler / middleware / server
  action), not via a `NEXT_PUBLIC_` value in the browser. Keep it a single shared secret if you
  want — just stop trusting the client.

---

## High

### H1. Payment amount is never verified
- **Where:** `ecommerce-site/app/api/checkout/verify-payment/route.ts:14-18` (selects only
  `id, razorpay_order_id, payment_status` — never the amount);
  `ecommerce-site/app/api/orders/verify-payment/route.ts`;
  `ecommerce-site/app/api/webhooks/razorpay/route.ts`.
- **What:** The Razorpay signature is verified correctly (HMAC-SHA256), but the code never
  confirms the **amount actually paid** equals `orders.total_amount_cents`.
- **Why it matters:** A customer could pair a valid payment/signature from one order with a
  different (cheaper) order record, or replay a webhook against a different order, and have it
  marked "paid" at the wrong amount.
- **Severity now vs. go-live:** **Low right now** (the app runs in payment **mock mode** with
  placeholder Razorpay keys). **Becomes High the moment you switch Razorpay to live keys** — fix
  before go-live.
- **Fix:** After signature verification, fetch the payment from Razorpay (or compare captured
  amount) and reject if `amount !== order.total_amount_cents`.

### H2. Image-upload endpoint is open by default
- **Where:** `ecommerce-site/app/api/admin/upload-product-images/route.ts:18-22`
- **What:** The auth check runs only *if* `ADMIN_UPLOAD_SECRET` is set; it isn't configured, so
  the endpoint is currently unauthenticated.
- **Why it matters:** Anyone can upload arbitrary files into your product-images storage.
- **Fix:** Make the shared-secret check mandatory (reject when the secret is missing/!match).

### H3. The new order-confirmation route is unauthenticated
- **Where:** `ecommerce-site/app/api/admin/send-order-confirmation/route.ts`
- **What:** The "Send confirmation" route added in earlier work follows the existing
  (unprotected) admin-route convention — it has no auth check.
- **Why it matters:** Anyone can POST an `order_id` and trigger confirmation emails to your
  customers (spam / abuse, and it reveals order existence).
- **Fix:** Apply the same shared-secret server-side check used for the other admin actions
  once that pattern exists (C1/H2).

### H4. No rate limiting anywhere
- **Where:** all public routes under `ecommerce-site/app/api/*`, plus the PIN entry.
- **What:** No throttling on order creation, payment verification, the public request forms, or
  PIN attempts.
- **Why it matters:** Enables spam orders, email-cost abuse, DB bloat, and instant brute force
  of the 4-digit PIN.
- **Fix:** Add IP/user rate limiting (e.g. Upstash/Vercel KV sliding window) on the public
  mutating endpoints and PIN entry.

---

## Medium

### M1. HTML injection in the order-notification email
- **Where:** `ecommerce-site/app/api/checkout/create-order/route.ts:170-199`
- **What:** Customer-supplied fields (`customer_name`, `customer_phone`, `customer_email`,
  address, and DB product names) are interpolated into the email HTML without escaping.
- **Why it matters:** A customer can submit a name like `<img src=x onerror=...>`; the
  notification email to staff then contains injected markup. Not classic web XSS (it's email),
  but it's HTML injection and looks alarming/abusable.
- **Fix:** HTML-escape all interpolated values before building the email body.

### M2. Raw error messages returned to clients (info leak)
- **Where:** `checkout/verify-payment/route.ts:20,66`; `checkout/create-order/route.ts:68,103,
  118,216`; `orders/verify-payment/route.ts` (`e?.message`); `shiprocket/create-shipment`;
  `auth/otpless/route.ts`.
- **What:** Routes return raw `error.message` / `err.message` (often Supabase/Postgres errors)
  to the caller.
- **Why it matters:** Leaks backend/database internals (table names, error patterns) that help
  an attacker.
- **Fix:** Log full detail server-side; return a generic message + status to the client.

### M3. No security headers
- **Where:** `ecommerce-site/next.config.ts` (empty config).
- **Fix:** Add `headers()` with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Strict-Transport-Security`, and a Content-Security-Policy.

### M4. No stock / inventory check at order creation
- **Where:** `ecommerce-site/app/api/checkout/create-order/route.ts:43-45,62-80`
- **What:** Quantity is capped at 50/item but stock is never checked; totals are correctly
  recomputed server-side from DB prices (good), but concurrent orders can oversell.
- **Fix:** Validate against stock and consider a reservation/decrement step.

---

## Low

- **L1. Deprecated dependency:** `@supabase/auth-helpers-nextjs@^0.15.0` is deprecated — plan a
  migration to `@supabase/ssr`. Other key deps are current (`next ^16.0.7`, `react 19.2.0`,
  `@supabase/supabase-js ^2.93.3`, `razorpay ^2.9.6`, `resend ^6.7.0`). `package-lock.json` is
  present. Run `npm audit` before go-live and patch transitive advisories.
- **L2. Internal fetch fallback:** `checkout/verify-payment` and `webhooks/razorpay` fall back
  to `http://localhost:3000` if `NEXT_PUBLIC_SITE_URL` is unset — fail fast or use a relative
  URL instead.
- **L3. Hardcoded admin email whitelist** in `ecommerce-site/lib/adminCheck.ts` (plus a stale
  duplicate at the repo-root `lib/adminCheck.ts`) — move to an env var and delete the duplicate.
- **L4. (Good) Secrets hygiene:** `.env.local` is correctly gitignored; no secrets are
  committed to the repo. Razorpay/Shiprocket keys are placeholders (fine for mock mode; set and
  rotate real values for production).

---

## Keep shared access, but block the public

You can keep exactly one shared portal secret that **all employees use** — no per-person
accounts, no roles — while still locking out the anonymous public. The trick is to stop
trusting the browser and check the shared secret on the **server**:

1. **Move the gate server-side.** Replace the client `NEXT_PUBLIC_ADMIN_PIN` check with a small
   login route that compares a submitted PIN against a **server-only** secret
   (`ADMIN_PIN`, not `NEXT_PUBLIC_`) and, on success, sets an `httpOnly` admin-session cookie.
2. **Enforce on every admin action.** At the top of each server action in
   `app/admin/actions.ts` and each admin API route (`upload-product-images`,
   `send-order-confirmation`, and any future ones), reject the request if that cookie/secret is
   missing or wrong. One shared secret → all staff still get full add/remove; strangers get 401.
3. **Turn on RLS** (below) so the database itself refuses anonymous access even if a key leaks.

This preserves the "everyone on the team can edit" model and only removes the *public* access
that is almost certainly unintended.

---

## Supabase RLS — action steps (RLS is currently OFF)

This is the highest-priority remediation for customer-data exposure. In the **Supabase
dashboard → Authentication → Policies** (or the SQL editor):

1. Enable RLS on each table:
   ```sql
   alter table orders            enable row level security;
   alter table order_items       enable row level security;
   alter table requests          enable row level security;
   alter table products          enable row level security;
   alter table product_images    enable row level security;
   alter table homepage_flyers   enable row level security;
   ```
2. Deny the public `anon` role on the PII/sensitive tables (server code uses the service-role
   key, which bypasses RLS, so the app keeps working):
   ```sql
   create policy "no anon access" on orders          for all to anon using (false) with check (false);
   create policy "no anon access" on order_items     for all to anon using (false) with check (false);
   create policy "no anon access" on requests        for all to anon using (false) with check (false);
   ```
3. For tables the public storefront must *read* (e.g. active products), allow read-only and
   keep writes server-side:
   ```sql
   create policy "public can read active products" on products
     for select to anon using (is_active = true);
   -- no anon insert/update/delete policy → writes denied for anon
   ```
4. **Order of priority:** `orders` + `order_items` + `requests` first (they hold PII), then
   `products` / `product_images` / `homepage_flyers`.
5. After enabling RLS, move the admin pages' reads to the server (service-role client) so they
   keep working without exposing the anon key path.

> Note: enabling RLS without the right policies will make the public storefront stop reading
> products — add the read policy in step 3 at the same time and test the storefront.

---

## Suggested priority order (for when you choose to act)

1. **C2 / RLS** — enable RLS + deny anon (stops the active PII exposure). *(dashboard, no deploy)*
2. **C1** — add the shared-secret server check to `app/admin/actions.ts` (stops public catalog
   deletion).
3. **C3 / H2 / H3** — move the PIN server-side and apply the same check to the admin API routes.
4. **H1** — add payment-amount verification **before** switching Razorpay to live.
5. **H4** — rate limiting on public endpoints + PIN.
6. **M1–M4** — escape email HTML, generic error responses, security headers, stock checks.
7. **L1–L3** — dependency migration, fetch fallback, env-var cleanup.

---

*Generated by a read-only scan. No code was modified. Every reference above points to existing
code; re-verify line numbers before editing, as the codebase may have changed.*
