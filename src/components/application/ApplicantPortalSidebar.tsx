"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { SiteLocale } from "@/config/locales";
import { localizeHref } from "@/lib/routing";

type SidebarItem = {
  href: string;
  label: string;
  icon:
    | "home"
    | "form"
    | "rules"
    | "evaluate"
    | "orientation"
    | "games"
    | "quiz"
    | "chat"
    | "contact";
};

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    signOut: string;
    fallbackName: string;
    nav: SidebarItem[];
  }
> = {
  fr: {
    badge: "Espace candidat",
    signOut: "Deconnexion",
    fallbackName: "Candidat Google",
    nav: [
      { href: "/application", label: "Accueil", icon: "home" },
      { href: "/application/form", label: "Formulaire", icon: "form" },
      { href: "/application/rules", label: "Reglement", icon: "rules" },
      { href: "/application/evaluate", label: "Evaluation", icon: "evaluate" },
      { href: "/application/orientation", label: "Orientation", icon: "orientation" },
      { href: "/application/games", label: "Jeux", icon: "games" },
      { href: "/application/quiz", label: "Quiz", icon: "quiz" },
      { href: "/application/chat", label: "Assistant", icon: "chat" },
      { href: "/application/contact", label: "Contact", icon: "contact" }
    ]
  },
  en: {
    badge: "Applicant portal",
    signOut: "Sign out",
    fallbackName: "Google applicant",
    nav: [
      { href: "/application", label: "Home", icon: "home" },
      { href: "/application/form", label: "Application", icon: "form" },
      { href: "/application/rules", label: "Rules", icon: "rules" },
      { href: "/application/evaluate", label: "Evaluate", icon: "evaluate" },
      { href: "/application/orientation", label: "Orientation", icon: "orientation" },
      { href: "/application/games", label: "Games", icon: "games" },
      { href: "/application/quiz", label: "Quiz", icon: "quiz" },
      { href: "/application/chat", label: "Chat", icon: "chat" },
      { href: "/application/contact", label: "Contact", icon: "contact" }
    ]
  },
  ar: {
    badge: "بوابة المترشحين",
    signOut: "تسجيل الخروج",
    fallbackName: "مترشح Google",
    nav: [
      { href: "/application", label: "الرئيسية", icon: "home" },
      { href: "/application/form", label: "الترشح", icon: "form" },
      { href: "/application/rules", label: "القواعد", icon: "rules" },
      { href: "/application/evaluate", label: "التقييم", icon: "evaluate" },
      { href: "/application/orientation", label: "التوجيه", icon: "orientation" },
      { href: "/application/games", label: "الألعاب", icon: "games" },
      { href: "/application/quiz", label: "الاختبار", icon: "quiz" },
      { href: "/application/chat", label: "المساعد", icon: "chat" },
      { href: "/application/contact", label: "التواصل", icon: "contact" }
    ]
  }
};

function Icon({ kind }: { kind: SidebarItem["icon"] }) {
  if (kind === "home") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    );
  }

  if (kind === "rules") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
      </svg>
    );
  }

  if (kind === "form") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 4h8" />
        <path d="M8 9h8" />
        <path d="M8 14h5" />
        <path d="M5.5 3h13A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3Z" />
      </svg>
    );
  }

  if (kind === "evaluate") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19V5" />
        <path d="M10 19V11" />
        <path d="M16 19V8" />
        <path d="M22 19V3" />
      </svg>
    );
  }

  if (kind === "orientation") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m12 12 5-5" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  }

  if (kind === "games") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6.5 9H9" />
        <path d="M7.75 7.75v2.5" />
        <path d="M15.5 8.75h.01" />
        <path d="M18 11.25h.01" />
        <path d="M7.8 18.5h8.4A4.8 4.8 0 0 0 21 13.7c0-3.1-2.4-5.7-5.5-5.9L13.3 5a2.3 2.3 0 0 0-2.6-.6L6.2 6.2A4.8 4.8 0 0 0 3 10.7v2.9a4.9 4.9 0 0 0 4.8 4.9Z" />
      </svg>
    );
  }

  if (kind === "chat") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-5 4v-4.5A2.5 2.5 0 0 1 4 13V6.5Z" />
        <path d="M8 9h8" />
        <path d="M8 12h5" />
      </svg>
    );
  }

  if (kind === "quiz") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9.1 9a3 3 0 1 1 5.8 1c-.3.8-.9 1.4-1.7 1.8-.7.4-1.2.9-1.2 1.7" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10.5h10" />
      <path d="M7 14.5h6" />
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-13Z" />
    </svg>
  );
}

function isItemActive(pathname: string, href: string): boolean {
  if (href.endsWith("/application")) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function ApplicantPortalSidebar({
  locale,
  userName,
  userEmail
}: {
  locale: SiteLocale;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname() ?? localizeHref(locale, "/application");
  const copy = COPY[locale];

  return (
    <aside className="glass-card h-fit p-5 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="badge-line">{copy.badge}</p>
          <p className="mt-3 font-display text-2xl font-semibold uppercase text-ink">
            {userName || copy.fallbackName}
          </p>
          <p className="mt-1 break-all text-sm text-ink/65">{userEmail}</p>
        </div>
        <ThemeToggle locale={locale} />
      </div>

      <nav className="team-scroll mt-6 max-h-[calc(100vh-15rem)] space-y-2 overflow-y-auto pr-1" aria-label="Applicant portal navigation">
        {copy.nav.map((item) => {
          const href = localizeHref(locale, item.href);
          const active = isItemActive(pathname, href);

          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-edge/70 bg-panel/75 text-ink/70 hover:border-accent hover:text-accent"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon kind={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => void signOut({ redirectTo: "/auth/login" })}
        className="mt-6 w-full rounded-full border border-edge/80 bg-panel/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-rose transition hover:border-rose hover:text-rose"
      >
        {copy.signOut}
      </button>
    </aside>
  );
}
