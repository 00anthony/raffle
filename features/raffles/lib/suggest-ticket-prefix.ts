// features/raffles/lib/suggest-ticket-prefix.ts
export function suggestTicketPrefix(slug: string): string {
  const words = slug.split('-').filter(Boolean)
  const yearWord = words.find((w) => /^\d{4}$/.test(w))
  const nameWords = words.filter((w) => w !== yearWord)
  const initials = nameWords.map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 5)
  const yearSuffix = yearWord ? yearWord.slice(-2) : ''
  return `${initials}${yearSuffix}`
}