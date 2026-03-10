import type { Metadata } from "next";
import { getApplicantWorkspace } from "@/applicant/data";
import { requireApplicantSession } from "@/applicant/session";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import { ApplicantProjectEvaluation } from "@/components/application/ApplicantProjectEvaluation";
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
    badge: "Pre-jury",
    title: "Evaluation projet",
    subtitle: "Mesure l'etat de ton projet, puis demande un retour jury avant la presentation finale."
  },
  en: {
    badge: "Pre-jury",
    title: "Project evaluation",
    subtitle: "Assess your project and request jury-style feedback before the final pitch."
  },
  ar: {
    badge: "Pre-jury",
    title: "تقييم المشروع",
    subtitle: "قيس جاهزية مشروعك ثم اطلب رأيا شبيها باللجنة قبل العرض النهائي."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantEvaluatePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const user = await requireApplicantSession(locale, `/${locale}/application/evaluate`);
  const workspace = await getApplicantWorkspace(user.email, {
    ensureApplication: true,
    accountName: user.name,
    locale
  });
  const application = workspace.application;

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

      <ApplicantProjectEvaluation
        locale={locale}
        projectTitle={application?.projectTitle || ""}
        projectDomain={application?.projectDomain || ""}
        projectDesc={application?.projectDesc || ""}
        innovation={application?.innovation || ""}
        formHref={`/${locale}/application/form`}
      />
    </>
  );
}
