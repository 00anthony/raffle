import Image from 'next/image'
import { PerforatedDivider } from './perforated-divider'
import type { Prize } from '@/types/prize'

export function PrizeShowcase({ prizes }: { prizes: Prize[] }) {
  if (!prizes.length) return null
  return (
    <section className="bg-ink-green text-ticket-cream py-16 px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl mb-2">Prizes</h2>
        <PerforatedDivider />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="bg-ticket-cream text-charcoal flex flex-col overflow-hidden border border-brass/30"
            >
              {prize.image_url && (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={prize.image_url}
                    alt={prize.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col gap-1 flex-1">
                <h3 className="font-display text-xl leading-tight">{prize.title}</h3>
                {prize.description && (
                  <p className="text-charcoal/80 text-sm leading-relaxed flex-1">{prize.description}</p>
                )}
                {prize.estimated_value != null && (
                  <p className="font-mono text-xs text-sage uppercase tracking-wide mt-2">
                    Est. value ${prize.estimated_value.toFixed(0)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
