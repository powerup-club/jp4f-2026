import type { Metadata } from "next";
import { getSiteContent } from "@/content";
import { getValidatedLocale } from "@/lib/locale-page";
import { SEO_KEYWORDS } from "@/lib/seo";

type LogoLink = {
  url: string;
  label?: string;
};

type LogoItem = {
  src: string;
  alt: string;
  name: string;
  links?: LogoLink[];
};

function formatUrlLabel(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

function LogoGrid({
  items,
  emptyLabel,
  missingSiteLabel
}: {
  items: LogoItem[];
  emptyLabel: string;
  missingSiteLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-edge/60 bg-panel/80 p-6 text-center text-sm text-ink/60">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.src}
          className="group glass-card flex flex-col items-center gap-5 p-8 text-center transition hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_20px_50px_rgba(249,115,22,0.2)]"
        >
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-panel/80 p-4 sm:h-40 sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-contain opacity-90 transition group-hover:opacity-100"
              loading="lazy"
            />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold uppercase tracking-[0.14em] text-ink sm:text-lg">{item.name}</p>
            {item.links?.length ? (
              <div className="flex flex-col items-center gap-1">
                {item.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold uppercase tracking-[0.1em] text-accent"
                  >
                    {link.label ?? formatUrlLabel(link.url)}
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-xs uppercase tracking-[0.1em] text-ink/45">{missingSiteLabel}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Sponsors Innov'Industry 2026 | Partenaires industriels ENSA Fès",
  description:
    "Sponsors ENGINOV DAYS: entreprise partenaire ENSA Fès, partenariat industriel ENSA Fès et entreprises qui recrutent ingénieurs Fès, recruteur ingénieur Fès au Maroc.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Innov'Industry 2026 - ENSA Fès" }],
  openGraph: {
    title: "Sponsors Innov'Industry 2026 | Partenaires industriels ENSA Fès",
    description:
      "Sponsors ENGINOV DAYS: entreprise partenaire ENSA Fès, partenariat industriel ENSA Fès et entreprises qui recrutent ingénieurs Fès, recruteur ingénieur Fès au Maroc.",
    url: "https://enginov-days.vercel.app/[locale]/sponsors",
    siteName: "Innov'Industry 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://enginov-days.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors Innov'Industry 2026 | Partenaires industriels ENSA Fès",
    description:
      "Sponsors ENGINOV DAYS: entreprise partenaire ENSA Fès, partenariat industriel ENSA Fès et entreprises qui recrutent ingénieurs Fès, recruteur ingénieur Fès au Maroc."
  },
  alternates: {
    canonical: "https://enginov-days.vercel.app/[locale]/sponsors"
  }
};

export default async function SponsorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  const copy = content.sponsors;

  const currentSponsors: LogoItem[] = [
    {
      src: "/sponsors/jesi/Alten.png",
      alt: "Alten Maroc",
      name: "Alten Maroc",
      links: [{ url: "https://www.alten.ma" }]
    },
    {
      src: "/images/clubs/logo-ensaf.png",
      alt: "ENSA Fès",
      name: "ENSA Fès",
      links: [{ url: "https://www.ensaf.ac.ma" }]
    },
    {
      src: "/sponsors/jesi/USMBA et Ensa Fès.png",
      alt: "USMBA",
      name: "USMBA",
      links: [{ url: "https://www.usmba.ac.ma" }]
    }
  ];

  // Club data will be updated later via content JSON.
  const clubs = content.clubsPage?.clubs ?? [];
  const missingSiteLabel = copy.missingSiteLabel;

  return (
    <div className="space-y-16" dir={locale === "ar" ? "rtl" : "ltr"}>
      <section className="section-shell pt-6">
        <article className="glass-card overflow-hidden p-8 sm:p-12">
          <p className="badge-line">{locale === "ar" ? "Innov'Industry 2026" : "Innov'Industry 2026"}</p>
          <h1 className="mt-5 font-display text-4xl font-semibold uppercase text-ink sm:text-6xl">
            <span className="gradient-title">{copy.hero.title}</span>
          </h1>
          <p className="mt-4 max-w-3xl text-base text-ink/70 sm:text-lg">{copy.hero.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/sponsors/dossier.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-edge/70 bg-panel/95 px-6 py-3 font-display text-sm uppercase tracking-[0.1em] text-ink/75 transition hover:border-accent hover:text-accent"
            >
              {copy.hero.ctaDownload}
            </a>
          </div>
        </article>
      </section>

      <section className="section-shell">
        <div className="text-center">
          <p className="badge-line">{copy.goals.title}</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.goals.items.map((goal, index) => (
            <article key={goal.title} className="glass-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-edge/60 bg-panel/90 text-sm font-semibold text-accent">
                {index + 1}
              </div>
              <p className="mt-4 font-display text-xl font-semibold uppercase text-ink">{goal.title}</p>
              <p className="mt-2 text-sm text-ink/65">{goal.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">
            {copy.current.title}
          </h2>
        </div>

        <div className="mt-6">
          <LogoGrid items={currentSponsors} emptyLabel={copy.current.emptyLabel} missingSiteLabel={missingSiteLabel} />
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">
          {copy.organizers.title}
        </h2>
        <p className="mt-2 text-sm text-ink/70">{copy.organizers.subtitle}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {clubs.map((club) => (
            <article key={club.id} className="glass-card flex flex-col gap-4 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={club.logo}
                alt={club.name}
                className="h-14 w-14 rounded-2xl bg-panel/80 p-2 object-contain"
                loading="lazy"
              />
              <div>
                <p className="font-display text-xl font-semibold uppercase text-ink">{club.name}</p>
                <p className="mt-2 text-sm text-ink/65">{club.description}</p>
              </div>
              {club.links?.[0] ? (
                <a
                  href={club.links[0].href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto text-xs font-semibold uppercase tracking-[0.12em] text-accent"
                >
                  {club.links[0].label}
                </a>
              ) : null}
            </article>
          ))}

          <article className="glass-card flex flex-col gap-4 p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clubs/logo-ensaf.png"
              alt="ENSA Fes"
              className="h-14 w-14 rounded-2xl bg-panel/80 p-2 object-contain"
              loading="lazy"
            />
            <div>
              <p className="font-display text-xl font-semibold uppercase text-ink">{copy.organizers.schoolTitle}</p>
              <p className="mt-2 text-sm text-ink/65">{copy.organizers.schoolDescription}</p>
            </div>
            <a
              href="https://ensaf.ac.ma"
              target="_blank"
              rel="noreferrer"
              className="mt-auto text-xs font-semibold uppercase tracking-[0.12em] text-accent"
            >
              {copy.organizers.schoolLinkLabel}
            </a>
          </article>

        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">{copy.tiers.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[copy.tiers.gold, copy.tiers.silver, copy.tiers.bronze].map((tier, index) => {
            const isGold = index === 0;
            return (
              <article
                key={tier.name}
                className={`glass-card flex flex-col gap-4 p-6 ${isGold ? "border-accent/70 shadow-[0_0_35px_rgba(249,115,22,0.3)]" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-2xl font-semibold uppercase text-ink">
                    {isGold ? "🥇 " : index === 1 ? "🥈 " : "🥉 "}
                    {tier.name}
                  </p>
                  <span className="rounded-full border border-edge/60 bg-panel/80 px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink/60">
                    {tier.price}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-ink/70">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
}
