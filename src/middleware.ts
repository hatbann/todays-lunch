/** @format */

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log(path === "/login");
  // 로그아웃 상태에서만 접근가능
  const isPublicPath = path === "/login" || path === "/join";
  const isPrivatePath = path === "/profile" || path.includes("/upload");
  const token = request.cookies.get("token")?.value || undefined;

  console.log(
    `---- MIDDLEWARE : Path : ${path} / isPublic : ${isPublicPath} / isPrivate : ${isPrivatePath} / token : ${token} ------`
  );

  if (isPublicPath && token !== undefined) {
    return NextResponse.redirect(new URL("/lunch", request.nextUrl));
  }

  if (isPrivatePath && token === undefined) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

// It specifies the paths for which this middleware should be executed.
// In this case, it's applied to '/', '/profile', '/login', and '/signup'.
export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/join",
    "/upload/:path*",
    "/lunch",
    "/recipe",
  ],
};
