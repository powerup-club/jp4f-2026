import type { Metadata } from "next";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";

export const metadata: Metadata = {
  title: {
    default: "Admin | JP4F 2026",
    template: "%s | JP4F 2026"
  },
  description: "Dashboard interne JP4F 2026",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="fr" dir="ltr" data-locale-dir="ltr" className="relative min-h-screen text-ink">
      <BackgroundCanvas />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
