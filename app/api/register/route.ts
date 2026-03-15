import { auth } from "@/auth";
import { getApplicantPersistenceSetup } from "@/applicant/config";
import { saveApplicantApplication } from "@/applicant/data";
import { buildApplicantSaveInput, type ApplicantFileStorage, type ApplicantFormPayload } from "@/applicant/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toPersistedFileLink(value: unknown): string {
  const fileLink = text(value);
  return /^https?:\/\//i.test(fileLink) ? fileLink : "";
}

function validateTeamMember(member: { index: number; name: string; email: string }): string | null {
  if (!member.name && !member.email) {
    return null;
  }

  if (member.name && !member.email) {
    return `Membre ${member.index}: Email obligatoire si le nom est rempli.`;
  }

  if (member.email && !member.name) {
    return `Membre ${member.index}: Nom obligatoire si l'email est rempli.`;
  }

  if (member.email && !EMAIL_REGEX.test(member.email)) {
    return `Membre ${member.index}: Email invalide.`;
  }

  return null;
}

export async function POST(request: Request) {
  let body: ApplicantFormPayload | null = null;
  let sessionEmail = "";
  let sessionName = "";
  let submittedAt: string | null = null;
  let hasPersistedApplication = false;
  const persistenceSetup = getApplicantPersistenceSetup();

  async function persistApplication(options: {
    status: "submitted";
    sheetSyncStatus: "pending" | "synced" | "skipped" | "failed";
    sheetSyncMessage?: string;
    submittedAt?: string | null;
    lastSyncedAt?: string | null;
    fileUrl?: string | null;
    fileStorage?: ApplicantFileStorage | null;
  }) {
    if (!body || !sessionEmail || !persistenceSetup.ready) {
      throw new Error("Applicant persistence is not configured");
    }

    const record = await saveApplicantApplication(
      buildApplicantSaveInput(body, {
        accountEmail: sessionEmail,
        accountName: sessionName,
        status: options.status,
        sheetSyncStatus: options.sheetSyncStatus,
        sheetSyncMessage: options.sheetSyncMessage,
        submittedAt: options.submittedAt,
        lastSyncedAt: options.lastSyncedAt,
        fileUrlOverride: options.fileUrl,
        fileStorageOverride: options.fileStorage
      })
    );
    hasPersistedApplication = true;
    return record;
  }

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    sessionEmail = session.user.email;
    sessionName = session.user.name?.trim() ?? "";
    body = (await request.json()) as ApplicantFormPayload;
    if (!persistenceSetup.ready) {
      return Response.json(
        { error: "Applicant persistence is not configured", setup: persistenceSetup },
        { status: 503 }
      );
    }

    const contactFullName = text(body.fullName);
    const contactEmail = text(body.email).toLowerCase();
    const participationType = text(body.type);

    if (!contactFullName) {
      return Response.json({ error: "Nom complet obligatoire." }, { status: 400 });
    }

    if (!contactEmail) {
      return Response.json({ error: "Email obligatoire." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(contactEmail)) {
      return Response.json({ error: "Email invalide." }, { status: 400 });
    }

    if (participationType === "team") {
      const teamName = text(body.teamName);
      if (!teamName) {
        return Response.json({ error: "Nom d'equipe obligatoire." }, { status: 400 });
      }

      const members = [
        { index: 2, name: text(body.member2Name), email: text(body.member2Email).toLowerCase() },
        { index: 3, name: text(body.member3Name), email: text(body.member3Email).toLowerCase() },
        { index: 4, name: text(body.member4Name), email: text(body.member4Email).toLowerCase() }
      ];

      for (const member of members) {
        const error = validateTeamMember(member);
        if (error) {
          return Response.json({ error }, { status: 400 });
        }
      }
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_REGISTER ?? process.env.GOOGLE_SCRIPT_URL;
    submittedAt = new Date().toISOString();

    if (!scriptUrl) {
      await persistApplication({
        status: "submitted",
        sheetSyncStatus: "skipped",
        sheetSyncMessage: "GOOGLE_SCRIPT_URL_REGISTER manquant",
        submittedAt,
        lastSyncedAt: submittedAt
      });
      return Response.json({ success: true, skipped: true });
    }

    await persistApplication({
      status: "submitted",
      sheetSyncStatus: "pending",
      submittedAt
    });

    const mappedPayload = {
      timestamp: submittedAt,
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
          status: "submitted",
          sheetSyncStatus: "failed",
          sheetSyncMessage: message,
          submittedAt,
          lastSyncedAt: new Date().toISOString()
        });
        return Response.json(data, { status: 502 });
      }

      const syncedAt = new Date().toISOString();
      const fileLink = toPersistedFileLink((data as { fileLink?: unknown }).fileLink);
      await persistApplication({
        status: "submitted",
        sheetSyncStatus: "synced",
        submittedAt,
        lastSyncedAt: syncedAt,
        fileUrl: fileLink || undefined,
        fileStorage: fileLink ? "google_script_only" : undefined
      });
      return Response.json(data, { status: 200 });
    }

    const raw = await upstream.text().catch(() => "");
    if (!upstream.ok) {
      await persistApplication({
        status: "submitted",
        sheetSyncStatus: "failed",
        sheetSyncMessage: raw.slice(0, 220) || "Upstream save failed",
        submittedAt,
        lastSyncedAt: new Date().toISOString()
      });
      return Response.json({ error: "Upstream save failed", details: raw.slice(0, 220) }, { status: 502 });
    }

    const syncedAt = new Date().toISOString();
    await persistApplication({
      status: "submitted",
      sheetSyncStatus: "synced",
      submittedAt,
      lastSyncedAt: syncedAt
    });
    return Response.json({ success: true, raw: raw.slice(0, 220) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Register failed";
    if (hasPersistedApplication && body && sessionEmail && persistenceSetup.ready) {
      try {
        await persistApplication({
          status: "submitted",
          sheetSyncStatus: "failed",
          sheetSyncMessage: message,
          submittedAt,
          lastSyncedAt: new Date().toISOString()
        });
      } catch {
        // Preserve the original failure when the fallback write also fails.
      }
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
