// features/draw/components/draw-section.tsx
'use client'

import { useState, useTransition } from 'react'
import { drawWinner } from '../actions/draw-winner'
import { DrawConfirmModal } from './draw-confirmation-modal'
import { DrawWheel } from './draw-wheel'
import { DrawSlotReel } from './draw-slot-reel'
import { LocalDateTime } from '@/components/shared/local-datetime'
import { useToast } from '@/hooks/use-toast'

const DEV_MODE = process.env.NEXT_PUBLIC_RAFFLE_DEV_MODE === 'true'
const WHEEL_TO_REEL_THRESHOLD = 200

type WheelTicket = { id: string; display_id: string }
type ExistingWinner = { ticketDisplayId: string; drawnAt: string } | null

export function DrawSection({
  raffleId, prizeId, prizeTitle, existingWinner,
}: { raffleId: string; prizeId: string | null; prizeTitle?: string; existingWinner: ExistingWinner }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [wheelData, setWheelData] = useState<{ tickets: WheelTicket[]; winningTicketId: string; totalEligible: number } | null>(null)
  const { toast } = useToast()

  function runDraw() {
    setConfirmOpen(false)
    startTransition(async () => {
      const result = await drawWinner(raffleId, prizeId)
      if (!result.ok) {
        toast({ title: 'Draw failed', description: result.error, variant: 'destructive' })
        return
      }
      // Setting this state is what the server's post-action refresh must NOT
      // be allowed to interrupt — see the render logic below.
      setWheelData({ tickets: result.wheelTickets, winningTicketId: result.winningTicket.id, totalEligible: result.totalEligible })
    })
  }

  function handleClick() {
    if (DEV_MODE) runDraw()
    else setConfirmOpen(true)
  }

  // wheelData takes priority over existingWinner. This is the actual fix:
  // when Next's automatic post-action refresh re-renders this component with
  // a fresh existingWinner prop, THIS component instance is preserved (same
  // type, same position) rather than unmounted — so local wheelData survives
  // the refresh and keeps playing out its full animation uninterrupted.
  if (wheelData) {
    const Visual = wheelData.totalEligible > WHEEL_TO_REEL_THRESHOLD ? DrawSlotReel : DrawWheel
    return <Visual tickets={wheelData.tickets} winningTicketId={wheelData.winningTicketId} prizeTitle={prizeTitle} />
  }

  if (existingWinner) {
    return (
      <p className="font-mono text-sm text-brass mt-2">
        Winner: {existingWinner.ticketDisplayId} · drawn{' '}
        <LocalDateTime iso={existingWinner.drawnAt} options={{ dateStyle: 'medium', timeStyle: 'short' }} />
      </p>
    )
  }

  return (
    <>
      <button onClick={handleClick} disabled={isPending}
        className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-2 px-4 disabled:opacity-50">
        {isPending ? 'Drawing…' : 'Draw Winner'}
      </button>
      <DrawConfirmModal open={confirmOpen} onConfirm={runDraw} onCancel={() => setConfirmOpen(false)} />
    </>
  )
}