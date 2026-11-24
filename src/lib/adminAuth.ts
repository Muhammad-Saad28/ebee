import { cookies } from 'next/headers'
import crypto from 'crypto'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ebee.pk@gmail.com'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminadmin'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ebee-admin-secure-auth-secret-key-2025'
const COOKIE_NAME = 'ebee_admin_session'

export function createToken(email: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  const payload = JSON.stringify({ email, expiresAt })
  const base64Payload = Buffer.from(payload).toString('base64url')
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Payload)
    .digest('base64url')
  return `${base64Payload}.${signature}`
}

export function verifyToken(token: string): { email: string; expiresAt: number } | null {
  try {
    const [base64Payload, signature] = token.split('.')
    if (!base64Payload || !signature) return null

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(base64Payload)
      .digest('base64url')

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null
    }

    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'))
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null
    }

    if (payload.email !== ADMIN_EMAIL) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function setAdminSession(email: string) {
  const token = createToken(email)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  const valid = verifyToken(token)
  return valid !== null
}
