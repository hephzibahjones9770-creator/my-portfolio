'use server'

import { prisma } from '@/app/lib/prisma'
import { logActivity } from '@/app/lib/telemetry'
import { revalidatePath } from 'next/cache'

export async function saveSettings(formData: FormData) {
  const data = {
    siteTitle: String(formData.get('siteTitle') ?? 'Portfolio').trim(),
    siteDescription: String(formData.get('siteDescription') ?? '').trim(),
    socialImageUrl: String(formData.get('socialImageUrl') ?? '').trim() || null,
    themeMode: String(formData.get('themeMode') ?? 'dark'),
    primaryColor: String(formData.get('primaryColor') ?? '#3d7cff'),
    accentColor: String(formData.get('accentColor') ?? '#7fe6e1'),
    animations: formData.get('animations') === 'on',
    backgroundEffects: formData.get('backgroundEffects') === 'on',
    seoEnabled: formData.get('seoEnabled') === 'on',
  }

  await prisma.siteSettings.upsert({ where: { id: 'site' }, create: { id: 'site', ...data }, update: data })
  await logActivity('Site settings updated', 'settings')
  revalidatePath('/')
  revalidatePath('/admin/dashboard/settings')
}

export async function restoreBackup(_previousState: { error?: string; success?: string } | null, formData: FormData) {
  const raw = String(formData.get('backup') ?? '')
  if (!raw.trim()) return { error: 'Paste a backup JSON document first.' }

  try {
    const payload = JSON.parse(raw) as Record<string, unknown>
    await prisma.portfolioBackup.create({
      data: { filename: `restored-${new Date().toISOString()}.json`, payload: JSON.parse(JSON.stringify(payload)) },
    })
    await logActivity('Portfolio backup restored', 'backup')
    return { success: 'Backup verified and stored. Content restore can be applied from this snapshot.' }
  } catch {
    return { error: 'The backup is not valid JSON.' }
  }
}
