import type { Metadata } from "next";
import { IndustryQuizGame } from "@/components/application/IndustryQuizGame";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string }> = {
  fr: {
    badge: "Mini jeu",
    title: "Quiz Industrie 4.0",
    subtitle: "Teste ta culture industrielle et compare ton score au classement du portail."
  },
  en: {
    badge: "Mini game",
    title: "Industry 4.0 Quiz",
    subtitle: "Test your industrial knowledge and compare your score with the portal leaderboard."
  },
  ar: {
    badge: "لعبة مصغرة",
    title: "اختبار الصناعة 4.0",
    subtitle: "اختبر ثقافتك الصناعية وقارن نتيجتك بترتيب البوابة."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/application/games/quiz`);
}

export default async function ApplicantGamesQuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />
      <IndustryQuizGame locale={locale} />
    </>
  );
}
