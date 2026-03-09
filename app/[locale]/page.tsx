import type { Metadata } from "next";
import { getSiteContent } from "@/content";
import { HomeHero } from "@/components/sections/HomeHero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { FilieresPreview } from "@/components/sections/FilieresPreview";
import { ClubsPreview } from "@/components/sections/ClubsPreview";
import { ChallengePanel } from "@/components/sections/ChallengePanel";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.home.subtitle, content.meta.description);
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <HomeHero locale={locale} home={content.home} />
      <StatsStrip stats={content.home.stats} />
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
    </>
  );
}
