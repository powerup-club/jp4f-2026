import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import type { CompetitionTimelineItem, SiteLocale } from "@/content/types";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";
import { localizeHref } from "@/lib/routing";

const COMP_ACCENT = "#fbb724";

function findActiveTimelineIndex(timeline: CompetitionTimelineItem[]): number {
  const finalDeadlineMatcher = /extended|dernier|آخر أجل|final cutoff/i;
  const deadlineMatcher = /deadline|limite|dernier|آخر أجل|الموعد النهائي|final cutoff/i;
  const finalCandidate = timeline.findIndex((item) => finalDeadlineMatcher.test(item.text));
  if (finalCandidate >= 0) {
    return finalCandidate;
  }
  const candidate = timeline.findIndex((item) => deadlineMatcher.test(item.text));
  return candidate >= 0 ? candidate : 0;
}

function tickerEntries(locale: SiteLocale, title: string, dateValue: string, venueValue: string): string[] {
  if (locale === "ar") {
    return [
      "JESI'2025",
      title,
      dateValue,
      venueValue,
      "الطاقة · الدوموتيك · الرقمنة",
      "CONNECTER A L'AVENIR",
    ];
  }

  if (locale === "en") {
    return [
      "JESI'2025",
      title,
      dateValue,
      venueValue,
      "ENERGY · HOME AUTOMATION · DIGITALISATION",
      "CONNECTING TO THE FUTURE",
    ];
  }

  return [
    "JESI'2025",
    title,
    dateValue,
    venueValue,
    "ENERGIE · DOMOTIQUE · DIGITALISATION",
    "CONNECTER A L'AVENIR",
  ];
}

function labelsByLocale(locale: SiteLocale) {
  if (locale === "en") {
    return {
      domains: "domains",
      partners: "Partners",
      contact: "Contact",
      formats: "Presentation formats",
      openBadge: "JESI'2025 — Applications open",
      orientationQuiz: "Take the orientation quiz",
      orientationHint: "Unsure about your branch? Run the 5-question smart quiz.",
    };
  }

  if (locale === "ar") {
    return {
      domains: "مجالات",
      partners: "الشركاء",
      contact: "التواصل",
      formats: "صيغ التقديم",
      openBadge: "JESI'2025 — باب الترشح مفتوح",
      orientationQuiz: "قم باختبار التوجيه",
      orientationHint: "غير متأكد من المسلك؟ جرب اختبار التوجيه الذكي من 5 أسئلة.",
    };
  }

  return {
    domains: "domaines",
    partners: "Partenaires",
    contact: "Contact",
    formats: "Formats de présentation",
    openBadge: "JESI'2025 — Ouvert aux candidatures",
    orientationQuiz: "Faire le quiz d'orientation",
    orientationHint: "Pas encore décidé ? Lance le quiz intelligent en 5 questions.",
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.competition.title, content.competition.subtitle);
}

export default async function CompetitionPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  const timeline = content.competition.timeline;
  const activeTimelineIndex = findActiveTimelineIndex(timeline);

  const eventDate = timeline.at(-1)?.date ?? "21 April 2025";
  const statFormatValue = locale === "ar" ? "5-10 د" : "5-10 min";
  const statVenueValue = "ENSA FES";
  const statIdeasValue = "∞";

  const labels = labelsByLocale(locale);
  const ticker = tickerEntries(locale, content.competition.title, eventDate, statVenueValue);

  return (
    <>
      <style>{`
        .comp-page {
          --comp-accent: ${COMP_ACCENT};
        }

        html[data-theme="dark"] .comp-page {
          --comp-ticker-bg: rgba(251, 191, 36, 0.06);
          --comp-ticker-border: rgba(251, 191, 36, 0.18);
          --comp-ticker-muted: rgba(240, 237, 230, 0.3);
          --comp-bg: rgba(10, 12, 18, 0.72);
          --comp-bg-soft: rgba(15, 20, 28, 0.56);
          --comp-line: rgba(255, 255, 255, 0.1);
          --comp-line-soft: rgba(255, 255, 255, 0.08);
          --comp-line-strong: rgba(251, 191, 36, 0.26);
          --comp-text-strong: rgba(240, 237, 230, 0.92);
          --comp-text-muted: rgba(240, 237, 230, 0.58);
          --comp-text-subtle: rgba(240, 237, 230, 0.38);
          --comp-chip-bg: rgba(251, 191, 36, 0.12);
          --comp-chip-border: rgba(251, 191, 36, 0.42);
          --comp-grid-line: rgba(251, 191, 36, 0.06);
          --comp-row-hover: rgba(251, 191, 36, 0.09);
          --comp-register-bg: linear-gradient(145deg, rgba(251, 191, 36, 0.08) 0%, rgba(10, 12, 16, 0.88) 52%);
          --comp-warning: rgba(251, 146, 60, 0.9);
        }

        html[data-theme="light"] .comp-page {
          --comp-ticker-bg: rgba(249, 115, 22, 0.09);
          --comp-ticker-border: rgba(249, 115, 22, 0.28);
          --comp-ticker-muted: rgba(31, 41, 55, 0.56);
          --comp-bg: rgba(255, 255, 255, 0.72);
          --comp-bg-soft: rgba(248, 250, 252, 0.72);
          --comp-line: rgba(31, 41, 55, 0.15);
          --comp-line-soft: rgba(31, 41, 55, 0.12);
          --comp-line-strong: rgba(249, 115, 22, 0.44);
          --comp-text-strong: rgba(31, 41, 55, 0.95);
          --comp-text-muted: rgba(31, 41, 55, 0.8);
          --comp-text-subtle: rgba(31, 41, 55, 0.62);
          --comp-chip-bg: rgba(249, 115, 22, 0.12);
          --comp-chip-border: rgba(249, 115, 22, 0.35);
          --comp-grid-line: rgba(249, 115, 22, 0.1);
          --comp-row-hover: rgba(249, 115, 22, 0.11);
          --comp-register-bg: linear-gradient(145deg, rgba(255, 255, 255, 0.76) 0%, rgba(241, 245, 249, 0.78) 52%);
          --comp-warning: rgba(180, 83, 9, 0.95);
        }

        @keyframes comp-ticker-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes comp-flicker {
          0%, 92%, 96%, 100% { opacity: 1; }
          94% { opacity: 0.86; }
        }

        @keyframes comp-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.2); }
          50% { box-shadow: 0 0 18px rgba(251, 191, 36, 0.48), 0 0 26px rgba(251, 191, 36, 0.16); }
        }

        .comp-ticker-wrap {
          overflow: hidden;
          border-top: 1px solid var(--comp-ticker-border);
          border-bottom: 1px solid var(--comp-ticker-border);
          background-color: var(--comp-ticker-bg);
        }

        .comp-ticker-track {
          display: flex;
          width: max-content;
          animation: comp-ticker-move 30s linear infinite;
        }

        .comp-ticker-item {
          white-space: nowrap;
          border-right: 1px solid var(--comp-line-soft);
          padding: 10px 28px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
        }

        .comp-hero {
          position: relative;
          overflow: hidden;
          background: var(--comp-bg);
        }

        .comp-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--comp-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--comp-grid-line) 1px, transparent 1px);
          background-size: 42px 42px;
          opacity: 0.65;
        }

        .comp-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--comp-chip-border);
          background-color: var(--comp-chip-bg);
          border-radius: 3px;
          padding: 5px 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--comp-accent);
        }

        .comp-chip-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--comp-accent);
          animation: comp-pulse 2s ease-in-out infinite;
        }

        .comp-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          border: 1px solid var(--comp-line);
          border-radius: 6px;
          overflow: hidden;
          background: var(--comp-bg-soft);
        }

        .comp-stat-cell {
          text-align: center;
          padding: 24px 18px;
          background-color: transparent;
        }

        .comp-axis-row {
          transition: border-color 0.22s ease, background-color 0.22s ease;
        }

        .comp-axis-row:hover {
          border-color: var(--comp-line-strong) !important;
          background-color: var(--comp-row-hover) !important;
        }

        .comp-axis-row:hover .comp-axis-index {
          color: var(--comp-accent) !important;
        }

        .comp-register {
          position: relative;
          overflow: hidden;
          min-height: 380px;
          background: var(--comp-register-bg);
        }

        .comp-register::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--comp-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--comp-grid-line) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .comp-register::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 130px;
          height: 130px;
          pointer-events: none;
          background: radial-gradient(circle at top right, rgba(251, 191, 36, 0.24), transparent 72%);
        }

        .comp-cta {
          transition: letter-spacing 0.26s ease, box-shadow 0.26s ease, background-color 0.26s ease, color 0.26s ease;
        }

        .comp-cta:hover {
          letter-spacing: 0.2em !important;
          background-color: var(--comp-accent) !important;
          color: #0a0c10 !important;
          box-shadow: 0 10px 28px rgba(251, 191, 36, 0.45), 0 0 0 1px rgba(251, 191, 36, 0.5) !important;
        }

        .comp-cta-secondary {
          transition: border-color 0.24s ease, color 0.24s ease, background-color 0.24s ease, letter-spacing 0.24s ease;
        }

        .comp-cta-secondary:hover {
          border-color: var(--comp-accent) !important;
          color: var(--comp-accent) !important;
          background-color: rgba(251, 191, 36, 0.08) !important;
          letter-spacing: 0.14em !important;
        }
      `}</style>

      <div className="comp-page">
        <PageIntro tag={content.competition.tag} title={content.competition.title} subtitle={content.competition.subtitle} />

        <section className="section-shell mt-6 space-y-4">
          <Reveal>
            <div className="comp-ticker-wrap outlined-cut-card">
              <div className="comp-ticker-track">
                {[0, 1].map((rep) => (
                  <div key={rep} className="flex items-center">
                    {ticker.map((item, index) => (
                      <span
                        key={`${rep}-${item}-${index}`}
                        className="comp-ticker-item"
                        style={{ color: index % 3 === 0 ? "var(--comp-accent)" : "var(--comp-ticker-muted)" }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <article className="glass-card comp-hero p-6 sm:p-8" style={{ borderColor: "var(--comp-line-strong)" }}>
              <div className="relative z-[1]">
                <span className="comp-chip">
                  <span className="comp-chip-dot" />
                  {labels.openBadge}
                </span>
                <h2 className="mt-4 font-display text-[clamp(32px,4.3vw,52px)] font-semibold uppercase leading-tight" style={{ color: "var(--comp-text-strong)" }}>
                  {content.competition.registrationHeading}
                </h2>
                <p className="mt-3 max-w-3xl font-mono text-[12px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                  {content.competition.subtitle}
                </p>
              </div>

              <div className="comp-stats-grid relative z-[1] mt-6">
                {[
                  { value: String(content.competition.axes.length), label: content.competition.statAxes },
                  { value: statFormatValue, label: content.competition.statFormat },
                  { value: eventDate, label: content.competition.statDate },
                  { value: statVenueValue, label: content.competition.statVenue },
                  { value: statIdeasValue, label: content.competition.statIdeas },
                ].map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="comp-stat-cell" style={{ borderRight: index < 4 ? "1px solid var(--comp-line-soft)" : undefined }}>
                    <p
                      className="font-display text-[clamp(22px,3.1vw,34px)] font-semibold uppercase leading-none"
                      style={{ color: "var(--comp-accent)", animation: "comp-flicker 6.4s ease-in-out infinite", animationDelay: `${index * 0.65}s` }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "var(--comp-text-subtle)" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        </section>

        <section className="section-shell mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <article className="glass-card p-6" style={{ borderColor: "var(--comp-line-strong)" }}>
              <div className="mb-5 flex items-baseline gap-3">
                <h2 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--comp-text-strong)" }}>
                  {content.competition.axesTitle}
                </h2>
                <span
                  className="rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em]"
                  style={{ borderColor: "var(--comp-line-strong)", color: "var(--comp-accent)" }}
                >
                  {content.competition.axes.length} {labels.domains}
                </span>
              </div>

              <div className="space-y-2.5">
                {content.competition.axes.map((axis, index) => (
                  <div
                    key={axis}
                    className="comp-axis-row flex items-center gap-4 rounded border px-4 py-3.5"
                    style={{ borderColor: "var(--comp-line-soft)", backgroundColor: "transparent" }}
                  >
                    <span className="comp-axis-index min-w-7 font-mono text-[11px] font-bold tracking-[0.12em]" style={{ color: "var(--comp-text-subtle)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-7 w-px" style={{ backgroundColor: "var(--comp-line-soft)" }} />
                    <p className="font-display text-[18px] uppercase tracking-[0.04em]" style={{ color: "var(--comp-text-strong)" }}>
                      {axis}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--comp-accent)" }}>
                  {labels.formats}
                </p>
                <div className="flex flex-wrap gap-2">
                  {content.competition.formats.map((format) => (
                    <span key={format} className="rounded border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em]" style={{ borderColor: "var(--comp-line-strong)", color: "var(--comp-accent)" }}>
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal>
            <article className="glass-card flex flex-col gap-0 p-6" style={{ borderColor: "var(--comp-line-strong)" }}>
              <div className="-mx-6 -mt-6 mb-6 border-b px-6 py-6" style={{ borderColor: "var(--comp-line-strong)", background: "radial-gradient(circle at 15% 10%, rgba(251,191,36,.18), transparent 55%)" }}>
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--comp-accent)" }}>
                  {content.competition.prizeTitle}
                </p>
                <p className="font-display text-[clamp(52px,8vw,74px)] font-semibold leading-none" style={{ color: "var(--comp-accent)", animation: "comp-flicker 4.2s ease-in-out infinite", textShadow: "0 0 32px rgba(251,191,36,.35)" }}>
                  {content.competition.prizeAmount}
                </p>
                <p className="mt-2 font-mono text-xs leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                  {content.competition.prizeDescription}
                </p>
              </div>

              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--comp-accent)" }}>
                {content.competition.eligibilityTitle}
              </p>
              <p className="font-mono text-[12px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                {content.competition.eligibility}
              </p>

              <div className="mt-6">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--comp-accent)" }}>
                  {content.competition.criteriaTitle}
                </p>
                <div className="space-y-1.5">
                  {content.competition.criteria.map((criterion) => (
                    <div key={criterion} className="flex gap-2 rounded px-2 py-1.5 transition" style={{ backgroundColor: "transparent" }}>
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--comp-accent)", boxShadow: "0 0 8px rgba(251,191,36,.55)" }} />
                      <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                        {criterion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        </section>

        <section className="section-shell mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <article className="glass-card p-6" style={{ borderColor: "var(--comp-line-strong)" }}>
              <h2 className="font-display text-3xl font-semibold uppercase" style={{ color: "var(--comp-text-strong)" }}>
                {content.competition.timelineTitle}
              </h2>

              <div className="relative mt-5" style={{ paddingInlineStart: 28 }}>
                <div className="absolute" style={{ insetInlineStart: 7, top: 8, bottom: 8, width: 1, background: "linear-gradient(to bottom, rgba(251,191,36,.52), rgba(251,191,36,.08))" }} />

                <div className="space-y-0">
                  {timeline.map((item, index) => {
                    const isActive = index === activeTimelineIndex;
                    return (
                      <div key={`${item.date}-${item.text}`} className="relative" style={{ paddingBottom: index < timeline.length - 1 ? 26 : 0 }}>
                        <div
                          className="absolute rounded-full"
                          style={{
                            insetInlineStart: -24,
                            top: 8,
                            width: 12,
                            height: 12,
                            border: `2px solid ${isActive ? "var(--comp-accent)" : "var(--comp-line-strong)"}`,
                            backgroundColor: isActive ? "var(--comp-accent)" : "rgba(251,191,36,.24)",
                            boxShadow: isActive ? "0 0 14px rgba(251,191,36,.56)" : "none",
                            animation: isActive ? "comp-pulse 2.3s ease-in-out infinite" : "none",
                          }}
                        />

                        <div className="rounded border px-4 py-3" style={{ borderColor: isActive ? "var(--comp-line-strong)" : "var(--comp-line-soft)", backgroundColor: isActive ? "var(--comp-row-hover)" : "transparent" }}>
                          <p className="font-display text-2xl font-semibold leading-none" style={{ color: "var(--comp-accent)" }}>
                            {item.date}
                          </p>
                          <p className="mt-1 font-mono text-[12px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded border px-4 py-3" style={{ borderColor: "var(--comp-line-soft)", backgroundColor: "transparent" }}>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--comp-accent)" }}>
                  {labels.contact}
                </p>
                <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                  {content.competition.contact.name}
                  <br />
                  <Link href={`mailto:${content.competition.contact.email}`} className="hover:text-[#f59e0b]" style={{ color: "var(--comp-accent)" }}>
                    {content.competition.contact.email}
                  </Link>
                  <br />
                  <Link href={`tel:${content.competition.contact.phone}`} style={{ color: "var(--comp-text-subtle)" }}>
                    {content.competition.contact.phone}
                  </Link>
                  {content.competition.contact.site ? (
                    <>
                      <br />
                      <span style={{ color: "var(--comp-text-subtle)" }}>{content.competition.contact.site}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal>
            <article className="glass-card comp-register p-6 sm:p-8" style={{ borderColor: "var(--comp-line-strong)" }}>
              <div className="relative z-[1] flex h-full flex-col justify-between gap-6">
                <div>
                  <h3 className="font-display text-[clamp(30px,4vw,44px)] font-semibold uppercase leading-tight" style={{ color: "var(--comp-text-strong)" }}>
                    {content.competition.registrationHeading}
                  </h3>
                  <p className="mt-3 max-w-xl font-mono text-[12px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                    {content.competition.subtitle}
                  </p>
                </div>

                <div>
                  <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: "var(--comp-text-subtle)" }}>
                    {labels.partners}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {content.competition.partners.map((partner) => (
                      <span key={partner} className="rounded border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]" style={{ borderColor: "var(--comp-line-soft)", color: "var(--comp-text-subtle)" }}>
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--comp-warning)" }}>
                    {content.competition.deadlineLabel}
                  </p>
                  <p className="mb-3 max-w-xl font-mono text-[11px] leading-relaxed" style={{ color: "var(--comp-text-muted)" }}>
                    {labels.orientationHint}
                  </p>
                  <Link
                    href={localizeHref(locale, "/quiz")}
                    className="comp-cta-secondary mb-3 inline-flex items-center gap-2 rounded border px-6 py-3 font-display text-base font-semibold uppercase tracking-[0.1em] no-underline"
                    style={{ borderColor: "var(--comp-line-strong)", color: "var(--comp-text-strong)", backgroundColor: "transparent" }}
                  >
                    {labels.orientationQuiz}
                  </Link>
                  <br />
                  <Link
                    href={localizeHref(locale, "/competition/register")}
                    className="comp-cta inline-flex items-center gap-3 rounded px-8 py-4 font-display text-xl font-semibold uppercase tracking-[0.14em] no-underline"
                    style={{ color: "#0a0c10", backgroundColor: "var(--comp-accent)", boxShadow: "0 8px 32px rgba(251,191,36,.35), 0 0 0 1px rgba(251,191,36,.3)" }}
                  >
                    {content.competition.registrationLabel}
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </section>
      </div>
    </>
  );
}
