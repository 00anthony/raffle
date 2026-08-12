'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { purchaseFormSchema } from '../schema'

type CreatePurchaseInput = {
  raffleId: string
  ticketCount: number
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  paymentMethod: 'stripe' | 'cashapp' | 'venmo' | 'zelle'
}

export async function createPurchase(input: CreatePurchaseInput) {
  const parsed = purchaseFormSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false as const, error: 'Please check the form for errors.' }
  }

  const supabase = await createClient()
  const { data: raffle } = await supabase
    .from('raffles')
    .select('id, status, ticket_price, end_date, slug')
    .eq('id', input.raffleId)
    .maybeSingle()

  if (!raffle) return { ok: false as const, error: 'Raffle not found.' }
  if (raffle.status !== 'active') {
    return { ok: false as const, error: 'This raffle is not currently accepting purchases.' }
  }
  if (raffle.end_date && new Date(raffle.end_date) < new Date()) {
    return { ok: false as const, error: 'Ticket sales have closed for this raffle.' }
  }

  const amountPaid = Number((raffle.ticket_price * parsed.data.ticketCount).toFixed(2))

  const admin = createAdminClient()
  const { data: purchase, error: insertError } = await admin
    .from('purchases')
    .insert({
      raffle_id: raffle.id,
      buyer_name: parsed.data.buyerName,
      buyer_email: parsed.data.buyerEmail,
      buyer_phone: parsed.data.buyerPhone || null,
      payment_method: parsed.data.paymentMethod,
      payment_status: 'pending',
      ticket_count: parsed.data.ticketCount,
      amount_paid: amountPaid,
    })
    .select('id')
    .single()

  if (insertError || !purchase) {
    return { ok: false as const, error: 'Could not create your purchase. Please try again.' }
  }

  redirect(`/raffles/${raffle.slug}/purchase/${purchase.id}/pay`)
}
