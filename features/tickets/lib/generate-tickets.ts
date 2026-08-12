import { createAdminClient } from '@/lib/supabase/admin'

export async function generateTicketsForPurchase(purchaseId: string) {
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('id, raffle_id, ticket_count')
    .eq('id', purchaseId)
    .single()

  if (!purchase) throw new Error(`Purchase ${purchaseId} not found`)

  // Idempotency: if tickets already exist for this purchase, don't allocate again.
  const { data: existingTickets } = await admin
    .from('tickets')
    .select('id, display_id')
    .eq('purchase_id', purchaseId)

  if (existingTickets && existingTickets.length > 0) {
    return existingTickets
  }

  // Calls the Postgres function from Phase 2 — its FOR UPDATE row lock on
  // raffle_ticket_counters is what serializes concurrent purchases for the
  // same raffle and prevents duplicate/overlapping sequence numbers.
  const { data: sequences, error: allocError } = await admin.rpc('allocate_ticket_sequences', {
    p_raffle_id: purchase.raffle_id,
    p_count: purchase.ticket_count,
  })

  if (allocError || !sequences) {
    throw new Error(`Failed to allocate ticket sequences for purchase ${purchaseId}: ${allocError?.message}`)
  }

  const rows = sequences.map((s: { sequence_number: number }) => ({
    raffle_id: purchase.raffle_id,
    purchase_id: purchase.id,
    sequence_number: s.sequence_number,
  }))

  const { data: tickets, error: insertError } = await admin
    .from('tickets')
    .insert(rows)
    .select('id, display_id')

  if (insertError || !tickets) {
    throw new Error(`Failed to insert tickets for purchase ${purchaseId}: ${insertError?.message}`)
  }

  return tickets
}
