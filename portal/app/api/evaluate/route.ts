import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { scores, projTitle, projDesc, projDomain, innovation } = await req.json();

  const prompt = `Tu es un jury expert de l'Innov'Dom Challenge JESI 2026, ENSA Fès.
Un candidat t'a soumis son projet pour évaluation avant la présentation finale.

Projet : "${projTitle}"
Domaine : ${projDomain}
Description : ${projDesc}
Innovation / Valeur ajoutée : ${innovation}

Auto-évaluation du candidat (sur 5) :
- Innovation & Originalité : ${scores.innovation}/5
- Faisabilité Technique : ${scores.feasibility}/5
- Impact & Utilité : ${scores.impact}/5
- Qualité de Présentation : ${scores.presentation}/5
- Profondeur Technique : ${scores.technical}/5

Donne un retour structuré en JSON avec exactement ces champs :
{
  "globalScore": (nombre entier sur 100),
  "verdict": ("Excellent" | "Très bien" | "Bien" | "À améliorer" | "À retravailler"),
  "summary": "résumé global en 2-3 phrases",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "improvements": ["amélioration prioritaire 1", "amélioration prioritaire 2", "amélioration prioritaire 3"],
  "juryTip": "conseil secret du jury en 1 phrase percutante"
}
Réponds UNIQUEMENT en JSON valide, sans texte avant ou après.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.GROQ_API_KEY}`},
    body: JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[{role:"user",content:prompt}], max_tokens:800 }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  try {
    const clean = text.replace(/```json|```/g,"").trim();
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json({ globalScore:50, verdict:"Bien", summary:"Analyse disponible.", strengths:["Projet soumis"], improvements:["Remplis plus de détails"], juryTip:"Sois précis et concis." });
  }
}
