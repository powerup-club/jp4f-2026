import type { Metadata } from "next";
import { Rajdhani, Teko } from "next/font/google";
import "./globals.css";

const metadataBase = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL("http://localhost:3000");

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
  metadataBase,
  title: "JP4F 2026",
  description: "Journées Pédagogiques des 4 Filières à l'ENSA Fès"
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
