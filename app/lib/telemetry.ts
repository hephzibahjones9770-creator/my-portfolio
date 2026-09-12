import { prisma } from '@/app/lib/prisma'

export async function trackEvent(type: string, path?: string, entityId?: string) {
  try {
    await prisma.analyticsEvent.create({ data: { type, path, entityId } })
  } catch {
    // Analytics must never make the public site unavailable.
  }
}

export async function logActivity(action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
  await prisma.activityLog.create({
    data: { action, entityType, entityId, metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined },
  })
}
