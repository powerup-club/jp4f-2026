import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type   = searchParams.get("type") || "register";
  const secret = process.env.ADMIN_DATA_SECRET || "admin-secret";

  const scriptUrl = type === "quiz"
    ? process.env.GOOGLE_SCRIPT_URL_QUIZ
    : process.env.GOOGLE_SCRIPT_URL_REGISTER;

  try {
    const res  = await fetch(`${scriptUrl}?action=getData&secret=${encodeURIComponent(secret)}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
