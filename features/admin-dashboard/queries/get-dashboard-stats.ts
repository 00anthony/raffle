// features/admin-dashboard/queries/get-dashboard-stats.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function getDashboardStats(raffleId: string | null) {
  const admin = createAdminClient()

  const scopeTickets = admin.from('tickets').select('id', { count: 'exact', head: true })
  const scopePurchasesApproved = admin.from('purchases').select('amount_paid').eq('payment_status', 'approved')
  const scopePending = admin.from('purchases').select('id', { count: 'exact', head: true }).in('payment_status', ['pending', 'pending_verification'])
  const scopeApprovedCount = admin.from('purchases').select('id', { count: 'exact', head: true }).eq('payment_status', 'approved')

  const [ticketsQ, revenueQ, pendingQ, approvedQ] = await Promise.all([
    raffleId ? scopeTickets.eq('raffle_id', raffleId) : scopeTickets,
    raffleId ? scopePurchasesApproved.eq('raffle_id', raffleId) : scopePurchasesApproved,
    raffleId ? scopePending.eq('raffle_id', raffleId) : scopePending,
    raffleId ? scopeApprovedCount.eq('raffle_id', raffleId) : scopeApprovedCount,
  ])

  const revenue = (revenueQ.data ?? []).reduce((sum, p) => sum + Number(p.amount_paid), 0)

  return {
    ticketsSold: ticketsQ.count ?? 0,
    revenue,
    pendingPayments: pendingQ.count ?? 0,
    approvedPayments: approvedQ.count ?? 0,
  }
}