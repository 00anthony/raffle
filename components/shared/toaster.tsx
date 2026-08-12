'use client'

import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            t.variant === 'destructive'
              ? 'border px-4 py-3 shadow-md font-mono text-sm bg-ember text-ticket-cream border-charcoal'
              : 'border px-4 py-3 shadow-md font-mono text-sm bg-charcoal text-ticket-cream border-brass'
          }
        >
          <p className="font-semibold">{t.title}</p>
          {t.description && <p className="opacity-80">{t.description}</p>}
        </div>
      ))}
    </div>
  )
}
