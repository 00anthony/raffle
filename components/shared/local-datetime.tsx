// components/shared/local-datetime.tsx
'use client'

import { useEffect, useState } from 'react'

export function LocalDateTime({ iso, options }: { iso: string; options?: Intl.DateTimeFormatOptions }) {
  // Server has no reliable "viewer timezone" to render with, so it renders
  // a placeholder; the real, correctly-localized value fills in immediately
  // client-side after mount, once the browser's actual timezone is available.
  const [formatted, setFormatted] = useState<string | null>(null)

  useEffect(() => {
    setFormatted(new Date(iso).toLocaleString(undefined, options))
  }, [iso, options])

  return <>{formatted ?? '—'}</>
}