export type Prize = {
  id: string
  raffle_id: string
  title: string
  description: string | null
  image_url: string | null
  estimated_value: number | null
  sort_order: number
  created_at: string
}
