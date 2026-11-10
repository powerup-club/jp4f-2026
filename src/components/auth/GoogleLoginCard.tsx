"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

interface GoogleLoginCardProps {
  callbackUrl: string;
  errorCode?: string;
  setupReady: boolean;
  setupIssues: string[];
}

function mapError(errorCode: string | undefined): string | null {
  if (!errorCode) {
    return null;
  }

  if (errorCode === "AccessDenied") {
    return "Accès refusé. Utilise une adresse figurant dans ADMIN_EMAILS.";
  }

  if (errorCode === "Configuration") {
    return "Configuration Google/Auth incomplète. Vérifie les variables Vercel.";
  }

  return "Connexion impossible pour le moment. Réessaie après vérification de la configuration.";
}

export function GoogleLoginCard({
  callbackUrl,
  errorCode,
  setupReady,
  setupIssues
}: GoogleLoginCardProps) {
  const errorMessage = mapError(errorCode);

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-12">
      <article className="glass-card relative w-full max-w-xl overflow-hidden p-8 sm:p-10">
        <div className="max-w-md">
          <p className="badge-line">Console admin</p>
          <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.92] text-ink sm:text-6xl">
            <span className="gradient-title">Innov'Industry</span>
            <span className="block">Tableau de bord</span>
          </h1>
          <p className="mt-4 text-base text-ink/75 sm:text-lg">
            Tableau de bord interne pour suivre les inscriptions Innov'Dom et les résultats du quiz.
          </p>

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
              Continuer avec Google
            </button>
            <Link
              href="/fr"
              className="rounded-full border border-edge/75 bg-panel/90 px-6 py-4 text-center font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
            >
              Retour au site
            </Link>
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-ink/45">
            Réservé aux administrateurs autorisés.
          </p>
        </div>
      </article>
    </div>
  );
}
