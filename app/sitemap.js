import { SITE_LOCALES } from "@/config/locales";

const BASE_URL = "https://jp4f.vercel.app";
const CHANGE_FREQUENCY = "weekly";

const STATIC_ROUTES = ["/", "/admin", "/admin/login", "/auth/login"];

const LOCALE_ROUTES = [
  "",
  "/programme",
  "/filieres",
  "/competition",
  "/competition/register",
  "/intervenants",
  "/clubs",
  "/sponsors",
  "/comite",
  "/comite-scientifique",
  "/quiz",
  "/application",
  "/application/form",
  "/application/rules",
  "/application/quiz",
  "/application/contact",
  "/application/evaluate",
  "/application/orientation",
  "/application/chat",
  "/application/games",
  "/application/games/quiz",
  "/application/games/pitch",
  "/application/games/match",
  "/application/games/scenario"
];

function buildUrl(path) {
  if (path === "/") {
    return `${BASE_URL}/`;
  }

  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function sitemap() {
  const lastModified = new Date();

  const localeRoutes = SITE_LOCALES.flatMap((locale) =>
    LOCALE_ROUTES.map((path) => `/${locale}${path}`)
  );

  const allRoutes = [...STATIC_ROUTES, ...localeRoutes];

  return allRoutes.map((path) => ({
    url: buildUrl(path),
    lastModified,
    changeFrequency: CHANGE_FREQUENCY,
    priority: path === "/" ? 1.0 : 0.8
  }));
}
