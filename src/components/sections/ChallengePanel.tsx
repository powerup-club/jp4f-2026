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
        <Link
          href={localizeHref(locale, "/competition")}
          className="glass-card liquid-card overflow-hidden p-7 shadow-2xl sm:p-10 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
        >
          <p className="badge-line">{home.challengeTag}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold uppercase sm:text-5xl">
            <span className="gradient-title">{home.challengeTitle}</span>
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-ink/75">{home.challengeSubtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white transition">
              {home.secondaryCta.label}
            </span>
            <span className="rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition">
              {home.primaryCta.label}
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
