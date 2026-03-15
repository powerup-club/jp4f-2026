"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

type LoginMode = "user" | "admin";

interface GoogleLoginCardProps {
  callbackUrl: string;
  errorCode?: string;
  mode?: LoginMode;
  setupReady: boolean;
  setupIssues: string[];
}

function mapError(errorCode: string | undefined, mode: LoginMode): string | null {
  if (!errorCode) {
    return null;
  }

  if (errorCode === "AccessDenied") {
    return mode === "admin"
      ? "Accès refusé. Utilise une adresse figurant dans ADMIN_EMAILS."
      : "Connexion Google refusée. Réessaie avec un compte Google valide.";
  }

  if (errorCode === "Configuration") {
    return "Configuration Google/Auth incomplète. Vérifie les variables Vercel.";
  }

  return "Connexion impossible pour le moment. Réessaie après vérification de la configuration.";
}

function copyForMode(mode: LoginMode) {
  if (mode === "admin") {
    return {
      badge: "Console admin",
      titleTop: "Innov'Industry",
      titleBottom: "Tableau de bord",
      description: "Tableau de bord interne pour suivre les inscriptions Innov'Dom et les résultats du quiz.",
      submitLabel: "Continuer avec Google",
      footerNote: "Réservé aux administrateurs autorisés.",
      returnHref: "/fr",
      returnLabel: "Retour au site"
    };
  }

  return {
    badge: "Espace candidat",
    titleTop: "Innov'Industry",
    titleBottom: "Application",
    description:
      "Connexion Google pour accéder à l'espace candidat, suivre ton dossier et échanger.",
    submitLabel: "Se connecter avec Google",
    footerNote: "Espace candidat en cours de mise en place.",
    returnHref: "/fr/application",
    returnLabel: "Retour au portail"
  };
}

export function GoogleLoginCard({
  callbackUrl,
  errorCode,
  mode = "user",
  setupReady,
  setupIssues
}: GoogleLoginCardProps) {
  const copy = copyForMode(mode);
  const errorMessage = mapError(errorCode, mode);

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-12">
      <article className="glass-card relative w-full max-w-xl overflow-hidden p-8 sm:p-10">
        <div className="max-w-md">
          <p className="badge-line">{copy.badge}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.92] text-ink sm:text-6xl">
            <span className="gradient-title">{copy.titleTop}</span>
            <span className="block">{copy.titleBottom}</span>
          </h1>
          <p className="mt-4 text-base text-ink/75 sm:text-lg">{copy.description}</p>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-rose/40 bg-rose/10 p-4 text-sm text-rose">
              {errorMessage}
            </div>
          ) : null}

          {!setupReady ? (
            <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-4">
              <p className="font-display text-2xl font-semibold uppercase text-accent">
                Configuration requise
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink/75">
                {setupIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => void signIn("google", { redirectTo: callbackUrl })}
              disabled={!setupReady}
              className="rounded-full border border-transparent bg-accent px-6 py-4 font-display text-2xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.submitLabel}
            </button>
            <Link
              href={copy.returnHref}
              className="rounded-full border border-edge/75 bg-panel/90 px-6 py-4 text-center font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
            >
              {copy.returnLabel}
            </Link>
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-ink/45">{copy.footerNote}</p>
        </div>
      </article>
    </div>
  );
}
