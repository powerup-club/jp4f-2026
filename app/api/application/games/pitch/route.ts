import { auth } from "@/auth";
import { extractGroqJson, requestGroqCompletion } from "@/lib/groq";

type SupportedLocale = "fr" | "en" | "ar";
type PitchVerdictKey = "convincing" | "promising" | "refine" | "rework";

interface PitchPayload {
  pitch?: unknown;
  duration?: unknown;
  locale?: unknown;
}

interface PitchResult {
  scores: {
    clarity: number;
    innovation: number;
    impact: number;
    confidence: number;
    structure: number;
  };
  globalScore: number;
  verdictKey: PitchVerdictKey;
  juryComment: string;
  bestLine: string;
  missingElement: string;
  nextTip: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLocale(value: unknown): SupportedLocale {
  return value === "en" || value === "ar" ? value : "fr";
}

function resolveDuration(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(180, Math.round(parsed)));
}

function clampTen(value: unknown): number {
  const parsed = Number(value) || 0;
  return Math.max(1, Math.min(10, Math.round(parsed)));
}

function normalizeVerdictKey(value: unknown): PitchVerdictKey {
  return value === "convincing" || value === "promising" || value === "refine" || value === "rework"
    ? value
    : "promising";
}

function normalizeResult(value: unknown): PitchResult {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid pitch payload");
  }

  const payload = value as Record<string, unknown>;
  const scores = payload.scores && typeof payload.scores === "object" ? (payload.scores as Record<string, unknown>) : {};

  return {
    scores: {
      clarity: clampTen(scores.clarity),
      innovation: clampTen(scores.innovation),
      impact: clampTen(scores.impact),
      confidence: clampTen(scores.confidence),
      structure: clampTen(scores.structure)
    },
    globalScore: Math.max(0, Math.min(100, Math.round(Number(payload.globalScore) || 0))),
    verdictKey: normalizeVerdictKey(payload.verdictKey),
    juryComment: text(payload.juryComment),
    bestLine: text(payload.bestLine),
    missingElement: text(payload.missingElement),
    nextTip: text(payload.nextTip)
  };
}

function buildPrompt(locale: SupportedLocale, pitch: string, duration: number) {
  if (locale === "en") {
    return `You are a demanding but fair jury for the JP4F 2026 Innov'Dom challenge at ENSA Fes.

The candidate delivered this pitch in ${duration} seconds:
${pitch}

Return valid JSON only:
{
  "scores": {
    "clarity": 1-10,
    "innovation": 1-10,
    "impact": 1-10,
    "confidence": 1-10,
    "structure": 1-10
  },
  "globalScore": 0-100 integer,
  "verdictKey": "convincing" | "promising" | "refine" | "rework",
  "juryComment": "2-3 sentences in English",
  "bestLine": "best sentence from the pitch or a short extracted quote",
  "missingElement": "the main thing still missing",
  "nextTip": "one practical next step"
}`;
  }

  if (locale === "ar") {
    return `أنت عضو لجنة صارم لكنه منصف في تحدي Innov'Dom ضمن JP4F 2026 في ENSA Fes.

قدم المترشح هذا العرض في ${duration} ثانية:
${pitch}

أرجع JSON صالحا فقط:
{
  "scores": {
    "clarity": 1-10,
    "innovation": 1-10,
    "impact": 1-10,
    "confidence": 1-10,
    "structure": 1-10
  },
  "globalScore": عدد صحيح من 0 إلى 100,
  "verdictKey": "convincing" | "promising" | "refine" | "rework",
  "juryComment": "تعليق من 2 إلى 3 جمل بالعربية",
  "bestLine": "أفضل جملة في العرض أو اقتباس قصير",
  "missingElement": "أهم عنصر ما يزال ناقصا",
  "nextTip": "خطوة عملية واحدة للمرة القادمة"
}`;
  }

  return `Tu es un membre de jury exigeant mais juste pour le challenge Innov'Dom de JP4F 2026 a l'ENSA Fes.

Le candidat a presente ce pitch en ${duration} secondes :
${pitch}

Retourne uniquement un JSON valide :
{
  "scores": {
    "clarity": 1-10,
    "innovation": 1-10,
    "impact": 1-10,
    "confidence": 1-10,
    "structure": 1-10
  },
  "globalScore": entier de 0 a 100,
  "verdictKey": "convincing" | "promising" | "refine" | "rework",
  "juryComment": "commentaire en 2-3 phrases en francais",
  "bestLine": "meilleure phrase du pitch ou citation courte",
  "missingElement": "element principal encore absent",
  "nextTip": "un prochain pas concret"
}`;
}

function fallbackResult(locale: SupportedLocale, pitch: string, duration: number): PitchResult {
  const wordCount = pitch.split(/\s+/).filter(Boolean).length;
  const compact = duration > 0 && duration <= 180 ? 1 : 0;
  const baseScore = Math.max(42, Math.min(88, Math.round((wordCount / 120) * 55 + compact * 15)));
  const verdictKey: PitchVerdictKey =
    baseScore >= 78 ? "convincing" : baseScore >= 62 ? "promising" : baseScore >= 48 ? "refine" : "rework";

  if (locale === "en") {
    return {
      scores: { clarity: 7, innovation: 7, impact: 6, confidence: 6, structure: 7 },
      globalScore: baseScore,
      verdictKey,
      juryComment: "The pitch has a useful backbone, but it still needs a sharper problem statement and stronger proof of value.",
      bestLine: pitch.split(/[.!?]/).map((item) => item.trim()).find(Boolean) || "Clear ambition is visible.",
      missingElement: "A concrete proof point showing why this solution matters now.",
      nextTip: "Open with the problem, then quantify the impact before describing the solution."
    };
  }

  if (locale === "ar") {
    return {
      scores: { clarity: 7, innovation: 7, impact: 6, confidence: 6, structure: 7 },
      globalScore: baseScore,
      verdictKey,
      juryComment: "العرض يملك أساسا جيدا، لكنه يحتاج إلى صياغة أوضح للمشكلة وإثبات أقوى لقيمة الحل.",
      bestLine: pitch.split(/[.!?؟]/).map((item) => item.trim()).find(Boolean) || "هناك طموح واضح في الفكرة.",
      missingElement: "دليل عملي أو رقم واضح يبين أهمية الحل الآن.",
      nextTip: "ابدأ بالمشكلة ثم بالأثر القابل للقياس قبل شرح الحل."
    };
  }

  return {
    scores: { clarity: 7, innovation: 7, impact: 6, confidence: 6, structure: 7 },
    globalScore: baseScore,
    verdictKey,
    juryComment: "Le pitch a une base interessante, mais il doit encore mieux cadrer le probleme et prouver la valeur de la solution.",
    bestLine: pitch.split(/[.!?]/).map((item) => item.trim()).find(Boolean) || "L'ambition du projet ressort clairement.",
    missingElement: "Une preuve concrete qui montre pourquoi la solution compte maintenant.",
    nextTip: "Commence par le probleme, puis chiffre l'impact avant de decrire la solution."
  };
}

export async function POST(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as PitchPayload;
    const pitch = text(payload.pitch);
    const duration = resolveDuration(payload.duration);
    const locale = resolveLocale(payload.locale);

    if (pitch.length < 50) {
      return Response.json(
        {
          error: { code: "invalid_pitch", message: "Pitch text must be at least 50 characters long" }
        },
        { status: 400 }
      );
    }

    try {
      const raw = await requestGroqCompletion(
        [{ role: "user", content: buildPrompt(locale, pitch, duration) }],
        { temperature: 0.6, maxTokens: 800 }
      );

      return Response.json(normalizeResult(extractGroqJson(raw)));
    } catch {
      return Response.json(fallbackResult(locale, pitch, duration));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not evaluate pitch";
    return Response.json({ error: { code: "pitch_failed", message } }, { status: 500 });
  }
}
