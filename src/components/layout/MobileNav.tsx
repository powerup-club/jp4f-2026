"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";

interface MobileNavProps {
  locale: SiteLocale;
  items: NavigationItem[];
}

export function MobileNav({ locale, items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-edge/80 bg-panel/95 p-2 shadow-card backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {items.slice(0, 5).map((item) => {
          const href = localizeHref(locale, item.href);
          const active = pathname === href;
          return (
            <li key={`${item.href}-mobile`}>
              <Link
                href={href}
                className={`flex min-h-14 flex-col items-center justify-center rounded-2xl border px-1 text-center font-display text-sm uppercase tracking-[0.06em] leading-tight ${
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
