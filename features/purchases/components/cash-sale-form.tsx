// features/purchases/components/cash-sale-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { createCashSale } from '../actions/create-cash-sale'
import { useToast } from '@/hooks/use-toast'

type RaffleOption = { id: string; title: string; slug: string; status: string }

export function CashSaleForm({ raffles }: { raffles: RaffleOption[] }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [raffleId, setRaffleId] = useState(raffles[0]?.id ?? '')
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [ticketCount, setTicketCount] = useState(1)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createCashSale({ raffleId, buyerName, buyerEmail, ticketCount })
      if (!result.ok) {
        toast({ title: 'Could not record sale', description: result.error, variant: 'destructive' })
        return
      }
      toast({ title: 'Sale recorded', description: `${result.ticketCount} ticket(s) issued.` })
      setBuyerName('')
      setBuyerEmail('')
      setTicketCount(1)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div>
        <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">Raffle</label>
        <select value={raffleId} onChange={(e) => setRaffleId(e.target.value)}
          className="w-full border border-brass/40 bg-ticket-cream px-3 py-2">
          {raffles.map((r) => (
            <option key={r.id} value={r.id}>{r.title} ({r.status})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">Buyer Name</label>
        <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required
          className="w-full border border-brass/40 bg-ticket-cream px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">Buyer Email</label>
        <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} required
          className="w-full border border-brass/40 bg-ticket-cream px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">Ticket Count</label>
        <input type="number" min={1} max={100} value={ticketCount}
          onChange={(e) => setTicketCount(Number(e.target.value))}
          className="w-full border border-brass/40 bg-ticket-cream px-3 py-2" />
      </div>
      <button type="submit" disabled={isPending || !raffleId}
        className="w-full border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm tracking-wide uppercase py-3 disabled:opacity-50 hover:bg-charcoal transition-colors">
        {isPending ? 'Recording…' : 'Record Cash Sale'}
      </button>
    </form>
  )
}