import { PerforatedDivider } from './perforated-divider'
import type { RaffleRule } from '@/types/raffle'

export function RulesSection({ rules }: { rules: RaffleRule[] }) {
  if (!rules.length) return null
  return (
    <section className="bg-ticket-cream text-charcoal py-16 px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl mb-2">How It Works</h2>
        <PerforatedDivider />
        <ul className="mt-8 space-y-5">
          {rules.map((rule, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-mono text-brass shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div>
                {rule.title && (
                  <p className="font-mono text-xs uppercase tracking-wide text-sage mb-1">{rule.title}</p>
                )}
                <p className="text-charcoal/90 leading-relaxed">{rule.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
