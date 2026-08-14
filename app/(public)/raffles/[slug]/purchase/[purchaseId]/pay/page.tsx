// app/(public)/raffles/[slug]/purchase/[purchaseId]/pay/page.tsx
import { redirect, notFound } from 'next/navigation'
import { signConfirmationToken } from '@/lib/tokens/confirmation-token'
import { createAdminClient } from '@/lib/supabase/admin'
import { StripeRedirect } from '@/features/payments/stripe/components/stripe-redirect'
import { PaymentPendingPoller } from '@/features/payments/stripe/components/payment-pending-poller'
import { PaymentInstructions } from '@/features/payments/manual/components/payment-instructions'
import type { ManualMethod } from '@/features/payments/manual/lib/method-copy'

export default async function PayPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string; purchaseId: string }>
  searchParams: Promise<{ stripe?: string }>
}) {
  const { purchaseId, slug } = await params
  const { stripe: stripeStatus } = await searchParams
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('id, payment_method, payment_status, ticket_count, amount_paid')
    .eq('id', purchaseId)
    .maybeSingle()

  if (!purchase) notFound()

  if (purchase.payment_method === 'stripe' && purchase.payment_status === 'pending' && !stripeStatus) {
    return <StripeRedirect purchaseId={purchase.id} />
  }

  if (stripeStatus === 'cancelled') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Payment Cancelled</p>
        <p className="mt-4 mb-6 text-sage text-sm">No charge was made. You can try again whenever you're ready.</p>
        <StripeRedirect purchaseId={purchase.id} autoStart={false} buttonLabel="Try Again" />
      </main>
    )
  }

  if (purchase.payment_method !== 'stripe' && purchase.payment_method !== 'cash') {
    if (purchase.payment_status === 'pending') {
      const { data: full } = await admin
        .from('purchases')
        .select('buyer_name, raffle_id')
        .eq('id', purchase.id)
        .single()

      const { data: raffle } = await admin
        .from('raffles')
        .select('payment_accounts')
        .eq('id', full!.raffle_id)
        .single()

      const method = purchase.payment_method as ManualMethod
      const account = (raffle?.payment_accounts as Record<string, string> | null)?.[method] ?? null

      return (
        <main className="max-w-md mx-auto py-16 px-6">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-wide text-sage">Complete Your Payment</p>
          </div>
          <PaymentInstructions
            purchaseId={purchase.id}
            method={method}
            account={account}
            referenceLabel={full!.buyer_name}
            amountPaid={purchase.amount_paid}
          />
        </main>
      )
    }

    if (purchase.payment_status === 'pending_verification') {
      return (
        <main className="max-w-md mx-auto py-16 px-6 text-center">
          <p className="font-mono text-sm text-sage uppercase tracking-wide">Payment Submitted</p>
          <p className="mt-4 text-sage text-sm">
            Thanks! An organizer will verify your payment and email you a confirmation with your ticket numbers shortly.
          </p>
        </main>
      )
    }
  }

  if (purchase.payment_status === 'approved') {
    const token = signConfirmationToken(purchase.id)
    redirect(`/raffles/${slug}/confirmation/${purchase.id}?t=${token}`)
  }

  // Bounded polling instead of infinite meta-refresh.
  if (purchase.payment_status === 'pending') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <PaymentPendingPoller purchaseId={purchase.id} />
      </main>
    )
  }

  // Fallback — shouldn't normally be reached, but keeps every status covered.
  return (
    <main className="max-w-md mx-auto py-16 px-6 text-center">
      <p className="font-mono text-sm text-ember uppercase tracking-wide">Something Went Wrong</p>
      <p className="mt-4 text-sage text-sm">Please contact the organizer with your purchase ID.</p>
    </main>
  )
}