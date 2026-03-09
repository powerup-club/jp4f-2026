import Link from "next/link";
import type { HomeContent, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { Reveal } from "@/components/ui/Reveal";

interface ChallengePanelProps {
  locale: SiteLocale;
  home: HomeContent;
}

export function ChallengePanel({ locale, home }: ChallengePanelProps) {
  return (
    <section className="section-shell mt-16">
      <Reveal>
        <div className="glass-card overflow-hidden p-7 sm:p-10">
          <p className="badge-line">{home.challengeTag}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold uppercase sm:text-5xl">
            <span className="gradient-title">{home.challengeTitle}</span>
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-ink/75">{home.challengeSubtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={localizeHref(locale, "/competition")}
              className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white transition hover:bg-accent2"
            >
              {home.secondaryCta.label}
            </Link>
            <Link
              href={localizeHref(locale, "/programme")}
              className="rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
            >
              {home.primaryCta.label}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
