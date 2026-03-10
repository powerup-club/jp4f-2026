import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  await initDB();
  const { userName, userEmail, teamId, phone, message } = await req.json();
  await sql`INSERT INTO contact_messages (user_name,user_email,team_id,phone,message) VALUES (${userName},${userEmail},${teamId},${phone},${message})`;
  const url = process.env.GOOGLE_SCRIPT_URL_CONTACT;
  if (url && !url.includes("YOUR_ID")) {
    await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ timestamp:new Date().toISOString(), userName, userEmail, teamId, phone, message }) }).catch(()=>{});
  }
  return NextResponse.json({ success:true });
}
