import { NextRequest, NextResponse } from "next/server";
import { getProxyAction } from "@/lib/proxy-routing";

export function proxy(request: NextRequest) {
  const action = getProxyAction(request.nextUrl.pathname);

  if (action.type === "next") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = action.pathname;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
