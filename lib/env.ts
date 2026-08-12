import { z } from 'zod'

// Validated per-phase, additively. Vars introduced by later phases (Resend,
// Google Sheets, confirmation-token secret) are commented below as a map of
// what's coming — added for real when their phase lands, per the Phase 2
// convention of not front-loading vars we can't test yet.
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // Phase 7: RESEND_API_KEY
  // Phase 7: RAFFLE_CONFIRMATION_SECRET
  // Later:   GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEETS_SPREADSHEET_ID
})

// Lazily validated (called, not executed at import time) so that importing
// a module which happens to import this file doesn't crash builds/tooling
// before real env vars are configured. Call getEnv() inside functions that
// actually need a validated value.
export function getEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('Invalid or missing environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid or missing environment variables. Check .env.local against .env.example.')
  }
  return parsed.data
}
