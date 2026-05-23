import { getSessionCookie } from 'better-auth/cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authPages = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
];

const protectedRoutes = ['/settings', '/transactions', '/messages'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = getSessionCookie(req);

  const isAuthenticated = !!sessionCookie;

  const isAuthPage = authPages.some((p) => pathname.startsWith(p));
  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/settings/:path*',
    '/transactions/:path*',
    '/messages/:path*',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
  ],
};
