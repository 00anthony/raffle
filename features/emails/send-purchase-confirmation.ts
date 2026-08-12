// Phase 7 will implement this for real via Resend. Stubbed now so Phase 5's
// webhook handler and future Phase 6 manual-payment approval have something
// to call without breaking the build.
export async function sendPurchaseConfirmationEmail(
  purchaseId: string,
  tickets: { id: string; display_id: string }[]
) {
  console.log(
    `[stub — Phase 7 will implement] Would send confirmation email for purchase ${purchaseId} with tickets:`,
    tickets.map((t) => t.display_id)
  )
}
