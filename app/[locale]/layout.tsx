import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { getSiteContent } from "@/content";
import { DEFAULT_LOCALE, SITE_LOCALES, isSiteLocale, localeDirection } from "@/config/locales";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SITE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isSiteLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const content = getSiteContent(locale);

  return {
    title: {
      default: content.meta.siteName,
      template: `%s | ${content.meta.siteName}`
    },
    description: content.meta.description
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale;
  const content = getSiteContent(locale);
  const direction = localeDirection(locale);

  return (
    <div lang={locale} dir={direction} data-locale-dir={direction} className="relative min-h-screen text-ink">
      <BackgroundCanvas />
      <Header locale={locale} nav={content.navigation} siteName={content.meta.siteName} />
      <main className="relative z-10 pb-28 pt-24 lg:pb-8">{children}</main>
      <Footer locale={locale} content={content.footer} />
      <MobileNav locale={locale} items={content.mobileNavigation} />
    </div>
  );
}
