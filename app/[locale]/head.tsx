import { DEFAULT_LOCALE, isSiteLocale } from "@/config/locales";
import {
  EVENT_DATE_ISO,
  EVENT_LOCATION,
  EVENT_TITLE,
  OG_IMAGE,
  SITE_CONTACT_PHONE
} from "@/config/site";
import { getSiteContent } from "@/content";
import { getSiteUrl } from "@/lib/site-url";

export default async function Head({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isSiteLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const content = getSiteContent(locale);
  const siteUrl = getSiteUrl();
  const logoUrl = new URL(OG_IMAGE, siteUrl).toString();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.meta.siteName,
    url: siteUrl,
    description: content.meta.description,
    logo: logoUrl,
    address: EVENT_LOCATION,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONTACT_PHONE,
      contactType: "information",
      availableLanguage: ["fr", "en", "ar"]
    }
  };

  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENT_TITLE,
    startDate: EVENT_DATE_ISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "ENSA Fes",
      address: EVENT_LOCATION
    },
    organizer: {
      "@type": "Organization",
      name: content.meta.siteName,
      url: siteUrl
    },
    description: content.meta.description,
    image: [logoUrl],
    url: siteUrl
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }} />
    </>
  );
}
