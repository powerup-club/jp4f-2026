import Link from "next/link";
import type { HomeContent, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { Countdown } from "@/components/ui/Countdown";
import { EVENT_DATE_ISO } from "@/config/site";

interface HomeHeroProps {
  locale: SiteLocale;
  home: HomeContent;
}

export function HomeHero({ locale, home }: HomeHeroProps) {
  return (
    <section className="section-shell pt-6">
      <div className="hero-grid grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="badge-line">{home.tag}</p>
          <p className="mt-5 inline-flex rounded-full border border-edge/75 bg-panel/70 px-4 py-1.5 font-display text-base uppercase tracking-[0.1em] text-ink/78">
            {home.badge}
          </p>
          <h1 className="mt-6 font-display text-6xl font-semibold uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
            {home.title}
            <span className="gradient-title block">{home.titleAccent}</span>
          </h1>
          <p className="mt-4 text-xl font-semibold text-ink/90 sm:text-2xl">{home.subtitle}</p>
          <p className="mt-3 max-w-2xl text-lg text-ink/72 sm:text-xl">{home.slogan}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizeHref(locale, home.primaryCta.href)}
              className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
            >
              {home.primaryCta.label}
            </Link>
            <Link
              href={localizeHref(locale, home.secondaryCta.href)}
              className="rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
            >
              {home.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <Countdown
            targetIso={EVENT_DATE_ISO}
            label={home.countdownLabel}
            endedLabel={home.challengeSubtitle}
          />

          <div className="glass-card p-5">
            <ul className="space-y-3 text-base text-ink/75">
              <li>{home.dateLabel}</li>
              <li>{home.locationLabel}</li>
              <li>{home.challengeLabel}</li>
              <li>{home.clubsLabel}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
