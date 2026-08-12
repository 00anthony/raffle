import { createClient } from '@/lib/supabase/server'
import type { Raffle } from '@/types/raffle'

export async function getRaffleBySlug(slug: string): Promise<Raffle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('raffles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null
  return data as Raffle
}
