# Integrate JP4F Admin Dashboard Into Main Next.js App

## Summary
- Merge the imported dashboard into the main app as a root-level internal route at `/admin`, not locale-prefixed, with a dedicated admin shell that reuses the existing JP4F design system instead of the imported inline-styled mini-app.
- Keep Google OAuth as the auth model, wired for Vercel deployment, with allowlisted admin emails and no database adapter.
- Ship v1 for the two existing data sources only: competition registrations and quiz results, using the current Google Apps Script backends as the source of truth.

## Key Changes
- Routing and protection:
  - Replace the current root `middleware.ts` locale redirect with a consolidated `proxy.ts` that preserves existing locale behavior but explicitly exempts `/admin`, `/admin/login`, `/api/auth/*`, and existing `/api/*` routes from locale prefix redirects.
  - Add root routes `/admin` and `/admin/login`; keep admin outside `app/[locale]`.
  - Do not add the admin area to public header/mobile nav. Access is by direct URL only.

- Auth integration:
  - Add current auth dependencies and configure Google provider in a shared `src/auth.ts`.
  - Add only one auth handler route: `/api/auth/[...nextauth]`.
  - Protect `/admin` and `/api/admin/data` with server-side auth checks from the shared auth config.
  - Avoid a global `SessionProvider`; use server auth for route gating and a client dashboard component only for interactive charts/tables.
  - Add required env/config surface for Vercel: Google client ID/secret, auth secret, `ADMIN_EMAILS`, and `ADMIN_DATA_SECRET`.

- Admin UI integration:
  - Rebuild the imported dashboard screens into JP4F-native components using existing fonts, theme tokens, `BackgroundCanvas`, `glass-card`, badge styling, and the current light/dark system.
  - Add a minimal admin header with brand link back to the site, refresh controls, authenticated user email, sign-out, and theme toggle.
  - Keep the dashboard French-first for v1.
  - Ignore the duplicated `admin-dashboard/admin-dashboard` tree and use the top-level imported files only as reference source.

- Data layer and normalization:
  - Add `/api/admin/data?type=register|quiz` in the main app, protected server-side, fetching from the existing Apps Script URLs with `action=getData&secret=...`.
  - Normalize upstream sheet rows into stable admin types before rendering.
  - Explicitly map current production payload mismatches:
    - registration `type: "individual" | "team"` to admin display values used by charts/tables
    - quiz `language` to `lang`
    - tolerate mixed historical rows so old and new sheet data both render correctly
  - Return structured setup/upstream errors so the admin UI can show a clear configuration state instead of failing silently.

- External setup and docs:
  - Update project docs with Vercel-safe deployment steps: Google OAuth redirect URI for the production domain, required env vars, and the Apps Script `doGet` addon requirement on both registration and quiz scripts.
  - Keep Google Sheets as the storage layer; no database migration in this iteration.

## Public Interfaces And Types
- New routes:
  - `/admin`
  - `/admin/login`
  - `/api/auth/[...nextauth]`
  - `/api/admin/data?type=register|quiz`
- New env/config requirements:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - auth secret for the auth package
  - `ADMIN_EMAILS`
  - `ADMIN_DATA_SECRET`
  - reuse existing `GOOGLE_SCRIPT_URL_REGISTER` and `GOOGLE_SCRIPT_URL_QUIZ`
- New internal normalized types:
  - `AdminRegistrationRow`
  - `AdminQuizRow`
  - typed admin API response with `rows`, `total`, and structured error/setup metadata

## Test Plan
- Unit tests:
  - locale proxy still redirects `/` to `/fr` and locale-less public routes to `/fr/...`
  - `/admin` and `/admin/login` are excluded from locale redirection
  - admin data normalization handles `individual/team`, historical French labels, and quiz `language -> lang`
  - admin API returns expected setup/auth/upstream error states
- Component tests:
  - login screen renders Google sign-in CTA and error message states
  - admin dashboard renders normalized overview stats and setup/error states from mocked data
- E2E smoke:
  - unauthenticated visit to `/admin` lands on `/admin/login`
  - existing locale routing behavior remains intact after proxy changes

## Assumptions
- Admin is an internal tool at `/admin`, not a public navigation destination.
- v1 scope is limited to registrations and quiz analytics; no CMS/content editing is added now.
- Admin copy is French-only for now.
- Google OAuth credentials, allowlisted admin emails, and Apps Script read access will be configured for Vercel as part of this integration.
- The imported dashboard folder is reference material; implementation will live in the main app’s normal `app/` and `src/` structure.
