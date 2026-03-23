# Innov'Industry 2026 Brand and Frontend Reference

Last updated: 2026-03-07

## Architecture

- The project runs only on Next.js App Router.
- Root route `/` redirects to `/fr` via `app/page.tsx`.
- All page routes are locale-prefixed:
  - `/[locale]/programme`
  - `/[locale]/filieres`
  - `/[locale]/competition`
  - `/[locale]/intervenants`
  - `/[locale]/clubs`
  - `/[locale]/comite`
  - `/[locale]/comite-scientifique`
- Shared styling is in `app/globals.css`.

## Content Sources

- Editable content is in:
  - `content/fr/site.json`
  - `content/en/site.json`
  - `content/ar/site.json`
- Typed contracts are in `src/content/types.ts`.

## Assets

- Runtime assets are served from `public/images`.
- Legacy static-site folders/files (`pages/`, `assets/`, root static JS/HTML) were removed.

## UI System

- Shared layout components:
  - `src/components/layout/Header.tsx`
  - `src/components/layout/MobileNav.tsx`
  - `src/components/layout/Footer.tsx`
- Shared section components:
  - `src/components/sections/HomeHero.tsx`
  - `src/components/sections/FilieresPreview.tsx`
  - `src/components/sections/ClubsPreview.tsx`
  - `src/components/sections/ClubFlipCard.tsx`
  - `src/components/sections/ChallengePanel.tsx`

## Local Run

```bash
npm install
npm run dev
```
