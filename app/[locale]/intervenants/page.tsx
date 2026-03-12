import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Intervenants JP4F 2026 | Conférences ENSA Fès",
  description:
    "Rencontrez les intervenants JP4F 2026: conférence ENSA Fès 2026, experts industrie 4.0 Maroc, forum étudiant ENSA Fès et masterclass ingénieur Maroc à Fès.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "JESI - Club Étudiant ENSA Fès" }],
  openGraph: {
    title: "Intervenants JP4F 2026 | Conférences ENSA Fès",
    description:
      "Rencontrez les intervenants JP4F 2026: conférence ENSA Fès 2026, experts industrie 4.0 Maroc, forum étudiant ENSA Fès et masterclass ingénieur Maroc à Fès.",
    url: "https://jp4f.vercel.app/[locale]/intervenants",
    siteName: "JP4F 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://jp4f.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Intervenants JP4F 2026 | Conférences ENSA Fès",
    description:
      "Rencontrez les intervenants JP4F 2026: conférence ENSA Fès 2026, experts industrie 4.0 Maroc, forum étudiant ENSA Fès et masterclass ingénieur Maroc à Fès."
  },
  alternates: {
    canonical: "https://jp4f.vercel.app/[locale]/intervenants"
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
        <div className="auto-grid grid gap-4 md:grid-cols-2">
          {content.intervenants.speakers.map((speaker) => (
            <Reveal key={speaker.name}>
              <article className="glass-card h-full p-6">
                <div className="flex items-start gap-4">
                  {speaker.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="h-20 w-20 rounded-2xl border border-edge bg-panel/70 object-cover"
                    />
                  ) : (
                    <div className="grid h-20 w-20 place-items-center rounded-2xl border border-edge bg-panel/70 font-display text-4xl font-semibold text-accent">
                      ?
                    </div>
                  )}
                  <div>
                    <h2 className="font-display text-3xl font-semibold uppercase text-ink">{speaker.name}</h2>
                    <p className="mt-1 font-display text-2xl font-semibold text-accent">{speaker.role}</p>
                    <p className="mt-1 text-base text-ink/65">{speaker.affiliation}</p>
                  </div>
                </div>
                <p className="mt-4 text-base text-ink/75">{speaker.topic}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
