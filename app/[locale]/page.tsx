import type { Metadata } from "next";
import { getSiteContent } from "@/content";
import { HomeIntro } from "@/components/intro/HomeIntro";
import { HomeHero } from "@/components/sections/HomeHero";
import { FilieresPreview } from "@/components/sections/FilieresPreview";
import { ClubsPreview } from "@/components/sections/ClubsPreview";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return {
    ...buildPageMetadata(
      locale,
      content.meta.siteName,
      content.meta.description,
      `/${locale}`
    ),
    keywords: SEO_KEYWORDS
  };
}

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
    </HomeIntro>
  );
}
