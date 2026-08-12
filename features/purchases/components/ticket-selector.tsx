'use client'

export function TicketSelector({
  value, onChange, ticketPrice,
}: { value: number; onChange: (n: number) => void; ticketPrice: number }) {
  return (
    <div>
      <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-2">Number of Tickets</label>
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))}
          aria-label="Decrease ticket count" className="w-10 h-10 border border-brass/40 font-mono text-lg">−</button>
        <span className="font-mono text-2xl tabular-nums w-12 text-center">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(100, value + 1))}
          aria-label="Increase ticket count" className="w-10 h-10 border border-brass/40 font-mono text-lg">+</button>
        <span className="font-mono text-sm text-sage ml-auto">${ticketPrice.toFixed(2)} each</span>
      </div>
    </div>
  )
}
