import { notFound } from 'next/navigation'
import { getRaffleBySlug } from '@/features/raffles/queries/get-raffle-by-slug'
import { getPrizesByRaffle } from '@/features/raffles/queries/get-prizes-by-raffle'
import { RaffleHero } from '@/features/raffles/components/raffle-hero'
import { RulesSection } from '@/features/raffles/components/rules-section'
import { PrizeShowcase } from '@/features/raffles/components/prize-showcase'
import { QrCodeBlock } from '@/features/raffles/components/qr-code-block'
import { RaffleFooter } from '@/features/raffles/components/raffle-footer'

export default async function RafflePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raffle = await getRaffleBySlug(slug)
  if (!raffle) notFound()

  const prizes = await getPrizesByRaffle(raffle.id)

  return (
    <main>
      <RaffleHero raffle={raffle} />
      <PrizeShowcase prizes={prizes} />
      <RulesSection rules={raffle.rules} />
      <section className="flex justify-center py-12 bg-ink-green">
        <QrCodeBlock slug={raffle.slug} />
      </section>
      <RaffleFooter raffle={raffle} />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raffle = await getRaffleBySlug(slug)
  if (!raffle) return {}
  return {
    title: raffle.title,
    description: raffle.description ?? undefined,
    openGraph: {
      images: raffle.og_image_url ?? raffle.hero_image_url ?? undefined,
    },
  }
}
