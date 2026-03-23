import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { ProgrammeTabs } from "@/components/ui/ProgrammeTabs";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Programme Innov'Industry 2026 | Journée de l'Innovation Industrielle & Technologique",
  description:
    "Consultez le programme Innov'Industry 2026 à l'ENSA Fès: conférences, masterclass, ateliers 17 & 18 avril 2026 et comment s'inscrire.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Innov'Industry 2026 - ENSA Fès" }],
  openGraph: {
    title: "Programme Innov'Industry 2026 | Journée de l'Innovation Industrielle & Technologique",
    description:
      "Consultez le programme Innov'Industry 2026 à l'ENSA Fès: conférences, masterclass, ateliers 17 & 18 avril 2026 et comment s'inscrire.",
    url: "https://enginov-days.vercel.app/[locale]/programme",
    siteName: "Innov'Industry 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://enginov-days.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Programme Innov'Industry 2026 | Journée de l'Innovation Industrielle & Technologique",
    description:
      "Consultez le programme Innov'Industry 2026 à l'ENSA Fès: conférences, masterclass, ateliers 17 & 18 avril 2026 et comment s'inscrire."
  },
  alternates: {
    canonical: "https://enginov-days.vercel.app/[locale]/programme"
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
