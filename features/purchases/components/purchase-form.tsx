'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { purchaseFormSchema, type PurchaseFormValues } from '../schema'
import { createPurchase } from '../actions/create-purchase'
import { TicketSelector } from './ticket-selector'
import { PaymentMethodPicker } from './payment-method-picker'
import { useToast } from '@/hooks/use-toast'

export function PurchaseForm({ raffleId, ticketPrice }: { raffleId: string; ticketPrice: number }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: { ticketCount: 1, buyerName: '', buyerEmail: '', buyerPhone: '', paymentMethod: 'stripe' },
  })

  const ticketCount = form.watch('ticketCount')

  function onSubmit(values: PurchaseFormValues) {
    startTransition(async () => {
      const result = await createPurchase({ raffleId, ...values })
      if (result && !result.ok) {
        toast({ title: 'Something went wrong', description: result.error, variant: 'destructive' })
      }
      // On success the action redirects server-side — nothing else to do here.
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md mx-auto">
      <TicketSelector
        value={ticketCount}
        onChange={(n) => form.setValue('ticketCount', n, { shouldValidate: true })}
        ticketPrice={ticketPrice}
      />

      <div className="space-y-4">
        <Field id="buyerName" label="Name" error={form.formState.errors.buyerName?.message}>
          <input id="buyerName" {...form.register('buyerName')} className={inputClass} />
        </Field>
        <Field id="buyerEmail" label="Email" error={form.formState.errors.buyerEmail?.message}>
          <input id="buyerEmail" type="email" {...form.register('buyerEmail')} className={inputClass} />
        </Field>
        <Field id="buyerPhone" label="Phone" optional>
          <input id="buyerPhone" type="tel" {...form.register('buyerPhone')} className={inputClass} />
        </Field>
      </div>

      <PaymentMethodPicker
        value={form.watch('paymentMethod')}
        onChange={(m) => form.setValue('paymentMethod', m, { shouldValidate: true })}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm tracking-wide uppercase py-3 disabled:opacity-50 hover:bg-charcoal transition-colors"
      >
        {isPending ? 'Processing…' : `Continue — $${(ticketCount * ticketPrice).toFixed(2)}`}
      </button>
    </form>
  )
}

const inputClass =
  'w-full border border-brass/40 bg-ticket-cream px-3 py-2 text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass'

function Field({
  id, label, optional, error, children,
}: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-mono uppercase tracking-wide text-sage mb-1">
        {label} {optional && <span className="text-sage/60 normal-case">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-ember text-xs mt-1">{error}</p>}
    </div>
  )
}
