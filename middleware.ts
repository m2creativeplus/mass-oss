import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // TODO: Integrate with Convex Auth for server-side validation
  // currently we rely on client-side AuthGuard and Convex RLS
  
  const path = request.nextUrl.pathname

  // Add paths that don't satisfy the protection check
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path.startsWith('/api/webhooks')

  // Example logic:
  // const token = request.cookies.get('convex_token')?.value
  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
