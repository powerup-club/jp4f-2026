interface RegisterPayload {
  lang?: unknown;
  type?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  university?: unknown;
  branch?: unknown;
  yearOfStudy?: unknown;
  linkedin?: unknown;
  teamName?: unknown;
  member2Name?: unknown;
  member2Email?: unknown;
  member3Name?: unknown;
  member3Email?: unknown;
  member4Name?: unknown;
  member4Email?: unknown;
  projTitle?: unknown;
  projDomain?: unknown;
  projDesc?: unknown;
  innovation?: unknown;
  demoFormat?: unknown;
  heardFrom?: unknown;
  fileBase64?: unknown;
  fileName?: unknown;
  projectTitle?: unknown;
  projectDomain?: unknown;
  projectDesc?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_REGISTER ?? process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
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
      return Response.json(data, { status: upstream.ok ? 200 : 502 });
    }

    const raw = await upstream.text().catch(() => "");
    if (!upstream.ok) {
      return Response.json({ error: "Upstream save failed", details: raw.slice(0, 220) }, { status: 502 });
    }

    return Response.json({ success: true, raw: raw.slice(0, 220) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Register failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
