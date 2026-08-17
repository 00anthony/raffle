// app/(admin)/admin/cash-sale/page.tsx  (replaces the earlier placeholder)
import { getRafflesForAdmin } from '@/features/raffles/queries/get-raffles-for-admin'
import { CashSaleForm } from '@/features/purchases/components/cash-sale-form'

export default async function CashSalePage() {
  const raffles = await getRafflesForAdmin()
  return (
    <main className="p-8">
      <h1 className="font-display text-3xl text-charcoal">New Cash Sale</h1>
      <p className="text-sage text-sm mt-1 mb-6 font-mono">
        For in-person payments. Tickets are issued immediately.
      </p>
      {raffles.length === 0 ? (
        <p className="text-sage font-mono text-sm">No raffles exist yet.</p>
      ) : (
        <CashSaleForm raffles={raffles} />
      )}
    </main>
  )
}