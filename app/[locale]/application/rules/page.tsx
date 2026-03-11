import type { Metadata } from "next";
import { ApplicantPageHeader } from "@/components/application/ApplicantPageHeader";
import type { SiteLocale } from "@/config/locales";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

const COPY: Record<
  SiteLocale,
  {
    badge: string;
    title: string;
    subtitle: string;
    sections: Array<{ title: string; body: string }>;
    footer: string;
  }
> = {
  fr: {
    badge: "Official",
    title: "Reglement",
    subtitle: "Version courte du cadre Innov'Dom 2026 pour avancer vite depuis le portail candidat.",
    sections: [
      {
        title: "Participants",
        body: "Le challenge accueille des candidatures individuelles ou en equipe, avec un projet original aligne sur les thematiques du departement."
      },
      {
        title: "Attendus",
        body: "Le jury attend une proposition utile, credibile techniquement, presentable clairement et adaptee au contexte marocain."
      },
      {
        title: "Presentation",
        body: "La presentation finale doit rester concise, argumentee et appuyee par une demo, un prototype ou une maquette lorsque c'est possible."
      },
      {
        title: "Esprit",
        body: "Pas de plagiat, pas de projet deja soumis tel quel ailleurs, et une communication honnete sur l'etat reel d'avancement."
      }
    ],
    footer: "Pour des questions precises, utilise l'onglet Contact depuis le portail."
  },
  en: {
    badge: "Official",
    title: "Rules",
    subtitle: "Short Innov'Dom 2026 rule summary so you can move quickly from the applicant portal.",
    sections: [
      {
        title: "Participants",
        body: "The challenge accepts both individual and team applications built around an original project aligned with the department themes."
      },
      {
        title: "What matters",
        body: "The jury expects usefulness, technical credibility, clear communication, and a solution that fits the Moroccan context."
      },
      {
        title: "Presentation",
        body: "The final presentation should stay concise, well argued, and supported by a demo, prototype, or mock-up whenever possible."
      },
      {
        title: "Spirit",
        body: "No plagiarism, no recycled submission passed off as new, and honest reporting about the real maturity of the project."
      }
    ],
    footer: "For specific questions, use the Contact page inside the portal."
  },
  ar: {
    badge: "Official",
    title: "القواعد",
    subtitle: "ملخص سريع لإطار Innov'Dom 2026 حتى تتقدم بسرعة من داخل البوابة.",
    sections: [
      {
        title: "المشاركون",
        body: "المسابقة مفتوحة للمشاركة الفردية أو الجماعية بمشروع أصلي منسجم مع محاور الشعبة."
      },
      {
        title: "ما يهم اللجنة",
        body: "اللجنة تنتظر فائدة واضحة ومصداقية تقنية وعرضا مفهوما وحلا مناسبا للسياق المغربي."
      },
      {
        title: "العرض",
        body: "يجب أن يكون العرض النهائي مختصرا ومقنعا ومدعوما بنموذج أو عرض عملي كلما كان ذلك ممكنا."
      },
      {
        title: "الروح",
        body: "لا للسرقة الفكرية ولا لإعادة تقديم نفس المشروع دون توضيح، مع ضرورة الصراحة بشأن مستوى التقدم الحقيقي."
      }
    ],
    footer: "إذا كانت لديك أسئلة دقيقة فاستعمل صفحة التواصل من داخل البوابة."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];
  return buildPageMetadata(locale, copy.title, copy.subtitle, `/${locale}/application/rules`);
}

export default async function ApplicantRulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  const copy = COPY[locale];

  return (
    <>
      <ApplicantPageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

      <div className="grid gap-4 xl:grid-cols-2">
        {copy.sections.map((section) => (
          <article key={section.title} className="glass-card p-6">
            <p className="font-display text-3xl font-semibold uppercase text-ink">{section.title}</p>
            <p className="mt-4 text-sm leading-7 text-ink/76 sm:text-base">{section.body}</p>
          </article>
        ))}
      </div>

      <article className="glass-card border border-accent/35 bg-accent/10 p-6 text-sm text-ink/78 sm:text-base">
        {copy.footer}
      </article>
    </>
  );
}
