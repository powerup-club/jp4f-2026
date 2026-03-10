import type { Metadata } from "next";
import { ScenarioChallengePanel } from "@/components/application/ScenarioChallengePanel";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string }> = {
  fr: {
    badge: "Mini game",
    title: "Scenario Challenge",
    subtitle: "Affronte un cas industriel, structure ta reponse et recois une lecture expert."
  },
  en: {
    badge: "Mini game",
    title: "Scenario Challenge",
    subtitle: "Tackle an industrial case, structure your answer, and receive expert feedback."
  },
  ar: {
    badge: "Mini game",
    title: "Scenario Challenge",
    subtitle: "واجه حالة صناعية ونظم إجابتك ثم احصل على قراءة خبير."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantGamesScenarioPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />
      <ScenarioChallengePanel locale={locale} />
    </>
  );
}
