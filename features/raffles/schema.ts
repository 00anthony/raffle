// features/raffles/schema.ts
import { z } from 'zod'

export const raffleFormSchema = z.object({
  slug: z.string().trim().min(3).max(80).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  ticketPrefix: z.string().trim().min(2).max(10).regex(/^[A-Z0-9]+$/, 'Uppercase letters and numbers only'),
  ticketPrice: z.coerce.number().positive(),
  status: z.enum(['draft', 'active', 'paused', 'drawing', 'completed', 'archived']),
  endDate: z.string().optional().or(z.literal('')),
  drawingDate: z.string().min(1, 'Drawing date is required'),
  organizationName: z.string().trim().max(200).optional().or(z.literal('')),
  eventLocation: z.string().trim().max(300).optional().or(z.literal('')),
  contactEmail: z.string().trim().email().optional().or(z.literal('')),
  contactPhone: z.string().trim().max(40).optional().or(z.literal('')),
  legalDisclaimer: z.string().trim().max(2000).optional().or(z.literal('')),
  cashappAccount: z.string().trim().max(100).optional().or(z.literal('')),
  venmoAccount: z.string().trim().max(100).optional().or(z.literal('')),
  zelleAccount: z.string().trim().max(100).optional().or(z.literal('')),
  rules: z.array(z.object({
    title: z.string().trim().max(100).optional().or(z.literal('')),
    text: z.string().trim().min(1),
  })).default([]),
})

export type RaffleFormValues = z.infer<typeof raffleFormSchema>