// features/payments/manual/components/mark-paid-button.tsx
'use client'

import { useTransition } from 'react'
import { markAsPaid } from '@/features/purchases/actions/mark-as-paid'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export function MarkPaidButton({ purchaseId }: { purchaseId: string }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      const result = await markAsPaid(purchaseId)
      if (!result.ok) {
        toast({ title: 'Something went wrong', description: result.error, variant: 'destructive' })
        return
      }
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="w-full border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm tracking-wide uppercase py-3 disabled:opacity-50 hover:bg-charcoal transition-colors"
    >
      {isPending ? 'Submitting…' : "I've Paid"}
    </button>
  )
}