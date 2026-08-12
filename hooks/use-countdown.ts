'use client'

import { useEffect, useState } from 'react'

export function useCountdown(targetDate: string) {
  const [remaining, setRemaining] = useState(() => calc(targetDate))

  useEffect(() => {
    const id = setInterval(() => setRemaining(calc(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return remaining
}

function calc(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    isExpired: false,
  }
}
