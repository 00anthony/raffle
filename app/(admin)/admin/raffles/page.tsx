// app/(admin)/admin/raffles/page.tsx
import Link from 'next/link'
import { getRafflesForAdmin } from '@/features/raffles/queries/get-raffles-for-admin'

export default async function AdminRafflesPage() {
  const raffles = await getRafflesForAdmin()
  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-charcoal">Raffles</h1>
        <Link href="/admin/raffles/new"
          className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-2 px-4">
          New Raffle
        </Link>
      </div>
      <div className="space-y-2">
        {raffles.map((r) => (
          <Link key={r.id} href={`/admin/raffles/${r.id}`}
            className="block border border-brass/30 p-4 hover:bg-ticket-cream/60 transition-colors">
            <p className="font-medium">{r.title}</p>
            <p className="text-sage font-mono text-xs">/{r.slug} · {r.status}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}