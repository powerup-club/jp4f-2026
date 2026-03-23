import fr from "../../content/fr/site.json";
import en from "../../content/en/site.json";
import ar from "../../content/ar/site.json";
import type { SiteLocale } from "@/config/locales";
import type { SiteContent } from "./types";
import { validateSiteContent } from "./validation";

const CONTENT_BY_LOCALE: Record<SiteLocale, SiteContent> = {
  fr: validateSiteContent(fr as SiteContent),
  en: validateSiteContent(en as SiteContent),
  ar: validateSiteContent(ar as SiteContent)
};

export function getSiteContent(locale: SiteLocale): SiteContent {
  return CONTENT_BY_LOCALE[locale];
}
