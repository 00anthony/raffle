// features/purchases/actions/mark-as-paid.ts
'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function markAsPaid(purchaseId: string) {
  const admin = createAdminClient()

  const { data: purchase } = await admin
    .from('purchases')
    .select('id, payment_method, payment_status, buyer_name')
    .eq('id', purchaseId)
    .maybeSingle()

  if (!purchase) return { ok: false as const, error: 'Purchase not found.' }
  if (purchase.payment_method === 'stripe' || purchase.payment_method === 'cash') {
    return { ok: false as const, error: 'This purchase does not use manual verification.' }
  }
  if (purchase.payment_status !== 'pending') {
    return { ok: false as const, error: 'This purchase has already been submitted or processed.' }
  }

  // Reference shown to the buyer was their own name — persist it as the
  // payment_reference an admin will match against the actual transaction.
  const { error } = await admin
    .from('purchases')
    .update({ payment_status: 'pending_verification', payment_reference: purchase.buyer_name })
    .eq('id', purchaseId)

  if (error) return { ok: false as const, error: 'Could not update your purchase. Please try again.' }
  return { ok: true as const }
}