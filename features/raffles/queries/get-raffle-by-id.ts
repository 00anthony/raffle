// features/raffles/queries/get-raffle-by-id.ts
import { createAdminClient } from '@/lib/supabase/admin'
import type { Raffle } from '@/types/raffle'

export async function getRaffleById(id: string): Promise<Raffle | null> {
  const admin = createAdminClient()
  const { data, error } = await admin.from('raffles').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return data as Raffle
}