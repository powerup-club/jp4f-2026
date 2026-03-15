import type { Metadata } from "next";
import Link from "next/link";
import { getValidatedLocale } from "@/lib/locale-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Règlement Innov'Dom Challenge 2026",
  description: "Règlement officiel Innov'Dom Challenge — J2I'2026 — ENSA Fès.",
  alternates: { canonical: "https://jp4f.vercel.app/[locale]/application/rules" }
};

const PDF_PATH = "/Documents/Reglement_InnovDom_Challenge_J2I'2026.pdf";

export default async function ApplicantRulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getValidatedLocale(params);
  return (
    <section className="section-shell space-y-8 py-8">
      <div className="glass-card liquid-card p-7 shadow-2xl sm:p-10">
        <p className="badge-line">// ÉDITION 2026 · OFFICIEL</p>
        <h1 className="mt-4 font-display text-4xl font-semibold uppercase sm:text-5xl">Règlement Innov'Dom Challenge — 2ème Édition</h1>
        <p className="mt-3 max-w-4xl text-lg text-ink/75">
          Thème : Connecter à l'Avenir · Cadre : Journée d'Innovation industrielle 2026 (JESI 2026 + Innov Tech 2026 + Campus Indus)
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={PDF_PATH}
            download
            className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2"
          >
            Télécharger le règlement (PDF)
          </Link>
          <Link
            href={PDF_PATH}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-edge/75 bg-panel/90 px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-ink transition hover:border-accent hover:text-accent"
          >
            Ouvrir dans le navigateur
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RuleCard title="1. Informations générales">
          <InfoTable
            rows={[
              ["Nom de la compétition", "Innov'Dom Challenge — 2ème Édition"],
              ["Événement cadre", "Journée d'Innovation industrielle 2026 — J2I'2026"],
              ["Organisateur", "École Nationale des Sciences Appliquées de Fès (ENSA Fès)"],
              ["Université de tutelle", "Université Sidi Mohammed Ben Abdellah (USMBA)"],
              ["Lieu", "ENSA Fès — Maroc"],
              ["Langues officielles", "Français / Anglais"],
              ["Site web", "www.ensaf.ac.ma — https://jp4f.vercel.app"]
            ]}
          />
        </RuleCard>

        <RuleCard title="2. Objectifs de la compétition">
          <Bullets
            items={[
              "Encourager et récompenser les projets innovants apportant des solutions concrètes aux défis industriels, technologiques et énergétiques.",
              "Favoriser l'intégration des nouvelles technologies, de la digitalisation et de l'intelligence artificielle dans des applications à impact réel.",
              "Créer un pont entre le monde académique et le secteur industriel via les partenaires de la compétition.",
              "Promouvoir la culture de l'innovation et de la recherche appliquée au sein de la communauté universitaire marocaine et internationale."
            ]}
          />
        </RuleCard>

        <RuleCard title="3. Thèmes de la compétition">
          <ThemeBlock
            title="3.1 Modélisation & Commande des Systèmes"
            items={[
              "Modélisation et identification des systèmes",
              "Commande et optimisation",
              "Algorithmes d'apprentissage, événements discrets, modèles hybrides",
              "Méthodes et algorithmes de commande"
            ]}
          />
          <ThemeBlock
            title="3.2 Instrumentation & Systèmes Embarqués"
            items={[
              "Instrumentation industrielle, mécatronique, robotique",
              "Systèmes embarqués et informatique industrielle",
              "Électronique, génie électrique, électronique de puissance",
              "Supervision industrielle"
            ]}
          />
          <ThemeBlock
            title="3.3 Intelligence Artificielle & Traitement de l'Information"
            items={[
              "Vision / signal, systèmes intelligents",
              "Diagnostic et pronostic",
              "IA, apprentissage automatique",
              "IoT et Big Data"
            ]}
          />
          <ThemeBlock
            title="3.4 Gestion Industrielle & Sûreté"
            items={[
              "Sûreté de fonctionnement, maintenance",
              "Gestion de projet/production, transport, qualité, SI",
              "Évaluation des performances, tableaux de bord, aide à la décision"
            ]}
          />
          <ThemeBlock
            title="3.5 Industrie 4.0 & Développement Durable"
            items={[
              "Procédés industriels, fabrication, logistique 4.0",
              "Efficacité énergétique, énergies renouvelables, environnement",
              "Cybersécurité industrielle, industrie du futur"
            ]}
          />
        </RuleCard>

        <RuleCard title="4. Conditions de participation">
          <p className="text-sm text-ink/75">Ouvert à toute personne passionnée par l'innovation : étudiants (L/M/Ing), doctorants, chercheurs, start-ups, professionnels.</p>
          <InfoTable
            rows={[
              ["Participation individuelle", "1 candidat défend le projet"],
              ["Participation en équipe", "2 à 4 membres"],
              ["Encadrant académique", "Autorisé comme guide uniquement (non co-auteur)"]
            ]}
          />
          <p className="mt-2 text-xs text-ink/65">Un même projet ne peut pas être soumis dans deux catégories ou éditions simultanément.</p>
        </RuleCard>

        <RuleCard title="5. Inscription et soumission">
          <Bullets
            items={[
              "Inscription entièrement gratuite via la plateforme de dépôt dédiée (lien communiqué officiellement).",
              "Dossier à fournir : un des formats suivants (Résumé / Abstract, Fiche technique détaillée, Présentation PowerPoint, Rapport écrit complet).",
              "Taille maximale totale : 9 Mo."
            ]}
          />
        </RuleCard>

        <RuleCard title="6. Format et déroulement (présentiel ENSA Fès)">
          <InfoTable
            rows={[
              ["Phase 1 · Qualifications", "05 avril — Étude des dossiers · Résultats 10 avril"],
              ["Phase 2 · Demi-finale", "17 avril — Oral + démo/prototype/poster/simulation"],
              ["Phase 3 · Finale", "17 avril — Pitch 5 min + démo AR/app interactive/prototype/poster/simulation"]
            ]}
          />
        </RuleCard>

        <RuleCard title="7. Critères d'évaluation">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink/78">
            <li>Innovation et originalité</li>
            <li>Faisabilité technique</li>
            <li>Impact industriel / économique / social</li>
            <li>Clarté et qualité de la présentation</li>
            <li>Maîtrise du sujet lors des questions</li>
            <li>Qualité du prototype ou de la démo</li>
            <li>Pertinence par rapport aux thèmes</li>
          </ol>
        </RuleCard>

        <RuleCard title="8. Prix et récompenses">
          <Bullets
            items={[
              "🥇 1er Prix — Trophée + Certificat + Visibilité média",
              "🥈 2ème Prix — Trophée + Certificat + Visibilité média",
              "🥉 3ème Prix — Trophée + Certificat + Visibilité média",
              "Tous les participants reçoivent un certificat de participation"
            ]}
          />
        </RuleCard>

        <RuleCard title="9. Règles fondamentales & code de conduite">
          <Bullets
            items={[
              "Projet original, inédit, aligné sur un thème officiel. Pas de double soumission/édition.",
              "Projet réalisé uniquement par les membres déclarés; tous présents physiquement le jour J.",
              "Encadrant académique = guide uniquement.",
              "Respect, éthique et professionnalisme requis.",
              "Disqualification : plagiat/fraude, non-respect des délais, comportement irrespectueux, absence en finale."
            ]}
          />
        </RuleCard>

        <RuleCard title="10. Communication et canaux officiels">
          <p className="text-sm text-ink/75">
            Infos via email officiel, téléphone des organisateurs, site ENSA Fès, plateforme de dépôt dédiée, groupe WhatsApp officiel des leaders d'équipe. Vérifier régulièrement vos emails et le site.
          </p>
        </RuleCard>

        <RuleCard title="11. Partenaires">
          <p className="text-sm text-ink/75">Entreprises industrielles partenaires, universités partenaires, sponsors financiers, médias et presse. Liste officielle publiée sur le site et annoncée en ouverture.</p>
        </RuleCard>

        <RuleCard title="12. Propriété intellectuelle">
          <p className="text-sm text-ink/75">
            Les projets restent la propriété intellectuelle des auteurs. Les organisateurs peuvent utiliser les informations pour la communication et la promotion. Aucune exploitation commerciale sans accord explicite des participants.
          </p>
        </RuleCard>

        <RuleCard title="13. Contacts">
          <InfoTable
            rows={[
              ["Institution", "ENSA Fès"],
              ["Sites", "www.ensaf.ac.ma — https://jp4f.vercel.app"],
              ["Emails", "powerup.ensa@usmba.ac.ma · lhoussaine.nouary@usmba.ac.ma · hicham.hihi@usmba.ac.ma"],
              ["Téléphone", "+212 624 809 871"],
              ["Plateforme de dépôt", "https://jp4f.vercel.app/fr/application"]
            ]}
          />
        </RuleCard>
      </div>
    </section>
  );
}

function RuleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="glass-card liquid-card p-6 shadow-xl">
      <p className="font-display text-2xl font-semibold uppercase text-ink">{title}</p>
      <div className="mt-4 space-y-3 text-ink/80">{children}</div>
    </article>
  );
}

function ThemeBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4 space-y-2 rounded-2xl border border-edge/35 bg-panel/70 p-4">
      <p className="font-display text-lg font-semibold uppercase text-ink">{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function InfoTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-edge/35 bg-panel/70 p-3">
          <dt className="text-ink/55">{k}</dt>
          <dd className="font-semibold text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
