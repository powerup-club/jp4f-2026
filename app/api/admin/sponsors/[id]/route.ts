import { auth } from "@/auth";
import { isAdminEmail } from "@/admin/config";
import { getApplicantDatabaseUrl } from "@/applicant/config";
import { neon } from "@neondatabase/serverless";

const STATUS_VALUES = ["pending", "contacted", "confirmed", "declined"] as const;

function isValidStatus(value: string): value is (typeof STATUS_VALUES)[number] {
  return STATUS_VALUES.includes(value as (typeof STATUS_VALUES)[number]);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminEmail(session.user.email)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const payload = (await request.json().catch(() => null)) as { status?: unknown } | null;
    const statusValue = typeof payload?.status === "string" ? payload.status.trim() : "";

    if (!isValidStatus(statusValue)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const databaseUrl = getApplicantDatabaseUrl();
    if (!databaseUrl) {
      return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    const sql = neon(databaseUrl);
    const rows = await sql`
      UPDATE sponsor_applications
      SET status = ${statusValue}
      WHERE id = ${numericId}
      RETURNING id, status
    `;

    if (!rows || rows.length === 0) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    return Response.json({ success: true, id: numericId, status: statusValue });
  } catch (error) {
    console.error("Failed to update sponsor status:", error);
    return Response.json({ error: "Failed to update status" }, { status: 500 });
  }
}
