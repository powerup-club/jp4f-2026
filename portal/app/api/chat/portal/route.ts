import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";

const SYS = `Tu es l'assistant IA officiel du JESI 2026 — Innov'Dom Challenge, ENSA Fès, Département Génie Industriel.
Tu aides les candidats avec : règles compétition, domaines innovation (habitat intelligent, énergie, mobilité, digitalisation, domotique), filières GI (GESI, Mécanique, Mécatronique, GI), conseils projet, gestion équipe, préparation présentation.
Sois chaleureux, encourageant, professionnel. Réponds en français sauf si on te parle en anglais. Réponses concises et utiles.`;

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  await initDB();
  const messages = await sql`SELECT role,content,created_at FROM applicant_messages WHERE user_email=${session.user.email} ORDER BY created_at ASC LIMIT 50`;
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  await initDB();
  const { message } = await req.json();
  await sql`INSERT INTO applicant_messages (user_email,role,content) VALUES (${session.user.email},'user',${message})`;
  const history = await sql`SELECT role,content FROM applicant_messages WHERE user_email=${session.user.email} ORDER BY created_at ASC LIMIT 20`;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.GROQ_API_KEY}`},
    body: JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[{role:"system",content:SYS},...history.map((m:any)=>({role:m.role,content:m.content}))], max_tokens:600 }),
  });
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "Désolé, réessaie.";
  await sql`INSERT INTO applicant_messages (user_email,role,content) VALUES (${session.user.email},'assistant',${reply})`;
  return NextResponse.json({ reply });
}
