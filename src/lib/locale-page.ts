import { notFound } from "next/navigation";
import { isSiteLocale, type SiteLocale } from "@/config/locales";

export async function getValidatedLocale(params: Promise<{ locale: string }>): Promise<SiteLocale> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) {
    notFound();
  }
  return locale;
}
