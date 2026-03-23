import type { Metadata } from "next";
import Link from "next/link";
import { getApplicantWorkspace } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import type { ApplicantApplicationRecord } from "@/applicant/types";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    submittedTitle: string;
    submittedBody: string;
    fillForm: string;
    editForm: string;
    setupTitle: string;
    schemaTitle: string;
    noSetupBody: string;
    profileTitle: string;
    teamTitle: string;
    projectTitle: string;
    fileTitle: string;
    quizTitle: string;
    quizEmpty: string;
    contactTitle: string;
    contactEmpty: string;
    fallbackValue: string;
    statusLabel: string;
    syncLabel: string;
    ratingLabel: string;
    sentAtLabel: string;
    toolsTitle: string;
    toolsSubtitle: string;
    labels: {
      account: string;
      teamId: string;
      fullName: string;
      email: string;
      phone: string;
      university: string;
      branch: string;
      profile: string;
      mode: string;
      team: string;
      members: string;
      title: string;
      domain: string;
      format: string;
      description: string;
      fileName: string;
      fileType: string;
      fileSize: string;
      storage: string;
      lastSync: string;
    };
  }
> = {
  fr: {
    badge: "Portal home",
    title: "Espace candidat",
    subtitle: "Ton dossier, tes outils portail et tes demandes de contact au meme endroit.",
    submittedTitle: "Candidature soumise",
    submittedBody: "Les informations enregistrees sont maintenant visibles dans ton espace candidat.",
    fillForm: "Remplir le formulaire",
    editForm: "Modifier ma candidature",
    setupTitle: "Configuration Neon requise",
    schemaTitle: "Schema Neon manquant",
    noSetupBody: "Les fonctions portail restent limitees tant que la base candidate n'est pas configuree.",
    profileTitle: "Profil",
    teamTitle: "Equipe",
    projectTitle: "Projet",
    fileTitle: "Fichier",
    quizTitle: "Dernier quiz",
    quizEmpty: "Aucun quiz enregistre pour le moment.",
    contactTitle: "Dernier contact",
    contactEmpty: "Aucune demande de contact envoyee.",
    fallbackValue: "Non renseigne",
    statusLabel: "Statut",
    syncLabel: "Synchro",
    ratingLabel: "Note",
    sentAtLabel: "Envoye le",
    toolsTitle: "Outils portail",
    toolsSubtitle: "Retrouve ici les experiences importees depuis l'ancien portail.",
    labels: {
      account: "Compte",
      teamId: "ID equipe",
      fullName: "Nom complet",
      email: "Email",
      phone: "Telephone",
      university: "Universite",
      branch: "Filiere",
      profile: "Profil",
      mode: "Mode",
      team: "Equipe",
      members: "Membres",
      title: "Titre",
      domain: "Domaine",
      format: "Format",
      description: "Description",
      fileName: "Nom",
      fileType: "Type",
      fileSize: "Taille",
      storage: "Stockage",
      lastSync: "Derniere synchro"
    }
  },
  en: {
    badge: "Portal home",
    title: "Applicant portal",
    subtitle: "Your application, portal tools, and contact requests in one place.",
    submittedTitle: "Application submitted",
    submittedBody: "Your saved information is now visible in your applicant portal.",
    fillForm: "Fill the form",
    editForm: "Edit my application",
    setupTitle: "Neon setup required",
    schemaTitle: "Neon schema missing",
    noSetupBody: "Portal features stay limited until the applicant database is configured.",
    profileTitle: "Profile",
    teamTitle: "Team",
    projectTitle: "Project",
    fileTitle: "File",
    quizTitle: "Latest quiz",
    quizEmpty: "No quiz attempt recorded yet.",
    contactTitle: "Latest contact",
    contactEmpty: "No contact request sent yet.",
    fallbackValue: "Not provided",
    statusLabel: "Status",
    syncLabel: "Sync",
    ratingLabel: "Rating",
    sentAtLabel: "Sent on",
    toolsTitle: "Portal tools",
    toolsSubtitle: "Access the imported experiences from the legacy portal here.",
    labels: {
      account: "Account",
      teamId: "Team ID",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      university: "University",
      branch: "Track",
      profile: "Profile",
      mode: "Mode",
      team: "Team",
      members: "Members",
      title: "Title",
      domain: "Domain",
      format: "Format",
      description: "Description",
      fileName: "File name",
      fileType: "File type",
      fileSize: "Size",
      storage: "Storage",
      lastSync: "Last sync"
    }
  },
  ar: {
    badge: "Portal home",
    title: "بوابة المترشحين",
    subtitle: "ملفك وأدوات البوابة وطلبات التواصل في مكان واحد.",
    submittedTitle: "تم إرسال الترشح",
    submittedBody: "أصبحت معلوماتك المحفوظة ظاهرة الآن داخل بوابة المترشحين.",
    fillForm: "فتح الاستمارة",
    editForm: "تعديل الترشح",
    setupTitle: "يلزم إعداد Neon",
    schemaTitle: "مخطط Neon غير موجود",
    noSetupBody: "ستبقى ميزات البوابة محدودة حتى يتم إعداد قاعدة بيانات المترشحين.",
    profileTitle: "الملف",
    teamTitle: "الفريق",
    projectTitle: "المشروع",
    fileTitle: "الملف",
    quizTitle: "آخر اختبار",
    quizEmpty: "لا توجد محاولة اختبار محفوظة حتى الآن.",
    contactTitle: "آخر تواصل",
    contactEmpty: "لا توجد أي رسالة تواصل مرسلة.",
    fallbackValue: "غير متوفر",
    statusLabel: "الحالة",
    syncLabel: "المزامنة",
    ratingLabel: "التقييم",
    sentAtLabel: "أرسل في",
    toolsTitle: "أدوات البوابة",
    toolsSubtitle: "هنا تجد الميزات المستوردة من البوابة القديمة.",
    labels: {
      account: "الحساب",
      teamId: "معرّف الفريق",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      university: "الجامعة",
      branch: "المسلك",
      profile: "الملف الشخصي",
      mode: "النمط",
      team: "الفريق",
      members: "الأعضاء",
      title: "العنوان",
      domain: "المجال",
      format: "الصيغة",
      description: "الوصف",
      fileName: "اسم الملف",
      fileType: "نوع الملف",
      fileSize: "الحجم",
      storage: "التخزين",
      lastSync: "آخر مزامنة"
    }
  }
};

function quickLinks(locale: SiteLocale) {
  if (locale === "en") {
    return [
      { href: "/application/evaluate", label: "Project evaluation", body: "Score your project and request jury-style feedback.", tone: "emerald", code: "EV" },
      { href: "/application/orientation", label: "Orientation explorer", body: "Compare your profile with the department tracks.", tone: "sky", code: "OR" },
      { href: "/application/chat", label: "AI assistant", body: "Ask about your application, project, or competition steps.", tone: "orange", code: "AI" }
    ] as const;
  }

  if (locale === "ar") {
    return [
      { href: "/application/evaluate", label: "تقييم المشروع", body: "امنح مشروعك نقاطا واطلب رأيا شبيها باللجنة.", tone: "emerald", code: "EV" },
      { href: "/application/orientation", label: "التوجيه", body: "قارن ملفك بمسالك الشعبة المختلفة.", tone: "sky", code: "OR" },
      { href: "/application/chat", label: "المساعد الذكي", body: "اسأل عن الترشح أو المشروع أو خطوات المسابقة.", tone: "orange", code: "AI" }
    ] as const;
  }

  return [
    { href: "/application/evaluate", label: "Evaluation projet", body: "Note ton projet puis demande un retour type jury.", tone: "emerald", code: "EV" },
    { href: "/application/orientation", label: "Explorer orientation", body: "Compare ton profil aux parcours du departement.", tone: "sky", code: "OR" },
    { href: "/application/chat", label: "Assistant IA", body: "Pose des questions sur ta candidature ou la competition.", tone: "orange", code: "AI" }
  ] as const;
}

function displayValue(value: string | null | undefined, fallback: string) {
  return value?.trim() ? value.trim() : fallback;
}

function line(label: string, value: string) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-edge/40 pt-3 first:border-t-0 first:pt-0">
      <span className="text-xs uppercase tracking-[0.16em] text-ink/45">{label}</span>
      <span className="text-right text-sm text-ink/78">{value}</span>
    </div>
  );
}

function summaryCard(title: string, children: React.ReactNode) {
  return (
    <article className="glass-card p-6">
      <p className="font-display text-3xl font-semibold uppercase text-ink">{title}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </article>
  );
}

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

function canEditApplication(application: ApplicantApplicationRecord | null) {
  if (!application) {
    return false;
  }

  return Boolean(
    application.contactFullName ||
      application.phone ||
      application.teamName ||
      application.projectTitle ||
      application.fileName
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/application`);
}

export default async function ApplicantWorkspacePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const query = await searchParams;
  const user = await requireApplicantSession(locale, `/${locale}/application`);
  const workspace = await getApplicantWorkspace(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });
  const application = workspace.application;
  const links = quickLinks(locale);

  return (
    <>
      <article className="glass-card p-6 sm:p-8">
        <p className="badge-line">{copy.badge}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.95] text-ink sm:text-6xl">
          <span className="gradient-title">{copy.title}</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink/75 sm:text-xl">{copy.subtitle}</p>
        <div className="mt-5 inline-flex rounded-full border border-edge/70 bg-panel/90 px-4 py-2 text-sm text-ink/75">
          {user.name || user.email}
        </div>
      </article>

      {query.submitted === "1" ? (
        <article className="glass-card border border-emerald-400/45 bg-emerald-500/10 p-6">
          <p className="font-display text-3xl font-semibold uppercase text-emerald-600">
            {copy.submittedTitle}
          </p>
          <p className="mt-3 text-sm text-ink/78 sm:text-base">{copy.submittedBody}</p>
        </article>
      ) : null}

      {!workspace.setup.ready ? (
        <article className="glass-card border border-accent/40 bg-accent/10 p-6">
          <p className="font-display text-3xl font-semibold uppercase text-accent">{copy.setupTitle}</p>
          <p className="mt-3 text-sm text-ink/78 sm:text-base">{copy.noSetupBody}</p>
          <div className="mt-4 space-y-2 text-sm text-ink/72">
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

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${locale}/application/form`}
          className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
        >
          {canEditApplication(application) ? copy.editForm : copy.fillForm}
        </Link>
      </div>

      <article className="glass-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-3xl font-semibold uppercase text-ink">{copy.toolsTitle}</p>
            <p className="mt-2 text-sm text-ink/70 sm:text-base">{copy.toolsSubtitle}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="rounded-3xl border border-edge/45 bg-panel/65 p-5 transition hover:-translate-y-1 hover:border-accent"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-semibold uppercase tracking-[0.16em] ${
                    item.tone === "emerald"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : item.tone === "sky"
                        ? "bg-signal/15 text-signal"
                        : "bg-accent/15 text-accent"
                  }`}
                >
                  {item.code}
                </span>
                <div>
                  <p className="font-display text-3xl font-semibold uppercase text-ink">{item.label}</p>
                  <p className="mt-2 text-sm text-ink/68">{item.body}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        {summaryCard(
          copy.profileTitle,
          <>
            {line(copy.labels.account, displayValue(application?.accountEmail || user.email, copy.fallbackValue))}
            {line(copy.labels.teamId, displayValue(application?.teamId, copy.fallbackValue))}
            {line(copy.labels.fullName, displayValue(application?.contactFullName || user.name, copy.fallbackValue))}
            {line(copy.labels.email, displayValue(application?.contactEmail || user.email, copy.fallbackValue))}
            {line(copy.labels.phone, displayValue(application?.phone, copy.fallbackValue))}
            {line(copy.labels.university, displayValue(application?.university, copy.fallbackValue))}
            {line(copy.labels.branch, displayValue(application?.branch, copy.fallbackValue))}
          </>
        )}

        {summaryCard(
          copy.teamTitle,
          <>
            {line(copy.statusLabel, displayValue(application?.status, copy.fallbackValue))}
            {line(copy.syncLabel, displayValue(application?.sheetSyncStatus, copy.fallbackValue))}
            {line(copy.labels.mode, displayValue(application?.participationType, copy.fallbackValue))}
            {line(copy.labels.team, displayValue(application?.teamName, copy.fallbackValue))}
            {line(
              copy.labels.members,
              application?.teamMembers?.length
                ? application.teamMembers.map((member) => member.name || member.email).join(", ")
                : copy.fallbackValue
            )}
          </>
        )}

        {summaryCard(
          copy.projectTitle,
          <>
            {line(copy.labels.title, displayValue(application?.projectTitle, copy.fallbackValue))}
            {line(copy.labels.domain, displayValue(application?.projectDomain, copy.fallbackValue))}
            {line(copy.labels.format, displayValue(application?.demoFormat, copy.fallbackValue))}
            {line(copy.labels.description, displayValue(application?.projectDesc, copy.fallbackValue))}
          </>
        )}

        {summaryCard(
          copy.fileTitle,
          <>
            {line(copy.labels.fileName, displayValue(application?.fileName, copy.fallbackValue))}
            {line(copy.labels.fileType, displayValue(application?.fileType, copy.fallbackValue))}
            {line(
              copy.labels.fileSize,
              application?.fileSizeBytes ? `${Math.round(application.fileSizeBytes / 1024)} KB` : copy.fallbackValue
            )}
            {line(copy.labels.storage, displayValue(application?.fileStorage, copy.fallbackValue))}
            {line(
              copy.labels.lastSync,
              displayValue(application?.lastSyncedAt || application?.updatedAt, copy.fallbackValue)
            )}
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="glass-card p-6">
          <p className="font-display text-3xl font-semibold uppercase text-ink">{copy.quizTitle}</p>
          {workspace.latestQuizAttempt ? (
            <div className="mt-4 space-y-3">
              {line(copy.labels.branch, workspace.latestQuizAttempt.branch)}
              {line(copy.labels.profile, displayValue(workspace.latestQuizAttempt.profile, copy.fallbackValue))}
              {line(copy.ratingLabel, String(workspace.latestQuizAttempt.rating))}
              {line(copy.sentAtLabel, dateLabel(workspace.latestQuizAttempt.createdAt, locale))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/70">{copy.quizEmpty}</p>
          )}
        </article>

        <article className="glass-card p-6">
          <p className="font-display text-3xl font-semibold uppercase text-ink">{copy.contactTitle}</p>
          {workspace.latestContactRequest ? (
            <div className="mt-4 space-y-3">
              {line(copy.labels.teamId, displayValue(workspace.latestContactRequest.teamId, copy.fallbackValue))}
              {line(copy.labels.phone, displayValue(workspace.latestContactRequest.phone, copy.fallbackValue))}
              {line(copy.syncLabel, workspace.latestContactRequest.sheetSyncStatus)}
              {line(copy.sentAtLabel, dateLabel(workspace.latestContactRequest.createdAt, locale))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/70">{copy.contactEmpty}</p>
          )}
        </article>
      </div>
    </>
  );
}
