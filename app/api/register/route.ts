import { auth } from "@/auth";
import { getApplicantPersistenceSetup } from "@/applicant/config";
import { saveApplicantApplication } from "@/applicant/data";
import { buildApplicantSaveInput, type ApplicantFormPayload } from "@/applicant/types";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: ApplicantFormPayload | null = null;
  let sessionEmail = "";
  let sessionName = "";

  async function persistApplication(options: {
    status: "draft" | "submitted";
    sheetSyncStatus: "pending" | "synced" | "skipped" | "failed";
    sheetSyncMessage?: string;
    submittedAt?: string | null;
    lastSyncedAt?: string | null;
  }) {
    if (!body || !sessionEmail || !getApplicantPersistenceSetup().ready) {
      return;
    }

    try {
      await saveApplicantApplication(
        buildApplicantSaveInput(body, {
          accountEmail: sessionEmail,
          accountName: sessionName,
          status: options.status,
          sheetSyncStatus: options.sheetSyncStatus,
          sheetSyncMessage: options.sheetSyncMessage,
          submittedAt: options.submittedAt,
          lastSyncedAt: options.lastSyncedAt
        })
      );
    } catch {
      // Sheets submission remains the source of truth for this route.
    }
  }

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    sessionEmail = session.user.email;
    sessionName = session.user.name?.trim() ?? "";
    body = (await request.json()) as ApplicantFormPayload;
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_REGISTER ?? process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      const syncedAt = new Date().toISOString();
      await persistApplication({
        status: "submitted",
        sheetSyncStatus: "skipped",
        sheetSyncMessage: "GOOGLE_SCRIPT_URL_REGISTER manquant",
        submittedAt: syncedAt,
        lastSyncedAt: syncedAt
      });
      return Response.json({ success: true, skipped: true });
    }

    const mappedPayload = {
      timestamp: new Date().toISOString(),
      lang: text(body.lang),
      type: text(body.type),
      fullName: text(body.fullName),
      email: text(body.email),
      phone: text(body.phone),
      university: text(body.university),
      branch: text(body.branch),
      yearOfStudy: text(body.yearOfStudy),
      linkedin: text(body.linkedin),
      teamName: text(body.teamName),
      member2Name: text(body.member2Name),
      member2Email: text(body.member2Email),
      member3Name: text(body.member3Name),
      member3Email: text(body.member3Email),
      member4Name: text(body.member4Name),
      member4Email: text(body.member4Email),
      projTitle: text(body.projTitle || body.projectTitle),
      projDomain: text(body.projDomain || body.projectDomain),
      projDesc: text(body.projDesc || body.projectDesc),
      innovation: text(body.innovation),
      demoFormat: text(body.demoFormat),
      heardFrom: text(body.heardFrom),
      fileBase64: text(body.fileBase64),
      fileName: text(body.fileName)
    };

    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mappedPayload)
    });

    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await upstream.json();
      if (!upstream.ok) {
        const message = text((data as { error?: unknown; message?: unknown }).error)
          || text((data as { error?: unknown; message?: unknown }).message)
          || "Upstream save failed";
        await persistApplication({
          status: "draft",
          sheetSyncStatus: "failed",
          sheetSyncMessage: message,
          lastSyncedAt: new Date().toISOString()
        });
        return Response.json(data, { status: 502 });
      }

      const syncedAt = new Date().toISOString();
      await persistApplication({
        status: "submitted",
        sheetSyncStatus: "synced",
        submittedAt: syncedAt,
        lastSyncedAt: syncedAt
      });
      return Response.json(data, { status: 200 });
    }

    const raw = await upstream.text().catch(() => "");
    if (!upstream.ok) {
      await persistApplication({
        status: "draft",
        sheetSyncStatus: "failed",
        sheetSyncMessage: raw.slice(0, 220) || "Upstream save failed",
        lastSyncedAt: new Date().toISOString()
      });
      return Response.json({ error: "Upstream save failed", details: raw.slice(0, 220) }, { status: 502 });
    }

    const syncedAt = new Date().toISOString();
    await persistApplication({
      status: "submitted",
      sheetSyncStatus: "synced",
      submittedAt: syncedAt,
      lastSyncedAt: syncedAt
    });
    return Response.json({ success: true, raw: raw.slice(0, 220) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Register failed";
    await persistApplication({
      status: "draft",
      sheetSyncStatus: "failed",
      sheetSyncMessage: message,
      lastSyncedAt: new Date().toISOString()
    });
    return Response.json({ error: message }, { status: 500 });
  }
}
