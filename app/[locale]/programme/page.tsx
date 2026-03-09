import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { ProgrammeTabs } from "@/components/ui/ProgrammeTabs";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.programme.title, content.programme.subtitle);
}

export default async function ProgrammePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <PageIntro tag={content.programme.tag} title={content.programme.title} subtitle={content.programme.subtitle} />
      <section className="section-shell mt-8">
        <Reveal>
          <ProgrammeTabs
            day1Label={content.programme.day1Label}
            day2Label={content.programme.day2Label}
            day1={content.programme.day1}
            day2={content.programme.day2}
          />
        </Reveal>
      </section>
    </>
  );
}
