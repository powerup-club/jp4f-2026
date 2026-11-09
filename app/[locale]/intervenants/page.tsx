import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { SpeakerPortrait } from "@/components/sections/SpeakerPortrait";
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
    fr: { biography: "Biographie", intervention: "Intervention" },
    en: { biography: "Biography", intervention: "Talk" },
    ar: { biography: "نبذة", intervention: "المداخلة" }
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
              <article className="glass-card flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  <SpeakerPortrait name={speaker.name} image={speaker.image} />
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl font-semibold uppercase text-ink">{speaker.name}</h2>
                    <p className="mt-2 text-sm font-medium text-accent">{speaker.role}</p>
                    <p className="mt-1 text-sm text-ink/65">{speaker.affiliation}</p>
                  </div>
                </div>

                {speaker.intervention || speaker.topic ? (
                  <div className="mt-6 rounded-2xl border border-edge/60 bg-panel/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {labels.intervention}
                    </p>
                    <p className="mt-2 text-sm text-ink/80">{speaker.intervention ?? speaker.topic}</p>
                  </div>
                ) : null}

                {speaker.biography ? (
                  <div className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
                      {labels.biography}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-ink/75">{speaker.biography}</p>
                  </div>
                ) : null}

                {speaker.links?.length ? (
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {speaker.links.map((link) => (
                      <a
                        key={`${speaker.name}-${link.href}`}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="rounded-full border border-edge/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70 transition hover:border-accent hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
