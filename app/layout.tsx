import type { Metadata } from "next";
import { Rajdhani, Teko } from "next/font/google";
import { SITE_AUTHOR, SITE_PUBLISHER } from "@/config/site";
import { getMetadataBase } from "@/lib/site-url";
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
  metadataBase: getMetadataBase(),
  title: "JP4F 2026 - Journée Industrielle",
  description: "La journée industrielle de JESI...",
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_PUBLISHER,
  openGraph: {
    title: "JP4F 2026 - Journée Industrielle",
    description: "La journée industrielle de JESI...",
    url: "https://jp4f.vercel.app",
    siteName: "JP4F 2026",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://jp4f.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "JP4F 2026 - Journée Industrielle"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JP4F 2026",
    description: "La journée industrielle de JESI...",
    images: ["https://jp4f.vercel.app/og-image.png"]
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
