import Link from "next/link";
import type { FooterContent, FooterLink, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";

interface FooterProps {
  locale: SiteLocale;
  content: FooterContent;
}

type ContactKind = "phone" | "email" | "linkedin" | "address" | "website" | "other";

interface ClubContactGroup {
  name: string;
  phone?: FooterLink;
  email?: FooterLink;
  linkedin?: FooterLink;
  extra: FooterLink[];
}

const CONTACT_TAG: Record<ContactKind, string> = {
  phone: "PHONE",
  email: "EMAIL",
  linkedin: "LINKEDIN",
  address: "ADDRESS",
  website: "WEB",
  other: "INFO",
};

function inferContactKind(link: FooterLink): ContactKind {
  const label = link.label.toLowerCase();
  const href = link.href.toLowerCase();
  if (href.startsWith("tel:") || label.includes("phone")) return "phone";
  if (href.startsWith("mailto:") || label.includes("email")) return "email";
  if (href.includes("linkedin.com") || label.includes("linkedin")) return "linkedin";
  if (
    href.includes("maps.google") ||
    label.includes("address") ||
    label.includes("adresse") ||
    label.includes("avenue") ||
    label.includes("route")
  )
    return "address";
  if (href.startsWith("http://") || href.startsWith("https://")) return "website";
  return "other";
}

function extractClubName(label: string): string {
  const [name] = label.split(" - ");
  return (name ?? "").trim();
}

function getClubNames(clubs: FooterLink[]): string[] {
  return Array.from(
    new Set(
      clubs
        .map((club) => extractClubName(club.label))
        .filter((clubName) => clubName.length > 0)
    )
  );
}

function matchClubContact(link: FooterLink, clubNames: string[]): string | null {
  const lowerLabel = link.label.toLowerCase();
  const match = clubNames.find((clubName) => lowerLabel.startsWith(clubName.toLowerCase()));
  return match ?? null;
}

function splitContacts(
  contacts: FooterLink[],
  clubs: FooterLink[]
): { generalContacts: FooterLink[]; clubContacts: ClubContactGroup[] } {
  const clubNames = getClubNames(clubs);
  const grouped = new Map<string, ClubContactGroup>();
  for (const clubName of clubNames) {
    grouped.set(clubName, { name: clubName, extra: [] });
  }
  const generalContacts: FooterLink[] = [];
  for (const contact of contacts) {
    const clubName = matchClubContact(contact, clubNames);
    if (!clubName) { generalContacts.push(contact); continue; }
    const group = grouped.get(clubName);
    if (!group) { generalContacts.push(contact); continue; }
    const type = inferContactKind(contact);
    if (type === "phone" && !group.phone) { group.phone = contact; continue; }
    if (type === "email" && !group.email) { group.email = contact; continue; }
    if (type === "linkedin" && !group.linkedin) { group.linkedin = contact; continue; }
    group.extra.push(contact);
  }
  for (const club of clubs) {
    const clubName = extractClubName(club.label);
    const group = grouped.get(clubName);
    if (!group || group.linkedin || !club.href.startsWith("http")) continue;
    group.linkedin = { label: "LinkedIn", href: club.href, external: true };
  }
  const clubContacts = Array.from(grouped.values()).filter(
    (group) => Boolean(group.phone || group.email || group.linkedin || group.extra.length > 0)
  );
  return { generalContacts, clubContacts };
}

function getLinkProps(link: FooterLink): { target?: "_blank"; rel?: "noopener noreferrer" } {
  const openInNewTab =
    Boolean(link.external) &&
    (link.href.startsWith("http://") || link.href.startsWith("https://"));
  if (!openInNewTab) return {};
  return { target: "_blank", rel: "noopener noreferrer" };
}

function getContactValue(link: FooterLink, kind: ContactKind): string {
  const markerIndex = link.label.indexOf(":");
  if (markerIndex !== -1) return link.label.slice(markerIndex + 1).trim();
  if (kind === "phone" && link.href.startsWith("tel:")) return link.href.replace(/^tel:/i, "").trim();
  if (kind === "email" && link.href.startsWith("mailto:")) return link.href.replace(/^mailto:/i, "").trim();
  return link.label.trim();
}

/* ─── tiny reusable primitives ─────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-display text-xl uppercase tracking-[0.08em] text-ink/55">
      {children}
    </p>
  );
}

function InlineContactRow({ link, kind }: { link: FooterLink; kind: ContactKind }) {
  const isAddress = kind === "address";
  const value = getContactValue(link, kind);

  // Split address on commas so it wraps naturally into ~3 lines
  const addressParts = isAddress
    ? value.split(",").map((p) => p.trim()).filter(Boolean)
    : null;

  return (
    <div className={`flex gap-2 ${isAddress ? "items-start" : "items-baseline"}`}>
      <span className="w-12 shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-ink/35 pt-px">
        {CONTACT_TAG[kind]}
      </span>
      <Link
        href={link.href}
        {...getLinkProps(link)}
        className="text-sm text-ink/75 transition-colors hover:text-accent leading-snug"
      >
        {isAddress && addressParts ? (
          <>
            {addressParts.map((part, i) => (
              <span key={i} className="block">
                {part}{i < addressParts.length - 1 ? "," : ""}
              </span>
            ))}
          </>
        ) : (
          value
        )}
      </Link>
    </div>
  );
}

/* ─── Club pill card ────────────────────────────────────────────────── */

function ClubCard({ club }: { club: ClubContactGroup }) {
  return (
    <div className="group rounded-md border border-edge/45 bg-panel/65 px-3 py-2.5 transition-colors hover:border-accent2/45 hover:bg-panel/85">
      {/* header row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xl font-semibold uppercase leading-none text-ink">{club.name}</span>
        {club.linkedin ? (
          <Link
            href={club.linkedin.href}
            {...getLinkProps(club.linkedin)}
            aria-label={`${club.name} LinkedIn`}
            className="flex items-center gap-1 rounded border border-signal/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-signal/70 transition-all hover:border-signal/60 hover:text-signal"
          >
            <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            in
          </Link>
        ) : null}
      </div>

      {/* contact lines */}
      <div className="mt-2 space-y-1">
        {club.phone ? (
          <div className="flex items-center gap-1.5">
            <svg className="h-2.5 w-2.5 shrink-0 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <Link
              href={club.phone.href}
              {...getLinkProps(club.phone)}
              className="text-sm text-ink/70 transition-colors hover:text-accent"
            >
              {getContactValue(club.phone, "phone")}
            </Link>
          </div>
        ) : null}
        {club.email ? (
          <div className="flex items-center gap-1.5">
            <svg className="h-2.5 w-2.5 shrink-0 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
            </svg>
            <Link
              href={club.email.href}
              {...getLinkProps(club.email)}
              className="truncate text-sm text-ink/70 transition-colors hover:text-accent"
            >
              {getContactValue(club.email, "email")}
            </Link>
          </div>
        ) : null}
        {club.extra.map((link) => {
          const k = inferContactKind(link);
          return (
            <div key={`${link.href}-${link.label}`} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 shrink-0" />
              <Link
                href={link.href}
                {...getLinkProps(link)}
                className="truncate text-sm text-ink/60 transition-colors hover:text-accent"
              >
                {getContactValue(link, k)}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────── */

export function Footer({ locale, content }: FooterProps) {
  const { generalContacts, clubContacts } = splitContacts(content.contacts, content.clubs);
  const ensaContacts = generalContacts;

  return (
    <footer className="relative z-10 mt-16 border-t border-edge/60">
      {/* subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-65 bg-[radial-gradient(ellipse_at_15%_0%,rgba(99,102,241,0.14),transparent_50%),radial-gradient(ellipse_at_85%_0%,rgba(249,115,22,0.12),transparent_50%)]"
      />

      <div className="section-shell relative py-8">
        {/* ── main 4-col grid ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.6fr_1.4fr]">

          {/* NAV */}
          <div>
            <SectionLabel>Navigation</SectionLabel>
            <ul className="space-y-2">
              {content.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizeHref(locale, link.href)}
                    className="group flex items-center gap-2 text-sm text-ink/68 transition-colors hover:text-accent"
                  >
                    <span className="h-px w-3 bg-accent/40 transition-all group-hover:w-5 group-hover:bg-accent" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CLUBS LIST */}
          <div>
            <SectionLabel>Clubs</SectionLabel>
            <ul className="space-y-2">
              {content.clubs.map((link) => {
                const clubName = extractClubName(link.label);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...getLinkProps(link)}
                      className="group flex items-center gap-2 text-sm text-ink/68 transition-colors hover:text-accent2"
                    >
                      <span className="h-px w-3 bg-accent2/40 transition-all group-hover:w-5 group-hover:bg-accent2" />
                      {clubName || link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CLUB CONTACTS */}
          {clubContacts.length > 0 ? (
            <div>
              <SectionLabel>Club Contacts</SectionLabel>
              <div className="space-y-2">
                {clubContacts.map((club) => (
                  <ClubCard key={club.name} club={club} />
                ))}
              </div>
            </div>
          ) : null}

          {/* ENSA CONTACT */}
          <div>
            <SectionLabel>ENSA Fes Contact</SectionLabel>
            <div className="space-y-2">
              {ensaContacts.map((link) => {
                const kind = inferContactKind(link);
                return (
                  <InlineContactRow
                    key={`${link.href}-${link.label}`}
                    link={link}
                    kind={kind}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ── bottom bar ── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-edge/30 pt-4">
          <span className="text-sm text-ink/45">{content.legal}</span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {content.badges.map((badge, index) => (
              <span key={badge} className="inline-flex items-center gap-2">
                {index > 0 ? (
                  <span className="h-0.5 w-0.5 rounded-full bg-edge" />
                ) : null}
                <span className="font-display text-lg uppercase tracking-[0.08em] text-ink/55">
                  {badge}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
