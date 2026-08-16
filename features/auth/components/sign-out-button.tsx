// features/auth/components/sign-out-button.tsx
'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button onClick={handleSignOut}
      className="border-2 border-brass font-mono text-sm uppercase tracking-wide py-2 px-4 hover:bg-brass hover:text-charcoal transition-colors">
      Sign Out
    </button>
  )
}