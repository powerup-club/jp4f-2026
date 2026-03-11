import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { ClubsAccordion } from "@/components/sections/ClubsAccordion";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.clubsPage.title, content.clubsPage.subtitle, `/${locale}/clubs`);
}

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
