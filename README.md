# JP4F 2026 Web Application

JP4F 2026 is a multilingual Next.js web application for the ENSA Fes industrial engineering event.
It now includes:

- the public event website
- the orientation quiz
- the Innov'Dom registration flow
- a protected admin dashboard
- a Google-authenticated applicant workspace backed by Neon

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Auth.js (`next-auth`) with Google OAuth
- Neon Serverless Postgres
- Recharts
- Vitest + Testing Library
- Playwright
- Vercel deployment target

## Current Product Surface

### Public site

- multilingual pages in French, English, and Arabic
- locale-prefixed routing
- shared header, footer, mobile navigation, and theme toggle
- RTL support for Arabic
- animated visual system with shared glass cards, gradients, and background canvas

### Public pages

- `/fr`, `/en`, `/ar`
- `/[locale]/programme`
- `/[locale]/filieres`
- `/[locale]/competition`
- `/[locale]/competition/register` (redirects to `/{locale}/application`)
- `/[locale]/intervenants`
- `/[locale]/clubs`
- `/[locale]/sponsors`
- `/[locale]/comite`
- `/[locale]/comite-scientifique`
- `/[locale]/quiz`

### Registration flow

- `/[locale]/application/form` (primary application form route)
- `/[locale]/competition/register` redirects to `/[locale]/application`
- Google login is required before the user can access the form
- authenticated submissions still go to Google Apps Script / Google Sheets
- successful submissions also sync an applicant record into Neon
- the form is prefilled with the signed-in Google account name and email

### Admin area

- `/admin`
- `/admin/login`
- Google-authenticated internal dashboard
- admin-only access controlled by `ADMIN_EMAILS`
- live registrations and quiz analytics from Google Apps Script / Google Sheets

### Applicant portal

- `/auth/login`
- `/[locale]/application`
- `/[locale]/application/chat`
- `/[locale]/application/form`
- `/[locale]/application/rules`
- `/[locale]/application/quiz`
- `/[locale]/application/contact`
- `/[locale]/application/evaluate`
- `/[locale]/application/orientation`
- `/[locale]/application/games`
- `/[locale]/application/games/quiz`
- `/[locale]/application/games/pitch`
- `/[locale]/application/games/match`
- `/[locale]/application/games/scenario`

Current applicant portal behavior:

- any verified Google user can sign in
- applicant workspace reads the user's record from Neon
- applicant chat persists messages in Neon
- final application submission syncs the latest submitted snapshot into Neon
- mobile portal uses a fixed top bar + bottom tab bar (no hamburger on mobile)

Current limitation:

- file binary storage is still not moved to Blob or object storage
- Neon currently stores applicant records and file metadata, not the file itself

## Routing Rules

- `/` redirects to `/fr`
- public pages remain locale-prefixed
- `/admin`, `/auth/login`, and `/api/*` stay outside locale redirects
- routing behavior is implemented through `proxy.ts`

## AI / SEO Discovery

- `public/robots.txt` allows AI crawlers (Google-Extended, GPTBot, PerplexityBot, ClaudeBot, FacebookBot) and declares the sitemap.
- `public/sitemap.xml` lists the public pages in FR/EN/AR for faster discovery.
- `app/[locale]/head.tsx` injects JSON-LD for `Organization` + `Event`.
- `src/lib/metadata.ts` builds per-page metadata (OpenGraph, Twitter card, canonical URL, author/publisher).
- `app/layout.tsx` defines global metadata defaults and OG image.

When changing domains:
- update `NEXT_PUBLIC_SITE_URL`
- update `public/robots.txt` sitemap URL
- update `public/sitemap.xml` URLs
- review `src/config/site.ts` (`EVENT_*`, `SITE_*`, `OG_IMAGE`)

## Content Model

Editable multilingual content is stored in:

- `content/fr/site.json`
- `content/en/site.json`
- `content/ar/site.json`

Typed content contracts live in:

- `src/content/types.ts`

## Main UI Features
 
### AI-Powered Project Evaluation (2026)

This feature is now fully implemented in the candidate portal:

**PDF Analysis:** Users upload their project PDF, which is parsed and analyzed by the AI.
**Criteria Scoring:** The AI automatically scores:
  - **Innovation** (highest weight)
  - **Feasibility**
  - **Technology and Techniques Used**
  - **Impact**
**Reflective Jury Feedback:**
  - The AI jury reviews the PDF and project idea, providing remarks and reflective questions.
  - No solutions or final results are given; only weaknesses and questions to help students improve.
  - Jury feedback and scores are stored in Neon and displayed in the applicant portal.

**How It Works:**
1. Applicant submits project details (title, domain, description, innovation claim)
2. Applicant self-scores the 5 evaluation criteria (1-5 scale)
3. Click "Get AI jury feedback" to trigger the evaluation
4. AI (Groq) analyzes the project and generates:
   - Global score (0-100)
   - Verdict (excellent, strong, solid, improve, rework)
   - Summary of the project state
   - Strengths (3 items)
   - Areas for improvement (3 items)
   - Final reflective tip/question
5. Results are automatically saved to Neon
6. User can see their previous evaluation anytime on the page

**Note:** The jury does not provide direct answers or solutions, only feedback and questions for reflection. This feature is live and available for all candidates.

**Routes:**
- `/{locale}/application/evaluate` - Project evaluation page
- `/api/application/evaluate` - API endpoint for getting AI evaluation

- shared event landing page and content sections
- theme toggle with localStorage persistence
- locale switcher with same-path language switching
- orientation quiz with AI-backed adaptive questions
- protected registration form with validation and file upload support
- protected admin dashboard with charts, filters, CSV export, and sheet-backed data views
- applicant workspace showing saved profile, team, project, file metadata, and sync state
- applicant chat page with persisted Neon-backed messages

## API Routes

- `/api/quiz/chat`
  - AI quiz question / result generation
- `/api/quiz/save`
  - saves quiz results to Google Apps Script
- `/api/register`
  - requires Google auth
  - saves Innov'Dom application data to Google Apps Script
  - syncs the submitted applicant record into Neon when configured
- `/api/auth/[...nextauth]`
  - Auth.js Google authentication endpoint
- `/api/admin/data`
  - protected admin-only read endpoint for quiz and registration data
- `/api/admin/evaluations`
  - admin-only read endpoint for AI project evaluations
- `/api/admin/sponsors`
  - protected admin-only sponsor applications endpoint
- `/api/admin/sponsors/[id]`
  - updates sponsor application status
- `/api/application`
  - authenticated applicant record read/update endpoint for Neon-backed draft data
- `/api/application/chat`
  - authenticated applicant chat read/write endpoint for Neon-backed messages
- `/api/application/contact`
  - authenticated contact form endpoint (Neon + optional Google Sheets)
- `/api/application/evaluate`
  - AI-powered project evaluation endpoint
  - accepts project details and self-scores
  - returns AI jury feedback with verdict, summary, strengths, improvements, and tips
  - saves evaluation results to Neon for persistence
- `/api/application/games/leaderboard`
  - leaderboard data for applicant games
- `/api/application/games/pitch`
  - pitch game endpoint
- `/api/application/games/scenario`
  - scenario game endpoint
- `/api/application/quiz`
  - authenticated applicant quiz endpoint (Neon + optional Google Sheets)
- `/api/application/score-project`
  - internal project scoring endpoint used by evaluation flows
- `/api/sponsors/apply`
  - public sponsor application endpoint

## Authentication

### Google OAuth

The application uses Google OAuth through Auth.js.

Current behavior:

- any verified Google user can sign in for applicant-facing routes
- only emails listed in `ADMIN_EMAILS` can access `/admin`

### Google OAuth redirect URIs

Local development:

- `http://localhost:3000/api/auth/callback/google`

Production on Vercel:

- `https://jp4f-2026.vercel.app/api/auth/callback/google`

Authorized JavaScript origins:

- `http://localhost:3000`
- `https://jp4f-2026.vercel.app`

## Environment Variables

Create `.env.local` with:

```bash
# AI - Main and fallback API keys for redundancy
GROQ_API_KEY=gsk_your_key_here
GROQ_API_KEY_FALLBACK=gsk_your_fallback_key_here

# Registration / quiz save targets
GOOGLE_SCRIPT_URL_QUIZ=https://script.google.com/macros/s/YOUR_QUIZ_SCRIPT_ID/exec
GOOGLE_SCRIPT_URL_REGISTER=https://script.google.com/macros/s/YOUR_REGISTER_SCRIPT_ID/exec
GOOGLE_SCRIPT_URL_SPONSORS=https://script.google.com/macros/s/YOUR_SPONSORS_SCRIPT_ID/exec
GOOGLE_SCRIPT_URL_CONTACT_RESPONSIBLE=https://script.google.com/macros/s/YOUR_CONTACT_SCRIPT_ID/exec

# Google auth
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
AUTH_SECRET=replace_with_a_long_random_secret

# Admin access
ADMIN_EMAILS=admin1@example.com,admin2@example.com
ADMIN_DATA_SECRET=replace_with_the_same_secret_used_in_your_apps_script_doGet

# Applicant portal persistence
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-NEON-HOST.neon.tech/neondb?sslmode=require

# Optional metadata base override
NEXT_PUBLIC_SITE_URL=https://jp4f-2026.vercel.app
```

Optional legacy fallback:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEFAULT_SCRIPT_ID/exec
```

## Neon Setup

The applicant portal uses Neon for applicant records and chat persistence.

### Schema files

Run these SQL migrations in your Neon project in order:

- `db/neon/001_applicant_portal.sql`
- `db/neon/002_application_portal_features.sql`
- `db/neon/005_project_evaluations.sql`
- `db/neon/008_sponsor_applications.sql`

This creates:

- `applicant_applications`
- `application_messages`
- `application_ai_messages`
- `application_quiz_attempts`
- `application_contact_requests`
- `application_project_evaluations`
- `sponsor_applications`

### What Neon currently stores

- Google account email and name
- applicant profile and team information
- project details
- file metadata
- submission status and sheet sync status
- chat messages
- AI chat history
- quiz attempt results
- contact request submissions
- project evaluation results with jury feedback

### What Neon does not store yet

- uploaded file binaries

If you want full file persistence next, add Vercel Blob or another object storage provider and store only the file URL + metadata in Neon.

## Google Apps Script Integration

Current Google Apps Script usage:

- `/api/register` writes registration data
- `/api/quiz/save` writes quiz result data
- `/api/admin/data` reads data back for the admin dashboard

For the admin dashboard to work, both Google Apps Script projects must expose the protected `doGet` helper documented in:

- `admin-dashboard/README.md`

Use the same secret value in:

- `ADMIN_DATA_SECRET`
- the Apps Script `ADMIN_SECRET`

## AI Service Configuration (Groq)

The application uses Groq AI for project evaluation and quiz generation.

### API Key Fallback Strategy

To ensure reliability and avoid service disruptions due to API quotas:

1. **Primary Key**: `GROQ_API_KEY` - Your main Groq API key
2. **Fallback Key**: `GROQ_API_KEY_FALLBACK` - Secondary API key for failover

**How it works:**
- The system automatically tries the primary key first
- If the primary key fails due to rate limits (429), quotas, or server errors (5xx), it switches to the fallback key
- If both keys are unavailable, the service returns a graceful fallback response
- Authentication errors (invalid key, etc.) fail immediately without trying fallback

**Setup:**
- Provide at least one valid Groq API key
- Optionally add a second key for redundancy (recommended for production)
- Both keys are treated equally for fallover purposes

## Local Development

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Useful checks:

```bash
npm run test:unit
npm run test:e2e
npm run build
```

## Deployment Notes

- the app is designed for Vercel
- configure the same env vars in Vercel Project Settings
- add the Google OAuth production redirect URI before testing auth on Vercel
- keep `AUTH_SECRET` as a real random secret in production
- add `DATABASE_URL` from your Neon project before using the applicant workspace and chat
- if you use custom domains later, update:
  - Google OAuth redirect URI
  - authorized JavaScript origin
  - `NEXT_PUBLIC_SITE_URL`
  - `public/robots.txt`
  - `public/sitemap.xml`

## Candidate Portal Roadmap

The implementation plan is tracked in:

- `application-portal-plan.md`

Current status:

- Google login foundation: done
- registration access protection: done
- Neon persistence for applicant records: done
- Neon persistence for applicant chat: done
- AI-powered project evaluation with jury feedback: done ✅
- editable applicant workspace forms: still to do
- object storage for uploaded files: still to do
- admin replies inside applicant chat: still to do

## Tests

Current coverage includes:

- locale and proxy routing
- content validation
- theme toggle behavior
- admin auth/data route behavior
- applicant Neon setup and applicant API route behavior
- admin login UI
- admin dashboard client rendering
- Playwright smoke tests for unauthenticated `/admin` and protected registration access

## Project Notes

- `admin-dashboard/` is reference/source material for the imported admin feature and is excluded from app compilation
- static assets are served from `public/images`
- `.env.local.example` is sanitized and safe to commit
- `.env.local` remains local only and is ignored by git



# Portail candidat "portal-first" avec sidebar, IA, quiz et contact

## Résumé
- Basculer le flux public de candidature vers `/{locale}/application` au lieu du formulaire direct.
- Faire de `/{locale}/application` la home du portail candidat, avec sidebar à icônes et CTA `Remplir le formulaire` sur la page Home.
- Après soumission finale, rediriger vers la home du portail avec un message de succès, puis afficher les informations enregistrées par sections.
- Remplacer le chat candidat actuel par un chat IA Groq dans `/{locale}/application/chat`.
- Ajouter `Rules`, `Quiz` et `Contact` au portail; stocker l’historique portail dans Neon et envoyer quiz/contact vers Google Sheets quand les URLs sont configurées.

## Changements d’implémentation
- Routage et shell:
  - Ajouter un layout dédié `app/[locale]/application/layout.tsx` avec sidebar interne.
  - Sidebar fixe: `Home`, `Rules`, `Chat`, `Quiz`, `Contact`.
  - Ne pas ajouter d’icône `Form`; le formulaire reste un CTA sur Home.
  - Mettre à jour les CTA publics qui pointent vers `/competition/register` pour cibler `/application`.
  - Transformer `/{locale}/competition/register` en route de redirection vers `/{locale}/application`.

- Home portail:
  - Sur première connexion, créer/assurer un dossier candidat minimal lié au compte Google.
  - Afficher un résumé par sections: profil, équipe, projet, fichier.
  - Afficher un banner si `?submitted=1`.
  - Faire évoluer le CTA selon l’état:
    - pas de dossier complété: `Remplir le formulaire`
    - dossier existant: `Modifier ma candidature`
  - Ajouter des cartes de synthèse pour le dernier quiz et la dernière demande de contact si elles existent.

- Formulaire candidature:
  - Déplacer l’expérience principale vers `/{locale}/application/form`.
  - Réutiliser le formulaire existant, mais lui permettre de préremplir toutes les valeurs depuis la candidature Neon.
  - Conserver `/api/register` comme soumission finale vers Google Sheets + sync Neon.
  - Après succès, rediriger vers `/{locale}/application?submitted=1`.
  - Garder `/api/application` GET/PUT disponible pour lecture de dossier et futur brouillon, sans autosave imposé dans cette itération.

- Neon et modèle de données:
  - Conserver `applicant_applications` comme table centrale.
  - Ajouter une migration Neon dédiée pour:
    - `application_ai_messages`
    - `application_quiz_attempts`
    - `application_contact_requests`
  - Conserver `application_messages` inchangée et ne plus l’exposer dans la navigation v1.
  - Générer un `teamId` d’affichage stable à partir de l’ID du dossier: format `JP4F-000123`.
  - Ajouter une détection propre des erreurs de schéma Neon:
    - si la relation manque (`applicant_applications` absente), remonter un état `schema_missing`
    - afficher un message clair demandant d’exécuter `db/neon/001_applicant_portal.sql`, sans exposer l’erreur SQL brute

- Chat IA:
  - Garder la page publique `/{locale}/application/chat`, mais remplacer son comportement par un assistant IA Groq.
  - Faire évoluer `/api/application/chat` pour:
    - lire l’historique IA de l’utilisateur
    - enregistrer le message utilisateur
    - appeler Groq
    - enregistrer et renvoyer la réponse assistant
  - Si Neon n’est pas prêt ou si le schéma manque, afficher un état désactivé clair.

- Quiz portail:
  - Ajouter `/{locale}/application/quiz`.
  - Réutiliser le moteur du quiz existant, mais en mode portail authentifié.
  - Sauvegarder chaque tentative dans Neon et envoyer aussi le résultat vers la feuille quiz existante.
  - Ajouter un endpoint dédié `/api/application/quiz` pour le portail, afin de ne pas casser le quiz public existant.

- Contact responsable:
  - Ajouter `/{locale}/application/contact` avec formulaire:
    - nom
    - email
    - téléphone
    - `teamId` auto-généré
    - message
  - Préremplir nom/email depuis Google ou la candidature; préremplir téléphone si disponible.
  - Ajouter `/api/application/contact`:
    - persistance Neon
    - envoi Google Sheets si configuré
    - retour `success + skipped note` si l’URL Apps Script n’est pas encore renseignée

- Rules:
  - Ajouter `/{locale}/application/rules` comme page placeholder avec copy simple “à venir”.

- Docs et config:
  - Ajouter `GOOGLE_SCRIPT_URL_CONTACT_RESPONSIBLE` dans `.env.local.example` et la doc.
  - Documenter l’ordre des migrations Neon et le comportement `schema_missing`.

## Interfaces publiques / types
- Nouvelles routes:
  - `/{locale}/application/form`
  - `/{locale}/application/rules`
  - `/{locale}/application/quiz`
  - `/{locale}/application/contact`
- Routes modifiées:
  - `/{locale}/application/chat` devient un chat IA
  - `/{locale}/competition/register` devient une redirection
- Nouvelles APIs:
  - `/api/application/quiz`
  - `/api/application/contact`
- API modifiée:
  - `/api/application/chat`
- Nouvelle variable d’env:
  - `GOOGLE_SCRIPT_URL_CONTACT_RESPONSIBLE`
- Nouvelle convention d’ID affiché:
  - `teamId = JP4F-000123`

## Plan de test
- Unit:
  - mapping `relation does not exist` -> `schema_missing`
  - redirection `/competition/register` -> `/application`
  - formatage stable du `teamId`
  - `/api/application/chat` persiste user + assistant et gère erreurs Groq
  - `/api/application/quiz` et `/api/application/contact` gèrent succès, `skipped`, et erreurs upstream
- Component:
  - sidebar portail et état actif
  - home avec banner `submitted` et sections de résumé
  - formulaire prérempli depuis Neon
  - chat IA désactivé si Neon/schema absent
- E2E:
  - visite non authentifiée -> login Google -> home portail
  - soumission candidature -> retour home + sections remplies
  - quiz portail sauvegardé et réaffiché
  - contact envoyé avec `teamId` visible

## Hypothèses retenues
- Le header/footer publics restent en place; le sidebar est interne au contenu du portail.
- Le quiz public `/{locale}/quiz` reste inchangé.
- Aucun écran admin de lecture des demandes de contact n’est ajouté dans cette itération.
- Si Neon est mal configuré, la soumission finale vers Google Sheets continue de fonctionner, mais les fonctions personnalisées du portail affichent un état de configuration clair.




# 🏆 Innov'Dom Challenge · Formulaire d'inscription · ENSA Fès

Formulaire d'inscription bilingue (FR/EN) multi-étapes pour la compétition technologique **Innov'Dom Challenge — Connecter à l'Avenir**, organisée dans le cadre des Journées Pédagogiques JESI · ENSA Fès.

---

## 📋 Données collectées

| Catégorie | Champs |
|-----------|--------|
| **Type** | Individuel / Équipe |
| **Participant** | Nom, Email, Téléphone, Université, Filière, Niveau, LinkedIn |
| **Équipe** | Nom de l'équipe, Membres 2/3/4 (nom + email) |
| **Projet** | Titre, Domaine, Description, Innovation, Format de présentation |
| **Extra** | Comment entendu parler, Fichier CV/résumé (→ Google Drive) |

---

## 🚀 Déploiement — 3 étapes

### Étape 1 — Google Sheet + Drive + Apps Script

**1a. Crée le dossier Google Drive :**
1. Va sur [drive.google.com](https://drive.google.com)
2. Crée un dossier : **"Candidatures Innov'Dom 2025"**
3. Ouvre-le → copie l'ID dans l'URL : `drive.google.com/drive/folders/**CE_CODE_ICI**`

**1b. Crée la Google Sheet :**
1. [sheets.google.com](https://sheets.google.com) → Nouvelle feuille → **"Innov'Dom 2025"**
2. **Extensions → Apps Script** → supprime tout → colle `google-apps-script.js`
3. En haut du fichier, remplace `YOUR_GOOGLE_DRIVE_FOLDER_ID` par l'ID de l'étape 1a
4. **Enregistrer** → exécute `testConnection()` pour vérifier
5. **Déployer → Nouveau déploiement** :
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Accès : **Tout le monde**
6. **Déployer** → autorise → **copie l'URL** (`https://script.google.com/macros/s/.../exec`)

---

### Étape 2 — GitHub

```bash
git init
git add .
git commit -m "Innov'Dom Challenge — Registration Form"
git remote add origin https://github.com/TON_USERNAME/innov-dom-form.git
git push -u origin main
```

---

### Étape 3 — Vercel

1. [vercel.com](https://vercel.com) → **New Project** → importe le repo
2. **Environment Variables** :

| Name | Value |
|------|-------|
| `GOOGLE_SCRIPT_URL` | URL Apps Script (étape 1) |

3. **Deploy** ✅

---

## 🌐 Intégration dans le site de l'événement

```html
<iframe
  src="https://ton-form.vercel.app"
  width="100%"
  height="900px"
  style="border:none; border-radius:20px;"
  title="Inscription Innov'Dom Challenge">
</iframe>
```

---

## 💻 Test local

```bash
npm install
cp .env.local.example .env.local
# Remplis GOOGLE_SCRIPT_URL
npm run dev
# → http://localhost:3000
```

---

## ✨ Fonctionnalités

- ✅ Formulaire multi-étapes (5 étapes) avec barre de progression
- ✅ Mode individuel **ou** équipe (jusqu'à 4 membres)
- ✅ Validation en temps réel par étape
- ✅ Upload de fichier (PDF/DOC/PPT) → sauvegardé dans Google Drive
- ✅ Lien Drive automatiquement enregistré dans la Sheet
- ✅ Couleurs par type (individuel vert / équipe bleu)
- ✅ Bilingue FR/EN avec toggle
- ✅ Design dark neon cohérent avec le quiz d'orientation
- ✅ 100% gratuit — Vercel + Google Apps Script + Google Drive

---

*Département Génie Industriel · ENSA Fès · JESI 2025*







[text](innov-dom-form/innov-form/.next) [text](innov-dom-form/innov-form/app) [text](innov-dom-form/innov-form/node_modules) [text](innov-dom-form/innov-form/.env.local) [text](innov-dom-form/innov-form/.env.local.example) [text](innov-dom-form/innov-form/.gitignore) [text](innov-dom-form/innov-form/google-apps-script.js) [text](innov-dom-form/innov-form/next.config.js) [text](innov-dom-form/innov-form/package-lock.json) [text](innov-dom-form/innov-form/package.json) [text](innov-dom-form/innov-form/README.md)

**Title:** Add AI Detection to Project Evaluation (Keep /100)

**Summary**
Add AI detection fields to the evaluation output, persist them in the DB, and surface them in the applicant evaluation UI and the admin evaluations panel. Keep global score scale at 0–100 (no /1000).

**Key Changes**
1. **API evaluation output**
   - Extend `app/api/application/evaluate` to request and return:
     - `aiTextLikelihood` (0–100 integer) + `aiTextSummary` (short explanation)
     - `projectAiUsage` ("yes" | "partial" | "no") + `projectAiSummary` (short explanation)
   - Update `normalizeResult` and fallback to include these fields, with safe defaults if missing.
   - Update the prompt text to refer to “AI scores” (not self‑scores).

2. **Persistence + types**
   - Add a new JSONB column `ai_detection` to `application_project_evaluations` (new migration file).
   - Update data types and mapping in:
     - `src/applicant/types.ts` (add `aiDetection`)
     - `src/applicant/data.ts` (add `ai_detection` to row type, mapping, and insert/return).
   - Ensure older rows without `ai_detection` map to a neutral default.

3. **Applicant UI**
   - Extend `src/components/application/ApplicantProjectEvaluation.tsx` to display a new “AI Detection” section in both live and locked views.
   - Show:
     - AI‑written text likelihood as a percentage + short summary.
     - AI usage classification for the project + short summary.

4. **Admin UI + API**
   - Update `app/api/admin/evaluations` to include `ai_detection`.
   - Extend `src/components/admin/AdminEvaluationsPanel.tsx` to display AI detection in the expanded view.

**Test Plan**
- Manual:
  1. Submit evaluation; confirm AI detection fields appear.
  2. Reload evaluation; confirm locked view shows saved AI detection.
  3. Open admin evaluations; confirm AI detection renders for recent entries.
- Verify DB migration by inserting a new evaluation and checking stored `ai_detection`.

**Assumptions**
- Global score remains 0–100 despite the earlier /1000 request (per your latest answers). If you want /1000, I will revise the plan.
- AI detection is informational only and does not change verdict thresholds.
