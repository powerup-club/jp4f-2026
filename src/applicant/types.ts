export type ApplicantParticipationType = "individual" | "team";
export type ApplicantStatus = "draft" | "submitted";
export type ApplicantSheetSyncStatus = "pending" | "synced" | "skipped" | "failed";
export type ApplicantFileStorage = "none" | "google_script_only" | "external";
export type ApplicantMessageRole = "applicant" | "admin" | "system";
export type ApplicantWorkspaceErrorCode = "database_error" | "schema_missing";
export type ApplicantAiMessageRole = "user" | "assistant" | "system";
export type ApplicantQuizBranch = "GESI" | "MECA" | "MECATRONIQUE" | "GI";

export interface ApplicantTeamMember {
  name: string;
  email: string;
}

export interface ApplicantPersistenceSetup {
  ready: boolean;
  issues: string[];
}

export interface ApplicantFormPayload {
  lang?: unknown;
  type?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  university?: unknown;
  branch?: unknown;
  yearOfStudy?: unknown;
  linkedin?: unknown;
  teamName?: unknown;
  member2Name?: unknown;
  member2Email?: unknown;
  member3Name?: unknown;
  member3Email?: unknown;
  member4Name?: unknown;
  member4Email?: unknown;
  projTitle?: unknown;
  projDomain?: unknown;
  projDesc?: unknown;
  innovation?: unknown;
  demoFormat?: unknown;
  heardFrom?: unknown;
  fileBase64?: unknown;
  fileName?: unknown;
  fileType?: unknown;
  fileSize?: unknown;
  fileUrl?: unknown;
  projectTitle?: unknown;
  projectDomain?: unknown;
  projectDesc?: unknown;
}

export interface NormalizedApplicantFormPayload {
  locale: string;
  participationType: ApplicantParticipationType;
  contactFullName: string;
  contactEmail: string;
  phone: string;
  university: string;
  branch: string;
  yearOfStudy: string;
  linkedin: string;
  teamName: string;
  teamMembers: ApplicantTeamMember[];
  projectTitle: string;
  projectDomain: string;
  projectDesc: string;
  innovation: string;
  demoFormat: string;
  heardFrom: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number | null;
  fileUrl: string;
  fileStorage: ApplicantFileStorage;
  rawPayload: Record<string, unknown>;
}

export interface ApplicantApplicationSaveInput extends NormalizedApplicantFormPayload {
  accountEmail: string;
  accountName: string;
  status: ApplicantStatus;
  sheetSyncStatus: ApplicantSheetSyncStatus;
  sheetSyncMessage: string;
  submittedAt: string | null;
  lastSyncedAt: string | null;
}

export interface ApplicantApplicationRecord {
  id: number;
  teamId: string;
  accountEmail: string;
  accountName: string;
  locale: string;
  status: ApplicantStatus;
  sheetSyncStatus: ApplicantSheetSyncStatus;
  sheetSyncMessage: string;
  participationType: ApplicantParticipationType;
  contactFullName: string;
  contactEmail: string;
  phone: string;
  university: string;
  branch: string;
  yearOfStudy: string;
  linkedin: string;
  teamName: string;
  teamMembers: ApplicantTeamMember[];
  projectTitle: string;
  projectDomain: string;
  projectDesc: string;
  innovation: string;
  demoFormat: string;
  heardFrom: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number | null;
  fileUrl: string;
  fileStorage: ApplicantFileStorage;
  submittedAt: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicantChatMessage {
  id: number;
  senderEmail: string;
  senderName: string;
  senderRole: ApplicantMessageRole;
  body: string;
  createdAt: string;
}

export interface ApplicantAiChatMessage {
  id: number;
  role: ApplicantAiMessageRole;
  content: string;
  createdAt: string;
}

export interface ApplicantQuizHistoryEntry {
  q: string;
  a: string;
}

export interface ApplicantQuizAttemptRecord {
  id: number;
  locale: string;
  branch: ApplicantQuizBranch;
  profile: string;
  description: string;
  tagline: string;
  why: string;
  history: ApplicantQuizHistoryEntry[];
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApplicantQuizAttemptSaveInput {
  applicationId: number;
  locale: string;
  branch: ApplicantQuizBranch;
  profile: string;
  description: string;
  tagline: string;
  why: string;
  history: ApplicantQuizHistoryEntry[];
  rating: number;
  comment: string;
}

export interface ApplicantContactRequestRecord {
  id: number;
  applicationId: number;
  fullName: string;
  email: string;
  phone: string;
  teamId: string;
  message: string;
  sheetSyncStatus: ApplicantSheetSyncStatus;
  sheetSyncMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicantContactRequestSaveInput {
  applicationId: number;
  fullName: string;
  email: string;
  phone: string;
  teamId: string;
  message: string;
  sheetSyncStatus: ApplicantSheetSyncStatus;
  sheetSyncMessage: string;
}

export interface ApplicantWorkspaceState {
  setup: ApplicantPersistenceSetup;
  application: ApplicantApplicationRecord | null;
  latestQuizAttempt: ApplicantQuizAttemptRecord | null;
  latestContactRequest: ApplicantContactRequestRecord | null;
  error: string | null;
  errorCode: ApplicantWorkspaceErrorCode | null;
}

export interface ApplicantChatState extends ApplicantWorkspaceState {
  messages: ApplicantChatMessage[];
}

export interface ApplicantAiChatState extends ApplicantWorkspaceState {
  messages: ApplicantAiChatMessage[];
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeParticipationType(value: unknown): ApplicantParticipationType {
  return cleanText(value).toLowerCase() === "team" ? "team" : "individual";
}

function normalizeFileSize(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.round(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.round(parsed);
    }
  }

  return null;
}

function normalizeTeamMembers(payload: ApplicantFormPayload): ApplicantTeamMember[] {
  const members = [
    { name: cleanText(payload.member2Name), email: cleanText(payload.member2Email).toLowerCase() },
    { name: cleanText(payload.member3Name), email: cleanText(payload.member3Email).toLowerCase() },
    { name: cleanText(payload.member4Name), email: cleanText(payload.member4Email).toLowerCase() }
  ];

  return members.filter((member) => member.name || member.email);
}

export function normalizeApplicantFormPayload(payload: ApplicantFormPayload): NormalizedApplicantFormPayload {
  const projectTitle = cleanText(payload.projTitle || payload.projectTitle);
  const projectDomain = cleanText(payload.projDomain || payload.projectDomain);
  const projectDesc = cleanText(payload.projDesc || payload.projectDesc);
  const fileName = cleanText(payload.fileName);
  const fileType = cleanText(payload.fileType);
  const fileUrl = cleanText(payload.fileUrl);
  const fileStorage: ApplicantFileStorage = fileUrl
    ? "external"
    : fileName
      ? "google_script_only"
      : "none";

  const rawPayload: Record<string, unknown> = {
    lang: cleanText(payload.lang),
    type: normalizeParticipationType(payload.type),
    fullName: cleanText(payload.fullName),
    email: cleanText(payload.email).toLowerCase(),
    phone: cleanText(payload.phone),
    university: cleanText(payload.university),
    branch: cleanText(payload.branch),
    yearOfStudy: cleanText(payload.yearOfStudy),
    linkedin: cleanText(payload.linkedin),
    teamName: cleanText(payload.teamName),
    teamMembers: normalizeTeamMembers(payload),
    projTitle: projectTitle,
    projDomain: projectDomain,
    projDesc: projectDesc,
    innovation: cleanText(payload.innovation),
    demoFormat: cleanText(payload.demoFormat),
    heardFrom: cleanText(payload.heardFrom),
    fileName,
    fileType,
    fileSize: normalizeFileSize(payload.fileSize),
    fileUrl
  };

  return {
    locale: cleanText(payload.lang),
    participationType: normalizeParticipationType(payload.type),
    contactFullName: cleanText(payload.fullName),
    contactEmail: cleanText(payload.email).toLowerCase(),
    phone: cleanText(payload.phone),
    university: cleanText(payload.university),
    branch: cleanText(payload.branch),
    yearOfStudy: cleanText(payload.yearOfStudy),
    linkedin: cleanText(payload.linkedin),
    teamName: cleanText(payload.teamName),
    teamMembers: normalizeTeamMembers(payload),
    projectTitle,
    projectDomain,
    projectDesc,
    innovation: cleanText(payload.innovation),
    demoFormat: cleanText(payload.demoFormat),
    heardFrom: cleanText(payload.heardFrom),
    fileName,
    fileType,
    fileSizeBytes: normalizeFileSize(payload.fileSize),
    fileUrl,
    fileStorage,
    rawPayload
  };
}

export function buildApplicantSaveInput(
  payload: ApplicantFormPayload,
  options: {
    accountEmail: string;
    accountName?: string | null;
    status: ApplicantStatus;
    sheetSyncStatus?: ApplicantSheetSyncStatus;
    sheetSyncMessage?: string | null;
    submittedAt?: string | null;
    lastSyncedAt?: string | null;
    fileUrlOverride?: string | null;
    fileStorageOverride?: ApplicantFileStorage | null;
  }
): ApplicantApplicationSaveInput {
  const normalized = normalizeApplicantFormPayload(payload);
  const fileUrl = cleanText(options.fileUrlOverride ?? normalized.fileUrl);

  return {
    ...normalized,
    accountEmail: cleanText(options.accountEmail).toLowerCase(),
    accountName: cleanText(options.accountName),
    status: options.status,
    sheetSyncStatus: options.sheetSyncStatus ?? "pending",
    sheetSyncMessage: cleanText(options.sheetSyncMessage),
    submittedAt: options.submittedAt ?? null,
    lastSyncedAt: options.lastSyncedAt ?? null,
    fileUrl,
    fileStorage: options.fileStorageOverride ?? normalized.fileStorage
  };
}

export function formatApplicantTeamId(applicationId: number | string | null | undefined): string {
  const numericId =
    typeof applicationId === "number"
      ? applicationId
      : typeof applicationId === "string" && applicationId.trim()
        ? Number(applicationId)
        : 0;

  const safeId = Number.isFinite(numericId) && numericId > 0 ? Math.trunc(numericId) : 0;
  return `JP4F-${String(safeId).padStart(6, "0")}`;
}

export function splitDisplayName(fullName: string): { firstName: string; lastName: string } {
  const normalized = cleanText(fullName);
  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}
