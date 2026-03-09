export const SITE_LOCALES = ["fr", "en", "ar"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export const DEFAULT_LOCALE: SiteLocale = "fr";

export const LOCALE_LABELS: Record<SiteLocale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية"
};

const RTL_LOCALES: SiteLocale[] = ["ar"];

export function isSiteLocale(value: string): value is SiteLocale {
  return SITE_LOCALES.includes(value as SiteLocale);
}

export function isRtlLocale(locale: SiteLocale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function localeDirection(locale: SiteLocale): "ltr" | "rtl" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

export function resolveLocaleFromPathname(pathname: string): SiteLocale | null {
  const maybeLocale = pathname.split("/").filter(Boolean)[0] ?? "";
  return isSiteLocale(maybeLocale) ? maybeLocale : null;
}
