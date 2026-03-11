import type { Metadata } from "next";
import { Rajdhani, Teko } from "next/font/google";
import { EVENT_TITLE, OG_IMAGE, SITE_AUTHOR, SITE_PUBLISHER } from "@/config/site";
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
  title: EVENT_TITLE,
  description: "Journées Pédagogiques des 4 Filières à l'ENSA Fès.",
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_PUBLISHER,
  openGraph: {
    title: EVENT_TITLE,
    description: "Journées Pédagogiques des 4 Filières à l'ENSA Fès.",
    type: "website",
    siteName: EVENT_TITLE,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: EVENT_TITLE
      }
    ]
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
