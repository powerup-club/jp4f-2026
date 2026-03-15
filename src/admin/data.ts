import { neon } from "@neondatabase/serverless";
import { getAdminDataSetup } from "@/admin/config";
import type {
  AdminApiError,
  AdminDataResponse,
  AdminDataSetup,
  AdminDataType,
  AdminQuizRow,
  AdminRegistrationRow
} from "@/admin/types";
import { getApplicantDatabaseUrl } from "@/applicant/config";
import { getApplicantErrorDetails } from "@/applicant/errors";

type RawRow = Record<string, unknown>;

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

function canonicalizeKey(key: string): string {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function toIndex(row: RawRow): Record<string, string> {
  return Object.entries(row).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[canonicalizeKey(key)] = typeof value === "string" ? value.trim() : String(value ?? "").trim();
    return acc;
  }, {});
}

function pick(index: Record<string, string>, aliases: string[]): string {
  for (const alias of aliases) {
    const value = index[canonicalizeKey(alias)];
    if (value) {
      return value;
    }
  }

  return "";
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

function normalizeRegistrationType(rawType: string, teamName: string): "Individuel" | "Equipe" {
  const value = rawType
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (value.includes("team") || value.includes("equipe")) {
    return "Equipe";
  }

  if (value.includes("individual") || value.includes("individuel")) {
    return "Individuel";
  }

  return teamName ? "Equipe" : "Individuel";
}

function normalizeRating(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(5, parsed));
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

export function normalizeRegistrationRow(row: RawRow): AdminRegistrationRow {
  const index = toIndex(row);
  const teamName = pick(index, [
    "teamName",
    "teamname",
    "nomEquipe",
    "nomequipe",
    "Nom equipe",
    "Nom équipe"
  ]);
  const teamMembers = parseTeamMembers(
    (row as RawRow).teamMembers ?? (row as RawRow).team_members
  );
  const member2 = teamMembers[0] ?? { name: "", email: "" };
  const member3 = teamMembers[1] ?? { name: "", email: "" };
  const member4 = teamMembers[2] ?? { name: "", email: "" };
  const member2Name =
    pick(index, [
      "member2Name",
      "member2name",
      "membre2Nom",
      "membre2nom",
      "membre2Name",
      "Membre 2 - Nom",
      "Membre 2 — Nom"
    ]) ||
    member2.name;
  const member2Email =
    pick(index, [
      "member2Email",
      "member2email",
      "membre2Email",
      "membre2email",
      "Membre 2 - Email",
      "Membre 2 — Email"
    ]) || member2.email;
  const member3Name =
    pick(index, [
      "member3Name",
      "member3name",
      "membre3Nom",
      "membre3nom",
      "membre3Name",
      "Membre 3 - Nom",
      "Membre 3 — Nom"
    ]) ||
    member3.name;
  const member3Email =
    pick(index, [
      "member3Email",
      "member3email",
      "membre3Email",
      "membre3email",
      "Membre 3 - Email",
      "Membre 3 — Email"
    ]) || member3.email;
  const member4Name =
    pick(index, [
      "member4Name",
      "member4name",
      "membre4Nom",
      "membre4nom",
      "membre4Name",
      "Membre 4 - Nom",
      "Membre 4 — Nom"
    ]) ||
    member4.name;
  const member4Email =
    pick(index, [
      "member4Email",
      "member4email",
      "membre4Email",
      "membre4email",
      "Membre 4 - Email",
      "Membre 4 — Email"
    ]) || member4.email;

  return {
    timestamp: pick(index, ["timestamp", "date", "createdAt", "createdat"]),
    lang: pick(index, ["lang", "language", "langue"]),
    type: normalizeRegistrationType(pick(index, ["type", "participationType", "participationtype"]), teamName),
    fullName: pick(index, ["fullName", "fullname", "nomComplet", "nomcomplet", "name", "nom"]),
    email: pick(index, ["email", "mail"]),
    phone: pick(index, ["phone", "telephone", "tel", "Téléphone"]),
    university: pick(index, ["university", "school", "ecole", "universite", "Université / École"]),
    branch: pick(index, ["branch", "filiere", "specialite", "track", "Filière"]),
    yearOfStudy: pick(index, ["yearOfStudy", "yearofstudy", "niveau", "studyYear", "Niveau d'études"]),
    linkedin: pick(index, ["linkedin", "linkedIn", "linkedInUrl", "linkedInURL", "LinkedIn"]),
    teamName,
    member2Name,
    member2Email,
    member3Name,
    member3Email,
    member4Name,
    member4Email,
    projTitle: pick(index, [
      "projTitle",
      "projtitle",
      "projectTitle",
      "projecttitle",
      "titreProjet",
      "titreprojet",
      "Titre du projet"
    ]),
    projDomain: pick(index, [
      "projDomain",
      "projdomain",
      "projectDomain",
      "projectdomain",
      "domaineProjet",
      "domaineprojet",
      "Domaine"
    ]),
    projDesc: pick(index, [
      "projDesc",
      "projdesc",
      "projectDesc",
      "projectdesc",
      "descriptionProjet",
      "descriptionprojet",
      "Description du projet"
    ]),
    innovation: pick(index, [
      "innovation",
      "valeurAjoutee",
      "valeurajoutee",
      "valueAdded",
      "valueadded",
      "Innovation / Valeur ajoutée"
    ]),
    demoFormat: pick(index, [
      "demoFormat",
      "demoformat",
      "presentationFormat",
      "presentationformat",
      "Format de présentation"
    ]),
    heardFrom: pick(index, ["heardFrom", "heardfrom", "source", "canal", "Comment entendu parler"]),
    fileLink: pick(index, [
      "fileLink",
      "filelink",
      "documentLink",
      "documentlink",
      "lienFichier",
      "lienfichier",
      "Fichier (lien Drive)"
    ])
  };
}

export function normalizeQuizRow(row: RawRow): AdminQuizRow {
  const index = toIndex(row);

  return {
    timestamp: pick(index, ["timestamp", "date", "createdAt", "createdat"]),
    firstName: pick(index, ["firstName", "firstname", "prenom"]),
    lastName: pick(index, ["lastName", "lastname", "nom"]),
    lang: pick(index, ["lang", "language", "langue"]),
    branch: pick(index, ["branch", "filiere", "track"]),
    profile: pick(index, ["profile", "profil"]),
    rating: normalizeRating(pick(index, ["rating", "note", "stars"])),
    comment: pick(index, ["comment", "commentaire", "feedback"])
  };
}

function createError(
  type: AdminDataType,
  setup: AdminDataSetup,
  error: AdminApiError
): AdminDataResponse<never> {
  return {
    ok: false,
    type,
    rows: [],
    total: 0,
    fetchedAt: new Date().toISOString(),
    setup,
    error
  };
}

export async function fetchAdminData(
  type: "register"
): Promise<AdminDataResponse<AdminRegistrationRow>>;
export async function fetchAdminData(
  type: "quiz"
): Promise<AdminDataResponse<AdminQuizRow>>;
export async function fetchAdminData(
  type: AdminDataType
): Promise<AdminDataResponse<AdminRegistrationRow> | AdminDataResponse<AdminQuizRow>> {
  const setup = getAdminDataSetup(type);
  if (!setup.ready) {
    return createError(type, setup, {
      code: "missing_config",
      message: "Configuration admin incomplete",
      details: setup.issues.join(", ")
    });
  }

  const sql = getSql();
  if (!sql) {
    return createError(type, setup, {
      code: "missing_config",
      message: "Configuration admin incomplete",
      details: setup.issues.join(", ")
    });
  }

  try {
    if (type === "quiz") {
      const rawRows = (await sql`
        WITH latest_quiz AS (
          SELECT DISTINCT ON (quiz.application_id)
            quiz.application_id,
            quiz.created_at AS "timestamp",
            quiz.locale AS "lang",
            quiz.branch AS "branch",
            quiz.profile AS "profile",
            quiz.rating AS "rating",
            quiz.comment AS "comment",
            COALESCE(
              NULLIF(app.contact_full_name, ''),
              NULLIF(app.account_name, ''),
              NULLIF(app.contact_email, ''),
              NULLIF(app.account_email, '')
            ) AS "fullName"
          FROM application_quiz_attempts AS quiz
          INNER JOIN applicant_applications AS app
            ON app.id = quiz.application_id
          ORDER BY quiz.application_id, quiz.created_at DESC, quiz.id DESC
        )
        SELECT "timestamp", "lang", "branch", "profile", "rating", "comment", "fullName"
        FROM latest_quiz
        ORDER BY "timestamp" DESC NULLS LAST, application_id DESC
      `) as RawRow[];

      const rows = rawRows.map((row) => {
        const index = toIndex(row);
        const names = splitFullName(pick(index, ["fullName", "fullname", "name", "nom"]));

        return normalizeQuizRow({
          timestamp: pick(index, ["timestamp", "date", "createdAt", "createdat"]),
          firstName: names.firstName,
          lastName: names.lastName,
          lang: pick(index, ["lang", "language", "langue"]),
          branch: pick(index, ["branch", "filiere", "track"]),
          profile: pick(index, ["profile", "profil"]),
          rating: pick(index, ["rating", "note", "stars"]),
          comment: pick(index, ["comment", "commentaire", "feedback"])
        });
      });

      return {
        ok: true,
        type,
        rows,
        total: rows.length,
        fetchedAt: new Date().toISOString(),
        setup
      };
    }

    const rawRows = (await sql`
      SELECT
        COALESCE(submitted_at, updated_at, created_at) AS "timestamp",
        locale AS "lang",
        participation_type AS "type",
        COALESCE(NULLIF(contact_full_name, ''), NULLIF(account_name, '')) AS "fullName",
        COALESCE(NULLIF(contact_email, ''), NULLIF(account_email, '')) AS "email",
        phone AS "phone",
        university AS "university",
        branch AS "branch",
        year_of_study AS "yearOfStudy",
        linkedin AS "linkedin",
        team_name AS "teamName",
        team_members AS "teamMembers",
        project_title AS "projTitle",
        project_domain AS "projDomain",
        project_desc AS "projDesc",
        innovation AS "innovation",
        demo_format AS "demoFormat",
        heard_from AS "heardFrom",
        file_url AS "fileLink"
      FROM applicant_applications
      WHERE status = 'submitted'
      ORDER BY COALESCE(submitted_at, updated_at, created_at) DESC NULLS LAST, id DESC
    `) as RawRow[];

    const rows = rawRows.map(normalizeRegistrationRow);
    return {
      ok: true,
      type,
      rows,
      total: rows.length,
      fetchedAt: new Date().toISOString(),
      setup
    };
  } catch (error) {
    const details = getApplicantErrorDetails(error);
    return createError(type, setup, {
      code: "database_error",
      message: "Impossible de lire les donnees Neon",
      details: details.message
    });
  }
}
