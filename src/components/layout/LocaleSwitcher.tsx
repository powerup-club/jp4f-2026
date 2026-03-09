"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteLocale } from "@/config/locales";
import { LOCALE_LABELS, SITE_LOCALES } from "@/config/locales";
import { switchLocaleInPath } from "@/lib/routing";

interface LocaleSwitcherProps {
  locale: SiteLocale;
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? "/";

  return (
    <div className="flex items-center gap-1 rounded-full border border-edge/80 bg-panel/95 p-1">
      {SITE_LOCALES.map((code) => {
        const href = switchLocaleInPath(pathname, code);
        const active = code === locale;
        return (
          <Link
            key={code}
            href={href}
            className={`rounded-full px-2 py-1 font-display text-xs uppercase tracking-[0.1em] transition sm:px-3 sm:text-base ${
              active ? "bg-accent text-white" : "text-ink/72 hover:text-ink"
            }`}
          >
            <span className="sm:hidden">{code.toUpperCase()}</span>
            <span className="hidden sm:inline">{LOCALE_LABELS[code]}</span>
          </Link>
        );
      })}
    </div>
  );
}
