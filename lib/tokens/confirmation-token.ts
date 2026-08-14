// lib/tokens/confirmation-token.ts
import crypto from 'node:crypto'

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function base64url(input: string) {
  return Buffer.from(input).toString('base64url')
}

export function signConfirmationToken(purchaseId: string): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS
  const encodedPayload = base64url(`${purchaseId}.${expiresAt}`)
  const signature = crypto
    .createHmac('sha256', process.env.RAFFLE_CONFIRMATION_SECRET!)
    .update(encodedPayload)
    .digest('base64url')
  return `${encodedPayload}.${signature}`
}

export function verifyConfirmationToken(purchaseId: string, token: string): boolean {
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return false

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAFFLE_CONFIRMATION_SECRET!)
    .update(encodedPayload)
    .digest('base64url')

  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (sigBuffer.length !== expectedBuffer.length) return false
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false // constant-time compare — avoids timing attacks on the signature check

  const [tokenPurchaseId, expiresAtStr] = Buffer.from(encodedPayload, 'base64url').toString('utf-8').split('.')
  const expiresAt = Number(expiresAtStr)

  if (tokenPurchaseId !== purchaseId) return false
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false

  return true
}