'use client'

import { useCountdown } from '@/hooks/use-countdown'

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

  if (isExpired) {
    return <p className="font-mono text-sm text-ember uppercase tracking-wide">Sales have closed</p>
  }

  const units = [
    { label: 'D', value: days },
    { label: 'H', value: hours },
    { label: 'M', value: minutes },
    { label: 'S', value: seconds },
  ]

  return (
    <div className="flex gap-2" role="timer" aria-live="polite" aria-atomic="true">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="font-mono text-2xl tabular-nums bg-charcoal text-ticket-cream px-2 py-1 min-w-[2.5rem] text-center">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="font-mono text-[10px] text-sage mt-1">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
