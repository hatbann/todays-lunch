/** @format */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 로그아웃 상태에서만 접근가능
  const isPublicPath = path === '/login' || path === '/join';
  const isPrivatePath = path === '/profile' || path.includes('/upload');
  const token = request.cookies.get('token')?.value || undefined;
  if (isPublicPath && token !== undefined) {
    console.log('2');
    return NextResponse.redirect(new URL('/lunch', request.nextUrl));
  }

  if (isPrivatePath && token === undefined) {
    console.log('1');
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

// It specifies the paths for which this middleware should be executed.
// In this case, it's applied to '/', '/profile', '/login', and '/signup'.
export const config = {
  matcher: '/upload/:path*',
};
