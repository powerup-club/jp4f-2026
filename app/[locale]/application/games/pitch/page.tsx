import type { Metadata } from "next";
import { PitchPracticePanel } from "@/components/application/PitchPracticePanel";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string }> = {
  fr: {
    badge: "Mini game",
    title: "Pitch Timer",
    subtitle: "Chronometre ta presentation puis demande un retour jury sur la clarte, la structure et l'impact."
  },
  en: {
    badge: "Mini game",
    title: "Pitch Timer",
    subtitle: "Time your presentation and request jury-style feedback on clarity, structure, and impact."
  },
  ar: {
    badge: "Mini game",
    title: "Pitch Timer",
    subtitle: "قِس عرضك ثم اطلب رأيا شبيها باللجنة حول الوضوح والبنية والأثر."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantGamesPitchPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />
      <PitchPracticePanel locale={locale} />
    </>
  );
}
