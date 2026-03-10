import type { Metadata } from "next";
import { getApplicantWorkspace } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import type { ApplicantQuizBranch } from "@/applicant/types";
import { ApplicantOrientationExplorer } from "@/components/application/ApplicantOrientationExplorer";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
  }
> = {
  fr: {
    badge: "Explorer",
    title: "Orientation",
    subtitle: "Relie ton profil, ton quiz et ton projet aux parcours du departement Genie Industriel."
  },
  en: {
    badge: "Explorer",
    title: "Orientation",
    subtitle: "Connect your profile, quiz, and project with the department engineering tracks."
  },
  ar: {
    badge: "Explorer",
    title: "التوجيه",
    subtitle: "اربط بين ملفك والاختبار ومشروعك وبين مسالك شعبة الهندسة الصناعية."
  }
};

function resolveBranch(text: string): ApplicantQuizBranch | null {
  const normalized = text.trim().toLowerCase();

  if (normalized.includes("gesi")) {
    return "GESI";
  }

  if (normalized.includes("mecatron")) {
    return "MECATRONIQUE";
  }

  if (normalized.includes("meca")) {
    return "MECA";
  }

  if (normalized === "gi" || normalized.includes("genie industriel") || normalized.includes("industrial")) {
    return "GI";
  }

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantOrientationPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const user = await requireApplicantSession(locale, `/${locale}/application/orientation`);
  const workspace = await getApplicantWorkspace(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });

  const recommendedBranch =
    workspace.latestQuizAttempt?.branch || resolveBranch(workspace.application?.branch || "") || "GI";

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

      <ApplicantOrientationExplorer
        locale={locale}
        recommendedBranch={recommendedBranch}
        projectTitle={workspace.application?.projectTitle || ""}
        projectDomain={workspace.application?.projectDomain || ""}
      />
    </>
  );
}
