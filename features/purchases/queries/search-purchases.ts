// features/purchases/queries/search-purchases.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function searchPurchases({
  raffleId, status, query,
}: { raffleId?: string | null; status?: string | null; query?: string | null }) {
  const admin = createAdminClient()

  // A query that looks like a ticket display_id (contains a hyphen, e.g.
  // "FFD26-000124") is resolved via the tickets table first, then mapped
  // back to its purchase — buyer_name/email search wouldn't match this.
  if (query && query.includes('-')) {
    const { data: ticket } = await admin
      .from('tickets')
      .select('purchase_id')
      .eq('display_id', query.trim().toUpperCase())
      .maybeSingle()

    if (ticket) {
      const { data } = await admin
        .from('purchases')
        .select('id, buyer_name, buyer_email, payment_method, payment_status, ticket_count, amount_paid, created_at, raffles(title, slug)')
        .eq('id', ticket.purchase_id)
      return data ?? []
    }
    return []
  }

  let q = admin
    .from('purchases')
    .select('id, buyer_name, buyer_email, payment_method, payment_status, ticket_count, amount_paid, created_at, raffles(title, slug)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (raffleId) q = q.eq('raffle_id', raffleId)
  if (status) q = q.eq('payment_status', status)
  if (query) q = q.or(`buyer_name.ilike.%${query}%,buyer_email.ilike.%${query}%`)

  const { data, error } = await q
  return error || !data ? [] : data
}