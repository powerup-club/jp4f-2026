import type { Metadata } from "next";
import { ScenarioChallengePanel } from "@/components/application/ScenarioChallengePanel";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string }> = {
  fr: {
    badge: "Mini-jeu",
    title: "Scenario Challenge",
    subtitle: "Affronte un cas industriel, structure ta réponse et reçois une lecture expert."
  },
  en: {
    badge: "Mini game",
    title: "Scenario Challenge",
    subtitle: "Tackle an industrial case, structure your answer, and receive expert feedback."
  },
  ar: {
    badge: "لعبة مصغّرة",
    title: "تحدي السيناريو",
    subtitle: "واجه حالة صناعية ونظّم إجابتك ثم احصل على قراءة خبير."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/games/scenario`);
}

export default async function GamesScenarioPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <section className="section-shell space-y-6 py-6">
      <div className="rounded-[22px] border border-edge/60 bg-panel/88 p-6 shadow-halo backdrop-blur liquid-card">
        <div className="space-y-3">
          <p className="badge-line">{copy.badge}</p>
          <h1 className="font-display text-[clamp(32px,4.6vw,60px)] font-semibold uppercase leading-[0.95] text-ink">
            <span className="gradient-title">{copy.title}</span>
          </h1>
          <p className="max-w-3xl text-base text-ink/75 sm:text-lg">{copy.subtitle}</p>
        </div>
      </div>
      <div className="rounded-[22px] border border-edge/60 bg-panel/90 p-6 shadow-xl backdrop-blur liquid-card">
        <ScenarioChallengePanel locale={locale} />
      </div>
    </section>
  );
}
