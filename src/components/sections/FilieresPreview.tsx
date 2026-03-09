import Link from "next/link";
import type { FilieresContent, SiteLocale } from "@/content/types";
import { localizeHref } from "@/lib/routing";
import { Reveal } from "@/components/ui/Reveal";

const colorMap = {
  gesi: "from-[#6366F1] to-[#8B5CF6]",
  gm: "from-[#8B5CF6] to-[#EC4899]",
  gi: "from-[#EC4899] to-[#F43F5E]",
  gmeca: "from-[#F43F5E] to-[#F97316]"
};

interface FilieresPreviewProps {
  locale: SiteLocale;
  content: FilieresContent;
  tag: string;
  title: string;
  subtitle: string;
}

export function FilieresPreview({ locale, content, tag, title, subtitle }: FilieresPreviewProps) {
  return (
    <section className="section-shell mt-14">
      <Reveal>
        <p className="badge-line">{tag}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold uppercase sm:text-5xl">
          <span className="gradient-title">{title}</span>
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-ink/72">{subtitle}</p>

        <div className="mt-7 auto-grid grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.items.map((item) => (
            <Link
              key={item.code}
              href={localizeHref(locale, "/filieres")}
              className="glass-card group p-5 transition hover:-translate-y-1 hover:border-accent"
            >
              <span
                className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 font-display text-lg uppercase tracking-[0.08em] text-white ${
                  colorMap[item.color]
                }`}
              >
                {item.code}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">{item.name}</h3>
              <p className="mt-2 text-base text-ink/70">{item.summary}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
