export function PerforatedDivider({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      role="presentation"
      className={
        orientation === 'horizontal'
          ? "h-0 w-full border-t-2 border-dashed border-brass/60 relative before:absolute before:inset-x-0 before:-top-2 before:h-4 before:bg-[radial-gradient(circle,transparent_6px,var(--color-background)_7px)] before:bg-[length:16px_16px] before:bg-repeat-x"
          : 'w-0 h-full border-l-2 border-dashed border-brass/60'
      }
    />
  )
}
