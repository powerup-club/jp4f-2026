"use client";

import { useMemo, useState } from "react";
import type { ApplicantQuizBranch } from "@/applicant/types";
import type { SiteLocale } from "@/config/locales";

type OrientationTab = "modules" | "careers" | "companies" | "projects";

type BranchKey = ApplicantQuizBranch;

type BranchContent = {
  shortLabel: string;
  fullName: string;
  tagline: string;
  description: string;
  modules: string[];
  careers: string[];
  companies: string[];
  projects: string[];
  color: string;
};

const DATA: Record<SiteLocale, Record<BranchKey, BranchContent>> = {
  fr: {
    GESI: {
      shortLabel: "GESI",
      fullName: "Genie energetique et systemes intelligents",
      tagline: "Energie, capteurs, commande et intelligence appliquee.",
      description:
        "Cette filiere convient aux profils attires par l'energie, les systemes embarques, l'automatisation intelligente et les solutions durables a fort impact.",
      modules: ["Energies renouvelables", "Electronique de puissance", "Systemes embarques", "IA appliquee", "Commande avancee"],
      careers: ["Ingenieur energie", "Ingenieur smart grid", "Ingenieur systemes intelligents", "Consultant transition energetique"],
      companies: ["MASEN", "ONEE", "Schneider Electric", "Leoni", "Yazaki"],
      projects: ["Monitoring solaire IoT", "Optimisation energetique par IA", "Micro-reseau intelligent"],
      color: "#10b981"
    },
    MECA: {
      shortLabel: "MECA",
      fullName: "Genie mecanique",
      tagline: "Conception, structure, simulation et fabrication.",
      description:
        "MECA parle aux profils qui aiment concevoir, calculer, tester des mecanismes et transformer des concepts en objets ou process robustes.",
      modules: ["RDM", "Elements finis", "CAO/FAO", "Materiaux", "Fabrication additive"],
      careers: ["Ingenieur conception", "Ingenieur simulation", "Ingenieur production", "Responsable bureau d'etudes"],
      companies: ["Renault Tanger", "PSA Kenitra", "Airbus Atlantic Maroc", "Boeing Maroc"],
      projects: ["Prototype mecanique", "Optimisation aerodynamique", "Ligne de fabrication flexible"],
      color: "#f97316"
    },
    MECATRONIQUE: {
      shortLabel: "Mecatronique",
      fullName: "Genie mecatronique",
      tagline: "Robotique, automatisme et systemes hybrides.",
      description:
        "La mecatronique convient aux profils qui aiment faire dialoguer mecanique, electronique et logiciel pour creer des systemes autonomes ou interactifs.",
      modules: ["Robotique", "Vision", "Microcontroleurs", "Automatique", "Temps reel"],
      careers: ["Ingenieur robotique", "Ingenieur automation", "Ingenieur embarque", "Developpeur vision industrielle"],
      companies: ["Aptiv", "Continental", "Valeo", "Delphi Technologies"],
      projects: ["Bras robotique intelligent", "Drone autonome", "Cellule d'inspection visuelle"],
      color: "#8b5cf6"
    },
    GI: {
      shortLabel: "GI",
      fullName: "Genie industriel",
      tagline: "Flux, qualite, performance et transformation des organisations.",
      description:
        "GI correspond aux profils qui aiment optimiser, organiser, planifier et rendre les systemes plus efficaces grace aux donnees et aux methodes de decision.",
      modules: ["Lean manufacturing", "Supply chain", "Qualite", "Recherche operationnelle", "Industrie 4.0"],
      careers: ["Ingenieur qualite", "Supply chain manager", "Consultant lean", "Ingenieur performance"],
      companies: ["OCP Group", "Marsa Maroc", "Decathlon", "Lear Corporation"],
      projects: ["Dashboard de production", "Optimisation d'entrepot", "Pilotage qualite en temps reel"],
      color: "#0ea5e9"
    }
  },
  en: {
    GESI: {
      shortLabel: "GESI",
      fullName: "Energy engineering and intelligent systems",
      tagline: "Energy, sensors, control, and applied intelligence.",
      description:
        "This track fits students attracted by energy systems, embedded devices, intelligent automation, and sustainable industrial solutions.",
      modules: ["Renewable energy", "Power electronics", "Embedded systems", "Applied AI", "Advanced control"],
      careers: ["Energy engineer", "Smart-grid engineer", "Intelligent systems engineer", "Energy-transition consultant"],
      companies: ["MASEN", "ONEE", "Schneider Electric", "Leoni", "Yazaki"],
      projects: ["IoT solar monitoring", "AI energy optimization", "Smart micro-grid"],
      color: "#10b981"
    },
    MECA: {
      shortLabel: "MECA",
      fullName: "Mechanical engineering",
      tagline: "Design, structure, simulation, and manufacturing.",
      description:
        "MECA fits profiles who enjoy designing mechanisms, validating structures, and turning concepts into robust physical systems.",
      modules: ["Mechanics of materials", "Finite elements", "CAD/CAM", "Materials", "Additive manufacturing"],
      careers: ["Design engineer", "Simulation engineer", "Production engineer", "Engineering-office lead"],
      companies: ["Renault Tanger", "PSA Kenitra", "Airbus Atlantic Maroc", "Boeing Maroc"],
      projects: ["Mechanical prototype", "Aerodynamic optimization", "Flexible manufacturing line"],
      color: "#f97316"
    },
    MECATRONIQUE: {
      shortLabel: "Mechatronics",
      fullName: "Mechatronics engineering",
      tagline: "Robotics, automation, and hybrid systems.",
      description:
        "Mechatronics is ideal for students who like combining mechanics, electronics, and software into smart autonomous systems.",
      modules: ["Robotics", "Computer vision", "Microcontrollers", "Automation", "Real-time systems"],
      careers: ["Robotics engineer", "Automation engineer", "Embedded-systems engineer", "Industrial vision developer"],
      companies: ["Aptiv", "Continental", "Valeo", "Delphi Technologies"],
      projects: ["Intelligent robotic arm", "Autonomous drone", "Visual inspection cell"],
      color: "#8b5cf6"
    },
    GI: {
      shortLabel: "GI",
      fullName: "Industrial engineering",
      tagline: "Flows, quality, performance, and process transformation.",
      description:
        "GI matches profiles who like optimizing systems, organizing operations, and using data to improve industrial performance.",
      modules: ["Lean manufacturing", "Supply chain", "Quality", "Operations research", "Industry 4.0"],
      careers: ["Quality engineer", "Supply chain manager", "Lean consultant", "Performance engineer"],
      companies: ["OCP Group", "Marsa Maroc", "Decathlon", "Lear Corporation"],
      projects: ["Production dashboard", "Warehouse optimization", "Real-time quality management"],
      color: "#0ea5e9"
    }
  },
  ar: {
    GESI: {
      shortLabel: "GESI",
      fullName: "الهندسة الطاقية والأنظمة الذكية",
      tagline: "طاقة ومستشعرات وتحكم وذكاء مطبق.",
      description:
        "هذا المسلك مناسب للطلبة المهتمين بالطاقة والأنظمة المضمنة والأتمتة الذكية والحلول الصناعية المستدامة.",
      modules: ["الطاقات المتجددة", "إلكترونيات القدرة", "الأنظمة المضمنة", "الذكاء الاصطناعي التطبيقي", "التحكم المتقدم"],
      careers: ["مهندس طاقة", "مهندس smart grid", "مهندس أنظمة ذكية", "مستشار انتقال طاقي"],
      companies: ["MASEN", "ONEE", "Schneider Electric", "Leoni", "Yazaki"],
      projects: ["مراقبة شمسية عبر IoT", "تحسين طاقي بالذكاء الاصطناعي", "شبكة مصغرة ذكية"],
      color: "#10b981"
    },
    MECA: {
      shortLabel: "MECA",
      fullName: "الهندسة الميكانيكية",
      tagline: "تصميم وبنية ومحاكاة وتصنيع.",
      description:
        "هذا المسلك يناسب من يحب تصميم الآليات والتحقق من البنيات وتحويل الأفكار إلى أنظمة مادية قوية.",
      modules: ["مقاومة المواد", "العناصر المحدودة", "التصميم بالحاسوب", "المواد", "التصنيع الإضافي"],
      careers: ["مهندس تصميم", "مهندس محاكاة", "مهندس إنتاج", "مسؤول مكتب الدراسات"],
      companies: ["Renault Tanger", "PSA Kenitra", "Airbus Atlantic Maroc", "Boeing Maroc"],
      projects: ["نموذج ميكانيكي", "تحسين أيروديناميكي", "خط تصنيع مرن"],
      color: "#f97316"
    },
    MECATRONIQUE: {
      shortLabel: "Mecatronique",
      fullName: "الهندسة الميكاترونية",
      tagline: "روبوتيك وأتمتة وأنظمة هجينة.",
      description:
        "الميكاترونيك مناسب لمن يحب الجمع بين الميكانيك والإلكترونيات والبرمجيات لبناء أنظمة ذكية ذاتية.",
      modules: ["الروبوتيك", "الرؤية الحاسوبية", "المتحكمات", "الأتمتة", "الأنظمة الزمنية"],
      careers: ["مهندس روبوتيك", "مهندس أتمتة", "مهندس أنظمة مضمنة", "مطور رؤية صناعية"],
      companies: ["Aptiv", "Continental", "Valeo", "Delphi Technologies"],
      projects: ["ذراع روبوتية ذكية", "درون ذاتي", "خلية فحص بصري"],
      color: "#8b5cf6"
    },
    GI: {
      shortLabel: "GI",
      fullName: "الهندسة الصناعية",
      tagline: "تدفقات وجودة وأداء وتحويل للعمليات.",
      description:
        "الهندسة الصناعية تناسب من يحب تحسين الأنظمة وتنظيم العمليات واستعمال المعطيات لرفع الأداء.",
      modules: ["Lean manufacturing", "Supply chain", "الجودة", "بحوث العمليات", "الصناعة 4.0"],
      careers: ["مهندس جودة", "مدير سلسلة الإمداد", "مستشار lean", "مهندس أداء"],
      companies: ["OCP Group", "Marsa Maroc", "Decathlon", "Lear Corporation"],
      projects: ["لوحة قيادة للإنتاج", "تحسين المستودع", "تدبير الجودة في الزمن الحقيقي"],
      color: "#0ea5e9"
    }
  }
};

const UI_COPY: Record<
  SiteLocale,
  {
    recommended: string;
    projectLink: string;
    chooseBranch: string;
    tabs: Record<OrientationTab, string>;
    sections: Record<OrientationTab, string>;
  }
> = {
  fr: {
    recommended: "Profil recommande",
    projectLink: "Lien avec ton projet",
    chooseBranch: "Explore les parcours du departement et compare-les a ton profil.",
    tabs: {
      modules: "Modules",
      careers: "Carrieres",
      companies: "Entreprises",
      projects: "Projets"
    },
    sections: {
      modules: "Modules phares",
      careers: "Debouches",
      companies: "Acteurs cibles",
      projects: "Projets typiques"
    }
  },
  en: {
    recommended: "Recommended profile",
    projectLink: "Project connection",
    chooseBranch: "Explore the department tracks and compare them with your profile.",
    tabs: {
      modules: "Modules",
      careers: "Careers",
      companies: "Companies",
      projects: "Projects"
    },
    sections: {
      modules: "Core modules",
      careers: "Career paths",
      companies: "Target companies",
      projects: "Typical projects"
    }
  },
  ar: {
    recommended: "المسلك المقترح",
    projectLink: "صلة بمشروعك",
    chooseBranch: "استكشف مسالك الشعبة وقارنها مع ملفك.",
    tabs: {
      modules: "الوحدات",
      careers: "المسارات",
      companies: "المؤسسات",
      projects: "المشاريع"
    },
    sections: {
      modules: "الوحدات الأساسية",
      careers: "الفرص",
      companies: "المؤسسات المستهدفة",
      projects: "مشاريع نموذجية"
    }
  }
};

export function ApplicantOrientationExplorer({
  locale,
  recommendedBranch,
  projectTitle,
  projectDomain
}: {
  locale: SiteLocale;
  recommendedBranch: BranchKey;
  projectTitle: string;
  projectDomain: string;
}) {
  const copy = UI_COPY[locale];
  const content = DATA[locale];
  const [selectedBranch, setSelectedBranch] = useState<BranchKey>(recommendedBranch);
  const [tab, setTab] = useState<OrientationTab>("modules");

  const branch = content[selectedBranch];
  const tabItems = useMemo(() => branch[tab], [branch, tab]);

  return (
    <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <article className="glass-card p-6">
        <p className="text-sm text-ink/72">{copy.chooseBranch}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(Object.keys(content) as BranchKey[]).map((key) => {
            const item = content[key];
            const active = key === selectedBranch;
            const recommended = key === recommendedBranch;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedBranch(key)}
                className={`rounded-3xl border p-5 text-start transition ${
                  active ? "bg-panel/80 shadow-card" : "bg-panel/45 hover:bg-panel/70"
                }`}
                style={{ borderColor: active ? item.color : "rgba(120,120,120,.22)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold uppercase tracking-[0.16em]"
                    style={{ backgroundColor: `${item.color}1a`, color: item.color }}
                  >
                    {item.shortLabel}
                  </div>
                  {recommended ? (
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{ borderColor: `${item.color}45`, color: item.color }}
                    >
                      {copy.recommended}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 font-display text-3xl font-semibold uppercase text-ink">{item.shortLabel}</p>
                <p className="text-sm text-ink/76">{item.fullName}</p>
                <p className="mt-2 text-sm text-ink/58">{item.tagline}</p>
              </button>
            );
          })}
        </div>
      </article>

      <article className="glass-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-5xl font-semibold uppercase text-ink">{branch.shortLabel}</h2>
            <p className="mt-2 text-lg text-ink/76">{branch.fullName}</p>
          </div>
          <span
            className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ borderColor: `${branch.color}45`, color: branch.color }}
          >
            {copy.recommended}
          </span>
        </div>

        <p className="mt-5 max-w-4xl text-sm leading-7 text-ink/74 sm:text-base">{branch.description}</p>

        {projectTitle ? (
          <div className="mt-6 rounded-3xl border p-5" style={{ borderColor: `${branch.color}35`, backgroundColor: `${branch.color}10` }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: branch.color }}>
              {copy.projectLink}
            </p>
            <p className="mt-3 text-sm text-ink/76 sm:text-base">
              <span className="font-semibold text-ink">{projectTitle}</span>
              {projectDomain ? ` · ${projectDomain}` : ""}
            </p>
            <p className="mt-2 text-sm text-ink/68">{branch.tagline}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(copy.tabs) as OrientationTab[]).map((item) => {
            const active = item === tab;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  active ? "bg-panel/85" : "bg-panel/50 hover:bg-panel/75"
                }`}
                style={{
                  borderColor: active ? branch.color : "rgba(120,120,120,.22)",
                  color: active ? branch.color : "rgba(31,41,55,.72)"
                }}
              >
                {copy.tabs[item]}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-edge/45 bg-panel/65 p-5">
          <p className="font-display text-3xl font-semibold uppercase text-ink">{copy.sections[tab]}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {tabItems.map((item) => (
              <span
                key={item}
                className="rounded-2xl border px-4 py-3 text-sm text-ink/78"
                style={{ borderColor: `${branch.color}30`, backgroundColor: `${branch.color}12` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
