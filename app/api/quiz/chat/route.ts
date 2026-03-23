import { hasGroqApiKey, requestGroqCompletion } from "@/lib/groq";

type QuizLocale = "fr" | "en" | "ar";
type QuizBranch = "GESI" | "MECA" | "MECATRONIQUE" | "GI";
type ChatRole = "user" | "assistant";

interface IncomingMessage {
  role: ChatRole;
  content: string;
}

interface QuizQuestion {
  done: false;
  question: string;
  options: string[];
}

interface QuizResult {
  done: true;
  branch: QuizBranch;
  profile: string;
  description: string;
  tagline: string;
  why: string;
}

const BRANCH_CONTEXT = `
Filiere GESI:
- Energie, durabilite, smart grids, batiments intelligents
- Modules: energie renouvelable, electronique de puissance, systemes embarques, commande, IA appliquee

Filiere MECA:
- Conception mecanique, structures, simulation numerique, fabrication
- Modules: RDM, elements finis, dynamique, materiaux, CAO/simulation

Filiere MECATRONIQUE:
- Robotique, automatisme, systemes hybrides physique-numerique
- Modules: robotique, vision, microcontroleurs, commande moderne, IA pour mecatronique

Filiere GI:
- Organisation industrielle, optimisation, logistique, qualite, industrie 4.0
- Modules: lean, supply chain, decision, performance, modelisation des flux
`;

const SYSTEM_PROMPTS: Record<QuizLocale, string> = {
  fr: `Tu es l'animateur d'un quiz d'orientation ingenieur ENSA Fes pour etudiants CP.

Contexte des filieres (ne pas citer les noms pendant les 5 questions):
${BRANCH_CONTEXT}

Objectif:
- Poser 5 questions courtes orientees personnalite/valeurs.
- A chaque question, proposer 3 options courtes (jamais des noms de filiere).
- Adapter les questions selon les reponses precedentes.
- A la fin, retourner la filiere la plus adaptee.

Format strict JSON sans markdown:
Question:
{"done":false,"question":"...","options":["...","...","..."]}

Resultat final:
{"done":true,"branch":"GESI|MECA|MECATRONIQUE|GI","profile":"2-4 mots","description":"2-3 phrases","tagline":"phrase courte","why":"1-2 phrases"}

Reponds uniquement avec un objet JSON valide.`,
  en: `You are the host of an ENSA Fes engineering orientation quiz for CP students.

Branch context (do not reveal branch names during the 5 questions):
${BRANCH_CONTEXT}

Goal:
- Ask 5 short personality/value-based questions.
- For each question provide 3 concise options (never branch names).
- Adapt each next question to previous answers.
- After the 5th answer return the most fitting branch.

Strict JSON format, no markdown:
Question:
{"done":false,"question":"...","options":["...","...","..."]}

Final result:
{"done":true,"branch":"GESI|MECA|MECATRONIQUE|GI","profile":"2-4 words","description":"2-3 sentences","tagline":"short sentence","why":"1-2 sentences"}

Respond with valid JSON only.`,
  ar: `انت مقدم اختبار توجيه هندسي لطلبة الاقسام التحضيرية بمدرسة ENSA فاس.

سياق المسالك (لا تذكر اسم المسلك خلال الاسئلة الخمسة):
${BRANCH_CONTEXT}

المطلوب:
- اطرح 5 اسئلة قصيرة تعتمد على الشخصية والقيم.
- في كل سؤال قدم 3 اختيارات قصيرة (بدون ذكر اسم المسلك).
- عدل الاسئلة حسب الاجابات السابقة.
- بعد الجواب الخامس ارجع المسلك الانسب.

صيغة JSON فقط بدون Markdown:
سؤال:
{"done":false,"question":"...","options":["...","...","..."]}

النتيجة:
{"done":true,"branch":"GESI|MECA|MECATRONIQUE|GI","profile":"2-4 كلمات","description":"2-3 جمل","tagline":"جملة قصيرة","why":"1-2 جملة"}

اكتب JSON صالح فقط.`
};

function isQuizLocale(value: unknown): value is QuizLocale {
  return value === "fr" || value === "en" || value === "ar";
}

function sanitizeMessages(value: unknown): IncomingMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is { role: unknown; content: unknown } => typeof item === "object" && item !== null)
    .map((item): IncomingMessage => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: typeof item.content === "string" ? item.content.slice(0, 1500) : ""
    }))
    .filter((item) => item.content.trim().length > 0);
}

function extractJson(raw: string): unknown {
  const clean = raw.replace(/```json|```/gi, "").trim();
  const first = clean.indexOf("{");
  const last = clean.lastIndexOf("}");

  if (first < 0 || last <= first) {
    throw new Error("No JSON object found");
  }

  return JSON.parse(clean.slice(first, last + 1));
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeResponse(value: unknown): QuizQuestion | QuizResult {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid quiz payload");
  }

  const payload = value as Record<string, unknown>;

  if (payload.done === false) {
    const question = toStringValue(payload.question);
    const optionsRaw = Array.isArray(payload.options) ? payload.options : [];
    const options = optionsRaw.map(toStringValue).filter(Boolean).slice(0, 3);

    if (!question || options.length < 2) {
      throw new Error("Invalid quiz question");
    }

    return { done: false, question, options };
  }

  if (payload.done === true) {
    const branch = toStringValue(payload.branch) as QuizBranch;
    if (!["GESI", "MECA", "MECATRONIQUE", "GI"].includes(branch)) {
      throw new Error("Invalid branch");
    }

    const profile = toStringValue(payload.profile);
    const description = toStringValue(payload.description);
    const tagline = toStringValue(payload.tagline);
    const why = toStringValue(payload.why);

    if (!profile || !description || !tagline || !why) {
      throw new Error("Incomplete quiz result");
    }

    return { done: true, branch, profile, description, tagline, why };
  }

  throw new Error("Unexpected quiz shape");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown; lang?: unknown };
    const lang: QuizLocale = isQuizLocale(body.lang) ? body.lang : "fr";
    const messages = sanitizeMessages(body.messages);

  if (messages.length === 0) {
    return Response.json({ error: "No messages provided" }, { status: 400 });
  }

  if (!hasGroqApiKey()) {
    return Response.json({ error: "AI API key is missing" }, { status: 500 });
  }

  const raw = await requestGroqCompletion(
    [{ role: "system", content: SYSTEM_PROMPTS[lang] }, ...messages],
    { temperature: 0.72, maxTokens: 700 }
  );
  const parsed = normalizeResponse(extractJson(raw));

  return Response.json(parsed);
} catch (error) {
    const message = error instanceof Error ? error.message : "AI unavailable";
    return Response.json({ error: message }, { status: 500 });
  }
}
