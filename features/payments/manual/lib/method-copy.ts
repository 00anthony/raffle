// features/payments/manual/lib/method-copy.ts
export const MANUAL_METHOD_COPY = {
  cashapp: { label: 'Cash App', instruction: 'Send to' },
  venmo: { label: 'Venmo', instruction: 'Send to' },
  zelle: { label: 'Zelle', instruction: 'Send to' },
} as const

export type ManualMethod = keyof typeof MANUAL_METHOD_COPY