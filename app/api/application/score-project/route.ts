import { extractGroqJson, requestGroqCompletion } from "@/lib/groq";

type SupportedLocale = "fr" | "en" | "ar";

interface ScorePayload {
  locale?: unknown;
  projTitle?: unknown;
  projDesc?: unknown;
  projDomain?: unknown;
  innovation?: unknown;
}

interface ProjectScores {
  innovation: number;
  feasibility: number;
  impact: number;
  presentation: number;
  technical: number;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLocale(value: unknown): SupportedLocale {
  return value === "en" || value === "ar" ? value : "fr";
}

function normalizeScore(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return 3;
  }
  return Math.max(1, Math.min(5, Math.round(parsed)));
}

function buildScoringPrompt(locale: SupportedLocale, projTitle: string, projDesc: string, projDomain: string, innovation: string): string {
  if (locale === "en") {
    return `You are an expert evaluator for the JP4F 2026 Innov'Dom challenge at ENSA Fes. Analyze this project and rate it on 5 dimensions from 1 (weak) to 5 (excellent). Use realistic scores reflecting actual strengths and weaknesses.

Project title: ${projTitle}
Project domain: ${projDomain}
Project description: ${projDesc}
Claimed innovation: ${innovation}

Rate on these 5 dimensions only (1-5 each):
- innovation: How novel and creative is this idea?
- feasibility: How realistic is it to build/implement?
- impact: How much value/change does it create?
- presentation: How clearly is the idea explained?
- technical: How strong is the technical depth?

Return ONLY valid JSON in this exact format:
{
  "innovation": 1-5,
  "feasibility": 1-5,
  "impact": 1-5,
  "presentation": 1-5,
  "technical": 1-5
}`;
  }

  if (locale === "ar") {
    return `أنت خبير تقييم لمسابقة Innov'Dom ضمن JP4F 2026 في ENSA Fes. حلل هذا المشروع وقيمه على 5 أبعاد من 1 (ضعيف) إلى 5 (ممتاز). استخدم درجات واقعية تعكس نقاط القوة والضعف الفعلية.

عنوان المشروع: ${projTitle}
مجال المشروع: ${projDomain}
وصف المشروع: ${projDesc}
عنصر الابتكار المعلن: ${innovation}

قيّم على هذه الأبعاد الخمسة فقط (1-5 لكل منها):
- innovation: ما مدى جدة وإبداعية الفكرة؟
- feasibility: ما مدى واقعية بناؤها/تنفيذها؟
- impact: ما قيمة/تغيير ينتج عنها؟
- presentation: كيف يتم شرح الفكرة بوضوح؟
- technical: ما قوة العمق التقني؟

أرجع JSON صالحاً فقط بالشكل التالي:
{
  "innovation": 1-5,
  "feasibility": 1-5,
  "impact": 1-5,
  "presentation": 1-5,
  "technical": 1-5
}`;
  }

  return `Tu es un expert évaluateur pour le challenge Innov'Dom de JP4F 2026 à l'ENSA Fes. Analyse ce projet et évalue-le sur 5 dimensions de 1 (faible) à 5 (excellent). Utilise des scores réalistes reflétant les vraies forces et faiblesses.

Titre du projet: ${projTitle}
Domaine du projet: ${projDomain}
Description du projet: ${projDesc}
Promesse d'innovation: ${innovation}

Évalue sur ces 5 dimensions uniquement (1-5 chacune):
- innovation: Quelle est la nouveauté et créativité de l'idée?
- feasibility: Quelle est la réalité de la construction/mise en œuvre?
- impact: Quelle valeur/changement crée-t-elle?
- presentation: Quelle est la clarté de l'explication?
- technical: Quelle est la profondeur technique?

Retourne UNIQUEMENT un JSON valide dans ce format exact:
{
  "innovation": 1-5,
  "feasibility": 1-5,
  "impact": 1-5,
  "presentation": 1-5,
  "technical": 1-5
}`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as ScorePayload;

    const locale = resolveLocale(body.locale);
    const projTitle = text(body.projTitle);
    const projDesc = text(body.projDesc);
    const projDomain = text(body.projDomain);
    const innovation = text(body.innovation);

    if (!projTitle || !projDesc) {
      return Response.json(
        { error: "Project title and description are required" },
        { status: 400 }
      );
    }

    const prompt = buildScoringPrompt(locale, projTitle, projDesc, projDomain, innovation);

    const response = await requestGroqCompletion([
      {
        role: "system",
        content: "You are an expert project evaluator. Respond with JSON only."
      },
      { role: "user", content: prompt }
    ]);

    const parsed = extractGroqJson(response);
    const scores: ProjectScores = {
      innovation: normalizeScore((parsed as Record<string, unknown>).innovation),
      feasibility: normalizeScore((parsed as Record<string, unknown>).feasibility),
      impact: normalizeScore((parsed as Record<string, unknown>).impact),
      presentation: normalizeScore((parsed as Record<string, unknown>).presentation),
      technical: normalizeScore((parsed as Record<string, unknown>).technical)
    };

    return Response.json(scores);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
