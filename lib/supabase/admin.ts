// SERVICE ROLE — bypasses Row Level Security entirely.
//
// Only import this in trusted server-side code that has already done its own
// authorization/validation: the Stripe webhook handler, ticket generation,
// admin Server Actions, and confirmation-token verification.
//
// NEVER import this in a Client Component or anything reachable from a
// public, unauthenticated request path without validation happening first.
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
