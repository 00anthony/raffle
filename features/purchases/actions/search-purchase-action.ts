// features/purchases/actions/search-purchases-action.ts
'use server'

import { requireAdmin } from '@/server/auth/require-admin'
import { searchPurchases } from '../queries/search-purchases'

export async function searchPurchasesAction(params: { query: string; status: string | null }) {
  await requireAdmin()
  return searchPurchases({ query: params.query || null, status: params.status })
}