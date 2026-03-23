import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getGoogleAuthSetup } from "@/admin/config";
import { GoogleLoginCard } from "@/components/auth/GoogleLoginCard";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";

export const metadata: Metadata = {
  title: "Connexion Google"
};

interface AuthLoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
    mode?: string | string[];
  }>;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function AuthLoginPage({ searchParams }: AuthLoginPageProps) {
  const params = await searchParams;
  const callbackUrl = firstValue(params.callbackUrl) || "/fr/application";
  const errorCode = firstValue(params.error);
  const mode = firstValue(params.mode) === "admin" ? "admin" : "user";
  const setup = getGoogleAuthSetup();
  const session = await auth().catch(() => null);

  if (session?.user?.email) {
    redirect(callbackUrl);
  }

  return (
    <div className="relative min-h-screen text-ink">
      <BackgroundCanvas />
      <div className="relative z-10">
        <GoogleLoginCard
          callbackUrl={callbackUrl}
          errorCode={errorCode}
          mode={mode}
          setupReady={setup.ready}
          setupIssues={setup.issues}
        />
      </div>
    </div>
  );
}
