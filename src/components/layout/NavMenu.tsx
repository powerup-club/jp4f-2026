"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { NavigationItem } from "@/content/types";
import type { SiteLocale } from "@/config/locales";
import { localizeHref } from "@/lib/routing";
import { isLocalizedNavItemActive } from "./nav-items";

interface NavMenuProps {
  locale: SiteLocale;
  items: NavigationItem[];
}

export function NavMenu({ locale, items }: NavMenuProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="hidden lg:flex">
      <ul className="flex items-center gap-4 xl:gap-6">
        {items.map((item) => {
          const href = localizeHref(locale, item.href);
          const active = isLocalizedNavItemActive(pathname, href);

          const baseClass =
            "inline-flex items-center justify-center font-display text-sm uppercase tracking-[0.14em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`${baseClass} ${active
                  ? "rounded-full border border-accent/70 bg-accent/15 px-4 py-2 text-accent shadow-halo"
                  : "px-1 py-2 text-accent2 hover:text-ink"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
