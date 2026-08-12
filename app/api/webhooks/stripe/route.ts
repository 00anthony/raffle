import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTicketsForPurchase } from '@/features/tickets/lib/generate-tickets'
import { sendPurchaseConfirmationEmail } from '@/features/emails/send-purchase-confirmation'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const admin = createAdminClient()

  // Idempotency layer 1: hard dedupe on Stripe's event.id.
  const { error: insertError } = await admin
    .from('webhook_events')
    .insert({ provider: 'stripe', event_id: event.id })

  if (insertError) {
    // Unique constraint violation means we've already processed this event.
    // Return 200 so Stripe stops retrying — this is not a failure.
    return new Response('Already processed', { status: 200 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const purchaseId = session.metadata?.purchase_id

    if (!purchaseId) {
      console.error('Stripe session completed with no purchase_id metadata', session.id)
      return new Response('Missing purchase_id metadata', { status: 400 })
    }

    const { data: purchase } = await admin
      .from('purchases')
      .select('id, payment_status')
      .eq('id', purchaseId)
      .maybeSingle()

    if (!purchase) {
      console.error('Webhook referenced unknown purchase', purchaseId)
      return new Response('Purchase not found', { status: 404 })
    }

    // Idempotency layer 2: never re-process an already-approved purchase.
    if (purchase.payment_status === 'approved') {
      return new Response('Already approved', { status: 200 })
    }

    await admin
      .from('purchases')
      .update({
        payment_status: 'approved',
        stripe_payment_intent_id: session.payment_intent as string,
        approved_at: new Date().toISOString(),
      })
      .eq('id', purchaseId)

    const tickets = await generateTicketsForPurchase(purchaseId)
    await sendPurchaseConfirmationEmail(purchaseId, tickets)
  }

  return new Response('OK', { status: 200 })
}
