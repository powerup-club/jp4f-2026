import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const SCENARIOS = [
  { id:1, title:"Usine en panne", domain:"Industrie 4.0", situation:"Une usine textile à Fès perd 30% de sa production à cause de pannes machines répétées non anticipées. Les techniciens interviennent toujours après la panne. Le directeur veut moderniser l'usine avec un budget limité.", challenge:"Comment introduire la maintenance prédictive dans cette usine avec un budget de 50 000 MAD ?" },
  { id:2, title:"Logement intelligent à faible coût", domain:"Habitat intelligent", situation:"Un promoteur immobilier à Casablanca veut vendre des appartements 'smart' à des familles marocaines à revenu moyen. Les solutions domotiques actuelles sont trop chères (500 000 MAD+).", challenge:"Propose une solution de maison connectée complète pour moins de 15 000 MAD par appartement." },
  { id:3, title:"Énergie solaire rurale", domain:"Énergie", situation:"Un village de 200 familles dans la région de Meknès n'a pas accès au réseau électrique. Il y a 320 jours de soleil par an mais pas d'ingénieurs sur place pour maintenir l'infrastructure.", challenge:"Conçois un système d'énergie solaire autonome et auto-maintenu pour ce village." },
  { id:4, title:"Embouteillages à Fès", domain:"Mobilité", situation:"Le centre-ville de Fès a des embouteillages critiques de 7h à 10h et de 17h à 20h. 40% des conducteurs cherchent du parking pendant en moyenne 18 minutes. Les feux de signalisation sont fixes et non adaptatifs.", challenge:"Propose une solution digitale pour réduire les embouteillages de 40% en 6 mois." },
  { id:5, title:"Agriculture connectée", domain:"Agriculture intelligente", situation:"Un agriculteur de la région du Gharb cultive 50 hectares de tomates. Il perd 20% de sa récolte chaque année à cause d'un arrosage mal optimisé et de maladies détectées trop tard.", challenge:"Conçois un système IoT d'agriculture intelligente pour maximiser son rendement." },
];

export async function GET() {
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  return NextResponse.json({ scenario });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { scenario, answer } = await req.json();

  const prompt = `Tu es un expert en innovation et ingénierie industrielle qui évalue les réponses de candidats au JESI 2026, ENSA Fès.

SCÉNARIO PRÉSENTÉ :
Titre : ${scenario.title}
Domaine : ${scenario.domain}
Situation : ${scenario.situation}
Challenge : ${scenario.challenge}

RÉPONSE DU CANDIDAT :
${answer}

Évalue cette réponse comme un expert et réponds en JSON :
{
  "score": (0-100),
  "level": ("Expert 🏆" | "Avancé ⭐" | "Intermédiaire 📈" | "Débutant 🌱"),
  "analysis": "analyse détaillée en 3-4 phrases",
  "goodPoints": ["point positif 1", "point positif 2"],
  "gaps": ["lacune 1", "lacune 2"],
  "modelAnswer": "éléments clés d'une réponse idéale en 3-4 phrases",
  "encouragement": "message d'encouragement personnalisé"
}
Réponds UNIQUEMENT en JSON valide.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.GROQ_API_KEY}`},
    body: JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[{role:"user",content:prompt}], max_tokens:800 }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  try {
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g,"").trim()));
  } catch {
    return NextResponse.json({ score:60, level:"Intermédiaire 📈", analysis:"Bonne réponse.", goodPoints:["Bonne initiative"], gaps:["Plus de détails"], modelAnswer:"Une solution complète inclurait...", encouragement:"Continue comme ça!" });
  }
}
