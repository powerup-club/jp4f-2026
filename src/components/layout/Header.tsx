import Link from "next/link";
import Image from "next/image";
import type { NavigationItem, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { NavMenu } from "./NavMenu";

interface HeaderProps {
  locale: SiteLocale;
  nav: NavigationItem[];
  siteName: string;
}

function splitSiteName(siteName: string) {
  const yearMatch = siteName.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch?.[0] ?? "";
  const nameWithoutYear = year ? siteName.replace(year, "").trim() : siteName.trim();

  const apostropheMatch = nameWithoutYear.match(/^(.*?['\u2019])\s*(.+)$/);
  if (apostropheMatch) {
    return { line1: apostropheMatch[1], line2: apostropheMatch[2], year };
  }

  const tokens = nameWithoutYear.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) {
    return { line1: nameWithoutYear, line2: "", year };
  }

  return { line1: tokens[0], line2: tokens.slice(1).join(" "), year };
}

export function Header({ locale, nav, siteName }: HeaderProps) {
  const { line1, line2, year } = splitSiteName(siteName);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-edge/50 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <div className="grid h-16 grid-cols-[auto_1fr] items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href={localizeHref(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            aria-label={siteName}
          >
            <Image
              src="/images/event-logo/1.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-9 w-9 shrink-0"
            />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-xs uppercase tracking-[0.18em] text-accent2">
                {line1}
              </span>
              <span className="font-display text-xs uppercase tracking-[0.18em] text-accent2">
                {line2}
                {year ? <span className="text-accent"> {year}</span> : null}
              </span>
            </span>
          </Link>

          <div className="justify-self-end lg:justify-self-center">
            <NavMenu locale={locale} items={nav} />
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
