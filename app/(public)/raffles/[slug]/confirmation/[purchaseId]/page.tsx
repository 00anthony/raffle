// app/(public)/raffles/[slug]/confirmation/[purchaseId]/page.tsx
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyConfirmationToken } from '@/lib/tokens/confirmation-token'
import { PerforatedDivider } from '@/features/raffles/components/perforated-divider'

export default async function ConfirmationPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string; purchaseId: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { purchaseId, slug } = await params
  const { t } = await searchParams

  if (!t || !verifyConfirmationToken(purchaseId, t)) {
    return (
      <main className="max-w-md mx-auto py-16 px-6 text-center">
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Link Invalid or Expired</p>
        <p className="mt-4 text-sage text-sm">
          This confirmation link is no longer valid. Check your email for the original
          confirmation, or contact the raffle organizer.
        </p>
      </main>
    )
  }

  const admin = createAdminClient()
  const { data: purchase } = await admin
    .from('purchases')
    .select('id, buyer_name, buyer_email, ticket_count, amount_paid, payment_status, raffle_id')
    .eq('id', purchaseId)
    .maybeSingle()

  // Generic 404, not a distinguishing error — never reveal whether a
  // purchase ID exists to a request that didn't already prove it via token.
  if (!purchase || purchase.payment_status !== 'approved') notFound()

  const { data: raffle } = await admin
    .from('raffles')
    .select('title, slug, drawing_date')
    .eq('id', purchase.raffle_id)
    .maybeSingle()

  if (!raffle || raffle.slug !== slug) notFound()

  const { data: tickets } = await admin
    .from('tickets')
    .select('display_id')
    .eq('purchase_id', purchase.id)
    .order('sequence_number', { ascending: true })

  return (
    <main className="bg-ticket-cream min-h-screen py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-sage">Confirmed</p>
        <h1 className="font-display text-3xl mt-1">Thank you, {purchase.buyer_name}!</h1>
        <p className="text-sage text-sm mt-2">
          You're entered in {raffle.title}. A copy of this confirmation was sent to {purchase.buyer_email}.
        </p>

        <div className="my-8"><PerforatedDivider /></div>

        <p className="font-mono text-xs uppercase tracking-wide text-sage mb-3">
          Your Ticket{purchase.ticket_count > 1 ? 's' : ''}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {tickets?.map((ticket) => (
            <span key={ticket.display_id} className="font-mono text-sm bg-charcoal text-ticket-cream px-3 py-1">
              {ticket.display_id}
            </span>
          ))}
        </div>

        <div className="my-8"><PerforatedDivider /></div>

        <dl className="font-mono text-sm inline-flex gap-10">
          <div>
            <dt className="text-sage">Drawing Date</dt>
            <dd>{new Date(raffle.drawing_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</dd>
          </div>
          <div>
            <dt className="text-sage">Amount Paid</dt>
            <dd>${purchase.amount_paid.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
    </main>
  )
}