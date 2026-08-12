import { PerforatedDivider } from './perforated-divider'
import { TicketStubCta } from './ticket-stub-cta'
import type { Raffle } from '@/types/raffle'

export function RaffleHero({ raffle }: { raffle: Raffle }) {
  return (
    <section className="bg-ink-green text-ticket-cream">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_360px] min-h-[520px]">
        <div className="flex flex-col justify-center gap-6 px-8 py-16 md:py-0">
          <p className="font-mono text-sm tracking-[0.2em] text-brass uppercase">
            {raffle.status === 'active' ? 'Now Selling' : raffle.status}
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">
            {raffle.title}
          </h1>
          {raffle.description && (
            <p className="text-sage max-w-md text-lg leading-relaxed">
              {raffle.description}
            </p>
          )}
          <dl className="flex gap-8 pt-2 font-mono text-sm">
            <div>
              <dt className="text-sage">Drawing</dt>
              <dd className="text-ticket-cream">
                {new Date(raffle.drawing_date).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </div>

        <div className="hidden md:block">
          <PerforatedDivider orientation="vertical" />
        </div>
        <div className="md:hidden px-8">
          <PerforatedDivider orientation="horizontal" />
        </div>

        <TicketStubCta raffle={raffle} />
      </div>
    </section>
  )
}
