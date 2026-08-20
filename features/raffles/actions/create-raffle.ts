// features/raffles/actions/create-raffle.ts
'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/server/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { raffleFormSchema, type RaffleFormValues } from '../schema'
import { localInputValueToUtcIso } from '@/lib/datetime'

function buildPaymentAccounts(v: RaffleFormValues) {
  const accounts: Record<string, string> = {}
  if (v.cashappAccount) accounts.cashapp = v.cashappAccount
  if (v.venmoAccount) accounts.venmo = v.venmoAccount
  if (v.zelleAccount) accounts.zelle = v.zelleAccount
  return accounts
}

export async function createRaffle(input: RaffleFormValues) {
  await requireAdmin()
  const parsed = raffleFormSchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, error: 'Please check the form for errors.' }

  const admin = createAdminClient()
  const { data: raffle, error } = await admin
    .from('raffles')
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description || null,
      ticket_prefix: parsed.data.ticketPrefix,
      ticket_price: parsed.data.ticketPrice,
      status: parsed.data.status,
      end_date: parsed.data.endDate ? localInputValueToUtcIso(parsed.data.endDate) : null,
      drawing_date: localInputValueToUtcIso(parsed.data.drawingDate),
      organization_name: parsed.data.organizationName || null,
      event_location: parsed.data.eventLocation || null,
      contact_email: parsed.data.contactEmail || null,
      contact_phone: parsed.data.contactPhone || null,
      legal_disclaimer: parsed.data.legalDisclaimer || null,
      payment_accounts: buildPaymentAccounts(parsed.data),
      rules: parsed.data.rules,
    })
    .select('id')
    .single()

  if (error) {
    // 23505 = unique_violation — slug or ticket_prefix collision
    if (error.code === '23505') {
      return { ok: false as const, error: 'That slug or ticket prefix is already in use by another raffle.' }
    }
    return { ok: false as const, error: 'Could not create the raffle.' }
  }

  redirect(`/admin/raffles/${raffle.id}`)
}