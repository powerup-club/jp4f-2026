import type { Metadata } from "next";
import { getApplicantWorkspace } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import { ApplicantContactForm } from "@/components/application/ApplicantContactForm";
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
    latestTitle: string;
  }
> = {
  fr: {
    title: "Contact responsable",
    subtitle: "Envoie un message avec ton identifiant d'equipe pour etre recontacte.",
    setupTitle: "Configuration Neon requise",
    schemaTitle: "Schema Neon manquant",
    latestTitle: "Derniere demande"
  },
  en: {
    title: "Contact responsible",
    subtitle: "Send a message with your team identifier so the team can reach back.",
    setupTitle: "Neon setup required",
    schemaTitle: "Neon schema missing",
    latestTitle: "Latest request"
  },
  ar: {
    title: "التواصل مع الفريق",
    subtitle: "أرسل رسالة مرفقة بمعرف فريقك حتى يتم التواصل معك بشكل صحيح.",
    setupTitle: "يلزم إعداد Neon",
    schemaTitle: "مخطط Neon غير موجود",
    latestTitle: "آخر طلب"
  }
};

function dateLabel(value: string | null, locale: SiteLocale) {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/application/contact`);
}

export default async function ApplicantContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const user = await requireApplicantSession(locale, `/${locale}/application/contact`);
  const workspace = await getApplicantWorkspace(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });
  const application = workspace.application;

  return (
    <>
      <article className="glass-card p-6 sm:p-8">
        <p className="badge-line">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.95] text-ink sm:text-6xl">
          <span className="gradient-title">{copy.title}</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink/75 sm:text-xl">{copy.subtitle}</p>
      </article>

      {!workspace.setup.ready ? (
        <article className="glass-card border border-accent/40 bg-accent/10 p-6 text-sm text-ink/80">
          <p className="font-display text-3xl font-semibold uppercase text-accent">{copy.setupTitle}</p>
          <div className="mt-4 space-y-2">
            {workspace.setup.issues.map((issue) => (
              <p key={issue}>{issue}</p>
            ))}
          </div>
        </article>
      ) : null}

      {workspace.error ? (
        <article
          className={`glass-card p-6 text-sm sm:text-base ${
            workspace.errorCode === "schema_missing"
              ? "border border-accent/40 bg-accent/10 text-ink/80"
              : "border border-rose/40 bg-rose/10 text-rose"
          }`}
        >
          <p
            className={`font-display text-3xl font-semibold uppercase ${
              workspace.errorCode === "schema_missing" ? "text-accent" : "text-rose"
            }`}
          >
            {workspace.errorCode === "schema_missing" ? copy.schemaTitle : copy.setupTitle}
          </p>
          <p className="mt-3">{workspace.error}</p>
        </article>
      ) : null}

      <ApplicantContactForm
        locale={locale}
        defaultFullName={application?.contactFullName || user.name}
        defaultEmail={application?.contactEmail || user.email}
        defaultPhone={application?.phone || ""}
        teamId={application?.teamId || "JP4F-000000"}
      />

      {workspace.latestContactRequest ? (
        <article className="glass-card p-6">
          <p className="font-display text-3xl font-semibold uppercase text-ink">{copy.latestTitle}</p>
          <div className="mt-4 space-y-3 text-sm text-ink/78">
            <p>{workspace.latestContactRequest.message}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-ink/45">
              {dateLabel(workspace.latestContactRequest.createdAt, locale)}
            </p>
          </div>
        </article>
      ) : null}
    </>
  );
}
