import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { SEO_KEYWORDS } from "@/lib/seo";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  weight: ["600", "700", "800"]
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["400", "500", "600"]
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Innov'Industry 2026 – Journée de l'Innovation Industrielle & Technologique ENSA Fès",
  description:
    "Innov'Industry 2026 : 17 & 18 Avril à l'ENSA Fès - Journée de l'Innovation Industrielle & Technologique. Programme, conférences, compétition et partenaires.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Innov'Industry 2026 - ENSA Fès" }],
  applicationName: "Innov'Industry 2026",
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/apple-icon.png"
  },

  openGraph: {
    title: "Innov'Industry 2026 – Journée de l'Innovation Industrielle & Technologique ENSA Fès",
    description:
      "Innov'Industry 2026 : 17 & 18 Avril à l'ENSA Fès - Journée de l'Innovation Industrielle & Technologique. Programme, conférences, compétition et partenaires.",
    url: "https://innov-indus.vercel.app",
    siteName: "Innov'Industry 2026",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://innov-indus.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Innov'Industry 2026 – ENSA Fès"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Innov'Industry 2026 – Journée de l'Innovation Industrielle & Technologique ENSA Fès",
    description:
      "Innov'Industry 2026 : 17 & 18 Avril à l'ENSA Fès - Journée de l'Innovation Industrielle & Technologique. Programme, conférences, compétition et partenaires.",
    images: ["https://innov-indus.vercel.app/og-image.png"]
  },

  alternates: {
    canonical: "https://innov-indus.vercel.app"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning data-theme="dark">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}