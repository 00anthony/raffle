# Raffle Platform

A reusable, multi-raffle charity ticketing platform. Next.js (App Router) +
TypeScript + Supabase (Postgres/Auth) + Stripe + Tailwind.

**Status: Phases 1–5 of 11 complete.**

| Phase | Status | Covers |
|---|---|---|
| 1 | ✅ | Architecture, folder structure, dependencies, routing |
| 2 | ✅ | Supabase schema, RLS, ticket allocation, admin auth |
| 3 | ✅ | Public landing page (hero, prizes, rules, QR, footer) |
| 4 | ✅ | Purchase flow (ticket selection, buyer info, payment method) |
| 5 | ✅ | Stripe Checkout + webhook + ticket generation |
| 6 | ✅ | Manual payments (Cash App / Venmo / Zelle + admin approval) |
| 7 | ✅ | Emails (Resend) + signed confirmation-page tokens |
| 8 | ⬜ | Admin dashboard (stats, cash sale, approvals) |
| 9 | ⬜ | Live draw (secure server-side selection + wheel animation) |
| 10 | ⬜ | Testing |
| 11 | ⬜ | Deployment |

Placeholder stubs exist for `/admin`, `/admin/login`, and the email sender so
the app builds and runs end-to-end today — they'll be filled in by their
respective phases.

---

## 1. Prerequisites

- Node.js 20+ and npm
- A free [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (test mode is fine)
- The [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

## 2. Install

```bash
npm install
```

This installs everything in `package.json` — see the full dependency list
at the bottom of this file if you want to sanity-check versions.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (**server-only, never expose to the client**) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys (use a **test mode** key) |
| `STRIPE_WEBHOOK_SECRET` | Printed by `stripe listen` (see step 5 below) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |

`.env.local` is git-ignored — it will never be committed.

## 4. Set up the database

In the Supabase SQL Editor (or via the Supabase CLI), run every file in
`supabase/migrations/` **in order**, 0001 through 0007:

```bash
# If you have the Supabase CLI linked to your project:
supabase db push

# Otherwise, paste each file's contents into the SQL Editor manually,
# in filename order.
```

Then create your first admin:

1. Go to your app's Supabase Auth and manually create a user (email + password), or trigger a normal sign-up flow once you build one.
2. Grab that user's UUID from the Supabase Auth dashboard.
3. Run in the SQL Editor:
   ```sql
   insert into admin_profiles (user_id, role)
   values ('<paste-the-uuid-here>', 'superadmin');
   ```

## 5. Set up Stripe webhooks locally

In a second terminal, with the [Stripe CLI](https://stripe.com/docs/stripe-cli) installed:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This prints a webhook signing secret starting with `whsec_...` — copy it into
`STRIPE_WEBHOOK_SECRET` in `.env.local` and restart `npm run dev`.

## 6. Seed a test raffle

Run in the Supabase SQL Editor:

```sql
insert into raffles (
  slug, title, description, ticket_prefix, ticket_price,
  status, end_date, drawing_date, rules
) values (
  'fall-food-drive-2026',
  'Fall Food Drive Raffle',
  'Support our community food bank — every ticket helps.',
  'FFD26',
  10.00,
  'active',
  now() + interval '14 days',
  now() + interval '15 days',
  '[{"title": "Eligibility", "text": "Must be 18 years or older."}]'::jsonb
);
```

## 7. Run it

```bash
npm run dev
```

Then:

- **Landing page:** `http://localhost:3000/raffles/fall-food-drive-2026`
- **Purchase flow:** click "Buy Tickets", fill the form, choose **Credit Card**
- **Stripe Checkout:** use test card `4242 4242 4242 4242`, any future expiry, any CVC
- After payment, watch your `stripe listen` terminal — you should see
  `checkout.session.completed` forwarded and a `200` response
- Check the Supabase Table Editor: the `purchases` row should flip to
  `approved`, and matching rows should appear in `tickets` with `display_id`
  values like `FFD26-000001`

## 8. What "everything is connected" looks like

Use this as a checklist while testing:

- [ ] `npm run build` completes with no errors (requires real env vars — see note below)
- [ ] Visiting the raffle slug renders the hero, countdown, and (once you add
      rows) prizes/rules/footer
- [ ] Submitting the purchase form redirects to `/purchase/[id]/pay`
- [ ] Choosing **Credit Card** redirects to an actual Stripe Checkout page
- [ ] Completing test payment redirects back and eventually shows "Payment Confirmed"
- [ ] The `stripe listen` terminal shows the webhook was received and returned `200`
- [ ] The `purchases` row's `payment_status` is `approved`
- [ ] `tickets` rows exist for that purchase with correctly formatted `display_id`s
- [ ] Buying tickets for a `draft`-status raffle 404s (RLS working)
- [ ] Two rapid purchases for the same raffle never produce duplicate ticket numbers

> **Note on `npm run build`:** the project uses `next/font/google` for
> Fraunces, Public Sans, and IBM Plex Mono, which requires outbound access to
> `fonts.googleapis.com` at build time. This is normal in any real dev
> machine or CI runner with internet access — it only fails in network-locked
> sandboxes.

## 9. Git history

This package already includes an initial git commit covering everything
through Phase 5, so you have a clean baseline to diff against as you continue.

```bash
git log --oneline
```

From here, treat each future phase as its own commit:

```bash
git add -A
git commit -m "Phase 6: manual payments"
```

If a future change breaks something, `git diff HEAD~1` (or `git bisect`) gets
you back to a known-good state fast.

---

## Full dependency list

```
next, react, react-dom
@supabase/supabase-js, @supabase/ssr
stripe
resend, react-email, @react-email/components
googleapis
react-hook-form, @hookform/resolvers, zod
framer-motion
lucide-react
class-variance-authority, clsx, tailwind-merge
canvas-confetti
react-qr-code

devDependencies:
typescript, @types/node, @types/react, @types/react-dom, @types/canvas-confetti
tailwindcss, postcss, autoprefixer
supabase (CLI)
```

Install everything with a single `npm install` — the versions above are all
pinned in `package.json`.

Note: `resend`, `react-email`, `@react-email/components`, and `googleapis`
are included now (per the Phase 1 stack decision) but not yet wired into any
code — they're consumed starting Phase 7 (emails) and the later Google
Sheets sync phase. `canvas-confetti` is likewise present but unused until
Phase 9 (live draw).
