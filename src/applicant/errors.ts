import type { ApplicantWorkspaceErrorCode } from "@/applicant/types";

const BASE_SCHEMA_RELATIONS = new Set(["applicant_applications", "application_messages"]);
const FEATURE_SCHEMA_RELATIONS = new Set([
  "application_ai_messages",
  "application_quiz_attempts",
  "application_contact_requests",
  "application_game_quiz_scores"
]);
const LEGACY_SCHEMA_COLUMNS = new Set([
  "account_email",
  "account_name",
  "locale",
  "sheet_sync_status",
  "sheet_sync_message",
  "participation_type",
  "contact_full_name",
  "contact_email",
  "team_members",
  "project_title",
  "project_domain",
  "project_desc",
  "file_name",
  "file_type",
  "file_size_bytes",
  "file_url",
  "file_storage",
  "raw_payload",
  "last_synced_at"
]);

export interface ApplicantErrorDetails {
  code: ApplicantWorkspaceErrorCode;
  message: string;
  relation: string | null;
}

function extractRelation(message: string): string | null {
  const match = message.match(/relation "([^"]+)" does not exist/i);
  return match?.[1] ?? null;
}

function extractMissingColumn(message: string): string | null {
  const quoted = message.match(/column "([^"]+)" does not exist/i);
  if (quoted?.[1]) {
    return quoted[1];
  }

  const unquoted = message.match(/column ([^\s]+) does not exist/i);
  return unquoted?.[1] ?? null;
}

function extractNotNullConstraintColumn(message: string): string | null {
  const match = message.match(/null value in column "([^"]+)" of relation "([^"]+)" violates not-null constraint/i);
  return match?.[1] ?? null;
}

function schemaMessageForRelation(relation: string | null): string {
  if (relation && BASE_SCHEMA_RELATIONS.has(relation)) {
    return "Schema Neon incomplete. Run db/neon/001_applicant_portal.sql.";
  }

  if (relation && FEATURE_SCHEMA_RELATIONS.has(relation)) {
    return "Schema Neon features incomplete. Run db/neon/001_applicant_portal.sql, then db/neon/002_application_portal_features.sql.";
  }

  return "Schema Neon incomplete. Run the applicant portal migrations.";
}

function schemaMessageForColumn(column: string | null): string {
  const normalizedColumn = column?.split(".").pop()?.toLowerCase() ?? null;
  if (normalizedColumn && LEGACY_SCHEMA_COLUMNS.has(normalizedColumn)) {
    return "Schema Neon outdated. Run db/neon/003_align_legacy_applicant_applications.sql.";
  }

  return "Schema Neon incomplete. Run the applicant portal migrations.";
}

function schemaMessageForConstraint(column: string | null): string {
  const normalizedColumn = column?.split(".").pop()?.toLowerCase() ?? null;
  if (normalizedColumn === "user_email") {
    return "Schema Neon outdated. Run db/neon/004_relax_legacy_applicant_constraints.sql.";
  }

  return "Schema Neon incomplete. Run the applicant portal migrations.";
}

export function getApplicantErrorDetails(error: unknown): ApplicantErrorDetails {
  const rawMessage = error instanceof Error ? error.message : "Neon query failed";
  const relation = extractRelation(rawMessage);
  const column = extractMissingColumn(rawMessage);
  const constraintColumn = extractNotNullConstraintColumn(rawMessage);

  if (relation) {
    return {
      code: "schema_missing",
      message: schemaMessageForRelation(relation),
      relation
    };
  }

  if (column) {
    return {
      code: "schema_missing",
      message: schemaMessageForColumn(column),
      relation: null
    };
  }

  if (constraintColumn) {
    return {
      code: "schema_missing",
      message: schemaMessageForConstraint(constraintColumn),
      relation: null
    };
  }

  return {
    code: "database_error",
    message: rawMessage,
    relation: null
  };
}

export function isApplicantFeatureRelation(relation: string | null): boolean {
  return relation ? FEATURE_SCHEMA_RELATIONS.has(relation) : false;
}
