import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { sql, initDB, generateTeamId } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  await initDB();
  const rows = await sql`SELECT * FROM applicant_applications WHERE user_email=${session.user.email}`;
  if (rows.length === 0) {
    const teamId = generateTeamId();
    const r = await sql`INSERT INTO applicant_applications (user_email,user_name,user_image,team_id,status) VALUES (${session.user.email},${session.user.name||""},${session.user.image||""},${teamId},'draft') RETURNING *`;
    return NextResponse.json({ application: r[0] });
  }
  return NextResponse.json({ application: rows[0] });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  await initDB();
  const d = await req.json();
  const updated = await sql`UPDATE applicant_applications SET
    type=${d.type||"individual"}, full_name=${d.fullName||""}, phone=${d.phone||""},
    university=${d.university||""}, branch=${d.branch||""}, year_of_study=${d.yearOfStudy||""},
    linkedin=${d.linkedin||""}, team_name=${d.teamName||""},
    member2_name=${d.member2Name||""}, member2_email=${d.member2Email||""},
    member3_name=${d.member3Name||""}, member3_email=${d.member3Email||""},
    member4_name=${d.member4Name||""}, member4_email=${d.member4Email||""},
    proj_title=${d.projTitle||""}, proj_domain=${d.projDomain||""},
    proj_desc=${d.projDesc||""}, innovation=${d.innovation||""},
    demo_format=${d.demoFormat||""}, heard_from=${d.heardFrom||""},
    file_link=${d.fileLink||""}, status=${d.status||"draft"},
    submitted_at=${d.status==="submitted"?new Date().toISOString():null},
    updated_at=NOW()
    WHERE user_email=${session.user.email} RETURNING *`;
  if (d.status === "submitted" && process.env.GOOGLE_SCRIPT_URL_REGISTER) {
    const a = updated[0];
    await fetch(process.env.GOOGLE_SCRIPT_URL_REGISTER, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ timestamp:new Date().toISOString(), lang:"fr", type:a.type, fullName:a.full_name, email:session.user.email, phone:a.phone, university:a.university, branch:a.branch, yearOfStudy:a.year_of_study, linkedin:a.linkedin, teamName:a.team_name, member2Name:a.member2_name, member2Email:a.member2_email, member3Name:a.member3_name, member3Email:a.member3_email, member4Name:a.member4_name, member4Email:a.member4_email, projTitle:a.proj_title, projDomain:a.proj_domain, projDesc:a.proj_desc, innovation:a.innovation, demoFormat:a.demo_format, heardFrom:a.heard_from, fileLink:a.file_link }),
    }).catch(()=>{});
  }
  return NextResponse.json({ application: updated[0] });
}
