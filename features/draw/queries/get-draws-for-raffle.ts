// features/draw/queries/get-draws-for-raffle.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function getDrawsForRaffle(raffleId: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('draws')
    .select('id, prize_id, drawn_at, tickets(display_id)')
    .eq('raffle_id', raffleId)

  if (error || !data) return []

  return data.map((d) => {
    const ticket = Array.isArray(d.tickets) ? d.tickets[0] : d.tickets
    return { prizeId: d.prize_id as string | null, drawnAt: d.drawn_at, ticketDisplayId: ticket?.display_id ?? 'unknown' }
  })
}