"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { isLocalizedNavItemActive, withPortalNavItem } from "./nav-items";

interface MobileNavProps {
  locale: SiteLocale;
  items: NavigationItem[];
}

export function MobileNav({ locale, items }: MobileNavProps) {
  const pathname = usePathname();
  const navItems = withPortalNavItem(locale, items);

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-edge/80 bg-panel/95 p-2 shadow-card backdrop-blur lg:hidden">
      <ul className="grid gap-1" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
        {navItems.map((item) => {
          const href = localizeHref(locale, item.href);
          const active = isLocalizedNavItemActive(pathname, href);
          return (
            <li key={`${item.href}-mobile`}>
              <Link
                href={href}
                className={`flex min-h-14 flex-col items-center justify-center rounded-2xl border px-1 text-center font-display text-[0.72rem] uppercase tracking-[0.06em] leading-tight ${
                  active ? "border-accent/70 bg-accent/15 text-accent" : "border-transparent text-ink/75"
                }`}
              >
                <span>{item.shortLabel ?? item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
