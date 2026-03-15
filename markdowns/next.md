## Error Type
Build Error

## Error Message
Code generation for chunk item errored

## Build Output
./content/ar/site.json
Code generation for chunk item errored
An error occurred while generating the chunk item [project]/content/ar/site.json (json)

Caused by:
- Unable to make a module from invalid JSON: expected value at line 1 column 1

Debug info:
- An error occurred while generating the chunk item [project]/content/ar/site.json (json)
- Execution of <JsonChunkItem as EcmascriptChunkItem>::content failed
- Unable to make a module from invalid JSON: expected value at line 1 column 1
    at .
         | v
       1 + ﻿{
         | ^
       2 |   "locale": "ar",
       3 |   "meta": {
       4 |     "languageLabel": "العربية",
       5 |     "siteName": "Innov'Industry 2026",

Import trace:
  Server Component:
    ./content/ar/site.json
    ./src/content/index.ts
    ./app/[locale]/layout.tsx

Next.js version: 16.1.6 (Turbopack)
fix this error 




























change the website name from Innov'Industry to ENGINOV 























redesign the entire website change the feel of it in both dark and light theme for this kind of design 

Ticker Strip — a continuous gold marquee at the very top, auto-scrolling all event names, dates, and keywords. Sets the tone before anything else loads.
Sticky Header — near-black with a 20px blur backdrop. Left: a gold square "Innov'Industry" logomark + ENGINOV.DAYS wordmark with a gold period. Right: nav links in muted gray that brighten on hover, a FR/EN/AR switcher in monospace, and a solid gold CTA button that lifts on hover.
Hero Section — the heaviest section. Left side carries all the content: a gold rule + overline label in mono, then a massive 3-line headline — ENGINOV in white, DAYS in gold with a subtle glitch animation that fires every 9 seconds, and 2026 in italic serif at half the size. Below that, a live countdown in four mono blocks (days, hours, minutes, seconds) with a blinking gold colon separator. Two CTAs: a solid gold primary and a ghost secondary. Three stat numbers at the bottom anchor it. Right side has concentric decorative rings with two orbiting dots — one gold, one cyan — giving a planetary/industrial feel.
Feature Strip — a 3-column bar with a dark surface background. Each column has a geometric symbol in gold, a short bold label, and a one-liner. Separated by hairline borders. Communicates AI evaluation, free registration, and mini-games at a glance.
Themes Grid — 7 cards in an auto-fill CSS grid, separated by 1px borders on a dark background. Each card has an emoji, a bold title, and a monospace colored subtitle. On hover, each card lifts 3px, gets a faint tinted background, and a colored border — each theme has its own accent color.
AI Evaluation Callout — a full-width banner with a subtle gold-to-cyan gradient border and a slow pulsing glow animation. Left side has copy explaining the AI scoring feature. Right side has 4 score rows (Innovation, Faisabilité, Impact, Techniques each /25) in dark surface pills, with a cyan button at the bottom.
Programme Section — a toggle between Jour 1 and Jour 2. The active day gets the gold fill, the inactive turns muted. Each day renders as an animated vertical timeline: a dotted connector line, a circular node (gold-filled for competition events, dark for regular slots), a mono timestamp, a small mono tag badge, and the event title. Items stagger in with a 55ms delay each.
Phases — 3 cards in a grid. Each has a ghost large number watermark in the background, a gold mono phase label, a bold title, a subtitle, and a short description. The Finale card has a gold border to distinguish it from the others.
Partners — centered on a dark bar. Pill-shaped tags for each partner, muted by default, that brighten fully on hover.
CTA Section — centered, full-width, with a vertical gradient fading into the surface color. Large headline with a gold accent line, short paragraph, two buttons. The primary button has the same pulsing glow as the AI callout.
Footer — minimal 1-line strip with copyright, the three event names, and the site URL.

The overall aesthetic is dark industrial editorial — the kind of thing you'd expect from a high-end engineering conference or a serious tech product launch, not a university event page. The gold is used sparingly as a signal color, never decoratively.