// features/draw/components/draw-wheel.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

type WheelTicket = { id: string; display_id: string }

export function DrawWheel({
  tickets, winningTicketId, prizeTitle, onComplete,
}: { tickets: WheelTicket[]; winningTicketId: string; prizeTitle?: string; onComplete?: () => void }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const winner = tickets.find((t) => t.id === winningTicketId)!
  const winnerIndex = tickets.findIndex((t) => t.id === winningTicketId)
  const segmentAngle = 360 / tickets.length

  function startSpin() {
    setSpinning(true)
    // 6 full spins for suspense, landing the winning segment exactly under
    // the top pointer. +segmentAngle/2 centers the segment, not its edge.
    setRotation(360 * 6 + (360 - winnerIndex * segmentAngle - segmentAngle / 2))
  }

  function handleAnimationComplete() {
    if (!spinning) return
    setSpinning(false)
    setRevealed(true)
    fireCelebration()
    onComplete?.()
  }

  function fireCelebration() {
    const end = Date.now() + 2500
    ;(function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: ['#C89B3C', '#B23A2E', '#F7F0DE'] })
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: ['#C89B3C', '#B23A2E', '#F7F0DE'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[340px] h-[340px]">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-[16px] border-l-transparent border-r-transparent border-t-ember" />
        <motion.div
          className="w-full h-full rounded-full border-4 border-brass relative overflow-hidden bg-ink-green"
          animate={{ rotate: rotation }}
          transition={{ duration: 6, ease: [0.12, 0.67, 0.17, 0.99] }}
          onAnimationComplete={handleAnimationComplete}
        >
          {tickets.map((t, i) => (
            <div key={t.id}
              className="absolute top-1/2 left-1/2 origin-left text-[9px] font-mono text-ticket-cream whitespace-nowrap"
              style={{ transform: `rotate(${i * segmentAngle}deg) translateX(10px)` }}>
              {t.display_id}
            </div>
          ))}
        </motion.div>
      </div>

      {!spinning && !revealed && (
        <button onClick={startSpin}
          className="mt-8 border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-3 px-8 hover:bg-charcoal transition-colors">
          Spin the Wheel
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