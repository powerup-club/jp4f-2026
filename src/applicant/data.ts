import { neon } from "@neondatabase/serverless";
import { getApplicantErrorDetails, isApplicantFeatureRelation } from "@/applicant/errors";
import { getApplicantDatabaseUrl, getApplicantPersistenceSetup } from "@/applicant/config";
import type {
  ApplicantAiChatMessage,
  ApplicantAiChatState,
  ApplicantAiMessageRole,
  ApplicantApplicationRecord,
  ApplicantApplicationSaveInput,
  ApplicantChatMessage,
  ApplicantChatState,
  ApplicantContactRequestRecord,
  ApplicantContactRequestSaveInput,
  ApplicantFileStorage,
  ApplicantMessageRole,
  ApplicantParticipationType,
  ApplicantQuizAttemptRecord,
  ApplicantQuizAttemptSaveInput,
  ApplicantQuizBranch,
  ApplicantQuizHistoryEntry,
  ApplicantWorkspaceState
} from "@/applicant/types";
import { formatApplicantTeamId } from "@/applicant/types";

type DatabaseApplicationRow = {
  id: number | string;
  account_email: string | null;
  account_name: string | null;
  locale: string | null;
  status: string | null;
  sheet_sync_status: string | null;
  sheet_sync_message: string | null;
  participation_type: string | null;
  contact_full_name: string | null;
  contact_email: string | null;
  phone: string | null;
  university: string | null;
  branch: string | null;
  year_of_study: string | null;
  linkedin: string | null;
  team_name: string | null;
  team_members: unknown;
  project_title: string | null;
  project_domain: string | null;
  project_desc: string | null;
  innovation: string | null;
  demo_format: string | null;
  heard_from: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size_bytes: number | string | null;
  file_url: string | null;
  file_storage: string | null;
  submitted_at: string | Date | null;
  last_synced_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type DatabaseMessageRow = {
  id: number | string;
  sender_email: string | null;
  sender_name: string | null;
  sender_role: string | null;
  body: string | null;
  created_at: string | Date;
};

type DatabaseAiMessageRow = {
  id: number | string;
  role: string | null;
  content: string | null;
  created_at: string | Date;
};

type DatabaseQuizAttemptRow = {
  id: number | string;
  locale: string | null;
  branch: string | null;
  profile: string | null;
  description: string | null;
  tagline: string | null;
  why: string | null;
  history: unknown;
  rating: number | string | null;
  comment: string | null;
  created_at: string | Date;
};

type DatabaseContactRow = {
  id: number | string;
  application_id: number | string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  team_id: string | null;
  message: string | null;
  sheet_sync_status: string | null;
  sheet_sync_message: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type EnsureApplicationOptions = {
  accountEmail: string;
  accountName?: string | null;
  locale?: string | null;
};

let cachedUrl = "";
let cachedSql: ReturnType<typeof neon> | null = null;

function getSql() {
  const url = getApplicantDatabaseUrl();
  if (!url) {
    return null;
  }

  if (!cachedSql || cachedUrl !== url) {
    cachedSql = neon(url);
    cachedUrl = url;
  }

  return cachedSql;
}

function text(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function nullableText(value: string): string | null {
  return value.trim() ? value.trim() : null;
}

function toIsoString(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function parseTeamMembers(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return { name: "", email: "" };
        }

        const teamMember = entry as { name?: unknown; email?: unknown };
        return {
          name: typeof teamMember.name === "string" ? teamMember.name.trim() : "",
          email: typeof teamMember.email === "string" ? teamMember.email.trim().toLowerCase() : ""
        };
      })
      .filter((entry) => entry.name || entry.email);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      return parseTeamMembers(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
}

function parseQuizHistory(value: unknown): ApplicantQuizHistoryEntry[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return { q: "", a: "" };
        }

        const historyEntry = entry as { q?: unknown; a?: unknown };
        return {
          q: typeof historyEntry.q === "string" ? historyEntry.q.trim() : "",
          a: typeof historyEntry.a === "string" ? historyEntry.a.trim() : ""
        };
      })
      .filter((entry) => entry.q || entry.a);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      return parseQuizHistory(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeParticipationType(value: string | null): ApplicantParticipationType {
  return value === "team" ? "team" : "individual";
}

function normalizeFileStorage(value: string | null): ApplicantFileStorage {
  if (value === "external" || value === "google_script_only") {
    return value;
  }

  return "none";
}

function normalizeMessageRole(value: string | null): ApplicantMessageRole {
  if (value === "admin" || value === "system") {
    return value;
  }

  return "applicant";
}

function normalizeAiMessageRole(value: string | null): ApplicantAiMessageRole {
  if (value === "assistant" || value === "system") {
    return value;
  }

  return "user";
}

function normalizeQuizBranch(value: string | null): ApplicantQuizBranch {
  if (value === "GESI" || value === "MECA" || value === "MECATRONIQUE" || value === "GI") {
    return value;
  }

  return "GI";
}

function mapApplicationRow(row: DatabaseApplicationRow): ApplicantApplicationRecord {
  const id = Number(row.id);

  return {
    id,
    teamId: formatApplicantTeamId(id),
    accountEmail: text(row.account_email).toLowerCase(),
    accountName: text(row.account_name),
    locale: text(row.locale),
    status: row.status === "submitted" ? "submitted" : "draft",
    sheetSyncStatus:
      row.sheet_sync_status === "synced" ||
      row.sheet_sync_status === "skipped" ||
      row.sheet_sync_status === "failed"
        ? row.sheet_sync_status
        : "pending",
    sheetSyncMessage: text(row.sheet_sync_message),
    participationType: normalizeParticipationType(row.participation_type),
    contactFullName: text(row.contact_full_name),
    contactEmail: text(row.contact_email).toLowerCase(),
    phone: text(row.phone),
    university: text(row.university),
    branch: text(row.branch),
    yearOfStudy: text(row.year_of_study),
    linkedin: text(row.linkedin),
    teamName: text(row.team_name),
    teamMembers: parseTeamMembers(row.team_members),
    projectTitle: text(row.project_title),
    projectDomain: text(row.project_domain),
    projectDesc: text(row.project_desc),
    innovation: text(row.innovation),
    demoFormat: text(row.demo_format),
    heardFrom: text(row.heard_from),
    fileName: text(row.file_name),
    fileType: text(row.file_type),
    fileSizeBytes: toNumber(row.file_size_bytes),
    fileUrl: text(row.file_url),
    fileStorage: normalizeFileStorage(row.file_storage),
    submittedAt: toIsoString(row.submitted_at),
    lastSyncedAt: toIsoString(row.last_synced_at),
    createdAt: toIsoString(row.created_at) || "",
    updatedAt: toIsoString(row.updated_at) || ""
  };
}

function mapMessageRow(row: DatabaseMessageRow): ApplicantChatMessage {
  return {
    id: Number(row.id),
    senderEmail: text(row.sender_email).toLowerCase(),
    senderName: text(row.sender_name),
    senderRole: normalizeMessageRole(row.sender_role),
    body: text(row.body),
    createdAt: toIsoString(row.created_at) || ""
  };
}

function mapAiMessageRow(row: DatabaseAiMessageRow): ApplicantAiChatMessage {
  return {
    id: Number(row.id),
    role: normalizeAiMessageRole(row.role),
    content: text(row.content),
    createdAt: toIsoString(row.created_at) || ""
  };
}

function mapQuizAttemptRow(row: DatabaseQuizAttemptRow): ApplicantQuizAttemptRecord {
  return {
    id: Number(row.id),
    locale: text(row.locale),
    branch: normalizeQuizBranch(row.branch),
    profile: text(row.profile),
    description: text(row.description),
    tagline: text(row.tagline),
    why: text(row.why),
    history: parseQuizHistory(row.history),
    rating: toNumber(row.rating) ?? 0,
    comment: text(row.comment),
    createdAt: toIsoString(row.created_at) || ""
  };
}

function mapContactRow(row: DatabaseContactRow): ApplicantContactRequestRecord {
  return {
    id: Number(row.id),
    applicationId: Number(row.application_id),
    fullName: text(row.full_name),
    email: text(row.email).toLowerCase(),
    phone: text(row.phone),
    teamId: text(row.team_id),
    message: text(row.message),
    sheetSyncStatus:
      row.sheet_sync_status === "synced" ||
      row.sheet_sync_status === "skipped" ||
      row.sheet_sync_status === "failed"
        ? row.sheet_sync_status
        : "pending",
    sheetSyncMessage: text(row.sheet_sync_message),
    createdAt: toIsoString(row.created_at) || "",
    updatedAt: toIsoString(row.updated_at) || ""
  };
}

function baseWorkspaceState(): ApplicantWorkspaceState {
  return {
    setup: getApplicantPersistenceSetup(),
    application: null,
    latestQuizAttempt: null,
    latestContactRequest: null,
    error: null,
    errorCode: null
  };
}

async function ensureApplicantApplicationInternal(
  sql: ReturnType<typeof neon>,
  options: EnsureApplicationOptions
): Promise<ApplicantApplicationRecord> {
  const [row] = (await sql`
    INSERT INTO applicant_applications (account_email, account_name, locale)
    VALUES (
      ${options.accountEmail.toLowerCase()},
      ${nullableText(text(options.accountName ?? ""))},
      ${nullableText(text(options.locale ?? ""))}
    )
    ON CONFLICT (account_email) DO UPDATE SET
      account_name = COALESCE(EXCLUDED.account_name, applicant_applications.account_name),
      locale = COALESCE(EXCLUDED.locale, applicant_applications.locale),
      updated_at = NOW()
    RETURNING *
  `) as DatabaseApplicationRow[];

  return mapApplicationRow(row);
}

async function readApplicantApplicationByEmail(
  sql: ReturnType<typeof neon>,
  accountEmail: string
): Promise<ApplicantApplicationRecord | null> {
  const [row] = (await sql`
    SELECT *
    FROM applicant_applications
    WHERE account_email = ${accountEmail.toLowerCase()}
    LIMIT 1
  `) as DatabaseApplicationRow[];

  return row ? mapApplicationRow(row) : null;
}

async function readLatestQuizAttempt(
  sql: ReturnType<typeof neon>,
  applicationId: number
): Promise<ApplicantQuizAttemptRecord | null> {
  const [row] = (await sql`
    SELECT id, locale, branch, profile, description, tagline, why, history, rating, comment, created_at
    FROM application_quiz_attempts
    WHERE application_id = ${applicationId}
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `) as DatabaseQuizAttemptRow[];

  return row ? mapQuizAttemptRow(row) : null;
}

async function readLatestContactRequest(
  sql: ReturnType<typeof neon>,
  applicationId: number
): Promise<ApplicantContactRequestRecord | null> {
  const [row] = (await sql`
    SELECT id, application_id, full_name, email, phone, team_id, message, sheet_sync_status, sheet_sync_message, created_at, updated_at
    FROM application_contact_requests
    WHERE application_id = ${applicationId}
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `) as DatabaseContactRow[];

  return row ? mapContactRow(row) : null;
}

export async function ensureApplicantApplication(
  options: EnsureApplicationOptions
): Promise<ApplicantApplicationRecord> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Applicant persistence is not configured");
  }

  return ensureApplicantApplicationInternal(sql, options);
}

export async function getApplicantWorkspace(
  accountEmail: string,
  options?: {
    ensureApplication?: boolean;
    accountName?: string | null;
    locale?: string | null;
  }
): Promise<ApplicantWorkspaceState> {
  const setup = getApplicantPersistenceSetup();
  const sql = getSql();

  if (!setup.ready || !sql) {
    return {
      ...baseWorkspaceState(),
      setup
    };
  }

  let application: ApplicantApplicationRecord | null = null;

  try {
    application = options?.ensureApplication
      ? await ensureApplicantApplicationInternal(sql, {
          accountEmail,
          accountName: options.accountName,
          locale: options.locale
        })
      : await readApplicantApplicationByEmail(sql, accountEmail);
  } catch (error) {
    const details = getApplicantErrorDetails(error);
    return {
      ...baseWorkspaceState(),
      setup,
      error: details.message,
      errorCode: details.code
    };
  }

  let latestQuizAttempt: ApplicantQuizAttemptRecord | null = null;
  let latestContactRequest: ApplicantContactRequestRecord | null = null;

  if (application) {
    try {
      latestQuizAttempt = await readLatestQuizAttempt(sql, application.id);
    } catch (error) {
      const details = getApplicantErrorDetails(error);
      if (!isApplicantFeatureRelation(details.relation)) {
        latestQuizAttempt = null;
      }
    }

    try {
      latestContactRequest = await readLatestContactRequest(sql, application.id);
    } catch (error) {
      const details = getApplicantErrorDetails(error);
      if (!isApplicantFeatureRelation(details.relation)) {
        latestContactRequest = null;
      }
    }
  }

  return {
    setup,
    application,
    latestQuizAttempt,
    latestContactRequest,
    error: null,
    errorCode: null
  };
}

export async function getApplicantChat(accountEmail: string): Promise<ApplicantChatState> {
  const workspace = await getApplicantWorkspace(accountEmail);
  if (!workspace.setup.ready || workspace.error || !workspace.application) {
    return {
      ...workspace,
      messages: []
    };
  }

  const sql = getSql();
  if (!sql) {
    return {
      ...workspace,
      messages: []
    };
  }

  try {
    const rows = (await sql`
      SELECT id, sender_email, sender_name, sender_role, body, created_at
      FROM application_messages
      WHERE application_id = ${workspace.application.id}
      ORDER BY created_at ASC, id ASC
    `) as DatabaseMessageRow[];

    return {
      ...workspace,
      messages: rows.map(mapMessageRow)
    };
  } catch (error) {
    const details = getApplicantErrorDetails(error);
    return {
      ...workspace,
      messages: [],
      error: details.message,
      errorCode: details.code
    };
  }
}

export async function getApplicantAiChat(
  accountEmail: string,
  options?: {
    ensureApplication?: boolean;
    accountName?: string | null;
    locale?: string | null;
  }
): Promise<ApplicantAiChatState> {
  const workspace = await getApplicantWorkspace(accountEmail, options);
  if (!workspace.setup.ready || workspace.error || !workspace.application) {
    return {
      ...workspace,
      messages: []
    };
  }

  const sql = getSql();
  if (!sql) {
    return {
      ...workspace,
      messages: []
    };
  }

  try {
    const rows = (await sql`
      SELECT id, role, content, created_at
      FROM application_ai_messages
      WHERE application_id = ${workspace.application.id}
      ORDER BY created_at ASC, id ASC
    `) as DatabaseAiMessageRow[];

    return {
      ...workspace,
      messages: rows.map(mapAiMessageRow)
    };
  } catch (error) {
    const details = getApplicantErrorDetails(error);
    return {
      ...workspace,
      messages: [],
      error: details.message,
      errorCode: details.code
    };
  }
}

export async function saveApplicantApplication(
  input: ApplicantApplicationSaveInput
): Promise<ApplicantApplicationRecord> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Applicant persistence is not configured");
  }

  const teamMembersJson = JSON.stringify(input.teamMembers);
  const rawPayloadJson = JSON.stringify(input.rawPayload);
  const [row] = (await sql`
    INSERT INTO applicant_applications (
      account_email,
      account_name,
      locale,
      status,
      sheet_sync_status,
      sheet_sync_message,
      participation_type,
      contact_full_name,
      contact_email,
      phone,
      university,
      branch,
      year_of_study,
      linkedin,
      team_name,
      team_members,
      project_title,
      project_domain,
      project_desc,
      innovation,
      demo_format,
      heard_from,
      file_name,
      file_type,
      file_size_bytes,
      file_url,
      file_storage,
      raw_payload,
      submitted_at,
      last_synced_at
    )
    VALUES (
      ${input.accountEmail},
      ${nullableText(input.accountName)},
      ${nullableText(input.locale)},
      ${input.status},
      ${input.sheetSyncStatus},
      ${nullableText(input.sheetSyncMessage)},
      ${nullableText(input.participationType)},
      ${nullableText(input.contactFullName)},
      ${nullableText(input.contactEmail)},
      ${nullableText(input.phone)},
      ${nullableText(input.university)},
      ${nullableText(input.branch)},
      ${nullableText(input.yearOfStudy)},
      ${nullableText(input.linkedin)},
      ${nullableText(input.teamName)},
      ${teamMembersJson}::jsonb,
      ${nullableText(input.projectTitle)},
      ${nullableText(input.projectDomain)},
      ${nullableText(input.projectDesc)},
      ${nullableText(input.innovation)},
      ${nullableText(input.demoFormat)},
      ${nullableText(input.heardFrom)},
      ${nullableText(input.fileName)},
      ${nullableText(input.fileType)},
      ${input.fileSizeBytes},
      ${nullableText(input.fileUrl)},
      ${input.fileStorage},
      ${rawPayloadJson}::jsonb,
      ${input.submittedAt},
      ${input.lastSyncedAt}
    )
    ON CONFLICT (account_email) DO UPDATE SET
      account_name = EXCLUDED.account_name,
      locale = EXCLUDED.locale,
      status = EXCLUDED.status,
      sheet_sync_status = EXCLUDED.sheet_sync_status,
      sheet_sync_message = EXCLUDED.sheet_sync_message,
      participation_type = EXCLUDED.participation_type,
      contact_full_name = EXCLUDED.contact_full_name,
      contact_email = EXCLUDED.contact_email,
      phone = EXCLUDED.phone,
      university = EXCLUDED.university,
      branch = EXCLUDED.branch,
      year_of_study = EXCLUDED.year_of_study,
      linkedin = EXCLUDED.linkedin,
      team_name = EXCLUDED.team_name,
      team_members = EXCLUDED.team_members,
      project_title = EXCLUDED.project_title,
      project_domain = EXCLUDED.project_domain,
      project_desc = EXCLUDED.project_desc,
      innovation = EXCLUDED.innovation,
      demo_format = EXCLUDED.demo_format,
      heard_from = EXCLUDED.heard_from,
      file_name = EXCLUDED.file_name,
      file_type = EXCLUDED.file_type,
      file_size_bytes = EXCLUDED.file_size_bytes,
      file_url = EXCLUDED.file_url,
      file_storage = EXCLUDED.file_storage,
      raw_payload = EXCLUDED.raw_payload,
      submitted_at = EXCLUDED.submitted_at,
      last_synced_at = EXCLUDED.last_synced_at,
      updated_at = NOW()
    RETURNING *
  `) as DatabaseApplicationRow[];

  return mapApplicationRow(row);
}

export async function createApplicantMessage(options: {
  accountEmail: string;
  accountName?: string | null;
  locale?: string | null;
  body: string;
}): Promise<ApplicantChatMessage> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Applicant persistence is not configured");
  }

  const body = options.body.trim();
  if (!body) {
    throw new Error("Message body is required");
  }

  const [row] = (await sql`
    WITH application_row AS (
      INSERT INTO applicant_applications (account_email, account_name, locale)
      VALUES (
        ${options.accountEmail.toLowerCase()},
        ${nullableText(text(options.accountName ?? ""))},
        ${nullableText(text(options.locale ?? ""))}
      )
      ON CONFLICT (account_email) DO UPDATE SET
        account_name = COALESCE(EXCLUDED.account_name, applicant_applications.account_name),
        locale = COALESCE(EXCLUDED.locale, applicant_applications.locale),
        updated_at = NOW()
      RETURNING id
    )
    INSERT INTO application_messages (application_id, sender_email, sender_name, sender_role, body)
    SELECT
      id,
      ${options.accountEmail.toLowerCase()},
      ${nullableText(text(options.accountName ?? ""))},
      'applicant',
      ${body}
    FROM application_row
    RETURNING id, sender_email, sender_name, sender_role, body, created_at
  `) as DatabaseMessageRow[];

  return mapMessageRow(row);
}

export async function createApplicantAiMessage(options: {
  applicationId: number;
  role: ApplicantAiMessageRole;
  content: string;
}): Promise<ApplicantAiChatMessage> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Applicant persistence is not configured");
  }

  const content = options.content.trim();
  if (!content) {
    throw new Error("AI message content is required");
  }

  const [row] = (await sql`
    INSERT INTO application_ai_messages (application_id, role, content)
    VALUES (${options.applicationId}, ${options.role}, ${content})
    RETURNING id, role, content, created_at
  `) as DatabaseAiMessageRow[];

  return mapAiMessageRow(row);
}

export async function saveApplicantQuizAttempt(
  input: ApplicantQuizAttemptSaveInput
): Promise<ApplicantQuizAttemptRecord> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Applicant persistence is not configured");
  }

  const [row] = (await sql`
    INSERT INTO application_quiz_attempts (
      application_id,
      locale,
      branch,
      profile,
      description,
      tagline,
      why,
      history,
      rating,
      comment
    )
    VALUES (
      ${input.applicationId},
      ${nullableText(text(input.locale))},
      ${input.branch},
      ${input.profile.trim()},
      ${input.description.trim()},
      ${input.tagline.trim()},
      ${input.why.trim()},
      ${JSON.stringify(input.history)}::jsonb,
      ${input.rating},
      ${nullableText(text(input.comment))}
    )
    RETURNING id, locale, branch, profile, description, tagline, why, history, rating, comment, created_at
  `) as DatabaseQuizAttemptRow[];

  return mapQuizAttemptRow(row);
}

export async function saveApplicantContactRequest(
  input: ApplicantContactRequestSaveInput
): Promise<ApplicantContactRequestRecord> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Applicant persistence is not configured");
  }

  const [row] = (await sql`
    INSERT INTO application_contact_requests (
      application_id,
      full_name,
      email,
      phone,
      team_id,
      message,
      sheet_sync_status,
      sheet_sync_message
    )
    VALUES (
      ${input.applicationId},
      ${input.fullName.trim()},
      ${input.email.trim().toLowerCase()},
      ${nullableText(text(input.phone))},
      ${input.teamId.trim()},
      ${input.message.trim()},
      ${input.sheetSyncStatus},
      ${nullableText(text(input.sheetSyncMessage))}
    )
    RETURNING id, application_id, full_name, email, phone, team_id, message, sheet_sync_status, sheet_sync_message, created_at, updated_at
  `) as DatabaseContactRow[];

  return mapContactRow(row);
}
