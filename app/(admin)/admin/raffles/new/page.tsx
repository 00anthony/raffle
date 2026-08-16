// app/(admin)/admin/raffles/new/page.tsx
import { RaffleForm } from '@/features/raffles/components/raffle-form'

export default function NewRafflePage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-3xl text-charcoal mb-6">New Raffle</h1>
      <RaffleForm />
    </main>
  )
}