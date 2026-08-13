// features/payments/stripe/components/stripe-redirect.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createCheckoutSession } from '../actions/create-checkout-session'

export function StripeRedirect({
  purchaseId,
  autoStart = true,
  label = 'Redirecting to secure checkout…',
  buttonLabel = 'Try Again',
}: {
  purchaseId: string
  autoStart?: boolean
  label?: string
  buttonLabel?: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(autoStart)

  const startCheckout = useCallback(() => {
    setLoading(true)
    setError(null)
    createCheckoutSession(purchaseId).then((result) => {
      if (result.ok) {
        window.location.href = result.url
      } else {
        setLoading(false)
        setError(result.error)
      }
    })
  }, [purchaseId])

  useEffect(() => {
    if (autoStart) startCheckout()
    // Only ever auto-runs on the initial mount for the auto-redirect case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div>
        <p className="text-ember text-sm font-mono">{error}</p>
        <button type="button" onClick={startCheckout}
          className="mt-4 border-2 border-charcoal font-mono text-sm uppercase tracking-wide py-2 px-4 hover:bg-charcoal hover:text-ticket-cream transition-colors">
          {buttonLabel}
        </button>
      </div>
    )
  }

  if (loading) {
    return <p className="text-sage text-sm font-mono text-center py-4 animate-pulse">{label}</p>
  }

  return (
    <button type="button" onClick={startCheckout}
      className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm tracking-wide uppercase py-3 px-6 hover:bg-charcoal transition-colors">
      {buttonLabel}
    </button>
  )
}