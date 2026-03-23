"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteLocale } from "@/config/locales";
import { localizeHref } from "@/lib/routing";

const TITLES: Record<SiteLocale, Record<string, string>> = {
  fr: {
    home: "Accueil",
    form: "Formulaire",
    rules: "Reglement",
    evaluate: "Evaluation",
    orientation: "Orientation",
    quiz: "Quiz",
    games: "Jeux",
    chat: "Assistant",
    contact: "Contact"
  },
  en: {
    home: "Home",
    form: "Form",
    rules: "Rules",
    evaluate: "Evaluation",
    orientation: "Orientation",
    quiz: "Quiz",
    games: "Games",
    chat: "Chat",
    contact: "Contact"
  },
  ar: {
    home: "الرئيسية",
    form: "الترشح",
    rules: "القواعد",
    evaluate: "التقييم",
    orientation: "التوجيه",
    quiz: "الاختبار",
    games: "الألعاب",
    chat: "المساعد",
    contact: "التواصل"
  }
};

function resolveTitle(locale: SiteLocale, pathname: string | null): string {
  if (!pathname) {
    return TITLES[locale].home;
  }

  const normalized = pathname.replace(new RegExp(`^/${locale}`), "");
  if (normalized === "/application" || normalized === "/application/") {
    return TITLES[locale].home;
  }

  const segment = normalized.split("/")[2] ?? "";
  return TITLES[locale][segment] ?? TITLES[locale].home;
}

export function MobilePortalTopBar({
  locale,
  userName,
  userImage
}: {
  locale: SiteLocale;
  userName: string;
  userImage?: string;
}) {
  const pathname = usePathname();
  const title = resolveTitle(locale, pathname);
  const name = userName ?? "";
  const trimmedName = name.trim();
  const firstName = trimmedName.split(" ")[0] ?? "";
  const initial = trimmedName ? trimmedName.charAt(0).toUpperCase() : "U";
  const avatar = userImage ?? "";
  const homeHref = localizeHref(locale, "/application");
  const isHome = pathname === homeHref;

  return (
    <div className="fixed inset-x-0 top-20 z-40 border-b border-edge/70 bg-panel/95 shadow-card backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link
          href={homeHref}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-edge/60 bg-panel/90 text-ink/70 transition hover:border-accent hover:text-accent"
          aria-label="Portal home"
        >
          {isHome ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 rtl-flip" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          )}
        </Link>

        <p className="min-w-0 flex-1 truncate text-center font-display text-sm uppercase tracking-[0.16em] text-ink/75">
          {title}
        </p>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-edge/60 bg-panel/90">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={firstName || "User"} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-semibold text-ink/70">
                {initial}
              </div>
            )}
          </div>
          <span className="hidden text-xs font-semibold text-ink/70 sm:inline">{firstName}</span>
        </div>
      </div>
    </div>
  );
}
