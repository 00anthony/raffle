// features/google-sheets/sync-raffle-to-sheets.ts
// NOT YET IMPLEMENTED. Requires a Google Cloud service account, a shared
// spreadsheet, and the googleapis client (already in package.json from
// Phase 1's dependency list, unused until now). Stubbed so the dashboard
// button has something to call without breaking — real implementation is
// a good candidate for its own focused session given the service-account
// setup involved.
export async function syncRaffleToSheets(raffleId: string) {
  console.log(`[stub] Would sync raffle ${raffleId} to Google Sheets`)
  return { ok: false as const, error: 'Google Sheets sync is not yet implemented.' }
}