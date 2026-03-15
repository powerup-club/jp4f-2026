import type { Metadata } from "next";
import { IndustryQuizGame } from "@/components/application/IndustryQuizGame";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string }> = {
  fr: {
    badge: "Mini-jeu",
    title: "Quiz Industrie 4.0",
    subtitle: "Teste ta culture industrielle et compare ton score au classement public."
  },
  en: {
    badge: "Mini game",
    title: "Industry 4.0 Quiz",
    subtitle: "Test your industrial knowledge and compare your score with the public ranking."
  },
  ar: {
    badge: "لعبة مصغّرة",
    title: "اختبار الصناعة 4.0",
    subtitle: "اختبر ثقافتك الصناعية وقارن نتيجتك بالترتيب العام."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/games/quiz`);
}

export default async function GamesQuizPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <IndustryQuizGame locale={locale} />
      </div>
    </section>
  );
}
