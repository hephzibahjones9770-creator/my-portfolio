import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/app/lib/prisma'
import { getJwtSecret } from '@/app/lib/security'

export async function GET() {
  const token = (await cookies()).get('admin_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await jwtVerify(token, getJwtSecret())
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [profile, schools, colleges, skills, projects, achievements, experience, media, settings] = await Promise.all([
    prisma.profile.findMany(),
    prisma.school.findMany({ include: { certificates: true } }),
    prisma.college.findMany({ include: { semesters: { include: { documents: true } } } }),
    prisma.skill.findMany(),
    prisma.project.findMany(),
    prisma.achievement.findMany(),
    prisma.experience.findMany(),
    prisma.mediaItem.findMany(),
    prisma.siteSettings.findUnique({ where: { id: 'site' } }),
  ])

  const payload = { exportedAt: new Date().toISOString(), profile, schools, colleges, skills, projects, achievements, experience, media, settings }
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="portfolio-backup.json"',
    },
  })
}
