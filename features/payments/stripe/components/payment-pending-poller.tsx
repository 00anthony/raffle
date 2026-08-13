// features/payments/stripe/components/payment-pending-poller.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkPurchaseStatus } from '@/features/purchases/actions/check-purchase-status'

const POLL_INTERVAL_MS = 3000
const MAX_ATTEMPTS = 15 // ~45 seconds before we stop auto-polling

export function PaymentPendingPoller({ purchaseId }: { purchaseId: string }) {
  const [attempts, setAttempts] = useState(0)
  const [checking, setChecking] = useState(false)
  const router = useRouter()
  const stoppedRef = useRef(false)

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS || stoppedRef.current) return

    const timer = setTimeout(async () => {
      setChecking(true)
      const status = await checkPurchaseStatus(purchaseId)
      setChecking(false)
      if (status === 'approved') {
        stoppedRef.current = true
        router.refresh() // re-runs the server component, which now sees 'approved'
        return
      }
      setAttempts((n) => n + 1)
    }, POLL_INTERVAL_MS)

    return () => clearTimeout(timer)
  }, [attempts, purchaseId, router])

  if (attempts >= MAX_ATTEMPTS) {
    return (
      <div>
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Still Processing</p>
        <p className="mt-4 text-sage text-sm">
          This is taking longer than expected. Your payment may still be completing —
          you don't need to try purchasing again. Check back in a minute, or refresh manually.
        </p>
        <button
          type="button"
          onClick={() => { setAttempts(0); stoppedRef.current = false }}
          className="mt-6 border-2 border-charcoal font-mono text-sm uppercase tracking-wide py-2 px-4 hover:bg-charcoal hover:text-ticket-cream transition-colors"
        >
          Check Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="font-mono text-sm text-sage uppercase tracking-wide">Confirming Payment…</p>
      <p className="mt-4 text-sage text-sm">{checking ? 'Checking…' : 'This usually takes just a few seconds.'}</p>
    </div>
  )
}