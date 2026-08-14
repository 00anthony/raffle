// features/purchases/components/pending-verification-list.tsx
'use client'

import { useTransition } from 'react'
import { approvePurchase } from '../actions/approve-purchase'
import { rejectPurchase } from '../actions/reject-purchase'
import { useToast } from '@/hooks/use-toast'

type PendingPurchase = {
  id: string
  buyer_name: string
  buyer_email: string
  payment_method: string
  payment_reference: string | null
  ticket_count: number
  amount_paid: number
  created_at: string
  raffles: { title: string; slug: string } | { title: string; slug: string }[]
}

export function PendingVerificationList({ purchases }: { purchases: PendingPurchase[] }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleApprove(id: string) {
    startTransition(async () => {
      const result = await approvePurchase(id)
      if (!result.ok) toast({ title: 'Approval failed', description: result.error, variant: 'destructive' })
      else toast({ title: 'Purchase approved', description: 'Tickets have been generated.' })
    })
  }

  function handleReject(id: string) {
    startTransition(async () => {
      const result = await rejectPurchase(id)
      if (!result.ok) toast({ title: 'Rejection failed', description: result.error, variant: 'destructive' })
      else toast({ title: 'Purchase rejected' })
    })
  }

  if (!purchases.length) {
    return <p className="text-sage font-mono text-sm">No payments awaiting verification.</p>
  }

  return (
    <div className="space-y-3">
      {purchases.map((p) => {
        const raffle = Array.isArray(p.raffles) ? p.raffles[0] : p.raffles
        return (
          <div key={p.id} className="border border-brass/30 p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium">{p.buyer_name} <span className="text-sage text-sm">({p.buyer_email})</span></p>
              <p className="text-sm text-sage font-mono">
                {raffle?.title} · {p.ticket_count} ticket{p.ticket_count > 1 ? 's' : ''} · ${p.amount_paid.toFixed(2)} · {p.payment_method}
              </p>
              {p.payment_reference && (
                <p className="text-xs text-sage/80 font-mono">ref: {p.payment_reference}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleReject(p.id)} disabled={isPending}
                className="border border-ember text-ember font-mono text-xs uppercase tracking-wide py-2 px-3 disabled:opacity-50 hover:bg-ember hover:text-ticket-cream transition-colors">
                Reject
              </button>
              <button onClick={() => handleApprove(p.id)} disabled={isPending}
                className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-xs uppercase tracking-wide py-2 px-3 disabled:opacity-50 hover:bg-charcoal transition-colors">
                Approve
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}