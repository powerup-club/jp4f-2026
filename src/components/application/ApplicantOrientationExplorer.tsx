"use client";

import { useMemo, useState } from "react";
import type { ApplicantQuizBranch } from "@/applicant/types";
import type { SiteLocale } from "@/config/locales";

type BranchKey = ApplicantQuizBranch;
type OrientationSection = "modules" | "careers" | "companies" | "projects";

type BranchContent = {
  shortLabel: string;
  fullName: string;
  tagline: string;
  description: string;
  focusAreas: string[];
  highlights: { value: string; label: string }[];
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
      tagline: "Energie, electronique de puissance et intelligence embarquee.",
      description:
        "La filiere GESI forme des ingenieurs au coeur de la transition energetique: solaire, eolien, smart grids, hydrogene et IA appliquee aux systemes.",
      focusAreas: ["Energies renouvelables", "Electronique de puissance", "Systemes embarques", "Smart grids", "IA & data energetique"],
      highlights: [
        { value: "5 466 MW", label: "capacite renouvelable installee (2024)" },
        { value: "52%", label: "objectif ENR dans le mix electrique (2030)" },
        { value: "319 Mds DH", label: "projets hydrogene vert approuves (2025)" },
        { value: "75 000+", label: "emplois energie crees au Maroc" }
      ],
      modules: [
        "Thermodynamique appliquee",
        "Electronique de puissance",
        "Systemes embarques (STM32, RTOS)",
        "Energie solaire & eolien",
        "Analyse de donnees & ML",
        "Smart grids & stockage"
      ],
      careers: [
        "Ingenieur energies renouvelables",
        "Ingenieur smart grid",
        "Ingenieur systemes embarques",
        "Ingenieur electronique de puissance",
        "Data engineer energie/IA"
      ],
      companies: ["MASEN", "ONEE", "OCP", "Nareva", "Schneider Electric"],
      projects: ["Micro-reseau intelligent", "Supervision solaire IoT", "Optimisation energetique par IA", "Stockage hydrogene/STEP"],
      color: "#10b981"
    },
    MECA: {
      shortLabel: "MECA",
      fullName: "Genie mecanique et systemes automatises",
      tagline: "Conception, simulation, materiaux et fabrication avancee.",
      description:
        "Le genie mecanique d'aujourd'hui combine physique, simulation numerique et fabrication avancee pour servir l'automobile, l'aeronautique et l'industrie 4.0.",
      focusAreas: [
        "Conception & innovation",
        "Simulation numerique (EF)",
        "Materiaux & procedes",
        "Production & maintenance",
        "Jumeaux numeriques"
      ],
      highlights: [
        { value: "92,7 Mds DH", label: "export automobile S1 2024" },
        { value: "26,4 Mds DH", label: "export aeronautique 2024" },
        { value: "200+", label: "acteurs auto au Maroc" },
        { value: "24 000+", label: "emplois aeronautiques" }
      ],
      modules: [
        "Conception mecanique avancee",
        "Calcul de structures & elements finis",
        "CAO/FAO (CATIA, SolidWorks)",
        "Materiaux & procedes",
        "Fabrication additive (3D metal)",
        "Maintenance predictive & fiabilite"
      ],
      careers: [
        "Ingenieur conception",
        "Ingenieur simulation/EF",
        "Ingenieur production",
        "Ingenieur maintenance 4.0",
        "Ingenieur R&D"
      ],
      companies: ["Renault Tanger", "Stellantis Kenitra", "Safran", "Airbus", "Boeing Maroc"],
      projects: [
        "Prototype mecanique optimise",
        "Jumeau numerique d'equipement",
        "Ligne de fabrication flexible",
        "Optimisation aerodynamique"
      ],
      color: "#f97316"
    },
    MECATRONIQUE: {
      shortLabel: "GM",
      fullName: "Genie mecatronique",
      tagline: "Robotique, electronique embarquee et IA industrielle.",
      description:
        "La mecatronique fusionne mecanique, electronique et logiciel embarque pour creer des systemes intelligents: robotique, vision, vehicules connectes.",
      focusAreas: [
        "Robotique & vision",
        "Systemes embarques",
        "Commande avancee",
        "Electronique de puissance",
        "IA appliquee"
      ],
      highlights: [
        { value: "205,5 Mds USD", label: "marche mondial robotique d'ici 2030" },
        { value: "110 Mds USD", label: "marche systemes embarques (2024)" },
        { value: "600 000+", label: "vehicules produits/an au Maroc" },
        { value: "553 052", label: "robots industriels installes en 2024" }
      ],
      modules: [
        "Electronique & microcontroleurs",
        "Systemes embarques (RTOS, C/C++)",
        "Robotique & vision (OpenCV)",
        "Automatique & commande moderne",
        "IA pour la mecatronique",
        "Bus de communication (CAN, I2C)"
      ],
      careers: [
        "Ingenieur robotique",
        "Ingenieur systemes embarques",
        "Ingenieur automatisme",
        "Ingenieur integration mecatronique",
        "Ingenieur vision industrielle"
      ],
      companies: ["Aptiv", "Valeo", "Yazaki", "Safran", "Thales Maroc"],
      projects: [
        "Bras robotique intelligent",
        "Drone autonome",
        "Cellule d'inspection visuelle",
        "Systeme ADAS embarque"
      ],
      color: "#8b5cf6"
    },
    GI: {
      shortLabel: "GI",
      fullName: "Genie industriel et industrie 4.0",
      tagline: "Production, supply chain, data et performance.",
      description:
        "Le genie industriel organise les flux, optimise la qualite et pilote la performance. C'est la discipline de l'excellence operationnelle et de la transformation digitale.",
      focusAreas: [
        "Lean & excellence operationnelle",
        "Supply chain & logistique",
        "Data/IA industrielle",
        "Automatisation & robotique",
        "Qualite & PLM"
      ],
      highlights: [
        { value: "898 Mds DH", label: "chiffre d'affaires industriel 2024" },
        { value: "90 Mds DH", label: "investissements industriels 2024" },
        { value: "42 700", label: "emplois industriels crees 2024" },
        { value: "1,5 Md USD", label: "marche Industrie 4.0 au Maroc" }
      ],
      modules: [
        "Lean manufacturing & performance",
        "Supply chain & achats",
        "Recherche operationnelle & optimisation",
        "Data analytics & ML industriel",
        "Systemes d'information industriels (ERP/MES)",
        "Automatisation & reseaux industriels"
      ],
      careers: [
        "Ingenieur Lean & excellence operationnelle",
        "Supply chain manager",
        "Ingenieur qualite",
        "Ingenieur industrialisation",
        "Data analyst industriel"
      ],
      companies: ["Renault", "Stellantis", "OCP Group", "Yazaki", "Lear Corporation"],
      projects: [
        "Dashboard KPI production",
        "Simulation d'entrepot logistique",
        "Planification MRP & stocks",
        "Optimisation des flux & temps de cycle"
      ],
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
      focusAreas: ["Renewable energy", "Power electronics", "Embedded systems", "Smart grids", "AI & energy data"],
      highlights: [
        { value: "5,466 MW", label: "renewable capacity installed (2024)" },
        { value: "52%", label: "renewables target in power mix (2030)" },
        { value: "319 Bn MAD", label: "green hydrogen projects approved (2025)" },
        { value: "75,000+", label: "energy jobs created in Morocco" }
      ],
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
      focusAreas: ["Design & innovation", "Numerical simulation", "Materials & processes", "Production & maintenance", "Digital twins"],
      highlights: [
        { value: "92.7 Bn MAD", label: "automotive exports (S1 2024)" },
        { value: "26.4 Bn MAD", label: "aeronautics exports (2024)" },
        { value: "200+", label: "automotive actors in Morocco" },
        { value: "24,000+", label: "aeronautics jobs" }
      ],
      modules: ["Mechanics of materials", "Finite elements", "CAD/CAM", "Materials", "Additive manufacturing"],
      careers: ["Design engineer", "Simulation engineer", "Production engineer", "Engineering-office lead"],
      companies: ["Renault Tanger", "PSA Kenitra", "Airbus Atlantic Maroc", "Boeing Maroc"],
      projects: ["Mechanical prototype", "Aerodynamic optimization", "Flexible manufacturing line"],
      color: "#f97316"
    },
    MECATRONIQUE: {
      shortLabel: "GM",
      fullName: "Mechatronics engineering",
      tagline: "Robotics, automation, and hybrid systems.",
      description:
        "Mechatronics is ideal for students who like combining mechanics, electronics, and software into smart autonomous systems.",
      focusAreas: ["Robotics & vision", "Embedded systems", "Advanced control", "Power electronics", "Applied AI"],
      highlights: [
        { value: "205.5 Bn USD", label: "global robotics market by 2030" },
        { value: "110 Bn USD", label: "embedded systems market (2024)" },
        { value: "600,000+", label: "vehicles produced/year in Morocco" },
        { value: "553,052", label: "industrial robots installed (2024)" }
      ],
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
      focusAreas: ["Lean & operations", "Supply chain", "Industrial data/AI", "Automation", "Quality & PLM"],
      highlights: [
        { value: "898 Bn MAD", label: "industrial turnover (2024)" },
        { value: "90 Bn MAD", label: "industrial investments (2024)" },
        { value: "42,700", label: "industrial jobs created (2024)" },
        { value: "1.5 Bn USD", label: "Industry 4.0 market in Morocco" }
      ],
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
      focusAreas: ["??????? ????????", "?????????? ??????", "??????? ???????", "??????? ??????", "?????? ????????? ??????"],
      highlights: [
        { value: "5 466 MW", label: "???? ??????? ???????? ??????? (2024)" },
        { value: "52%", label: "??? ??????? ???????? ?? ?????? ????????? (2030)" },
        { value: "319 ????? ????", label: "?????? ?????????? ?????? ???????? (2025)" },
        { value: "75 000+", label: "????? ?????? ?? ??????" }
      ],
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
      focusAreas: ["??????? ?????????", "???????? ???????", "?????? ?????????", "??????? ????????", "?????? ??????"],
      highlights: [
        { value: "92.7 ????? ????", label: "?????? ???????? (????? ????? 2024)" },
        { value: "26.4 ????? ????", label: "?????? ??????? (2024)" },
        { value: "200+", label: "?????? ?? ????? ???????? ???????" },
        { value: "24 000+", label: "????? ???????" }
      ],
      modules: ["مقاومة المواد", "العناصر المحدودة", "التصميم بالحاسوب", "المواد", "التصنيع الإضافي"],
      careers: ["مهندس تصميم", "مهندس محاكاة", "مهندس إنتاج", "مسؤول مكتب الدراسات"],
      companies: ["Renault Tanger", "PSA Kenitra", "Airbus Atlantic Maroc", "Boeing Maroc"],
      projects: ["نموذج ميكانيكي", "تحسين أيروديناميكي", "خط تصنيع مرن"],
      color: "#f97316"
    },
    MECATRONIQUE: {
      shortLabel: "GM",
      fullName: "الهندسة الميكاترونية",
      tagline: "روبوتيك وأتمتة وأنظمة هجينة.",
      description:
        "الميكاترونيك مناسب لمن يحب الجمع بين الميكانيك والإلكترونيات والبرمجيات لبناء أنظمة ذكية ذاتية.",
      focusAreas: ["????????? ???????", "??????? ???????", "?????? ???????", "?????????? ??????", "?????? ????????? ????????"],
      highlights: [
        { value: "205.5 ????? ?????", label: "??? ????????? ?????? ????? 2030" },
        { value: "110 ????? ?????", label: "??? ??????? ??????? (2024)" },
        { value: "600 000+", label: "?????? ????? ????? ?? ??????" },
        { value: "553 052", label: "??????? ?????? ????? (2024)" }
      ],
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
      focusAreas: ["??? ??????????", "????? ???????", "??????/???? ??????? ?????", "???????", "?????? ?PLM"],
      highlights: [
        { value: "898 ????? ????", label: "??? ????????? ??????? (2024)" },
        { value: "90 ????? ????", label: "????????? ?????? (2024)" },
        { value: "42 700", label: "????? ??? ?????? (2024)" },
        { value: "1.5 ????? ?????", label: "??? ??????? 4.0 ???????" }
      ],
      modules: ["Lean manufacturing", "Supply chain", "الجودة", "بحوث العمليات", "الصناعة 4.0"],
      careers: ["مهندس جودة", "مدير سلسلة الإمداد", "مستشار lean", "مهندس أداء"],
      companies: ["OCP Group", "Marsa Maroc", "Decathlon", "Lear Corporation"],
      projects: ["لوحة قيادة للإنتاج", "تحسين المستودع", "تدبير الجودة في الزمن الحقيقي"],
      color: "#0ea5e9"
    }
  }
};

const GUIDE_PDFS: Record<BranchKey, string> = {
  GESI: "/Documents/filieres/GESI_ENSA_Fes_Guide_Orientation.pdf",
  MECA: "/Documents/filieres/GenieM_ENSA_Fes_Guide_Orientation.pdf",
  MECATRONIQUE: "/Documents/filieres/GM_Mecatronique_ENSA_Fes_Guide_Orientation.pdf",
  GI: "/Documents/filieres/GI_ENSA_Fes_Guide_Orientation.pdf"
};

const UI_COPY: Record<
  SiteLocale,
  {
    recommended: string;
    projectLink: string;
    chooseBranch: string;
    highlightsTitle: string;
    focusTitle: string;
    downloadTitle: string;
    downloadBody: string;
    downloadCta: string;
    sections: Record<OrientationSection, string>;
  }
> = {
  fr: {
    recommended: "Profil recommande",
    projectLink: "Lien avec ton projet",
    chooseBranch: "Explore les parcours du departement et compare-les a ton profil.",
    highlightsTitle: "Chiffres cles",
    focusTitle: "Axes principaux",
    downloadTitle: "Guide PDF par filiere",
    downloadBody:
      "Pour faciliter ta recherche, nous avons prepare un guide PDF pour chaque filiere. Choisis celui qui t'interesse, mais rappelle-toi: ta decision doit venir de toi, pas des recommandations des autres, car toi seul construis ton futur.",
    downloadCta: "Telecharger le guide",
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
    highlightsTitle: "Key figures",
    focusTitle: "Core focus",
    downloadTitle: "PDF guide per track",
    downloadBody:
      "To support your research, we prepared a PDF guide for each track. Pick the one that interests you, but remember: the choice should be yours, not driven by other people's recommendations.",
    downloadCta: "Download guide",
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
    highlightsTitle: "أرقام رئيسية",
    focusTitle: "محاور أساسية",
    downloadTitle: "دليل PDF لكل مسلك",
    downloadBody:
      "لتسهيل مرحلة البحث، أعددنا دليلاً بصيغة PDF لكل مسلك. اختر ما يناسبك، وتذكّر أن القرار يجب أن يكون نابعاً منك وليس توصيات الآخرين، لأنك وحدك من يصنع مستقبلك.",
    downloadCta: "تحميل الدليل",
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

  const branch = content[selectedBranch];
  const sections = useMemo(
    () => [
      { key: "modules", title: copy.sections.modules, items: branch.modules },
      { key: "careers", title: copy.sections.careers, items: branch.careers },
      { key: "companies", title: copy.sections.companies, items: branch.companies },
      { key: "projects", title: copy.sections.projects, items: branch.projects }
    ],
    [branch, copy.sections]
  );
  const guidePdf = GUIDE_PDFS[selectedBranch];
  const guideFileName = guidePdf.split("/").pop() ?? "guide-orientation.pdf";

  return (
    <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <article className="glass-card p-4 sm:p-6">
        <p className="text-sm text-ink/72">{copy.chooseBranch}</p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {(Object.keys(content) as BranchKey[]).map((key) => {
            const item = content[key];
            const active = key === selectedBranch;
            const recommended = key === recommendedBranch;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedBranch(key)}
                title={item.fullName}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.16em] ${
                  active
                    ? "bg-panel/90 text-ink shadow-card"
                    : "bg-panel/60 text-ink/70 hover:border-accent hover:text-ink"
                }`}
                style={{ borderColor: active ? item.color : "rgba(120,120,120,.22)" }}
              >
                <span className="flex items-center gap-2">
                  {item.shortLabel}
                  {recommended ? (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-label={copy.recommended}
                      title={copy.recommended}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </article>

      <article className="glass-card p-4 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: branch.color }}>
              {branch.shortLabel}
            </p>
            <h2 className="mt-2 break-words font-display text-2xl font-semibold uppercase text-ink sm:text-4xl lg:text-5xl">
              {branch.fullName}
            </h2>
            <p className="mt-2 text-sm text-ink/70 sm:text-base">{branch.tagline}</p>
          </div>
          {selectedBranch === recommendedBranch ? (
            <span
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ borderColor: `${branch.color}45`, color: branch.color }}
            >
              {copy.recommended}
            </span>
          ) : null}
        </div>

        <p className="mt-4 max-w-4xl break-words text-sm leading-7 text-ink/74 sm:mt-5 sm:text-base">
          {branch.description}
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{copy.focusTitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {branch.focusAreas.map((item) => (
              <span
                key={item}
                className="rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs"
                style={{ borderColor: `${branch.color}35`, color: branch.color, backgroundColor: `${branch.color}12` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{copy.highlightsTitle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {branch.highlights.map((item) => (
              <div
                key={`${item.value}-${item.label}`}
                className="rounded-2xl border border-edge/50 bg-panel/70 p-4"
                style={{ borderColor: `${branch.color}25` }}
              >
                <p className="font-display text-xl font-semibold text-ink sm:text-2xl" style={{ color: branch.color }}>
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-ink/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {projectTitle ? (
          <div className="mt-6 rounded-3xl border p-5" style={{ borderColor: `${branch.color}35`, backgroundColor: `${branch.color}10` }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: branch.color }}>
              {copy.projectLink}
            </p>
            <p className="mt-3 break-words text-sm text-ink/76 sm:text-base">
              <span className="font-semibold text-ink">{projectTitle}</span>
              {projectDomain ? ` · ${projectDomain}` : ""}
            </p>
            <p className="mt-2 text-sm text-ink/68">{branch.tagline}</p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <div key={section.key} className="rounded-3xl border border-edge/45 bg-panel/65 p-5">
              <p className="font-display text-2xl font-semibold uppercase text-ink">{section.title}</p>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 break-words text-sm text-ink/78">
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: branch.color }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-edge/45 bg-panel/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">{copy.downloadTitle}</p>
              <p className="max-w-2xl text-sm text-ink/75">{copy.downloadBody}</p>
            </div>
            <a
              href={guidePdf}
              download={guideFileName}
              className="inline-flex items-center justify-center rounded-full border border-edge/80 bg-panel/95 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:text-accent"
            >
              {copy.downloadCta}
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
