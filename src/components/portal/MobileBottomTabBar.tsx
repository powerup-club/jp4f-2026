"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { SiteLocale } from "@/config/locales";
import { localizeHref } from "@/lib/routing";

type TabKey =
  | "home"
  | "form"
  | "rules"
  | "evaluate"
  | "orientation"
  | "quiz"
  | "games"
  | "chat"
  | "contact"
  | "logout";

const TAB_COPY: Record<SiteLocale, Record<TabKey, string>> = {
  fr: {
    home: "Accueil",
    form: "Formulaire",
    rules: "Reglement",
    evaluate: "Evaluation",
    orientation: "Orientation",
    quiz: "Quiz",
    games: "Jeux",
    chat: "Chat",
    contact: "Contact",
    logout: "Quitter"
  },
  en: {
    home: "Home",
    form: "Form",
    rules: "Rules",
    evaluate: "Evaluate",
    orientation: "Orientation",
    chat: "Chat",
    quiz: "Quiz",
    games: "Games",
    contact: "Contact",
    logout: "Sign out"
  },
  ar: {
    home: "الرئيسية",
    form: "الترشح",
    rules: "القواعد",
    evaluate: "التقييم",
    orientation: "التوجيه",
    chat: "المساعد",
    quiz: "الاختبار",
    games: "الألعاب",
    contact: "التواصل",
    logout: "خروج"
  }
};

const TABS: Array<{
  key: TabKey;
  href: string;
  icon: "home" | "form" | "rules" | "evaluate" | "orientation" | "quiz" | "games" | "chat" | "contact" | "logout";
}> = [
  { key: "home", href: "/application", icon: "home" },
  { key: "form", href: "/application/form", icon: "form" },
  { key: "rules", href: "/application/rules", icon: "rules" },
  { key: "evaluate", href: "/application/evaluate", icon: "evaluate" },
  { key: "orientation", href: "/application/orientation", icon: "orientation" },
  { key: "quiz", href: "/application/quiz", icon: "quiz" },
  { key: "games", href: "/application/games", icon: "games" },
  { key: "chat", href: "/application/chat", icon: "chat" },
  { key: "contact", href: "/application/contact", icon: "contact" },
  { key: "logout", href: "/", icon: "logout" }
];

function TabIcon({
  kind
}: {
  kind:
    | "home"
    | "form"
    | "rules"
    | "evaluate"
    | "orientation"
    | "quiz"
    | "games"
    | "chat"
    | "contact"
    | "logout";
}) {
  if (kind === "home") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
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

  if (kind === "rules") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
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
        <path d="M7.5 10.5h9A4.5 4.5 0 0 1 21 15v1.25A2.75 2.75 0 0 1 18.25 19h-.4a2.75 2.75 0 0 1-2.27-1.2l-.55-.8H9l-.55.8A2.75 2.75 0 0 1 6.18 19h-.43A2.75 2.75 0 0 1 3 16.25V15a4.5 4.5 0 0 1 4.5-4.5Z" />
        <path d="M7 13.5h3" />
        <path d="M8.5 12v3" />
        <path d="M15.9 13.6h.01" />
        <path d="M17.6 12.9h.01" />
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

  if (kind === "logout") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="M10 17l-4-5 4-5" />
        <path d="M6 12h12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4.5-5.5 9-5.5 9s-5.5-4.5-5.5-9Z" />
      <circle cx="12" cy="9.5" r="2" />
    </svg>
  );
}

function isActiveTab(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  if (href.endsWith("/application")) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function MobileBottomTabBar({ locale }: { locale: SiteLocale }) {
  const pathname = usePathname();
  const copy = TAB_COPY[locale];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-edge/70 bg-panel/95 shadow-card backdrop-blur-md lg:hidden pb-[env(safe-area-inset-bottom)]">
      <ul className="grid h-24 grid-cols-5 grid-rows-2 gap-1 px-2 py-2">
        {TABS.map((tab) => {
          const href = localizeHref(locale, tab.href);
          const active = isActiveTab(pathname, href);
          const isLogout = tab.key === "logout";

          return (
            <li key={tab.key} className="h-full">
              {isLogout ? (
                <button
                  type="button"
                  onClick={() => void signOut({ redirectTo: localizeHref(locale, "/") })}
                  className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-rose transition-colors hover:text-rose/80"
                >
                  <TabIcon kind={tab.icon} />
                  <span>{copy[tab.key]}</span>
                </button>
              ) : (
                <Link
                  href={href}
                  className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    active ? "text-accent" : "text-ink/70 hover:text-accent"
                  }`}
                >
                  <TabIcon kind={tab.icon} />
                  <span>{copy[tab.key]}</span>
                  {active ? <span className="mt-1 h-1 w-1 rounded-full bg-accent" /> : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
