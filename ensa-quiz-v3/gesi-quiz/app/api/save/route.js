export async function POST(req) {
  try {
    const body = await req.json();
    const url  = process.env.GOOGLE_SCRIPT_URL;
    if (!url) return Response.json({ success: true, skipped: true });

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp : new Date().toISOString(),
        firstName : body.firstName,
        lastName  : body.lastName,
        language  : body.lang,
        branch    : body.branch,
        profile   : body.profile,
        answers   : JSON.stringify(body.history),
        rating    : body.rating,
        comment   : body.comment || "",
      }),
    });
    return Response.json({ success: true });
  } catch (err) {
    console.error("Save error:", err);
    return Response.json({ error: "Save failed" }, { status: 500 });
  }
}
