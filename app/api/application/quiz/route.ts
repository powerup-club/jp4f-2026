import { auth } from "@/auth";
import { getApplicantPersistenceSetup } from "@/applicant/config";
import { getApplicantWorkspace, saveApplicantQuizAttempt } from "@/applicant/data";
import type { ApplicantQuizBranch, ApplicantQuizHistoryEntry } from "@/applicant/types";

type SupportedLocale = "fr" | "en" | "ar";

interface QuizPayload {
  firstName?: unknown;
  lastName?: unknown;
  lang?: unknown;
  branch?: unknown;
  profile?: unknown;
  description?: unknown;
  tagline?: unknown;
  why?: unknown;
  history?: unknown;
  rating?: unknown;
  comment?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLocale(value: unknown): SupportedLocale {
  return value === "en" || value === "ar" ? value : "fr";
}

function resolveBranch(value: unknown): ApplicantQuizBranch | null {
  return value === "GESI" || value === "MECA" || value === "MECATRONIQUE" || value === "GI"
    ? value
    : null;
}

function resolveRating(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(parsed)));
}

function resolveHistory(value: unknown): ApplicantQuizHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return { q: "", a: "" };
      }

      const row = entry as { q?: unknown; a?: unknown };
      return {
        q: text(row.q),
        a: text(row.a)
      };
    })
    .filter((entry) => entry.q || entry.a);
}

export async function POST(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const setup = getApplicantPersistenceSetup();
  if (!setup.ready) {
    return Response.json(
      {
        error: { code: "setup_required", message: "Applicant persistence is not configured" },
        setup
      },
      { status: 503 }
    );
  }

  try {
    const payload = (await request.json()) as QuizPayload;
    const locale = resolveLocale(payload.lang);
    const branch = resolveBranch(payload.branch);
    const profile = text(payload.profile);
    const description = text(payload.description);
    const tagline = text(payload.tagline);
    const why = text(payload.why);
    const history = resolveHistory(payload.history);
    const rating = resolveRating(payload.rating);
    const comment = text(payload.comment);

    if (!branch || !profile || !description || !tagline || !why) {
      return Response.json(
        {
          error: { code: "invalid_body", message: "Quiz result is incomplete" },
          setup
        },
        { status: 400 }
      );
    }

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
          },
          setup
        },
        { status: 500 }
      );
    }

    const attempt = await saveApplicantQuizAttempt({
      applicationId: workspace.application.id,
      locale,
      branch,
      profile,
      description,
      tagline,
      why,
      history,
      rating,
      comment
    });

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_QUIZ?.trim() || process.env.GOOGLE_SCRIPT_URL?.trim() || "";

    if (!scriptUrl) {
      return Response.json({
        success: true,
        skipped: true,
        attempt
      });
    }

    const firstName = text(payload.firstName);
    const lastName = text(payload.lastName);

    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        firstName,
        lastName,
        language: locale,
        branch,
        profile,
        answers: JSON.stringify(history),
        rating,
        comment
      })
    });

    if (!upstream.ok) {
      const upstreamBody = await upstream.text().catch(() => "");
      return Response.json(
        {
          error: { code: "upstream_failed", message: upstreamBody.slice(0, 220) || "Could not sync quiz result" },
          setup,
          attempt
        },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      skipped: false,
      attempt
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save quiz result";
    return Response.json({ error: { code: "save_failed", message }, setup }, { status: 500 });
  }
}
