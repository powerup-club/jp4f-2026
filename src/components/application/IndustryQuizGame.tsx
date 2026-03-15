"use client";

import { useMemo, useState } from "react";
import type { SiteLocale } from "@/config/locales";

type Question = {
  question: Record<SiteLocale, string>;
  options: Record<SiteLocale, string[]>;
  answer: number;
};

type LeaderboardEntry = {
  id: number;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
};

type Phase = "intro" | "playing" | "result" | "leaderboard";

const QUESTIONS: Question[] = [
  {
    question: {
      fr: "Que signifie IoT ?",
      en: "What does IoT stand for?",
      ar: "ماذا تعني IoT؟"
    },
    options: {
      fr: ["Internet of Things", "Industrial Operation Tracking", "Integrated Object Transfer", "Internet of Terminals"],
      en: ["Internet of Things", "Industrial Operation Tracking", "Integrated Object Transfer", "Internet of Terminals"],
      ar: ["إنترنت الأشياء", "تتبّع العمليات الصناعية", "نقل الكائنات المدمج", "إنترنت المحطات"]
    },
    answer: 0
  },
  {
    question: {
      fr: "Quel protocole est tres courant dans l'IoT industriel ?",
      en: "Which protocol is widely used in industrial IoT?",
      ar: "ما البروتوكول الشائع في IoT الصناعي؟"
    },
    options: {
      fr: ["SMTP", "MQTT", "FTP", "POP3"],
      en: ["SMTP", "MQTT", "FTP", "POP3"],
      ar: ["SMTP", "MQTT", "FTP", "POP3"]
    },
    answer: 1
  },
  {
    question: {
      fr: "Qu'est-ce qu'un digital twin ?",
      en: "What is a digital twin?",
      ar: "ما هو digital twin؟"
    },
    options: {
      fr: ["Une replique numerique d'un actif physique", "Un robot collaboratif", "Un protocole reseau", "Un ERP industriel"],
      en: ["A virtual replica of a physical asset", "A collaborative robot", "A network protocol", "An industrial ERP"],
      ar: ["نسخة رقمية لأصل مادي", "روبوت تعاوني", "بروتوكول شبكي", "ERP صناعي"]
    },
    answer: 0
  },
  {
    question: {
      fr: "L'objectif principal du lean manufacturing est de...",
      en: "The main goal of lean manufacturing is to...",
      ar: "الهدف الرئيسي من lean manufacturing هو..."
    },
    options: {
      fr: ["Multiplier les stocks", "Eliminer les gaspillages", "Rendre les machines plus lourdes", "Supprimer la qualite"],
      en: ["Increase inventory", "Eliminate waste", "Make machines heavier", "Remove quality checks"],
      ar: ["رفع المخزون", "إزالة الهدر", "جعل الآلات أثقل", "إلغاء الجودة"]
    },
    answer: 1
  },
  {
    question: {
      fr: "SCADA est surtout utilise pour...",
      en: "SCADA is mainly used to...",
      ar: "يستعمل SCADA أساسا من أجل..."
    },
    options: {
      fr: ["Piloter et superviser des procedes", "Concevoir des pieces en 3D", "Gerer les RH", "Compresser des fichiers"],
      en: ["Monitor and supervise processes", "Design 3D parts", "Manage HR data", "Compress files"],
      ar: ["مراقبة وقيادة العمليات", "تصميم قطع ثلاثية الأبعاد", "تدبير الموارد البشرية", "ضغط الملفات"]
    },
    answer: 0
  },
  {
    question: {
      fr: "La maintenance predictive consiste a...",
      en: "Predictive maintenance aims to...",
      ar: "الصيانة التنبؤية تهدف إلى..."
    },
    options: {
      fr: ["Reparer apres panne", "Anticiper les pannes via la donnee", "Changer toutes les pieces chaque mois", "Ignorer les signaux faibles"],
      en: ["Repair after failure", "Anticipate failures through data", "Replace all parts monthly", "Ignore weak signals"],
      ar: ["الإصلاح بعد العطل", "توقع الأعطال عبر البيانات", "تغيير كل القطع شهريا", "تجاهل الإشارات المبكرة"]
    },
    answer: 1
  },
  {
    question: {
      fr: "Que mesure un KPI ?",
      en: "What does a KPI track?",
      ar: "ماذا يتابع KPI؟"
    },
    options: {
      fr: ["Une performance cle", "Le prix d'une machine", "Le nombre de pauses", "La couleur des produits"],
      en: ["A key performance metric", "The price of a machine", "The number of breaks", "The color of products"],
      ar: ["مؤشر أداء رئيسي", "ثمن آلة", "عدد فترات التوقف", "لون المنتجات"]
    },
    answer: 0
  },
  {
    question: {
      fr: "Un cobot est...",
      en: "A cobot is...",
      ar: "الـ cobot هو..."
    },
    options: {
      fr: ["Un robot collaboratif", "Un logiciel comptable", "Une base de donnees", "Un type de capteur thermique"],
      en: ["A collaborative robot", "An accounting app", "A database", "A thermal sensor type"],
      ar: ["روبوت تعاوني", "تطبيق محاسبة", "قاعدة بيانات", "نوع من الحساسات الحرارية"]
    },
    answer: 0
  },
  {
    question: {
      fr: "L'ERP sert principalement a...",
      en: "An ERP is mainly used to...",
      ar: "يستعمل ERP أساسا من أجل..."
    },
    options: {
      fr: ["Gerer les ressources et processus de l'entreprise", "Piloter un drone", "Dessiner un prototype mecanique", "Regler un automate"],
      en: ["Manage enterprise resources and processes", "Fly a drone", "Draw a mechanical prototype", "Tune a PLC"],
      ar: ["تدبير موارد وعمليات المؤسسة", "قيادة درون", "رسم نموذج ميكانيكي", "ضبط PLC"]
    },
    answer: 0
  },
  {
    question: {
      fr: "La blockchain dans la supply chain aide surtout a...",
      en: "Blockchain in supply chains mainly helps to...",
      ar: "تساعد blockchain في supply chain أساسا على..."
    },
    options: {
      fr: ["Ameliorer la tracabilite", "Peindre les robots", "Refroidir les serveurs", "Remplacer tous les fournisseurs"],
      en: ["Improve traceability", "Paint robots", "Cool servers", "Replace all suppliers"],
      ar: ["تحسين التتبع", "طلاء الروبوتات", "تبريد الخوادم", "تعويض جميع الموردين"]
    },
    answer: 0
  }
];

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    start: string;
    leaderboard: string;
    noLeaderboard: string;
    unavailable: string;
    back: string;
    next: string;
    results: string;
    retry: string;
    playAgain: string;
    questionOf: (current: number, total: number) => string;
    scoreLabel: string;
    rankLabel: string;
  }
> = {
  fr: {
    badge: "Mini jeu",
    title: "Industry 4.0 Quiz",
    subtitle: "Un quiz rapide pour tester ta culture industrie, IoT, lean et automatisation.",
    start: "Commencer",
    leaderboard: "Classement",
    noLeaderboard: "Aucun score enregistre pour le moment.",
    unavailable: "Le classement sera disponible une fois Neon configure avec la migration portail.",
    back: "Retour",
    next: "Question suivante",
    results: "Voir mon resultat",
    retry: "Rejouer",
    playAgain: "Nouvelle partie",
    questionOf: (current, total) => `Question ${current} / ${total}`,
    scoreLabel: "Score",
    rankLabel: "Top candidats"
  },
  en: {
    badge: "Mini game",
    title: "Industry 4.0 Quiz",
    subtitle: "A quick challenge to test your industrial, IoT, lean, and automation knowledge.",
    start: "Start quiz",
    leaderboard: "Leaderboard",
    noLeaderboard: "No scores recorded yet.",
    unavailable: "Leaderboard will be available once Neon is configured with the portal migration.",
    back: "Back",
    next: "Next question",
    results: "See results",
    retry: "Retry",
    playAgain: "New run",
    questionOf: (current, total) => `Question ${current} / ${total}`,
    scoreLabel: "Score",
    rankLabel: "Top applicants"
  },
  ar: {
    badge: "لعبة مصغرة",
    title: "اختبار Industry 4.0",
    subtitle: "اختبار سريع لقياس معرفتك بالصناعة وIoT وlean والأتمتة.",
    start: "ابدأ الاختبار",
    leaderboard: "الترتيب",
    noLeaderboard: "لا توجد نتائج مسجلة حاليا.",
    unavailable: "سيظهر الترتيب بعد تفعيل Neon وتشغيل migration الخاصة بالبوابة.",
    back: "رجوع",
    next: "السؤال التالي",
    results: "عرض النتيجة",
    retry: "إعادة المحاولة",
    playAgain: "محاولة جديدة",
    questionOf: (current, total) => `السؤال ${current} / ${total}`,
    scoreLabel: "النتيجة",
    rankLabel: "أفضل المترشحين"
  }
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function IndustryQuizGame({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale];
  const [phase, setPhase] = useState<Phase>("intro");
  const accent = "#10b981";
  const [deckSeed, setDeckSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardDisabled, setLeaderboardDisabled] = useState(false);
  const [leaderboardMessage, setLeaderboardMessage] = useState<string | null>(null);

  const questions = useMemo(() => shuffle(QUESTIONS).slice(0, 8), [deckSeed]);
  const currentQuestion = questions[index];
  const percentage = Math.round((score / questions.length) * 100);

  async function openLeaderboard() {
    try {
      const response = await fetch("/api/application/games/leaderboard");
      const payload = (await response.json().catch(() => null)) as
        | { leaderboard?: LeaderboardEntry[]; disabled?: boolean; reason?: string; error?: { message?: string } }
        | null;

      if (!response.ok && response.status !== 200) {
        throw new Error(payload?.error?.message || copy.unavailable);
      }

      setLeaderboard(payload?.leaderboard ?? []);
      setLeaderboardDisabled(Boolean(payload?.disabled));
      setLeaderboardMessage(payload?.reason || null);
      setPhase("leaderboard");
    } catch (error) {
      setLeaderboard([]);
      setLeaderboardDisabled(true);
      setLeaderboardMessage(error instanceof Error ? error.message : copy.unavailable);
      setPhase("leaderboard");
    }
  }

  async function finishGame() {
    const finalScore = selected === currentQuestion.answer ? score + 1 : score;
    setScore(finalScore);
    setPhase("result");

    try {
      await fetch("/api/application/games/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          score: finalScore,
          total: questions.length
        })
      });
    } catch {
      // Score persistence is best effort for this mini-game.
    }
  }

  function answer(optionIndex: number) {
    if (answered) {
      return;
    }

    setSelected(optionIndex);
    setAnswered(true);

    if (optionIndex === currentQuestion.answer) {
      setScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    if (index === questions.length - 1) {
      void finishGame();
      return;
    }

    setIndex((current) => current + 1);
    setSelected(null);
    setAnswered(false);
  }

  function resetGame() {
    setDeckSeed((current) => current + 1);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <button
        type="button"
        onClick={() => setPhase("playing")}
        className="group relative block w-full overflow-hidden rounded-[18px] border border-edge/55 bg-panel/88 p-6 text-left shadow-xl transition duration-300 hover:-translate-y-1 hover:border-edge hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel liquid-card"
        style={{ backgroundImage: `linear-gradient(140deg, ${accent}18, ${accent}06)` }}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 30% 16%, ${accent}28, transparent 42%)` }}
        />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ border: `1px solid ${accent}50`, color: accent, backgroundColor: `${accent}12` }}
            >
              {copy.badge}
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/55">↗</span>
          </div>
          <p className="font-display text-[22px] uppercase leading-tight text-ink">{copy.title}</p>
          <p className="text-sm text-ink/76">{copy.subtitle}</p>
          <div className="mt-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
            <span className="h-[1px] w-7 bg-current opacity-40" />
            {copy.start} · QUIZ
          </div>
        </div>
      </button>
    );
  }

  if (phase === "leaderboard") {
    return (
      <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="badge-line">{copy.rankLabel}</p>
            <h2 className="mt-4 font-display text-4xl font-semibold uppercase text-ink">{copy.leaderboard}</h2>
          </div>
          <button
            type="button"
            onClick={() => setPhase("intro")}
            className="rounded-full border border-edge/70 bg-panel/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink/72 transition hover:border-accent hover:text-accent"
          >
            {copy.back}
          </button>
        </div>

        {leaderboardDisabled ? (
          <p className="mt-6 rounded-2xl border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-ink/78">
            {leaderboardMessage || copy.unavailable}
          </p>
        ) : null}

        {!leaderboardDisabled && leaderboard.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-edge/45 bg-panel/60 px-4 py-3 text-sm text-ink/68">
            {copy.noLeaderboard}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          {leaderboard.map((entry, position) => (
            <div key={entry.id} className="rounded-3xl border border-edge/45 bg-panel/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/42">
                    #{position + 1}
                  </p>
                  <p className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
                    {entry.userName}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-display text-4xl font-semibold uppercase text-accent">
                    {entry.percentage}%
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-ink/42">
                    {entry.score}/{entry.total}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (phase === "result") {
    return (
      <article className="glass-card p-6 text-center sm:p-10" dir={locale === "ar" ? "rtl" : "ltr"}>
        <p className="badge-line">{copy.scoreLabel}</p>
        <h2 className="mt-5 font-display text-6xl font-semibold uppercase text-accent">{percentage}%</h2>
        <p className="mt-3 text-lg text-ink/72">
          {score}/{questions.length}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={resetGame}
            className="rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
          >
            {copy.playAgain}
          </button>
          <button
            type="button"
            onClick={() => void openLeaderboard()}
            className="rounded-full border border-edge/70 bg-panel/75 px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
          >
            {copy.leaderboard}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="glass-card p-6 sm:p-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="badge-line">{copy.questionOf(index + 1, questions.length)}</p>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/45">
          {copy.scoreLabel} {score}
        </p>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-edge/20">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="mt-8 font-display text-4xl font-semibold uppercase text-ink">{currentQuestion.question[locale]}</h2>

      <div className="mt-6 space-y-3">
        {currentQuestion.options[locale].map((option, optionIndex) => {
          const isCorrect = answered && optionIndex === currentQuestion.answer;
          const isWrong = answered && optionIndex === selected && optionIndex !== currentQuestion.answer;

          return (
            <button
              key={`${option}-${optionIndex}`}
              type="button"
              onClick={() => answer(optionIndex)}
              disabled={answered}
              className={`w-full rounded-3xl border px-5 py-4 text-start text-sm transition sm:text-base ${
                isCorrect
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                  : isWrong
                    ? "border-rose/40 bg-rose/10 text-rose"
                    : "border-edge/45 bg-panel/65 text-ink/78 hover:border-accent hover:bg-panel"
              }`}
            >
              <span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-current/25 text-xs font-semibold uppercase tracking-[0.14em]">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {answered ? (
        <button
          type="button"
          onClick={() => nextQuestion()}
          className="mt-6 rounded-full border border-transparent bg-accent px-6 py-4 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
        >
          {index === questions.length - 1 ? copy.results : copy.next}
        </button>
      ) : null}
    </article>
  );
}
