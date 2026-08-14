// app/(admin)/admin/purchases/page.tsx
import { getPendingVerificationPurchases } from '../../../../features/purchases/queries/get-pending-verification-purchase'
import { PendingVerificationList } from '@/features/purchases/components/pending-verification-list'

export default async function AdminPurchasesPage() {
  const purchases = await getPendingVerificationPurchases()
  return (
    <main className="p-8">
      <h1 className="font-display text-3xl text-charcoal">Pending Verification</h1>
      <p className="text-sage text-sm mt-1 mb-6 font-mono">
        Manual payments (Cash App / Venmo / Zelle) waiting for confirmation.
      </p>
      <PendingVerificationList purchases={purchases} />
    </main>
  )
}