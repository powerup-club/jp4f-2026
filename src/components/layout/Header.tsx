import Link from "next/link";
import type { NavigationItem, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { NavMenu } from "./NavMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  locale: SiteLocale;
  nav: NavigationItem[];
  siteName: string;
}

export function Header({ locale, nav, siteName }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-edge/70 bg-paper/70 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-3">
        <Link
          href={localizeHref(locale, "/")}
          className="inline-flex items-center gap-3 rounded-full border border-edge bg-panel/95 px-4 py-2 shadow-halo"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-signal via-accent2 to-accent text-sm font-extrabold text-white">
            JP
          </span>
          <span className="font-display text-lg font-semibold uppercase tracking-[0.06em] sm:text-xl">{siteName}</span>
        </Link>

        <NavMenu locale={locale} items={nav} />

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
