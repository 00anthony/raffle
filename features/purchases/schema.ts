import { z } from 'zod'

export const purchaseFormSchema = z.object({
  ticketCount: z.coerce.number().int().min(1).max(100),
  buyerName: z.string().trim().min(2).max(120),
  buyerEmail: z.string().trim().email(),
  buyerPhone: z.string().trim().optional().or(z.literal('')),
  paymentMethod: z.enum(['stripe', 'cashapp', 'venmo', 'zelle']),
})

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>

export const cashSaleSchema = z.object({
  raffleId: z.string().uuid(),
  buyerName: z.string().trim().min(2).max(120),
  buyerEmail: z.string().trim().email(),
  ticketCount: z.coerce.number().int().min(1).max(100),
})

export type CashSaleValues = z.infer<typeof cashSaleSchema>