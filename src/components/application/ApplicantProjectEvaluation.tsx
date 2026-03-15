"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { SiteLocale } from "@/config/locales";

type EvaluationVerdictKey = "excellent" | "strong" | "solid" | "improve" | "rework";

type ScoreState = {
  innovation: number;
  feasibility: number;
  impact: number;
  presentation: number;
  technical: number;
};

type EvaluationResult = {
  globalScore: number;
  verdictKey: EvaluationVerdictKey;
  aiTextLikelihood: number;
  aiTextSummary: string;
  projectAiUsage: "yes" | "partial" | "no";
  projectAiSummary: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  juryTip: string;
};

type Criterion = {
  key: keyof ScoreState;
  label: string;
  hint: string;
  icon: string;
};

const COPY: Record<
  SiteLocale,
  {
    missingProject: string;
    missingProjectLink: string;
    criteria: Criterion[];
    yourProject: string;
    radar: string;
    selfScore: string;
    weak: string;
    strong: string;
    cta: string;
    generateScoresCta: string;
    scoresGenerated: string;
    loading: string;
    error: string;
    verdictTitle: string;
    strengthsTitle: string;
    improvementsTitle: string;
    tipTitle: string;
    aiDetectionTitle: string;
    aiTextLikelihoodLabel: string;
    projectAiUsageLabel: string;
    aiUsageYes: string;
    aiUsagePartial: string;
    aiUsageNo: string;
    lockedTitle: string;
    lockedBody: string;
    verdicts: Record<EvaluationVerdictKey, string>;
  }
> = {
  fr: {
    missingProject: "Ajoute d'abord les details de ton projet dans le formulaire candidat.",
    missingProjectLink: "Ouvrir le formulaire",
    criteria: [
      { key: "innovation", label: "Innovation", hint: "Originalite et singularite de l'idee.", icon: "IQ" },
      { key: "feasibility", label: "Faisabilite", hint: "Capacite reelle a construire la solution.", icon: "FX" },
      { key: "impact", label: "Impact", hint: "Valeur concrete pour les utilisateurs ou le terrain.", icon: "IM" },
      { key: "presentation", label: "Presentation", hint: "Clarte du pitch et de la demonstration.", icon: "PR" },
      { key: "technical", label: "Technique", hint: "Solidite de l'approche technique.", icon: "TE" }
    ],
    yourProject: "Ton projet",
    radar: "Radar",
    selfScore: "Score IA",
    weak: "Faible",
    strong: "Fort",
    cta: "Obtenir le retour du jury IA",
    generateScoresCta: "Relancer l'evaluation IA",
    scoresGenerated: "Scores generes par l'IA",
    loading: "Analyse en cours...",
    error: "Impossible de generer l'evaluation pour le moment.",
    verdictTitle: "Verdict du jury",
    strengthsTitle: "Points forts",
    improvementsTitle: "A renforcer",
    tipTitle: "Conseil final",
    aiDetectionTitle: "Detection IA",
    aiTextLikelihoodLabel: "Texte genere par IA",
    projectAiUsageLabel: "Usage IA du projet",
    aiUsageYes: "Oui",
    aiUsagePartial: "Partiel",
    aiUsageNo: "Non",
    lockedTitle: "Evaluation verrouillee",
    lockedBody: "Ton projet a ete evalue par le jury IA. Cette evaluation ne peut plus etre modifiee.",
    verdicts: {
      excellent: "Excellent",
      strong: "Tres solide",
      solid: "Solide",
      improve: "A renforcer",
      rework: "A retravailler"
    }
  },
  en: {
    missingProject: "Add your project details in the applicant form first.",
    missingProjectLink: "Open application form",
    criteria: [
      { key: "innovation", label: "Innovation", hint: "How distinct and original the idea feels.", icon: "IN" },
      { key: "feasibility", label: "Feasibility", hint: "How realistic the implementation looks.", icon: "FE" },
      { key: "impact", label: "Impact", hint: "How much value the solution can create.", icon: "IM" },
      { key: "presentation", label: "Presentation", hint: "How ready the pitch feels for a jury.", icon: "PR" },
      { key: "technical", label: "Technical depth", hint: "How strong the engineering substance is.", icon: "TD" }
    ],
    yourProject: "Your project",
    radar: "Radar",
    selfScore: "AI score",
    weak: "Low",
    strong: "High",
    cta: "Get AI jury feedback",
    generateScoresCta: "Regenerate AI scoring",
    scoresGenerated: "AI-evaluated score",
    loading: "Evaluating...",
    error: "Could not generate the evaluation right now.",
    verdictTitle: "Jury verdict",
    strengthsTitle: "Strengths",
    improvementsTitle: "Improvements",
    tipTitle: "Final tip",
    aiDetectionTitle: "AI detection",
    aiTextLikelihoodLabel: "AI-generated text likelihood",
    projectAiUsageLabel: "AI usage in project",
    aiUsageYes: "Yes",
    aiUsagePartial: "Partial",
    aiUsageNo: "No",
    lockedTitle: "Evaluation locked",
    lockedBody: "Your project has been evaluated by the AI jury. This evaluation cannot be modified.",
    verdicts: {
      excellent: "Excellent",
      strong: "Very strong",
      solid: "Solid",
      improve: "Needs improvement",
      rework: "Needs rework"
    }
  },
  ar: {
    missingProject: "أضف تفاصيل المشروع أولا داخل استمارة الترشح.",
    missingProjectLink: "فتح الاستمارة",
    criteria: [
      { key: "innovation", label: "الابتكار", hint: "مدى تميز الفكرة وأصالتها.", icon: "اب" },
      { key: "feasibility", label: "القابلية", hint: "مدى واقعية تنفيذ المشروع.", icon: "وق" },
      { key: "impact", label: "الأثر", hint: "القيمة التي قد يحققها الحل.", icon: "أث" },
      { key: "presentation", label: "العرض", hint: "جاهزية التقديم أمام اللجنة.", icon: "عر" },
      { key: "technical", label: "العمق التقني", hint: "قوة الجانب الهندسي.", icon: "تق" }
    ],
    yourProject: "مشروعك",
    radar: "الرادار",
    selfScore: "تقييم الذكاء الاصطناعي",
    weak: "ضعيف",
    strong: "قوي",
    cta: "الحصول على رأي لجنة الذكاء الاصطناعي",
    generateScoresCta: "إعادة توليد تقييم الذكاء الاصطناعي",
    scoresGenerated: "نقاط يقيمها الذكاء الاصطناعي",
    loading: "جار التحليل...",
    error: "تعذر توليد التقييم حاليا.",
    verdictTitle: "حكم اللجنة",
    strengthsTitle: "نقاط القوة",
    improvementsTitle: "ما يجب تقويته",
    tipTitle: "نصيحة ختامية",
    aiDetectionTitle: "كشف الذكاء الاصطناعي",
    aiTextLikelihoodLabel: "احتمال أن النص مولد بالذكاء الاصطناعي",
    projectAiUsageLabel: "استخدام الذكاء الاصطناعي في المشروع",
    aiUsageYes: "نعم",
    aiUsagePartial: "جزئي",
    aiUsageNo: "لا",
    lockedTitle: "التقييم مقفل",
    lockedBody: "تم تقييم مشروعك من قبل لجنة الذكاء الاصطناعي. لا يمكن تعديل هذا التقييم.",
    verdicts: {
      excellent: "ممتاز",
      strong: "قوي جدا",
      solid: "جيد",
      improve: "يحتاج تقوية",
      rework: "يحتاج إعادة عمل"
    }
  }
};

const COLORS = {
  innovation: "#ef4444",
  feasibility: "#f97316",
  impact: "#f59e0b",
  presentation: "#8b5cf6",
  technical: "#0ea5e9"
} satisfies Record<keyof ScoreState, string>;

export function ApplicantProjectEvaluation({
  locale,
  projectTitle,
  projectDomain,
  projectDesc,
  innovation,
  formHref,
  savedEvaluation
}: {
  locale: SiteLocale;
  projectTitle: string;
  projectDomain: string;
  projectDesc: string;
  innovation: string;
  formHref: string;
  savedEvaluation?: {
    globalScore: number;
    verdictKey: EvaluationVerdictKey;
    aiTextLikelihood: number;
    aiTextSummary: string;
    projectAiUsage: "yes" | "partial" | "no";
    projectAiSummary: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    juryTip: string;
    selfScores: Record<string, number>;
  } | null;
}) {
  const copy = COPY[locale];
  const hasExistingEvaluation = Boolean(savedEvaluation);

  const [scores, setScores] = useState<ScoreState>({
    innovation: savedEvaluation?.selfScores?.innovation ?? 3,
    feasibility: savedEvaluation?.selfScores?.feasibility ?? 3,
    impact: savedEvaluation?.selfScores?.impact ?? 3,
    presentation: savedEvaluation?.selfScores?.presentation ?? 3,
    technical: savedEvaluation?.selfScores?.technical ?? 3
  });
  const [result, setResult] = useState<EvaluationResult | null>(savedEvaluation ?? null);
  const [loading, setLoading] = useState(false);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoresError, setScoresError] = useState<string | null>(null);
  const [scoresGenerated, setScoresGenerated] = useState(Boolean(savedEvaluation));
  const hasProject = Boolean(projectTitle && projectDomain && projectDesc);
  const aiUsageLabel = (value: "yes" | "partial" | "no") =>
    value === "yes" ? copy.aiUsageYes : value === "partial" ? copy.aiUsagePartial : copy.aiUsageNo;

  useEffect(() => {
    if (!hasProject || scoresGenerated || scoresLoading || hasExistingEvaluation) {
      return;
    }

    void generateAIScores();
  }, [hasProject, scoresGenerated, scoresLoading, hasExistingEvaluation, locale, projectTitle, projectDomain, projectDesc, innovation]);

  const radarData = useMemo(
    () =>
      copy.criteria.map((criterion) => ({
        subject: criterion.label,
        value: scores[criterion.key] * 20,
        fullMark: 100
      })),
    [copy.criteria, scores]
  );

  const averageScore = scoresGenerated
    ? Math.round(((scores.innovation + scores.feasibility + scores.impact + scores.presentation + scores.technical) / 5) * 20)
    : null;

  async function generateAIScores() {
    if (!hasProject || scoresLoading) {
      return;
    }

    setScoresLoading(true);
    setScoresError(null);

    try {
      const response = await fetch("/api/application/score-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          projTitle: projectTitle,
          projDomain: projectDomain,
          projDesc: projectDesc,
          innovation
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | (ScoreState & { error?: undefined })
        | { error?: { message?: string } }
        | null;

      if (!response.ok || !payload || "error" in payload) {
        throw new Error(payload && "error" in payload ? payload.error?.message || copy.error : copy.error);
      }

      setScores(payload as ScoreState);
      setScoresGenerated(true);
    } catch (submitError) {
      setScoresError(submitError instanceof Error ? submitError.message : copy.error);
    } finally {
      setScoresLoading(false);
    }
  }

  async function evaluateProject() {
    if (!hasProject || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try { 
      const response = await fetch("/api/application/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          scores,
          projTitle: projectTitle,
          projDomain: projectDomain,
          projDesc: projectDesc,
          innovation
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | (EvaluationResult & { error?: undefined })
        | { error?: { message?: string } }
        | null;

      if (!response.ok || !payload || "error" in payload) {
        throw new Error(payload && "error" in payload ? payload.error?.message || copy.error : copy.error);
      }

      setResult(payload as EvaluationResult);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.error);
    } finally {
      setLoading(false);
    }
  }

  if (!hasProject) {
    return (
      <article className="glass-card border border-accent/35 bg-accent/10 p-6">
        <p className="text-sm text-ink/80">{copy.missingProject}</p>
        <Link
          href={formHref}
          className="mt-4 inline-flex rounded-full border border-transparent bg-accent px-5 py-3 font-display text-lg uppercase tracking-[0.08em] text-white transition hover:bg-accent2"
        >
          {copy.missingProjectLink}
        </Link>
      </article>
    );
  }

  // If evaluation already exists and user cannot change it, show read-only view
  if (hasExistingEvaluation && result) {
    return (
      <div className="space-y-6 overflow-x-hidden" dir={locale === "ar" ? "rtl" : "ltr"}>
      <article className="glass-card p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{copy.yourProject}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="break-words font-display text-xl font-semibold uppercase text-ink sm:text-3xl">{projectTitle}</h2>
          <span className="rounded-full border border-edge/60 bg-panel/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink/60">
            {projectDomain}
          </span>
        </div>
        <p className="mt-3 break-words text-[13px] text-ink/72 sm:text-base">{projectDesc}</p>
      </article>

      <article className="glass-card border border-emerald-500/25 bg-emerald-500/10 p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{copy.lockedTitle}</p>
        <p className="mt-2 text-sm text-ink/72">{copy.lockedBody}</p>
      </article>

      <article className="glass-card p-4 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{copy.verdictTitle}</p>
            <h3 className="mt-2 break-words font-display text-2xl font-semibold uppercase text-ink sm:text-4xl">
              {copy.verdicts[result.verdictKey]}
            </h3>
          </div>
          <div className="w-full rounded-3xl border border-edge/60 bg-panel/70 px-4 py-3 text-center sm:w-auto sm:px-6 sm:py-4">
            <p className="font-display text-3xl font-semibold uppercase text-accent sm:text-5xl">{result.globalScore}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-ink/42">/100</p>
          </div>
        </div>

        <p className="mt-4 break-words text-[13px] leading-6 text-ink/76 sm:mt-5 sm:text-base sm:leading-7">
          {result.summary}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5">
            <p className="font-display text-xl font-semibold uppercase text-emerald-600 sm:text-3xl">{copy.strengthsTitle}</p>
            <div className="mt-4 space-y-3">
              {result.strengths.map((item) => (
                <p key={item} className="break-words border-l-2 border-emerald-500/60 pl-3 text-[13px] text-ink/76 sm:text-sm">
                  {item}
                </p>
                ))}
              </div>
            </div>

          <div className="rounded-3xl border border-accent/25 bg-accent/10 p-5">
            <p className="font-display text-xl font-semibold uppercase text-accent sm:text-3xl">{copy.improvementsTitle}</p>
            <div className="mt-4 space-y-3">
              {result.improvements.map((item) => (
                <p key={item} className="break-words border-l-2 border-accent/60 pl-3 text-[13px] text-ink/76 sm:text-sm">
                  {item}
                </p>
                ))}
              </div>
            </div>
          </div>

        <div className="mt-4 rounded-3xl border border-sky-500/25 bg-sky-500/10 p-5">
          <p className="font-display text-xl font-semibold uppercase text-sky-700 sm:text-3xl">{copy.aiDetectionTitle}</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                {copy.aiTextLikelihoodLabel}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold uppercase text-sky-700 sm:text-4xl">
                {result.aiTextLikelihood}%
              </p>
              <p className="mt-2 break-words text-[13px] text-ink/76 sm:text-sm">{result.aiTextSummary}</p>
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                  {copy.projectAiUsageLabel}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink sm:text-base">{aiUsageLabel(result.projectAiUsage)}</p>
                <p className="mt-2 break-words text-[13px] text-ink/76 sm:text-sm">{result.projectAiSummary}</p>
              </div>
            </div>
        </div>

        <div className="mt-4 rounded-3xl border border-violet/30 bg-violet/10 p-5">
          <p className="font-display text-xl font-semibold uppercase text-violet sm:text-3xl">{copy.tipTitle}</p>
          <p className="mt-3 break-words text-[13px] text-ink/76 sm:text-base">{result.juryTip}</p>
        </div>
      </article>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden" dir={locale === "ar" ? "rtl" : "ltr"}>
      <article className="glass-card p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{copy.yourProject}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="break-words font-display text-xl font-semibold uppercase text-ink sm:text-3xl">{projectTitle}</h2>
          <span className="rounded-full border border-edge/60 bg-panel/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink/60">
            {projectDomain}
          </span>
        </div>
        <p className="mt-3 break-words text-[13px] text-ink/72 sm:text-base">{projectDesc}</p>
      </article>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="glass-card p-4 sm:p-6">
          <div className="space-y-4">
            {copy.criteria.map((criterion) => {
              const value = scores[criterion.key];

              return (
                <div key={criterion.key} className="rounded-2xl border border-edge/50 bg-panel/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-[10px] font-semibold uppercase tracking-[0.14em] sm:h-11 sm:w-11 sm:text-xs"
                        style={{ backgroundColor: `${COLORS[criterion.key]}18`, color: COLORS[criterion.key] }}
                      >
                        {criterion.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="break-words font-display text-lg uppercase text-ink sm:text-2xl">{criterion.label}</p>
                        <p className="break-words text-[12px] text-ink/62 sm:text-sm">{criterion.hint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                        IA
                      </span>
                      <span
                        className="rounded-full border px-3 py-1 text-xs font-semibold sm:text-sm"
                        style={{ borderColor: `${COLORS[criterion.key]}40`, color: COLORS[criterion.key] }}
                      >
                        {scoresGenerated ? `${value}/5` : "--/5"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="glass-card p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{copy.radar}</p>
          <div className="mt-4 h-52 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(120,120,120,.22)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 10 }} className="text-ink/55" />
                <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-edge/50 bg-panel/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">{copy.selfScore}</p>
            <p className="mt-2 font-display text-3xl font-semibold uppercase text-accent sm:text-5xl">
              {averageScore ?? "--"}
            </p>
            <p className="text-sm text-ink/62">/100</p>
          </div>

          {scoresError ? (
            <>
              <p className="mt-4 rounded-2xl border border-rose/35 bg-rose/10 px-4 py-3 text-sm text-rose">{scoresError}</p>
              <button
                type="button"
                onClick={() => void generateAIScores()}
                disabled={scoresLoading}
                className="mt-4 w-full rounded-full border border-transparent bg-accent px-6 py-3 font-display text-sm uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-lg"
              >
                {scoresLoading ? copy.loading : copy.generateScoresCta}
              </button>
            </>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl border border-rose/35 bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={() => void evaluateProject()}
            disabled={!scoresGenerated || loading}
            className="mt-4 w-full rounded-full border border-transparent bg-accent px-6 py-3 font-display text-sm uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-xl"
          >
            {scoresLoading ? copy.loading : copy.cta}
          </button>
        </article>
      </div>

      {result ? (
        <article className="glass-card p-4 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{copy.verdictTitle}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">
                {copy.verdicts[result.verdictKey]}
              </h3>
            </div>
            <div className="w-full rounded-3xl border border-edge/60 bg-panel/70 px-4 py-3 text-center sm:w-auto sm:px-6 sm:py-4">
              <p className="font-display text-4xl font-semibold uppercase text-accent sm:text-5xl">{result.globalScore}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/42">/100</p>
            </div>
          </div>

          <p className="mt-4 break-words text-[13px] leading-6 text-ink/76 sm:mt-5 sm:text-base sm:leading-7">
            {result.summary}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5">
              <p className="font-display text-xl font-semibold uppercase text-emerald-600 sm:text-3xl">{copy.strengthsTitle}</p>
              <div className="mt-4 space-y-3">
                {result.strengths.map((item) => (
                  <p key={item} className="break-words border-l-2 border-emerald-500/60 pl-3 text-[13px] text-ink/76 sm:text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-accent/25 bg-accent/10 p-5">
              <p className="font-display text-xl font-semibold uppercase text-accent sm:text-3xl">{copy.improvementsTitle}</p>
              <div className="mt-4 space-y-3">
                {result.improvements.map((item) => (
                  <p key={item} className="break-words border-l-2 border-accent/60 pl-3 text-[13px] text-ink/76 sm:text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-sky-500/25 bg-sky-500/10 p-5">
            <p className="font-display text-xl font-semibold uppercase text-sky-700 sm:text-3xl">{copy.aiDetectionTitle}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                  {copy.aiTextLikelihoodLabel}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold uppercase text-sky-700 sm:text-4xl">
                  {result.aiTextLikelihood}%
                </p>
                <p className="mt-2 break-words text-[13px] text-ink/76 sm:text-sm">{result.aiTextSummary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                  {copy.projectAiUsageLabel}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink sm:text-base">{aiUsageLabel(result.projectAiUsage)}</p>
                <p className="mt-2 break-words text-[13px] text-ink/76 sm:text-sm">{result.projectAiSummary}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-violet/30 bg-violet/10 p-5">
            <p className="font-display text-xl font-semibold uppercase text-violet sm:text-3xl">{copy.tipTitle}</p>
            <p className="mt-3 break-words text-[13px] text-ink/76 sm:text-base">{result.juryTip}</p>
          </div>
        </article>
      ) : null}
    </div>
  );
}
