import { createClient } from '@/lib/supabase/server'
import type { Prize } from '@/types/prize'

export async function getPrizesByRaffle(raffleId: string): Promise<Prize[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prizes')
    .select('*')
    .eq('raffle_id', raffleId)
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data as Prize[]
}
