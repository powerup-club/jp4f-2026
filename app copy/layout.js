import "./globals.css";
export const metadata = {
  title: "Innov'Dom Challenge · JESI 2025 · ENSA Fès",
  description: "Formulaire d'inscription — Compétition Technologique ENSA Fès",
};
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
