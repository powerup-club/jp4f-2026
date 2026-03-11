import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { SiteLocale } from "@/config/locales";

export interface ApplicantSessionUser {
  email: string;
  name: string;
  image?: string;
}

export async function requireApplicantSession(
  locale: SiteLocale,
  callbackPath?: string
): Promise<ApplicantSessionUser> {
  const session = await auth().catch(() => null);
  const fallbackPath = callbackPath || `/${locale}/application`;

  if (!session?.user?.email) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(fallbackPath)}`);
  }

  return {
    email: session.user.email.toLowerCase(),
    name: session.user.name?.trim() ?? "",
    image: session.user.image ?? undefined
  };
}
