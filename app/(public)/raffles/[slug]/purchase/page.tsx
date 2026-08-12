import { notFound } from 'next/navigation'
import { getRaffleBySlug } from '@/features/raffles/queries/get-raffle-by-slug'
import { PurchaseForm } from '@/features/purchases/components/purchase-form'

export default async function PurchasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raffle = await getRaffleBySlug(slug)
  if (!raffle || raffle.status !== 'active') notFound()

  return (
    <main className="bg-ticket-cream min-h-screen py-16 px-6">
      <div className="max-w-md mx-auto mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-sage">{raffle.title}</p>
        <h1 className="font-display text-3xl mt-1">Buy Tickets</h1>
      </div>
      <PurchaseForm raffleId={raffle.id} ticketPrice={raffle.ticket_price} />
    </main>
  )
}
