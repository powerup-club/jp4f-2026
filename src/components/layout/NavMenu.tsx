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
    <div className="hidden items-center gap-1 lg:flex">
      {navItems.map((item) => {
        const href = localizeHref(locale, item.href);
        const active = isLocalizedNavItemActive(pathname, href);
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={href}
            className={`rounded-full border px-4 py-2 font-display text-lg uppercase tracking-[0.08em] transition ${
              active
                ? "border-accent/70 bg-accent/15 text-accent"
                : "border-transparent text-ink/75 hover:border-edge/60 hover:bg-white/20 hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
