import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { pitch, duration } = await req.json();

  const prompt = `Tu es un jury sévère mais bienveillant de l'Innov'Dom Challenge JESI 2026, ENSA Fès.
Un candidat vient de présenter son pitch en ${duration} secondes.

Voici le texte de son pitch :
"${pitch}"

Évalue ce pitch comme un vrai jury et réponds en JSON avec exactement :
{
  "scores": {
    "clarity": (1-10, clarté du message),
    "innovation": (1-10, innovation perçue),
    "impact": (1-10, impact et valeur),
    "confidence": (1-10, confiance et conviction),
    "structure": (1-10, structure et fluidité)
  },
  "globalScore": (moyenne sur 100),
  "verdict": ("Convaincant 🔥" | "Prometteur 👍" | "À affiner ⚡" | "À retravailler 🔧"),
  "juryComment": "commentaire du jury en 2-3 phrases, style vrai jury",
  "bestLine": "la meilleure phrase de ton pitch",
  "missingElement": "ce qui manque le plus dans ce pitch",
  "nextTip": "conseil pour la prochaine fois"
}
Réponds UNIQUEMENT en JSON valide.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.GROQ_API_KEY}`},
    body: JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[{role:"user",content:prompt}], max_tokens:700 }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  try {
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g,"").trim()));
  } catch {
    return NextResponse.json({ scores:{clarity:7,innovation:7,impact:7,confidence:7,structure:7}, globalScore:70, verdict:"Prometteur 👍", juryComment:"Bon pitch, continue!", bestLine:"", missingElement:"Plus de détails techniques", nextTip:"Sois plus précis" });
  }
}
