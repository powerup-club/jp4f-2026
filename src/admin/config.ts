import type { AdminDataSetup, AdminDataType } from "@/admin/types";
import { getApplicantDatabaseUrl } from "@/applicant/config";

function cleanEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getAllowedAdminEmails(): string[] {
  return cleanEnv(process.env.ADMIN_EMAILS)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export function getGoogleClientId(): string {
  return cleanEnv(process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID);
}

export function getGoogleClientSecret(): string {
  return cleanEnv(process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET);
}

export function getAuthSecret(): string {
  return cleanEnv(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
}

export function getAdminDataSecret(): string {
  return cleanEnv(process.env.ADMIN_DATA_SECRET);
}

export function getGoogleScriptUrl(type: AdminDataType): string {
  if (type === "quiz") {
    return cleanEnv(process.env.GOOGLE_SCRIPT_URL_QUIZ || process.env.GOOGLE_SCRIPT_URL);
  }

  return cleanEnv(process.env.GOOGLE_SCRIPT_URL_REGISTER || process.env.GOOGLE_SCRIPT_URL);
}

export function getAdminAuthSetup() {
  const googleAuth = getGoogleAuthSetup();
  const issues = [...googleAuth.issues];
  const allowedEmails = getAllowedAdminEmails();

  if (allowedEmails.length === 0) {
    issues.push("ADMIN_EMAILS manquant");
  }

  return {
    ready: issues.length === 0,
    issues,
    allowedEmails
  };
}

export function getGoogleAuthSetup() {
  const issues: string[] = [];
  const googleClientId = getGoogleClientId();
  const googleClientSecret = getGoogleClientSecret();
  const authSecret = getAuthSecret();

  if (!googleClientId) {
    issues.push("GOOGLE_CLIENT_ID manquant");
  }
  if (!googleClientSecret) {
    issues.push("GOOGLE_CLIENT_SECRET manquant");
  }
  if (!authSecret) {
    issues.push("AUTH_SECRET ou NEXTAUTH_SECRET manquant");
  }

  return {
    ready: issues.length === 0,
    issues
  };
}

export function getAdminDataSetup(_type: AdminDataType): AdminDataSetup {
  const databaseConfigured = Boolean(getApplicantDatabaseUrl());
  const issues: string[] = [];

  if (!databaseConfigured) {
    issues.push("DATABASE_URL manquant pour le dashboard admin");
  }

  return {
    ready: issues.length === 0,
    sourceConfigured: databaseConfigured,
    secretConfigured: true,
    issues
  };
}
