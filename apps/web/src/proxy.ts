import { getSessionCookie } from 'better-auth/cookies';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/transactions/:path*', '/messages/:path*', '/listings/:id/buy'],
};
