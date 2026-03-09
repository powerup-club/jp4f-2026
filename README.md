# JP4F 2026 - Next.js Multilingual Site

Modern multilingual redesign of the JP4F website using Next.js App Router and Tailwind CSS.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Vitest + Testing Library
- Playwright
- Vercel-ready deployment

## Routes

Locale-prefixed routes:

- `/fr`, `/en`, `/ar`
- `/[locale]/programme`
- `/[locale]/filieres`
- `/[locale]/competition`
- `/[locale]/intervenants`
- `/[locale]/clubs`
- `/[locale]/comite`
- `/[locale]/comite-scientifique`

Root `/` redirects to `/fr`.

## Content model

All editable content is stored in:

- `content/fr/site.json`
- `content/en/site.json`
- `content/ar/site.json`

Typed contracts are in `src/content/types.ts`.

## Key features

- Shared layout components: header, mobile nav, footer
- Theme toggle (dark/light) with localStorage persistence
- Locale switcher with same-path language switching
- RTL support for Arabic (`dir="rtl"`)
- Reusable interactive UI modules:
  - animated counters
  - countdown
  - programme tabs
  - reveal-on-scroll
  - progress bars
  - background canvas

## Local run

```bash
npm install
npm run dev
```

## Environment

Create `.env.local` with:

```bash
GROQ_API_KEY=gsk_your_key_here
GOOGLE_SCRIPT_URL_QUIZ=https://script.google.com/macros/s/YOUR_QUIZ_SCRIPT_ID/exec
GOOGLE_SCRIPT_URL_REGISTER=https://script.google.com/macros/s/YOUR_REGISTER_SCRIPT_ID/exec
```

Optional legacy fallback:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEFAULT_SCRIPT_ID/exec
```

Routing behavior:

- `/api/quiz/save` uses `GOOGLE_SCRIPT_URL_QUIZ`, then falls back to `GOOGLE_SCRIPT_URL`
- `/api/register` uses `GOOGLE_SCRIPT_URL_REGISTER`, then falls back to `GOOGLE_SCRIPT_URL`
- `/api/quiz/chat` uses only `GROQ_API_KEY`

## Tests

```bash
npm run test:unit
npm run test:e2e
```

## Notes

- Old static-site files were removed; the repository now keeps only the Next.js app and shared content/assets.
- Static assets are served from `public/images`.
