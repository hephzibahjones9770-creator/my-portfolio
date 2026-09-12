'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { consumeRateLimit } from '@/app/lib/security'

export async function sendContactMessage(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !message) return
  if (name.length > 120 || email.length > 254 || message.length > 5000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
  if (!consumeRateLimit('contact-public', 10, 15 * 60 * 1000)) return

  await prisma.contactMessage.create({
    data: { name, email, message },
  })

  revalidatePath('/')
}
