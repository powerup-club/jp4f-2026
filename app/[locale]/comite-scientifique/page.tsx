import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(
    locale,
    content.comiteScientifique.title,
    content.comiteScientifique.subtitle,
    `/${locale}/comite-scientifique`
  );
}

export default async function ComiteScientifiquePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <PageIntro
        tag={content.comiteScientifique.tag}
        title={content.comiteScientifique.title}
        subtitle={content.comiteScientifique.subtitle}
      />
      <section className="section-shell mt-8">
        <div className="auto-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.comiteScientifique.members.map((member) => (
            <Reveal key={`${member.name}-${member.role}`}>
              <article className="glass-card h-full p-5">
                <h2 className="font-display text-3xl font-semibold uppercase text-ink">{member.name}</h2>
                <p className="mt-2 font-display text-2xl font-semibold text-accent">{member.role}</p>
                <p className="mt-2 text-base text-ink/70">{member.club}</p>
                {member.track ? <p className="mt-2 text-base text-ink/65">{member.track}</p> : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

