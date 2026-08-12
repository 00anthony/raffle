'use client'

import { useEffect, useState } from 'react'
import { createCheckoutSession } from '../actions/create-checkout-session'

export function StripeRedirect({ purchaseId, label = 'Redirecting to secure checkout…' }: { purchaseId: string; label?: string }) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createCheckoutSession(purchaseId).then((result) => {
      if (result.ok) {
        window.location.href = result.url
      } else {
        setError(result.error)
      }
    })
  }, [purchaseId])

  if (error) {
    return <p className="text-ember text-sm font-mono text-center py-16">{error}</p>
  }

  return <p className="text-sage text-sm font-mono text-center py-16 animate-pulse">{label}</p>
}
