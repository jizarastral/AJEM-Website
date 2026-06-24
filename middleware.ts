import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookies
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value

  const isAuthed = !!sessionToken

  // Public routes
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/auth', '/api/contact']
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route))

  if (!isAuthed && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
