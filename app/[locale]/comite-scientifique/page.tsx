import type { Metadata } from "next";
import Link from "next/link";
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
  const headStyleMap: Record<string, string> = {
    "Hicham HIHI": "from-amber-500/90 to-rose-500/90",
    "Mhamed SAYYOURI": "from-sky-500/80 to-indigo-500/80",
    "Jamila EL HAINI": "from-emerald-500/80 to-lime-500/80",
    "Souad ELKHATTABI": "from-fuchsia-500/80 to-pink-500/80"
  };
  const headMembers = content.comiteScientifique.members.filter((member) => headStyleMap[member.name]);
  const rosterMembers = content.comiteScientifique.members.filter((member) => !headStyleMap[member.name]);

  return (
    <>
      <PageIntro
        tag={content.comiteScientifique.tag}
        title={content.comiteScientifique.title}
        subtitle={content.comiteScientifique.subtitle}
      />
      {headMembers.length > 0 && (
        <section className="section-shell mt-8">
          <div className="flex w-full flex-wrap items-stretch gap-4">
            {headMembers.map((member) => (
              <article
                key={`${member.name}-head`}
                className={`flex min-w-[260px] flex-1 flex-col rounded-[2.5rem] border border-white/10 bg-gradient-to-br p-6 text-white shadow-2xl transition hover:scale-[1.01] ${headStyleMap[member.name]}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/80">
                  Responsable scientifique
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase">{member.name}</h2>
                <p className="mt-1 font-display text-lg font-semibold leading-tight">{member.role}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">{member.club}</p>
                <p className="mt-3 text-sm text-white/80">{member.email}</p>
                {member.links?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-white">
                    {member.links.map((link) => (
                      <Link key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/30 px-3 py-1.5 text-[0.65rem] tracking-[0.3em]">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="section-shell mt-8">
        <div className="auto-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rosterMembers.map((member) => (
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

