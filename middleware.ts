import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session_token')?.value;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth');

  if (!token && !isAuthPage && !isApiAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/manager', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
