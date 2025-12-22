import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

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

  // Check if utm_source=testing_2026 is present in query parameters
  const utmSource = searchParams.get('utm_source')
  const hasTestingAccess = utmSource === 'testing_2026'

  // If testing access is granted, set a cookie to maintain access across pages
  if (hasTestingAccess) {
    const response = NextResponse.next()
    response.cookies.set('testing_access', 'true', {
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: 'lax',
    })
    return response
  }

  // Check for testing access cookie
  const testingCookie = request.cookies.get('testing_access')
  if (testingCookie?.value === 'true') {
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

