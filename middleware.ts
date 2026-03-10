import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Add paths that don't satisfy the protection check
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path.startsWith('/api') || path.startsWith('/verify')

  const isAuthenticated = request.cookies.has('mass_workshop_auth')

  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Prevent authenticated users from seeing the login page
  if (path === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
