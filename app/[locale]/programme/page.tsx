import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { ProgrammeTabs } from "@/components/ui/ProgrammeTabs";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Programme JP4F 2026 | Journée pédagogique ENSA Fès",
  description:
    "Consultez le programme journée pédagogique ENSA Fès 2026: conférences, masterclass, atelier CV ingénieur Maroc, forum ingénierie Fès 2026 et JP4F programme.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "JESI - Club Étudiant ENSA Fès" }],
  openGraph: {
    title: "Programme JP4F 2026 | Journée pédagogique ENSA Fès",
    description:
      "Consultez le programme journée pédagogique ENSA Fès 2026: conférences, masterclass, atelier CV ingénieur Maroc, forum ingénierie Fès 2026 et JP4F programme.",
    url: "https://jp4f.vercel.app/[locale]/programme",
    siteName: "JP4F 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://jp4f.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Programme JP4F 2026 | Journée pédagogique ENSA Fès",
    description:
      "Consultez le programme journée pédagogique ENSA Fès 2026: conférences, masterclass, atelier CV ingénieur Maroc, forum ingénierie Fès 2026 et JP4F programme."
  },
  alternates: {
    canonical: "https://jp4f.vercel.app/[locale]/programme"
  }
};

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
