// app/api/admin/export-purchases/route.ts
import { requireAdminApi } from '@/server/auth/require-admin-api'
import { createAdminClient } from '@/lib/supabase/admin'

function escapeCsvField(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(req: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const { searchParams } = new URL(req.url)
  const raffleId = searchParams.get('raffleId')
  if (!raffleId) return new Response('Missing raffleId', { status: 400 })

  const admin = createAdminClient()
  const { data: purchases, error } = await admin
    .from('purchases')
    .select('id, buyer_name, buyer_email, ticket_count, payment_method, payment_status, amount_paid, created_at, tickets(display_id)')
    .eq('raffle_id', raffleId)
    .order('created_at', { ascending: true })

  if (error || !purchases) return new Response('Failed to fetch purchases', { status: 500 })

  const header = ['Purchase ID', 'Name', 'Email', 'Ticket Count', 'Ticket Numbers', 'Payment Method', 'Payment Status', 'Amount', 'Timestamp']
  const rows = purchases.map((p) => {
    const ticketIds = (p.tickets as { display_id: string }[]).map((t) => t.display_id).join(' | ')
    return [p.id, p.buyer_name, p.buyer_email, p.ticket_count, ticketIds, p.payment_method, p.payment_status, p.amount_paid, p.created_at]
      .map(escapeCsvField)
      .join(',')
  })

  const csv = [header.join(','), ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="purchases-${raffleId}.csv"`,
    },
  })
}