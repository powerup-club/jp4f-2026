import type { Metadata } from "next";
import Link from "next/link";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

type GameCard = { href: string; title: string; body: string; tag: string; color: string };

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    openLabel: string;
    spotlightLabel: string;
    cards: GameCard[];
  }
> = {
  fr: {
    badge: "Mini-jeux",
    title: "Jeux & défis",
    subtitle: "Entraîne-toi avec des formats courts pour roder ton pitch, ta logique et ta créativité.",
    openLabel: "Lancer",
    spotlightLabel: "Mise en avant",
    cards: [
      { href: "/games/quiz", title: "Quiz Industrie 4.0", body: "Quiz rapide avec score et classement public.", tag: "Quiz", color: "#10b981" },
      { href: "/games/pitch", title: "Pitch Timer", body: "Chronomètre ton pitch puis demande un feedback jury.", tag: "Pitch", color: "#f97316" },
      { href: "/games/match", title: "Filière Match", body: "Associe les technos aux bons parcours du département.", tag: "Orientation", color: "#8b5cf6" },
      { href: "/games/scenario", title: "Scenario Challenge", body: "Réponds à un cas industriel et reçois une analyse expert.", tag: "Case study", color: "#0ea5e9" }
    ]
  },
  en: {
    badge: "Mini games",
    title: "Games & drills",
    subtitle: "Train with fast formats to sharpen your pitch and project reasoning.",
    openLabel: "Open",
    spotlightLabel: "Spotlight",
    cards: [
      { href: "/games/quiz", title: "Industry 4.0 Quiz", body: "Fast quiz with score tracking and public ranking.", tag: "Quiz", color: "#10b981" },
      { href: "/games/pitch", title: "Pitch Timer", body: "Time your pitch and request jury-style feedback.", tag: "Pitch", color: "#f97316" },
      { href: "/games/match", title: "Branch Match", body: "Map technologies to the right department tracks.", tag: "Orientation", color: "#8b5cf6" },
      { href: "/games/scenario", title: "Scenario Challenge", body: "Answer an industrial case and get expert analysis.", tag: "Case study", color: "#0ea5e9" }
    ]
  },
  ar: {
    badge: "ألعاب مصغّرة",
    title: "الألعاب والتحديات",
    subtitle: "تدرّب عبر صيغ سريعة لتحسين العرض وصياغة الفكرة.",
    openLabel: "فتح",
    spotlightLabel: "بارز",
    cards: [
      { href: "/games/quiz", title: "اختبار الصناعة 4.0", body: "اختبار سريع مع نتيجة وترتيب عام.", tag: "اختبار", color: "#10b981" },
      { href: "/games/pitch", title: "مؤقّت العرض", body: "قِس عرضك واطلب ملاحظات شبيهة باللجنة.", tag: "عرض", color: "#f97316" },
      { href: "/games/match", title: "مطابقة المسارات", body: "اربط التقنيات بالمسارات المناسبة داخل الشعبة.", tag: "توجيه", color: "#8b5cf6" },
      { href: "/games/scenario", title: "تحدي السيناريو", body: "أجب عن حالة صناعية واحصل على تحليل خبير.", tag: "دراسة حالة", color: "#0ea5e9" }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/games`);
}

export default async function GamesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  const isRTL = locale === "ar";
  const [featured, ...others] = copy.cards;
  const tags = Array.from(new Set(copy.cards.map((c) => c.tag)));

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative isolate">
      {/* Ambient grid + nebula */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.04),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-accent/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-16 h-96 w-96 rounded-full bg-cyan-500/14 blur-3xl" />

      <div className="section-shell space-y-8 py-6">
        {/* Hero band (no glass card) */}
        <div className="relative space-y-4 liquid-card rounded-[22px] border border-edge/60 p-6 shadow-halo backdrop-blur">
          <div className="space-y-3">
            <p className="badge-line">{copy.badge}</p>
            <h1 className="font-display text-[clamp(32px,4.6vw,60px)] font-semibold uppercase leading-[0.95] text-ink">
              <span className="gradient-title">{copy.title}</span>
            </h1>
            <p className="max-w-3xl text-base text-ink/75 sm:text-lg">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ borderColor: "rgba(255,255,255,0.22)", color: "var(--ink)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Spotlight row */}
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SpotlightCard locale={locale} copyLabel={copy.spotlightLabel} card={featured} isRTL={isRTL} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {others.slice(0, 2).map((card) => (
              <StackedCard key={card.href} locale={locale} card={card} isRTL={isRTL} />
            ))}
          </div>
        </div>

        {/* Masonry-style grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {others.slice(2).map((card) => (
            <Tile key={card.href} locale={locale} card={card} isRTL={isRTL} />
          ))}
        </div>

        {/* CTA banner */}
        <div className="relative overflow-hidden rounded-[22px] border border-edge/60 bg-panel/88 p-7 shadow-lg backdrop-blur liquid-card">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_86%_20%,rgba(14,165,233,0.18),transparent_44%)]" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">{copy.badge}</p>
              <h3 className="font-display text-2xl uppercase text-ink">Prêt à jouer ?</h3>
              <p className="text-sm text-ink/70">Choisis un mini-jeu, progresse et reviens montrer tes stats.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {copy.cards.map((card) => (
                <Link
                  key={card.href}
                  href={`/${locale}${card.href}`}
                  className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:-translate-y-[1px]"
                  style={{ borderColor: `${card.color}80`, color: card.color, backgroundColor: `${card.color}12` }}
                >
                  {card.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotlightCard({ locale, card, copyLabel, isRTL }: { locale: string; card: GameCard; copyLabel: string; isRTL: boolean }) {
  return (
    <Link
      href={`/${locale}${card.href}`}
      className="group relative block overflow-hidden rounded-[24px] border border-edge/70 bg-panel/90 p-7 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-edge hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel lg:p-9 liquid-card"
      style={{ backgroundImage: `linear-gradient(130deg, ${card.color}26, ${card.color}0d)` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 22% 18%, ${card.color}38, transparent 50%)` }} />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ borderColor: `${card.color}66`, color: card.color, backgroundColor: `${card.color}18` }}>
            {copyLabel}
          </span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink/55">{card.tag}</span>
        </div>
        <h2 className="font-display text-[clamp(34px,4.6vw,60px)] uppercase leading-tight text-ink">{card.title}</h2>
        <p className="max-w-3xl text-sm text-ink/78 lg:text-base">{card.body}</p>
        <div className="mt-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: card.color }}>
          <span className="h-[1px] w-9 bg-current opacity-40" />
          {card.tag} · {locale.toUpperCase()}
          <span className="transition-transform duration-300 group-hover:translate-x-1">{isRTL ? "↖" : "↗"}</span>
        </div>
      </div>
    </Link>
  );
}

function StackedCard({ locale, card, isRTL }: { locale: string; card: GameCard; isRTL: boolean }) {
  return (
    <Link
      href={`/${locale}${card.href}`}
      className="group relative block overflow-hidden rounded-[18px] border border-edge/55 bg-panel/88 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-edge hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel liquid-card"
      style={{ backgroundImage: `linear-gradient(140deg, ${card.color}18, ${card.color}06)` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 30% 16%, ${card.color}28, transparent 42%)` }} />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ border: `1px solid ${card.color}50`, color: card.color, backgroundColor: `${card.color}12` }}>
            {card.tag}
          </span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink/55">↗</span>
        </div>
        <p className="font-display text-[22px] uppercase leading-tight text-ink">{card.title}</p>
        <p className="text-sm text-ink/76">{card.body}</p>
        <div className="mt-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: card.color }}>
          <span className="h-[1px] w-7 bg-current opacity-40" />
          {card.tag} · {isRTL ? locale : copyLabelFromTag(card.tag)}
        </div>
      </div>
    </Link>
  );
}

function Tile({ locale, card, isRTL }: { locale: string; card: GameCard; isRTL: boolean }) {
  return (
    <Link
      href={`/${locale}${card.href}`}
      className="group relative block overflow-hidden rounded-[16px] border border-edge/50 bg-panel/86 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-edge hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel liquid-card"
      style={{ backgroundImage: `linear-gradient(150deg, ${card.color}12, ${card.color}05)` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 26% 12%, ${card.color}24, transparent 40%)` }} />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ border: `1px solid ${card.color}45`, color: card.color, backgroundColor: `${card.color}0f` }}>
            {card.tag}
          </span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink/55">{isRTL ? "↖" : "↗"}</span>
        </div>
        <p className="font-display text-xl uppercase leading-tight text-ink">{card.title}</p>
        <p className="text-sm text-ink/76">{card.body}</p>
        <div className="mt-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: card.color }}>
          <span className="h-[1px] w-6 bg-current opacity-40" />
          {locale.toUpperCase()}
        </div>
      </div>
    </Link>
  );
}

function copyLabelFromTag(tag: string) {
  // lightweight label helper to avoid importing translation again
  return tag.toUpperCase();
}
