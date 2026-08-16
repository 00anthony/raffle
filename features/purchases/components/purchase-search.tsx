// features/purchases/components/purchase-search.tsx
'use client'

import { useState, useTransition } from 'react'
import { searchPurchasesAction } from '../actions/search-purchase-action'

type PurchaseRow = {
  id: string; buyer_name: string; buyer_email: string
  payment_method: string; payment_status: string
  ticket_count: number; amount_paid: number; created_at: string
  raffles: { title: string; slug: string } | { title: string; slug: string }[]
}

const STATUS_OPTIONS = ['', 'pending', 'pending_verification', 'approved', 'rejected', 'refunded']

export function PurchaseSearch({ initialResults }: { initialResults: PurchaseRow[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [results, setResults] = useState(initialResults)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      setResults(await searchPurchasesAction({ query, status: status || null }))
    })
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, or ticket number…"
          className="flex-1 border border-brass/40 bg-ticket-cream px-3 py-2 font-mono text-sm"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="border border-brass/40 bg-ticket-cream px-3 py-2 font-mono text-sm">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
        <button type="submit" disabled={isPending}
          className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide px-4 disabled:opacity-50">
          Search
        </button>
      </form>

      <div className="space-y-2">
        {results.length === 0 && <p className="text-sage font-mono text-sm">No purchases found.</p>}
        {results.map((p) => {
          const raffle = Array.isArray(p.raffles) ? p.raffles[0] : p.raffles
          return (
            <div key={p.id} className="border border-brass/20 p-3 flex items-center justify-between flex-wrap gap-2 text-sm">
              <div>
                <p className="font-medium">{p.buyer_name} <span className="text-sage">({p.buyer_email})</span></p>
                <p className="text-sage font-mono text-xs">
                  {raffle?.title} · {p.ticket_count} ticket{p.ticket_count > 1 ? 's' : ''} · ${p.amount_paid.toFixed(2)} · {p.payment_method}
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-wide px-2 py-1 border border-brass/40">
                {p.payment_status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}