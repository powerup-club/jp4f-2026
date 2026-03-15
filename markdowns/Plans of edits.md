# Update Log — 2026-03-15 01:00
- Added the new industrial-tech intro overlay with event and club logos.
- Exposed games as a public section and linked it in the main navigation.
- Removed games shortcuts from the applicant portal UI.

# Plan: Update Programme + Challenge Content from PDF (FR/EN/AR)

## Summary
- Replace the programme schedule with the PDF’s official Day 1/Day 2 timetable.
- Refresh the /competition page content using the PDF’s Innov’Dom Challenge details without restructuring the layout.
- Translate the updated content to EN and AR for locale parity.

## Implementation Changes
- Programme content (JSON only)
  - Update `content/fr/site.json`, `content/en/site.json`, `content/ar/site.json` under `programme`:
    - Replace `day1Label`/`day2Label` with “JOUR 1 · Vendredi 17 Avril 2026” and “JOUR 2 · Samedi 18 Avril 2026” (translated for EN/AR).
    - Replace `day1` and `day2` arrays using the PDF schedule.
    - Keep entries compact: `title` = main slot title, `location` = short details (format, speakers, or notes) separated with “ · ”.

- Challenge page content (JSON only, no layout changes)
  - Update `content/*/site.json` under `competition`:
    - `title`, `tag`, and `subtitle` from the PDF “Appel à candidatures / Présentation”.
    - `axes` list to match the PDF themes (7 items).
    - `eligibility` to include who can participate + participation format + academic supervisor note.
    - `criteria` to match the PDF evaluation criteria.
    - `timeline` to match Phase 1–3 with times, and include submission deadline/results in Phase 1 text.
    - `formats` to match PDF presentation formats.
    - `partners` to list the “Partenaires d’édition précédente”.
    - `deadlineLabel` to reflect “Date limite : 05 Avril 2026 · Résultats : 10 Avril 2026”.
    - `registrationHeading`/`registrationLabel` per “Inscription gratuite — plateforme dédiée”.
    - `contact.email` = primary email from PDF; list additional emails in `contact.site` as plain text (since schema allows one email only).

- Light code tweak (content accuracy, no layout changes)
  - Update `app/[locale]/competition/page.tsx` to display `statFormatValue` as “5–10 min” (EN/FR) and the equivalent Arabic.

## Test Plan
- Manual: open `/fr/programme`, `/en/programme`, `/ar/programme` and verify the full timeline matches the PDF.
- Manual: open `/fr/competition`, `/en/competition`, `/ar/competition` and verify themes, eligibility, criteria, phases, formats, partners, and deadlines reflect the PDF.

## Assumptions
- “Challenge page” refers to `/{locale}/competition`.
- One primary contact email link is acceptable; additional emails shown as plain text.
- English and Arabic translations should be natural but not necessarily officially provided in the PDF.
