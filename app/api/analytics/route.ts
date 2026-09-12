import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { consumeRateLimit } from '@/app/lib/security'

export async function POST(request: Request) {
  try {
    if (!consumeRateLimit('analytics-public', 120, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const body = await request.json() as { type?: string; path?: string; entityId?: string }
    const allowed = ['project_view', 'resume_view', 'resume_download', 'certificate_view']
    if (!body.type || !allowed.includes(body.type)) return NextResponse.json({ error: 'Invalid event' }, { status: 400 })

    await prisma.analyticsEvent.create({ data: { type: body.type, path: body.path, entityId: body.entityId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Analytics unavailable' }, { status: 503 })
  }
}
