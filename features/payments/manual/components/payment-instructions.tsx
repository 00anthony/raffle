// features/payments/manual/components/payment-instructions.tsx
import { MANUAL_METHOD_COPY, type ManualMethod } from '../lib/method-copy'
import { MarkPaidButton } from './mark-paid-button'

export function PaymentInstructions({
  purchaseId, method, account, referenceLabel, amountPaid,
}: {
  purchaseId: string
  method: ManualMethod
  account: string | null
  referenceLabel: string
  amountPaid: number
}) {
  const copy = MANUAL_METHOD_COPY[method]

  if (!account) {
    return (
      <div className="border border-ember/60 p-6 text-center">
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Method Unavailable</p>
        <p className="mt-2 text-sage text-sm">
          This raffle hasn't configured {copy.label} yet. Please contact the organizer or choose a different payment method.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-brass/40 bg-ticket-cream p-6 text-center space-y-4">
      <p className="font-mono text-xs uppercase tracking-wide text-sage">{copy.label} — ${amountPaid.toFixed(2)}</p>
      <div>
        <p className="text-sage text-sm">{copy.instruction}</p>
        <p className="font-display text-2xl mt-1">{account}</p>
      </div>
      <div>
        <p className="text-sage text-sm">Reference / note</p>
        <p className="font-mono text-lg mt-1">{referenceLabel}</p>
      </div>
      <p className="text-xs text-sage/80 leading-relaxed">
        Once you've sent payment, tap the button below. Your tickets will be issued after
        an organizer confirms the payment was received — you'll get a confirmation email.
      </p>
      <MarkPaidButton purchaseId={purchaseId} />
    </div>
  )
}