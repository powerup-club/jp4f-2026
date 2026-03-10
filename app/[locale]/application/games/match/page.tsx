import type { Metadata } from "next";
import { BranchMatchGame } from "@/components/application/BranchMatchGame";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string }> = {
  fr: {
    badge: "Mini game",
    title: "Filiere Match",
    subtitle: "Associe des technologies et des outils aux bons parcours du departement."
  },
  en: {
    badge: "Mini game",
    title: "Branch Match",
    subtitle: "Map technologies and tools to the right department tracks."
  },
  ar: {
    badge: "Mini game",
    title: "Filiere Match",
    subtitle: "اربط التقنيات والأدوات بالمسالك الصحيحة داخل الشعبة."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantGamesMatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />
      <BranchMatchGame locale={locale} />
    </>
  );
}
