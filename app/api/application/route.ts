import { auth } from "@/auth";
import { getApplicantPersistenceSetup } from "@/applicant/config";
import { getApplicantWorkspace, saveApplicantApplication } from "@/applicant/data";
import { buildApplicantSaveInput, type ApplicantFormPayload } from "@/applicant/types";

export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  const state = await getApplicantWorkspace(session.user.email);
  if (!state.setup.ready) {
    return Response.json(
      {
        error: { code: "setup_required", message: "Applicant persistence is not configured" },
        setup: state.setup,
        application: null
      },
      { status: 503 }
    );
  }

  if (state.error) {
    return Response.json(
      {
        error: { code: "database_error", message: state.error },
        setup: state.setup,
        application: null
      },
      { status: 500 }
    );
  }

  return Response.json({
    setup: state.setup,
    application: state.application
  });
}

export async function PUT(request: Request) {
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
    const payload = (await request.json()) as ApplicantFormPayload;
    const record = await saveApplicantApplication(
      buildApplicantSaveInput(payload, {
        accountEmail: session.user.email,
        accountName: session.user.name,
        status: "draft"
      })
    );

    return Response.json({
      setup,
      application: record
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save applicant draft";
    return Response.json({ error: { code: "save_failed", message }, setup }, { status: 500 });
  }
}
