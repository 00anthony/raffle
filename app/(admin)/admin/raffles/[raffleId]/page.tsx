// app/(admin)/admin/raffles/[raffleId]/page.tsx
import { notFound } from 'next/navigation'
import { getRaffleById } from '@/features/raffles/queries/get-raffle-by-id'
import { getTicketCountForRaffle } from '@/features/tickets/lib/get-ticket-count-for-raffle'
import { RaffleForm } from '@/features/raffles/components/raffle-form'

export default async function EditRafflePage({ params }: { params: Promise<{ raffleId: string }> }) {
  const { raffleId } = await params
  const raffle = await getRaffleById(raffleId)
  if (!raffle) notFound()

  const ticketCount = await getTicketCountForRaffle(raffleId)

  return (
    <main className="p-8">
      <h1 className="font-display text-3xl text-charcoal mb-6">{raffle.title}</h1>
      <RaffleForm raffle={raffle} ticketCount={ticketCount} />
      <div className="mt-8 pt-6 border-t border-brass/30">
        <a href={`/api/admin/export-purchases?raffleId=${raffle.id}`}
          className="font-mono text-xs uppercase tracking-wide border border-brass/40 px-4 py-2 inline-block">
          Export Purchases (CSV)
        </a>
        <a href={`/admin/draw/${raffle.id}`}
          className="font-mono text-xs uppercase tracking-wide border-2 border-charcoal bg-ember text-ticket-cream px-4 py-2 inline-block ml-3">
          Open Live Draw
        </a>
      </div>
    </main>
  )
}