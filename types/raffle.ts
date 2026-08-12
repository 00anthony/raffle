export type RaffleRule = {
  title?: string | null
  text: string
}

export type RaffleTheme = {
  primaryColor?: string
  accentColor?: string
}

export type RaffleStatus = 'draft' | 'active' | 'paused' | 'drawing' | 'completed' | 'archived'

export type Raffle = {
  id: string
  slug: string
  title: string
  description: string | null
  ticket_prefix: string
  ticket_number_padding: number
  ticket_price: number
  status: RaffleStatus
  start_date: string | null
  end_date: string | null
  drawing_date: string
  payment_accounts: Record<string, string>
  qr_code_url: string | null
  rules: RaffleRule[]
  organization_name: string | null
  organization_logo_url: string | null
  event_location: string | null
  hero_image_url: string | null
  theme: RaffleTheme
  countdown_target: 'end_date' | 'drawing_date'
  legal_disclaimer: string | null
  contact_email: string | null
  contact_phone: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
}
