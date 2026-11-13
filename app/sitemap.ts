import type { MetadataRoute } from "next";
import { SITE_LOCALES } from "@/config/locales";
import { getSiteUrl } from "@/lib/site-url";

const CHANGE_FREQUENCY = "weekly" as const;

const PUBLIC_ROUTES = [
  "",
  "/programme",
  "/filieres",
  "/competition",
  "/competition/register",
  "/intervenants",
  "/clubs",
  "/quiz",
  "/games",
  "/games/quiz",
  "/games/pitch",
  "/games/match",
  "/games/scenario",
  "/sponsors",
  "/comite",
  "/comite-scientifique"
];

function priorityForPath(path: string): number {
  if (path === "") return 1.0;
  if (path === "/programme" || path === "/competition" || path === "/comite-scientifique") return 0.9;
  if (path.includes("/games/") || path.endsWith("/competition/register")) return 0.7;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return SITE_LOCALES.flatMap((locale) =>
    PUBLIC_ROUTES.map((route) => {
      const languages: Record<string, string> = {};
      for (const loc of SITE_LOCALES) {
        languages[loc] = `${baseUrl}/${loc}${route}`;
      }

      return {
        url: `${baseUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: CHANGE_FREQUENCY,
        priority: priorityForPath(route),
        alternates: {
          languages
        }
      };
    })
  );
}

