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

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/admin/login')

  return { user, role: profile.role as 'admin' | 'superadmin' }
}