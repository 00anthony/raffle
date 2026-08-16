// features/auth/components/admin-login-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setLoading(false)
      setError('Invalid email or password.')
      return
    }

    // refresh() re-runs server components with the now-set session cookie
    // before navigating, so /admin's layout guard sees the session on its
    // very first render instead of racing it.
    router.refresh()
    router.push('/admin')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-brass/40 bg-ticket-cream text-charcoal px-3 py-2 font-mono text-sm" />
      </div>
      <div>
        <label className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-brass/40 bg-ticket-cream text-charcoal px-3 py-2 font-mono text-sm" />
      </div>
      {error && <p className="text-ember text-sm font-mono">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full border-2 border-brass bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-3 disabled:opacity-50 hover:bg-brass hover:text-charcoal transition-colors">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}