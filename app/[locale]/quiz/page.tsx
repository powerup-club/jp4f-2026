import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";
import { OrientationQuiz } from "@/components/quiz/OrientationQuiz";
import type { SiteLocale } from "@/config/locales";

const QUIZ_PAGE_COPY: Record<SiteLocale, { tag: string; title: string; subtitle: string }> = {
  fr: {
    tag: "// orientation IA",
    title: "Quiz D'Orientation",
    subtitle: "Un parcours intelligent pour t'aider a choisir la filiere qui correspond vraiment a ton profil."
  },
  en: {
    tag: "// AI orientation",
    title: "Orientation Quiz",
    subtitle: "An adaptive flow designed to match your profile with the right engineering branch."
  },
  ar: {
    tag: "// توجيه ذكي",
    title: "اختبار التوجيه",
    subtitle: "مسار تفاعلي ذكي يساعدك على اختيار المسلك الهندسي المناسب لشخصيتك."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = QUIZ_PAGE_COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/quiz`);
}

export default async function QuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = QUIZ_PAGE_COPY[locale];

  return (
    <>
      <PageIntro tag={copy.tag} title={copy.title} subtitle={copy.subtitle} />
      <section className="section-shell mt-6 space-y-4 pb-20">
        <Reveal>
          <OrientationQuiz locale={locale} />
        </Reveal>
      </section>
    </>
  );
}
