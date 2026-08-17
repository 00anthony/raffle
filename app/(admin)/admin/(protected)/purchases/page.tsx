// app/(admin)/admin/purchases/page.tsx  (extended from Phase 6)
import { getPendingVerificationPurchases } from '@/features/purchases/queries/get-pending-verification-purchase'
import { searchPurchases } from '@/features/purchases/queries/search-purchases'
import { PendingVerificationList } from '@/features/purchases/components/pending-verification-list'
import { PurchaseSearch } from '@/features/purchases/components/purchase-search'

export default async function AdminPurchasesPage() {
  const [pending, recent] = await Promise.all([
    getPendingVerificationPurchases(),
    searchPurchases({}),
  ])

  return (
    <main className="p-8 space-y-10">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Pending Verification</h1>
        <p className="text-sage text-sm mt-1 mb-4 font-mono">Manual payments waiting for confirmation.</p>
        <PendingVerificationList purchases={pending} />
      </div>
      <div>
        <h2 className="font-display text-2xl text-charcoal">Search Purchases</h2>
        <p className="text-sage text-sm mt-1 mb-4 font-mono">Search by name, email, or ticket number (e.g. FFD26-000124).</p>
        <PurchaseSearch initialResults={recent} />
      </div>
    </main>
  )
}