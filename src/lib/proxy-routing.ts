const LOCALES = ["fr", "en", "ar"] as const;
const PUBLIC_FILE = /\.(.*)$/;

type ProxyAction =
  | { type: "next" }
  | { type: "redirect"; pathname: string };

function isKnownLocale(value: string): value is (typeof LOCALES)[number] {
  return LOCALES.includes(value as (typeof LOCALES)[number]);
}

export function getProxyAction(pathname: string): ProxyAction {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return { type: "next" };
  }

  if (pathname === "/") {
    return { type: "redirect", pathname: "/fr" };
  }

  const maybeLocale = pathname.split("/").filter(Boolean)[0];
  if (maybeLocale && isKnownLocale(maybeLocale)) {
    return { type: "next" };
  }

  return { type: "redirect", pathname: `/fr${pathname}` };
}
