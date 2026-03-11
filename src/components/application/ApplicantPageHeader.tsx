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
    <article className="glass-card p-4 sm:p-6 lg:p-8">
      <p className="badge-line">{badge}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold uppercase leading-[0.95] text-ink sm:text-5xl lg:text-6xl">
        <span className="gradient-title">{title}</span>
      </h1>
      <p className="mt-3 max-w-3xl text-base text-ink/75 sm:text-lg">{subtitle}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
