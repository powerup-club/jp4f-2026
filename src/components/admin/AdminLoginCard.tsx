"use client";

import { GoogleLoginCard } from "@/components/auth/GoogleLoginCard";

interface AdminLoginCardProps {
  callbackUrl: string;
  errorCode?: string;
  setupReady: boolean;
  setupIssues: string[];
}

export function AdminLoginCard({
  callbackUrl,
  errorCode,
  setupReady,
  setupIssues
}: AdminLoginCardProps) {
  return (
    <GoogleLoginCard
      callbackUrl={callbackUrl}
      errorCode={errorCode}
      mode="admin"
      setupReady={setupReady}
      setupIssues={setupIssues}
    />
  );
}
