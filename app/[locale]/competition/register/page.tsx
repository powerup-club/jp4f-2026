import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CompetitionRegisterForm } from "@/components/forms/CompetitionRegisterForm";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { tag: string; title: string; subtitle: string }> = {
  fr: {
    tag: "// inscription innov-dom",
    title: "Formulaire De Candidature",
    subtitle: "Complete ton dossier Innov'Dom directement sur le site JESI."
  },
  en: {
    tag: "// innov-dom registration",
    title: "Challenge Registration",
    subtitle: "Complete your Innov'Dom application directly inside the JESI website."
  },
  ar: {
    tag: "// تسجيل innov-dom",
    title: "استمارة الترشح",
    subtitle: "أكمل ملف Innov'Dom مباشرة داخل موقع JESI."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function CompetitionRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const session = await auth().catch(() => null);

  if (!session?.user?.email) {
    redirect(`/auth/login?callbackUrl=%2F${locale}%2Fcompetition%2Fregister`);
  }

  return (
    <>
      <PageIntro tag={copy.tag} title={copy.title} subtitle={copy.subtitle} />
      <section className="section-shell mt-6 pb-20">
        <Reveal>
          <article className="glass-card mb-4 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
              Google connecte
            </p>
            <p className="mt-2 text-sm text-ink/72 sm:text-base">
              {session.user.name || session.user.email}
            </p>
          </article>
        </Reveal>
        <Reveal>
          <CompetitionRegisterForm
            locale={locale}
            initialFullName={session.user.name || ""}
            initialEmail={session.user.email || ""}
          />
        </Reveal>
      </section>
    </>
  );
}
