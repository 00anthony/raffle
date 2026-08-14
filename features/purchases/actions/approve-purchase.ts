// features/purchases/actions/approve-purchase.ts
'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/server/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTicketsForPurchase } from '@/features/tickets/lib/generate-tickets'
import { sendPurchaseConfirmationEmail } from '@/features/emails/send-purchase-confirmation'

export async function approvePurchase(purchaseId: string) {
  const { user } = await requireAdmin()
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('id, payment_status')
    .eq('id', purchaseId)
    .maybeSingle()

  if (!purchase) return { ok: false as const, error: 'Purchase not found.' }
  if (purchase.payment_status !== 'pending_verification') {
    return { ok: false as const, error: 'This purchase is not awaiting verification.' }
  }

  const { error } = await admin
    .from('purchases')
    .update({ payment_status: 'approved', approved_by: user.id, approved_at: new Date().toISOString() })
    .eq('id', purchaseId)

  if (error) return { ok: false as const, error: 'Could not approve this purchase.' }

  const tickets = await generateTicketsForPurchase(purchaseId)
  await sendPurchaseConfirmationEmail(purchaseId, tickets)

  revalidatePath('/admin/purchases')
  return { ok: true as const }
}