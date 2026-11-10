import Link from "next/link";
import type { HomeContent, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";

interface HomeHeroProps {
  locale: SiteLocale;
  home: HomeContent;
}

export function HomeHero({ locale, home }: HomeHeroProps) {
  return (
    <section className="section-shell pt-6">
      <div className="hero-grid grid items-start gap-8">
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
          </div>
        </div>
      </div>
    </section>
  );
}
