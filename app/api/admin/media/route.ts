import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/app/lib/prisma'
import { ALLOWED_UPLOAD_TYPES, getJwtSecret, MAX_UPLOAD_BYTES } from '@/app/lib/security'

export const runtime = 'nodejs'

async function isAdmin() {
  const token = (await cookies()).get('admin_session')?.value
  if (!token) return false
  try {
    await jwtVerify(token, getJwtSecret())
    return true
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a file.' }, { status: 400 })
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'File must be between 1 byte and 10 MB.' }, { status: 413 })

  const category = ALLOWED_UPLOAD_TYPES.get(file.type)
  if (!category) return NextResponse.json({ error: 'This file type is not allowed.' }, { status: 415 })

  const extension = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.bin'
  const storedName = `${randomUUID()}${extension}`
  const uploadDirectory = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDirectory, { recursive: true })
  await writeFile(path.join(uploadDirectory, storedName), Buffer.from(await file.arrayBuffer()), { flag: 'wx' })

  const media = await prisma.mediaItem.create({
    data: { name: file.name.slice(0, 200), type: file.type, category, size: file.size, url: `/uploads/${storedName}`, public: false },
  })
  return NextResponse.json({ media }, { status: 201 })
}
