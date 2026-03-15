"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { NavigationItem } from "@/content/types";
import type { SiteLocale } from "@/config/locales";
import { localizeHref } from "@/lib/routing";
import { isLocalizedNavItemActive, withPortalNavItem } from "./nav-items";

interface NavMenuProps {
  locale: SiteLocale;
  items: NavigationItem[];
}

export function NavMenu({ locale, items }: NavMenuProps) {
  const pathname = usePathname();
  const navItems = withPortalNavItem(locale, items);

  return (
    <nav aria-label="Primary navigation" className="hidden lg:flex">
      <ul className="flex items-center gap-4 xl:gap-6">
        {navItems.map((item) => {
          const href = localizeHref(locale, item.href);
          const active = isLocalizedNavItemActive(pathname, href);
          const isPortal = item.href === "/application";

          const baseClass =
            "inline-flex items-center justify-center font-display text-sm uppercase tracking-[0.14em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

          const inactiveClass = isPortal
            ? "rounded-full border border-accent/50 px-4 py-2 text-accent hover:border-accent/70 hover:bg-accent/10"
            : "px-1 py-2 text-accent2 hover:text-ink";

          const activeClass = isPortal
            ? "rounded-full border border-accent bg-accent/20 px-4 py-2 text-accent shadow-halo"
            : "rounded-full border border-accent/70 bg-accent/15 px-4 py-2 text-accent shadow-halo";

          return (
            <li key={`${item.href}-${item.label}`}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`${baseClass} ${active ? activeClass : inactiveClass}`}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
