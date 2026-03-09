import type { Metadata } from "next";
import type { SiteLocale } from "@/config/locales";
import { OG_IMAGE } from "@/config/site";
import { getSiteContent } from "@/content";

export function buildPageMetadata(locale: SiteLocale, title: string, description: string): Metadata {
  const site = getSiteContent(locale);
  return {
    title: `${title} | ${site.meta.siteName}`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: site.meta.siteName
        }
      ]
    },
    alternates: {
      canonical: `/${locale}`
    }
  };
}
