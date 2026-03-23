import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { getApplicantDatabaseUrl, getApplicantPersistenceSetup } from "@/applicant/config";
import { getApplicantWorkspace } from "@/applicant/data";
import { getApplicantErrorDetails } from "@/applicant/errors";

type LeaderboardRow = {
  id: number | string;
  user_name: string | null;
  score: number | string;
  total: number | string;
  percentage: number | string;
  created_at: string | Date;
};

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value) || 0;
}

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

function getSql() {
  const url = getApplicantDatabaseUrl();
  return url ? neon(url) : null;
}

export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const setup = getApplicantPersistenceSetup();
  const sql = getSql();

  if (!setup.ready || !sql) {
    return Response.json({
      leaderboard: [],
      disabled: true,
      reason: "Applicant persistence is not configured"
    });
  }

  try {
    const rows = (await sql`
      SELECT
        s.id,
        COALESCE(NULLIF(a.contact_full_name, ''), NULLIF(a.account_name, ''), split_part(a.account_email, '@', 1)) AS user_name,
        s.score,
        s.total,
        s.percentage,
        s.created_at
      FROM application_game_quiz_scores s
      INNER JOIN applicant_applications a ON a.id = s.application_id
      ORDER BY s.percentage DESC, s.score DESC, s.created_at ASC, s.id ASC
      LIMIT 20
    `) as LeaderboardRow[];

    return Response.json({
      leaderboard: rows.map((row) => ({
        id: toNumber(row.id),
        userName: row.user_name?.trim() || "Applicant",
        score: toNumber(row.score),
        total: toNumber(row.total),
        percentage: toNumber(row.percentage),
        createdAt: toIsoString(row.created_at)
      })),
      disabled: false
    });
  } catch (error) {
    const details = getApplicantErrorDetails(error);
    if (details.code === "schema_missing") {
      return Response.json({
        leaderboard: [],
        disabled: true,
        reason: details.message
      });
    }

    return Response.json(
      {
        error: { code: details.code, message: details.message },
        leaderboard: [],
        disabled: true
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const setup = getApplicantPersistenceSetup();
  const sql = getSql();

  if (!setup.ready || !sql) {
    return Response.json(
      {
        error: { code: "setup_required", message: "Applicant persistence is not configured" }
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { score?: unknown; total?: unknown; locale?: unknown };
    const score = Math.max(0, Math.round(Number(body.score) || 0));
    const total = Math.max(1, Math.round(Number(body.total) || 0));
    const percentage = Math.max(0, Math.min(100, Math.round((score / total) * 100)));
    const locale = typeof body.locale === "string" ? body.locale.trim() : "";

    const workspace = await getApplicantWorkspace(session.user.email, {
      ensureApplication: true,
      accountName: session.user.name,
      locale
    });

    if (workspace.error || !workspace.application) {
      return Response.json(
        {
          error: {
            code: workspace.errorCode || "database_error",
            message: workspace.error || "Applicant workspace is unavailable"
          }
        },
        { status: 500 }
      );
    }

    await sql`
      INSERT INTO application_game_quiz_scores (application_id, score, total, percentage)
      VALUES (${workspace.application.id}, ${score}, ${total}, ${percentage})
    `;

    return Response.json({
      success: true,
      score,
      total,
      percentage
    });
  } catch (error) {
    const details = getApplicantErrorDetails(error);
    return Response.json({ error: { code: details.code, message: details.message } }, { status: 500 });
  }
}
