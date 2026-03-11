import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import type { SiteLocale } from "@/config/locales";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";
import { localizeHref } from "@/lib/routing";
import { SponsorsForm } from "@/components/sections/SponsorsForm";

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

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"];

const SPONSOR_META = new Map<string, { name: string; links?: LogoLink[] }>([
  ["alten", { name: "Alten Maroc", links: [{ url: "https://www.alten.ma" }] }],
  ["capgemini", { name: "Capgemini Engineering", links: [{ url: "https://www.capgemini-engineering.com" }] }],
  ["cite d innovation", { name: "Cite d'Innovation Fes", links: [{ url: "https://www.est-usmba.ac.ma" }] }],
  ["commune ribat el kheir", { name: "Commune Ribat El Kheir", links: [{ url: "https://www.communeribatelkheir.ma" }] }],
  [
    "ctpc",
    {
      name: "CTPC (Centre Technique des Plastiques et Caoutchoucs)",
      links: [{ url: "https://www.ctpc.fr" }]
    }
  ],
  ["est fes", { name: "EST Fes", links: [{ url: "https://www.est-usmba.ac.ma" }] }],
  ["green energy park", { name: "Green Energy Park", links: [{ url: "http://www.greenenergypark.ma" }] }],
  ["master tec", { name: "Master Tec", links: [{ url: "https://www.mastertec-group.com" }] }],
  ["safran", { name: "Safran", links: [{ url: "https://www.safran-group.com" }] }],
  ["um5 rabat", { name: "UM5 Rabat", links: [{ url: "https://www.um5.ac.ma" }] }],
  [
    "usmba et ensa fes",
    {
      name: "USMBA & ENSA Fes",
      links: [
        { url: "https://www.usmba.ac.ma", label: "usmba.ac.ma" },
        { url: "https://www.ensaf.ac.ma", label: "ensaf.ac.ma" }
      ]
    }
  ]
]);
SPONSOR_META.set("usmba et ensa fs", SPONSOR_META.get("usmba et ensa fes")!);

function toLabel(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function normalizeLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function formatUrlLabel(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

function getLogoEntries(relativeDir: string): LogoItem[] {
  const fullDir = path.join(process.cwd(), "public", ...relativeDir.split("/"));
  if (!fs.existsSync(fullDir)) {
    return [];
  }
  return fs
    .readdirSync(fullDir)
    .filter((file) => IMAGE_EXTENSIONS.some((ext) => file.toLowerCase().endsWith(ext)))
    .map((file) => {
      const label = toLabel(file);
      const meta = SPONSOR_META.get(normalizeLabel(label));
      return {
        src: `/${relativeDir}/${file}`,
        alt: meta?.name ?? label,
        name: meta?.name ?? label,
        links: meta?.links
      };
    });
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.src}
          className="group glass-card flex flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_20px_50px_rgba(249,115,22,0.2)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-panel/80 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-contain opacity-90 transition group-hover:opacity-100"
              loading="lazy"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">{item.name}</p>
            {item.links?.length ? (
              <div className="flex flex-col items-center gap-1">
                {item.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent"
                  >
                    {link.label ?? formatUrlLabel(link.url)}
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-[11px] uppercase tracking-[0.1em] text-ink/45">{missingSiteLabel}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function LogoMarquee({
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

  const marqueeItems = [...items, ...items];

  return (
    <div className="lux-marquee rounded-3xl border border-edge/60 bg-panel/80 p-2">
      <div className="lux-marquee__track">
        {marqueeItems.map((item, index) => (
          <div key={`${item.src}-${index}`} className="lux-marquee__item glass-card flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-panel/80 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-contain opacity-90"
                loading="lazy"
              />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">{item.name}</p>
            {item.links?.length ? (
              <div className="flex flex-col items-center gap-1">
                {item.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent"
                  >
                    {link.label ?? formatUrlLabel(link.url)}
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-[10px] uppercase tracking-[0.1em] text-ink/45">{missingSiteLabel}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.sponsors.hero.title, content.sponsors.hero.subtitle);
}

function buildTierAnchor(locale: SiteLocale, tier: string) {
  return `${localizeHref(locale, "/sponsors")}?tier=${encodeURIComponent(tier)}#sponsor-form`;
}

export default async function SponsorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  const copy = content.sponsors;

  const sponsor2026 = {
    gold: getLogoEntries("sponsors/2026/logos/gold"),
    silver: getLogoEntries("sponsors/2026/logos/silver"),
    bronze: getLogoEntries("sponsors/2026/logos/bronze")
  };

  const previousDirectories: Record<string, LogoItem[]> = {
    jesi: getLogoEntries("sponsors/jesi"),
    "campus-indus": getLogoEntries("sponsors/campus-indus"),
    innovtech: getLogoEntries("sponsors/innovtech")
  };

  // Club data will be updated later via content JSON.
  const clubs = content.clubsPage?.clubs ?? [];
  const missingSiteLabel = copy.missingSiteLabel;

  return (
    <div className="space-y-16" dir={locale === "ar" ? "rtl" : "ltr"}>
      <section className="section-shell pt-6">
        <article className="glass-card overflow-hidden p-8 sm:p-12">
          <p className="badge-line">{locale === "ar" ? "JP4F 2026" : "JP4F 2026"}</p>
          <h1 className="mt-5 font-display text-4xl font-semibold uppercase text-ink sm:text-6xl">
            <span className="gradient-title">{copy.hero.title}</span>
          </h1>
          <p className="mt-4 max-w-3xl text-base text-ink/70 sm:text-lg">{copy.hero.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#sponsor-form"
              className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-sm uppercase tracking-[0.1em] text-white shadow-halo transition hover:bg-accent2"
            >
              {copy.hero.ctaBecome}
            </Link>
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

        <div className="mt-6 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{copy.current.goldLabel}</p>
            <div className="mt-4">
              <LogoGrid items={sponsor2026.gold} emptyLabel={copy.current.emptyLabel} missingSiteLabel={missingSiteLabel} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{copy.current.silverLabel}</p>
            <div className="mt-4">
              <LogoGrid items={sponsor2026.silver} emptyLabel={copy.current.emptyLabel} missingSiteLabel={missingSiteLabel} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{copy.current.bronzeLabel}</p>
            <div className="mt-4">
              <LogoGrid items={sponsor2026.bronze} emptyLabel={copy.current.emptyLabel} missingSiteLabel={missingSiteLabel} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">
          {copy.previous.title}
        </h2>

        <div className="mt-6 space-y-8">
          {copy.previous.sections.map((section) => (
            <article key={section.key} className="glass-card p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{section.title}</p>
                  <p className="mt-2 text-sm text-ink/70">{section.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <LogoMarquee
                  items={previousDirectories[section.key] ?? []}
                  emptyLabel={copy.previous.emptyLabel}
                  missingSiteLabel={missingSiteLabel}
                />
              </div>
            </article>
          ))}
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
                <Link
                  href={buildTierAnchor(locale, tier.name)}
                  className="mt-auto rounded-full border border-edge/70 bg-panel/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/70 transition hover:border-accent hover:text-accent"
                >
                  {copy.tiers.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">{copy.process.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.process.steps.map((step, index) => (
            <article key={step.title} className="glass-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-edge/60 bg-panel/90 text-sm font-semibold text-accent">
                {index + 1}
              </div>
              <p className="mt-4 font-display text-xl font-semibold uppercase text-ink">{step.title}</p>
              <p className="mt-2 text-sm text-ink/65">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="sponsor-form" className="section-shell scroll-mt-24">
        <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">{copy.form.title}</h2>
        <div className="mt-6 glass-card p-6 sm:p-8">
          <SponsorsForm copy={copy.form} />
        </div>
      </section>

      <section className="section-shell pb-16">
        <h2 className="font-display text-3xl font-semibold uppercase text-ink sm:text-4xl">{copy.resources.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {copy.resources.items.map((item, index) => (
            <article key={item.title} className="glass-card flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3 text-lg">
                <span className="text-2xl">{index === 0 ? "📄" : "📊"}</span>
                <p className="font-display text-xl font-semibold uppercase text-ink">{item.title}</p>
              </div>
              <p className="text-sm text-ink/65">{item.description}</p>
              <a
                href={index === 0 ? "/sponsors/dossier.pdf" : "/sponsors/presentation.pdf"}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex w-fit rounded-full border border-edge/70 bg-panel/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/75 transition hover:border-accent hover:text-accent"
              >
                {item.button}
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
