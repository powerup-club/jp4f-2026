import type { Metadata } from "next";
import type { SiteLocale } from "@/config/locales";
import { OG_IMAGE, SITE_AUTHOR, SITE_PUBLISHER } from "@/config/site";
import { getSiteContent } from "@/content";

export function buildPageMetadata(
  locale: SiteLocale,
  title: string,
  description: string,
  pathname: string = `/${locale}`
): Metadata {
  const site = getSiteContent(locale);
  const canonicalPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return {
    title: `${title} | ${site.meta.siteName}`,
    description,
    authors: [{ name: SITE_AUTHOR }],
    creator: SITE_AUTHOR,
    publisher: SITE_PUBLISHER,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalPath,
      siteName: site.meta.siteName,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: site.meta.siteName
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE]
    },
    alternates: {
      canonical: canonicalPath
    }
  };
}
