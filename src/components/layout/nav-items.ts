import type { NavigationItem } from "@/content/types";
import type { SiteLocale } from "@/config/locales";

const PORTAL_ITEM_BY_LOCALE: Record<SiteLocale, NavigationItem> = {
  fr: {
    href: "/application",
    label: "Portail",
    shortLabel: "Portail"
  },
  en: {
    href: "/application",
    label: "Portal",
    shortLabel: "Portal"
  },
  ar: {
    href: "/application",
    label: "البوابة",
    shortLabel: "بوابة"
  }
};

export function withPortalNavItem(locale: SiteLocale, items: NavigationItem[]): NavigationItem[] {
  if (items.some((item) => item.href === "/application")) {
    return items;
  }

  return [...items, PORTAL_ITEM_BY_LOCALE[locale]];
}

export function isLocalizedNavItemActive(pathname: string, localizedHref: string): boolean {
  const segments = localizedHref.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return pathname === localizedHref;
  }

  return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
}
