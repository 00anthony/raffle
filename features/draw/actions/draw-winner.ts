// features/draw/actions/draw-winner.ts
'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/server/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { selectWinner } from '../lib/select-winner'

const WHEEL_SEGMENT_CAP = 60

export async function drawWinner(raffleId: string, prizeId: string | null) {
  const { user } = await requireAdmin()
  const admin = createAdminClient()

  // Same prize can't be drawn twice — checked here for a clean error message;
  // the partial unique index from step 1 is the real guarantee underneath.
  const dupeCheck = prizeId
    ? admin.from('draws').select('id').eq('raffle_id', raffleId).eq('prize_id', prizeId).maybeSingle()
    : admin.from('draws').select('id').eq('raffle_id', raffleId).is('prize_id', null).maybeSingle()
  const { data: existing } = await dupeCheck
  if (existing) return { ok: false as const, error: 'This prize has already been drawn.' }

  // A ticket that already won a prior prize in this raffle is excluded by
  // default, so the same buyer/ticket can't sweep every prize. Flag if you'd
  // rather allow repeat wins for some raffle formats — this is an assumption,
  // not something your original spec specified either way.
  const { data: previousWinners } = await admin.from('draws').select('winning_ticket_id').eq('raffle_id', raffleId)
  const excludedIds = new Set((previousWinners ?? []).map((d) => d.winning_ticket_id))

  const { data: allTickets } = await admin
    .from('tickets')
    .select('id, display_id, sequence_number')
    .eq('raffle_id', raffleId)
    .order('sequence_number', { ascending: true })

  const eligible = (allTickets ?? []).filter((t) => !excludedIds.has(t.id))
  if (eligible.length === 0) {
    return { ok: false as const, error: 'No eligible tickets remain for this raffle.' }
  }

  const { winner, seed } = selectWinner(eligible)

  const { error } = await admin.from('draws').insert({
    raffle_id: raffleId,
    winning_ticket_id: winner.id,
    prize_id: prizeId,
    drawn_by: user.id,
    seed,
  })

  if (error) return { ok: false as const, error: 'Could not record the draw. Please try again.' }

  // The wheel only needs a visual sample, not the full pool — the winner is
  // already locked in above. For a raffle with thousands of tickets, cosmetic
  // sampling here (plain Math.random, not crypto — fairness isn't at stake)
  // keeps the wheel from rendering thousands of DOM nodes.
  const wheelTickets = sampleForWheel(eligible, winner, WHEEL_SEGMENT_CAP)

  revalidatePath(`/admin/draw/${raffleId}`)
  return { ok: true as const, winningTicket: winner, wheelTickets, totalEligible: eligible.length }
}

function sampleForWheel<T extends { id: string }>(pool: T[], winner: T, cap: number): T[] {
  if (pool.length <= cap) return shuffle(pool)
  const others = pool.filter((t) => t.id !== winner.id)
  const sampled: T[] = []
  const copy = [...others]
  while (sampled.length < cap - 1 && copy.length > 0) {
    sampled.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return shuffle([winner, ...sampled])
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}