import type { Metadata } from 'next'
import { Fraunces, Public_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Toaster } from '@/components/shared/toaster'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-public-sans' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-ibm-plex-mono' })

export const metadata: Metadata = {
  title: 'Raffle Platform',
  description: 'Charity raffle ticketing platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
