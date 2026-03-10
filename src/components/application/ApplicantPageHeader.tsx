import type { ReactNode } from "react";

export function ApplicantPageHeader({
  badge,
  title,
  subtitle,
  children
}: {
  badge: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <article className="glass-card p-6 sm:p-8">
      <p className="badge-line">{badge}</p>
      <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.95] text-ink sm:text-6xl">
        <span className="gradient-title">{title}</span>
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-ink/75 sm:text-xl">{subtitle}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}
