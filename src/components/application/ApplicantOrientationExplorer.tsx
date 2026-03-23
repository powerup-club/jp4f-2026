
"use client";
// --- MECATRONIQUE DATASETS ---
const MECATRONIQUE_MARKET = [
  { year: 2015, market: 11, robots: 250000, source: "IFR" },
  { year: 2018, market: 16.5, robots: 422000, source: "IFR" },
  { year: 2020, market: null, robots: 384000, source: "IFR" },
  { year: 2022, market: 14.86, robots: 553000, source: "Mordor Intelligence + IFR" },
  { year: 2024, market: 47.8, robots: 600000, source: "GM Insights" },
  { year: 2030, market: 205.5, robots: 1000000, source: "GlobalData" }
];
const MECATRONIQUE_INDUSTRIAL = [
  { year: 2015, value: 11 },
  { year: 2018, value: 16.5 },
  { year: 2022, value: 14.86 },
  { year: 2024, value: 17.78 },
  { year: 2030, value: 36.7 },
  { year: 2034, value: 60.14 }
];
const MECATRONIQUE_VE = [
  { year: 2020, penetration: 2 },
  { year: 2024, penetration: 10 },
  { year: 2025, penetration: 20 },
  { year: 2026, penetration: 27 }
];
const MECATRONIQUE_SALARIES = [
  { profile: "Débutant grande école d'État", salary: 10000 },
  { profile: "Confirmé 3-5 ans", salary: 17500 },
  { profile: "Senior multinationale", salary: 25000 }
];
// ...existing code...

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ApplicantQuizBranch } from "@/applicant/types";
import type { SiteLocale } from "@/config/locales";

type BranchKey = ApplicantQuizBranch;
type OrientationSection = "modules" | "careers" | "companies" | "projects";

type ChartItem = {
  label: string;
  value: string;
  weight?: number;
  note?: string;
};

type BranchContent = {
  shortLabel: string;
  fullName: string;
  tagline: string;
  description: string;
  focusAreas: string[];
  highlights: ChartItem[];
  chart?: ChartItem[];
  modules: string[];
  careers: string[];
  companies: string[];
  projects: string[];
  color: string;
};

type GiKpi = {
  label: string;
  value2024: number;
  value2030: number;
  unit?: string;
  prefix2024?: string;
  prefix2030?: string;
  suffix2024?: string;
  suffix2030?: string;
  decimals?: number;
  source: string;
  note: string;
  accent: string;
};

type GiSeriesItem = {
  year: string;
  value: number;
  dataType: string;
  source: string;
  interpretation: string;
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
      chart: [
        { label: "Salaire junior Maroc", value: "10 000 - 15 000 DH/mois", weight: 62 },
        { label: "Investissement H2 vert Maroc", value: "319 Mds DH (2025)", weight: 92 },
        { label: "Capacite ENR installee", value: "5 466 MW (2024)", weight: 78 },
        { label: "Objectif mix ENR 2030", value: "52%", weight: 52 },
        { label: "Part demande mondiale H2 visee", value: "4% d'ici 2030", weight: 38 },
        { label: "Emplois secteur energie", value: "75 000+", weight: 70 },
        { label: "Formations specialisees au Maroc", value: "Tres rares -> avantage concurrentiel", weight: 66 }
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
      fullName: "Genie mecanique",
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
      fullName: "Genie industriel",
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
      chart: [
        { label: "راتب مبتدئ في المغرب", value: "10,000-15,000 MAD/شهر", weight: 62 },
        { label: "استثمار الهيدروجين الأخضر (المغرب)", value: "319 مليار MAD (2025)", weight: 92 },
        { label: "القدرة المتجددة المركبة", value: "5,466 MW (2024)", weight: 78 },
        { label: "هدف حصة الطاقات المتجددة 2030", value: "52%", weight: 52 },
        { label: "حصة الطلب العالمي على الهيدروجين", value: "4% بحلول 2030", weight: 38 },
        { label: "وظائف قطاع الطاقة", value: "75,000+", weight: 70 },
        { label: "تكوينات متخصصة في المغرب", value: "نادرة جدا -> ميزة تنافسية", weight: 66 }
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
      focusAreas: ["الطاقات المتجددة", "إلكترونيات القدرة", "الأنظمة المضمنة", "الشبكات الذكية", "الذكاء الاصطناعي وبيانات الطاقة"],
      highlights: [
        { value: "5 466 MW", label: "القدرة المتجددة المركبة (2024)" },
        { value: "52%", label: "هدف الطاقات المتجددة في مزيج الكهرباء (2030)" },
        { value: "319 مليار DH", label: "مشاريع الهيدروجين الأخضر المعتمدة (2025)" },
        { value: "75 000+", label: "وظائف الطاقة المستحدثة في المغرب" }
      ],
      chart: [
        { label: "Junior salary in Morocco", value: "10,000-15,000 MAD/month", weight: 62 },
        { label: "Green H2 investment (Morocco)", value: "319 Bn MAD (2025)", weight: 92 },
        { label: "Installed renewable capacity", value: "5,466 MW (2024)", weight: 78 },
        { label: "Renewables mix target 2030", value: "52%", weight: 52 },
        { label: "Global H2 demand share target", value: "4% by 2030", weight: 38 },
        { label: "Energy sector jobs", value: "75,000+", weight: 70 },
        { label: "Specialized training in Morocco", value: "Very rare -> competitive edge", weight: 66 }
      ],
      modules: ["الطاقات المتجددة", "إلكترونيات القدرة", "الأنظمة المضمنة", "الذكاء الاصطناعي التطبيقي", "التحكم المتقدم"],
      careers: ["مهندس طاقة", "مهندس شبكات ذكية", "مهندس أنظمة ذكية", "مستشار الانتقال الطاقي"],
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
      focusAreas: ["التصميم والابتكار", "المحاكاة العددية", "المواد والعمليات", "الإنتاج والصيانة", "التوائم الرقمية"],
      highlights: [
        { value: "26.4 مليار DH", label: "صادرات الطيران (2024)" },
        { value: "200+", label: "فاعلون في قطاع السيارات بالمغرب" },
        { value: "24 000+", label: "وظائف الطيران" }
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
      focusAreas: ["الروبوتيك والرؤية", "الأنظمة المضمنة", "التحكم المتقدم", "إلكترونيات القدرة", "الذكاء الاصطناعي التطبيقي"],
      highlights: [
        { value: "205.5 مليار USD", label: "سوق الروبوتات العالمي بحلول 2030" },
        { value: "110 مليار USD", label: "سوق الأنظمة المضمنة (2024)" },
        { value: "600 000+", label: "مركبات منتجة سنويًا في المغرب" },
        { value: "553 052", label: "روبوتات صناعية مركبة في 2024" }
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
      focusAreas: ["Lean والتميز التشغيلي", "سلسلة الإمداد واللوجستيك", "بيانات/ذكاء اصطناعي صناعي", "الأتمتة والروبوتيك", "الجودة وPLM"],
      highlights: [
        { value: "898 مليار DH", label: "رقم معاملات الصناعة (2024)" },
        { value: "90 مليار DH", label: "الاستثمارات الصناعية (2024)" },
        { value: "42 700", label: "وظائف صناعية مستحدثة (2024)" },
        { value: "1.5 مليار USD", label: "سوق الصناعة 4.0 في المغرب" }
      ],
      modules: ["التصنيع الرشيق", "سلسلة الإمداد", "الجودة", "بحوث العمليات", "الصناعة 4.0"],
      careers: ["مهندس جودة", "مدير سلسلة الإمداد", "مستشار التصنيع الرشيق", "مهندس أداء"],
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

const GESI_RENEWABLES_CURVE = [
  { year: "2000", capacity: 1221, mix: 24 },
  { year: "2010", capacity: 1400, mix: 28 },
  { year: "2015", capacity: 2767, mix: 30 },
  { year: "2017", capacity: 2530, mix: 30 },
  { year: "2018", capacity: 3270, mix: 35 },
  { year: "2021", capacity: 4067, mix: 37.1 },
  { year: "2022", capacity: 4154, mix: 37.6 },
  { year: "2023", capacity: 4618, mix: 40.4 },
  { year: "2024", capacity: 5466, mix: 45.3 },
  { year: "2030", capacity: 20000, mix: 52 }
];

const GESI_WIND_CURVE = [
  { year: "2000", capacity: 50 },
  { year: "2021", capacity: 1466 },
  { year: "2025", capacity: 2451 }
];

const MECA_SALARIES_BY_LOCALE: Record<
  SiteLocale,
  { profile: string; salary: string; min: number; max: number }[]
> = {
  fr: [
    { profile: "Débutant\ngrande école", salary: "11 500-13 000 DH", min: 11500, max: 13000 },
    { profile: "Débutant\nENSA/EMI", salary: "7 500-8 500 DH", min: 7500, max: 8500 },
    { profile: "Confirmé\n(3-5 ans)", salary: "15 000-22 000 DH", min: 15000, max: 22000 },
    { profile: "Senior\nGrandes multinationales", salary: "20 000-30 000 DH", min: 20000, max: 30000 }
  ],
  en: [
    { profile: "Entry-level\nTop engineering school", salary: "11,500-13,000 MAD", min: 11500, max: 13000 },
    { profile: "Entry-level\nENSA/EMI", salary: "7,500-8,500 MAD", min: 7500, max: 8500 },
    { profile: "Mid-level\n(3-5 years)", salary: "15,000-22,000 MAD", min: 15000, max: 22000 },
    { profile: "Senior\nLarge multinationals", salary: "20,000-30,000 MAD", min: 20000, max: 30000 }
  ],
  ar: [
    { profile: "مبتدئ\nمدرسة هندسة كبرى", salary: "11 500-13 000 DH", min: 11500, max: 13000 },
    { profile: "مبتدئ\nENSA/EMI", salary: "7 500-8 500 DH", min: 7500, max: 8500 },
    { profile: "متوسط\n(3-5 سنوات)", salary: "15 000-22 000 DH", min: 15000, max: 22000 },
    { profile: "خبير\nشركات متعددة الجنسيات", salary: "20 000-30 000 DH", min: 20000, max: 30000 }
  ]
};


const MECA_AUTOMOTIVE = [
  { year: "2010", production: 100000, exports: 20, emplois: 50000 },
  { year: "2014", production: 300000, exports: 40, emplois: 90000 },
  { year: "2019", production: 560000, exports: 80, emplois: 140000 },
  { year: "2020", production: 500000, exports: 72, emplois: 130000 },
  { year: "2022", production: 620000, exports: 100, emplois: 160000 },
  { year: "2023", production: 700000, exports: 141.76, emplois: 170000 },
  { year: "2024", production: 700000, exports: 92.7, emplois: 180000 }
];

const MECA_AERONAUTIQUE = [
  { year: "2004", enterprises: 10, emplois: 3000, exports: 0.7, integration: 5 },
  { year: "2014", enterprises: 80, emplois: 8000, exports: 8, integration: 17 },
  { year: "2019", enterprises: 140, emplois: 16700, exports: 15, integration: 35 },
  { year: "2020", enterprises: 140, emplois: 15000, exports: 12.4, integration: 38 },
  { year: "2023", enterprises: 142, emplois: 23000, exports: 21.8, integration: 42 },
  { year: "2024", enterprises: 150, emplois: 26000, exports: 26.4, integration: 42 }
];

const GI_DIGITAL_FACTORIES: Record<SiteLocale, GiSeriesItem[]> = {
  fr: [
    {
      year: "2019",
      value: 10,
      dataType: "Officielle",
      source: "PAI 1.0 — Programme Accélération Industrielle — Ministère Industrie et Commerce (mcinet.gov.ma)",
      interpretation: "Point de départ: seulement 1 usine sur 10 était digitalisée en 2019."
    },
    {
      year: "2021",
      value: 30,
      dataType: "Officielle — déclaration ministérielle",
      source: "Déclaration M. Moulay Hafid Elalamy à la Global Industry 4.0 Conference 2021",
      interpretation: "Triplement en 2 ans (+20 pts). La digitalisation accelere sous l'effet du PAI."
    },
    {
      year: "2022",
      value: 36,
      dataType: "Estimee (interpolation lineaire CAGR)",
      source: "Interpolation entre 30% (2021 officiel) et 100% (2030 objectif PAI 2.0)",
      interpretation: "Progression reguliere confirmee par les entreprises (Barometre Industrie 2023)."
    },
    {
      year: "2023",
      value: 42,
      dataType: "Estimee (interpolation lineaire CAGR)",
      source: "Interpolation entre 30% (2021 officiel) et 100% (2030 objectif PAI 2.0)",
      interpretation: "Acceleration confirmee par l'augmentation des investissements industriels (+103% en 2023)."
    },
    {
      year: "2024",
      value: 48,
      dataType: "Estimee (interpolation lineaire CAGR)",
      source: "Interpolation entre 30% (2021 officiel) et 100% (2030 objectif PAI 2.0)",
      interpretation: "Presque 1 usine sur 2 digitalisee: point de bascule vers la majorite."
    },
    {
      year: "2030",
      value: 100,
      dataType: "Objectif national officiel",
      source: "PAI 2.0 ? Programme Acceleration Industrielle 2021-2030 ? Ministere Industrie",
      interpretation: "100% = toutes les usines integrent au moins une brique Industrie 4.0."
    }
  ],
  en: [
    {
      year: "2019",
      value: 10,
      dataType: "Official",
      source: "PAI 1.0 ? Industrial Acceleration Program ? Ministry of Industry and Trade (mcinet.gov.ma)",
      interpretation: "Starting point: only 1 factory out of 10 was digitized in 2019."
    },
    {
      year: "2021",
      value: 30,
      dataType: "Official ? ministerial statement",
      source: "Statement by Mr. Moulay Hafid Elalamy at the Global Industry 4.0 Conference 2021",
      interpretation: "Tripled in 2 years (+20 pts). Digitization accelerates under the PAI."
    },
    {
      year: "2022",
      value: 36,
      dataType: "Estimated (linear CAGR interpolation)",
      source: "Interpolation between 30% (official 2021) and 100% (PAI 2.0 target 2030)",
      interpretation: "Steady progress confirmed by companies (Industry Barometer 2023)."
    },
    {
      year: "2023",
      value: 42,
      dataType: "Estimated (linear CAGR interpolation)",
      source: "Interpolation between 30% (official 2021) and 100% (PAI 2.0 target 2030)",
      interpretation: "Acceleration confirmed by the increase in industrial investments (+103% in 2023)."
    },
    {
      year: "2024",
      value: 48,
      dataType: "Estimated (linear CAGR interpolation)",
      source: "Interpolation between 30% (official 2021) and 100% (PAI 2.0 target 2030)",
      interpretation: "Nearly 1 in 2 factories digitized: a tipping point toward majority adoption."
    },
    {
      year: "2030",
      value: 100,
      dataType: "Official national target",
      source: "PAI 2.0 ? Industrial Acceleration Program 2021-2030 ? Ministry of Industry",
      interpretation: "100% = all factories integrate at least one Industry 4.0 building block."
    }
  ],
  ar: [
    {
      year: "2019",
      value: 10,
      dataType: "رسمي",
      source: "PAI 1.0 — برنامج التسريع الصناعي — وزارة الصناعة والتجارة (mcinet.gov.ma)",
      interpretation: "نقطة البداية: مصنع واحد فقط من أصل 10 كان مُرقمنًا في 2019."
    },
    {
      year: "2021",
      value: 30,
      dataType: "رسمي — تصريح وزاري",
      source: "تصريح السيد مولاي حفيظ العلمي في مؤتمر الصناعة 4.0 العالمي 2021",
      interpretation: "تضاعف ثلاث مرات خلال سنتين (+20 نقطة). تسارع الرقمنة تحت تأثير PAI."
    },
    {
      year: "2022",
      value: 36,
      dataType: "تقديري (استيفاء خطي لمعدل النمو السنوي المركب)",
      source: "استيفاء بين 30% (رسمي 2021) و100% (هدف PAI 2.0 لعام 2030)",
      interpretation: "تقدم منتظم تؤكده الشركات (بارومتر الصناعة 2023)."
    },
    {
      year: "2023",
      value: 42,
      dataType: "تقديري (استيفاء خطي لمعدل النمو السنوي المركب)",
      source: "استيفاء بين 30% (رسمي 2021) و100% (هدف PAI 2.0 لعام 2030)",
      interpretation: "تسارع تؤكده زيادة الاستثمارات الصناعية (+103% في 2023)."
    },
    {
      year: "2024",
      value: 48,
      dataType: "تقديري (استيفاء خطي لمعدل النمو السنوي المركب)",
      source: "استيفاء بين 30% (رسمي 2021) و100% (هدف PAI 2.0 لعام 2030)",
      interpretation: "تقريبًا مصنع من كل مصنعين مُرقمن: نقطة تحول نحو الغالبية."
    },
    {
      year: "2030",
      value: 100,
      dataType: "هدف وطني رسمي",
      source: "PAI 2.0 — برنامج التسريع الصناعي 2021-2030 — وزارة الصناعة",
      interpretation: "100% = كل المصانع تدمج على الأقل لبنة واحدة من الصناعة 4.0."
    }
  ]
};


const GI_TALENTS_PER_YEAR: Record<SiteLocale, GiSeriesItem[]> = {
  fr: [
    {
      year: "2019",
      value: 10000,
      dataType: "Estimee (CAGR)",
      source: "Extrapolation depuis base 2022 (Strategie Maroc Digital 2030 ? mtne.gov.ma)",
      interpretation: "Base de reference avant le Plan National de Formation Numerique."
    },
    {
      year: "2020",
      value: 11500,
      dataType: "Estimee (CAGR)",
      source: "Extrapolation depuis base 2022 (Strategie Maroc Digital 2030 ? mtne.gov.ma)",
      interpretation: "Legere progression malgre Covid: le numerique resiste."
    },
    {
      year: "2021",
      value: 12800,
      dataType: "Estimee (CAGR)",
      source: "Extrapolation depuis base 2022 (Strategie Maroc Digital 2030 ? mtne.gov.ma)",
      interpretation: "Acceleration post-Covid: besoin national en competences digitales."
    },
    {
      year: "2022",
      value: 14000,
      dataType: "Officielle",
      source: "Strategie Maroc Digital 2030 ? Ministere Transition Numerique (mtne.gov.ma) ? publiee 09/2024",
      interpretation: "Chiffre de reference officiel."
    },
    {
      year: "2023",
      value: 18000,
      dataType: "Estimee (CAGR)",
      source: "Extrapolation vers objectif 2030 (Strategie Maroc Digital 2030)",
      interpretation: "Mise en oeuvre: ecoles et universites augmentent leurs capacites."
    },
    {
      year: "2024",
      value: 24000,
      dataType: "Estimee (CAGR)",
      source: "Extrapolation vers objectif 2030 (Strategie Maroc Digital 2030)",
      interpretation: "+71% vs 2022: bootcamps et formations courtes accelerent."
    },
    {
      year: "2030",
      value: 100000,
      dataType: "Objectif national officiel",
      source: "Strategie Maroc Digital 2030 ? Ministere Transition Numerique (mtne.gov.ma)",
      interpretation: "Objectif x7 vs 2022: penurie de profils qualifies = avantage salarial."
    }
  ],
  en: [
    {
      year: "2019",
      value: 10000,
      dataType: "Estimated (CAGR)",
      source: "Extrapolation from 2022 baseline (Morocco Digital 2030 Strategy ? mtne.gov.ma)",
      interpretation: "Baseline before the National Digital Training Plan."
    },
    {
      year: "2020",
      value: 11500,
      dataType: "Estimated (CAGR)",
      source: "Extrapolation from 2022 baseline (Morocco Digital 2030 Strategy ? mtne.gov.ma)",
      interpretation: "Slight growth despite Covid: digital holds up."
    },
    {
      year: "2021",
      value: 12800,
      dataType: "Estimated (CAGR)",
      source: "Extrapolation from 2022 baseline (Morocco Digital 2030 Strategy ? mtne.gov.ma)",
      interpretation: "Post-Covid acceleration: national demand for digital skills."
    },
    {
      year: "2022",
      value: 14000,
      dataType: "Official",
      source: "Morocco Digital 2030 Strategy ? Ministry of Digital Transition (mtne.gov.ma) ? published 09/2024",
      interpretation: "Official reference figure."
    },
    {
      year: "2023",
      value: 18000,
      dataType: "Estimated (CAGR)",
      source: "Extrapolation toward the 2030 target (Morocco Digital 2030 Strategy)",
      interpretation: "Rollout: schools and universities increase capacity."
    },
    {
      year: "2024",
      value: 24000,
      dataType: "Estimated (CAGR)",
      source: "Extrapolation toward the 2030 target (Morocco Digital 2030 Strategy)",
      interpretation: "+71% vs 2022: bootcamps and short programs accelerate."
    },
    {
      year: "2030",
      value: 100000,
      dataType: "Official national target",
      source: "Morocco Digital 2030 Strategy ? Ministry of Digital Transition (mtne.gov.ma)",
      interpretation: "Target x7 vs 2022: shortage of qualified profiles = salary advantage."
    }
  ],
  ar: [
    {
      year: "2019",
      value: 10000,
      dataType: "تقديري (معدل النمو السنوي المركب)",
      source: "استقراء انطلاقًا من خط الأساس لعام 2022 (استراتيجية المغرب الرقمي 2030 — mtne.gov.ma)",
      interpretation: "خط أساس قبل البرنامج الوطني للتكوين الرقمي."
    },
    {
      year: "2020",
      value: 11500,
      dataType: "تقديري (معدل النمو السنوي المركب)",
      source: "استقراء انطلاقًا من خط الأساس لعام 2022 (استراتيجية المغرب الرقمي 2030 — mtne.gov.ma)",
      interpretation: "تقدم طفيف رغم كوفيد: الرقمي صامد."
    },
    {
      year: "2021",
      value: 12800,
      dataType: "تقديري (معدل النمو السنوي المركب)",
      source: "استقراء انطلاقًا من خط الأساس لعام 2022 (استراتيجية المغرب الرقمي 2030 — mtne.gov.ma)",
      interpretation: "تسارع بعد كوفيد: حاجة وطنية للمهارات الرقمية."
    },
    {
      year: "2022",
      value: 14000,
      dataType: "رسمي",
      source: "استراتيجية المغرب الرقمي 2030 — وزارة الانتقال الرقمي (mtne.gov.ma) — نُشرت 09/2024",
      interpretation: "رقم مرجعي رسمي."
    },
    {
      year: "2023",
      value: 18000,
      dataType: "تقديري (معدل النمو السنوي المركب)",
      source: "استقراء نحو هدف 2030 (استراتيجية المغرب الرقمي 2030)",
      interpretation: "التنفيذ: المدارس والجامعات ترفع قدراتها."
    },
    {
      year: "2024",
      value: 24000,
      dataType: "تقديري (معدل النمو السنوي المركب)",
      source: "استقراء نحو هدف 2030 (استراتيجية المغرب الرقمي 2030)",
      interpretation: "+71% مقارنة بـ2022: المعسكرات التدريبية والبرامج القصيرة تتسارع."
    },
    {
      year: "2030",
      value: 100000,
      dataType: "هدف وطني رسمي",
      source: "استراتيجية المغرب الرقمي 2030 — وزارة الانتقال الرقمي (mtne.gov.ma)",
      interpretation: "هدف ×7 مقارنة بـ2022: ندرة الكفاءات المؤهلة = ميزة على مستوى الأجور."
    }
  ]
};


const GI_INDUSTRIAL_REVENUE = [
  {
    year: "2019",
    revenue: 480,
    investments: 22,
    source: "Barometre Industrie Nationale 2022 — Ministere Industrie et Commerce (mcinet.gov.ma)",
    interpretation: "Niveau pre-Covid: croissance stable mais moderee."
  },
  {
    year: "2020",
    revenue: 430,
    investments: 18,
    source: "Barometre Industrie Nationale 2022 — Ministere Industrie et Commerce (mcinet.gov.ma)",
    interpretation: "Choc Covid: -10% CA et -18% investissements."
  },
  {
    year: "2021",
    revenue: 560,
    investments: 25,
    source: "Barometre Industrie Nationale 2022 — Ministere Industrie et Commerce (mcinet.gov.ma)",
    interpretation: "Rebond post-Covid: +30% CA."
  },
  {
    year: "2022",
    revenue: 801,
    investments: 34,
    source: "Barometre Industrie Nationale 2023 — Ministere Industrie et Commerce (mcinet.gov.ma)",
    interpretation: "Record historique: +43% vs 2021."
  },
  {
    year: "2023",
    revenue: 822,
    investments: 69,
    source: "Barometre Industrie Nationale 2024 — Ministere Industrie et Commerce (mcinet.gov.ma)",
    interpretation: "Consolidation et doublement des investissements."
  },
  {
    year: "2024",
    revenue: 898,
    investments: 90,
    source: "Barometre Industrie Nationale 2025 — Ministere Industrie et Commerce (mcinet.gov.ma)",
    interpretation: "+9% CA et +30% investissements: l'industrie 4.0 tire la croissance."
  }
];

const GI_DIGITAL_EXPORTS = [
  {
    year: "2019",
    exports: 8,
    jobs: 90000,
    source: "Strategie Maroc Digital 2030 — Ministere Transition Numerique (mtne.gov.ma)",
    interpretation: "Base de reference: debut de l'offshoring numerique."
  },
  {
    year: "2020",
    exports: 9.5,
    jobs: 95000,
    source: "Strategie Maroc Digital 2030 — Ministere Transition Numerique (mtne.gov.ma)",
    interpretation: "Resilience Covid: le numerique progresse."
  },
  {
    year: "2021",
    exports: 12,
    jobs: 105000,
    source: "Strategie Maroc Digital 2030 — Ministere Transition Numerique (mtne.gov.ma)",
    interpretation: "Acceleration post-Covid et demande offshore mondiale."
  },
  {
    year: "2022",
    exports: 15,
    jobs: 120000,
    source: "Strategie Maroc Digital 2030 — Ministere Transition Numerique (mtne.gov.ma)",
    interpretation: "+25%: le Maroc devient destination majeure pour les ESN."
  },
  {
    year: "2023",
    exports: 17.9,
    jobs: 130000,
    source: "Strategie Maroc Digital 2030 — Ministere Transition Numerique (mtne.gov.ma)",
    interpretation: "Chiffre officiel de reference: 130 000 emplois directs."
  },
  {
    year: "2030",
    exports: 40,
    jobs: 270000,
    source: "Strategie Maroc Digital 2030 — Ministere Transition Numerique (mtne.gov.ma)",
    interpretation: "Objectif x2.2 exports et x2.1 emplois."
  }
];

const GI_KPIS: Record<SiteLocale, GiKpi[]> = {
  fr: [
    {
      label: "Usines digitalisees",
      value2024: 48,
      value2030: 100,
      unit: "%",
      prefix2024: "~",
      source: "PAI 2.0 ? Ministere Industrie (mcinet.gov.ma)",
      note: "52% des usines restent a digitaliser = marche emploi a creer d'ici 2030.",
      accent: "#38bdf8"
    },
    {
      label: "Talents numeriques formes/an",
      value2024: 24000,
      value2030: 100000,
      source: "Strategie Maroc Digital 2030 (mtne.gov.ma)",
      note: "Penurie structurelle garantie = salaires eleves et emploi assure.",
      accent: "#4ade80"
    },
    {
      label: "CA industriel",
      value2024: 898,
      value2030: 1500,
      unit: "Mds DH",
      suffix2030: "+",
      source: "Barometre Industrie Nationale 2025 (mcinet.gov.ma)",
      note: "Marche en forte croissance = plus d'entreprises = plus de postes.",
      accent: "#fb923c"
    },
    {
      label: "Investissements industriels",
      value2024: 90,
      value2030: 150,
      unit: "Mds DH",
      suffix2030: "+",
      source: "Barometre Industrie Nationale 2025 (mcinet.gov.ma)",
      note: "+30% en un an = besoin en ingenieurs urgent.",
      accent: "#fb923c"
    },
    {
      label: "Export numerique",
      value2024: 17.9,
      value2030: 40,
      unit: "Mds DH",
      decimals: 1,
      source: "Strategie Maroc Digital 2030 (mtne.gov.ma)",
      note: "Le Maroc devient hub numerique africain = opportunites locales et internationales.",
      accent: "#c084fc"
    },
    {
      label: "Emplois numeriques",
      value2024: 130000,
      value2030: 270000,
      unit: "emplois",
      source: "Strategie Maroc Digital 2030 (mtne.gov.ma)",
      note: "x2 emplois en 6 ans = une generation doit se former maintenant.",
      accent: "#c084fc"
    },
    {
      label: "Emplois industriels total",
      value2024: 1038133,
      value2030: 1300000,
      unit: "emplois",
      suffix2030: "+",
      source: "Barometre Industrie Nationale 2025 (mcinet.gov.ma)",
      note: "Le million depasse en 2024: 1er employeur prive du pays.",
      accent: "#38bdf8"
    },
    {
      label: "Marche Industrie 4.0 Maroc",
      value2024: 1.5,
      value2030: 4.0,
      unit: "Mds USD",
      decimals: 1,
      source: "Estimation ? Mordor Intelligence + PAI 2.0",
      note: "CAGR +23%: le marche local quadruple d'ici 2030.",
      accent: "#4ade80"
    }
  ],
  en: [
    {
      label: "Digitized factories",
      value2024: 48,
      value2030: 100,
      unit: "%",
      prefix2024: "~",
      source: "PAI 2.0 ? Ministry of Industry (mcinet.gov.ma)",
      note: "52% of factories still need digitization = job market to build by 2030.",
      accent: "#38bdf8"
    },
    {
      label: "Digital talents trained/year",
      value2024: 24000,
      value2030: 100000,
      source: "Morocco Digital 2030 Strategy (mtne.gov.ma)",
      note: "Structural shortage guaranteed = high salaries and secure jobs.",
      accent: "#4ade80"
    },
    {
      label: "Industrial revenue",
      value2024: 898,
      value2030: 1500,
      unit: "Bn MAD",
      suffix2030: "+",
      source: "National Industry Barometer 2025 (mcinet.gov.ma)",
      note: "Fast-growing market = more companies = more positions.",
      accent: "#fb923c"
    },
    {
      label: "Industrial investments",
      value2024: 90,
      value2030: 150,
      unit: "Bn MAD",
      suffix2030: "+",
      source: "National Industry Barometer 2025 (mcinet.gov.ma)",
      note: "+30% in one year = urgent need for engineers.",
      accent: "#fb923c"
    },
    {
      label: "Digital exports",
      value2024: 17.9,
      value2030: 40,
      unit: "Bn MAD",
      decimals: 1,
      source: "Morocco Digital 2030 Strategy (mtne.gov.ma)",
      note: "Morocco becomes an African digital hub = local and international opportunities.",
      accent: "#c084fc"
    },
    {
      label: "Digital jobs",
      value2024: 130000,
      value2030: 270000,
      unit: "jobs",
      source: "Morocco Digital 2030 Strategy (mtne.gov.ma)",
      note: "x2 jobs in 6 years = a generation must train now.",
      accent: "#c084fc"
    },
    {
      label: "Total industrial jobs",
      value2024: 1038133,
      value2030: 1300000,
      unit: "jobs",
      suffix2030: "+",
      source: "National Industry Barometer 2025 (mcinet.gov.ma)",
      note: "One million surpassed in 2024: largest private employer in the country.",
      accent: "#38bdf8"
    },
    {
      label: "Morocco Industry 4.0 market",
      value2024: 1.5,
      value2030: 4.0,
      unit: "Bn USD",
      decimals: 1,
      source: "Estimate ? Mordor Intelligence + PAI 2.0",
      note: "CAGR +23%: local market quadruples by 2030.",
      accent: "#4ade80"
    }
  ],
  ar: [
    {
      label: "مصانع مُرقمنة",
      value2024: 48,
      value2030: 100,
      unit: "%",
      prefix2024: "~",
      source: "PAI 2.0 — وزارة الصناعة (mcinet.gov.ma)",
      note: "ما زال 52% من المصانع بحاجة إلى الرقمنة = سوق وظائف كبير حتى 2030.",
      accent: "#38bdf8"
    },
    {
      label: "مواهب رقمية مُكوَّنة/سنة",
      value2024: 24000,
      value2030: 100000,
      source: "استراتيجية المغرب الرقمي 2030 (mtne.gov.ma)",
      note: "ندرة هيكلية مؤكدة = أجور مرتفعة ووظائف مضمونة.",
      accent: "#4ade80"
    },
    {
      label: "رقم معاملات الصناعة",
      value2024: 898,
      value2030: 1500,
      unit: "مليار DH",
      suffix2030: "+",
      source: "بارومتر الصناعة الوطنية 2025 (mcinet.gov.ma)",
      note: "سوق في نمو قوي = شركات أكثر = وظائف أكثر.",
      accent: "#fb923c"
    },
    {
      label: "الاستثمارات الصناعية",
      value2024: 90,
      value2030: 150,
      unit: "مليار DH",
      suffix2030: "+",
      source: "بارومتر الصناعة الوطنية 2025 (mcinet.gov.ma)",
      note: "+30% في سنة واحدة = حاجة ملحّة للمهندسين.",
      accent: "#fb923c"
    },
    {
      label: "الصادرات الرقمية",
      value2024: 17.9,
      value2030: 40,
      unit: "مليار DH",
      decimals: 1,
      source: "استراتيجية المغرب الرقمي 2030 (mtne.gov.ma)",
      note: "المغرب يصبح مركزًا رقميًا إفريقيًا = فرص محلية ودولية.",
      accent: "#c084fc"
    },
    {
      label: "وظائف رقمية",
      value2024: 130000,
      value2030: 270000,
      unit: "وظائف",
      source: "استراتيجية المغرب الرقمي 2030 (mtne.gov.ma)",
      note: "مضاعفة الوظائف خلال 6 سنوات = جيل يحتاج إلى التكوين الآن.",
      accent: "#c084fc"
    },
    {
      label: "إجمالي الوظائف الصناعية",
      value2024: 1038133,
      value2030: 1300000,
      unit: "وظائف",
      suffix2030: "+",
      source: "بارومتر الصناعة الوطنية 2025 (mcinet.gov.ma)",
      note: "تجاوز المليون في 2024: أكبر مشغّل خاص في البلاد.",
      accent: "#38bdf8"
    },
    {
      label: "سوق الصناعة 4.0 في المغرب",
      value2024: 1.5,
      value2030: 4.0,
      unit: "مليار USD",
      decimals: 1,
      source: "تقدير — Mordor Intelligence + PAI 2.0",
      note: "نمو سنوي مركب +23%: السوق المحلي يتضاعف أربع مرات بحلول 2030.",
      accent: "#4ade80"
    }
  ]
};


const GESI_SOURCE_URL =
  "https://www.natural-net.fr/blog-agence-web/2025/01/08/intelligence-artificielle-et-seo-les-nouvelles-strategies-pour-optimiser-son-referencement.html";

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
    energyCurveTitle: string;
    energyCurveSubtitle: string;
    energyLegendCapacity: string;
    energyLegendMix: string;
    windCurveTitle: string;
    windCurveSubtitle: string;
    windLegendCapacity: string;
    giSectionTitle: string;
    giSectionSubtitle: string;
    giDataset1Title: string;
    giDataset2Title: string;
    giDataset3Title: string;
    giDataset4Title: string;
    giKpiTitle: string;
    giKpiSubtitle: string;
    giLegendFactories: string;
    giLegendTalents: string;
    giLegendRevenue: string;
    giLegendInvestments: string;
    giLegendExports: string;
    giLegendJobs: string;
    sourceLabel: string;
    mecaSalariesTitle: string;
    mecaSalariesSubtitle: string;
    mecaAutomotiveTitle: string;
    mecaAutomotiveSubtitle: string;
    mecaAeronauticTitle: string;
    mecaAeronauticSubtitle: string;
    datasetLabel: string;
    datasetsTitle: string;
    statLabel: string;
    kpiTargetLabel: string;
    perYearLabel: string;
    advancedTrackLabel: string;
    salaryOutlookTitle: string;
    roboticsMarketTitle: string;
    evPenetrationTitle: string;
    productionLabel: string;
    jobsLabel: string;
    sections: Record<OrientationSection, string>;
  }
> = {
  fr: {
    recommended: "Profil recommande",
    projectLink: "Lien avec ton projet",
    chooseBranch: "Explore les parcours du departement et compare-les a ton profil.",
    highlightsTitle: "Indicateurs & performance",
    focusTitle: "Axes principaux",
    downloadTitle: "Guide PDF par filiere",
    downloadBody:
      "Pour faciliter ta recherche, nous avons prepare un guide PDF pour chaque filiere. Choisis celui qui t'interesse, mais rappelle-toi: ta decision doit venir de toi, pas des recommandations des autres, car toi seul construis ton futur.",
    downloadCta: "Telecharger le guide",
    energyCurveTitle: "La courbe qui convainc - Capacite ENR Maroc",
    energyCurveSubtitle:
      "La puissance installee renouvelable a triple depuis 2000, de 1 221 MW a 4 067 MW en 2021, tiree par l'eolien et le solaire. Valeurs ~ pour 2000/2010/2015/2017/2018.",
    energyLegendCapacity: "Capacite ENR (MW)",
    energyLegendMix: "Part dans le mix (%)",
    windCurveTitle: "L'eolien - la courbe la plus spectaculaire",
    windCurveSubtitle:
      "De 50 MW en 2000 a 1 466 MW en 2021, puis 2 451 MW en juin 2025. Production < 100 GWh -> > 5 000 GWh.",
    windLegendCapacity: "Capacite eolienne (MW)",
    giSectionTitle: "Industrie 4.0 - Radar Maroc",
    giSectionSubtitle: "Tableau de bord des signaux cles de la transformation industrielle.",
    giDataset1Title: "Usines digitalisees au Maroc (%)",
    giDataset2Title: "Talents numeriques formes par an",
    giDataset3Title: "CA industriel & investissements (Mds DH)",
    giDataset4Title: "Export numerique (Mds DH)",
    giKpiTitle: "KPIs cles 2024 -> 2030",
    giKpiSubtitle: "Lecture rapide des ecarts a combler et des opportunites.",
    giLegendFactories: "Usines digitalisees (%)",
    giLegendTalents: "Talents formes / an",
    giLegendRevenue: "CA industriel",
    giLegendInvestments: "Investissements",
    giLegendExports: "Export numerique",
    giLegendJobs: "Emplois numeriques",
    sourceLabel: "Source",
    mecaSalariesTitle: "Salaires ingenieur mecanique Maroc",
    mecaSalariesSubtitle: "Comparaison des salaires pour differents profils d'ingenieurs mecaniciens. Les salaires varient selon l'experience et l'origine de formation.",
    mecaAutomotiveTitle: "Secteur Automobile — La locomotive mecanique du Maroc",
    mecaAutomotiveSubtitle: "Evolution remarquable du secteur: production doublée en 15 ans, exports multipliés par 7. L'automobile tire la fabrication marocaine et genere plus de 180 000 emplois directs.",
    mecaAeronauticTitle: "Secteur Aeronautique — La filière mecanique de pointe",
    mecaAeronauticSubtitle: "Ascension fulgurante: 150 entreprises implantées, 26 000 emplois directs (doublement prévu d'ici 2030). Le Maroc est devenu la 5ème nation mondiale en dynamisme aéronautique.",
    datasetLabel: "Dataset",
    datasetsTitle: "Données & perspectives",
    statLabel: "Statistique",
    kpiTargetLabel: "Objectif 2030",
    perYearLabel: "/ an",
    advancedTrackLabel: "Filière de pointe",
    salaryOutlookTitle: "Perspectives salariales",
    roboticsMarketTitle: "Marché mondial robotique (Mds USD)",
    evPenetrationTitle: "Pénétration des véhicules électriques (%)",
    productionLabel: "Production",
    jobsLabel: "Emplois",
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
    highlightsTitle: "Indicators & performance",
    focusTitle: "Core focus",
    downloadTitle: "PDF guide per track",
    downloadBody:
      "To support your research, we prepared a PDF guide for each track. Pick the one that interests you, but remember: the choice should be yours, not driven by other people's recommendations.",
    downloadCta: "Download guide",
    energyCurveTitle: "المنحنى المقنع - قدرة الطاقات المتجددة في المغرب",
    energyCurveSubtitle:
      "تضاعفت القدرة المركبة للطاقة المتجددة منذ 2000، من 1,221 ميغاواط إلى 4,067 ميغاواط في 2021، مدفوعة بالرياح والشمس. القيم تقريبية لـ 2000/2010/2015/2017/2018.",
    energyLegendCapacity: "قدرة الطاقات المتجددة (ميغاواط)",
    energyLegendMix: "الحصة في المزيج (%)",
    windCurveTitle: "الرياح - المنحنى الأكثر لفتًا",
    windCurveSubtitle:
      "من 50 ميغاواط في 2000 إلى 1,466 ميغاواط في 2021، ثم 2,451 ميغاواط في يونيو 2025. الإنتاج < 100 غيغاواط ساعي -> > 5,000 غيغاواط ساعي.",
    windLegendCapacity: "قدرة طاقة الرياح (ميغاواط)",
    giSectionTitle: "الصناعة 4.0 - رادار المغرب",
    giSectionSubtitle: "لوحة مؤشرات للإشارات الأساسية للتحول الصناعي.",
    giDataset1Title: "المصانع المُرقمنة في المغرب (%)",
    giDataset2Title: "المواهب الرقمية المُكوَّنة سنويًا",
    giDataset3Title: "رقم معاملات الصناعة والاستثمارات (مليار درهم)",
    giDataset4Title: "الصادرات الرقمية (مليار درهم)",
    giKpiTitle: "مؤشرات رئيسية 2024 -> 2030",
    giKpiSubtitle: "قراءة سريعة للفجوات والفرص.",
    giLegendFactories: "مصانع مُرقمنة (%)",
    giLegendTalents: "مواهب مُكوَّنة/سنة",
    giLegendRevenue: "رقم معاملات الصناعة",
    giLegendInvestments: "الاستثمارات",
    giLegendExports: "الصادرات الرقمية",
    giLegendJobs: "وظائف رقمية",
    sourceLabel: "المصدر",
    mecaSalariesTitle: "Mechanical engineer salaries in Morocco",
    mecaSalariesSubtitle: "Salary comparison for different profiles of mechanical engineers. Salaries vary by experience and educational background.",
    mecaAutomotiveTitle: "Automotive Sector - Morocco's mechanical engine",
    mecaAutomotiveSubtitle: "Remarkable growth: production doubled in 15 years, exports multiplied by 7. Automotive drives Moroccan manufacturing and generates over 180,000 direct jobs.",
    mecaAeronauticTitle: "Aeronautic Sector - Advanced mechanical expertise",
    mecaAeronauticSubtitle: "Rapid rise: 150 companies established, 26,000 direct jobs (expected to double by 2030). Morocco has become the world's 5th most dynamic aerospace nation.",
    datasetLabel: "Dataset",
    datasetsTitle: "Data & outlook",
    statLabel: "Statistic",
    kpiTargetLabel: "2030 target",
    perYearLabel: "/ year",
    advancedTrackLabel: "Advanced track",
    salaryOutlookTitle: "Salary outlook",
    roboticsMarketTitle: "Global robotics market (Bn USD)",
    evPenetrationTitle: "EV penetration (%)",
    productionLabel: "Production",
    jobsLabel: "Jobs",
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
    highlightsTitle: "مؤشرات الأداء",
    focusTitle: "محاور أساسية",
    downloadTitle: "دليل PDF لكل مسلك",
    downloadBody:
      "لتسهيل مرحلة البحث، أعددنا دليلاً بصيغة PDF لكل مسلك. اختر ما يناسبك، وتذكّر أن القرار يجب أن يكون نابعاً منك وليس توصيات الآخرين، لأنك وحدك من يصنع مستقبلك.",
    downloadCta: "تحميل الدليل",
    energyCurveTitle: "The convincing curve - Morocco renewable capacity",
    energyCurveSubtitle:
      "Installed renewables tripled since 2000, from 1,221 MW to 4,067 MW in 2021, driven by wind and solar. Approx values for 2000/2010/2015/2017/2018.",
    energyLegendCapacity: "Renewable capacity (MW)",
    energyLegendMix: "Share in mix (%)",
    windCurveTitle: "Wind - the most dramatic curve",
    windCurveSubtitle:
      "From 50 MW in 2000 to 1,466 MW in 2021, then 2,451 MW in June 2025. Output < 100 GWh -> > 5,000 GWh.",
    windLegendCapacity: "Wind capacity (MW)",
    giSectionTitle: "Industry 4.0 - Morocco Radar",
    giSectionSubtitle: "Dashboard of key signals for industrial transformation.",
    giDataset1Title: "Digitalized factories in Morocco (%)",
    giDataset2Title: "Digital talents trained per year",
    giDataset3Title: "Industrial revenue & investments (Bn MAD)",
    giDataset4Title: "Digital exports (Bn MAD)",
    giKpiTitle: "Key KPIs 2024 -> 2030",
    giKpiSubtitle: "Quick read of gaps to close and opportunities.",
    giLegendFactories: "Digitalized factories (%)",
    giLegendTalents: "Talents trained / year",
    giLegendRevenue: "Industrial revenue",
    giLegendInvestments: "Industrial investments",
    giLegendExports: "Digital exports",
    giLegendJobs: "Digital jobs",
    sourceLabel: "Source",
    mecaSalariesTitle: "رواتب مهندس ميكانيكي في المغرب",
    mecaSalariesSubtitle: "مقارنة الرواتب لملامح مختلفة من مهندسي الميكانيكا. تتفاوت الرواتب حسب الخبرة والخلفية التعليمية.",
    mecaAutomotiveTitle: "القطاع السيارات - محرك المغرب الميكانيكي",
    mecaAutomotiveSubtitle: "نمو ملحوظ: تضاعفت الإنتاجية في 15 سنة، الصادرات تضاعفت 7 مرات. يولد قطاع السيارات أكثر من 180 الف منصب عمل مباشرة.",
    mecaAeronauticTitle: "القطاع الطيراني - الخبرة الميكانيكية المتقدمة",
    mecaAeronauticSubtitle: "ارتفاع سريع: 150 شركة منخرطة، 26 الف منصب عمل مباشر (من المتوقع أن يتضاعف بحلول 2030). أصبح المغرب الدولة الخامسة الأكثر ديناميكية في الفضاء الجوي.",
    datasetLabel: "مجموعة بيانات",
    datasetsTitle: "البيانات والآفاق",
    statLabel: "إحصائية",
    kpiTargetLabel: "هدف 2030",
    perYearLabel: "/ سنة",
    advancedTrackLabel: "مسلك متقدم",
    salaryOutlookTitle: "آفاق الأجور",
    roboticsMarketTitle: "سوق الروبوتات العالمي (مليار دولار)",
    evPenetrationTitle: "نسبة انتشار المركبات الكهربائية (%)",
    productionLabel: "الإنتاج",
    jobsLabel: "الوظائف",
    sections: {
      modules: "الوحدات الأساسية",
      careers: "الفرص",
      companies: "المؤسسات المستهدفة",
      projects: "مشاريع نموذجية"
    }
  }
};

type VisionBlock = {
  label: string;
  title: string;
  quote: string;
  source?: string;
  imageAlt: string;
};

const VISION_COPY: Record<
  SiteLocale,
  {
    gesi: [VisionBlock, VisionBlock];
    gi: [VisionBlock, VisionBlock];
    gm: [VisionBlock, VisionBlock];
    meca: [VisionBlock];
  }
> = {
  fr: {
    gesi: [
      {
        label: "Discours Royaux & Stratégie",
        title: "COP22 - Marrakech",
        quote:
          "Le Maroc a pris des initiatives concrètes pour assurer, à l'horizon 2030, 52% de sa capacité électrique nationale à partir de sources d'énergie propre.",
        source: "maroc.ma",
        imageAlt: "S.M. le Roi Mohammed VI"
      },
      {
        label: "Ministère de la Transition Énergétique",
        title: "Leila Benali - Vision 2025",
        quote:
          "L'intelligence artificielle est devenue le pivot du développement durable et intelligent du Maroc, optimisant la gestion du mix énergétique.",
        imageAlt: "Leila Benali"
      }
    ],
    gi: [
      {
        label: "Vision Industrielle",
        title: "Journée de l’Industrie",
        quote:
          "J'invite le secteur privé à s'investir dans des domaines de pointe et d'avenir, reposant sur l'innovation.",
        imageAlt: "Vision Royale"
      },
      {
        label: "Message Ministériel",
        title: "Ryad Mezzour - 2025",
        quote:
          "Nous formons des ingénieurs prêts à relever les défis d'une industrie moderne, verte et inclusive.",
        imageAlt: "Ryad Mezzour"
      }
    ],
    gm: [
      {
        label: "Innovation Mécatronique",
        title: "La Vision Royale",
        quote:
          "Nous appelons à investir dans les secteurs de pointe pour relever les défis de la souveraineté technologique.",
        imageAlt: "Vision Technologique"
      },
      {
        label: "Transition Numérique",
        title: "Ghita Mezzour - 2025",
        quote:
          "Le génie mécatronique est le moteur de l'innovation de demain. C'est la convergence du physique et du digital.",
        imageAlt: "Ghita Mezzour"
      }
    ],
    meca: [
      {
        label: "Excellence Mécanique",
        title: "Vision Royale",
        quote:
          "Le label \"Made in Morocco\" doit devenir le symbole d'une ingénierie d'excellence et de souveraineté.",
        imageAlt: "Ingénierie Royale"
      }
    ]
  },
  en: {
    gesi: [
      {
        label: "Royal speeches & strategy",
        title: "COP22 - Marrakech",
        quote:
          "Morocco has taken concrete initiatives to ensure that by 2030, 52% of its national electricity capacity comes from clean energy sources.",
        source: "maroc.ma",
        imageAlt: "H.M. King Mohammed VI"
      },
      {
        label: "Ministry of Energy Transition",
        title: "Leila Benali - Vision 2025",
        quote:
          "Artificial intelligence has become the pivot of Morocco’s sustainable and intelligent development, optimizing the management of the energy mix.",
        imageAlt: "Leila Benali"
      }
    ],
    gi: [
      {
        label: "Industrial vision",
        title: "Industry Day",
        quote:
          "I invite the private sector to invest in cutting-edge and future-oriented fields based on innovation.",
        imageAlt: "Royal vision"
      },
      {
        label: "Ministerial message",
        title: "Ryad Mezzour - 2025",
        quote:
          "We are training engineers ready to meet the challenges of a modern, green, and inclusive industry.",
        imageAlt: "Ryad Mezzour"
      }
    ],
    gm: [
      {
        label: "Mechatronics innovation",
        title: "Royal vision",
        quote:
          "We call for investment in cutting-edge sectors to meet the challenges of technological sovereignty.",
        imageAlt: "Technological vision"
      },
      {
        label: "Digital transition",
        title: "Ghita Mezzour - 2025",
        quote:
          "Mechatronics engineering is the engine of tomorrow’s innovation. It is the convergence of the physical and the digital.",
        imageAlt: "Ghita Mezzour"
      }
    ],
    meca: [
      {
        label: "Mechanical excellence",
        title: "Royal vision",
        quote:
          "The \"Made in Morocco\" label must become the symbol of engineering excellence and sovereignty.",
        imageAlt: "Royal engineering"
      }
    ]
  },
  ar: {
    gesi: [
      {
        label: "خطابات ملكية واستراتيجية",
        title: "COP22 - مراكش",
        quote:
          "اتخذ المغرب مبادرات ملموسة لضمان أن 52% من قدرته الكهربائية الوطنية بحلول 2030 تأتي من مصادر طاقة نظيفة.",
        source: "maroc.ma",
        imageAlt: "جلالة الملك محمد السادس"
      },
      {
        label: "وزارة الانتقال الطاقي",
        title: "ليلى بنعلي - رؤية 2025",
        quote:
          "أصبح الذكاء الاصطناعي محور التنمية المستدامة والذكية في المغرب، بما يحسّن إدارة مزيج الطاقة.",
        imageAlt: "ليلى بنعلي"
      }
    ],
    gi: [
      {
        label: "الرؤية الصناعية",
        title: "يوم الصناعة",
        quote:
          "أدعو القطاع الخاص إلى الاستثمار في مجالات متقدمة وموجهة للمستقبل قائمة على الابتكار.",
        imageAlt: "الرؤية الملكية"
      },
      {
        label: "رسالة وزارية",
        title: "رياض مزّور - 2025",
        quote:
          "نحن نكوّن مهندسين مستعدين لمواجهة تحديات صناعة حديثة وخضراء وشاملة.",
        imageAlt: "رياض مزّور"
      }
    ],
    gm: [
      {
        label: "ابتكار الميكاترونيك",
        title: "الرؤية الملكية",
        quote:
          "ندعو إلى الاستثمار في القطاعات المتقدمة لمواجهة تحديات السيادة التكنولوجية.",
        imageAlt: "رؤية تكنولوجية"
      },
      {
        label: "التحول الرقمي",
        title: "غيثة مزّور - 2025",
        quote:
          "الهندسة الميكاترونية هي محرك ابتكار الغد، وهي تقاطع بين العالم المادي والرقمي.",
        imageAlt: "غيثة مزّور"
      }
    ],
    meca: [
      {
        label: "التميّز الميكانيكي",
        title: "الرؤية الملكية",
        quote:
          "يجب أن يصبح وسم «صُنع في المغرب» رمزًا للتميّز الهندسي والسيادة.",
        imageAlt: "الهندسة الملكية"
      }
    ]
  }
};

const LOCALE_MAP: Record<SiteLocale, string> = {
  fr: "fr-FR",
  en: "en-US",
  ar: "ar-MA"
};

const formatNumber = (value: number, locale: SiteLocale, decimals = 0) =>
  new Intl.NumberFormat(LOCALE_MAP[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const useInView = (ref: { current: HTMLElement | null }, threshold = 0.2) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isInView, ref, threshold]);

  return isInView;
};

const AnimatedNumber = ({
  value,
  locale,
  decimals = 0,
  isActive,
  duration = 1200
}: {
  value: number;
  locale: SiteLocale;
  decimals?: number;
  isActive: boolean;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(isActive ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplayValue(value * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [duration, isActive, value]);

  return <span>{formatNumber(displayValue, locale, decimals)}</span>;
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
  const vision = VISION_COPY[locale];
  const giDigitalFactories = GI_DIGITAL_FACTORIES[locale];
  const giTalentsPerYear = GI_TALENTS_PER_YEAR[locale];
  const giKpis = GI_KPIS[locale];
  const mecaSalaries = MECA_SALARIES_BY_LOCALE[locale];
  const gesiVision = vision.gesi;
  const giVision = vision.gi;
  const gmVision = vision.gm;
  const mecaVision = vision.meca;
  const content = DATA[locale];
  const [selectedBranch, setSelectedBranch] = useState<BranchKey>(recommendedBranch);

  const branch = content[selectedBranch] ?? content.GESI;
  const chartItems = branch.chart ?? branch.highlights;
  const isGesi = selectedBranch === "GESI";
  const isMeca = selectedBranch === "MECA";
  const isGm = selectedBranch === "MECATRONIQUE";
  const isGi = selectedBranch === "GI";

  const kpiRef = useRef<HTMLDivElement | null>(null);
  const kpiInView = useInView(kpiRef, 0.2);

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
  const guideFileName = guidePdf?.split("/").pop() ?? "guide-orientation.pdf";
  const tooltipStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 10
  };
  const giCardClass = "glass-card p-5";
  const giKpiCardClass = "rounded-2xl border border-edge/45 bg-panel/70 p-4";
  const giTooltipClass = "rounded-xl border border-edge/70 bg-panel/95 p-3 text-ink shadow-card";
  const giTooltipStyle = (color: string) => ({
    borderColor: `${color}80`,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 11
  });


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

        <div className="mt-12 space-y-16">
          {/* 1. Citations & Vision Royale */}
          <section className="space-y-6">
            {isGesi && (
              <>
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{gesiVision[0].label}</p>
                    <div className="mt-5">
                      <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                        <p className="font-display text-xl font-bold uppercase text-ink">{gesiVision[0].title}</p>
                        <p className="mt-2 text-sm text-ink/75 leading-relaxed italic">{gesiVision[0].quote}</p>
                        {gesiVision[0].source ? (
                          <div className="mt-4 text-[11px] text-ink/50 uppercase tracking-widest flex items-center gap-2">
                            <span className="h-px w-4 bg-ink/20" /> {copy.sourceLabel}: {gesiVision[0].source}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[300px]">
                    <img src="/images/image.png" alt={gesiVision[0].imageAlt} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[300px]">
                    <img src="/images/La ministre Leila Benali.jpg" alt={gesiVision[1].imageAlt} className="h-full w-full object-cover" />
                  </div>
                  <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{gesiVision[1].label}</p>
                    <div className="mt-5">
                      <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                        <p className="font-display text-xl font-bold uppercase text-ink">{gesiVision[1].title}</p>
                        <p className="mt-2 text-sm text-ink/75 leading-relaxed">{gesiVision[1].quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isGi && (
              <>
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{giVision[0].label}</p>
                    <div className="mt-5">
                      <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                        <p className="font-display text-xl font-bold uppercase text-ink">{giVision[0].title}</p>
                        <p className="mt-3 text-sm text-ink/75 italic leading-relaxed">{giVision[0].quote}</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[300px]">
                    <img src="/images/image.png" alt={giVision[0].imageAlt} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[300px]">
                    <img src="/images/mezzour_ryad.jpg" alt={giVision[1].imageAlt} className="h-full w-full object-cover" />
                  </div>
                  <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{giVision[1].label}</p>
                    <div className="mt-5">
                      <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                        <p className="font-display text-xl font-bold uppercase text-ink">{giVision[1].title}</p>
                        <p className="mt-2 text-sm text-ink/75 leading-relaxed">{giVision[1].quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isGm && (
              <>
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{gmVision[0].label}</p>
                    <div className="mt-5">
                      <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                        <p className="font-display text-xl font-bold uppercase text-ink">{gmVision[0].title}</p>
                        <p className="mt-3 text-sm text-ink/75 italic leading-relaxed">{gmVision[0].quote}</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[300px]">
                    <img src="/images/image.png" alt={gmVision[0].imageAlt} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[300px]">
                    <img src="/images/Le Message de Ghita Mezzour.webp" alt={gmVision[1].imageAlt} className="h-full w-full object-cover" />
                  </div>
                  <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{gmVision[1].label}</p>
                    <div className="mt-5">
                      <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                        <p className="font-display text-xl font-bold uppercase text-ink">{gmVision[1].title}</p>
                        <p className="mt-2 text-sm text-ink/75 leading-relaxed">{gmVision[1].quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isMeca && (
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-edge/45 bg-panel/70 p-6" style={{ borderColor: `${branch.color}25` }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{mecaVision[0].label}</p>
                  <div className="mt-5">
                    <div className="rounded-2xl border border-edge/40 bg-panel/80 p-5">
                      <p className="font-display text-xl font-bold uppercase text-ink">{mecaVision[0].title}</p>
                      <p className="mt-3 text-sm text-ink/75 italic leading-relaxed">{mecaVision[0].quote}</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl border border-edge/45 bg-panel/70 relative min-h-[350px]">
                  <img src="/images/image.png" alt={mecaVision[0].imageAlt} className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </section>

          {/* 2. Axes principaux (Modules) */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/40 mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-edge/40" /> {copy.focusTitle}
            </p>
            <div className="grid gap-6 lg:grid-cols-2">
              {sections.filter(s => s.key === 'modules').map(section => (
                <div key={section.key} className="rounded-3xl border border-edge/45 bg-panel/65 p-6" style={{ borderColor: `${branch.color}20` }}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-ink/75 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: branch.color }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Chiffres clés (Highlights) */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/40 mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-edge/40" /> {copy.highlightsTitle}
            </p>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {branch.highlights.map((item, idx) => (
                <div key={idx} className="glass-card p-6 flex flex-col gap-3 group transition-all hover:-translate-y-1" style={{ borderColor: `${branch.color}25` }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30">{copy.statLabel} {idx + 1}</span>
                  <span className="font-display text-3xl font-bold transition-colors" style={{ color: branch.color }}>{item.value}</span>
                  <span className="text-sm font-medium text-ink/80 leading-snug">{item.label}</span>
                  {item.note && <p className="text-[10px] text-ink/50 italic border-t border-edge/10 pt-3 mt-auto">{item.note}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* 4. Graphs and Datasets */}
          <section className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/40 flex items-center gap-3">
              <span className="h-px w-8 bg-edge/40" /> {isGi ? copy.giSectionTitle : copy.datasetsTitle}
            </p>
            
            {isGesi && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 1</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{copy.energyCurveTitle}</p>
                  <div className="mt-3 h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={GESI_RENEWABLES_CURVE}>
                        <defs>
                          <linearGradient id="gesiGreenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" />
                        <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="capacity" stroke="#10b981" fill="url(#gesiGreenGradient)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 2</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{copy.windCurveTitle}</p>
                  <div className="mt-3 h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={GESI_WIND_CURVE}>
                        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" />
                        <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="capacity" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {isGi && (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className={giCardClass}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 1</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{copy.giDataset1Title}</p>
                    <div className="mt-3 h-[230px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={giDigitalFactories}>
                          <defs>
                            <linearGradient id="giCyanGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="rgba(148,163,184,.18)" />
                          <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                          <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              const data = payload[0].payload as (typeof giDigitalFactories)[number];
                              return (
                                <div style={giTooltipStyle("#38bdf8")} className={giTooltipClass}>
                                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">{label}</p>
                                  <p className="mt-1 text-base font-semibold text-ink">{data.value}%</p>
                                  <p className="mt-1 text-[10px] text-ink/70">{data.dataType}</p>
                                  <p className="mt-1 text-[10px] text-ink/60">{data.source}</p>
                                </div>
                              );
                            }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#giCyanGradient)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={giCardClass}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 2</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{copy.giDataset2Title}</p>
                    <div className="mt-3 h-[230px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={giTalentsPerYear}>
                          <defs>
                            <linearGradient id="giGreenGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="rgba(148,163,184,.18)" />
                          <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                          <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              const data = payload[0].payload as (typeof giTalentsPerYear)[number];
                              return (
                                <div style={giTooltipStyle("#4ade80")} className={giTooltipClass}>
                                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">{label}</p>
                                  <p className="mt-1 text-base font-semibold text-ink">{formatNumber(data.value, locale)} {copy.perYearLabel}</p>
                                  <p className="mt-1 text-[10px] text-ink/70">{data.dataType}</p>
                                </div>
                              );
                            }}
                          />
                          <Bar dataKey="value" fill="url(#giGreenGradient)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6" ref={kpiRef}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/60">{copy.giKpiTitle}</p>
                  <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {giKpis.slice(0, 4).map((kpi) => (
                      <div key={kpi.label} className={giKpiCardClass} style={{ borderColor: `${kpi.accent}30` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60 truncate">{kpi.label}</p>
                        <div className="mt-3">
                          <p className="text-[10px] text-ink/40 uppercase">{copy.kpiTargetLabel}</p>
                          <p className="text-2xl font-bold" style={{ color: kpi.accent }}>
                            {kpi.prefix2030 ?? ""}{formatNumber(kpi.value2030, locale)}{kpi.suffix2030 ?? ""} {kpi.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isMeca && (
              <div className="space-y-6">
                <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 1</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{copy.mecaAutomotiveTitle}</p>
                  <div className="mt-3 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MECA_AUTOMOTIVE}>
                        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" />
                        <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <YAxis yAxisId="left" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <YAxis yAxisId="right" orientation="right" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="production" name={copy.productionLabel} fill={branch.color} radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="emplois" name={copy.jobsLabel} fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.advancedTrackLabel}</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{copy.mecaAeronauticTitle}</p>
                    <div className="mt-3 h-[230px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MECA_AERONAUTIQUE}>
                          <CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" />
                          <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                          <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line type="monotone" dataKey="exports" name="Exports (Mds DH)" stroke={branch.color} strokeWidth={3} dot={{r:4}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.salaryOutlookTitle}</p>
                    <div className="mt-4 space-y-3">
                      {mecaSalaries.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-panel/40 p-3 rounded-xl border border-edge/20">
                          <span className="text-xs text-ink/70">{s.profile.replace('\n', ' ')}</span>
                          <span className="text-sm font-bold text-ink" style={{ color: branch.color }}>{s.salary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isGm && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 1</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{copy.roboticsMarketTitle}</p>
                  <div className="mt-3 h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MECATRONIQUE_MARKET}>
                        <defs>
                          <linearGradient id="gmVioletGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" />
                        <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="market" stroke="#8b5cf6" fill="url(#gmVioletGradient)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={giCardClass} style={{ borderColor: `${branch.color}25` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{copy.datasetLabel} 2</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{copy.evPenetrationTitle}</p>
                  <div className="mt-3 h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MECATRONIQUE_VE}>
                        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.15)" />
                        <XAxis dataKey="year" stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <YAxis stroke="rgba(100,116,139,.8)" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="stepAfter" dataKey="penetration" stroke="#8b5cf6" strokeWidth={3} dot={{r:5}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 5. Careers, Companies, Projects */}
          <section>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sections.filter(s => s.key !== 'modules').map(section => (
                <div key={section.key} className="rounded-3xl border border-edge/45 bg-panel/65 p-6" style={{ borderColor: `${branch.color}20` }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">{section.title}</p>
                  <ul className="space-y-4">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-ink/75 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: branch.color }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Guide PDF */}
          <section className="rounded-[2.5rem] border border-edge/45 bg-panel/70 p-8 sm:p-12 text-center relative overflow-hidden" style={{ borderColor: `${branch.color}25` }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: branch.color, opacity: 0.3 }} />
            <div className="relative z-10">
              <h3 className="font-display text-3xl font-bold uppercase text-ink sm:text-4xl">{copy.downloadTitle}</h3>
              <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-ink/60">{copy.downloadBody}</p>
              <div className="mt-10 flex justify-center">
                <a
                  href={guidePdf}
                  download={guideFileName}
                  className="group flex items-center gap-4 rounded-full px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                  style={{ backgroundColor: branch.color }}
                >
                  <svg className="h-5 w-5 fill-current transition-transform group-hover:translate-y-1" viewBox="0 0 24 24">
                    <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-9 4h18v-2H3v2z" />
                  </svg>
                  {copy.downloadCta}
                </a>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
