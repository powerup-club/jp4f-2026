import type { ApplicantPersistenceSetup } from "@/applicant/types";

function cleanEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getApplicantDatabaseUrl(): string {
  return cleanEnv(process.env.DATABASE_URL);
}

export function getApplicantPersistenceSetup(): ApplicantPersistenceSetup {
  const issues: string[] = [];

  if (!getApplicantDatabaseUrl()) {
    issues.push("DATABASE_URL manquant pour la persistance Neon");
  }

  return {
    ready: issues.length === 0,
    issues
  };
}
