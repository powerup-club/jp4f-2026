import Link from "next/link";
import type { HomeContent, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { Countdown } from "@/components/ui/Countdown";
import { EVENT_DATE_ISO } from "@/config/site";

interface HomeHeroProps {
  locale: SiteLocale;
  home: HomeContent;
}

function registerLabelByLocale(locale: SiteLocale): string {
  if (locale === "en") return "Register for Innov'Dom";
  if (locale === "ar") return "التسجيل في Innov'Dom";
  return "S'inscrire à Innov'Dom";
}

export function HomeHero({ locale, home }: HomeHeroProps) {
  return (
    <section className="section-shell pt-6">
      <div className="hero-grid grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="badge-line">{home.tag}</p>
          <h1 className="mt-6 font-display text-6xl font-semibold uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
            {home.title}
            <span className="gradient-title block">{home.titleAccent}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink/72 sm:text-xl">{home.slogan}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizeHref(locale, home.primaryCta.href)}
              className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
            >
              {home.primaryCta.label}
            </Link>
            <Link
              href={localizeHref(locale, "/application")}
              className="rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
            >
              {registerLabelByLocale(locale)}
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <Link href={home.registrationHighlight.ctaHref} target="_blank" rel="noreferrer" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel">
            <Countdown targetIso={EVENT_DATE_ISO} label={home.countdownLabel} endedLabel={home.challengeSubtitle} />
          </Link>

          <Link
            href={home.registrationHighlight.ctaHref}
            target="_blank"
            rel="noreferrer"
            className="glass-card liquid-card shadow-2xl space-y-4 p-6 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink/55">Deadline</p>
            <p className="text-2xl font-semibold text-ink">{home.registrationHighlight.deadlineLabel}</p>
            <span className="inline-flex w-full items-center justify-center rounded-full border border-edge/75 bg-panel/90 px-5 py-3 text-center font-display text-lg uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:text-accent">
              {home.registrationHighlight.ctaLabel}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
