'use client'

// Minimal in-house toast store — no external UI library dependency.
// Swap for shadcn/ui's toast component later (`npx shadcn add toast`) if you
// want richer animation/positioning; this is a functional placeholder that
// pairs with components/shared/toaster.tsx.
import { useCallback, useEffect, useState } from 'react'

type Toast = { id: number; title: string; description?: string; variant?: 'default' | 'destructive' }

let listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []
let idCounter = 0

function emit() {
  listeners.forEach((l) => l(toasts))
}

export function useToast() {
  const [state, setState] = useState(toasts)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter((l) => l !== setState)
    }
  }, [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = idCounter++
    toasts = [...toasts, { ...t, id }]
    emit()
    setTimeout(() => {
      toasts = toasts.filter((x) => x.id !== id)
      emit()
    }, 4000)
  }, [])

  return { toast, toasts: state }
}
