import type { SiteLocale } from "@/config/locales";

const EXTERNAL_PREFIXES = ["http://", "https://", "mailto:", "tel:", "#"];

export function localizeHref(locale: SiteLocale, href: string): string {
  if (EXTERNAL_PREFIXES.some((prefix) => href.startsWith(prefix))) {
    return href;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalized}`;
}

export function switchLocaleInPath(pathname: string, targetLocale: SiteLocale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${targetLocale}`;
  }

  segments[0] = targetLocale;
  return `/${segments.join("/")}`;
}
