import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { StripeRedirect } from '@/features/payments/stripe/components/stripe-redirect'

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

  if (purchase.payment_method === 'stripe' && purchase.payment_status === 'pending' && !stripeStatus) {
    return <StripeRedirect purchaseId={purchase.id} />
  }

  if (stripeStatus === 'cancelled') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Payment Cancelled</p>
        <p className="mt-4 text-sage text-sm">You can try again whenever you're ready.</p>
        <div className="mt-6">
          <StripeRedirect purchaseId={purchase.id} label="Try again" />
        </div>
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
        <p className="mt-4 text-sage text-sm">
          Manual payment instructions are coming in Phase 6.
        </p>
      </main>
    )
  }

  if (purchase.payment_status === 'pending') {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <p className="font-mono text-sm text-sage uppercase tracking-wide">Confirming Payment…</p>
        <p className="mt-4 text-sage text-sm">This usually takes just a few seconds.</p>
        <meta httpEquiv="refresh" content="3" />
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
