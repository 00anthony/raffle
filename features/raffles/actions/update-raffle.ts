// features/raffles/actions/update-raffle.ts
'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/server/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { raffleFormSchema, type RaffleFormValues } from '../schema'

export async function updateRaffle(raffleId: string, input: RaffleFormValues) {
  await requireAdmin()
  const parsed = raffleFormSchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, error: 'Please check the form for errors.' }

  const admin = createAdminClient()

  const [{ data: current }, { count: ticketCount }] = await Promise.all([
    admin.from('raffles').select('ticket_prefix').eq('id', raffleId).single(),
    admin.from('tickets').select('id', { count: 'exact', head: true }).eq('raffle_id', raffleId),
  ])

  if ((ticketCount ?? 0) > 0 && current?.ticket_prefix !== parsed.data.ticketPrefix) {
    return { ok: false as const, error: 'Ticket prefix cannot be changed after tickets have been issued.' }
  }

  const accounts: Record<string, string> = {}
  if (parsed.data.cashappAccount) accounts.cashapp = parsed.data.cashappAccount
  if (parsed.data.venmoAccount) accounts.venmo = parsed.data.venmoAccount
  if (parsed.data.zelleAccount) accounts.zelle = parsed.data.zelleAccount

  const { error } = await admin
    .from('raffles')
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description || null,
      ticket_prefix: parsed.data.ticketPrefix,
      ticket_price: parsed.data.ticketPrice,
      status: parsed.data.status,
      end_date: parsed.data.endDate || null,
      drawing_date: parsed.data.drawingDate,
      organization_name: parsed.data.organizationName || null,
      event_location: parsed.data.eventLocation || null,
      contact_email: parsed.data.contactEmail || null,
      contact_phone: parsed.data.contactPhone || null,
      legal_disclaimer: parsed.data.legalDisclaimer || null,
      payment_accounts: accounts,
      rules: parsed.data.rules,
      updated_at: new Date().toISOString(),
    })
    .eq('id', raffleId)

  if (error) {
    if (error.code === '23505') {
      return { ok: false as const, error: 'That slug or ticket prefix is already in use by another raffle.' }
    }
    return { ok: false as const, error: 'Could not update the raffle.' }
  }

  revalidatePath(`/admin/raffles/${raffleId}`)
  revalidatePath('/admin/raffles')
  return { ok: true as const }
}