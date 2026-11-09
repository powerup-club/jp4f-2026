import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { SpeakerCard } from "@/components/sections/SpeakerCard";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { FRENCH_2026_SPEAKERS } from "@/content/intervenants";
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
  const speakers = locale === "fr" ? FRENCH_2026_SPEAKERS : content.intervenants.speakers;
  const labels = {
    fr: {
      biography: "Biographie",
      intervention: "Intervention",
      details: "Présentation",
      showDetails: "Découvrir la biographie",
      hideDetails: "Retour à la fiche"
    },
    en: {
      biography: "Biography",
      intervention: "Talk",
      details: "About",
      showDetails: "View details",
      hideDetails: "Back to profile"
    },
    ar: {
      biography: "نبذة",
      intervention: "المداخلة",
      details: "نبذة",
      showDetails: "عرض التفاصيل",
      hideDetails: "العودة إلى البطاقة"
    }
  }[locale];

  return (
    <>
      <PageIntro
        tag={content.intervenants.tag}
        title={content.intervenants.title}
        subtitle={content.intervenants.subtitle}
      />
      <section className="section-shell mt-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {speakers.map((speaker) => (
            <Reveal key={speaker.name} className="h-full">
              <SpeakerCard speaker={speaker} labels={labels} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
