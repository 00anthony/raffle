export type PaymentMethod = 'stripe' | 'cashapp' | 'venmo' | 'zelle' | 'cash'
export type PaymentStatus = 'pending' | 'pending_verification' | 'approved' | 'rejected' | 'refunded'

export type Purchase = {
  id: string
  raffle_id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string | null
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  ticket_count: number
  amount_paid: number
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  payment_reference: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}
