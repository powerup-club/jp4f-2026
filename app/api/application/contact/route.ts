import { auth } from "@/auth";
import { getApplicantContactScriptUrl, getApplicantPersistenceSetup } from "@/applicant/config";
import { getApplicantWorkspace, saveApplicantContactRequest } from "@/applicant/data";

interface ContactPayload {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  teamId?: unknown;
  message?: unknown;
}

interface ContactUpstreamPayload {
  success?: unknown;
  error?: unknown;
  message?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function looksLikeHtml(value: string): boolean {
  return /^\s*</.test(value);
}

function getUpstreamFailureMessage(options: {
  status: number;
  contentType: string;
  body: string;
  payload?: ContactUpstreamPayload | null;
}): string {
  const payloadMessage = text(options.payload?.error) || text(options.payload?.message);
  if (payloadMessage) {
    return payloadMessage;
  }

  if (options.contentType.toLowerCase().includes("text/html") || looksLikeHtml(options.body)) {
    return "Google Apps Script contact endpoint returned HTML. Check the deployed /exec URL and public access.";
  }

  const normalizedBody = options.body.replace(/\s+/g, " ").trim();
  return normalizedBody.slice(0, 220) || `Upstream contact failed (${options.status})`;
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
    const payload = (await request.json()) as ContactPayload;
    const fullName = text(payload.fullName);
    const email = text(payload.email).toLowerCase();
    const phone = text(payload.phone);
    const teamId = text(payload.teamId);
    const message = text(payload.message);

    if (!fullName || !email || !teamId || !message) {
      return Response.json(
        {
          error: { code: "invalid_body", message: "Full name, email, team ID, and message are required" },
          setup
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        {
          error: { code: "invalid_email", message: "A valid email is required" },
          setup
        },
        { status: 400 }
      );
    }

    const workspace = await getApplicantWorkspace(session.user.email, {
      ensureApplication: true,
      accountName: session.user.name
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

    const scriptUrl = getApplicantContactScriptUrl();

    if (!scriptUrl) {
      const saved = await saveApplicantContactRequest({
        applicationId: workspace.application.id,
        fullName,
        email,
        phone,
        teamId,
        message,
        sheetSyncStatus: "skipped",
        sheetSyncMessage: "GOOGLE_SCRIPT_URL_CONTACT_RESPONSIBLE missing"
      });

      return Response.json({
        success: true,
        skipped: true,
        request: saved
      });
    }

    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        accountEmail: session.user.email,
        accountName: session.user.name?.trim() ?? "",
        fullName,
        email,
        phone,
        teamId,
        message
      })
    });

    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.toLowerCase().includes("application/json")) {
      const upstreamPayload = (await upstream.json().catch(() => null)) as ContactUpstreamPayload | null;
      const upstreamFailed = !upstream.ok || upstreamPayload?.success === false;

      if (upstreamFailed) {
        const message = getUpstreamFailureMessage({
          status: upstream.status,
          contentType,
          body: "",
          payload: upstreamPayload
        });
        const saved = await saveApplicantContactRequest({
          applicationId: workspace.application.id,
          fullName,
          email,
          phone,
          teamId,
          message,
          sheetSyncStatus: "failed",
          sheetSyncMessage: message
        });

        return Response.json(
          {
            error: { code: "upstream_failed", message: saved.sheetSyncMessage || "Could not sync contact request" },
            setup,
            request: saved
          },
          { status: 502 }
        );
      }

      const saved = await saveApplicantContactRequest({
        applicationId: workspace.application.id,
        fullName,
        email,
        phone,
        teamId,
        message,
        sheetSyncStatus: "synced",
        sheetSyncMessage: ""
      });

      return Response.json({
        success: true,
        skipped: false,
        request: saved
      });
    }

    const upstreamBody = await upstream.text().catch(() => "");
    const failureMessage = getUpstreamFailureMessage({
      status: upstream.status,
      contentType,
      body: upstreamBody
    });
    const saved = await saveApplicantContactRequest({
      applicationId: workspace.application.id,
      fullName,
      email,
      phone,
      teamId,
      message,
      sheetSyncStatus: "failed",
      sheetSyncMessage: failureMessage
    });

    return Response.json(
      {
        error: { code: "upstream_failed", message: saved.sheetSyncMessage || "Could not sync contact request" },
        setup,
        request: saved
      },
      { status: 502 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send contact request";
    return Response.json({ error: { code: "save_failed", message }, setup }, { status: 500 });
  }
}
