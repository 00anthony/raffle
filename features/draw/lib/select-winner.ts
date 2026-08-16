// features/draw/lib/select-winner.ts
import crypto from 'node:crypto'

type EligibleTicket = { id: string; display_id: string; sequence_number: number }

// Deterministic given the seed — anyone can recompute the same winner later
// from (seed + the eligible ticket list ordered by sequence_number), which
// is the actual audit trail the `draws.seed` column exists for (Phase 2).
// The seed itself comes from Node's CSPRNG, so it can't be predicted or
// influenced ahead of time.
export function selectWinner(eligibleTickets: EligibleTicket[]) {
  if (eligibleTickets.length === 0) {
    throw new Error('Cannot select a winner from an empty ticket pool.')
  }
  const seed = crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(seed).digest()
  const index = hash.readUInt32BE(0) % eligibleTickets.length
  return { winner: eligibleTickets[index], seed }
}