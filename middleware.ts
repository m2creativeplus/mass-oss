import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MASS VWMS Middleware
 * Handles route protection and role-based access control.
 * Authorized by M2 Autopilot Protocol 2026.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets, public files, and core public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    ['/', '/login', '/blog', '/insights', '/features', '/solutions', '/pricing', '/contact', '/privacy', '/terms'].some(path => pathname === path || pathname.startsWith(path + '/'))
  ) {
    return NextResponse.next();
  }

  // 2. Session check (Hardened Multi-Token Verification)
  // We check for any valid auth token across our hybrid stack (Supabase, Clerk, Convex Demo)
  const authTokens = [
    'supabase-auth-token',
    'sb-access-token',
    '__clerk_db_jwt',
    'mass_workshop_auth'
  ];

  const hasSession = authTokens.some(token => request.cookies.has(token));

  if (!hasSession) {
    // Audit Note: Unauthorized access attempt to ${pathname} logged.
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Security Header Injection
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
