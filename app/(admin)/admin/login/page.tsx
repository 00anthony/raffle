export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ink-green text-ticket-cream px-6">
      <div className="text-center max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-3">Admin</p>
        <h1 className="font-display text-3xl mb-4">Login</h1>
        <p className="text-sage text-sm">
          Supabase Auth login form arrives in Phase 8 (Admin Dashboard).
          This placeholder exists so <code className="font-mono">middleware.ts</code> has
          a real route to redirect unauthenticated admin requests to.
        </p>
      </div>
    </main>
  )
}
