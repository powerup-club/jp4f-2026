import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { ClubsAccordion } from "@/components/sections/ClubsAccordion";
import { getSiteContent } from "@/content";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Clubs étudiants ENSA Fès | Innov'Industry 2026",
  description:
    "Explorez les clubs étudiants ENSA Fès, association étudiante ENSA Fès: PowerUP, IEC, Mechatronics Trendz, vie étudiante ENSA Fès et workshop étudiant Fès.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Innov'Industry 2026 - ENSA Fès" }],
  openGraph: {
    title: "Clubs étudiants ENSA Fès | Innov'Industry 2026",
    description:
      "Explorez les clubs étudiants ENSA Fès, association étudiante ENSA Fès: PowerUP, IEC, Mechatronics Trendz, vie étudiante ENSA Fès et workshop étudiant Fès.",
    url: "https://enginov-days.vercel.app/[locale]/clubs",
    siteName: "Innov'Industry 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://enginov-days.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Clubs étudiants ENSA Fès | Innov'Industry 2026",
    description:
      "Explorez les clubs étudiants ENSA Fès, association étudiante ENSA Fès: PowerUP, IEC, Mechatronics Trendz, vie étudiante ENSA Fès et workshop étudiant Fès."
  },
  alternates: {
    canonical: "https://enginov-days.vercel.app/[locale]/clubs"
  }
};

export default async function ClubsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <PageIntro tag={content.clubsPage.tag} title={content.clubsPage.title} subtitle={content.clubsPage.subtitle} />
      <section className="section-shell mt-8">
        <ClubsAccordion clubs={content.clubsPage.clubs} locale={locale} />
      </section>
    </>
  );
}
