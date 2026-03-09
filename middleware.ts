import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["fr", "en", "ar"] as const;
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/fr";
    return NextResponse.redirect(url);
  }

  const maybeLocale = pathname.split("/").filter(Boolean)[0];
  if (maybeLocale && LOCALES.includes(maybeLocale as (typeof LOCALES)[number])) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/fr${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
