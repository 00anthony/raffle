// features/purchases/actions/create-cash-sale.ts
'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/server/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTicketsForPurchase } from '@/features/tickets/lib/generate-tickets'
import { sendPurchaseConfirmationEmail } from '@/features/emails/send-purchase-confirmation'
import { cashSaleSchema } from '../schema'

export async function createCashSale(input: {
  raffleId: string
  buyerName: string
  buyerEmail: string
  ticketCount: number
}) {
  const { user } = await requireAdmin()

  const parsed = cashSaleSchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, error: 'Please check the form for errors.' }

  const admin = createAdminClient()
  const { data: raffle } = await admin
    .from('raffles')
    .select('id, ticket_price')
    .eq('id', parsed.data.raffleId)
    .maybeSingle()

  if (!raffle) return { ok: false as const, error: 'Raffle not found.' }

  const amountPaid = Number((raffle.ticket_price * parsed.data.ticketCount).toFixed(2))

  // Cash sales are recorded already-paid — the cash changed hands in person
  // before the admin opens this form, unlike Stripe/manual where payment
  // happens after the purchase row exists.
  const { data: purchase, error } = await admin
    .from('purchases')
    .insert({
      raffle_id: raffle.id,
      buyer_name: parsed.data.buyerName,
      buyer_email: parsed.data.buyerEmail,
      payment_method: 'cash',
      payment_status: 'approved',
      ticket_count: parsed.data.ticketCount,
      amount_paid: amountPaid,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error || !purchase) return { ok: false as const, error: 'Could not record this sale.' }

  const tickets = await generateTicketsForPurchase(purchase.id)
  await sendPurchaseConfirmationEmail(purchase.id, tickets)

  revalidatePath('/admin/cash-sale')
  return { ok: true as const, ticketCount: tickets.length }
}