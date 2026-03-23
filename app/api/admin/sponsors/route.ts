import { auth } from "@/auth";
import { isAdminEmail } from "@/admin/config";
import { getApplicantDatabaseUrl } from "@/applicant/config";
import { neon } from "@neondatabase/serverless";

type SponsorRow = {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  tier: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminEmail(session.user.email)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const databaseUrl = getApplicantDatabaseUrl();
    if (!databaseUrl) {
      return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    const sql = neon(databaseUrl);
    const rows = (await sql`
      SELECT
        id,
        company_name,
        contact_name,
        email,
        phone,
        tier,
        preferred_date,
        preferred_time,
        message,
        status,
        created_at
      FROM sponsor_applications
      ORDER BY created_at DESC
      LIMIT 200
    `) as SponsorRow[];

    const applications = rows.map((row) => ({
      id: row.id,
      companyName: row.company_name,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      tier: row.tier,
      preferredDate: row.preferred_date,
      preferredTime: row.preferred_time,
      message: row.message,
      status: row.status,
      createdAt: row.created_at
    }));

    return Response.json({ total: applications.length, applications });
  } catch (error) {
    console.error("Failed to fetch sponsor applications:", error);
    return Response.json({ error: "Failed to fetch sponsor applications" }, { status: 500 });
  }
}
