import { auth } from "@/auth";
import { extractGroqJson, requestGroqCompletion } from "@/lib/groq";

type SupportedLocale = "fr" | "en" | "ar";
type EvaluationVerdictKey = "excellent" | "strong" | "solid" | "improve" | "rework";

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
  const summary = text(payload.summary);
  const strengths = normalizeList(payload.strengths);
  const improvements = normalizeList(payload.improvements);
  const juryTip = text(payload.juryTip);

  if (!summary || strengths.length === 0 || improvements.length === 0 || !juryTip) {
    throw new Error("Incomplete evaluation payload");
  }

  return {
    globalScore,
    verdictKey: normalizeVerdictKey(payload.verdictKey),
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
    return `You are a pre-jury coach for the JP4F 2026 Innov'Dom challenge at ENSA Fes.

Project title: ${projTitle}
Project domain: ${projDomain}
Project description: ${projDesc}
Claimed innovation: ${innovation}

Applicant self-scores out of 5:
- innovation: ${scores.innovation}
- feasibility: ${scores.feasibility}
- impact: ${scores.impact}
- presentation: ${scores.presentation}
- technical depth: ${scores.technical}

Return valid JSON only:
{
  "globalScore": 0-100 integer,
  "verdictKey": "excellent" | "strong" | "solid" | "improve" | "rework",
  "summary": "2-3 sentences in English",
  "strengths": ["item 1", "item 2", "item 3"],
  "improvements": ["item 1", "item 2", "item 3"],
  "juryTip": "one sharp final tip"
}`;
  }

  if (locale === "ar") {
    return `أنت مدرب قبل لجنة التحكيم لمسابقة Innov'Dom ضمن JP4F 2026 في ENSA Fes.

عنوان المشروع: ${projTitle}
مجال المشروع: ${projDomain}
وصف المشروع: ${projDesc}
عنصر الابتكار المعلن: ${innovation}

التقييم الذاتي للمترشح من 5:
- الابتكار: ${scores.innovation}
- القابلية التقنية: ${scores.feasibility}
- الأثر: ${scores.impact}
- جودة العرض: ${scores.presentation}
- العمق التقني: ${scores.technical}

أرجع JSON صالحا فقط بالشكل التالي:
{
  "globalScore": عدد صحيح من 0 إلى 100,
  "verdictKey": "excellent" | "strong" | "solid" | "improve" | "rework",
  "summary": "ملخص من 2 إلى 3 جمل بالعربية",
  "strengths": ["عنصر 1", "عنصر 2", "عنصر 3"],
  "improvements": ["عنصر 1", "عنصر 2", "عنصر 3"],
  "juryTip": "نصيحة ختامية قصيرة"
}`;
  }

  return `Tu es un coach pre-jury pour le challenge Innov'Dom de JP4F 2026 a l'ENSA Fes.

Titre du projet : ${projTitle}
Domaine du projet : ${projDomain}
Description du projet : ${projDesc}
Promesse d'innovation : ${innovation}

Auto-evaluation du candidat sur 5 :
- innovation : ${scores.innovation}
- faisabilite : ${scores.feasibility}
- impact : ${scores.impact}
- presentation : ${scores.presentation}
- profondeur technique : ${scores.technical}

Retourne uniquement un JSON valide :
{
  "globalScore": entier de 0 a 100,
  "verdictKey": "excellent" | "strong" | "solid" | "improve" | "rework",
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
      summary: "المشروع يتوفر على أساس جيد. لكن العرض النهائي يحتاج إلى مزيد من الوضوح وإثبات تقني وأثر قابل للقياس.",
      strengths: ["فكرة واضحة نسبيا", "نية ابتكارية ظاهرة", "أساس جيد لعرض أمام اللجنة"],
      improvements: ["قدم أثرا رقميا قابلا للقياس", "وضح مراحل الإنجاز بواقعية", "ادعم الحل بتفاصيل تقنية أقوى"],
      juryTip: "ركز على حالة استعمال واحدة قوية ومدعومة بدل وعود كثيرة وغير مثبتة."
    };
  }

  return {
    globalScore,
    verdictKey,
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

    try {
      const raw = await requestGroqCompletion(
        [{ role: "user", content: buildPrompt(locale, payload, scores) }],
        { temperature: 0.55, maxTokens: 750 }
      );

      return Response.json(normalizeResult(extractGroqJson(raw)));
    } catch {
      return Response.json(fallbackResult(locale, scores));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not evaluate project";
    return Response.json({ error: { code: "evaluation_failed", message } }, { status: 500 });
  }
}
