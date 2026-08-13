// app/(public)/raffles/[slug]/purchase/[purchaseId]/pay/page.tsx
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { StripeRedirect } from '@/features/payments/stripe/components/stripe-redirect'
import { PaymentPendingPoller } from '@/features/payments/stripe/components/payment-pending-poller'

export default async function PayPage({
  params, searchParams,
}: {
  params: Promise<{ purchaseId: string }>
  searchParams: Promise<{ stripe?: string }>
}) {
  const { purchaseId } = await params
  const { stripe: stripeStatus } = await searchParams
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('id, payment_method, payment_status, ticket_count, amount_paid')
    .eq('id', purchaseId)
    .maybeSingle()

  if (!purchase) notFound()

  // First visit for a fresh Stripe purchase — auto-redirect into Checkout.
  if (purchase.payment_method === 'stripe' && purchase.payment_status === 'pending' && !stripeStatus) {
    return <StripeRedirect purchaseId={purchase.id} />
  }

  // Cancelled — requires an explicit click, never auto-fires.
  if (stripeStatus === 'cancelled') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Payment Cancelled</p>
        <p className="mt-4 mb-6 text-sage text-sm">No charge was made. You can try again whenever you're ready.</p>
        <StripeRedirect purchaseId={purchase.id} autoStart={false} buttonLabel="Try Again" />
      </main>
    )
  }

  if (purchase.payment_method !== 'stripe' && purchase.payment_status === 'pending') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <p className="font-mono text-sm text-sage uppercase tracking-wide">Purchase Created</p>
        <p className="mt-2 text-lg">
          {purchase.ticket_count} ticket{purchase.ticket_count > 1 ? 's' : ''} — ${purchase.amount_paid.toFixed(2)}
        </p>
        <p className="mt-4 text-sage text-sm">Manual payment instructions are coming in Phase 6.</p>
      </main>
    )
  }

  // Bounded polling instead of infinite meta-refresh.
  if (purchase.payment_status === 'pending') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <PaymentPendingPoller purchaseId={purchase.id} />
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6 text-center">
      <p className="font-mono text-sm text-sage uppercase tracking-wide">Payment Confirmed</p>
      <p className="mt-4">Your confirmation page is coming in Phase 7.</p>
    </main>
  )
}