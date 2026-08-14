// features/purchases/queries/get-pending-verification-purchases.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function getPendingVerificationPurchases() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('purchases')
    .select('id, buyer_name, buyer_email, payment_method, payment_reference, ticket_count, amount_paid, created_at, raffles(title, slug)')
    .eq('payment_status', 'pending_verification')
    .order('created_at', { ascending: true })

  if (error || !data) return []
  return data
}