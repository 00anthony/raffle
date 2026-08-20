// server/auth/requre-admin.ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// server/auth/require-admin.ts
export async function requireAdmin() {
  const supabase = await createClient()

  let user
  try {
    const result = await supabase.auth.getUser()
    user = result.data.user
  } catch (err) {
    console.error('requireAdmin: auth.getUser() failed', err)
    redirect('/admin/login')
  }
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('admin_profiles').select('role').eq('user_id', user.id).maybeSingle()

  if (profile) {
    return { user, role: profile.role as 'admin' | 'superadmin', isSuperadmin: true, raffleIds: null as string[] | null }
  }

  const { data: grants } = await supabase.from('raffle_admins').select('raffle_id').eq('user_id', user.id)
  if (!grants || grants.length === 0) redirect('/admin/login') // no access at all

  return { user, role: 'owner' as const, isSuperadmin: false, raffleIds: grants.map((g) => g.raffle_id) }
}