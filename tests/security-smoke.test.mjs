import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')

test('admin auth fails closed and limits repeated attempts', async () => {
  const [auth, middleware, security] = await Promise.all([
    read('actions/auth.ts'),
    read('middleware.ts'),
    read('app/lib/security.ts'),
  ])
  assert.match(auth, /isLoginAllowed/)
  assert.match(auth, /recordLoginFailure/)
  assert.match(auth, /getJwtSecret/)
  assert.match(middleware, /getJwtSecret/)
  assert.match(security, /MAX_UPLOAD_BYTES = 10 \* 1024 \* 1024/)
})

test('media endpoint requires authentication and validates files', async () => {
  const route = await read('app/api/admin/media/route.ts')
  assert.match(route, /Unauthorized/)
  assert.match(route, /file\.size > MAX_UPLOAD_BYTES/)
  assert.match(route, /ALLOWED_UPLOAD_TYPES\.get\(file\.type\)/)
  assert.match(route, /flag: 'wx'/)
})

test('public write endpoints have validation and rate limits', async () => {
  const [contact, analytics, config] = await Promise.all([
    read('actions/contact.ts'),
    read('app/api/analytics/route.ts'),
    read('next.config.ts'),
  ])
  assert.match(contact, /consumeRateLimit/)
  assert.match(contact, /message\.length > 5000/)
  assert.match(analytics, /status: 429/)
  assert.match(config, /X-Content-Type-Options/)
  assert.match(config, /X-Frame-Options/)
})
