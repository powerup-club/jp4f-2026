"use client";

import { useEffect, useState } from "react";
import type { SiteLocale } from "@/config/locales";

type EvaluationItem = {
  id: number;
  applicationId: number;
  applicantEmail: string;
  applicantName: string;
  projectTitle: string;
  projectDomain: string;
  globalScore: number;
  verdictKey: "excellent" | "strong" | "solid" | "improve" | "rework";
  aiTextLikelihood: number;
  aiTextSummary: string;
  projectAiUsage: "yes" | "partial" | "no";
  projectAiSummary: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  juryTip: string;
  createdAt: string;
  updatedAt: string;
};

const VERDICTS: Record<string, Record<string, string>> = {
  fr: {
    excellent: "Excellent",
    strong: "Très solide",
    solid: "Solide",
    improve: "À renforcer",
    rework: "À retravailler"
  },
  en: {
    excellent: "Excellent",
    strong: "Very strong",
    solid: "Solid",
    improve: "Needs improvement",
    rework: "Needs rework"
  },
  ar: {
    excellent: "ممتاز",
    strong: "قوي جدا",
    solid: "جيد",
    improve: "يحتاج تقوية",
    rework: "يحتاج إعادة عمل"
  }
};

const COPY: Record<SiteLocale, Record<string, string>> = {
  fr: {
    title: "Évaluations des projets",
    subtitle: "Tous les retours IA générés pour les candidats",
    loading: "Chargement...",
    error: "Impossible de charger les évaluations",
    empty: "Aucune évaluation disponible",
    applicant: "Candidat",
    project: "Projet",
    score: "Score",
    verdict: "Verdict",
    domain: "Domaine",
    date: "Date",
    strengths: "Points forts",
    improvements: "À renforcer",
    feedback: "Retours",
    aiDetection: "Détection IA",
    aiTextLikelihood: "Texte généré par IA",
    projectAiUsage: "Usage IA du projet",
    aiUsageYes: "Oui",
    aiUsagePartial: "Partiel",
    aiUsageNo: "Non"
  },
  en: {
    title: "Project Evaluations",
    subtitle: "All AI-generated feedback for applicants",
    loading: "Loading...",
    error: "Failed to load evaluations",
    empty: "No evaluations available",
    applicant: "Applicant",
    project: "Project",
    score: "Score",
    verdict: "Verdict",
    domain: "Domain",
    date: "Date",
    strengths: "Strengths",
    improvements: "Improvements",
    feedback: "Feedback",
    aiDetection: "AI Detection",
    aiTextLikelihood: "AI-generated text likelihood",
    projectAiUsage: "AI usage in project",
    aiUsageYes: "Yes",
    aiUsagePartial: "Partial",
    aiUsageNo: "No"
  },
  ar: {
    title: "تقييمات المشاريع",
    subtitle: "جميع الملاحظات المولدة من قبل الذكاء الاصطناعي للمرشحين",
    loading: "جار التحميل...",
    error: "فشل في تحميل التقييمات",
    empty: "لا توجد تقييمات متاحة",
    applicant: "المرشح",
    project: "المشروع",
    score: "النقاط",
    verdict: "الحكم",
    domain: "المجال",
    date: "التاريخ",
    strengths: "نقاط القوة",
    improvements: "ما يجب تقويته",
    feedback: "التعليقات",
    aiDetection: "كشف الذكاء الاصطناعي",
    aiTextLikelihood: "احتمال أن النص مولد بالذكاء الاصطناعي",
    projectAiUsage: "استخدام الذكاء الاصطناعي في المشروع",
    aiUsageYes: "نعم",
    aiUsagePartial: "جزئي",
    aiUsageNo: "لا"
  }
};

export function AdminEvaluationsPanel({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = COPY[locale];
  const verdicts = VERDICTS[locale];
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await fetch("/api/admin/evaluations");
        if (!res.ok) throw new Error(copy.error);
        const data = (await res.json()) as { evaluations: EvaluationItem[] };
        setEvaluations(data.evaluations);
      } catch (err) {
        setError(err instanceof Error ? err.message : copy.error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [copy.error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-ink/60">{copy.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose/35 bg-rose/10 p-6">
        <p className="text-rose">{error}</p>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="rounded-2xl border border-edge/50 bg-panel/30 p-6 text-center">
        <p className="text-ink/60">{copy.empty}</p>
      </div>
    );
  }

  const colorForVerdict = (verdict: string) => {
    switch (verdict) {
      case "excellent":
        return "emerald";
      case "strong":
        return "green";
      case "solid":
        return "blue";
      case "improve":
        return "amber";
      case "rework":
        return "rose";
      default:
        return "gray";
    }
  };

  return (
    <div className="space-y-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      {evaluations.map((evaluation) => {
        const isExpanded = expandedId === evaluation.id;
        const color = colorForVerdict(evaluation.verdictKey);
        const aiUsageLabel =
          evaluation.projectAiUsage === "yes"
            ? copy.aiUsageYes
            : evaluation.projectAiUsage === "partial"
              ? copy.aiUsagePartial
              : copy.aiUsageNo;

        return (
          <div key={evaluation.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : evaluation.id)}
              className="w-full p-6 text-left transition hover:bg-panel/40"
            >
              <div className="grid gap-4 lg:grid-cols-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{copy.applicant}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-ink">{evaluation.applicantName}</p>
                  <p className="text-xs text-ink/60">{evaluation.applicantEmail}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{copy.project}</p>
                  <p className="mt-1 font-semibold text-ink">{evaluation.projectTitle}</p>
                  <p className="text-xs text-ink/60">{evaluation.projectDomain}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{copy.score}</p>
                  <p className="mt-1 font-display text-3xl font-bold text-accent">{evaluation.globalScore}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{copy.verdict}</p>
                  <p
                    className={`mt-1 font-semibold capitalize text-${color}-600`}
                  >
                    {verdicts[evaluation.verdictKey]}
                  </p>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    className="rounded-full border border-edge/50 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-panel/60"
                  >
                    {isExpanded ? "Hide" : "View"}
                  </button>
                </div>
              </div>
            </button>

            {isExpanded ? (
              <div className="border-t border-edge/50 bg-panel/30 p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/45">Summary</p>
                    <p className="mt-2 text-sm text-ink/75">{evaluation.summary}</p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4">
                      <p className="text-sm font-semibold text-emerald-600">{copy.strengths}</p>
                      <ul className="mt-2 space-y-2">
                        {evaluation.strengths.map((item, idx) => (
                          <li key={idx} className="text-xs text-ink/75">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-accent/25 bg-accent/10 p-4">
                      <p className="text-sm font-semibold text-accent">{copy.improvements}</p>
                      <ul className="mt-2 space-y-2">
                        {evaluation.improvements.map((item, idx) => (
                          <li key={idx} className="text-xs text-ink/75">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg border border-violet/30 bg-violet/10 p-4">
                    <p className="text-sm font-semibold text-violet">Jury Tip</p>
                    <p className="mt-2 text-sm text-ink/75">{evaluation.juryTip}</p>
                  </div>

                  <div className="rounded-lg border border-sky-500/25 bg-sky-500/10 p-4">
                    <p className="text-sm font-semibold text-sky-700">{copy.aiDetection}</p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/55">
                          {copy.aiTextLikelihood}
                        </p>
                        <p className="mt-1 font-display text-2xl font-semibold text-sky-700">
                          {evaluation.aiTextLikelihood}%
                        </p>
                        <p className="mt-1 text-xs text-ink/70">{evaluation.aiTextSummary}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/55">
                          {copy.projectAiUsage}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink">{aiUsageLabel}</p>
                        <p className="mt-1 text-xs text-ink/70">{evaluation.projectAiSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
