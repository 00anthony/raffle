import QRCode from 'react-qr-code'

export function QrCodeBlock({ slug }: { slug: string }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/raffles/${slug}`
  return (
    <div className="inline-flex flex-col items-center gap-2 bg-ticket-cream p-4 border border-brass/40">
      <QRCode value={url} size={120} bgColor="#F7F0DE" fgColor="#24211B" />
      <p className="font-mono text-[10px] text-sage uppercase tracking-wide">Scan to buy</p>
    </div>
  )
}
