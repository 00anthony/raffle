// features/emails/send-purchase-confirmation.ts
import { resend } from '@/lib/resend/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { signConfirmationToken } from '@/lib/tokens/confirmation-token'
import { PurchaseConfirmationEmail } from '@/emails/purchase-confirmation'

export async function sendPurchaseConfirmationEmail(
  purchaseId: string,
  tickets: { id: string; display_id: string }[]
) {
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('buyer_name, buyer_email, amount_paid, raffle_id')
    .eq('id', purchaseId)
    .single()

  if (!purchase) {
    console.error(`sendPurchaseConfirmationEmail: purchase ${purchaseId} not found`)
    return
  }

  const { data: raffle } = await admin
    .from('raffles')
    .select('title, slug, drawing_date')
    .eq('id', purchase.raffle_id)
    .single()

  if (!raffle) {
    console.error(`sendPurchaseConfirmationEmail: raffle for purchase ${purchaseId} not found`)
    return
  }

  const token = signConfirmationToken(purchaseId)
  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/raffles/${raffle.slug}/confirmation/${purchaseId}?t=${token}`

  try {
    await resend.emails.send({
      from: process.env.RAFFLE_EMAIL_FROM!,
      to: purchase.buyer_email,
      subject: `Your tickets for ${raffle.title}`,
      react: PurchaseConfirmationEmail({
        buyerName: purchase.buyer_name,
        raffleTitle: raffle.title,
        drawingDate: new Date(raffle.drawing_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        ticketDisplayIds: tickets.map((t) => t.display_id),
        amountPaid: purchase.amount_paid,
        confirmationUrl,
      }),
    })
  } catch (err) {
    // Email delivery failure must never roll back an already-approved
    // purchase or already-generated tickets — those are already durably
    // committed. Log and move on; retry-on-failure is out of scope for v1.
    console.error(`Failed to send confirmation email for purchase ${purchaseId}`, err)
  }
}