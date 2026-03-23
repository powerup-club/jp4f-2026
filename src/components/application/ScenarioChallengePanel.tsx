"use client";

import { useState } from "react";
import type { SiteLocale } from "@/config/locales";

type Phase = "intro" | "loading" | "answer" | "judging" | "result";
type ScenarioLevelKey = "expert" | "advanced" | "intermediate" | "beginner";

type Scenario = {
  id: number;
  title: string;
  domain: string;
  situation: string;
  challenge: string;
};

type ScenarioResult = {
  score: number;
  levelKey: ScenarioLevelKey;
  analysis: string;
  goodPoints: string[];
  gaps: string[];
  modelAnswer: string;
  encouragement: string;
};

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    start: string;
    loading: string;
    challenge: string;
    answerPlaceholder: string;
    answerHint: string;
    submit: string;
    change: string;
    judging: string;
    judgingHint: string;
    levelLabels: Record<ScenarioLevelKey, string>;
    strengths: string;
    gaps: string;
    modelAnswer: string;
    encouragement: string;
    retry: string;
  }
> = {
  fr: {
    badge: "Mini jeu",
    title: "Scenario Challenge",
    subtitle: "Resous un cas industriel crediblement, comme face a un vrai jury de projet.",
    start: "Lancer un scenario",
    loading: "Chargement du scenario...",
    challenge: "Defi",
    answerPlaceholder: "Analyse le probleme, propose une solution, precise les technologies, le budget, le deploiement et les KPI.",
    answerHint: "Minimum 50 caracteres",
    submit: "Envoyer a l'expert IA",
    change: "Autre scenario",
    judging: "L'expert IA analyse ta reponse...",
    judgingHint: "Evaluation en cours",
    levelLabels: {
      expert: "Expert",
      advanced: "Avance",
      intermediate: "Intermediaire",
      beginner: "Debutant"
    },
    strengths: "Points positifs",
    gaps: "Lacunes",
    modelAnswer: "Reponse ideale",
    encouragement: "Encouragement",
    retry: "Nouveau scenario"
  },
  en: {
    badge: "Mini game",
    title: "Scenario Challenge",
    subtitle: "Solve an industrial case as if you were facing a real project jury.",
    start: "Start scenario",
    loading: "Loading scenario...",
    challenge: "Challenge",
    answerPlaceholder: "Frame the problem, propose a solution, explain the stack, budget, rollout, and KPI logic.",
    answerHint: "Minimum 50 characters",
    submit: "Send to AI expert",
    change: "Change scenario",
    judging: "The AI expert is reviewing your answer...",
    judgingHint: "Generating evaluation",
    levelLabels: {
      expert: "Expert",
      advanced: "Advanced",
      intermediate: "Intermediate",
      beginner: "Beginner"
    },
    strengths: "Strengths",
    gaps: "Gaps",
    modelAnswer: "Model answer",
    encouragement: "Encouragement",
    retry: "New scenario"
  },
  ar: {
    badge: "لعبة مصغرة",
    title: "Scenario Challenge",
    subtitle: "حل حالة صناعية كما لو أنك أمام لجنة مشروع حقيقية.",
    start: "ابدأ السيناريو",
    loading: "جار تحميل السيناريو...",
    challenge: "التحدي",
    answerPlaceholder: "حلل المشكلة، اقترح الحل، اشرح التكنولوجيا، الميزانية، مراحل الإطلاق ومؤشرات الأداء.",
    answerHint: "الحد الأدنى 50 حرفا",
    submit: "إرسال إلى الخبير الذكي",
    change: "تغيير السيناريو",
    judging: "الخبير الذكي يحلل إجابتك...",
    judgingHint: "جار توليد التقييم",
    levelLabels: {
      expert: "خبير",
      advanced: "متقدم",
      intermediate: "متوسط",
      beginner: "مبتدئ"
    },
    strengths: "نقاط القوة",
    gaps: "الثغرات",
    modelAnswer: "إجابة أقوى",
    encouragement: "تشجيع",
    retry: "سيناريو جديد"
  }
};

export function ScenarioChallengePanel({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale];
  const [phase, setPhase] = useState<Phase>("intro");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);

  async function loadScenario() {
    setPhase("loading");

    try {
      const response = await fetch(`/api/application/games/scenario?locale=${locale}`);
      const payload = (await response.json().catch(() => null)) as { scenario?: Scenario } | null;
      setScenario(payload?.scenario ?? null);
      setAnswer("");
      setResult(null);
      setPhase("answer");
    } catch {
      setPhase("intro");
    }
  }

  async function submitAnswer() {
    if (!scenario || answer.trim().length < 50) {
      return;
    }

    setPhase("judging");

    try {
      const response = await fetch("/api/application/games/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          scenario,
          answer
        })
      });

      const payload = (await response.json().catch(() => null)) as ScenarioResult | { error?: { message?: string } } | null;

      if (!response.ok || !payload || "error" in payload) {
        throw new Error(payload && "error" in payload ? payload.error?.message || "Scenario failed" : "Scenario failed");
      }

      setResult(payload as ScenarioResult);
      setPhase("result");
    } catch {
      setPhase("answer");
    }
  }

  if (phase === "intro") {
    return (
      <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
        <p className="badge-line">{copy.badge}</p>
        <h2 className="mt-4 font-display text-5xl font-semibold uppercase text-ink">{copy.title}</h2>
        <p className="mt-4 max-w-3xl text-lg text-ink/72">{copy.subtitle}</p>
        <button
          type="button"
          onClick={() => void loadScenario()}
          className="mt-8 rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
        >
          {copy.start}
        </button>
      </article>
    );
  }

  if (phase === "loading" || phase === "judging") {
    const title = phase === "loading" ? copy.loading : copy.judging;
    const subtitle = phase === "loading" ? copy.loading : copy.judgingHint;

    return (
      <article className="glass-card flex min-h-80 flex-col items-center justify-center p-6 text-center sm:p-10" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-edge/25 border-t-accent" />
        <h2 className="mt-6 font-display text-4xl font-semibold uppercase text-ink">{title}</h2>
        <p className="mt-3 text-sm text-ink/62">{subtitle}</p>
      </article>
    );
  }

  if (phase === "result" && result) {
    return (
      <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="badge-line">{copy.levelLabels[result.levelKey]}</p>
            <h2 className="mt-4 font-display text-5xl font-semibold uppercase text-ink">{result.score}/100</h2>
          </div>
          <button
            type="button"
            onClick={() => void loadScenario()}
            className="rounded-full border border-edge/70 bg-panel/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink/72 transition hover:border-accent hover:text-accent"
          >
            {copy.retry}
          </button>
        </div>

        <p className="mt-5 text-sm leading-7 text-ink/76 sm:text-base">{result.analysis}</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5">
            <p className="font-display text-3xl font-semibold uppercase text-emerald-600">{copy.strengths}</p>
            <div className="mt-4 space-y-3">
              {result.goodPoints.map((item) => (
                <p key={item} className="border-l-2 border-emerald-500/60 pl-3 text-sm text-ink/76">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-accent/25 bg-accent/10 p-5">
            <p className="font-display text-3xl font-semibold uppercase text-accent">{copy.gaps}</p>
            <div className="mt-4 space-y-3">
              {result.gaps.map((item) => (
                <p key={item} className="border-l-2 border-accent/60 pl-3 text-sm text-ink/76">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-signal/25 bg-signal/10 p-5">
          <p className="font-display text-3xl font-semibold uppercase text-signal">{copy.modelAnswer}</p>
          <p className="mt-3 text-sm text-ink/76 sm:text-base">{result.modelAnswer}</p>
        </div>

        <div className="mt-4 rounded-3xl border border-violet/30 bg-violet/10 p-5">
          <p className="font-display text-3xl font-semibold uppercase text-violet">{copy.encouragement}</p>
          <p className="mt-3 text-sm text-ink/76 sm:text-base">{result.encouragement}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="badge-line">{scenario?.domain}</p>
          <h2 className="mt-4 font-display text-5xl font-semibold uppercase text-ink">{scenario?.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => void loadScenario()}
          className="rounded-full border border-edge/70 bg-panel/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink/72 transition hover:border-accent hover:text-accent"
        >
          {copy.change}
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-edge/45 bg-panel/65 p-5">
        <p className="text-sm leading-7 text-ink/76 sm:text-base">{scenario?.situation}</p>
        <div className="mt-5 rounded-3xl border border-accent/30 bg-accent/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{copy.challenge}</p>
          <p className="mt-3 font-display text-3xl font-semibold uppercase text-ink">{scenario?.challenge}</p>
        </div>
      </div>

      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        rows={12}
        placeholder={copy.answerPlaceholder}
        className="mt-6 min-h-80 w-full rounded-3xl border border-edge/55 bg-panel/65 px-5 py-4 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:bg-panel sm:text-base"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-ink/42">
        <span>{answer.trim().length}</span>
        <span>{copy.answerHint}</span>
      </div>

      <button
        type="button"
        onClick={() => void submitAnswer()}
        disabled={answer.trim().length < 50}
        className="mt-6 rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {copy.submit}
      </button>
    </article>
  );
}
