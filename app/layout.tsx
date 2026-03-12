import type { Metadata } from "next";
import { Rajdhani, Teko } from "next/font/google";
import { SEO_KEYWORDS } from "@/lib/seo";
import "./globals.css";

const display = Teko({
  subsets: ["latin", "latin-ext"],
  variable: "--font-teko",
  weight: ["400", "500", "600", "700"]
});

const body = Rajdhani({
  subsets: ["latin", "latin-ext"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "JP4F 2026 – Journée pédagogique & industrielle ENSA Fès",
  description:
    "Programme journée pédagogique ENSA Fès 2026, conférences, compétition et partenaires JESI. Guide pour comment s'inscrire JP4F 2026 et forum ingénierie Fès 2026.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "JESI - Club Étudiant ENSA Fès" }],
  openGraph: {
    title: "JP4F 2026 – Journée pédagogique & industrielle ENSA Fès",
    description:
      "Programme journée pédagogique ENSA Fès 2026, conférences, compétition et partenaires JESI. Guide pour comment s'inscrire JP4F 2026 et forum ingénierie Fès 2026.",
    url: "https://jp4f.vercel.app",
    siteName: "JP4F 2026",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "https://jp4f.vercel.app/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "JP4F 2026 – Journée pédagogique & industrielle ENSA Fès",
    description:
      "Programme journée pédagogique ENSA Fès 2026, conférences, compétition et partenaires JESI. Guide pour comment s'inscrire JP4F 2026 et forum ingénierie Fès 2026."
  },
  alternates: {
    canonical: "https://jp4f.vercel.app"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning data-theme="light">
      <body className={`${display.variable} ${body.variable}`}>
        {children}
      </body>
    </html>
  );
}

