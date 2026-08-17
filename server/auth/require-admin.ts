// server/auth/requre-admin.ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/admin/login') // authenticated but not an admin

  return { user, role: profile.role as 'admin' | 'superadmin' }
}
