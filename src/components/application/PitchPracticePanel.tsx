"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { SiteLocale } from "@/config/locales";

type Phase = "intro" | "write" | "timer" | "judging" | "result";
type PitchVerdictKey = "convincing" | "promising" | "refine" | "rework";

type PitchResult = {
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
};

const MAX_SECONDS = 180;

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    start: string;
    writeTitle: string;
    writeHint: string;
    timerTitle: string;
    judging: string;
    judgingHint: string;
    back: string;
    judge: string;
    timerStart: string;
    timerPause: string;
    timerReset: string;
    backToPitch: string;
    retry: string;
    verdicts: Record<PitchVerdictKey, string>;
    detailLabels: Record<keyof PitchResult["scores"], string>;
    bestLine: string;
    missingElement: string;
    nextTip: string;
    charsLabel: string;
  }
> = {
  fr: {
    badge: "Mini jeu",
    title: "Pitch Timer",
    subtitle: "Entraine ton pitch, respecte les 3 minutes, puis demande un feedback jury.",
    start: "Commencer",
    writeTitle: "Ton pitch",
    writeHint: "Colle ou redige ton texte avant de lancer le chrono ou l'evaluation.",
    timerTitle: "Chronometre 3 minutes",
    judging: "Le jury analyse ton pitch...",
    judgingHint: "Feedback en cours de generation",
    back: "Retour",
    judge: "Soumettre au jury IA",
    timerStart: "Demarrer",
    timerPause: "Pause",
    timerReset: "Reset",
    backToPitch: "Retour au texte",
    retry: "Recommencer",
    verdicts: {
      convincing: "Convaincant",
      promising: "Prometteur",
      refine: "A affiner",
      rework: "A retravailler"
    },
    detailLabels: {
      clarity: "Clarte",
      innovation: "Innovation",
      impact: "Impact",
      confidence: "Conviction",
      structure: "Structure"
    },
    bestLine: "Meilleure phrase",
    missingElement: "Element manquant",
    nextTip: "Conseil suivant",
    charsLabel: "caracteres"
  },
  en: {
    badge: "Mini game",
    title: "Pitch Timer",
    subtitle: "Practice your pitch, stay inside 3 minutes, then request jury-like feedback.",
    start: "Start",
    writeTitle: "Your pitch",
    writeHint: "Paste or draft your text before using the timer or the AI jury.",
    timerTitle: "3-minute timer",
    judging: "The jury is reviewing your pitch...",
    judgingHint: "Generating feedback",
    back: "Back",
    judge: "Send to AI jury",
    timerStart: "Start",
    timerPause: "Pause",
    timerReset: "Reset",
    backToPitch: "Back to pitch",
    retry: "Restart",
    verdicts: {
      convincing: "Convincing",
      promising: "Promising",
      refine: "Needs refinement",
      rework: "Needs rework"
    },
    detailLabels: {
      clarity: "Clarity",
      innovation: "Innovation",
      impact: "Impact",
      confidence: "Confidence",
      structure: "Structure"
    },
    bestLine: "Best line",
    missingElement: "Missing element",
    nextTip: "Next tip",
    charsLabel: "chars"
  },
  ar: {
    badge: "لعبة مصغرة",
    title: "Pitch Timer",
    subtitle: "تدرب على العرض، احترم 3 دقائق، ثم اطلب ملاحظات شبيهة باللجنة.",
    start: "ابدأ",
    writeTitle: "نص العرض",
    writeHint: "اكتب أو ألصق النص قبل استعمال المؤقت أو لجنة الذكاء الاصطناعي.",
    timerTitle: "مؤقت 3 دقائق",
    judging: "اللجنة تحلل عرضك...",
    judgingHint: "جار توليد الملاحظات",
    back: "رجوع",
    judge: "إرسال إلى لجنة الذكاء الاصطناعي",
    timerStart: "ابدأ",
    timerPause: "إيقاف",
    timerReset: "إعادة",
    backToPitch: "العودة للنص",
    retry: "إعادة المحاولة",
    verdicts: {
      convincing: "مقنع",
      promising: "واعد",
      refine: "يحتاج صقل",
      rework: "يحتاج إعادة عمل"
    },
    detailLabels: {
      clarity: "الوضوح",
      innovation: "الابتكار",
      impact: "الأثر",
      confidence: "الثقة",
      structure: "البنية"
    },
    bestLine: "أفضل جملة",
    missingElement: "العنصر الناقص",
    nextTip: "النصيحة التالية",
    charsLabel: "حرف"
  }
};

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function PitchPracticePanel({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale];
  const [phase, setPhase] = useState<Phase>("intro");
  const [pitch, setPitch] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<PitchResult | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running && phase === "timer") {
      intervalRef.current = window.setInterval(() => {
        setSeconds((current) => {
          if (current >= MAX_SECONDS) {
            window.clearInterval(intervalRef.current ?? undefined);
            return MAX_SECONDS;
          }

          return current + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [phase, running]);

  const radarData = useMemo(
    () =>
      result
        ? Object.entries(result.scores).map(([key, value]) => ({
            subject: copy.detailLabels[key as keyof PitchResult["scores"]],
            value: value * 10,
            fullMark: 100
          }))
        : [],
    [copy.detailLabels, result]
  );

  async function judgePitch() {
    if (pitch.trim().length < 50) {
      return;
    }

    setPhase("judging");

    try {
      const response = await fetch("/api/application/games/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          pitch,
          duration: seconds
        })
      });

      const payload = (await response.json().catch(() => null)) as PitchResult | { error?: { message?: string } } | null;

      if (!response.ok || !payload || "error" in payload) {
        throw new Error(payload && "error" in payload ? payload.error?.message || "Pitch failed" : "Pitch failed");
      }

      setResult(payload as PitchResult);
      setPhase("result");
    } catch {
      setPhase("write");
    }
  }

  function restart() {
    setPhase("intro");
    setPitch("");
    setSeconds(0);
    setRunning(false);
    setResult(null);
  }

  if (phase === "intro") {
    return (
      <button
        type="button"
        onClick={() => setPhase("write")}
        className="group relative block w-full overflow-hidden rounded-[18px] border border-edge/55 bg-panel/88 p-6 text-left shadow-xl transition duration-300 hover:-translate-y-1 hover:border-edge hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel liquid-card"
        style={{ backgroundImage: "linear-gradient(140deg, rgba(249, 115, 22, 0.094), rgba(249, 115, 22, 0.024))" }}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at 30% 16%, rgba(249, 115, 22, 0.157), transparent 42%)" }}
        />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ border: "1px solid rgba(249, 115, 22, 0.314)", color: "rgb(249, 115, 22)", backgroundColor: "rgba(249, 115, 22, 0.07)" }}
            >
              {copy.badge}
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/55">↗</span>
          </div>
          <p className="font-display text-[22px] uppercase leading-tight text-ink">{copy.title}</p>
          <p className="text-sm text-ink/76">{copy.subtitle}</p>
          <div className="mt-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgb(249, 115, 22)" }}>
            <span className="h-[1px] w-7 bg-current opacity-40" />
            {copy.start} · PITCH
          </div>
        </div>
      </button>
    );
  }

  if (phase === "judging") {
    return (
      <article className="glass-card flex min-h-80 flex-col items-center justify-center p-6 text-center sm:p-10" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-edge/25 border-t-accent" />
        <h2 className="mt-6 font-display text-4xl font-semibold uppercase text-ink">{copy.judging}</h2>
        <p className="mt-3 text-sm text-ink/62">{copy.judgingHint}</p>
      </article>
    );
  }

  if (phase === "result" && result) {
    return (
      <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="badge-line">{copy.verdicts[result.verdictKey]}</p>
            <h2 className="mt-4 font-display text-5xl font-semibold uppercase text-ink">
              {result.globalScore}/100
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-ink/72 sm:text-base">{result.juryComment}</p>
          </div>
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-edge/70 bg-panel/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink/72 transition hover:border-accent hover:text-accent"
          >
            {copy.retry}
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-edge/45 bg-panel/65 p-5">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(120,120,120,.22)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 11 }} className="text-ink/55" />
                <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5">
              <p className="font-display text-3xl font-semibold uppercase text-emerald-600">{copy.bestLine}</p>
              <p className="mt-3 text-sm text-ink/76 sm:text-base">{result.bestLine}</p>
            </div>
            <div className="rounded-3xl border border-accent/25 bg-accent/10 p-5">
              <p className="font-display text-3xl font-semibold uppercase text-accent">{copy.missingElement}</p>
              <p className="mt-3 text-sm text-ink/76 sm:text-base">{result.missingElement}</p>
            </div>
            <div className="rounded-3xl border border-violet/30 bg-violet/10 p-5">
              <p className="font-display text-3xl font-semibold uppercase text-violet">{copy.nextTip}</p>
              <p className="mt-3 text-sm text-ink/76 sm:text-base">{result.nextTip}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (phase === "timer") {
    const progress = Math.min(100, (seconds / MAX_SECONDS) * 100);

    return (
      <article className="glass-card p-6 text-center sm:p-10" dir={locale === "ar" ? "rtl" : "ltr"}>
        <h2 className="font-display text-5xl font-semibold uppercase text-ink">{copy.timerTitle}</h2>
        <div className="mt-8">
          <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-edge/45 bg-panel/65">
            <div>
              <p className="font-display text-6xl font-semibold uppercase text-accent">{formatTime(seconds)}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink/42">/ {formatTime(MAX_SECONDS)}</p>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-edge/20">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((current) => !current)}
            className="rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
          >
            {running ? copy.timerPause : copy.timerStart}
          </button>
          <button
            type="button"
            onClick={() => setSeconds(0)}
            className="rounded-full border border-edge/70 bg-panel/70 px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
          >
            {copy.timerReset}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setPhase("write");
            }}
            className="rounded-full border border-edge/70 bg-panel/70 px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
          >
            {copy.backToPitch}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="badge-line">{copy.title}</p>
          <h2 className="mt-4 font-display text-5xl font-semibold uppercase text-ink">{copy.writeTitle}</h2>
        </div>
        <button
          type="button"
          onClick={() => setPhase("intro")}
          className="rounded-full border border-edge/70 bg-panel/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink/72 transition hover:border-accent hover:text-accent"
        >
          {copy.back}
        </button>
      </div>

      <p className="mt-4 text-sm text-ink/68 sm:text-base">{copy.writeHint}</p>
      <textarea
        value={pitch}
        onChange={(event) => setPitch(event.target.value)}
        rows={12}
        className="mt-6 min-h-80 w-full rounded-3xl border border-edge/55 bg-panel/65 px-5 py-4 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:bg-panel sm:text-base"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-ink/42">
        <span>
          {pitch.trim().length} {copy.charsLabel}
        </span>
        <span>{formatTime(seconds)}</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPhase("timer")}
          disabled={pitch.trim().length < 50}
          className="rounded-full border border-edge/70 bg-panel/70 px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.timerTitle}
        </button>
        <button
          type="button"
          onClick={() => void judgePitch()}
          disabled={pitch.trim().length < 50}
          className="rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.judge}
        </button>
      </div>
    </article>
  );
}
