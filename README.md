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
- `/[locale]/competition/register`
- `/[locale]/intervenants`
- `/[locale]/clubs`
- `/[locale]/comite`
- `/[locale]/comite-scientifique`
- `/[locale]/quiz`

### Registration flow

- `/[locale]/competition/register`
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

Current applicant portal behavior:

- any verified Google user can sign in
- applicant workspace reads the user's record from Neon
- applicant chat persists messages in Neon
- final application submission syncs the latest submitted snapshot into Neon

Current limitation:

- file binary storage is still not moved to Blob or object storage
- Neon currently stores applicant records and file metadata, not the file itself

## Routing Rules

- `/` redirects to `/fr`
- public pages remain locale-prefixed
- `/admin`, `/auth/login`, and `/api/*` stay outside locale redirects
- routing behavior is implemented through `proxy.ts`

## Content Model

Editable multilingual content is stored in:

- `content/fr/site.json`
- `content/en/site.json`
- `content/ar/site.json`

Typed content contracts live in:

- `src/content/types.ts`

## Main UI Features

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
- `/api/application`
  - authenticated applicant record read/update endpoint for Neon-backed draft data
- `/api/application/chat`
  - authenticated applicant chat read/write endpoint for Neon-backed messages

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
# AI quiz
GROQ_API_KEY=gsk_your_key_here

# Registration / quiz save targets
GOOGLE_SCRIPT_URL_QUIZ=https://script.google.com/macros/s/YOUR_QUIZ_SCRIPT_ID/exec
GOOGLE_SCRIPT_URL_REGISTER=https://script.google.com/macros/s/YOUR_REGISTER_SCRIPT_ID/exec

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

### Schema file

Run this SQL in your Neon project:

- `db/neon/001_applicant_portal.sql`

This creates:

- `applicant_applications`
- `application_messages`

### What Neon currently stores

- Google account email and name
- applicant profile and team information
- project details
- file metadata
- submission status and sheet sync status
- chat messages

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

## Candidate Portal Roadmap

The implementation plan is tracked in:

- `application-portal-plan.md`

Current status:

- Google login foundation: done
- registration access protection: done
- Neon persistence for applicant records: done
- Neon persistence for applicant chat: done
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
