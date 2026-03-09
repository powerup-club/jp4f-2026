import type { Metadata } from "next";
import { getSiteContent } from "@/content";
import { HomeHero } from "@/components/sections/HomeHero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { FilieresPreview } from "@/components/sections/FilieresPreview";
import { ClubsPreview } from "@/components/sections/ClubsPreview";
import { ChallengePanel } from "@/components/sections/ChallengePanel";
import { Reveal } from "@/components/ui/Reveal";
import { OrientationQuiz } from "@/components/quiz/OrientationQuiz";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";
import type { SiteLocale } from "@/content/types";

function quizHomeCopy(locale: SiteLocale) {
  if (locale === "en") {
    return {
      badge: "// top orientation tool",
      title: "Find Your Engineering Profile",
      subtitle: "Take the adaptive quiz now and get your recommended branch in a few minutes."
    };
  }

  if (locale === "ar") {
    return {
      badge: "// اختبار التوجيه الرئيسي",
      title: "اكتشف ملفك الهندسي",
      subtitle: "ابدأ الاختبار التفاعلي الآن واحصل على المسلك الأنسب لك خلال دقائق."
    };
  }

  return {
    badge: "// outil d'orientation principal",
    title: "Trouve Ton Profil Ingenieur",
    subtitle: "Fais le quiz adaptatif maintenant et decouvre la filiere recommandee en quelques minutes."
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.home.subtitle, content.meta.description);
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  const quiz = quizHomeCopy(locale);

  return (
    <>
      <HomeHero locale={locale} home={content.home} />
      <section id="orientation-quiz" className="section-shell mt-8 space-y-4">
        <Reveal>
          <article className="rounded-2xl border border-edge/70 bg-panel/85 p-6 backdrop-blur">
            <p className="badge-line">{quiz.badge}</p>
            <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-tight text-ink sm:text-5xl">
              <span className="gradient-title">{quiz.title}</span>
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-ink/75">{quiz.subtitle}</p>
          </article>
        </Reveal>
        <Reveal>
          <OrientationQuiz locale={locale} />
        </Reveal>
      </section>
      <StatsStrip stats={content.home.stats} />
      <FilieresPreview
        locale={locale}
        content={content.filieres}
        tag={content.home.filieresTag}
        title={content.home.filieresTitle}
        subtitle={content.home.filieresSubtitle}
      />
      <ClubsPreview
        locale={locale}
        content={content.clubsPage}
        tag={content.home.clubsTag}
        title={content.home.clubsTitle}
        subtitle={content.home.clubsSubtitle}
      />
      <ChallengePanel locale={locale} home={content.home} />
    </>
  );
}
