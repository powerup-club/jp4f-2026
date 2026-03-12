import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.comite.title, content.comite.subtitle, `/${locale}/comite`);
}

export default async function ComitePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <PageIntro tag={content.comite.tag} title={content.comite.title} subtitle={content.comite.subtitle} />
      <section className="section-shell mt-8">
        <div className="auto-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.comite.members.map((member) => {
            const isLeader = /chef|coordinateur|coordinatrice/i.test(member.role);
            const isCoordinator = member.name === "Hicham HIHI" || member.name === "Mhamed SAYYOURI" || member.name === "Jamila EL HAINI" || member.name === "Souad ELKHATTABI";

            return (
              <Reveal key={`${member.name}-${member.role}`}>
                <article
                  className={`glass-card relative h-full p-6 ${
                    isCoordinator 
                      ? "border-l-4 border-accent bg-gradient-to-br from-accent/10 to-panel/80 shadow-lg" 
                      : isLeader 
                      ? "border-accent/30 bg-panel/80 shadow-card" 
                      : ""
                  }`}
                >
                  {isCoordinator ? <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-accent" /> : isLeader ? <span className="absolute left-5 top-5 h-1 w-10 rounded-full bg-accent" /> : null}
                  <h2 className="font-display text-3xl font-semibold uppercase text-ink">{member.name}</h2>
                  <p className="mt-2 font-display text-2xl font-semibold text-accent">{member.role}</p>
                  <p className="mt-2 text-base text-ink/70">{member.club}</p>
                  {member.track ? <p className="mt-2 text-base text-ink/65">{member.track}</p> : null}
                  {member.email ? (
                    <a
                      className="mt-3 inline-flex text-sm text-ink/75 underline decoration-dotted underline-offset-4 hover:text-accent"
                      href={`mailto:${member.email}`}
                    >
                      {member.email}
                    </a>
                  ) : null}
                  {member.links && member.links.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.links.map((link) => (
                        <a
                          key={`${member.name}-${link.label}`}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-edge/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-ink/70 transition hover:border-accent hover:text-accent"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

