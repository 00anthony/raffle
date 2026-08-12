import { PerforatedDivider } from './perforated-divider'
import type { Raffle } from '@/types/raffle'

export function RaffleFooter({ raffle }: { raffle: Raffle }) {
  const hasContact = raffle.contact_email || raffle.contact_phone
  return (
    <footer className="bg-charcoal text-sage px-8 py-12">
      <div className="mx-auto max-w-3xl">
        <PerforatedDivider />
        <div className="mt-8 grid gap-8 sm:grid-cols-2 text-sm">
          <div className="space-y-2">
            {raffle.organization_name && (
              <p className="font-mono uppercase tracking-wide text-brass text-xs">
                Hosted by {raffle.organization_name}
              </p>
            )}
            {raffle.event_location && (
              <p>Drawing held at {raffle.event_location}</p>
            )}
            {hasContact && (
              <p>
                Questions?{' '}
                {raffle.contact_email && (
                  <a href={`mailto:${raffle.contact_email}`} className="underline hover:text-ticket-cream">
                    {raffle.contact_email}
                  </a>
                )}
                {raffle.contact_email && raffle.contact_phone && ' · '}
                {raffle.contact_phone && <span>{raffle.contact_phone}</span>}
              </p>
            )}
          </div>
          {raffle.legal_disclaimer && (
            <p className="text-xs leading-relaxed text-sage/70">{raffle.legal_disclaimer}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
