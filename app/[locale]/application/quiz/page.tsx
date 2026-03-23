import type { Metadata } from "next";
import { getApplicantWorkspace } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import { splitDisplayName } from "@/applicant/types";
import { OrientationQuiz } from "@/components/quiz/OrientationQuiz";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    latestTitle: string;
    branchLabel: string;
    profileLabel: string;
    savedLabel: string;
  }
> = {
  fr: {
    badge: "Quiz",
    title: "Quiz portail",
    subtitle: "Passe le quiz d'orientation depuis ton espace candidat et conserve ton resultat.",
    latestTitle: "Dernier resultat",
    branchLabel: "Filiere",
    profileLabel: "Profil",
    savedLabel: "Enregistre"
  },
  en: {
    badge: "Quiz",
    title: "Portal quiz",
    subtitle: "Take the orientation quiz from your applicant portal and keep your result.",
    latestTitle: "Latest result",
    branchLabel: "Track",
    profileLabel: "Profile",
    savedLabel: "Saved"
  },
  ar: {
    badge: "الاختبار",
    title: "اختبار البوابة",
    subtitle: "أنجز اختبار التوجيه من داخل البوابة واحتفظ بنتيجتك.",
    latestTitle: "آخر نتيجة",
    branchLabel: "المسلك",
    profileLabel: "الملف الشخصي",
    savedLabel: "محفوظ"
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
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/application/quiz`);
}

export default async function ApplicantQuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const user = await requireApplicantSession(locale, `/${locale}/application/quiz`);
  const workspace = await getApplicantWorkspace(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });
  const displayName = splitDisplayName(workspace.application?.contactFullName || user.name);

  return (
    <>
      <article className="glass-card p-6 sm:p-8">
        <p className="badge-line">{copy.badge}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.95] text-ink sm:text-6xl">
          <span className="gradient-title">{copy.title}</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink/75 sm:text-xl">{copy.subtitle}</p>
      </article>

      {workspace.latestQuizAttempt ? (
        <article className="glass-card p-6">
          <p className="font-display text-3xl font-semibold uppercase text-ink">{copy.latestTitle}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-edge/50 bg-panel/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{copy.branchLabel}</p>
              <p className="mt-2 font-display text-2xl uppercase text-ink">{workspace.latestQuizAttempt.branch}</p>
            </div>
            <div className="rounded-2xl border border-edge/50 bg-panel/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{copy.profileLabel}</p>
              <p className="mt-2 text-sm text-ink/78">{workspace.latestQuizAttempt.profile}</p>
            </div>
            <div className="rounded-2xl border border-edge/50 bg-panel/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{copy.savedLabel}</p>
              <p className="mt-2 text-sm text-ink/78">{dateLabel(workspace.latestQuizAttempt.createdAt, locale)}</p>
            </div>
          </div>
        </article>
      ) : null}

      <OrientationQuiz
        locale={locale}
        saveEndpoint="/api/application/quiz"
        initialFirstName={displayName.firstName}
        initialLastName={displayName.lastName}
      />
    </>
  );
}
