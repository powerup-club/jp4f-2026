import { auth } from "@/auth";
import { extractGroqJson, requestGroqCompletion } from "@/lib/groq";
import { getApplicantWorkspace, saveApplicantProjectEvaluation } from "@/applicant/data";

type SupportedLocale = "fr" | "en" | "ar";
type EvaluationVerdictKey = "excellent" | "strong" | "solid" | "improve" | "rework";
type AiUsageLabel = "yes" | "partial" | "no";

interface EvaluatePayload {
  locale?: unknown;
  scores?: unknown;
  projTitle?: unknown;
  projDesc?: unknown;
  projDomain?: unknown;
  innovation?: unknown;
}

interface EvaluationResult {
  globalScore: number;
  verdictKey: EvaluationVerdictKey;
  aiTextLikelihood: number;
  aiTextSummary: string;
  projectAiUsage: AiUsageLabel;
  projectAiSummary: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  juryTip: string;
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

function resolveScores(value: unknown) {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    innovation: normalizeScore(raw.innovation),
    feasibility: normalizeScore(raw.feasibility),
    impact: normalizeScore(raw.impact),
    presentation: normalizeScore(raw.presentation),
    technical: normalizeScore(raw.technical)
  };
}

function normalizeVerdictKey(value: unknown): EvaluationVerdictKey {
  return value === "excellent" ||
    value === "strong" ||
    value === "solid" ||
    value === "improve" ||
    value === "rework"
    ? value
    : "solid";
}

function normalizeAiUsage(value: unknown): AiUsageLabel {
  return value === "yes" || value === "partial" || value === "no" ? value : "no";
}

function normalizeAiLikelihood(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(text).filter(Boolean).slice(0, 3);
}

function normalizeResult(value: unknown): EvaluationResult {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid evaluation payload");
  }

  const payload = value as Record<string, unknown>;
  const globalScore = Math.max(0, Math.min(100, Math.round(Number(payload.globalScore) || 0)));
  const aiTextLikelihood = normalizeAiLikelihood(payload.aiTextLikelihood);
  const aiTextSummary = text(payload.aiTextSummary);
  const projectAiUsage = normalizeAiUsage(payload.projectAiUsage);
  const projectAiSummary = text(payload.projectAiSummary);
  const summary = text(payload.summary);
  const strengths = normalizeList(payload.strengths);
  const improvements = normalizeList(payload.improvements);
  const juryTip = text(payload.juryTip);

  if (!summary || strengths.length === 0 || improvements.length === 0 || !juryTip || !aiTextSummary || !projectAiSummary) {
    throw new Error("Incomplete evaluation payload");
  }

  return {
    globalScore,
    verdictKey: normalizeVerdictKey(payload.verdictKey),
    aiTextLikelihood,
    aiTextSummary,
    projectAiUsage,
    projectAiSummary,
    summary,
    strengths,
    improvements,
    juryTip
  };
}

function buildPrompt(locale: SupportedLocale, payload: EvaluatePayload, scores: ReturnType<typeof resolveScores>) {
  const projTitle = text(payload.projTitle);
  const projDesc = text(payload.projDesc);
  const projDomain = text(payload.projDomain);
  const innovation = text(payload.innovation);

  if (locale === "en") {
    return `You are a pre-jury coach for the Innov'Industry 2026 Innov'Dom challenge at ENSA Fes.

Project title: ${projTitle}
Project domain: ${projDomain}
Project description: ${projDesc}
Claimed innovation: ${innovation}

AI scores out of 5:
- innovation: ${scores.innovation}
- feasibility: ${scores.feasibility}
- impact: ${scores.impact}
- presentation: ${scores.presentation}
- technical depth: ${scores.technical}

Return valid JSON only:
{
  "globalScore": 0-100 integer,
  "verdictKey": "excellent" | "strong" | "solid" | "improve" | "rework",
  "aiTextLikelihood": 0-100 integer (likelihood the description is AI-generated),
  "aiTextSummary": "short explanation in English",
  "projectAiUsage": "yes" | "partial" | "no" (does the project itself use AI?),
  "projectAiSummary": "short explanation in English",
  "summary": "2-3 sentences in English",
  "strengths": ["item 1", "item 2", "item 3"],
  "improvements": ["item 1", "item 2", "item 3"],
  "juryTip": "one sharp final tip"
}`;
  }
  if (locale === "ar") {
    return `أنت مدرب ما قبل التحكيم لتحدي Innov'Dom ضمن Innov'Industry 2026 في ENSA فاس.

عنوان المشروع: ${projTitle}
مجال المشروع: ${projDomain}
وصف المشروع: ${projDesc}
وعد الابتكار: ${innovation}

درجات الذكاء الاصطناعي من 5:
- الابتكار: ${scores.innovation}
- الجدوى: ${scores.feasibility}
- الأثر: ${scores.impact}
- العرض: ${scores.presentation}
- العمق التقني: ${scores.technical}

أعد JSON صالحًا فقط:
{
  "globalScore": عدد صحيح بين 0 و 100,
  "verdictKey": "excellent" | "strong" | "solid" | "improve" | "rework",
  "aiTextLikelihood": عدد صحيح بين 0 و 100 (احتمال أن الوصف مولد بالذكاء الاصطناعي),
  "aiTextSummary": "تفسير قصير بالعربية",
  "projectAiUsage": "yes" | "partial" | "no" (هل يستخدم المشروع الذكاء الاصطناعي؟),
  "projectAiSummary": "تفسير قصير بالعربية",
  "summary": "خلاصة من 2 إلى 3 جمل بالعربية",
  "strengths": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "improvements": ["تحسين 1", "تحسين 2", "تحسين 3"],
  "juryTip": "نصيحة ختامية قوية"
}`;
  }

  return `Tu es un coach pre-jury pour le challenge Innov'Dom de Innov'Industry 2026 a l'ENSA Fes.

Titre du projet : ${projTitle}
Domaine du projet : ${projDomain}
Description du projet : ${projDesc}
Promesse d'innovation : ${innovation}

Scores IA sur 5 :
- innovation : ${scores.innovation}
- faisabilite : ${scores.feasibility}
- impact : ${scores.impact}
- presentation : ${scores.presentation}
- profondeur technique : ${scores.technical}

Retourne uniquement un JSON valide :
{
  "globalScore": entier de 0 a 100,
  "verdictKey": "excellent" | "strong" | "solid" | "improve" | "rework",
  "aiTextLikelihood": entier de 0 a 100 (probabilite que le texte soit genere par IA),
  "aiTextSummary": "explication courte en francais",
  "projectAiUsage": "yes" | "partial" | "no" (le projet utilise-t-il l'IA ?),
  "projectAiSummary": "explication courte en francais",
  "summary": "resume en 2-3 phrases en francais",
  "strengths": ["point 1", "point 2", "point 3"],
  "improvements": ["point 1", "point 2", "point 3"],
  "juryTip": "un conseil final percutant"
}`;
}

function fallbackResult(locale: SupportedLocale, scores: ReturnType<typeof resolveScores>): EvaluationResult {
  const average =
    (scores.innovation + scores.feasibility + scores.impact + scores.presentation + scores.technical) / 5;
  const globalScore = Math.round(average * 20);
  const verdictKey: EvaluationVerdictKey =
    globalScore >= 85 ? "excellent" : globalScore >= 72 ? "strong" : globalScore >= 58 ? "solid" : globalScore >= 42 ? "improve" : "rework";

  if (locale === "en") {
    return {
      globalScore,
      verdictKey,
      aiTextLikelihood: 35,
      aiTextSummary: "No reliable signal available; this is a cautious estimate.",
      projectAiUsage: "partial",
      projectAiSummary: "AI usage is plausible but not clearly specified in the description.",
      summary: "Your project has a credible base. Keep sharpening the technical proof, the user value, and the clarity of the final pitch.",
      strengths: ["Clear challenge framing", "Visible innovation intent", "Good foundation for a jury pitch"],
      improvements: ["Add measurable impact", "Make execution steps more concrete", "Strengthen technical detail"],
      juryTip: "Show one strong use case with evidence, not many weak promises."
    };
  }
  if (locale === "ar") {
    return {
      globalScore,
      verdictKey,
      aiTextLikelihood: 35,
      aiTextSummary: "لا توجد إشارة موثوقة كافية؛ هذا تقدير حذر.",
      projectAiUsage: "partial",
      projectAiSummary: "استخدام الذكاء الاصطناعي محتمل لكنه غير موضح بوضوح في الوصف.",
      summary: "مشروعك لديه أساس مقنع. ركّز على تدعيم الدليل التقني، والأثر القابل للقياس، ووضوح العرض النهائي.",
      strengths: ["تحديد واضح للمشكلة", "نية ابتكار واضحة", "قاعدة جيدة لإقناع لجنة التحكيم"],
      improvements: ["قم بقياس الأثر المتوقع بالأرقام", "اجعل خطوات التنفيذ أكثر تحديدًا", "عزّز العمق التقني"],
      juryTip: "قدّم حالة استخدام واحدة قوية بالأدلة أفضل من عدة وعود عامة."
    };
  }

  return {
    globalScore,
    verdictKey,
    aiTextLikelihood: 35,
    aiTextSummary: "Aucun signal fiable; estimation prudente.",
    projectAiUsage: "partial",
    projectAiSummary: "L'usage de l'IA est plausible mais pas clairement mentionne.",
    summary: "Le projet a une base credible. Il faut maintenant renforcer la preuve technique, l'impact mesurable et la clarte du pitch final.",
    strengths: ["Probleme bien identifie", "Intention d'innovation visible", "Base solide pour convaincre un jury"],
    improvements: ["Quantifier l'impact attendu", "Rendre l'execution plus concrete", "Renforcer la profondeur technique"],
    juryTip: "Mieux vaut un cas d'usage tres solide que plusieurs promesses floues."
  };
}

export async function POST(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as EvaluatePayload;
    const locale = resolveLocale(payload.locale);
    const projTitle = text(payload.projTitle);
    const projDesc = text(payload.projDesc);
    const projDomain = text(payload.projDomain);
    const scores = resolveScores(payload.scores);

    if (!projTitle || !projDesc || !projDomain) {
      return Response.json(
        {
          error: { code: "missing_project", message: "Project title, domain, and description are required" }
        },
        { status: 400 }
      );
    }

    let result: EvaluationResult;

    try {
      const raw = await requestGroqCompletion(
        [{ role: "user", content: buildPrompt(locale, payload, scores) }],
        { temperature: 0.55, maxTokens: 750 }
      );

      result = normalizeResult(extractGroqJson(raw));
    } catch {
      result = fallbackResult(locale, scores);
    }

    // Save evaluation to database
    try {
      const workspace = await getApplicantWorkspace(session.user.email);
      if (workspace.application?.id) {
        await saveApplicantProjectEvaluation({
          applicationId: workspace.application.id,
          globalScore: result.globalScore,
          verdictKey: result.verdictKey,
          aiTextLikelihood: result.aiTextLikelihood,
          aiTextSummary: result.aiTextSummary,
          projectAiUsage: result.projectAiUsage,
          projectAiSummary: result.projectAiSummary,
          summary: result.summary,
          strengths: result.strengths,
          improvements: result.improvements,
          juryTip: result.juryTip,
          selfScores: scores
        });
      }
    } catch (dbError) {
      console.error("Failed to save evaluation to database:", dbError);
      // Continue anyway - the evaluation is still generated even if DB save fails
    }

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not evaluate project";
    return Response.json({ error: { code: "evaluation_failed", message } }, { status: 500 });
  }
}






