export async function POST(req) {
  try {
    const body = await req.json();
    const url  = process.env.GOOGLE_SCRIPT_URL;

    if (!url) {
      console.warn("GOOGLE_SCRIPT_URL not set — skipping save");
      return Response.json({ success: true, skipped: true });
    }

    const res = await fetch(url, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        timestamp      : new Date().toISOString(),
        lang           : body.lang,
        type           : body.type,                    // individual | team
        // Leader / individual
        fullName       : body.fullName,
        email          : body.email,
        phone          : body.phone,
        university     : body.university,
        branch         : body.branch,
        yearOfStudy    : body.yearOfStudy,
        // Team
        teamName       : body.teamName       || "",
        member2Name    : body.member2Name    || "",
        member2Email   : body.member2Email   || "",
        member3Name    : body.member3Name    || "",
        member3Email   : body.member3Email   || "",
        member4Name    : body.member4Name    || "",
        member4Email   : body.member4Email   || "",
        // Project
        projectTitle   : body.projectTitle,
        projectDomain  : body.projectDomain,
        projectDesc    : body.projectDesc,
        innovation     : body.innovation,
        demoFormat     : body.demoFormat,
        // Extra
        fileBase64     : body.fileBase64     || "",
        fileName       : body.fileName       || "",
        heardFrom      : body.heardFrom      || "",
        linkedin       : body.linkedin       || "",
      }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("Register error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
