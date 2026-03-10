import type { ReactNode } from "react";
import { ApplicantPortalSidebar } from "@/components/application/ApplicantPortalSidebar";
import { getValidatedLocale } from "@/lib/locale-page";
import { requireApplicantSession } from "@/applicant/session";

export default async function ApplicantPortalLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await getValidatedLocale(params);
  const user = await requireApplicantSession(locale);

  return (
    <section className="section-shell mt-8 pb-20">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ApplicantPortalSidebar locale={locale} userName={user.name} userEmail={user.email} />
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}
