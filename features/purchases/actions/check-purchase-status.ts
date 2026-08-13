// features/purchases/actions/check-purchase-status.ts
'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function checkPurchaseStatus(purchaseId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('purchases')
    .select('payment_status')
    .eq('id', purchaseId)
    .maybeSingle()

  return data?.payment_status ?? null
}