// features/admin-dashboard/components/raffle-selector.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type RaffleOption = { id: string; title: string; status: string }

export function RaffleSelector({ raffles }: { raffles: RaffleOption[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('raffle') ?? 'all'

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') params.delete('raffle')
    else params.set('raffle', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select value={current} onChange={(e) => handleChange(e.target.value)}
      className="border border-brass/40 bg-ticket-cream px-3 py-2 font-mono text-sm">
      <option value="all">All Raffles</option>
      {raffles.map((r) => (
        <option key={r.id} value={r.id}>{r.title} ({r.status})</option>
      ))}
    </select>
  )
}