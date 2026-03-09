import { neon } from "@neondatabase/serverless";
import { getApplicantDatabaseUrl, getApplicantPersistenceSetup } from "@/applicant/config";
import type {
  ApplicantApplicationRecord,
  ApplicantApplicationSaveInput,
  ApplicantChatMessage,
  ApplicantChatState,
  ApplicantFileStorage,
  ApplicantMessageRole,
  ApplicantParticipationType,
  ApplicantWorkspaceState
} from "@/applicant/types";

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

function mapApplicationRow(row: DatabaseApplicationRow): ApplicantApplicationRecord {
  return {
    id: Number(row.id),
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

function databaseError(error: unknown): string {
  return error instanceof Error ? error.message : "Neon query failed";
}

export async function getApplicantWorkspace(accountEmail: string): Promise<ApplicantWorkspaceState> {
  const setup = getApplicantPersistenceSetup();
  const sql = getSql();

  if (!setup.ready || !sql) {
    return { setup, application: null, error: null };
  }

  try {
    const [row] = (await sql`
      SELECT *
      FROM applicant_applications
      WHERE account_email = ${accountEmail.toLowerCase()}
      LIMIT 1
    `) as DatabaseApplicationRow[];

    return {
      setup,
      application: row ? mapApplicationRow(row) : null,
      error: null
    };
  } catch (error) {
    return {
      setup,
      application: null,
      error: databaseError(error)
    };
  }
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
    return {
      ...workspace,
      messages: [],
      error: databaseError(error)
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
