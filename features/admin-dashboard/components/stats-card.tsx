// features/admin-dashboard/components/stats-cards.tsx
export function StatsCards({ stats }: { stats: { ticketsSold: number; revenue: number; pendingPayments: number; approvedPayments: number } }) {
  const cards = [
    { label: 'Tickets Sold', value: stats.ticketsSold },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}` },
    { label: 'Pending Payments', value: stats.pendingPayments },
    { label: 'Approved Payments', value: stats.approvedPayments },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="border border-brass/30 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-sage">{c.label}</p>
          <p className="font-display text-3xl mt-1 text-charcoal">{c.value}</p>
        </div>
      ))}
    </div>
  )
}