import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdminAuthSetup, isAdminEmail } from "@/admin/config";
import { AdminLoginCard } from "@/components/admin/AdminLoginCard";

export const metadata: Metadata = {
  title: "Connexion admin"
};

interface AdminLoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await auth().catch(() => null);
  if (session?.user?.email && isAdminEmail(session.user.email)) {
    redirect("/admin");
  }

  const params = await searchParams;
  const setup = getAdminAuthSetup();
  const errorCode = session?.user?.email && !isAdminEmail(session.user.email)
    ? "AccessDenied"
    : firstValue(params.error);

  return (
    <AdminLoginCard
      callbackUrl={firstValue(params.callbackUrl) || "/admin"}
      errorCode={errorCode}
      setupReady={setup.ready}
      setupIssues={setup.issues}
    />
  );
}
