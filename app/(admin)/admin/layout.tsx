// app/(admin)/admin/layout.tsx  (replaces the Phase 5 placeholder)
import Link from 'next/link'
import { requireAdmin } from '@/server/auth/require-admin'
import { SignOutButton } from '@/features/auth/components/sign-out-button'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/purchases', label: 'Purchases' },
  { href: '/admin/cash-sale', label: 'Cash Sale' },
  { href: '/admin/raffles', label: 'Raffles' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="min-h-screen bg-ticket-cream flex">
      <nav className="w-56 shrink-0 bg-charcoal text-ticket-cream p-6 space-y-1 flex flex-col">
        <p className="font-mono text-xs uppercase tracking-wide text-brass mb-4">Admin</p>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href}
            className="block font-mono text-sm py-2 px-3 hover:bg-ink-green transition-colors">
            {link.label}
          </Link>
        ))}
        <div className="mt-auto pt-4"><SignOutButton /></div>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  )
}