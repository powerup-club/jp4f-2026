"use client";

import { usePathname } from "next/navigation";
import type { FooterContent, SiteLocale } from "@/content/types";
import { Footer } from "./Footer";

export function PortalFooter({ locale, content }: { locale: SiteLocale; content: FooterContent }) {
  const pathname = usePathname();
  const isPortal = pathname?.includes(`/${locale}/application`);

  if (isPortal) {
    return null;
  }

  return <Footer locale={locale} content={content} />;
}
