import type { Metadata } from "next";
import { getApplicantAiChat } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import { ApplicantAiChatPanel } from "@/components/application/ApplicantAiChatPanel";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    title: string;
    subtitle: string;
    setupTitle: string;
    schemaTitle: string;
  }
> = {
  fr: {
    title: "Chat IA",
    subtitle: "Assistant Groq persistant, rattache a ton espace candidat.",
    setupTitle: "Configuration Neon requise",
    schemaTitle: "Schema Neon manquant"
  },
  en: {
    title: "AI chat",
    subtitle: "Persistent Groq assistant linked to your applicant portal.",
    setupTitle: "Neon setup required",
    schemaTitle: "Neon schema missing"
  },
  ar: {
    title: "مساعد الذكاء الاصطناعي",
    subtitle: "مساعد دائم مرتبط ببوابة المترشحين ويستعمل سياق ملفك عند الحاجة.",
    setupTitle: "يلزم إعداد Neon",
    schemaTitle: "مخطط Neon غير موجود"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/application/chat`);
}

export default async function ApplicantChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const user = await requireApplicantSession(locale, `/${locale}/application/chat`);
  const chat = await getApplicantAiChat(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });
  const canSend = chat.setup.ready && !chat.error;

  return (
    <>
      <article className="glass-card p-6 sm:p-8">
        <p className="badge-line">AI assistant</p>
        <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.95] text-ink sm:text-6xl">
          <span className="gradient-title">{copy.title}</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink/75 sm:text-xl">{copy.subtitle}</p>
      </article>

      {!chat.setup.ready ? (
        <article className="glass-card border border-accent/40 bg-accent/10 p-6 text-sm text-ink/80">
          <p className="font-display text-3xl font-semibold uppercase text-accent">{copy.setupTitle}</p>
          <div className="mt-4 space-y-2">
            {chat.setup.issues.map((issue) => (
              <p key={issue}>{issue}</p>
            ))}
          </div>
        </article>
      ) : null}

      {chat.error ? (
        <article
          className={`glass-card p-6 text-sm sm:text-base ${
            chat.errorCode === "schema_missing"
              ? "border border-accent/40 bg-accent/10 text-ink/80"
              : "border border-rose/40 bg-rose/10 text-rose"
          }`}
        >
          <p
            className={`font-display text-3xl font-semibold uppercase ${
              chat.errorCode === "schema_missing" ? "text-accent" : "text-rose"
            }`}
          >
            {chat.errorCode === "schema_missing" ? copy.schemaTitle : copy.setupTitle}
          </p>
          <p className="mt-3">{chat.error}</p>
        </article>
      ) : null}

      <ApplicantAiChatPanel locale={locale} initialMessages={chat.messages} canSend={canSend} />
    </>
  );
}
