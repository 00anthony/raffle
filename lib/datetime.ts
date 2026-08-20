// lib/datetime.ts
// datetime-local inputs both produce and expect a timezone-less
// "YYYY-MM-DDTHH:mm" string representing the browser's LOCAL wall-clock time.
// Postgres timestamptz stores an absolute UTC instant. Skipping conversion in
// either direction is exactly what caused drawing/end dates to drift by the
// browser's UTC offset.

export function utcIsoToLocalInputValue(isoString: string): string {
  const date = new Date(isoString)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function localInputValueToUtcIso(localValue: string): string {
  // new Date() parses a naive "YYYY-MM-DDTHH:mm" string as local time per
  // spec, so this direction just needs a plain toISOString() — no manual math.
  return new Date(localValue).toISOString()
}