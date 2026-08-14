// features/purchases/actions/reject-purchase.ts
'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/server/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function rejectPurchase(purchaseId: string) {
  await requireAdmin()
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
    .update({ payment_status: 'rejected' })
    .eq('id', purchaseId)

  if (error) return { ok: false as const, error: 'Could not reject this purchase.' }

  revalidatePath('/admin/purchases')
  return { ok: true as const }
}