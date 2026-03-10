import type { Metadata } from "next";
import Link from "next/link";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    openLabel: string;
    cards: Array<{ href: string; title: string; body: string; tag: string; color: string }>;
  }
> = {
  fr: {
    badge: "Mini games",
    title: "Jeux & defis",
    subtitle: "Travaille ta culture industrie, ton pitch et ton raisonnement avant le jury.",
    openLabel: "Ouvrir",
    cards: [
      { href: "/application/games/quiz", title: "Industry 4.0 Quiz", body: "Quiz rapide avec score et classement portail.", tag: "Quiz", color: "#10b981" },
      { href: "/application/games/pitch", title: "Pitch Timer", body: "Chronometre ton pitch puis demande un feedback jury.", tag: "Pitch", color: "#f97316" },
      { href: "/application/games/match", title: "Filiere Match", body: "Associe les technos aux bons parcours du departement.", tag: "Orientation", color: "#8b5cf6" },
      { href: "/application/games/scenario", title: "Scenario Challenge", body: "Reponds a un cas industriel et recois une analyse expert.", tag: "Case study", color: "#0ea5e9" }
    ]
  },
  en: {
    badge: "Mini games",
    title: "Games & drills",
    subtitle: "Train your industrial culture, your pitch, and your reasoning before jury day.",
    openLabel: "Open",
    cards: [
      { href: "/application/games/quiz", title: "Industry 4.0 Quiz", body: "Fast quiz with score tracking and portal leaderboard.", tag: "Quiz", color: "#10b981" },
      { href: "/application/games/pitch", title: "Pitch Timer", body: "Time your pitch and request jury-style feedback.", tag: "Pitch", color: "#f97316" },
      { href: "/application/games/match", title: "Branch Match", body: "Map technologies to the right department tracks.", tag: "Orientation", color: "#8b5cf6" },
      { href: "/application/games/scenario", title: "Scenario Challenge", body: "Answer an industrial case and get expert analysis.", tag: "Case study", color: "#0ea5e9" }
    ]
  },
  ar: {
    badge: "Mini games",
    title: "الألعاب والتحديات",
    subtitle: "درب ثقافتك الصناعية والعرض والمنهجية قبل يوم اللجنة.",
    openLabel: "فتح",
    cards: [
      { href: "/application/games/quiz", title: "Industry 4.0 Quiz", body: "اختبار سريع مع نتيجة وترتيب داخل البوابة.", tag: "Quiz", color: "#10b981" },
      { href: "/application/games/pitch", title: "Pitch Timer", body: "قِس عرضك واطلب ملاحظات شبيهة باللجنة.", tag: "Pitch", color: "#f97316" },
      { href: "/application/games/match", title: "Filiere Match", body: "اربط التقنيات بالمسالك المناسبة داخل الشعبة.", tag: "Orientation", color: "#8b5cf6" },
      { href: "/application/games/scenario", title: "Scenario Challenge", body: "أجب عن حالة صناعية واحصل على تحليل خبير.", tag: "Case study", color: "#0ea5e9" }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle);
}

export default async function ApplicantGamesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

      <div className="grid gap-4 lg:grid-cols-2">
        {copy.cards.map((card) => (
          <Link
            key={card.href}
            href={`/${locale}${card.href}`}
            className="glass-card group block p-6 transition hover:-translate-y-1"
          >
            <span
              className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: `${card.color}45`, color: card.color }}
            >
              {card.tag}
            </span>
            <p className="mt-5 font-display text-4xl font-semibold uppercase text-ink">{card.title}</p>
            <p className="mt-3 text-sm text-ink/72 sm:text-base">{card.body}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: card.color }}>
              {copy.openLabel}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
