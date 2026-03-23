import { auth } from "@/auth";
import { extractGroqJson, requestGroqCompletion } from "@/lib/groq";

type SupportedLocale = "fr" | "en" | "ar";
type ScenarioLevelKey = "expert" | "advanced" | "intermediate" | "beginner";

type Scenario = {
  id: number;
  title: string;
  domain: string;
  situation: string;
  challenge: string;
};

interface ScenarioPayload {
  locale?: unknown;
  scenario?: unknown;
  answer?: unknown;
}

interface ScenarioResult {
  score: number;
  levelKey: ScenarioLevelKey;
  analysis: string;
  goodPoints: string[];
  gaps: string[];
  modelAnswer: string;
  encouragement: string;
}

const SCENARIOS: Record<SupportedLocale, Scenario[]> = {
  fr: [
    {
      id: 1,
      title: "Usine textile en panne",
      domain: "Industrie 4.0",
      situation:
        "Une usine textile a Fes perd 30 % de sa production a cause de pannes non anticipees. Les interventions sont toujours curatives et le budget de modernisation reste limite.",
      challenge:
        "Propose un plan realiste de maintenance predictive avec un budget initial de 50 000 MAD."
    },
    {
      id: 2,
      title: "Appartement intelligent accessible",
      domain: "Habitat intelligent",
      situation:
        "Un promoteur veut integrer des fonctions smart home a des logements destines a des familles marocaines a revenu moyen sans exploser le prix final.",
      challenge:
        "Concois une offre domotique cohérente, simple a installer et inferieure a 15 000 MAD par appartement."
    },
    {
      id: 3,
      title: "Embouteillages au centre-ville",
      domain: "Mobilite",
      situation:
        "Le centre-ville connait des bouchons chroniques aux heures de pointe. Une grande partie des conducteurs perd du temps a chercher une place de stationnement.",
      challenge:
        "Imagine une solution numerique qui reduit la congestion et ameliore le stationnement en moins de 6 mois."
    },
    {
      id: 4,
      title: "Ferme tomate sous stress hydrique",
      domain: "Agriculture intelligente",
      situation:
        "Une exploitation de tomates perd une partie importante de sa recolte a cause d'un arrosage mal pilote et d'une detection tardive des maladies.",
      challenge:
        "Propose une architecture IoT simple pour optimiser l'irrigation et surveiller l'etat sanitaire des cultures."
    }
  ],
  en: [
    {
      id: 1,
      title: "Textile plant under repeated downtime",
      domain: "Industry 4.0",
      situation:
        "A textile factory in Fes loses 30% of its production because machine failures are only handled after breakdowns. The modernization budget is limited.",
      challenge:
        "Design a realistic predictive-maintenance rollout with an initial budget of 50,000 MAD."
    },
    {
      id: 2,
      title: "Affordable smart apartment",
      domain: "Smart habitat",
      situation:
        "A real-estate developer wants to add smart-home features to apartments aimed at middle-income Moroccan families without pricing them out of reach.",
      challenge:
        "Create a coherent home-automation package that stays below 15,000 MAD per apartment and remains easy to install."
    },
    {
      id: 3,
      title: "City-center congestion",
      domain: "Mobility",
      situation:
        "Downtown traffic jams peak every morning and evening. Many drivers spend long periods looking for parking and the current traffic lights are fixed.",
      challenge:
        "Imagine a digital solution that cuts congestion and improves parking behavior within six months."
    },
    {
      id: 4,
      title: "Tomato farm under water stress",
      domain: "Smart agriculture",
      situation:
        "A tomato farm loses part of its harvest because irrigation is poorly tuned and plant diseases are detected too late.",
      challenge:
        "Propose a simple IoT architecture to optimize irrigation and monitor crop health."
    }
  ],
  ar: [
    {
      id: 1,
      title: "توقفات متكررة في مصنع نسيج",
      domain: "الصناعة 4.0",
      situation:
        "مصنع نسيج في فاس يفقد 30٪ من الإنتاج بسبب أعطال لا يتم التعامل معها إلا بعد وقوعها، مع ميزانية تحديث محدودة.",
      challenge:
        "اقترح خطة واقعية لإطلاق الصيانة التنبؤية بميزانية أولية قدرها 50 ألف درهم."
    },
    {
      id: 2,
      title: "شقة ذكية بتكلفة معقولة",
      domain: "السكن الذكي",
      situation:
        "منعش عقاري يريد إضافة خصائص smart home إلى شقق موجهة لأسر مغربية متوسطة الدخل دون رفع السعر بشكل كبير.",
      challenge:
        "صمم عرضا متكاملا للدوموتيك لا يتجاوز 15 ألف درهم لكل شقة ويظل سهل التركيب."
    },
    {
      id: 3,
      title: "ازدحام وسط المدينة",
      domain: "التنقل",
      situation:
        "وسط المدينة يعرف اختناقات قوية في ساعات الذروة، وعدد كبير من السائقين يضيع وقتا طويلا في البحث عن مكان للركن.",
      challenge:
        "تخيل حلا رقميا يقلص الازدحام ويحسن الركن في أقل من ستة أشهر."
    },
    {
      id: 4,
      title: "مزرعة طماطم تحت ضغط مائي",
      domain: "الفلاحة الذكية",
      situation:
        "مزرعة طماطم تخسر جزءا مهما من المحصول بسبب سقي غير مضبوط واكتشاف متأخر للأمراض.",
      challenge:
        "اقترح بنية IoT بسيطة لتحسين السقي ومراقبة الحالة الصحية للمزروعات."
    }
  ]
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLocale(value: unknown): SupportedLocale {
  return value === "en" || value === "ar" ? value : "fr";
}

function normalizeList(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(text).filter(Boolean).slice(0, limit);
}

function normalizeLevelKey(value: unknown): ScenarioLevelKey {
  return value === "expert" || value === "advanced" || value === "intermediate" || value === "beginner"
    ? value
    : "intermediate";
}

function normalizeResult(value: unknown): ScenarioResult {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid scenario payload");
  }

  const payload = value as Record<string, unknown>;
  const analysis = text(payload.analysis);
  const goodPoints = normalizeList(payload.goodPoints, 3);
  const gaps = normalizeList(payload.gaps, 3);
  const modelAnswer = text(payload.modelAnswer);
  const encouragement = text(payload.encouragement);

  if (!analysis || goodPoints.length === 0 || gaps.length === 0 || !modelAnswer || !encouragement) {
    throw new Error("Incomplete scenario payload");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(Number(payload.score) || 0))),
    levelKey: normalizeLevelKey(payload.levelKey),
    analysis,
    goodPoints,
    gaps,
    modelAnswer,
    encouragement
  };
}

function buildPrompt(locale: SupportedLocale, scenario: Scenario, answer: string) {
  if (locale === "en") {
    return `You are an industrial innovation evaluator for Innov'Industry 2026 at ENSA Fes.

Scenario title: ${scenario.title}
Domain: ${scenario.domain}
Situation: ${scenario.situation}
Challenge: ${scenario.challenge}

Candidate answer:
${answer}

Return valid JSON only:
{
  "score": 0-100 integer,
  "levelKey": "expert" | "advanced" | "intermediate" | "beginner",
  "analysis": "3-4 sentences in English",
  "goodPoints": ["item 1", "item 2", "item 3"],
  "gaps": ["item 1", "item 2", "item 3"],
  "modelAnswer": "3-4 sentences describing a stronger answer",
  "encouragement": "one encouraging line"
}`;
  }

  if (locale === "ar") {
    return `أنت مقيم في الابتكار والهندسة الصناعية ضمن فعالية Innov'Industry 2026 في ENSA Fes.

عنوان السيناريو: ${scenario.title}
المجال: ${scenario.domain}
الوضعية: ${scenario.situation}
التحدي: ${scenario.challenge}

إجابة المترشح:
${answer}

أرجع JSON صالحا فقط:
{
  "score": عدد صحيح من 0 إلى 100,
  "levelKey": "expert" | "advanced" | "intermediate" | "beginner",
  "analysis": "تحليل من 3 إلى 4 جمل بالعربية",
  "goodPoints": ["عنصر 1", "عنصر 2", "عنصر 3"],
  "gaps": ["عنصر 1", "عنصر 2", "عنصر 3"],
  "modelAnswer": "3 إلى 4 جمل تصف إجابة أقوى",
  "encouragement": "جملة تشجيعية قصيرة"
}`;
  }

  return `Tu es evaluateur en innovation et ingenierie industrielle pour Innov'Industry 2026 a l'ENSA Fes.

Titre du scenario : ${scenario.title}
Domaine : ${scenario.domain}
Situation : ${scenario.situation}
Defi : ${scenario.challenge}

Reponse du candidat :
${answer}

Retourne uniquement un JSON valide :
{
  "score": entier de 0 a 100,
  "levelKey": "expert" | "advanced" | "intermediate" | "beginner",
  "analysis": "analyse en 3-4 phrases en francais",
  "goodPoints": ["point 1", "point 2", "point 3"],
  "gaps": ["lacune 1", "lacune 2", "lacune 3"],
  "modelAnswer": "3-4 phrases de reponse ideale",
  "encouragement": "une phrase d'encouragement"
}`;
}

function fallbackResult(locale: SupportedLocale, answer: string): ScenarioResult {
  const answerLength = answer.length;
  const score = Math.max(38, Math.min(92, Math.round(answerLength / 7)));
  const levelKey: ScenarioLevelKey =
    score >= 82 ? "expert" : score >= 66 ? "advanced" : score >= 48 ? "intermediate" : "beginner";

  if (locale === "en") {
    return {
      score,
      levelKey,
      analysis: "Your answer points in a relevant direction, but it needs clearer prioritization, realistic deployment steps, and measurable impact.",
      goodPoints: ["Problem awareness is visible", "A solution path is emerging", "There is useful engineering intent"],
      gaps: ["Execution plan stays too broad", "Metrics are not explicit enough", "Constraints need more detail"],
      modelAnswer: "A stronger answer would define the diagnosis, the technical stack, the rollout plan, the budget assumptions, and the KPI impact to track.",
      encouragement: "Keep the idea, but anchor it with realistic decisions and measurable proof."
    };
  }

  if (locale === "ar") {
    return {
      score,
      levelKey,
      analysis: "الإجابة تتجه في مسار مناسب، لكنها تحتاج إلى أولويات أوضح وخطوات تنفيذ واقعية وأثر قابل للقياس.",
      goodPoints: ["فهم المشكلة حاضر", "يوجد مسار حل أولي", "النية الهندسية واضحة"],
      gaps: ["خطة التنفيذ عامة جدا", "المؤشرات غير واضحة بما يكفي", "القيود العملية تحتاج تفصيلا أكبر"],
      modelAnswer: "الإجابة الأقوى تحدد التشخيص ثم البنية التقنية وخطة الإطلاق والفرضيات المالية ومؤشرات الأداء المنتظرة.",
      encouragement: "الفكرة جيدة، والمرحلة التالية هي تحويلها إلى قرارات عملية قابلة للقياس."
    };
  }

  return {
    score,
    levelKey,
    analysis: "La reponse va dans une direction pertinente, mais elle doit encore mieux prioriser les actions, clarifier le deploiement et chiffrer l'impact.",
    goodPoints: ["Compréhension du probleme visible", "Piste de solution identifiable", "Intention d'ingenierie concrete"],
    gaps: ["Plan d'execution trop large", "Indicateurs pas assez precis", "Contraintes encore peu detaillees"],
    modelAnswer: "Une meilleure reponse definirait le diagnostic, la pile technique, le plan de deploiement, les hypothèses budgetaires et les KPI a suivre.",
    encouragement: "L'idee est bonne. Il faut maintenant la transformer en plan d'action mesurable."
  };
}

export async function GET(request: Request) {
  const locale = resolveLocale(new URL(request.url).searchParams.get("locale"));
  const scenarios = SCENARIOS[locale];
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  return Response.json({ scenario });
}

export async function POST(request: Request) {
  const session = await auth().catch(() => null);
  if (!session?.user?.email) {
    return Response.json({ error: { code: "unauthorized", message: "Authentication required" } }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as ScenarioPayload;
    const locale = resolveLocale(payload.locale);
    const answer = text(payload.answer);
    const rawScenario =
      payload.scenario && typeof payload.scenario === "object" ? (payload.scenario as Record<string, unknown>) : null;

    const scenario: Scenario | null = rawScenario
      ? {
          id: Number(rawScenario.id) || 0,
          title: text(rawScenario.title),
          domain: text(rawScenario.domain),
          situation: text(rawScenario.situation),
          challenge: text(rawScenario.challenge)
        }
      : null;

    if (!scenario?.title || !scenario.domain || !scenario.situation || !scenario.challenge) {
      return Response.json(
        {
          error: { code: "invalid_scenario", message: "Scenario payload is incomplete" }
        },
        { status: 400 }
      );
    }

    if (answer.length < 50) {
      return Response.json(
        {
          error: { code: "invalid_answer", message: "Answer must be at least 50 characters long" }
        },
        { status: 400 }
      );
    }

    try {
      const raw = await requestGroqCompletion(
        [{ role: "user", content: buildPrompt(locale, scenario, answer) }],
        { temperature: 0.58, maxTokens: 850 }
      );

      return Response.json(normalizeResult(extractGroqJson(raw)));
    } catch {
      return Response.json(fallbackResult(locale, answer));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not evaluate scenario";
    return Response.json({ error: { code: "scenario_failed", message } }, { status: 500 });
  }
}
