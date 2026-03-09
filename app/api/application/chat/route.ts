import { auth } from "@/auth";
import { getApplicantPersistenceSetup } from "@/applicant/config";
import { createApplicantMessage, getApplicantChat } from "@/applicant/data";

interface ChatPayload {
  body?: unknown;
  locale?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const state = await getApplicantChat(session.user.email);
  if (!state.setup.ready) {
    return Response.json(
      {
        error: { code: "setup_required", message: "Applicant persistence is not configured" },
        setup: state.setup,
        application: null,
        messages: []
      },
      { status: 503 }
    );
  }

  if (state.error) {
    return Response.json(
      {
        error: { code: "database_error", message: state.error },
        setup: state.setup,
        application: state.application,
        messages: []
      },
      { status: 500 }
    );
  }

  return Response.json({
    setup: state.setup,
    application: state.application,
    messages: state.messages
  });
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
    const payload = (await request.json()) as ChatPayload;
    const body = text(payload.body);

    if (!body) {
      return Response.json(
        {
          error: { code: "invalid_body", message: "Message body is required" },
          setup
        },
        { status: 400 }
      );
    }

    const message = await createApplicantMessage({
      accountEmail: session.user.email,
      accountName: session.user.name,
      locale: text(payload.locale),
      body
    });

    return Response.json({
      setup,
      message
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save applicant message";
    return Response.json({ error: { code: "save_failed", message }, setup }, { status: 500 });
  }
}
