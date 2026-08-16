// app/(admin)/admin/login/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLoginForm } from '@/features/auth/components/admin-login-form'
import { SignOutButton } from '@/features/auth/components/sign-out-button'

export default async function AdminLoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profile) redirect('/admin')

    // Authenticated but not an admin — without this branch, requireAdmin()
    // would just bounce them back here forever with no explanation.
    return (
      <main className="min-h-screen flex items-center justify-center bg-ink-green text-ticket-cream px-6">
        <div className="text-center max-w-sm">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember mb-3">Access Denied</p>
          <h1 className="font-display text-3xl mb-4">Not an Admin</h1>
          <p className="text-sage text-sm mb-6">
            You're signed in as {user.email}, but this account doesn't have admin access.
          </p>
          <SignOutButton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink-green text-ticket-cream px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-3 text-center">Admin</p>
        <h1 className="font-display text-3xl mb-6 text-center">Login</h1>
        <AdminLoginForm />
      </div>
    </main>
  )
}