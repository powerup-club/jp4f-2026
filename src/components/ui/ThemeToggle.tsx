"use client";

import React from "react";
import { useEffect, useState } from "react";
import type { SiteLocale } from "@/config/locales";

const THEME_KEY = "jp4f-theme";

interface ThemeToggleProps {
  locale: SiteLocale;
}

const THEME_LABELS: Record<SiteLocale, { toLight: string; toDark: string }> = {
  fr: {
    toLight: "Activer le mode clair",
    toDark: "Activer le mode sombre",
  },
  en: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },
  ar: {
    toLight: "التبديل إلى الوضع الفاتح",
    toDark: "التبديل إلى الوضع الداكن",
  },
};

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.7M12 18.8v2.7M21.5 12h-2.7M5.2 12H2.5M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9M18.7 18.7l-1.9-1.9M7.2 7.2 5.3 5.3" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 14.4A8.8 8.8 0 1 1 9.6 3.5a7.2 7.2 0 1 0 10.9 10.9Z" />
    </svg>
  );
}

export function ThemeToggle({ locale }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const label = theme === "dark" ? THEME_LABELS[locale].toLight : THEME_LABELS[locale].toDark;

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
      return;
    }

    try {
      const saved = localStorage.getItem(THEME_KEY);
      const next = saved === "light" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      setTheme(next);
    } catch {
      document.documentElement.setAttribute("data-theme", "dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore write errors
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-edge/80 bg-panel/95 px-3 py-2 font-display text-lg leading-none text-ink transition hover:border-accent hover:text-accent"
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
    </button>
  );
}
