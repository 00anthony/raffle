import Link from 'next/link'
import { CountdownTimer } from './countdown-timer'
import type { Raffle } from '@/types/raffle'

export function TicketStubCta({ raffle }: { raffle: Raffle }) {
  const isOpen = raffle.status === 'active'
  const countdownTarget = raffle.countdown_target === 'drawing_date' ? raffle.drawing_date : raffle.end_date

  return (
    <div className="bg-ticket-cream text-charcoal flex flex-col justify-center gap-5 px-8 py-12">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-sage uppercase">Per Ticket</p>
        <p className="font-display text-4xl">${raffle.ticket_price.toFixed(2)}</p>
      </div>

      {countdownTarget && <CountdownTimer targetDate={countdownTarget} />}

      <Link
        href={`/raffles/${raffle.slug}/purchase`}
        aria-disabled={!isOpen}
        className={
          isOpen
            ? 'inline-flex items-center justify-center rounded-none border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm tracking-wide uppercase py-3 px-6 transition-colors hover:bg-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass'
            : 'pointer-events-none inline-flex items-center justify-center rounded-none border-2 border-sage text-sage font-mono text-sm tracking-wide uppercase py-3 px-6'
        }
      >
        {isOpen ? 'Buy Tickets' : raffle.status === 'draft' ? 'Not Yet Open' : 'Sales Closed'}
      </Link>
    </div>
  )
}
