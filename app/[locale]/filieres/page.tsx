import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { getValidatedLocale } from "@/lib/locale-page";

const colorMap = {
  gesi: "from-[#6366F1] to-[#8B5CF6]",
  gm: "from-[#8B5CF6] to-[#EC4899]",
  gi: "from-[#EC4899] to-[#F43F5E]",
  gmeca: "from-[#F43F5E] to-[#F97316]"
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);
  return buildPageMetadata(locale, content.filieres.title, content.filieres.subtitle, `/${locale}/filieres`);
}

export default async function FilieresPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const content = getSiteContent(locale);

  return (
    <>
      <PageIntro tag={content.filieres.tag} title={content.filieres.title} subtitle={content.filieres.subtitle} />
      <section className="section-shell mt-8">
        <div className="auto-grid grid gap-4 md:grid-cols-2">
          {content.filieres.items.map((item) => (
            <Reveal key={item.code}>
              <article className="glass-card h-full p-6">
                <span
                  className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 font-display text-lg uppercase tracking-[0.08em] text-white ${
                    colorMap[item.color]
                  }`}
                >
                  {item.code}
                </span>
                <h2 className="mt-4 font-display text-3xl font-semibold uppercase text-ink">{item.name}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink/72">{item.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
