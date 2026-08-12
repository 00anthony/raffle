export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ink-green text-ticket-cream px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-3">Raffle Platform</p>
        <h1 className="font-display text-3xl mb-4">No raffle selected</h1>
        <p className="text-sage text-sm">
          Visit a specific raffle at <code className="font-mono">/raffles/[slug]</code>,
          e.g. <code className="font-mono">/raffles/fall-food-drive-2026</code>.
        </p>
      </div>
    </main>
  )
}
