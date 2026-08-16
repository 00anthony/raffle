// features/draw/components/draw-slot-reel.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

type WheelTicket = { id: string; display_id: string }

const ITEM_HEIGHT = 56
const REEL_LENGTH = 40 // items scrolled through before landing — cosmetic only

export function DrawSlotReel({
  tickets, winningTicketId, prizeTitle, onComplete,
}: { tickets: WheelTicket[]; winningTicketId: string; prizeTitle?: string; onComplete?: () => void }) {
  const [spinning, setSpinning] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const winner = tickets.find((t) => t.id === winningTicketId)!

  // Random filler items padded to REEL_LENGTH-1, winner appended as the
  // final (landing) item. Purely visual — the winner was already determined
  // server-side in drawWinner() before this component ever renders.
  const reelItems = useMemo(() => {
    const others = tickets.filter((t) => t.id !== winningTicketId)
    const filler: WheelTicket[] = []
    for (let i = 0; i < REEL_LENGTH - 1; i++) {
      filler.push(others[Math.floor(Math.random() * others.length)] ?? winner)
    }
    return [...filler, winner]
  }, [tickets, winningTicketId, winner])

  const targetY = -(REEL_LENGTH - 1) * ITEM_HEIGHT

  function handleAnimationComplete() {
    if (!spinning) return
    setSpinning(false)
    setRevealed(true)
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } })
    onComplete?.()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 border-4 border-brass bg-ink-green overflow-hidden" style={{ height: ITEM_HEIGHT }}>
        <div className="absolute inset-x-0 top-0 h-full border-y-2 border-ember/60 pointer-events-none z-10" />
        <motion.div
          animate={{ y: spinning ? targetY : 0 }}
          transition={spinning ? { duration: 5, ease: [0.1, 0.6, 0.2, 1] } : { duration: 0 }}
          onAnimationComplete={handleAnimationComplete}
        >
          {reelItems.map((t, i) => (
            <div key={`${t.id}-${i}`} className="flex items-center justify-center font-mono text-lg text-ticket-cream"
              style={{ height: ITEM_HEIGHT }}>
              {t.display_id}
            </div>
          ))}
        </motion.div>
      </div>

      {!spinning && !revealed && (
        <button onClick={() => setSpinning(true)}
          className="mt-8 border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-3 px-8 hover:bg-charcoal transition-colors">
          Spin
        </button>
      )}

      {revealed && (
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mt-8 text-center bg-ticket-cream text-charcoal border-2 border-brass p-6">
          {prizeTitle && <p className="font-mono text-xs uppercase tracking-wide text-sage">{prizeTitle}</p>}
          <p className="font-mono text-xs uppercase tracking-wide text-sage mt-1">Winning Ticket</p>
          <p className="font-display text-4xl mt-1">{winner.display_id}</p>
        </motion.div>
      )}
    </div>
  )
}