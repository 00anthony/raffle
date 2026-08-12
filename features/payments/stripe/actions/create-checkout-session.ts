'use server'

import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createCheckoutSession(purchaseId: string) {
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('id, raffle_id, ticket_count, amount_paid, payment_method, payment_status, stripe_session_id, buyer_email, raffles(title, slug)')
    .eq('id', purchaseId)
    .maybeSingle()

  if (!purchase) return { ok: false as const, error: 'Purchase not found.' }
  if (purchase.payment_method !== 'stripe') {
    return { ok: false as const, error: 'This purchase is not using card payment.' }
  }
  if (purchase.payment_status !== 'pending') {
    return { ok: false as const, error: 'This purchase has already been processed.' }
  }

  if (purchase.stripe_session_id) {
    const existing = await stripe.checkout.sessions.retrieve(purchase.stripe_session_id)
    if (existing.status === 'open' && existing.url) {
      return { ok: true as const, url: existing.url }
    }
  }

  const raffle = purchase.raffles as unknown as { title: string; slug: string }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round((purchase.amount_paid / purchase.ticket_count) * 100),
          product_data: { name: `${raffle.title} — Raffle Ticket` },
        },
        quantity: purchase.ticket_count,
      },
    ],
    customer_email: purchase.buyer_email,
    success_url: `${siteUrl}/raffles/${raffle.slug}/purchase/${purchase.id}/pay?stripe=success`,
    cancel_url: `${siteUrl}/raffles/${raffle.slug}/purchase/${purchase.id}/pay?stripe=cancelled`,
    metadata: { purchase_id: purchase.id },
  })

  await admin
    .from('purchases')
    .update({ stripe_session_id: session.id })
    .eq('id', purchase.id)

  return { ok: true as const, url: session.url! }
}
