// app/(admin)/admin/draw/[raffleId]/page.tsx
import { notFound } from 'next/navigation'
import { getRaffleById } from '@/features/raffles/queries/get-raffle-by-id'
import { getPrizesByRaffle } from '@/features/raffles/queries/get-prizes-by-raffle'
import { getDrawsForRaffle } from '@/features/draw/queries/get-draws-for-raffle'
import { DrawButton } from '@/features/draw/components/draw-button'
import { LocalDateTime } from '@/components/shared/local-datetime'

export default async function AdminDrawPage({ params }: { params: Promise<{ raffleId: string }> }) {
  const { raffleId } = await params
  const raffle = await getRaffleById(raffleId)
  if (!raffle) notFound()

  const [prizes, draws] = await Promise.all([getPrizesByRaffle(raffleId), getDrawsForRaffle(raffleId)])
  const generalDraw = draws.find((d) => !d.prizeId)

  return (
    <main className="p-8 bg-ink-green min-h-screen text-ticket-cream -m-8">
      <div className="p-8">
        <h1 className="font-display text-3xl">{raffle.title} — Live Draw</h1>
        <p className="text-sage font-mono text-sm mt-1">
          Drawing date: {new Date(raffle.drawing_date).toLocaleString()}
        </p>

        <div className="mt-10 space-y-6 max-w-md">
          {prizes.length === 0 ? (
            generalDraw ? (
              <WinnerSummary ticketDisplayId={generalDraw.ticketDisplayId} drawnAt={generalDraw.drawnAt} />
            ) : (
              <DrawButton raffleId={raffleId} prizeId={null} />
            )
          ) : (
            prizes.map((prize) => {
              const existing = draws.find((d) => d.prizeId === prize.id)
              return (
                <div key={prize.id} className="border border-brass/40 p-4">
                  <p className="font-display text-xl">{prize.title}</p>
                  {existing ? (
                    <WinnerSummary ticketDisplayId={existing.ticketDisplayId} drawnAt={existing.drawnAt} />
                  ) : (
                    <div className="mt-3"><DrawButton raffleId={raffleId} prizeId={prize.id} prizeTitle={prize.title} /></div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}

function WinnerSummary({ ticketDisplayId, drawnAt }: { ticketDisplayId: string; drawnAt: string }) {
  return (
    <p className="font-mono text-sm text-brass mt-2">
      Winner: {ticketDisplayId} · drawn <LocalDateTime iso={drawnAt} options={{ dateStyle: 'medium', timeStyle: 'short' }} />
    </p>
  )
}