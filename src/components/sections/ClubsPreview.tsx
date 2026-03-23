import Link from "next/link";
import type { ClubsContent, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { Reveal } from "@/components/ui/Reveal";

interface ClubsPreviewProps {
  locale: SiteLocale;
  content: ClubsContent;
  tag: string;
  title: string;
  subtitle: string;
}

export function ClubsPreview({ locale, content, tag, title, subtitle }: ClubsPreviewProps) {
  return (
    <section className="section-shell mt-16">
      <Reveal>
        <p className="badge-line">{tag}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold uppercase sm:text-5xl">
          <span className="gradient-title">{title}</span>
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-ink/72">{subtitle}</p>

        <div className="mt-7 auto-grid grid gap-4 md:grid-cols-3">
          {content.clubs.map((club) => (
            <Link
              key={club.id}
              href={localizeHref(locale, "/clubs") + `#${club.id}`}
              className="glass-card liquid-card flex flex-col items-center p-5 text-center transition hover:-translate-y-1 hover:border-accent/85"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={club.logo} alt={club.name} className="h-20 w-20 rounded-2xl border border-edge/75 bg-white/40 p-2" />
              <h3 className="mt-4 font-display text-2xl font-semibold uppercase">{club.name}</h3>
              <p className="mt-2 text-base text-ink/70">{club.tagline}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
