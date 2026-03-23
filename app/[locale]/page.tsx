import type { Metadata } from "next";
import { getSiteContent } from "@/content";
import { HomeIntro } from "@/components/intro/HomeIntro";
import { HomeHero } from "@/components/sections/HomeHero";
import { FilieresPreview } from "@/components/sections/FilieresPreview";
import { ClubsPreview } from "@/components/sections/ClubsPreview";
import { ChallengePanel } from "@/components/sections/ChallengePanel";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Innov'Industry 2026 ENSA Fès | Journée de l'Innovation Industrielle & Technologique",
  description:
    "Innov'Industry 2026 : 17 & 18 Avril à l'ENSA Fès. Journée de l'Innovation Industrielle & Technologique, programme, challenge Innov'Dom, intervenants et clubs organisateurs.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Innov'Industry 2026 - ENSA Fès" }],
  openGraph: {
    title: "Innov'Industry 2026 ENSA Fès | Journée de l'Innovation Industrielle & Technologique",
    description:
      "Innov'Industry 2026 : 17 & 18 Avril à l'ENSA Fès. Journée de l'Innovation Industrielle & Technologique, programme, challenge Innov'Dom, intervenants et clubs organisateurs.",
    url: "https://enginov-days.vercel.app/[locale]",
    siteName: "Innov'Industry 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://enginov-days.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Innov'Industry 2026 ENSA Fès | Journée de l'Innovation Industrielle & Technologique",
    description:
      "Innov'Industry 2026 : 17 & 18 Avril à l'ENSA Fès. Journée de l'Innovation Industrielle & Technologique, programme, challenge Innov'Dom, intervenants et clubs organisateurs."
  },
  alternates: {
    canonical: "https://enginov-days.vercel.app/[locale]"
  }
};

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <HomeIntro>
      <HomeHero locale={locale} home={content.home} />
      <FilieresPreview
        locale={locale}
        content={content.filieres}
        tag={content.home.filieresTag}
        title={content.home.filieresTitle}
        subtitle={content.home.filieresSubtitle}
      />
      <ClubsPreview
        locale={locale}
        content={content.clubsPage}
        tag={content.home.clubsTag}
        title={content.home.clubsTitle}
        subtitle={content.home.clubsSubtitle}
      />
      <ChallengePanel locale={locale} home={content.home} />
    </HomeIntro>
  );
}
