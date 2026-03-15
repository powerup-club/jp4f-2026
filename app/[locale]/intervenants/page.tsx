import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Intervenants Innov'Industry 2026 | Conférences ENSA Fès",
  description:
    "Rencontrez les intervenants Innov'Industry 2026: conférence ENSA Fès 2026, experts industrie 4.0 Maroc, forum étudiant ENSA Fès et masterclass ingénieur Maroc à Fès.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Innov'Industry 2026 - ENSA Fès" }],
  openGraph: {
    title: "Intervenants Innov'Industry 2026 | Conférences ENSA Fès",
    description:
      "Rencontrez les intervenants Innov'Industry 2026: conférence ENSA Fès 2026, experts industrie 4.0 Maroc, forum étudiant ENSA Fès et masterclass ingénieur Maroc à Fès.",
    url: "https://enginov-days.vercel.app/[locale]/intervenants",
    siteName: "Innov'Industry 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://enginov-days.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Intervenants Innov'Industry 2026 | Conférences ENSA Fès",
    description:
      "Rencontrez les intervenants Innov'Industry 2026: conférence ENSA Fès 2026, experts industrie 4.0 Maroc, forum étudiant ENSA Fès et masterclass ingénieur Maroc à Fès."
  },
  alternates: {
    canonical: "https://enginov-days.vercel.app/[locale]/intervenants"
  }
};

export default async function IntervenantsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <PageIntro
        tag={content.intervenants.tag}
        title={content.intervenants.title}
        subtitle={content.intervenants.subtitle}
      />
      <section className="section-shell mt-8">
        <Reveal>
          <article className="glass-card p-8">
            <p className="badge-line">Programme en préparation</p>
            <h2 className="mt-4 font-display text-4xl font-semibold uppercase text-ink">
              Intervenants en cours de confirmation
            </h2>
            <p className="mt-4 max-w-2xl text-base text-ink/75 sm:text-lg">
              Nous finalisons la liste des conférenciers et intervenants. Les annonces seront publiées
              prochainement dès confirmation officielle.
            </p>
          </article>
        </Reveal>
      </section>
    </>
  );
}
