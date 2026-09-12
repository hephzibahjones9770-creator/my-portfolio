import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { getJwtSecret } from '@/app/lib/security'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  const { pathname } = request.nextUrl

  // Protected paths dashboard validation
  if (pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    try {
      await jwtVerify(token, getJwtSecret())
      return NextResponse.next()
    } catch {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If logged in, block them from hitting the login page again
  if (pathname.startsWith('/admin/login') && token) {
    try {
      await jwtVerify(token, getJwtSecret())
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
