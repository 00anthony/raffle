// features/draw/components/draw-button.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { drawWinner } from '../actions/draw-winner'
import { DrawConfirmModal } from './draw-confirmation-modal'
import { DrawWheel } from './draw-wheel'
import { useToast } from '@/hooks/use-toast'
import { DrawSlotReel } from './draw-slot-reel'

const DEV_MODE = process.env.NEXT_PUBLIC_RAFFLE_DEV_MODE === 'true'

type WheelTicket = { id: string; display_id: string }

const WHEEL_TO_REEL_THRESHOLD = 200

export function DrawButton({
  raffleId, prizeId, prizeTitle, label = 'Draw Winner',
}: { raffleId: string; prizeId: string | null; prizeTitle?: string; label?: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [wheelData, setWheelData] = useState<{ tickets: WheelTicket[]; winningTicketId: string; totalEligible: number } | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  function runDraw() {
    setConfirmOpen(false)
    startTransition(async () => {
      const result = await drawWinner(raffleId, prizeId)
      if (!result.ok) {
        toast({ title: 'Draw failed', description: result.error, variant: 'destructive' })
        return
      }
      setWheelData({ tickets: result.wheelTickets, winningTicketId: result.winningTicket.id, totalEligible: result.totalEligible })

    })
  }

  function handleClick() {
    // Development mode bypasses the confirmation entirely, per the original
    // spec — gated behind an explicit env var, never NODE_ENV (see note above).
    if (DEV_MODE) runDraw()
    else setConfirmOpen(true)
  }

  if (wheelData) {
    const Visual = wheelData.totalEligible > WHEEL_TO_REEL_THRESHOLD ? DrawSlotReel : DrawWheel
    return (
      <Visual tickets={wheelData.tickets} winningTicketId={wheelData.winningTicketId}
        prizeTitle={prizeTitle} onComplete={() => router.refresh()} />
    )
  }

  return (
    <>
      <button onClick={handleClick} disabled={isPending}
        className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-2 px-4 disabled:opacity-50">
        {isPending ? 'Drawing…' : label}
      </button>
      <DrawConfirmModal open={confirmOpen} onConfirm={runDraw} onCancel={() => setConfirmOpen(false)} />
    </>
  )
}