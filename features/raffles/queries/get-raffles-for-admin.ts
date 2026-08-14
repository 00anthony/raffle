// features/raffles/queries/get-raffles-for-admin.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function getRafflesForAdmin() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('raffles')
    .select('id, title, slug, status')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data
}