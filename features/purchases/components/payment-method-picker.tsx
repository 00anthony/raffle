'use client'

const METHODS = [
  { value: 'stripe', label: 'Credit Card' },
  { value: 'cashapp', label: 'Cash App' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'zelle', label: 'Zelle' },
] as const

export function PaymentMethodPicker({
  value, onChange,
}: { value: string; onChange: (m: typeof METHODS[number]['value']) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-mono uppercase tracking-wide text-sage mb-2">Payment Method</legend>
      <div className="grid grid-cols-2 gap-2">
        {METHODS.map((m) => (
          <button key={m.value} type="button" onClick={() => onChange(m.value)} aria-pressed={value === m.value}
            className={value === m.value
              ? 'border-2 border-ember bg-ember/10 font-mono text-sm py-2 px-3'
              : 'border border-brass/40 font-mono text-sm py-2 px-3'}>
            {m.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
