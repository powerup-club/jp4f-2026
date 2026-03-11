import type { ReactNode } from "react";
import { ApplicantPortalSidebar } from "@/components/application/ApplicantPortalSidebar";
import { MobileBottomTabBar } from "@/components/portal/MobileBottomTabBar";
import { MobilePortalTopBar } from "@/components/portal/MobilePortalTopBar";
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

  const isRtl = locale === "ar";

  return (
    <section className="section-shell mt-8 pb-10">
      <div className={`flex min-h-[calc(100vh-8rem)] flex-col gap-6 lg:gap-8 ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        <div className="lg:w-[280px] lg:flex-shrink-0">
          <ApplicantPortalSidebar locale={locale} userName={user.name} userEmail={user.email} />
        </div>

        <MobilePortalTopBar locale={locale} userName={user.name} userImage={user.image} />

        <main className="flex-1 pt-14 lg:pt-0 pb-[calc(7.5rem+env(safe-area-inset-bottom))] lg:pb-0 px-4 lg:px-8 max-w-full overflow-x-hidden w-full">
          <div className="w-full max-w-full space-y-6">{children}</div>
        </main>

        <MobileBottomTabBar locale={locale} />
      </div>
    </section>
  );
}
