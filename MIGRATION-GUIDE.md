# Missy & Moppet — Account & Data Migration / Handover Guide

This guide hands the site over from the current owner's **personal accounts** to the
**client's own accounts**. Today, every external service and the database live in the current
owner's personal logins; this walks the client through creating their own accounts and
re-pointing the site at them.

> **Golden rules**
> - Never paste a secret into chat, email, or git. Move keys directly into the hosting
>   dashboard (Vercel) or a local `.env.local` file only.
> - `.env.local` is gitignored — keys are **not** in the repository. They live only on the
>   current owner's machine + the hosting provider. This is why they must be re-created.
> - Do everything in a **staging** setup first, verify, then flip production.
> - After handover, the current owner should **rotate/revoke** all old keys so their personal
>   accounts no longer have access.

---

## 0. What needs to move (inventory)

| Service | Purpose | Currently | Must the client create their own? |
|---|---|---|---|
| **Supabase** | Database, Auth, file storage | Owner's personal project | **Yes** (or transfer the project) |
| **Resend** | Transactional email (order alerts + confirmations) | Owner's personal, sandbox sender | **Yes** + verify a domain |
| **Vercel** (or host) | Hosting the Next.js app | Owner's personal | **Yes** (or transfer) |
| **Domain registrar** | The website domain + email domain | TBD | **Yes** |
| **Razorpay** | Payments | Not live (mock/placeholder) | Yes, when they want real payments |
| **Shiprocket** | Shipping labels/AWB | Not live (mock/empty) | Optional, when they want auto-shipping |
| **OTPless** | Phone/WhatsApp login | Not configured (placeholder) | Optional, only if they want OTP login |

The full list of environment variables the app reads (from `ecommerce-site/lib/validateEnv.ts`
and the codebase):

**Always required:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_ADMIN_PIN`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`.

**Payments (only if going live):** `PAYMENTS_PROVIDER=razorpay`, `RAZORPAY_KEY_ID`,
`RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_WEBHOOK_SECRET`.

**Shipping (only if going live):** `SHIP_PROVIDER=shiprocket`, `SHIPROCKET_EMAIL`,
`SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP_LOCATION`.

**OTP login (optional):** `NEXT_PUBLIC_OTPLESS_APP_ID`, `OTPLESS_APP_SECRET` (and the
`data-appid` in `ecommerce-site/app/layout.tsx`).

---

## 1. Supabase (database, auth, storage) — MOST IMPORTANT

The database holds all real data (products, orders, requests, surveys, users). You have two
paths:

### Option A — Transfer the existing project (easiest, keeps all data)
Supabase supports transferring a project to another organization.
1. Client creates a Supabase account at https://supabase.com and a new **Organization**
   (ideally on a paid plan if the store is live — the free tier pauses inactive projects).
2. Current owner: Project → **Settings → General → Transfer project** → transfer to the
   client's organization.
3. Data, tables, and storage move with it. **Keys stay the same**, so update nothing in code —
   but the client should still **rotate the service-role and anon keys** afterward
   (Settings → API) so the previous owner no longer holds them, then update the env vars
   (Section 8).

### Option B — Fresh project + data migration (clean break)
1. Client creates a new Supabase project. Note the **Project URL** and, under
   **Settings → API**, the **anon public key** and **service_role key**.
2. Recreate the schema. There are **no migration files in this repo** — the schema was built by
   hand in the dashboard. Tables in use (inferred from code):
   `products`, `product_images`, `orders`, `order_items`, `razorpay_payments`, `requests`,
   `homepage_flyers`, `survey`, `users`.
   - For the **survey** table specifically, run this in the new project's SQL editor:
     ```sql
     create table if not exists public.survey (
       id uuid primary key default gen_random_uuid(),
       created_at timestamptz not null default now(),
       name text not null,
       phone text not null,
       email text,
       q1 text, q2 text, q3 text, q4 text, q5 text,
       comments text,
       source text default 'web',
       status text default 'new'
     );
     ```
   - For the other tables: the fastest way is to **dump from the old project and restore to the
     new one** rather than recreating by hand.
3. Migrate the data with `pg_dump` / `pg_restore` (Supabase → Settings → Database has the
   connection string):
   ```bash
   # From the OLD project (data + schema)
   pg_dump "postgresql://postgres:[OLD_DB_PASSWORD]@[OLD_HOST]:5432/postgres" \
     --schema=public --no-owner --no-privileges -Fc -f missyandmoppet.dump

   # Into the NEW project
   pg_restore --no-owner --no-privileges \
     -d "postgresql://postgres:[NEW_DB_PASSWORD]@[NEW_HOST]:5432/postgres" \
     missyandmoppet.dump
   ```
4. **Storage / product images:** buckets don't move with `pg_dump`. Re-create the same buckets
   (e.g. `product-images`, `public-assets`) in the new project and copy the files over
   (download from old bucket → upload to new), or re-upload product images via the admin.
5. **Auth users:** if there are real logged-in customers, use Supabase's user
   export/import (Auth → Users) or the Management API; otherwise a fresh auth table is fine.

> **Recommendation:** Since you'll "manually meet and transfer the database," **Option A
> (transfer project)** is by far the simplest and loses nothing. Use Option B only if the
> client wants a completely fresh project.

**RLS note:** Row Level Security is intentionally left OFF for now (per your instruction). It is
documented as a follow-up in `SECURITY-NOTES.md`; revisit before scaling.

---

## 1B. Supabase billing & the egress quota (READ THIS — it takes the site down)

On the **Free plan**, Supabase caps *cached egress* (bandwidth served) at ~5 GB/month. When the
project exceeds it, Supabase **restricts the whole project** — every database request (public
*and* admin) starts returning:

> `Service for this project is restricted due to the following violations: exceed_cached_egress_quota.`

When that happens the storefront looks broken: **product pages render empty** (the queries error
out and the code falls back to an empty list), orders can't be placed, and the admin dashboard
can't load data. Nothing in the code is wrong — the database is simply cut off. *(This actually
happened during development.)*

**What drives egress here:** product images. They are served from **Supabase Storage**, so every
image view counts against the quota. A busy storefront on the Free plan will hit the cap.

**Fixes, in order of preference:**
1. **Upgrade the project to the Pro plan** (~US$25/mo). Instantly lifts the restriction and raises
   the egress limit. This should be the client's default once the store is live and taking traffic.
2. **Remove/raise the spend cap** if already on a paid plan (Dashboard → Project → Settings →
   Billing).
3. **Wait for the monthly reset** (start of the next billing cycle) — free, but the site stays
   down until then. Only acceptable pre-launch.

**Reduce egress regardless of plan:** consider serving product images through a CDN / image
optimizer (Vercel Image Optimization or Cloudflare in front of Storage) so the same image isn't
re-fetched from Storage on every view. Check current usage any time at **Dashboard → Project →
Reports → (or) Settings → Billing & Usage**.

---

## 2. Resend (email)

Order alerts to the owner and confirmation emails to customers go through Resend. Today it uses
the **sandbox sender** `onboarding@resend.dev`, which only reliably delivers to the Resend
account owner's own inbox — **real customer emails will not arrive** until a domain is verified.

1. Client signs up at https://resend.com.
2. **Add & verify a domain** (Resend → Domains → Add Domain, e.g. `missyandmoppet.com`). This
   requires adding the DNS records Resend shows (SPF, DKIM, and a return-path) at the domain
   registrar (Section 4). Wait for "Verified".
3. Create an **API key** (Resend → API Keys). This becomes `RESEND_API_KEY`.
4. Update the two `from:` addresses in code to use the verified domain (e.g.
   `Missy & Moppet <orders@missyandmoppet.com>`):
   - `ecommerce-site/app/api/checkout/create-order/route.ts` (owner "new order" alert)
   - `ecommerce-site/app/api/admin/send-order-confirmation/route.ts` (customer confirmation)
5. The owner-alert recipient is hardcoded as `missyandmoppet@gmail.com`
   (`create-order/route.ts`) and the admin allow-list in `ecommerce-site/lib/adminCheck.ts`.
   Update both if the client's business email differs.

---

## 3. Vercel (hosting)

1. Client creates an account at https://vercel.com and connects their GitHub (fork/transfer the
   repo to the client's GitHub first if desired).
2. Either **transfer** the existing Vercel project to the client's team, or **import** the repo
   fresh into the client's account.
3. Add every environment variable from Section 0 under **Project → Settings → Environment
   Variables** (Production + Preview). Do **not** rely on `.env.local` — that file is local only.
4. Set `NEXT_PUBLIC_SITE_URL` to the client's real production URL (see Section 4).
5. Redeploy and verify.

---

## 4. Domain

1. Client buys/owns the domain (or the current owner transfers it via the registrar's transfer
   process — needs an auth/EPP code).
2. Point the domain at Vercel (Vercel → Domains shows the exact A/CNAME records).
3. Add the **Resend** DNS records (Section 2) at the same registrar.
4. Set `NEXT_PUBLIC_SITE_URL` to `https://<the-domain>` in Vercel. This drives the sitemap,
   robots.txt, Open Graph tags, and the internal shipment-callback URL.

---

## 5. Razorpay (payments) — only when going live

The site currently runs in **mock mode** (`PAYMENTS_PROVIDER` unset/`mock`, keys are
`placeholder`), so no real money moves. To accept real payments:
1. Client completes Razorpay KYC at https://razorpay.com (needs business PAN, bank account,
   and the legal/policy pages — Terms, Privacy, Refund, Shipping, Contact — which already exist
   on the site).
2. From Razorpay Dashboard → Settings → API Keys, get **Key ID** and **Key Secret**.
3. Set env vars: `PAYMENTS_PROVIDER=razorpay`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
   `NEXT_PUBLIC_RAZORPAY_KEY_ID` (the same Key ID, exposed to the browser).
4. Create a **webhook** (Razorpay → Settings → Webhooks) pointing to
   `https://<site>/api/webhooks/razorpay`, subscribe to payment events, and set the signing
   secret as `RAZORPAY_WEBHOOK_SECRET`.
5. **Before going live**, note the security follow-up in `SECURITY-NOTES.md`: the payment
   verification does not yet check the paid amount equals the order total. Address that first.

> If the client prefers to keep the current **manual** flow (admin marks "payment received"
> and sends confirmation), they can skip Razorpay entirely and stay in mock mode — the admin
> Orders page supports it.

---

## 6. Shiprocket (shipping) — only when going live

Currently mock (empty credentials). To enable real labels/AWB:
1. Client creates a Shiprocket account at https://shiprocket.in and a **pickup location**.
2. Set env vars: `SHIP_PROVIDER=shiprocket`, `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`,
   `SHIPROCKET_PICKUP_LOCATION` (the exact pickup nickname from their dashboard).
3. Note: Shiprocket is India-only; the shipment payload assumes India + numeric pincodes.

---

## 7. OTPless (optional phone/WhatsApp login)

Currently a placeholder (`NEXT_PUBLIC_OTPLESS_APP_ID=YOUR_APP_ID_HERE`, and
`ecommerce-site/app/layout.tsx` hardcodes `data-appid="YOUR_APP_ID"`), so OTP login is not
functional. Only set this up if the client wants OTP-based login:
1. Create an app at https://otpless.com; get the **App ID** and **App Secret**.
2. Set `NEXT_PUBLIC_OTPLESS_APP_ID`, `OTPLESS_APP_SECRET`, and replace the `data-appid` value
   in `ecommerce-site/app/layout.tsx`.

---

## 8. Wiring it together (env var cheat-sheet)

Create `ecommerce-site/.env.local` for local dev, and add the **same** variables in Vercel for
production. Fill values from each service's dashboard (never commit this file):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # Supabase → Settings → API → Project URL
SUPABASE_URL=                        # same value
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # Supabase → Settings → API → anon public
SUPABASE_SERVICE_ROLE_KEY=           # Supabase → Settings → API → service_role (SECRET)

# Admin
NEXT_PUBLIC_ADMIN_PIN=               # choose a new PIN for the client

# Email
RESEND_API_KEY=                      # Resend → API Keys

# Site
NEXT_PUBLIC_SITE_URL=https://<client-domain>

# Payments (leave as-is for mock; fill only when going live)
PAYMENTS_PROVIDER=mock
NEXT_PUBLIC_RAZORPAY_KEY_ID=placeholder
RAZORPAY_KEY_ID=placeholder
RAZORPAY_KEY_SECRET=placeholder
# RAZORPAY_WEBHOOK_SECRET=

# Shipping (leave empty for mock)
SHIP_PROVIDER=mock
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_PICKUP_LOCATION=

# OTPless (optional)
NEXT_PUBLIC_OTPLESS_APP_ID=
OTPLESS_APP_SECRET=
```

---

## 9. Post-migration verification checklist

Run `cd ecommerce-site && npm install && npm run build` — it must succeed. Then on the deployed
site:
- [ ] Homepage, `/shop`, a product page, `/cart` load.
- [ ] Place a test order → it appears in `/admin` → Orders.
- [ ] Admin **"Mark payment received"** flips status to Paid.
- [ ] Admin **"Send confirmation"** email arrives at the test customer inbox (needs Section 2
      domain verification to reach non-owner inboxes).
- [ ] New-order alert email arrives at the business inbox.
- [ ] `/survey` submits → row appears in `/admin` → Surveys (needs the `survey` table, Section 1).
- [ ] `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` serve.
- [ ] Admin PIN gate works with the new `NEXT_PUBLIC_ADMIN_PIN`.
- [ ] (If live) a real Razorpay payment completes and the webhook marks the order paid.
- [ ] (If live) a paid order creates a Shiprocket shipment.

---

## 10. Final cutover (day of handover)

1. Freeze changes; take a final DB dump from the old project (backup).
2. Transfer (or migrate) Supabase (Section 1).
3. Move Resend, Vercel, domain, and any live Razorpay/Shiprocket to the client's accounts.
4. Update all env vars in the client's Vercel and redeploy.
5. Run the Section 9 checklist end-to-end.
6. **Current owner rotates/revokes all old keys** (Supabase anon + service_role, Resend API key,
   Razorpay keys, Shiprocket password, OTPless secret) and removes themselves as a
   collaborator from each service so no personal access remains.
7. Hand over the admin PIN and account logins to the client through a secure channel.
