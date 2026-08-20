// features/raffles/components/raffle-form.tsx
'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { raffleFormSchema, type RaffleFormValues } from '../schema'
import { createRaffle } from '../actions/create-raffle'
import { updateRaffle } from '../actions/update-raffle'
import { suggestTicketPrefix } from '../lib/suggest-ticket-prefix'
import { utcIsoToLocalInputValue } from '@/lib/datetime'
import { useToast } from '@/hooks/use-toast'
import type { Raffle } from '@/types/raffle'

const inputClass = 'w-full border border-brass/40 bg-ticket-cream px-3 py-2 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed'
const labelClass = 'block text-sm font-mono uppercase tracking-wide text-sage mb-1'

const EMPTY_VALUES: RaffleFormValues = {
  slug: '', title: '', description: '', ticketPrefix: '', ticketPrice: 10,
  status: 'draft', endDate: '', drawingDate: '', organizationName: '', eventLocation: '',
  contactEmail: '', contactPhone: '', legalDisclaimer: '',
  cashappAccount: '', venmoAccount: '', zelleAccount: '', rules: [],
}

// Normalizes DB nulls (Raffle) into the empty-string shape RaffleFormValues
// expects — this is the actual fix for the TS errors: rules[].title on
// Raffle is `string | null | undefined` (matches jsonb), but the Zod-inferred
// form type only allows `string | undefined`. null isn't assignable there,
// which is what broke defaultValues' inference (and cascaded into the
// handleSubmit error below it — same root cause, not two separate bugs).
function raffleToFormValues(raffle: Raffle): RaffleFormValues {
  return {
    slug: raffle.slug,
    title: raffle.title,
    description: raffle.description ?? '',
    ticketPrefix: raffle.ticket_prefix,
    ticketPrice: raffle.ticket_price,
    status: raffle.status,
    endDate: raffle.end_date ? utcIsoToLocalInputValue(raffle.end_date) : '',
    drawingDate: utcIsoToLocalInputValue(raffle.drawing_date),
    organizationName: raffle.organization_name ?? '',
    eventLocation: raffle.event_location ?? '',
    contactEmail: raffle.contact_email ?? '',
    contactPhone: raffle.contact_phone ?? '',
    legalDisclaimer: raffle.legal_disclaimer ?? '',
    cashappAccount: raffle.payment_accounts?.cashapp ?? '',
    venmoAccount: raffle.payment_accounts?.venmo ?? '',
    zelleAccount: raffle.payment_accounts?.zelle ?? '',
    rules: (raffle.rules ?? []).map((r) => ({ title: r.title ?? '', text: r.text })),
  }
}

export function RaffleForm({ raffle, ticketCount = 0 }: { raffle?: Raffle; ticketCount?: number }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const hasIssuedTickets = ticketCount > 0

  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleFormSchema),
    defaultValues: raffle ? raffleToFormValues(raffle) : EMPTY_VALUES,
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'rules' })

  function handleSlugBlur() {
    if (!raffle && !form.getValues('ticketPrefix')) {
      form.setValue('ticketPrefix', suggestTicketPrefix(form.getValues('slug')))
    }
  }

  function onSubmit(values: RaffleFormValues) {
    startTransition(async () => {
      const result = raffle ? await updateRaffle(raffle.id, values) : await createRaffle(values)
      if (result && !result.ok) {
        toast({ title: 'Could not save raffle', description: result.error, variant: 'destructive' })
      } else if (raffle) {
        toast({ title: 'Raffle updated' })
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Slug</label>
          <input {...form.register('slug', { onBlur: handleSlugBlur })} className={inputClass} placeholder="fall-food-drive-2026" />
        </div>
        <div>
          <label className={labelClass}>Ticket Prefix</label>
          <input {...form.register('ticketPrefix')} className={inputClass} disabled={hasIssuedTickets} />
          {hasIssuedTickets && (
            <p className="text-xs text-sage mt-1">
              Locked — {ticketCount} ticket{ticketCount > 1 ? 's have' : ' has'} already been issued.
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input {...form.register('title')} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea {...form.register('description')} rows={3} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ticket Price ($)</label>
          <input type="number" step="0.01" {...form.register('ticketPrice')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select {...form.register('status')} className={inputClass}>
            {['draft', 'active', 'paused', 'drawing', 'completed', 'archived'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Sales End Date</label>
          <input type="datetime-local" {...form.register('endDate')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Drawing Date</label>
          <input type="datetime-local" {...form.register('drawingDate')} className={inputClass} />
        </div>
      </div>

      <fieldset className="border border-brass/30 p-4 space-y-3">
        <legend className="font-mono text-xs uppercase tracking-wide text-sage px-1">Payment Accounts</legend>
        <input {...form.register('cashappAccount')} placeholder="Cash App — $handle" className={inputClass} />
        <input {...form.register('venmoAccount')} placeholder="Venmo — @handle" className={inputClass} />
        <input {...form.register('zelleAccount')} placeholder="Zelle — email or phone" className={inputClass} />
      </fieldset>

      <div>
        <label className={labelClass}>Organization Name</label>
        <input {...form.register('organizationName')} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Contact Email</label>
          <input {...form.register('contactEmail')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Contact Phone</label>
          <input {...form.register('contactPhone')} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Event Location</label>
        <input {...form.register('eventLocation')} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Legal Disclaimer</label>
        <textarea {...form.register('legalDisclaimer')} rows={2} className={inputClass} />
      </div>

      <fieldset className="border border-brass/30 p-4 space-y-3">
        <legend className="font-mono text-xs uppercase tracking-wide text-sage px-1">Rules</legend>
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <input {...form.register(`rules.${i}.title`)} placeholder="Title (optional)" className={inputClass} />
            <input {...form.register(`rules.${i}.text`)} placeholder="Rule text" className={inputClass} />
            <button type="button" onClick={() => remove(i)} className="text-ember font-mono text-xs px-2">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ title: '', text: '' })}
          className="font-mono text-xs uppercase tracking-wide border border-brass/40 px-3 py-1">
          + Add Rule
        </button>
      </fieldset>

      <button type="submit" disabled={isPending}
        className="border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm uppercase tracking-wide py-3 px-6 disabled:opacity-50">
        {isPending ? 'Saving…' : raffle ? 'Save Changes' : 'Create Raffle'}
      </button>
    </form>
  )
}