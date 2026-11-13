import { NextRequest, NextResponse } from "next/server";
import { getProxyAction } from "@/lib/proxy-routing";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // 1. Redirect www to non-www (single canonical domain version)
  if (host.startsWith("www.")) {
    const canonicalHost = host.slice(4);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = canonicalHost;
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // 2. Redirect http to https in production environments
  const proto = request.headers.get("x-forwarded-proto");
  if (
    proto === "http" &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1")
  ) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  const action = getProxyAction(request.nextUrl.pathname);

  if (action.type === "next") {
    return NextResponse.next();
  }

  if (action.type === "not-found") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = request.nextUrl.clone();
  url.pathname = action.pathname;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
