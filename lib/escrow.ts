import crypto from 'crypto'

export function generateQRToken(transactionId: string): string {
  const payload = {
    txn: transactionId,
    ts: Date.now(),
    nonce: crypto.randomBytes(8).toString('hex'),
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

export function decodeQRToken(token: string): { txn: string; ts: number; nonce: string } | null {
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'))
  } catch {
    return null
  }
}

export function isQRTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

export function formatPGK(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount).replace('US$','K')
}

export const ESCROW_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Awaiting Payment',  color: '#F59E0B' },
  held:       { label: 'Funds Held',        color: '#3B82F6' },
  in_transit: { label: 'In Transit',        color: '#8B5CF6' },
  completed:  { label: 'Completed',         color: '#10B981' },
  disputed:   { label: 'Disputed',          color: '#EF4444' },
  refunded:   { label: 'Refunded',          color: '#6B7280' },
  cancelled:  { label: 'Cancelled',         color: '#9CA3AF' },
}
