# Missy & Moppet — Handover Checklist (day-of runbook)

This is the **ordered, tickable runbook** for actually transferring the project to the client.
It is the companion to `MIGRATION-GUIDE.md` — the guide explains *how* to move each service; this
checklist is the *sequence to follow on the day* so nothing is missed and no personal access is
left behind.

> **Who does what:** "Dev" = current owner (original developer). "Client" = new owner.
> Work top to bottom — later steps assume earlier ones are done.

---

## Phase 0 — Before the meeting (Dev, in advance)

- [ ] Confirm the site builds and runs clean: `cd ecommerce-site && npm install && npm run build`.
- [ ] Take a **fresh Supabase backup** (Dashboard → Database → Backups, or `pg_dump`). Keep a copy.
- [ ] Export the current env var list from Vercel (names only — you'll re-enter values later).
- [ ] Make sure the code is pushed to the GitHub repo the client will own/fork.
- [ ] Read `SECURITY-NOTES.md` with the client so they understand the accepted risks
      (shared admin access, RLS off, sandbox email, manual payment confirmation).
- [ ] Decide with the client whether they go live with real Razorpay/Shiprocket now or stay on
      mock mode at launch.

## Phase 1 — Client creates their own accounts (Client, with Dev guiding)

Create these under the **client's own email/billing** (see MIGRATION-GUIDE for exact steps & links):

- [ ] **Supabase** account (and decide: transfer the existing project [Option A, recommended] vs.
      fresh project [Option B]).
- [ ] **Resend** account (for email).
- [ ] **Vercel** account (for hosting) + connect their GitHub.
- [ ] **Domain** registrar access (if the client owns a custom domain).
- [ ] *(Only if going live)* **Razorpay** account (KYC can take days — start early).
- [ ] *(Only if going live)* **Shiprocket** account + pickup location.
- [ ] *(Optional)* **OTPless** account, if phone/WhatsApp login is wanted.

## Phase 2 — Move the data & services (Dev + Client together)

- [ ] **Supabase:** transfer the project to the client's org (Option A) *or* restore the dump into
      the client's new project + copy the Storage bucket + run the `survey` table SQL (Option B).
      → MIGRATION-GUIDE §1.
- [ ] **Confirm Supabase billing plan.** If the store will take real traffic, put the project on
      **Pro** — the Free plan's egress cap will take the storefront offline once product-image
      bandwidth is exceeded. → MIGRATION-GUIDE §1B.
- [ ] **Resend:** client adds & **verifies their sending domain**, so customer emails actually
      deliver (not just to the account owner). → MIGRATION-GUIDE §2.
- [ ] **Vercel:** client imports the GitHub repo. **Set Root Directory = `ecommerce-site`**
      (critical — the repo root is not a runnable app). → MIGRATION-GUIDE §3.
- [ ] **Domain:** point DNS at the client's Vercel project. → MIGRATION-GUIDE §4.

## Phase 3 — Configure environment variables (Client's Vercel + local)

Re-enter **every** variable from `ecommerce-site/.env.example` with the client's *new* values.
Never reuse the Dev's old secrets.

- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY` — from the client's Supabase project.
- [ ] `NEXT_PUBLIC_ADMIN_PIN` — **choose a brand-new PIN** for the client (don't carry over `5588`).
- [ ] `RESEND_API_KEY` — from the client's Resend account.
- [ ] `NEXT_PUBLIC_SITE_URL` — the client's production domain.
- [ ] Payments/shipping — leave as `placeholder`/empty for mock, or fill with the client's real
      keys if going live (`PAYMENTS_PROVIDER=razorpay`, `SHIP_PROVIDER=shiprocket`).
- [ ] OTPless vars — fill only if using OTPless; otherwise leave unset (the login script now stays
      disabled automatically).
- [ ] Update the admin email whitelist in `ecommerce-site/lib/adminCheck.ts` to the client's staff
      emails, and confirm `missyandmoppet@gmail.com` is still where owner order-alerts should go.

## Phase 4 — Verify on the client's stack

Run through `MIGRATION-GUIDE.md` §9 end-to-end on the **client's deployed site**:

- [ ] Homepage, `/shop`, a product page, `/cart` load (products appear — confirms Supabase is
      connected and *not* egress-restricted).
- [ ] Place a test order → appears in `/admin` → Orders.
- [ ] "Mark payment received" flips status to Paid; "Send confirmation" email arrives.
- [ ] Owner new-order alert email arrives at the business inbox.
- [ ] `/survey` submits → row appears in `/admin` → Surveys.
- [ ] `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` serve.
- [ ] Admin PIN gate works with the **new** PIN.
- [ ] *(If live)* a real Razorpay payment completes and a Shiprocket shipment books.

## Phase 5 — Cutover & lock-out (Dev) — DO THIS LAST

Only after Phase 4 passes on the client's stack:

- [ ] Repoint the production domain to the client's deployment (if not already).
- [ ] **Rotate/revoke every old credential** on the Dev's personal accounts:
  - [ ] Supabase — reset the project's API keys (anon + service_role) *(N/A if the project was
        transferred to the client's org and Dev removed as member)*.
  - [ ] Resend — delete the old API key.
  - [ ] Razorpay — regenerate keys / revoke Dev access (if it was ever live).
  - [ ] Shiprocket — change password / remove Dev access.
  - [ ] OTPless — rotate the app secret (if used).
- [ ] **Remove Dev as a collaborator/member** from Supabase, Resend, Vercel, GitHub, Razorpay,
      Shiprocket — so no personal access to the client's data remains.
- [ ] Hand over the admin PIN and all account logins to the client via a **secure channel**
      (not plain email/chat).
- [ ] Delete any local copies of the client's secrets from the Dev's machine
      (`ecommerce-site/.env.local`).

## Phase 6 — Leave the client set up to operate

- [ ] Walk the client through the admin dashboard: Orders, "Mark payment received",
      "Send confirmation", Products, Surveys.
- [ ] Show them where to watch Supabase usage/billing (egress) and Vercel deploys.
- [ ] Point them at `SETUP.md` (day-to-day) and `SECURITY-NOTES.md` (risks to revisit before
      scaling: enable RLS, gate admin routes, verify payment amounts, add rate limiting).

---

**Rule of thumb:** the handover isn't done until (a) the client's own deployment passes Phase 4,
and (b) every one of the Dev's old keys is rotated/revoked in Phase 5. Until both are true, the
site is still running on personal accounts.
