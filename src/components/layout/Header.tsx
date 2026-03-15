import Link from "next/link";
import type { NavigationItem, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { NavMenu } from "./NavMenu";

interface HeaderProps {
  locale: SiteLocale;
  nav: NavigationItem[];
  siteName: string;
}

export function Header({ locale, nav, siteName }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-edge/50 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href={localizeHref(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full px-2 py-1"
          >
            <span
              id="site-logo-text"
              className="font-display text-base font-semibold uppercase tracking-[0.06em] sm:text-lg"
            >
              {siteName}
            </span>
          </Link>

          <NavMenu locale={locale} items={nav} />

          <div className="flex items-center gap-2" />
        </div>
      </div>
    </header>
  );
}
