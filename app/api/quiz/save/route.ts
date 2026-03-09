interface QuizSavePayload {
  firstName?: string;
  lastName?: string;
  lang?: string;
  branch?: string;
  profile?: string;
  history?: unknown;
  rating?: number;
  comment?: string;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuizSavePayload;
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_QUIZ ?? process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return Response.json({ success: true, skipped: true });
    }

    await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        firstName: toStringValue(body.firstName),
        lastName: toStringValue(body.lastName),
        language: toStringValue(body.lang),
        branch: toStringValue(body.branch),
        profile: toStringValue(body.profile),
        answers: JSON.stringify(Array.isArray(body.history) ? body.history : []),
        rating: typeof body.rating === "number" ? body.rating : 0,
        comment: toStringValue(body.comment)
      })
    });

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
