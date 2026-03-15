import { SITE_LOCALES } from "@/config/locales";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://innov-indus.vercel.app").replace(/\/+$/, "");
const CHANGE_FREQUENCY = "weekly";

const STATIC_ROUTES = ["/"];

const LOCALE_ROUTES = [
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

function buildUrl(path) {
  if (path === "/" || path === "") {
    return `${BASE_URL}/`;
  }

  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function priorityForPath(path) {
  if (path === "/") return 1.0;
  if (SITE_LOCALES.some((locale) => path === `/${locale}`)) return 0.9;
  if (path.includes("/games/") || path.endsWith("/competition/register")) return 0.7;
  return 0.8;
}

export default function sitemap() {
  const lastModified = new Date();

  const localeRoutes = SITE_LOCALES.flatMap((locale) =>
    LOCALE_ROUTES.map((path) => `/${locale}${path}`)
  );

  const allRoutes = Array.from(new Set([...STATIC_ROUTES, ...localeRoutes]));

  return allRoutes.map((path) => ({
    url: buildUrl(path),
    lastModified,
    changeFrequency: CHANGE_FREQUENCY,
    priority: priorityForPath(path)
  }));
}
