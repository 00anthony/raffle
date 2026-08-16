// features/tickets/lib/get-ticket-count-for-raffle.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function getTicketCountForRaffle(raffleId: string): Promise<number> {
  const admin = createAdminClient()
  const { count } = await admin
    .from('tickets')
    .select('id', { count: 'exact', head: true })
    .eq('raffle_id', raffleId)
  return count ?? 0
}