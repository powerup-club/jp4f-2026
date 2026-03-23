interface PageIntroProps {
  tag: string;
  title: string;
  subtitle: string;
}

export function PageIntro({ tag, title, subtitle }: PageIntroProps) {
  return (
    <section className="section-shell pt-8">
      <div className="max-w-3xl">
        <p className="badge-line">{tag}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
          <span className="gradient-title">{title}</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/75 sm:text-xl">{subtitle}</p>
      </div>
    </section>
  );
}
