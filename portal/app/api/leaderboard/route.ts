import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

export async function GET() {
  await initDB();
  const rows = await sql`SELECT user_name,user_image,score,total,percentage,created_at FROM quiz_leaderboard ORDER BY percentage DESC, created_at ASC LIMIT 20`;
  return NextResponse.json({ leaderboard: rows });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  await initDB();
  const { score, total } = await req.json();
  const percentage = Math.round((score / total) * 100);
  await sql`INSERT INTO quiz_leaderboard (user_email,user_name,user_image,score,total,percentage) VALUES (${session.user.email},${session.user.name||"Anonyme"},${session.user.image||""},${score},${total},${percentage}) ON CONFLICT DO NOTHING`;
  return NextResponse.json({ success:true, percentage });
}
