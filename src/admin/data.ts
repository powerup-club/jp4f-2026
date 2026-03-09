import { getAdminDataSecret, getAdminDataSetup, getGoogleScriptUrl } from "@/admin/config";
import type {
  AdminApiError,
  AdminDataResponse,
  AdminDataSetup,
  AdminDataType,
  AdminQuizRow,
  AdminRegistrationRow
} from "@/admin/types";

type RawRow = Record<string, unknown>;

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

export function normalizeRegistrationRow(row: RawRow): AdminRegistrationRow {
  const index = toIndex(row);
  const teamName = pick(index, ["teamName", "teamname", "nomEquipe", "nomequipe"]);

  return {
    timestamp: pick(index, ["timestamp", "date", "createdAt", "createdat"]),
    lang: pick(index, ["lang", "language", "langue"]),
    type: normalizeRegistrationType(pick(index, ["type", "participationType", "participationtype"]), teamName),
    fullName: pick(index, ["fullName", "fullname", "nomComplet", "nomcomplet", "name", "nom"]),
    email: pick(index, ["email", "mail"]),
    phone: pick(index, ["phone", "telephone", "tel"]),
    university: pick(index, ["university", "school", "ecole", "universite"]),
    branch: pick(index, ["branch", "filiere", "specialite", "track"]),
    yearOfStudy: pick(index, ["yearOfStudy", "yearofstudy", "niveau", "studyYear"]),
    teamName,
    projTitle: pick(index, ["projTitle", "projtitle", "projectTitle", "projecttitle", "titreProjet", "titreprojet"]),
    projDomain: pick(index, ["projDomain", "projdomain", "projectDomain", "projectdomain", "domaineProjet", "domaineprojet"]),
    demoFormat: pick(index, ["demoFormat", "demoformat", "presentationFormat", "presentationformat"]),
    heardFrom: pick(index, ["heardFrom", "heardfrom", "source", "canal"]),
    fileLink: pick(index, ["fileLink", "filelink", "documentLink", "documentlink", "lienFichier", "lienfichier"])
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

function toRowsPayload(payload: unknown): RawRow[] | null {
  if (!payload || typeof payload !== "object" || !("rows" in payload)) {
    return null;
  }

  const rows = (payload as { rows?: unknown }).rows;
  if (!Array.isArray(rows)) {
    return null;
  }

  return rows.filter((row): row is RawRow => Boolean(row && typeof row === "object"));
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

  const scriptUrl = getGoogleScriptUrl(type);
  const secret = getAdminDataSecret();
  const url = new URL(scriptUrl);
  url.searchParams.set("action", "getData");
  url.searchParams.set("secret", secret);

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(url, {
      method: "GET",
      cache: "no-store"
    });
  } catch (error) {
    return createError(type, setup, {
      code: "upstream_failed",
      message: "Impossible de joindre Google Apps Script",
      details: error instanceof Error ? error.message : undefined
    });
  }

  let payload: unknown;
  try {
    payload = await upstreamResponse.json();
  } catch {
    return createError(type, setup, {
      code: "invalid_payload",
      message: "La reponse Apps Script n'est pas un JSON valide"
    });
  }

  if (!upstreamResponse.ok) {
    const details =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error ?? "")
        : upstreamResponse.statusText;

    return createError(type, setup, {
      code: "upstream_failed",
      message: "Apps Script a retourne une erreur",
      details
    });
  }

  const rawRows = toRowsPayload(payload);
  if (!rawRows) {
    return createError(type, setup, {
      code: "invalid_payload",
      message: "Le format de reponse Apps Script est invalide"
    });
  }

  if (type === "quiz") {
    const rows = rawRows.map(normalizeQuizRow);
    return {
      ok: true,
      type,
      rows,
      total: rows.length,
      fetchedAt: new Date().toISOString(),
      setup
    };
  }

  const rows = rawRows.map(normalizeRegistrationRow);
  return {
    ok: true,
    type,
    rows,
    total: rows.length,
    fetchedAt: new Date().toISOString(),
    setup
  };
}
