import type { Metadata } from "next";
import { ApplicantOrientationExplorer } from "@/components/application/ApplicantOrientationExplorer";
import { PageIntro } from "@/components/sections/PageIntro";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

const COPY: Record<SiteLocale, { badge: string; title: string; subtitle: string; kingQuote: string; ministerQuote: string; ministerName: string }> = {
  fr: {
    badge: "Explorer",
    title: "Orientation",
    subtitle: "Relie ton profil, ton quiz et ton projet aux parcours du departement Genie Industriel.",
    kingQuote: "Sous la direction de Sa Majesté Mohammed VI, une industrie aéronautique solide s'est construite au cours des deux dernières décennies, offrant aujourd'hui un grand potentiel d'opportunités pour les acteurs mondiaux du secteur.",
    ministerQuote: "Nous n'avons pas droit à l'erreur. D'ici 2025, nous devons former et surtout garantir l'employabilité de près de 100 000 ingénieurs, cadres moyens et techniciens supérieurs dans les secteurs de l'automobile et l'aéronautique.",
    ministerName: "Ryad Mezzour, Ministre de l'Industrie et du Commerce du Maroc"
  },
  en: {
    badge: "Explorer",
    title: "Orientation",
    subtitle: "Connect your profile, quiz, and project with the department engineering tracks.",
    kingQuote: "Under the direction of His Majesty Mohammed VI, a solid aerospace industry has been built over the past two decades, today offering great potential for opportunities for global players in the sector.",
    ministerQuote: "We have no room for error. By 2025, we must train and especially guarantee the employability of nearly 100,000 engineers, middle managers and senior technicians in the automotive and aerospace sectors.",
    ministerName: "Ryad Mezzour, Minister of Industry and Trade of Morocco"
  },
  ar: {
    badge: "Explorer",
    title: "التوجيه",
    subtitle: "اربط بين ملفك والاختبار ومشروعك وبين مسالك شعبة الهندسة الصناعية.",
    kingQuote: "تحت قيادة جلالة الملك محمد السادس، تم بناء صناعة طيران قوية على مدى العقدين الماضيين، مما يوفر اليوم إمكانيات كبيرة للفرص للاعبين العالميين في القطاع.",
    ministerQuote: "لا يمكننا تحمل الأخطاء. بحلول عام 2025، يجب أن نقوم بتدريب وضمان توظيف ما يقرب من 100000 مهندس والإطارات الوسطى والفنيين العاليين في قطاعات السيارات والطيران.",
    ministerName: "رياض مزور، وزير الصناعة والتجارة بالمغرب"
  }
};

export const metadata: Metadata = {
  title: "Filières ENSA Fès | 4 filières ingénieur JP4F 2026",
  description: "Filières ENSA Fès: comment choisir sa filière à ENSA Fès, quelles sont les filières de ENSA Fès et 4 filières ENSA Fès, meilleure filière ingénieur au Maroc.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "JESI - Club Étudiant ENSA Fès" }],
  openGraph: {
    title: "Filières ENSA Fès | 4 filières ingénieur JP4F 2026",
    description: "Filières ENSA Fès: comment choisir sa filière à ENSA Fès, quelles sont les filières de ENSA Fès et 4 filières ENSA Fès, meilleure filière ingénieur au Maroc.",
    url: "https://jp4f.vercel.app/[locale]/filieres",
    siteName: "JP4F 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://jp4f.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Filières ENSA Fès | 4 filières ingénieur JP4F 2026",
    description: "Filières ENSA Fès: comment choisir sa filière à ENSA Fès, quelles sont les filières de ENSA Fès et 4 filières ENSA Fès, meilleure filière ingénieur au Maroc."
  },
  alternates: { canonical: "https://jp4f.vercel.app/[locale]/filieres" }
};

const ORI_ACCENT = "#38bdf8";

export default async function FilieresPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <style>{`
        .ori-page { --ori-accent: ${ORI_ACCENT}; }

        html[data-theme="dark"] .ori-page {
          --ori-ticker-bg:     rgba(56, 189, 248, 0.06);
          --ori-ticker-border: rgba(56, 189, 248, 0.18);
          --ori-ticker-muted:  rgba(240, 237, 230, 0.3);
          --ori-bg:            rgba(10, 12, 18, 0.72);
          --ori-line-soft:     rgba(255, 255, 255, 0.08);
          --ori-line-strong:   rgba(56, 189, 248, 0.26);
          --ori-text-strong:   rgba(240, 237, 230, 0.92);
          --ori-text-muted:    rgba(240, 237, 230, 0.58);
          --ori-chip-bg:       rgba(56, 189, 248, 0.12);
          --ori-chip-border:   rgba(56, 189, 248, 0.42);
          --ori-grid-line:     rgba(56, 189, 248, 0.06);
        }

        html[data-theme="light"] .ori-page {
          --ori-ticker-bg:     rgba(14, 165, 233, 0.09);
          --ori-ticker-border: rgba(14, 165, 233, 0.28);
          --ori-ticker-muted:  rgba(31, 41, 55, 0.56);
          --ori-bg:            rgba(255, 255, 255, 0.72);
          --ori-line-soft:     rgba(31, 41, 55, 0.12);
          --ori-line-strong:   rgba(14, 165, 233, 0.44);
          --ori-text-strong:   rgba(31, 41, 55, 0.95);
          --ori-text-muted:    rgba(31, 41, 55, 0.8);
          --ori-chip-bg:       rgba(14, 165, 233, 0.12);
          --ori-chip-border:   rgba(14, 165, 233, 0.35);
          --ori-grid-line:     rgba(14, 165, 233, 0.10);
        }

        @keyframes ori-ticker-move {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ori-flicker {
          0%, 92%, 96%, 100% { opacity: 1; }
          94% { opacity: 0.86; }
        }
        @keyframes ori-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(56,189,248,0.2); }
          50%      { box-shadow: 0 0 18px rgba(56,189,248,0.48), 0 0 26px rgba(56,189,248,0.16); }
        }

        .ori-ticker-wrap {
          overflow: hidden;
          border-top: 1px solid var(--ori-ticker-border);
          border-bottom: 1px solid var(--ori-ticker-border);
          background-color: var(--ori-ticker-bg);
        }
        .ori-ticker-track {
          display: flex;
          width: max-content;
          animation: ori-ticker-move 28s linear infinite;
        }
        .ori-ticker-item {
          white-space: nowrap;
          border-right: 1px solid var(--ori-line-soft);
          padding: 10px 28px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
        }
        .ori-hero {
          position: relative;
          overflow: hidden;
          background: var(--ori-bg);
        }
        .ori-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--ori-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--ori-grid-line) 1px, transparent 1px);
          background-size: 42px 42px;
          opacity: 0.65;
        }
        .ori-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--ori-chip-border);
          background-color: var(--ori-chip-bg);
          border-radius: 3px;
          padding: 5px 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ori-accent);
        }
        .ori-chip-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--ori-accent);
          animation: ori-pulse 2s ease-in-out infinite;
        }
        .ori-explorer-wrap {
          position: relative;
          overflow: hidden;
          background: var(--ori-bg);
        }
        .ori-explorer-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--ori-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--ori-grid-line) 1px, transparent 1px);
          background-size: 42px 42px;
          opacity: 0.5;
        }
        .ori-explorer-wrap::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 180px;
          height: 180px;
          pointer-events: none;
          background: radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 72%);
        }
      `}</style>

      <div className="ori-page">

        <PageIntro tag={copy.badge} title={copy.title} subtitle={copy.subtitle} />

        {/* ...existing code... */}

        {/* Ticker */}
        <section className="section-shell mt-8 space-y-4">
          <div className="ori-ticker-wrap outlined-cut-card">
            <div className="ori-ticker-track">
              {[0, 1].map((rep) => (
                <div key={rep} className="flex items-center">
                  {["JP4F 2026", "ENSA FÈS", "4 FILIÈRES", "GI · GE · GC · GIN", "ORIENTATION", "QUIZ INTELLIGENT"].map((item, index) => (
                    <span
                      key={`${rep}-${index}`}
                      className="ori-ticker-item"
                      style={{ color: index % 3 === 0 ? "var(--ori-accent)" : "var(--ori-ticker-muted)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Hero */}
          <article
            className="glass-card ori-hero p-6 sm:p-8"
            style={{ borderColor: "var(--ori-line-strong)" }}
          >
            <div className="relative z-[1]">
              <span className="ori-chip">
                <span className="ori-chip-dot" />
                JP4F 2026 — Orientation active
              </span>
              <h2
                className="mt-4 font-display text-[clamp(28px,3.8vw,48px)] font-semibold uppercase leading-tight"
                style={{ color: "var(--ori-text-strong)" }}
              >
                <span className="gradient-title">{copy.title}</span>
                <span
                  className="ml-3 font-mono text-[clamp(14px,2vw,22px)]"
                  style={{
                    color: "var(--ori-accent)",
                    animation: "ori-flicker 6.4s ease-in-out infinite",
                  }}
                >
                  × 4 filières
                </span>
              </h2>
              <p
                className="mt-3 max-w-3xl font-mono text-[12px] leading-relaxed"
                style={{ color: "var(--ori-text-muted)" }}
              >
                {copy.subtitle}
              </p>
            </div>
          </article>
        </section>

        {/* Explorer */}
        <section className="section-shell mt-6">
          <article
            className="glass-card ori-explorer-wrap p-6 sm:p-8"
            style={{ borderColor: "var(--ori-line-strong)" }}
          >
            <div className="relative z-[1]">
              <ApplicantOrientationExplorer
                locale={locale}
                recommendedBranch="GI"
                projectTitle=""
                projectDomain=""
              />
            </div>
          </article>
        </section>

      </div>
    </>
  );
}
