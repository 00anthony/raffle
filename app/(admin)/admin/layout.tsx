import { requireAdmin } from '@/server/auth/require-admin'

// Phase 8 will flesh this out with real nav/shell. For now this just proves
// the requireAdmin() guard from Phase 2 runs ahead of every /admin/* page.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <div className="min-h-screen bg-ticket-cream">{children}</div>
}
