"use client";

import { useMemo, useRef, useState } from "react";
import type { SiteLocale } from "@/config/locales";

type QuizLocale = SiteLocale;
type QuizPhase = "intro" | "identity" | "quiz" | "review" | "done";
type QuizBranch = "GESI" | "MECA" | "MECATRONIQUE" | "GI";
type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface QuizQuestion {
  done: false;
  question: string;
  options: string[];
}

interface QuizResult {
  done: true;
  branch: QuizBranch;
  profile: string;
  description: string;
  tagline: string;
  why: string;
}

interface QuizHistoryEntry {
  q: string;
  a: string;
}

interface QuizCopy {
  badge: string;
  title: string;
  subtitle: string;
  introBody: string;
  startLabel: string;
  identityTitle: string;
  identitySubtitle: string;
  firstName: string;
  lastName: string;
  identityError: string;
  continueLabel: string;
  questionOf: (n: number) => string;
  thinking: string;
  freeHint: string;
  freePlaceholder: string;
  sendLabel: string;
  profileHeading: string;
  branchHeading: string;
  whyHeading: string;
  historyHeading: string;
  reviewHeading: string;
  reviewPlaceholder: string;
  submitLabel: string;
  saving: string;
  doneTitle: string;
  doneSubtitle: string;
  restartLabel: string;
  aiError: string;
  saveError: string;
  sideTitle: string;
  sideSubtitle: string;
  tracksTitle: string;
  tipsTitle: string;
  tipList: string[];
  namesByBranch: Record<QuizBranch, string>;
}

const COPY: Record<QuizLocale, QuizCopy> = {
  fr: {
    badge: "ENSA Fes · Orientation intelligente",
    title: "Quel ingenieur es-tu ?",
    subtitle: "5 questions adaptatives pour trouver la filiere qui correspond a ton profil.",
    introBody:
      "Ce quiz combine personnalite, motivation et style de decision pour proposer une orientation GESI, MECA, MECATRONIQUE ou GI.",
    startLabel: "Commencer le quiz",
    identityTitle: "Avant de commencer",
    identitySubtitle: "Tes informations servent uniquement a personnaliser le resultat et l'enregistrement.",
    firstName: "Prenom",
    lastName: "Nom",
    identityError: "Merci de renseigner le prenom et le nom.",
    continueLabel: "Continuer",
    questionOf: (n) => `Question ${n} / 5`,
    thinking: "Analyse en cours...",
    freeHint: "Autre reponse",
    freePlaceholder: "Ecris ta reponse ici...",
    sendLabel: "Envoyer",
    profileHeading: "Profil detecte",
    branchHeading: "Filiere recommandee",
    whyHeading: "Pourquoi cette filiere ?",
    historyHeading: "Ton parcours de reponses",
    reviewHeading: "Comment evalues-tu ce quiz ?",
    reviewPlaceholder: "Ajoute un commentaire (optionnel)",
    submitLabel: "Valider et enregistrer",
    saving: "Enregistrement...",
    doneTitle: "Resultat enregistre",
    doneSubtitle: "Merci pour ta participation. Tu peux relancer le quiz quand tu veux.",
    restartLabel: "Recommencer",
    aiError: "Le service IA est temporairement indisponible. Reessaie dans un instant.",
    saveError: "Impossible d'enregistrer maintenant. Verifie la connexion puis reessaie.",
    sideTitle: "Quiz orientation",
    sideSubtitle: "Concu pour les etudiants CP de l'ENSA Fes (Departement Genie Industriel).",
    tracksTitle: "Filieres couvertes",
    tipsTitle: "Comment repondre",
    tipList: [
      "Choisis l'option qui te ressemble le plus, pas celle qui semble la plus populaire.",
      "Tu peux ecrire une reponse personnalisee a chaque question.",
      "Le resultat final est base sur l'ensemble des 5 reponses."
    ],
    namesByBranch: {
      GESI: "Genie Energetique et Systemes Intelligents",
      MECA: "Genie Mecanique",
      MECATRONIQUE: "Genie Mecatronique",
      GI: "Genie Industriel"
    }
  },
  en: {
    badge: "ENSA Fes · Smart orientation",
    title: "What kind of engineer are you?",
    subtitle: "5 adaptive questions to identify the branch that fits your profile.",
    introBody:
      "This quiz combines personality, motivation, and decision style to recommend GESI, MECA, MECATRONIQUE, or GI.",
    startLabel: "Start quiz",
    identityTitle: "Before we start",
    identitySubtitle: "Your identity is used only to personalize your result and optional save.",
    firstName: "First name",
    lastName: "Last name",
    identityError: "Please enter both first and last name.",
    continueLabel: "Continue",
    questionOf: (n) => `Question ${n} / 5`,
    thinking: "Thinking...",
    freeHint: "Other answer",
    freePlaceholder: "Write your answer...",
    sendLabel: "Send",
    profileHeading: "Detected profile",
    branchHeading: "Recommended branch",
    whyHeading: "Why this branch?",
    historyHeading: "Your answer journey",
    reviewHeading: "How do you rate this quiz?",
    reviewPlaceholder: "Add a comment (optional)",
    submitLabel: "Submit and save",
    saving: "Saving...",
    doneTitle: "Saved successfully",
    doneSubtitle: "Thanks for participating. You can run the quiz again any time.",
    restartLabel: "Restart",
    aiError: "AI service is temporarily unavailable. Please try again shortly.",
    saveError: "Could not save now. Check connection and try again.",
    sideTitle: "Orientation quiz",
    sideSubtitle: "Built for ENSA Fes CP students (Industrial Engineering Department).",
    tracksTitle: "Covered branches",
    tipsTitle: "How to answer",
    tipList: [
      "Pick the option that reflects you best, not the most expected one.",
      "You can always provide your own custom answer.",
      "Final recommendation is based on all 5 answers together."
    ],
    namesByBranch: {
      GESI: "Energy Engineering & Intelligent Systems",
      MECA: "Mechanical Engineering",
      MECATRONIQUE: "Mechatronics Engineering",
      GI: "Industrial Engineering"
    }
  },
  ar: {
    badge: "ENSA فاس · توجيه ذكي",
    title: "اي نوع من المهندسين انت؟",
    subtitle: "خمسة اسئلة تفاعلية لاختيار المسلك الانسب لشخصيتك.",
    introBody: "يعتمد هذا الاختبار على شخصيتك ودوافعك وطريقة تفكيرك لتوجيهك نحو المسلك المناسب.",
    startLabel: "ابدأ الاختبار",
    identityTitle: "قبل الانطلاق",
    identitySubtitle: "تستعمل هذه المعلومات فقط لتخصيص النتيجة وحفظها اختياريا.",
    firstName: "الاسم الشخصي",
    lastName: "الاسم العائلي",
    identityError: "يرجى ادخال الاسم الشخصي والعائلي.",
    continueLabel: "متابعة",
    questionOf: (n) => `السؤال ${n} / 5`,
    thinking: "جاري التحليل...",
    freeHint: "اجابة اخرى",
    freePlaceholder: "اكتب اجابتك هنا...",
    sendLabel: "ارسال",
    profileHeading: "الملف المكتشف",
    branchHeading: "المسلك المقترح",
    whyHeading: "لماذا هذا المسلك؟",
    historyHeading: "ملخص اجاباتك",
    reviewHeading: "ما تقييمك لهذا الاختبار؟",
    reviewPlaceholder: "اكتب ملاحظة (اختياري)",
    submitLabel: "تأكيد وحفظ",
    saving: "جاري الحفظ...",
    doneTitle: "تم الحفظ بنجاح",
    doneSubtitle: "شكرا لمشاركتك. يمكنك اعادة الاختبار في اي وقت.",
    restartLabel: "اعادة الاختبار",
    aiError: "خدمة الذكاء الاصطناعي غير متاحة حاليا. حاول لاحقا.",
    saveError: "تعذر حفظ البيانات الان. تحقق من الاتصال ثم اعد المحاولة.",
    sideTitle: "اختبار التوجيه",
    sideSubtitle: "موجه لطلبة الاقسام التحضيرية بمدرسة ENSA فاس (شعبة الهندسة الصناعية).",
    tracksTitle: "المسالك المعتمدة",
    tipsTitle: "طريقة الاجابة",
    tipList: [
      "اختر الجواب الاقرب الى شخصيتك وليس الجواب المتوقع.",
      "يمكنك كتابة جوابك الخاص في كل سؤال.",
      "النتيجة النهائية مبنية على مجموع الاجابات الخمس."
    ],
    namesByBranch: {
      GESI: "الهندسة الطاقية والانظمة الذكية",
      MECA: "الهندسة الميكانيكية",
      MECATRONIQUE: "الهندسة الميكاترونيكية",
      GI: "الهندسة الصناعية"
    }
  }
};

const START_PROMPT: Record<QuizLocale, string> = {
  fr: "Commence le quiz. Pose la premiere question.",
  en: "Start the quiz. Ask the first question.",
  ar: "ابدأ الاختبار واطرح السؤال الاول."
};

const OPTION_TOKENS: Record<QuizLocale, string[]> = {
  fr: ["A", "B", "C"],
  en: ["A", "B", "C"],
  ar: ["أ", "ب", "ج"]
};

const BRANCH_VISUALS: Record<QuizBranch, { icon: string; color: string; glow: string }> = {
  GESI: { icon: "⚡", color: "#2dd4bf", glow: "rgba(45, 212, 191, 0.22)" },
  MECA: { icon: "⚙", color: "#fb923c", glow: "rgba(251, 146, 60, 0.22)" },
  MECATRONIQUE: { icon: "🤖", color: "#c084fc", glow: "rgba(192, 132, 252, 0.24)" },
  GI: { icon: "📊", color: "#60a5fa", glow: "rgba(96, 165, 250, 0.24)" }
};

async function requestQuiz(messages: ChatMessage[], lang: QuizLocale): Promise<QuizQuestion | QuizResult> {
  const response = await fetch("/api/quiz/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, lang })
  });

  const payload = (await response.json().catch(() => null)) as
    | (QuizQuestion | QuizResult)
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload && typeof payload === "object" && "error" in payload ? payload.error || "Quiz failed" : "Quiz failed");
  }

  if (!payload || typeof payload !== "object" || !("done" in payload)) {
    throw new Error("Invalid quiz response");
  }

  return payload as QuizQuestion | QuizResult;
}

async function saveQuiz(payload: {
  firstName: string;
  lastName: string;
  lang: QuizLocale;
  branch: QuizBranch;
  profile: string;
  history: QuizHistoryEntry[];
  rating: number;
  comment: string;
}) {
  const response = await fetch("/api/quiz/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Save failed");
  }
}

interface OrientationQuizProps {
  locale: QuizLocale;
}

export function OrientationQuiz({ locale }: OrientationQuizProps) {
  const copy = COPY[locale];
  const isRtl = locale === "ar";

  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [freeText, setFreeText] = useState("");
  const [showFreeAnswer, setShowFreeAnswer] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const freeInputRef = useRef<HTMLTextAreaElement>(null);

  const accent = result ? BRANCH_VISUALS[result.branch].color : "#f97316";
  const glow = result ? BRANCH_VISUALS[result.branch].glow : "rgba(249, 115, 22, 0.2)";

  const trackRows = useMemo(
    () =>
      (Object.keys(BRANCH_VISUALS) as QuizBranch[]).map((branch) => ({
        branch,
        icon: BRANCH_VISUALS[branch].icon,
        color: BRANCH_VISUALS[branch].color,
        name: copy.namesByBranch[branch]
      })),
    [copy.namesByBranch]
  );

  const beginIdentity = () => {
    setError(null);
    setPhase("identity");
  };

  const startQuiz = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setNameError(true);
      return;
    }

    setNameError(false);
    setLoading(true);
    setError(null);
    setPhase("quiz");
    setHistory([]);
    setQuestionNumber(0);

    const initialMessages: ChatMessage[] = [{ role: "user", content: START_PROMPT[locale] }];

    try {
      const response = await requestQuiz(initialMessages, locale);
      setMessages(initialMessages);
      if (response.done) {
        setResult(response);
        setPhase("review");
      } else {
        setQuestion(response);
        setQuestionNumber(1);
      }
    } catch {
      setError(copy.aiError);
      setPhase("identity");
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (answerText: string) => {
    if (!question || !answerText.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    const nextHistory = [...history, { q: question.question, a: answerText }];
    const nextMessages: ChatMessage[] = [...messages, { role: "assistant", content: JSON.stringify(question) }, { role: "user", content: answerText }];

    try {
      const response = await requestQuiz(nextMessages, locale);
      setMessages(nextMessages);
      setHistory(nextHistory);
      setFreeText("");
      setShowFreeAnswer(false);
      if (response.done) {
        setResult(response);
        setPhase("review");
      } else {
        setQuestion(response);
        setQuestionNumber((prev) => prev + 1);
      }
    } catch {
      setError(copy.aiError);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!result) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveQuiz({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        lang: locale,
        branch: result.branch,
        profile: result.profile,
        history,
        rating,
        comment
      });
      setPhase("done");
    } catch {
      setError(copy.saveError);
    } finally {
      setSaving(false);
    }
  };

  const resetQuiz = () => {
    setPhase("intro");
    setFirstName("");
    setLastName("");
    setNameError(false);
    setMessages([]);
    setQuestion(null);
    setResult(null);
    setQuestionNumber(0);
    setHistory([]);
    setFreeText("");
    setShowFreeAnswer(false);
    setRating(0);
    setHoverRating(0);
    setComment("");
    setLoading(false);
    setSaving(false);
    setError(null);
  };

  return (
    <div className="quiz-shell" dir={isRtl ? "rtl" : "ltr"}>
      <style>{`
        .quiz-shell {
          --quiz-text-strong: rgba(31, 41, 55, 0.95);
          --quiz-text-muted: rgba(31, 41, 55, 0.82);
          --quiz-text-subtle: rgba(31, 41, 55, 0.62);
          --quiz-line: rgba(15, 23, 42, 0.15);
          --quiz-line-strong: rgba(249, 115, 22, 0.42);
          --quiz-card-bg: rgba(255, 255, 255, 0.66);
          --quiz-chip-bg: rgba(249, 115, 22, 0.12);
          --quiz-chip-border: rgba(249, 115, 22, 0.32);
          --quiz-row-hover: rgba(249, 115, 22, 0.1);
          --quiz-soft: rgba(248, 250, 252, 0.74);
        }

        html[data-theme="dark"] .quiz-shell {
          --quiz-text-strong: rgba(241, 245, 249, 0.92);
          --quiz-text-muted: rgba(241, 245, 249, 0.72);
          --quiz-text-subtle: rgba(241, 245, 249, 0.46);
          --quiz-line: rgba(241, 245, 249, 0.14);
          --quiz-line-strong: rgba(251, 146, 60, 0.38);
          --quiz-card-bg: rgba(12, 18, 30, 0.62);
          --quiz-chip-bg: rgba(251, 146, 60, 0.14);
          --quiz-chip-border: rgba(251, 146, 60, 0.36);
          --quiz-row-hover: rgba(251, 146, 60, 0.08);
          --quiz-soft: rgba(15, 23, 42, 0.5);
        }

        @keyframes quiz-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .quiz-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--quiz-line-strong);
          border-radius: 14px;
          background: linear-gradient(145deg, var(--quiz-card-bg), var(--quiz-soft));
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.14);
        }

        .quiz-panel {
          min-height: 640px;
        }

        .quiz-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--quiz-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--quiz-line) 1px, transparent 1px);
          background-size: 42px 42px;
          opacity: 0.6;
        }

        .quiz-chip {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--quiz-chip-border);
          background: var(--quiz-chip-bg);
          color: var(--quiz-text-strong);
          border-radius: 999px;
          padding: 6px 12px;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .quiz-progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--quiz-line);
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }

        .quiz-option {
          width: 100%;
          border: 1px solid var(--quiz-line);
          border-radius: 14px;
          padding: 14px;
          background: transparent;
          color: var(--quiz-text-strong);
          text-align: start;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
        }

        .quiz-option:hover {
          border-color: var(--quiz-line-strong);
          background: var(--quiz-row-hover);
          transform: translateX(4px);
        }

        [data-locale-dir="rtl"] .quiz-option:hover {
          transform: translateX(-4px);
        }

        .quiz-input,
        .quiz-textarea {
          width: 100%;
          border: 1px solid var(--quiz-line);
          border-radius: 12px;
          padding: 12px 14px;
          background: transparent;
          color: var(--quiz-text-strong);
          font-family: var(--font-body), sans-serif;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .quiz-input::placeholder,
        .quiz-textarea::placeholder {
          color: var(--quiz-text-subtle);
        }

        .quiz-input:focus,
        .quiz-textarea:focus {
          outline: none;
          border-color: var(--quiz-line-strong);
          background: rgba(249, 115, 22, 0.04);
        }

        .quiz-primary {
          border-radius: 12px;
          border: 1px solid transparent;
          color: #111827;
          font-family: var(--font-display), sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 18px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .quiz-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .quiz-primary:not(:disabled):hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="quiz-card quiz-panel p-6 sm:p-8">
          <div className="relative z-[1]">
            <span className="quiz-chip">{copy.badge}</span>
            <h2 className="mt-4 font-display text-[clamp(30px,4.1vw,48px)] font-semibold uppercase leading-tight" style={{ color: "var(--quiz-text-strong)" }}>
              {copy.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
              {copy.subtitle}
            </p>

            {error ? (
              <p className="mt-4 rounded border px-3 py-2 text-sm" style={{ borderColor: "rgba(239, 68, 68, 0.45)", color: "#ef4444", background: "rgba(239, 68, 68, 0.08)" }}>
                {error}
              </p>
            ) : null}

            {phase === "intro" ? (
              <div className="mt-8 space-y-6">
                <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
                  {copy.introBody}
                </p>
                <button
                  type="button"
                  className="quiz-primary w-full sm:w-auto"
                  onClick={beginIdentity}
                  style={{ background: accent, boxShadow: `0 12px 28px ${glow}` }}
                >
                  {copy.startLabel}
                </button>
              </div>
            ) : null}

            {phase === "identity" ? (
              <div className="mt-8 max-w-xl space-y-4">
                <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--quiz-text-strong)" }}>
                  {copy.identityTitle}
                </h3>
                <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
                  {copy.identitySubtitle}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="quiz-input"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder={copy.firstName}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        void startQuiz();
                      }
                    }}
                  />
                  <input
                    className="quiz-input"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder={copy.lastName}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        void startQuiz();
                      }
                    }}
                  />
                </div>
                {nameError ? <p className="text-sm text-red-500">{copy.identityError}</p> : null}
                <button
                  type="button"
                  className="quiz-primary w-full sm:w-auto"
                  onClick={() => void startQuiz()}
                  style={{ background: accent, boxShadow: `0 12px 28px ${glow}` }}
                >
                  {copy.continueLabel}
                </button>
              </div>
            ) : null}

            {phase === "quiz" ? (
              <div className="mt-8">
                <div className="mb-6 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((item) => {
                    const active = item === questionNumber;
                    const past = item < questionNumber;
                    return (
                      <span
                        key={item}
                        className="quiz-progress-dot"
                        style={{
                          background: active || past ? accent : "var(--quiz-line)",
                          transform: active ? "scale(1.35)" : "scale(1)",
                          boxShadow: active ? `0 0 12px ${glow}` : "none"
                        }}
                      />
                    );
                  })}
                </div>

                {loading ? (
                  <div className="flex min-h-64 flex-col items-center justify-center gap-4">
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        border: "3px solid var(--quiz-line)",
                        borderTopColor: accent,
                        animation: "quiz-spin .85s linear infinite"
                      }}
                    />
                    <p className="text-sm" style={{ color: "var(--quiz-text-subtle)" }}>
                      {copy.thinking}
                    </p>
                  </div>
                ) : question ? (
                  <>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                      {copy.questionOf(questionNumber)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-relaxed sm:text-2xl" style={{ color: "var(--quiz-text-strong)" }}>
                      {question.question}
                    </h3>

                    <div className="mt-5 space-y-2.5">
                      {question.options.map((option, index) => (
                        <button key={`${option}-${index}`} type="button" className="quiz-option" onClick={() => void answerQuestion(option)}>
                          <span className="flex items-start gap-3">
                            <span
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                              style={{ background: `${accent}1a`, color: accent }}
                            >
                              {OPTION_TOKENS[locale][index] ?? `${index + 1}`}
                            </span>
                            <span className="pt-0.5 text-sm sm:text-base">{option}</span>
                          </span>
                        </button>
                      ))}

                      {!showFreeAnswer ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowFreeAnswer(true);
                            window.setTimeout(() => freeInputRef.current?.focus(), 80);
                          }}
                          className="w-full rounded-xl border border-dashed px-4 py-3 text-start text-sm transition hover:bg-white/5"
                          style={{ borderColor: "var(--quiz-line)", color: "var(--quiz-text-subtle)" }}
                        >
                          {copy.freeHint}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            ref={freeInputRef}
                            className="quiz-textarea"
                            rows={3}
                            value={freeText}
                            onChange={(event) => setFreeText(event.target.value)}
                            placeholder={copy.freePlaceholder}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                void answerQuestion(freeText);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="quiz-primary w-full sm:w-auto"
                            disabled={!freeText.trim()}
                            onClick={() => void answerQuestion(freeText)}
                            style={{ background: accent, boxShadow: `0 10px 24px ${glow}` }}
                          >
                            {copy.sendLabel}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {phase === "review" && result ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--quiz-line-strong)", background: "var(--quiz-row-hover)" }}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{BRANCH_VISUALS[result.branch].icon}</span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                        {copy.profileHeading}
                      </p>
                      <h3 className="font-display text-3xl font-semibold uppercase leading-none" style={{ color: accent }}>
                        {result.profile}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
                    {result.description}
                  </p>
                  <p className="mt-2 text-sm italic sm:text-base" style={{ color: accent }}>
                    “{result.tagline}”
                  </p>
                </div>

                <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--quiz-line)" }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                    {copy.branchHeading}
                  </p>
                  <p className="mt-1 text-lg font-semibold sm:text-xl" style={{ color: "var(--quiz-text-strong)" }}>
                    {copy.namesByBranch[result.branch]}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                    {copy.whyHeading}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
                    {result.why}
                  </p>
                </div>

                <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--quiz-line)" }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                    {copy.historyHeading}
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {history.map((item, index) => (
                      <div key={`${item.q}-${index}`} className="rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--quiz-line)", background: "var(--quiz-soft)" }}>
                        <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--quiz-text-subtle)" }}>
                          Q{index + 1}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--quiz-text-muted)" }}>
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--quiz-line)" }}>
                  <p className="text-sm sm:text-base" style={{ color: "var(--quiz-text-strong)" }}>
                    {copy.reviewHeading}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const active = value <= (hoverRating || rating);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHoverRating(value)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="rounded p-1"
                          style={{ color: active ? "#facc15" : "var(--quiz-line)", fontSize: 30, lineHeight: 1 }}
                          aria-label={`Rate ${value}`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    rows={3}
                    className="quiz-textarea mt-2"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder={copy.reviewPlaceholder}
                  />
                </div>

                <button
                  type="button"
                  className="quiz-primary w-full sm:w-auto"
                  disabled={saving}
                  onClick={() => void submitReview()}
                  style={{ background: accent, boxShadow: `0 12px 28px ${glow}` }}
                >
                  {saving ? copy.saving : copy.submitLabel}
                </button>
              </div>
            ) : null}

            {phase === "done" ? (
              <div className="mt-8 rounded-2xl border p-5 text-center sm:p-6" style={{ borderColor: "var(--quiz-line-strong)", background: "var(--quiz-row-hover)" }}>
                <p className="text-5xl">✓</p>
                <h3 className="mt-3 font-display text-3xl font-semibold uppercase" style={{ color: accent }}>
                  {copy.doneTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
                  {copy.doneSubtitle}
                </p>
                <button
                  type="button"
                  className="quiz-primary mt-5 w-full sm:w-auto"
                  onClick={resetQuiz}
                  style={{ background: accent, boxShadow: `0 12px 28px ${glow}` }}
                >
                  {copy.restartLabel}
                </button>
              </div>
            ) : null}
          </div>
        </article>

        <aside className="quiz-card p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                {copy.sideTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed sm:text-base" style={{ color: "var(--quiz-text-muted)" }}>
                {copy.sideSubtitle}
              </p>
            </div>

            <div>
              <h3 className="font-display text-3xl font-semibold uppercase leading-none" style={{ color: "var(--quiz-text-strong)" }}>
                {copy.tracksTitle}
              </h3>
              <div className="mt-3 space-y-2.5">
                {trackRows.map((row) => (
                  <div
                    key={row.branch}
                    className="flex items-center gap-3 rounded-xl border px-3 py-3 transition"
                    style={{ borderColor: "var(--quiz-line)", background: result?.branch === row.branch ? `${row.color}1a` : "transparent" }}
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-lg"
                      style={{ background: `${row.color}20`, color: row.color, boxShadow: result?.branch === row.branch ? `0 0 14px ${row.color}55` : "none" }}
                    >
                      {row.icon}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: row.color }}>
                        {row.branch}
                      </p>
                      <p className="text-sm leading-snug" style={{ color: "var(--quiz-text-muted)" }}>
                        {row.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-4" style={{ borderColor: "var(--quiz-line)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                {copy.tipsTitle}
              </p>
              <ul className="mt-3 space-y-2">
                {copy.tipList.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "var(--quiz-text-muted)" }}>
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
