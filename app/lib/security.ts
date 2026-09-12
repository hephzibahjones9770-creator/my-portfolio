const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const attempts = new Map<string, { count: number; resetAt: number }>()
const requestLimits = new Map<string, { count: number; resetAt: number }>()

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const ALLOWED_UPLOAD_TYPES = new Map([
  ['image/jpeg', 'images'],
  ['image/png', 'images'],
  ['image/webp', 'images'],
  ['image/gif', 'images'],
  ['video/mp4', 'videos'],
  ['application/pdf', 'pdfs'],
  ['application/vnd.ms-powerpoint', 'presentations'],
  ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'presentations'],
  ['application/msword', 'documents'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'documents'],
])

export function getJwtSecret() {
  const value = process.env.JWT_SECRET_KEY
  if (!value || value.length < 32) throw new Error('JWT_SECRET_KEY must contain at least 32 characters')
  return new TextEncoder().encode(value)
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isLoginAllowed(key: string) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) return true
  return current.count < MAX_LOGIN_ATTEMPTS
}

export function recordLoginFailure(key: string) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS })
    return
  }
  current.count += 1
}

export function clearLoginFailures(key: string) {
  attempts.delete(key)
}

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = requestLimits.get(key)
  if (!current || current.resetAt <= now) {
    requestLimits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}
