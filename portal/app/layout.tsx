import type { Metadata } from "next";
import { Providers } from "./providers";
export const metadata: Metadata = { title: "JP4F 2026 · Espace Candidat", description: "Innov'Dom Challenge — ENSA Fès" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin:0, padding:0, background:"#04080f" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
