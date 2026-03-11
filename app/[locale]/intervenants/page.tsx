import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.intervenants.title, content.intervenants.subtitle, `/${locale}/intervenants`);
}

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
