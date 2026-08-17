// app/(admin)/admin/page.tsx  (replaces the Phase 5 placeholder)
import { getDashboardStats } from '@/features/admin-dashboard/queries/get-dashboard-stats'
import { getRafflesForAdmin } from '@/features/raffles/queries/get-raffles-for-admin'
import { StatsCards } from '@/features/admin-dashboard/components/stats-card'
import { RaffleSelector } from '@/features/admin-dashboard/components/raffle-selector'

export default async function AdminDashboardPage({
  searchParams,
}: { searchParams: Promise<{ raffle?: string }> }) {
  const { raffle: raffleId } = await searchParams
  const [stats, raffles] = await Promise.all([
    getDashboardStats(raffleId ?? null),
    getRafflesForAdmin(),
  ])

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-charcoal">Dashboard</h1>
        <RaffleSelector raffles={raffles} />
      </div>
      <StatsCards stats={stats} />
    </main>
  )
}