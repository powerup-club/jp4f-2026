"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminHeaderProps {
  userEmail: string;
  isRefreshing: boolean;
  autoRefresh: boolean;
  lastUpdatedLabel: string;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
}

export function AdminHeader({
  userEmail,
  isRefreshing,
  autoRefresh,
  lastUpdatedLabel,
  onRefresh,
  onToggleAutoRefresh
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-edge/70 bg-paper/80 backdrop-blur-xl">
      <div className="section-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/fr"
            className="inline-flex items-center gap-3 rounded-full border border-edge bg-panel/95 px-4 py-2 shadow-halo"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-signal via-accent2 to-accent text-sm font-extrabold text-white">
              JP
            </span>
            <span className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-ink">
              JP4F Admin
            </span>
          </Link>
          <span className="badge-line">Acces interne</span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="rounded-full border border-edge/70 bg-panel/90 px-3 py-2 text-xs text-ink/70">
            {lastUpdatedLabel}
          </span>
          <button
            type="button"
            onClick={onToggleAutoRefresh}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              autoRefresh
                ? "border-accent bg-accent/10 text-accent"
                : "border-edge/80 bg-panel/90 text-ink/70 hover:border-accent hover:text-accent"
            }`}
          >
            Auto {autoRefresh ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full border border-edge/80 bg-panel/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/80 transition hover:border-accent hover:text-accent disabled:cursor-wait disabled:opacity-70"
          >
            {isRefreshing ? "Actualisation..." : "Actualiser"}
          </button>
          <span className="rounded-full border border-edge/70 bg-panel/90 px-4 py-2 text-xs text-ink/78">
            {userEmail}
          </span>
          <ThemeToggle locale="fr" />
          <button
            type="button"
            onClick={() => void signOut({ redirectTo: "/admin/login" })}
            className="rounded-full border border-edge/80 bg-panel/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose transition hover:border-rose hover:text-rose"
          >
            Deconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
