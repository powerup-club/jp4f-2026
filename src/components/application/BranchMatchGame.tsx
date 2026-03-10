"use client";

import { useMemo, useState } from "react";
import type { ApplicantQuizBranch } from "@/applicant/types";
import type { SiteLocale } from "@/config/locales";

type BranchKey = ApplicantQuizBranch;

type MatchCard = {
  label: string;
  branch: BranchKey;
  hint: Record<SiteLocale, string>;
};

const BRANCH_META: Record<
  SiteLocale,
  Record<BranchKey, { label: string; color: string; icon: string }>
> = {
  fr: {
    GESI: { label: "GESI", color: "#10b981", icon: "GE" },
    MECA: { label: "MECA", color: "#f97316", icon: "ME" },
    MECATRONIQUE: { label: "Mecatronique", color: "#8b5cf6", icon: "MC" },
    GI: { label: "GI", color: "#0ea5e9", icon: "GI" }
  },
  en: {
    GESI: { label: "GESI", color: "#10b981", icon: "GE" },
    MECA: { label: "MECA", color: "#f97316", icon: "ME" },
    MECATRONIQUE: { label: "Mechatronics", color: "#8b5cf6", icon: "MC" },
    GI: { label: "GI", color: "#0ea5e9", icon: "GI" }
  },
  ar: {
    GESI: { label: "GESI", color: "#10b981", icon: "GE" },
    MECA: { label: "MECA", color: "#f97316", icon: "ME" },
    MECATRONIQUE: { label: "ميكاترونيك", color: "#8b5cf6", icon: "MC" },
    GI: { label: "GI", color: "#0ea5e9", icon: "GI" }
  }
};

const CARDS: MatchCard[] = [
  {
    label: "Predictive energy dashboard",
    branch: "GESI",
    hint: {
      fr: "Energie, donnee et pilotage intelligent.",
      en: "Energy, data, and intelligent control.",
      ar: "طاقة ومعطيات وقيادة ذكية."
    }
  },
  {
    label: "Finite-element simulation",
    branch: "MECA",
    hint: {
      fr: "Calcul de structure et validation mecanique.",
      en: "Structural analysis and mechanical validation.",
      ar: "تحليل بنيوي وتحقق ميكانيكي."
    }
  },
  {
    label: "Autonomous robotic arm",
    branch: "MECATRONIQUE",
    hint: {
      fr: "Robotique, vision et actionneurs.",
      en: "Robotics, vision, and actuators.",
      ar: "روبوتيك ورؤية ومحركات."
    }
  },
  {
    label: "Lean production board",
    branch: "GI",
    hint: {
      fr: "Pilotage des flux et performance.",
      en: "Flow management and performance.",
      ar: "قيادة التدفقات والأداء."
    }
  },
  {
    label: "Smart solar micro-grid",
    branch: "GESI",
    hint: {
      fr: "Reseau intelligent et transition energetique.",
      en: "Smart grid and energy transition.",
      ar: "شبكة ذكية وانتقال طاقي."
    }
  },
  {
    label: "Additive-manufacturing fixture",
    branch: "MECA",
    hint: {
      fr: "Conception et fabrication mecanique.",
      en: "Mechanical design and manufacturing.",
      ar: "تصميم وتصنيع ميكانيكي."
    }
  },
  {
    label: "PLC-driven sorting cell",
    branch: "MECATRONIQUE",
    hint: {
      fr: "Automatique et systemes hybrides.",
      en: "Automation and hybrid systems.",
      ar: "أتمتة وأنظمة هجينة."
    }
  },
  {
    label: "Supply-chain KPI cockpit",
    branch: "GI",
    hint: {
      fr: "Decision, KPI et organisation.",
      en: "Decision-making, KPI, and operations.",
      ar: "قرار ومؤشرات وتنظيم."
    }
  }
];

const COPY: Record<
  SiteLocale,
  {
    title: string;
    subtitle: string;
    instructions: string;
    next: string;
    results: string;
    retry: string;
    score: string;
    summary: string;
  }
> = {
  fr: {
    title: "Filiere Match",
    subtitle: "Associe chaque techno au bon parcours du departement.",
    instructions: "A quelle filiere rattaches-tu cette carte ?",
    next: "Carte suivante",
    results: "Voir mon resultat",
    retry: "Rejouer",
    score: "Score",
    summary: "Profil dominant"
  },
  en: {
    title: "Branch Match",
    subtitle: "Match each technology card to the right department track.",
    instructions: "Which branch fits this card best?",
    next: "Next card",
    results: "See results",
    retry: "Play again",
    score: "Score",
    summary: "Dominant profile"
  },
  ar: {
    title: "Filiere Match",
    subtitle: "اربط كل بطاقة تقنية بالمسلك الأنسب داخل الشعبة.",
    instructions: "ما المسلك الأنسب لهذه البطاقة؟",
    next: "البطاقة التالية",
    results: "عرض النتيجة",
    retry: "إعادة اللعب",
    score: "النتيجة",
    summary: "المسلك الغالب"
  }
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function BranchMatchGame({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale];
  const meta = BRANCH_META[locale];
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchKey | null>(null);
  const [scores, setScores] = useState<Record<BranchKey, number>>({
    GESI: 0,
    MECA: 0,
    MECATRONIQUE: 0,
    GI: 0
  });

  const cards = useMemo(() => shuffle(CARDS), [seed]);
  const current = cards[index];
  const completed = index >= cards.length;
  const dominantBranch = (Object.entries(scores) as Array<[BranchKey, number]>).sort((a, b) => b[1] - a[1])[0][0];

  function choose(branch: BranchKey) {
    if (revealed) {
      return;
    }

    setSelectedBranch(branch);
    setRevealed(true);

    if (branch === current.branch) {
      setScores((currentScores) => ({
        ...currentScores,
        [branch]: currentScores[branch] + 1
      }));
    }
  }

  function next() {
    if (index === cards.length - 1) {
      setIndex(cards.length);
      return;
    }

    setIndex((currentIndex) => currentIndex + 1);
    setRevealed(false);
    setSelectedBranch(null);
  }

  function restart() {
    setSeed((currentSeed) => currentSeed + 1);
    setIndex(0);
    setRevealed(false);
    setSelectedBranch(null);
    setScores({
      GESI: 0,
      MECA: 0,
      MECATRONIQUE: 0,
      GI: 0
    });
  }

  if (completed) {
    return (
      <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
        <p className="badge-line">{copy.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span
            className="inline-flex h-16 w-16 items-center justify-center rounded-3xl text-lg font-semibold uppercase tracking-[0.16em]"
            style={{ backgroundColor: `${meta[dominantBranch].color}18`, color: meta[dominantBranch].color }}
          >
            {meta[dominantBranch].icon}
          </span>
          <div>
            <h2 className="font-display text-5xl font-semibold uppercase text-ink">{meta[dominantBranch].label}</h2>
            <p className="mt-2 text-sm text-ink/66">{copy.score}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {(Object.keys(meta) as BranchKey[]).map((branch) => (
            <div key={branch} className="rounded-3xl border border-edge/45 bg-panel/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-3xl font-semibold uppercase text-ink">{meta[branch].label}</p>
                <span
                  className="rounded-full border px-3 py-1 text-sm font-semibold"
                  style={{ borderColor: `${meta[branch].color}40`, color: meta[branch].color }}
                >
                  {scores[branch]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
        >
          {copy.retry}
        </button>
      </article>
    );
  }

  return (
    <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="badge-line">{copy.title}</p>
          <h2 className="mt-4 font-display text-5xl font-semibold uppercase text-ink">{current.label}</h2>
        </div>
        <span className="rounded-full border border-edge/60 bg-panel/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/52">
          {copy.score} {Object.values(scores).reduce((sum, value) => sum + value, 0)}
        </span>
      </div>

      <p className="mt-4 text-sm text-ink/68 sm:text-base">{copy.instructions}</p>
      <div className="mt-6 rounded-3xl border border-edge/45 bg-panel/60 p-6">
        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(meta) as BranchKey[]).map((branch) => {
            const active = selectedBranch === branch;
            const correct = revealed && current.branch === branch;
            const wrong = revealed && active && current.branch !== branch;

            return (
              <button
                key={branch}
                type="button"
                onClick={() => choose(branch)}
                disabled={revealed}
                className={`rounded-3xl border px-5 py-4 text-start transition ${
                  correct
                    ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-600"
                    : wrong
                      ? "border-rose/40 bg-rose/10 text-rose"
                      : active
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-edge/40 bg-panel/65 text-ink/78 hover:border-accent hover:text-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ backgroundColor: `${meta[branch].color}18`, color: meta[branch].color }}
                  >
                    {meta[branch].icon}
                  </span>
                  <span className="font-display text-2xl uppercase">{meta[branch].label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div className="mt-6 rounded-3xl border p-5" style={{ borderColor: `${meta[current.branch].color}35`, backgroundColor: `${meta[current.branch].color}10` }}>
            <p className="font-display text-3xl font-semibold uppercase" style={{ color: meta[current.branch].color }}>
              {meta[current.branch].label}
            </p>
            <p className="mt-3 text-sm text-ink/76 sm:text-base">{current.hint[locale]}</p>
          </div>
        ) : null}
      </div>

      {revealed ? (
        <button
          type="button"
          onClick={next}
          className="mt-6 rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
        >
          {index === cards.length - 1 ? copy.results : copy.next}
        </button>
      ) : null}
    </article>
  );
}
