import type { Metadata } from "next";
import { CompetitionRegisterForm } from "@/components/forms/CompetitionRegisterForm";
import { getApplicantWorkspace } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    setupTitle: string;
    schemaTitle: string;
  }
> = {
  fr: {
    badge: "Application form",
    title: "Formulaire candidat",
    subtitle: "Complete ou mets a jour ta candidature Innov'Dom depuis le portail.",
    setupTitle: "Persistance Neon indisponible",
    schemaTitle: "Schema Neon manquant"
  },
  en: {
    badge: "Application form",
    title: "Application form",
    subtitle: "Complete or update your Innov'Dom application from the portal.",
    setupTitle: "Neon persistence unavailable",
    schemaTitle: "Neon schema missing"
  },
  ar: {
    badge: "استمارة الترشح",
    title: "استمارة المترشح",
    subtitle: "أكمل أو حدّث ترشح Innov'Dom من داخل البوابة.",
    setupTitle: "حفظ Neon غير متاح",
    schemaTitle: "مخطط Neon غير موجود"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantFormPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const user = await requireApplicantSession(locale, `/${locale}/application/form`);
  const workspace = await getApplicantWorkspace(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });

  return (
    <>
      <article className="glass-card p-6 sm:p-8">
        <p className="badge-line">{copy.badge}</p>
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

      <CompetitionRegisterForm
        locale={locale}
        initialFullName={user.name}
        initialEmail={user.email}
        initialApplication={workspace.error ? null : workspace.application}
        successRedirectPath={`/${locale}/application?submitted=1`}
      />
    </>
  );
}
