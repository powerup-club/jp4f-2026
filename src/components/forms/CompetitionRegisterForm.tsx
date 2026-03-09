"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteLocale } from "@/config/locales";

type ParticipationType = "individual" | "team";
type TeamMember = { name: string; email: string };
type ErrorKey =
  | "fullName"
  | "email"
  | "phone"
  | "university"
  | "branch"
  | "yearOfStudy"
  | "teamName"
  | "projectTitle"
  | "projectDomain"
  | "projectDesc"
  | "innovation"
  | "demoFormat";
type FormErrors = Partial<Record<ErrorKey, string>>;

interface Copy {
  title: string;
  subtitle: string;
  badge: string;
  deadline: string;
  stepWord: string;
  steps: [string, string, string, string, string];
  modeTitle: string;
  individual: string;
  team: string;
  individualDesc: string;
  teamDesc: string;
  participantTitle: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  branch: string;
  yearOfStudy: string;
  yearOptions: string[];
  linkedin: string;
  teamTitle: string;
  teamName: string;
  teamHint: string;
  memberLabel: (index: number) => string;
  memberName: string;
  memberEmail: string;
  projectTitle: string;
  projectName: string;
  projectDomain: string;
  projectDomains: string[];
  projectDesc: string;
  innovation: string;
  demoFormat: string;
  demoFormats: string[];
  heardFrom: string;
  heardFromOptions: string[];
  fileTitle: string;
  fileSubtitle: string;
  fileChoose: string;
  fileSelected: string;
  fileOptional: string;
  removeFile: string;
  next: string;
  back: string;
  submit: string;
  submitting: string;
  restart: string;
  required: string;
  invalidEmail: string;
  descriptionMin: string;
  fileTooLarge: string;
  fileType: string;
  submitError: string;
  skippedSave: string;
  doneTitle: string;
  doneSubtitle: string;
}

const COPY: Record<SiteLocale, Copy> = {
  fr: {
    title: "Formulaire De Candidature",
    subtitle: "Version integree au site JESI, compatible mode clair/sombre.",
    badge: "JESI 2025 · INNOV'DOM",
    deadline: "Date limite: 15 avril 2025",
    stepWord: "Etape",
    steps: ["Mode", "Participant", "Equipe", "Projet", "Fichier"],
    modeTitle: "Mode de participation",
    individual: "Individuel",
    team: "Equipe",
    individualDesc: "Je participe seul avec mon projet.",
    teamDesc: "Nous participons en equipe (2 a 4 membres).",
    participantTitle: "Informations du participant",
    fullName: "Nom complet *",
    email: "Email *",
    phone: "Telephone *",
    university: "Universite / Ecole *",
    branch: "Filiere / Specialite *",
    yearOfStudy: "Niveau d'etudes *",
    yearOptions: [
      "Bac+1 / CP1",
      "Bac+2 / CP2",
      "Bac+3",
      "Bac+4 / 1ere annee cycle ingenieur",
      "Bac+5 / 2eme annee cycle ingenieur",
      "Bac+5+ / Master / Doctorat",
      "Chercheur / Professionnel"
    ],
    linkedin: "LinkedIn (optionnel)",
    teamTitle: "Informations equipe",
    teamName: "Nom de l'equipe *",
    teamHint: "Ajoute les autres membres (optionnel).",
    memberLabel: (index) => `Membre ${index}`,
    memberName: "Nom complet",
    memberEmail: "Email",
    projectTitle: "Presentation du projet",
    projectName: "Titre du projet *",
    projectDomain: "Domaine *",
    projectDomains: [
      "Habitat intelligent / Domotique",
      "Gestion energetique",
      "Mobilite & Transport",
      "Digitalisation & IA",
      "Environnement & Durabilite",
      "Sante & Bien-etre",
      "Agriculture intelligente",
      "Autre"
    ],
    projectDesc: "Description du projet * (100 caracteres min)",
    innovation: "Valeur ajoutee & Innovation *",
    demoFormat: "Format de presentation prevu *",
    demoFormats: [
      "Pitch oral (5-10 min) + diaporama",
      "Prototype fonctionnel",
      "Demonstration en realite augmentee",
      "Application interactive",
      "Video de demonstration",
      "Combinaison de plusieurs formats"
    ],
    heardFrom: "Comment as-tu entendu parler de la competition ?",
    heardFromOptions: ["Reseaux sociaux", "Affiche / flyer", "Bouche a oreille", "Professeur / encadrant", "Site ENSA Fes", "Autre"],
    fileTitle: "Document de candidature",
    fileSubtitle: "CV ou resume projet (PDF recommande, max 5 MB).",
    fileChoose: "Choisir un fichier",
    fileSelected: "Fichier selectionne:",
    fileOptional: "Optionnel: envoi possible sans fichier.",
    removeFile: "Supprimer",
    next: "Continuer",
    back: "Retour",
    submit: "Soumettre la candidature",
    submitting: "Envoi en cours...",
    restart: "Nouvelle inscription",
    required: "Ce champ est obligatoire",
    invalidEmail: "Email invalide",
    descriptionMin: "Minimum 100 caracteres",
    fileTooLarge: "Fichier trop volumineux (max 5 MB)",
    fileType: "Formats acceptes: PDF, DOC, DOCX, PPT, PPTX",
    submitError: "Impossible d'envoyer la candidature pour le moment.",
    skippedSave: "Aucune URL de sauvegarde configuree (GOOGLE_SCRIPT_URL_REGISTER / GOOGLE_SCRIPT_URL).",
    doneTitle: "Candidature recue",
    doneSubtitle: "Merci. Ta candidature a ete enregistree."
  },
  en: {
    title: "Challenge Registration",
    subtitle: "Native page integrated in the JESI website with light/dark support.",
    badge: "JESI 2025 · INNOV'DOM",
    deadline: "Deadline: April 15, 2025",
    stepWord: "Step",
    steps: ["Mode", "Participant", "Team", "Project", "File"],
    modeTitle: "Participation mode",
    individual: "Individual",
    team: "Team",
    individualDesc: "I apply alone with my own project.",
    teamDesc: "We apply as a team (2 to 4 members).",
    participantTitle: "Participant information",
    fullName: "Full name *",
    email: "Email *",
    phone: "Phone *",
    university: "University / School *",
    branch: "Branch / Speciality *",
    yearOfStudy: "Year of study *",
    yearOptions: [
      "Bac+1 / Prep Year 1",
      "Bac+2 / Prep Year 2",
      "Bac+3",
      "Bac+4 / Engineering Year 1",
      "Bac+5 / Engineering Year 2",
      "Bac+5+ / Master / PhD",
      "Researcher / Professional"
    ],
    linkedin: "LinkedIn (optional)",
    teamTitle: "Team information",
    teamName: "Team name *",
    teamHint: "Add other members (optional).",
    memberLabel: (index) => `Member ${index}`,
    memberName: "Full name",
    memberEmail: "Email",
    projectTitle: "Project details",
    projectName: "Project title *",
    projectDomain: "Domain *",
    projectDomains: [
      "Smart Home / Home Automation",
      "Energy Management",
      "Mobility & Transport",
      "Digitalization & AI",
      "Environment & Sustainability",
      "Health & Wellbeing",
      "Smart Agriculture",
      "Other"
    ],
    projectDesc: "Project description * (minimum 100 characters)",
    innovation: "Added value & Innovation *",
    demoFormat: "Planned presentation format *",
    demoFormats: [
      "Oral pitch (5-10 min) + slides",
      "Functional prototype",
      "Augmented reality demonstration",
      "Interactive application",
      "Demo video",
      "Combination of formats"
    ],
    heardFrom: "How did you hear about this competition?",
    heardFromOptions: ["Social media", "Poster / flyer", "Word of mouth", "Teacher / supervisor", "ENSA Fes website", "Other"],
    fileTitle: "Application document",
    fileSubtitle: "Upload CV or project summary (PDF recommended, max 5 MB).",
    fileChoose: "Choose a file",
    fileSelected: "Selected file:",
    fileOptional: "Optional: you can submit without a file.",
    removeFile: "Remove",
    next: "Continue",
    back: "Back",
    submit: "Submit application",
    submitting: "Submitting...",
    restart: "New registration",
    required: "This field is required",
    invalidEmail: "Invalid email address",
    descriptionMin: "Minimum 100 characters",
    fileTooLarge: "File too large (max 5 MB)",
    fileType: "Accepted formats: PDF, DOC, DOCX, PPT, PPTX",
    submitError: "Could not submit the application right now.",
    skippedSave: "No save URL configured (GOOGLE_SCRIPT_URL_REGISTER / GOOGLE_SCRIPT_URL).",
    doneTitle: "Application received",
    doneSubtitle: "Thank you. Your application has been recorded."
  },
  ar: {
    title: "استمارة الترشح للتحدي",
    subtitle: "نسخة مدمجة داخل الموقع وتدعم تغيير الثيم.",
    badge: "JESI 2025 · INNOV'DOM",
    deadline: "آخر موعد: 15 أبريل 2025",
    stepWord: "المرحلة",
    steps: ["النمط", "المشارك", "الفريق", "المشروع", "الملف"],
    modeTitle: "نوع المشاركة",
    individual: "فردي",
    team: "فريق",
    individualDesc: "أشارك وحدي بمشروعي الخاص.",
    teamDesc: "نشارك كفريق (من 2 إلى 4 أعضاء).",
    participantTitle: "معلومات المشارك",
    fullName: "الاسم الكامل *",
    email: "البريد الإلكتروني *",
    phone: "الهاتف *",
    university: "الجامعة / المدرسة *",
    branch: "الشعبة / التخصص *",
    yearOfStudy: "المستوى الدراسي *",
    yearOptions: [
      "باك+1 / CP1",
      "باك+2 / CP2",
      "باك+3",
      "باك+4 / السنة الأولى هندسة",
      "باك+5 / السنة الثانية هندسة",
      "باك+5 وما فوق / ماستر / دكتوراه",
      "باحث / مهني"
    ],
    linkedin: "لينكدإن (اختياري)",
    teamTitle: "معلومات الفريق",
    teamName: "اسم الفريق *",
    teamHint: "أضف باقي الأعضاء (اختياري).",
    memberLabel: (index) => `العضو ${index}`,
    memberName: "الاسم الكامل",
    memberEmail: "البريد الإلكتروني",
    projectTitle: "تفاصيل المشروع",
    projectName: "عنوان المشروع *",
    projectDomain: "المجال *",
    projectDomains: [
      "المنزل الذكي / الدوموتيك",
      "تدبير الطاقة",
      "التنقل والنقل",
      "الرقمنة والذكاء الاصطناعي",
      "البيئة والاستدامة",
      "الصحة والرفاه",
      "الفلاحة الذكية",
      "أخرى"
    ],
    projectDesc: "وصف المشروع * (الحد الأدنى 100 حرف)",
    innovation: "القيمة المضافة والابتكار *",
    demoFormat: "طريقة العرض المتوقعة *",
    demoFormats: [
      "عرض شفهي (5-10 دقائق) مع شرائح",
      "نموذج أولي عملي",
      "عرض بالواقع المعزز",
      "تطبيق تفاعلي",
      "فيديو توضيحي",
      "مزيج من عدة صيغ"
    ],
    heardFrom: "كيف سمعت عن هذه المسابقة؟",
    heardFromOptions: ["وسائل التواصل الاجتماعي", "ملصق / منشور", "عن طريق المعارف", "أستاذ / مؤطر", "موقع ENSA Fes", "أخرى"],
    fileTitle: "وثيقة الترشح",
    fileSubtitle: "ارفع السيرة الذاتية أو ملخص المشروع (يفضل PDF، الحد الأقصى 5MB).",
    fileChoose: "اختيار ملف",
    fileSelected: "الملف المختار:",
    fileOptional: "اختياري: يمكنك الإرسال بدون ملف.",
    removeFile: "حذف",
    next: "متابعة",
    back: "رجوع",
    submit: "إرسال الترشح",
    submitting: "جارٍ الإرسال...",
    restart: "تسجيل جديد",
    required: "هذا الحقل مطلوب",
    invalidEmail: "البريد الإلكتروني غير صالح",
    descriptionMin: "الحد الأدنى 100 حرف",
    fileTooLarge: "حجم الملف كبير جدا (الحد الأقصى 5MB)",
    fileType: "الصيغ المقبولة: PDF, DOC, DOCX, PPT, PPTX",
    submitError: "تعذر إرسال الترشح حاليا.",
    skippedSave: "لا توجد URL للحفظ (GOOGLE_SCRIPT_URL_REGISTER / GOOGLE_SCRIPT_URL). تم قبول الإرسال محليا.",
    doneTitle: "تم استلام الترشح",
    doneSubtitle: "شكرا. تم تسجيل الترشح بنجاح."
  }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]);
const EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      resolve(raw.includes(",") ? raw.split(",")[1] : raw);
    };
    reader.onerror = () => reject(new Error("file-read-error"));
    reader.readAsDataURL(file);
  });
}

function isAcceptedFile(file: File): boolean {
  if (MIME_TYPES.has(file.type)) {
    return true;
  }
  const lower = file.name.toLowerCase();
  return EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface CompetitionRegisterFormProps {
  locale: SiteLocale;
  initialFullName?: string;
  initialEmail?: string;
}

export function CompetitionRegisterForm({
  locale,
  initialFullName = "",
  initialEmail = ""
}: CompetitionRegisterFormProps) {
  const copy = COPY[locale];
  const isRtl = locale === "ar";
  const defaultFullName = initialFullName.trim();
  const defaultEmail = initialEmail.trim().toLowerCase();

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<ParticipationType>("individual");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitNote, setSubmitNote] = useState<string | null>(null);

  const [fullName, setFullName] = useState(defaultFullName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [branch, setBranch] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "" },
    { name: "", email: "" },
    { name: "", email: "" }
  ]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDomain, setProjectDomain] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [innovation, setInnovation] = useState("");
  const [demoFormat, setDemoFormat] = useState("");
  const [heardFrom, setHeardFrom] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "individual" && step === 2) {
      setStep(1);
    }
  }, [mode, step]);

  const visibleStepIndexes = mode === "team" ? [0, 1, 2, 3, 4] : [0, 1, 3, 4];
  const visibleStep = visibleStepIndexes.indexOf(step);

  const validateStep = (target: number): boolean => {
    const nextErrors: FormErrors = {};

    if (target === 1) {
      if (!fullName.trim()) {
        nextErrors.fullName = copy.required;
      }
      if (!email.trim()) {
        nextErrors.email = copy.required;
      } else if (!EMAIL_REGEX.test(email.trim())) {
        nextErrors.email = copy.invalidEmail;
      }
      if (!phone.trim()) {
        nextErrors.phone = copy.required;
      }
      if (!university.trim()) {
        nextErrors.university = copy.required;
      }
      if (!branch.trim()) {
        nextErrors.branch = copy.required;
      }
      if (!yearOfStudy.trim()) {
        nextErrors.yearOfStudy = copy.required;
      }
    }

    if (target === 2 && mode === "team" && !teamName.trim()) {
      nextErrors.teamName = copy.required;
    }

    if (target === 3) {
      if (!projectTitle.trim()) {
        nextErrors.projectTitle = copy.required;
      }
      if (!projectDomain.trim()) {
        nextErrors.projectDomain = copy.required;
      }
      if (!projectDesc.trim()) {
        nextErrors.projectDesc = copy.required;
      } else if (projectDesc.trim().length < 100) {
        nextErrors.projectDesc = copy.descriptionMin;
      }
      if (!innovation.trim()) {
        nextErrors.innovation = copy.required;
      }
      if (!demoFormat.trim()) {
        nextErrors.demoFormat = copy.required;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    setSubmitError(null);
    if (!validateStep(step)) {
      return;
    }
    if (step === 1 && mode === "individual") {
      setStep(3);
      return;
    }
    setStep((value) => Math.min(value + 1, 4));
  };

  const prevStep = () => {
    setSubmitError(null);
    if (step === 3 && mode === "individual") {
      setStep(1);
      return;
    }
    setStep((value) => Math.max(value - 1, 0));
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      return;
    }
    if (!isAcceptedFile(selected)) {
      setFileError(copy.fileType);
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError(copy.fileTooLarge);
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async () => {
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    if (fileError) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitNote(null);

    try {
      let fileBase64 = "";
      let fileName = "";
      if (file) {
        fileBase64 = await fileToBase64(file);
        fileName = file.name;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: locale,
          type: mode,
          fullName,
          email,
          phone,
          university,
          branch,
          yearOfStudy,
          linkedin,
          teamName: mode === "team" ? teamName : "",
          member2Name: teamMembers[0].name,
          member2Email: teamMembers[0].email,
          member3Name: teamMembers[1].name,
          member3Email: teamMembers[1].email,
          member4Name: teamMembers[2].name,
          member4Email: teamMembers[2].email,
          projTitle: projectTitle,
          projDomain: projectDomain,
          projDesc: projectDesc,
          innovation,
          demoFormat,
          heardFrom,
          fileBase64,
          fileName,
          fileType: file?.type || "",
          fileSize: file?.size ?? null
        })
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; skipped?: boolean } | null;
      if (!response.ok || payload?.error) {
        throw new Error(payload?.error || copy.submitError);
      }

      if (payload?.skipped) {
        setSubmitNote(copy.skippedSave);
      }

      setDone(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setStep(0);
    setMode("individual");
    setDone(false);
    setSubmitting(false);
    setErrors({});
    setSubmitError(null);
    setSubmitNote(null);
    setFullName(defaultFullName);
    setEmail(defaultEmail);
    setPhone("");
    setUniversity("");
    setBranch("");
    setYearOfStudy("");
    setLinkedin("");
    setTeamName("");
    setTeamMembers([
      { name: "", email: "" },
      { name: "", email: "" },
      { name: "", email: "" }
    ]);
    setProjectTitle("");
    setProjectDomain("");
    setProjectDesc("");
    setInnovation("");
    setDemoFormat("");
    setHeardFrom("");
    clearFile();
  };

  return (
    <div className="register-form" dir={isRtl ? "rtl" : "ltr"}>
      <style>{`
        .register-form {
          --rf-text: rgba(31, 41, 55, 0.95);
          --rf-muted: rgba(31, 41, 55, 0.74);
          --rf-subtle: rgba(31, 41, 55, 0.56);
          --rf-line: rgba(31, 41, 55, 0.15);
          --rf-accent: #f59e0b;
          --rf-accent-soft: rgba(245, 158, 11, 0.1);
          --rf-surface: rgba(255, 255, 255, 0.72);
        }

        html[data-theme="dark"] .register-form {
          --rf-text: rgba(241, 245, 249, 0.94);
          --rf-muted: rgba(241, 245, 249, 0.72);
          --rf-subtle: rgba(241, 245, 249, 0.5);
          --rf-line: rgba(241, 245, 249, 0.15);
          --rf-accent-soft: rgba(245, 158, 11, 0.16);
          --rf-surface: rgba(12, 18, 30, 0.7);
        }

        .register-form .glass-card {
          border-radius: 10px;
        }

        .register-form .glass-card::after {
          border-radius: inherit;
        }

        .rf-input,
        .rf-select,
        .rf-textarea {
          width: 100%;
          border: 1px solid var(--rf-line);
          border-radius: 8px;
          padding: 10px 12px;
          background: transparent;
          color: var(--rf-text);
          font-size: 14px;
        }

        .rf-input::placeholder,
        .rf-textarea::placeholder {
          color: var(--rf-subtle);
        }

        .rf-input:focus,
        .rf-select:focus,
        .rf-textarea:focus {
          outline: none;
          border-color: var(--rf-accent);
          background: var(--rf-accent-soft);
        }

        .rf-textarea {
          min-height: 100px;
          resize: vertical;
        }
      `}</style>

      <article className="glass-card p-6 sm:p-8" style={{ background: "var(--rf-surface)" }}>
        <p className="inline-flex rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--rf-accent)", borderColor: "var(--rf-accent)" }}>
          {copy.badge}
        </p>
        <h2 className="mt-3 font-display text-[clamp(30px,4.2vw,48px)] font-semibold uppercase leading-[0.95]" style={{ color: "var(--rf-text)" }}>
          {copy.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--rf-muted)" }}>
          {copy.subtitle}
        </p>
        <p className="mt-3 inline-flex rounded border px-2.5 py-1 text-xs" style={{ borderColor: "var(--rf-line)", color: "var(--rf-muted)" }}>
          {copy.deadline}
        </p>

        {!done && step > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleStepIndexes.map((index, i) => (
              <span
                key={`${copy.steps[index]}-${i}`}
                className="rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.13em]"
                style={{
                  borderColor: i <= visibleStep ? "var(--rf-accent)" : "var(--rf-line)",
                  color: i <= visibleStep ? "var(--rf-accent)" : "var(--rf-subtle)",
                  background: i <= visibleStep ? "var(--rf-accent-soft)" : "transparent"
                }}
              >
                {copy.stepWord} {i + 1}
              </span>
            ))}
          </div>
        ) : null}

        {submitError ? (
          <p className="mt-4 rounded border px-3 py-2 text-sm" style={{ borderColor: "rgba(220,38,38,.45)", color: "rgba(220,38,38,.95)", background: "rgba(220,38,38,.08)" }}>
            {submitError}
          </p>
        ) : null}
        {submitNote ? (
          <p className="mt-4 rounded border px-3 py-2 text-sm" style={{ borderColor: "rgba(34,197,94,.45)", color: "rgba(22,163,74,.95)", background: "rgba(34,197,94,.08)" }}>
            {submitNote}
          </p>
        ) : null}

        {done ? (
          <div className="mt-8 rounded border p-5" style={{ borderColor: "var(--rf-accent)", background: "var(--rf-accent-soft)" }}>
            <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--rf-accent)" }}>
              {copy.doneTitle}
            </h3>
            <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--rf-muted)" }}>
              {copy.doneSubtitle}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 rounded border px-4 py-2 font-display text-lg uppercase tracking-[0.05em]"
              style={{ borderColor: "var(--rf-line)", color: "var(--rf-text)" }}
            >
              {copy.restart}
            </button>
          </div>
        ) : null}

        {!done && step === 0 ? (
          <div className="mt-6">
            <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--rf-text)" }}>
              {copy.modeTitle}
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("individual")}
                className="rounded border p-4 text-start"
                style={{ borderColor: mode === "individual" ? "var(--rf-accent)" : "var(--rf-line)", background: mode === "individual" ? "var(--rf-accent-soft)" : "transparent" }}
              >
                <p className="font-display text-2xl uppercase" style={{ color: "var(--rf-text)" }}>
                  {copy.individual}
                </p>
                <p className="text-sm" style={{ color: "var(--rf-muted)" }}>
                  {copy.individualDesc}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMode("team")}
                className="rounded border p-4 text-start"
                style={{ borderColor: mode === "team" ? "var(--rf-accent)" : "var(--rf-line)", background: mode === "team" ? "var(--rf-accent-soft)" : "transparent" }}
              >
                <p className="font-display text-2xl uppercase" style={{ color: "var(--rf-text)" }}>
                  {copy.team}
                </p>
                <p className="text-sm" style={{ color: "var(--rf-muted)" }}>
                  {copy.teamDesc}
                </p>
              </button>
            </div>
            <button
              type="button"
              onClick={nextStep}
              className="mt-4 rounded border px-5 py-2 font-display text-xl uppercase tracking-[0.05em]"
              style={{ color: "#0f172a", borderColor: "var(--rf-accent)", background: "var(--rf-accent)" }}
            >
              {copy.next}
            </button>
          </div>
        ) : null}

        {!done && step === 1 ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--rf-text)" }}>
              {copy.participantTitle}
            </h3>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.fullName}
              </label>
              <input className="rf-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              {errors.fullName ? <p className="mt-1 text-xs text-red-500">{errors.fullName}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                  {copy.email}
                </label>
                <input className="rf-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                  {copy.phone}
                </label>
                <input className="rf-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.university}
              </label>
              <input className="rf-input" value={university} onChange={(e) => setUniversity(e.target.value)} />
              {errors.university ? <p className="mt-1 text-xs text-red-500">{errors.university}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                  {copy.branch}
                </label>
                <input className="rf-input" value={branch} onChange={(e) => setBranch(e.target.value)} />
                {errors.branch ? <p className="mt-1 text-xs text-red-500">{errors.branch}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                  {copy.yearOfStudy}
                </label>
                <select className="rf-select" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}>
                  <option value="">--</option>
                  {copy.yearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.yearOfStudy ? <p className="mt-1 text-xs text-red-500">{errors.yearOfStudy}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.linkedin}
              </label>
              <input className="rf-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={prevStep} className="rounded border px-4 py-2 text-sm" style={{ borderColor: "var(--rf-line)", color: "var(--rf-muted)" }}>
                {copy.back}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded border px-4 py-2 font-display text-lg uppercase tracking-[0.05em]"
                style={{ color: "#0f172a", borderColor: "var(--rf-accent)", background: "var(--rf-accent)" }}
              >
                {copy.next}
              </button>
            </div>
          </div>
        ) : null}

        {!done && step === 2 && mode === "team" ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--rf-text)" }}>
              {copy.teamTitle}
            </h3>
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.teamName}
              </label>
              <input className="rf-input" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              {errors.teamName ? <p className="mt-1 text-xs text-red-500">{errors.teamName}</p> : null}
            </div>
            <p className="text-xs" style={{ color: "var(--rf-subtle)" }}>
              {copy.teamHint}
            </p>

            {teamMembers.map((member, index) => (
              <div key={index} className="rounded border p-3" style={{ borderColor: "var(--rf-line)" }}>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--rf-accent)" }}>
                  {copy.memberLabel(index + 2)}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className="rf-input" value={member.name} onChange={(e) => updateMember(index, "name", e.target.value)} placeholder={copy.memberName} />
                  <input className="rf-input" type="email" value={member.email} onChange={(e) => updateMember(index, "email", e.target.value)} placeholder={copy.memberEmail} />
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <button type="button" onClick={prevStep} className="rounded border px-4 py-2 text-sm" style={{ borderColor: "var(--rf-line)", color: "var(--rf-muted)" }}>
                {copy.back}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded border px-4 py-2 font-display text-lg uppercase tracking-[0.05em]"
                style={{ color: "#0f172a", borderColor: "var(--rf-accent)", background: "var(--rf-accent)" }}
              >
                {copy.next}
              </button>
            </div>
          </div>
        ) : null}

        {!done && step === 3 ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--rf-text)" }}>
              {copy.projectTitle}
            </h3>
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.projectName}
              </label>
              <input className="rf-input" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
              {errors.projectTitle ? <p className="mt-1 text-xs text-red-500">{errors.projectTitle}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                  {copy.projectDomain}
                </label>
                <select className="rf-select" value={projectDomain} onChange={(e) => setProjectDomain(e.target.value)}>
                  <option value="">--</option>
                  {copy.projectDomains.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.projectDomain ? <p className="mt-1 text-xs text-red-500">{errors.projectDomain}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                  {copy.demoFormat}
                </label>
                <select className="rf-select" value={demoFormat} onChange={(e) => setDemoFormat(e.target.value)}>
                  <option value="">--</option>
                  {copy.demoFormats.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.demoFormat ? <p className="mt-1 text-xs text-red-500">{errors.demoFormat}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.projectDesc}
              </label>
              <textarea className="rf-textarea" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
              <p className="mt-1 text-xs" style={{ color: "var(--rf-subtle)" }}>
                {projectDesc.trim().length} / 100+
              </p>
              {errors.projectDesc ? <p className="mt-1 text-xs text-red-500">{errors.projectDesc}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.innovation}
              </label>
              <textarea className="rf-textarea" value={innovation} onChange={(e) => setInnovation(e.target.value)} />
              {errors.innovation ? <p className="mt-1 text-xs text-red-500">{errors.innovation}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--rf-muted)" }}>
                {copy.heardFrom}
              </label>
              <select className="rf-select" value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)}>
                <option value="">--</option>
                {copy.heardFromOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={prevStep} className="rounded border px-4 py-2 text-sm" style={{ borderColor: "var(--rf-line)", color: "var(--rf-muted)" }}>
                {copy.back}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded border px-4 py-2 font-display text-lg uppercase tracking-[0.05em]"
                style={{ color: "#0f172a", borderColor: "var(--rf-accent)", background: "var(--rf-accent)" }}
              >
                {copy.next}
              </button>
            </div>
          </div>
        ) : null}

        {!done && step === 4 ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--rf-text)" }}>
              {copy.fileTitle}
            </h3>
            <p className="text-sm" style={{ color: "var(--rf-muted)" }}>
              {copy.fileSubtitle}
            </p>

            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFile} />

            {!file ? (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full rounded border border-dashed px-4 py-6 text-center" style={{ borderColor: "var(--rf-accent)", background: "var(--rf-accent-soft)", color: "var(--rf-accent)" }}>
                {copy.fileChoose}
              </button>
            ) : (
              <div className="rounded border p-3" style={{ borderColor: "var(--rf-line)" }}>
                <p className="text-xs" style={{ color: "var(--rf-muted)" }}>
                  {copy.fileSelected}
                </p>
                <p className="text-sm" style={{ color: "var(--rf-text)" }}>
                  {file.name}
                </p>
                <button type="button" onClick={clearFile} className="mt-2 rounded border px-3 py-1 text-xs" style={{ borderColor: "var(--rf-line)", color: "var(--rf-muted)" }}>
                  {copy.removeFile}
                </button>
              </div>
            )}

            {fileError ? <p className="text-xs text-red-500">{fileError}</p> : null}
            <p className="text-xs" style={{ color: "var(--rf-subtle)" }}>
              {copy.fileOptional}
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void submit()}
                disabled={submitting}
                className="rounded border px-4 py-2 font-display text-lg uppercase tracking-[0.05em]"
                style={{ color: "#0f172a", borderColor: "var(--rf-accent)", background: "var(--rf-accent)", opacity: submitting ? 0.65 : 1 }}
              >
                {submitting ? copy.submitting : copy.submit}
              </button>
              <button type="button" onClick={prevStep} className="rounded border px-4 py-2 text-sm" style={{ borderColor: "var(--rf-line)", color: "var(--rf-muted)" }}>
                {copy.back}
              </button>
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}
