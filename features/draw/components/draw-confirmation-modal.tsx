// features/draw/components/draw-confirm-modal.tsx
'use client'

import { useState } from 'react'

export function DrawConfirmModal({
  open, onConfirm, onCancel,
}: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('')
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-charcoal/80 flex items-center justify-center z-50 px-6">
      <div className="bg-ticket-cream p-6 max-w-sm w-full text-center">
        <p className="font-mono text-sm text-ember uppercase tracking-wide">Confirm Draw</p>
        <p className="text-charcoal text-sm mt-2">This cannot be undone. Type <strong>DRAW</strong> to proceed.</p>
        <input value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus
          className="w-full border border-brass/40 bg-white px-3 py-2 font-mono text-center mt-4" />
        <div className="flex gap-2 mt-4">
          <button onClick={onCancel} className="flex-1 border border-charcoal font-mono text-sm py-2">Cancel</button>
          <button onClick={onConfirm} disabled={typed !== 'DRAW'}
            className="flex-1 border-2 border-charcoal bg-ember text-ticket-cream font-mono text-sm py-2 disabled:opacity-40">
            Draw
          </button>
        </div>
      </div>
    </div>
  )
}