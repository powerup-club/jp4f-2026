import { neon } from "@neondatabase/serverless";
import { getApplicantDatabaseUrl } from "@/applicant/config";

type SponsorApplicationPayload = {
  companyName?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  tier?: unknown;
  preferredDate?: unknown;
  preferredTime?: unknown;
  message?: unknown;
  consent?: unknown;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SponsorApplicationPayload;
    const companyName = text(payload.companyName);
    const contactName = text(payload.contactName);
    const email = text(payload.email).toLowerCase();
    const phone = text(payload.phone);
    const tier = text(payload.tier);
    const preferredDate = text(payload.preferredDate);
    const preferredTime = text(payload.preferredTime);
    const message = text(payload.message);
    const consent = Boolean(payload.consent);

    if (!companyName || !contactName || !email || !tier) {
      return Response.json(
        { success: false, error: "Required fields are missing." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { success: false, error: "Invalid email." },
        { status: 400 }
      );
    }

    if (!consent) {
      return Response.json(
        { success: false, error: "Consent is required." },
        { status: 400 }
      );
    }

    const databaseUrl = getApplicantDatabaseUrl();
    if (!databaseUrl) {
      return Response.json(
        { success: false, error: "Database not configured." },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    await sql`
      CREATE TABLE IF NOT EXISTS sponsor_applications (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        tier VARCHAR(50) NOT NULL,
        preferred_date DATE,
        preferred_time TIME,
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO sponsor_applications (
        company_name,
        contact_name,
        email,
        phone,
        tier,
        preferred_date,
        preferred_time,
        message
      )
      VALUES (
        ${companyName},
        ${contactName},
        ${email},
        ${phone || null},
        ${tier},
        ${preferredDate || null},
        ${preferredTime || null},
        ${message || null}
      )
    `;

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_SPONSORS?.trim();
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            companyName,
            contactName,
            email,
            phone,
            tier,
            preferredDate: preferredDate || null,
            preferredTime: preferredTime || null,
            message
          })
        });
      } catch (error) {
        console.warn("Sponsors sheet sync failed:", error);
      }
    } else {
      console.warn("GOOGLE_SCRIPT_URL_SPONSORS is not configured.");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Sponsor application failed:", error);
    return Response.json(
      { success: false, error: "Unable to submit application." },
      { status: 500 }
    );
  }
}
