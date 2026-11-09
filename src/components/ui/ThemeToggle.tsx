"use client";

import { useEffect, useState } from "react";
import type { SiteLocale } from "@/config/locales";

interface ThemeToggleProps {
  locale: SiteLocale;
}

const labels: Record<SiteLocale, { light: string; dark: string }> = {
  fr: { light: "Activer le thème clair", dark: "Activer le thème sombre" },
  en: { light: "Switch to light theme", dark: "Switch to dark theme" },
  ar: { light: "التبديل إلى الوضع الفاتح", dark: "التبديل إلى الوضع الداكن" }
};

export function ThemeToggle({ locale }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let storedTheme: string | null = null;
    try {
      storedTheme = window.localStorage.getItem("jp4f-theme");
    } catch {
      storedTheme = null;
    }

    const initialTheme = storedTheme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", initialTheme);
    setTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    setTheme(nextTheme);

    try {
      window.localStorage.setItem("jp4f-theme", nextTheme);
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? labels[locale].light : labels[locale].dark}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-edge/60 bg-panel/80 text-lg text-ink transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
