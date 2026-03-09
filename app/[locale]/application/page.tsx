import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getApplicantWorkspace } from "@/applicant/data";
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
    intro: string;
    registerLabel: string;
    chatLabel: string;
    noApplication: string;
    setupTitle: string;
    databaseError: string;
    statusLabel: string;
    syncLabel: string;
    profileTitle: string;
    teamTitle: string;
    projectTitle: string;
    fileTitle: string;
    fallbackValue: string;
  }
> = {
  fr: {
    tag: "// espace candidat",
    title: "Espace Candidat",
    subtitle: "Suivi de la candidature Innov'Dom connectee a Google et Neon.",
    intro:
      "Cet espace centralise l'etat de la candidature, les informations du porteur de projet et les premiers messages lies au dossier.",
    registerLabel: "Completer le formulaire",
    chatLabel: "Ouvrir le chat",
    noApplication:
      "Aucune candidature n'est encore synchronisee pour ce compte. Complete le formulaire Innov'Dom pour creer ton dossier Neon.",
    setupTitle: "Configuration Neon requise",
    databaseError: "La lecture de l'espace candidat a echoue.",
    statusLabel: "Statut",
    syncLabel: "Synchronisation",
    profileTitle: "Profil",
    teamTitle: "Equipe",
    projectTitle: "Projet",
    fileTitle: "Fichier",
    fallbackValue: "Non renseigne"
  },
  en: {
    tag: "// applicant workspace",
    title: "Applicant Workspace",
    subtitle: "Innov'Dom application tracking powered by Google sign-in and Neon.",
    intro:
      "This space centralizes application status, applicant information, and the first message history linked to the record.",
    registerLabel: "Complete the form",
    chatLabel: "Open chat",
    noApplication:
      "No application has been synced for this account yet. Complete the Innov'Dom form to create the Neon record.",
    setupTitle: "Neon setup required",
    databaseError: "The applicant workspace could not be loaded.",
    statusLabel: "Status",
    syncLabel: "Sync",
    profileTitle: "Profile",
    teamTitle: "Team",
    projectTitle: "Project",
    fileTitle: "File",
    fallbackValue: "Not provided"
  },
  ar: {
    tag: "// فضاء المترشح",
    title: "فضاء المترشح",
    subtitle: "تتبع ملف Innov'Dom عبر Google و Neon.",
    intro: "هذا الفضاء يجمع حالة الترشح ومعلومات صاحب المشروع وأول الرسائل المرتبطة بالملف.",
    registerLabel: "إكمال الاستمارة",
    chatLabel: "فتح الدردشة",
    noApplication: "لا يوجد أي ملف مترشح مرتبط بهذا الحساب بعد. أكمل استمارة Innov'Dom لإنشاء سجل Neon.",
    setupTitle: "إعداد Neon مطلوب",
    databaseError: "تعذر تحميل فضاء المترشح.",
    statusLabel: "الحالة",
    syncLabel: "المزامنة",
    profileTitle: "الملف الشخصي",
    teamTitle: "الفريق",
    projectTitle: "المشروع",
    fileTitle: "الملف",
    fallbackValue: "غير متوفر"
  }
};

function line(label: string, value: string) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-edge/40 pt-3 first:border-t-0 first:pt-0">
      <span className="text-xs uppercase tracking-[0.16em] text-ink/45">{label}</span>
      <span className="text-right text-sm text-ink/78">{value}</span>
    </div>
  );
}

function displayValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantWorkspacePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const session = await auth().catch(() => null);

  if (!session?.user?.email) {
    redirect(`/auth/login?callbackUrl=%2F${locale}%2Fapplication`);
  }

  const workspace = await getApplicantWorkspace(session.user.email);
  const application = workspace.application;

  return (
    <>
      <PageIntro tag={copy.tag} title={copy.title} subtitle={copy.subtitle} />
      <section className="section-shell mt-6 space-y-6 pb-20">
        <Reveal>
          <article className="glass-card p-6">
            <p className="text-sm text-ink/70 sm:text-base">{copy.intro}</p>
            <div className="mt-4 inline-flex rounded-full border border-edge/75 bg-panel/90 px-4 py-2 text-sm text-ink/78">
              {session.user.name || session.user.email}
            </div>
          </article>
        </Reveal>

        {!workspace.setup.ready ? (
          <Reveal>
            <article className="glass-card border border-accent/40 bg-accent/10 p-6">
              <p className="font-display text-3xl font-semibold uppercase text-accent">
                {copy.setupTitle}
              </p>
              <div className="mt-4 space-y-2 text-sm text-ink/72">
                {workspace.setup.issues.map((issue) => (
                  <p key={issue}>{issue}</p>
                ))}
              </div>
            </article>
          </Reveal>
        ) : null}

        {workspace.error ? (
          <Reveal>
            <article className="glass-card border border-rose/40 bg-rose/10 p-6 text-sm text-rose">
              {copy.databaseError} {workspace.error}
            </article>
          </Reveal>
        ) : null}

        {workspace.setup.ready && !workspace.error && !application ? (
          <Reveal>
            <article className="glass-card p-6">
              <p className="text-sm text-ink/72 sm:text-base">{copy.noApplication}</p>
            </article>
          </Reveal>
        ) : null}

        {application ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <article className="glass-card p-6">
                <p className="font-display text-3xl font-semibold uppercase text-ink">
                  {copy.profileTitle}
                </p>
                <div className="mt-4 space-y-3">
                  {line("Compte", displayValue(application.accountEmail, copy.fallbackValue))}
                  {line("Nom", displayValue(application.contactFullName, copy.fallbackValue))}
                  {line("Email", displayValue(application.contactEmail, copy.fallbackValue))}
                  {line("Telephone", displayValue(application.phone, copy.fallbackValue))}
                  {line("Universite", displayValue(application.university, copy.fallbackValue))}
                  {line("Filiere", displayValue(application.branch, copy.fallbackValue))}
                </div>
              </article>
            </Reveal>

            <Reveal>
              <article className="glass-card p-6">
                <p className="font-display text-3xl font-semibold uppercase text-ink">
                  {copy.teamTitle}
                </p>
                <div className="mt-4 space-y-3">
                  {line(copy.statusLabel, application.status)}
                  {line(copy.syncLabel, application.sheetSyncStatus)}
                  {line("Mode", application.participationType)}
                  {line("Equipe", displayValue(application.teamName, copy.fallbackValue))}
                  {line(
                    "Membres",
                    application.teamMembers.length
                      ? application.teamMembers.map((member) => member.name || member.email).join(", ")
                      : copy.fallbackValue
                  )}
                </div>
              </article>
            </Reveal>

            <Reveal>
              <article className="glass-card p-6">
                <p className="font-display text-3xl font-semibold uppercase text-ink">
                  {copy.projectTitle}
                </p>
                <div className="mt-4 space-y-3">
                  {line("Titre", displayValue(application.projectTitle, copy.fallbackValue))}
                  {line("Domaine", displayValue(application.projectDomain, copy.fallbackValue))}
                  {line("Format", displayValue(application.demoFormat, copy.fallbackValue))}
                  {line(
                    "Description",
                    displayValue(application.projectDesc.slice(0, 140), copy.fallbackValue)
                  )}
                </div>
              </article>
            </Reveal>

            <Reveal>
              <article className="glass-card p-6">
                <p className="font-display text-3xl font-semibold uppercase text-ink">
                  {copy.fileTitle}
                </p>
                <div className="mt-4 space-y-3">
                  {line("Nom", displayValue(application.fileName, copy.fallbackValue))}
                  {line("Type", displayValue(application.fileType, copy.fallbackValue))}
                  {line(
                    "Taille",
                    application.fileSizeBytes ? `${Math.round(application.fileSizeBytes / 1024)} KB` : copy.fallbackValue
                  )}
                  {line("Stockage", application.fileStorage)}
                  {line(
                    "Derniere synchro",
                    displayValue(application.lastSyncedAt || application.updatedAt, copy.fallbackValue)
                  )}
                </div>
              </article>
            </Reveal>
          </div>
        ) : null}

        <Reveal>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/competition/register`}
              className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
            >
              {copy.registerLabel}
            </Link>
            <Link
              href={`/${locale}/application/chat`}
              className="rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
            >
              {copy.chatLabel}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
