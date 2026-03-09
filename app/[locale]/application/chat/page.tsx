import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getApplicantChat } from "@/applicant/data";
import { ApplicantChatPanel } from "@/components/application/ApplicantChatPanel";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    tag: string;
    title: string;
    subtitle: string;
    body: string;
    backToWorkspace: string;
    setupTitle: string;
    errorTitle: string;
  }
> = {
  fr: {
    tag: "// chat candidat",
    title: "Chat Candidat",
    subtitle: "Fil de discussion persistant rattache au dossier candidat.",
    body:
      "Cette page utilise Neon pour conserver les messages lies au compte Google connecte. Les reponses admin pourront se brancher sur la meme base.",
    backToWorkspace: "Retour a l'espace candidat",
    setupTitle: "Configuration Neon requise avant d'activer le chat.",
    errorTitle: "Le chargement du chat a echoue."
  },
  en: {
    tag: "// applicant chat",
    title: "Applicant Chat",
    subtitle: "Persistent discussion thread linked to the applicant record.",
    body:
      "This page uses Neon to store messages linked to the signed-in Google account. Admin replies can plug into the same data model.",
    backToWorkspace: "Back to workspace",
    setupTitle: "Neon setup is required before enabling chat.",
    errorTitle: "The chat could not be loaded."
  },
  ar: {
    tag: "// دردشة المترشح",
    title: "دردشة المترشح",
    subtitle: "خيط محادثة محفوظ مرتبط بملف المترشح.",
    body:
      "تستخدم هذه الصفحة Neon لحفظ الرسائل المرتبطة بحساب Google المتصل. ويمكن لاحقا ربط ردود الإدارة بنفس البنية.",
    backToWorkspace: "العودة إلى فضاء المترشح",
    setupTitle: "يجب إعداد Neon قبل تفعيل الدردشة.",
    errorTitle: "تعذر تحميل الدردشة."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const session = await auth().catch(() => null);

  if (!session?.user?.email) {
    redirect(`/auth/login?callbackUrl=%2F${locale}%2Fapplication%2Fchat`);
  }

  const chat = await getApplicantChat(session.user.email);
  const canSend = chat.setup.ready && !chat.error;

  return (
    <>
      <PageIntro tag={copy.tag} title={copy.title} subtitle={copy.subtitle} />
      <section className="section-shell mt-6 space-y-6 pb-20">
        <Reveal>
          <article className="glass-card p-6">
            <p className="text-base text-ink/72 sm:text-lg">{copy.body}</p>
          </article>
        </Reveal>

        {!chat.setup.ready ? (
          <Reveal>
            <article className="glass-card border border-accent/40 bg-accent/10 p-6 text-sm text-ink/75">
              <p className="font-display text-3xl font-semibold uppercase text-accent">
                {copy.setupTitle}
              </p>
              <div className="mt-4 space-y-2">
                {chat.setup.issues.map((issue) => (
                  <p key={issue}>{issue}</p>
                ))}
              </div>
            </article>
          </Reveal>
        ) : null}

        {chat.error ? (
          <Reveal>
            <article className="glass-card border border-rose/40 bg-rose/10 p-6 text-sm text-rose">
              {copy.errorTitle} {chat.error}
            </article>
          </Reveal>
        ) : null}

        <Reveal>
          <ApplicantChatPanel locale={locale} initialMessages={chat.messages} canSend={canSend} />
        </Reveal>

        <Reveal>
          <Link
            href={`/${locale}/application`}
            className="inline-flex rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
          >
            {copy.backToWorkspace}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
