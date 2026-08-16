// server/auth/require-admin-api.ts
import { createClient } from '@/lib/supabase/server'

export async function requireAdminApi() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, response: new Response('Unauthorized', { status: 401 }) }

  const { data: profile } = await supabase.from('admin_profiles').select('role').eq('user_id', user.id).single()
  if (!profile) return { ok: false as const, response: new Response('Forbidden', { status: 403 }) }

  return { ok: true as const, user, role: profile.role as 'admin' | 'superadmin' }
}