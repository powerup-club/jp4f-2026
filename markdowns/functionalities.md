# Fonctionnalités du site Innov'Industry 2026

Ce document résume les fonctionnalités principales et les surfaces produit disponibles dans l’application.

## Site public
- Site multilingue (FR/EN/AR) avec routes préfixées par la langue.
- Navigation partagée : header, footer, menu mobile, switch de langue et thème.
- Support RTL pour l’arabe.
- Système visuel animé (cartes “glass”, gradients, canvas de fond).
- Intro cinématique (lecture 1x par session, bouton passer, version mobile allégée).

## Pages publiques
- `/fr`, `/en`, `/ar`
- `/{locale}/programme`
- `/{locale}/filieres`
- `/{locale}/competition`
- `/{locale}/competition/register` (redirige vers `/{locale}/application`)
- `/{locale}/intervenants`
- `/{locale}/clubs`
- `/{locale}/sponsors`
- `/{locale}/comite`
- `/{locale}/comite-scientifique`
- `/{locale}/quiz`

## Candidature Innov’Dom (inscription)
- Formulaire d’inscription protégé via Google OAuth.
- Pré-remplissage automatique avec le compte Google.
- Envoi des candidatures vers Google Sheets (Apps Script).
- Synchronisation des candidatures dans Neon (si configuré).

## Portail candidat
- Connexion Google obligatoire.
- Espace candidat avec profil, équipe, projet, fichiers, état de synchronisation.
- Chat candidat persistant (stocké dans Neon).
- Pages dédiées :
  - `/{locale}/application`
  - `/{locale}/application/chat`
  - `/{locale}/application/form`
  - `/{locale}/application/rules`
  - `/{locale}/application/quiz`
  - `/{locale}/application/contact`
  - `/{locale}/application/evaluate`
  - `/{locale}/application/orientation`
  - `/{locale}/application/games`
  - `/{locale}/application/games/quiz`
  - `/{locale}/application/games/pitch`
  - `/{locale}/application/games/match`
  - `/{locale}/application/games/scenario`
- Limitation actuelle : stockage binaire des fichiers non encore migré vers un blob storage (seulement métadonnées dans Neon).

## Évaluation IA (2026)
- Analyse PDF de projet par IA.
- Scoring automatique sur critères : Innovation, Faisabilité, Techniques, Impact.
- Feedback « jury » (forces, améliorations, question de réflexion) sans fournir de solution.
- Résultats persistés dans Neon et visibles dans le portail candidat.

## Espace admin
- Authentification Google + whitelisting (`ADMIN_EMAILS`).
- Tableau de bord (statistiques, filtres, export CSV).
- Accès aux données d’inscriptions, quiz et évaluations IA.

## Jeu d’orientation & mini-jeux
- Quiz d’orientation adaptatif avec IA.
- Jeux candidats : pitch, match, scénario, quiz + leaderboard.

## API
- `api/quiz/*` : génération et sauvegarde des quiz.
- `api/register` : envoi des candidatures (Sheets + Neon).
- `api/admin/*` : endpoints admin (données, évaluations, sponsors).
- `api/application/*` : portail candidat (profil, chat, évaluations, jeux).
- `api/sponsors/apply` : candidatures sponsors.

## SEO & découverte
- `robots.txt` + `sitemap.xml` multilingues.
- JSON-LD (Organization + Event) injecté par page.
- Metadata OpenGraph/Twitter/CANONICAL.

## Contenu éditable
- Données multilingues dans :
  - `content/fr/site.json`
  - `content/en/site.json`
  - `content/ar/site.json`
- Contrats TypeScript dans `src/content/types.ts`.
