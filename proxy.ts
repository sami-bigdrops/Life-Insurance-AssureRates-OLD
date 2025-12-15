import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to maintenance page
  if (pathname === '/maintenance') {
    return NextResponse.next()
  }

  // Allow static files (images, fonts, etc.)
  const staticFileExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot']
  const isStaticFile = staticFileExtensions.some(ext => pathname.toLowerCase().endsWith(ext))
  
  if (isStaticFile) {
    return NextResponse.next()
  }

  // Redirect all other routes to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

