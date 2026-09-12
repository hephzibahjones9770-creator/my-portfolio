'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { clearLoginFailures, getJwtSecret, isLoginAllowed, normalizeEmail, recordLoginFailure } from '@/app/lib/security'

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData,
) {
  const email = normalizeEmail(String(formData.get('email') ?? ''))
  const password = String(formData.get('password') ?? '')
  const loginKey = email || 'empty-email'

  if (!email || !password) {
    return { error: 'Please fill in all fields.' }
  }

  if (!isLoginAllowed(loginKey)) {
    return { error: 'Too many attempts. Try again later.' }
  }

  const admin = await prisma.adminAccount.findUnique({ where: { email } })
  if (!admin) {
    recordLoginFailure(loginKey)
    return { error: 'Invalid email or password.' }
  }

  const passwordsMatch = await bcrypt.compare(password, admin.password)
  if (!passwordsMatch) {
    recordLoginFailure(loginKey)
    return { error: 'Invalid email or password.' }
  }

  clearLoginFailures(loginKey)

  const token = await new SignJWT({ adminId: admin.id, email: admin.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getJwtSecret())

  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  redirect('/admin/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
