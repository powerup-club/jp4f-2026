import { auth } from "@/auth";
import { getApplicantDatabaseUrl } from "@/applicant/config";
import { neon } from "@neondatabase/serverless";

type EvaluationRow = {
  id: number;
  application_id: number;
  account_email: string;
  account_name: string;
  project_title: string;
  project_domain: string;
  global_score: number;
  verdict_key: string;
  ai_detection: unknown;
  summary: string;
  strengths: unknown;
  improvements: unknown;
  jury_tip: string;
  created_at: string;
  updated_at: string;
};

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());

function normalizeAiUsage(value: unknown): "yes" | "partial" | "no" {
  return value === "yes" || value === "partial" || value === "no" ? value : "no";
}

function normalizeAiLikelihood(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export async function GET(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email.toLowerCase();
  if (!ADMIN_EMAILS.includes(userEmail)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const databaseUrl = getApplicantDatabaseUrl();
    if (!databaseUrl) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    const evaluations = (await sql`
      SELECT
        e.id,
        e.application_id,
        a.account_email,
        a.account_name,
        a.project_title,
        a.project_domain,
        e.global_score,
        e.verdict_key,
        e.ai_detection,
        e.summary,
        e.strengths,
        e.improvements,
        e.jury_tip,
        e.created_at,
        e.updated_at
      FROM application_project_evaluations e
      JOIN applicant_applications a ON e.application_id = a.id
      ORDER BY e.created_at DESC
      LIMIT 100
    `) as EvaluationRow[];

    const formattedEvaluations = evaluations.map((row) => {
      const aiDetection =
        row.ai_detection && typeof row.ai_detection === "object" ? (row.ai_detection as Record<string, unknown>) : {};

      return {
        id: row.id,
        applicationId: row.application_id,
        applicantEmail: row.account_email,
        applicantName: row.account_name,
        projectTitle: row.project_title,
        projectDomain: row.project_domain,
        globalScore: row.global_score,
        verdictKey: row.verdict_key,
        aiTextLikelihood: normalizeAiLikelihood(aiDetection.aiTextLikelihood),
        aiTextSummary: typeof aiDetection.aiTextSummary === "string" ? aiDetection.aiTextSummary : "",
        projectAiUsage: normalizeAiUsage(aiDetection.projectAiUsage),
        projectAiSummary: typeof aiDetection.projectAiSummary === "string" ? aiDetection.projectAiSummary : "",
        summary: row.summary,
        strengths: Array.isArray(row.strengths) ? row.strengths : [],
        improvements: Array.isArray(row.improvements) ? row.improvements : [],
        juryTip: row.jury_tip,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    return Response.json({
      total: formattedEvaluations.length,
      evaluations: formattedEvaluations
    });
  } catch (error) {
    console.error("Failed to fetch evaluations:", error);
    return Response.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }
}
