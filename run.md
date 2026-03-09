<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>JP4F — Next.js Redesign Plan</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg: #0b0f1a;
      --surface: #111827;
      --surface2: #1a2236;
      --border: #1f2d45;
      --accent: #3b82f6;
      --accent2: #06b6d4;
      --accent3: #8b5cf6;
      --green: #10b981;
      --yellow: #f59e0b;
      --text: #e2e8f0;
      --muted: #64748b;
      --tag-bg: #1e3a5f;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      min-height: 100vh;
      padding: 0 0 80px;
    }

    /* HEADER */
    .hero {
      background: linear-gradient(135deg, #0b0f1a 0%, #0f172a 50%, #111827 100%);
      border-bottom: 1px solid var(--border);
      padding: 56px 40px 48px;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero::after {
      content: '';
      position: absolute;
      bottom: -60px; left: 10%;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(59,130,246,0.15);
      border: 1px solid rgba(59,130,246,0.3);
      color: var(--accent2);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      padding: 5px 12px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    .badge::before { content: '◆'; font-size: 8px; }

    .hero h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(28px, 5vw, 48px);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #e2e8f0 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero h1 span {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--muted);
    }
    .chip .dot {
      width: 6px; height: 6px;
      border-radius: 50%;
    }
    .chip .dot.blue { background: var(--accent); }
    .chip .dot.cyan { background: var(--accent2); }
    .chip .dot.purple { background: var(--accent3); }
    .chip .dot.green { background: var(--green); }

    /* LAYOUT */
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* SECTION */
    .section {
      margin-top: 40px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .section-icon {
      width: 36px; height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .icon-blue { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.25); }
    .icon-cyan { background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.25); }
    .icon-purple { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25); }
    .icon-green { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.25); }
    .icon-yellow { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.25); }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    /* CARD */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #2a3f60; }

    /* SUMMARY GRID */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .summary-item {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .summary-item .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      font-family: 'JetBrains Mono', monospace;
    }
    .summary-item .value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
    }

    /* CHECKLIST */
    .checklist {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .check-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      background: var(--surface2);
      border: 1px solid transparent;
      transition: border-color 0.2s, background 0.2s;
    }
    .check-item:hover {
      border-color: var(--border);
      background: #1e2d44;
    }
    .check-icon {
      width: 18px; height: 18px;
      border-radius: 4px;
      background: rgba(59,130,246,0.2);
      border: 1px solid rgba(59,130,246,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
      font-size: 10px;
      color: var(--accent);
    }
    .check-item span { font-size: 14px; color: #cbd5e1; }
    .check-item code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      background: rgba(59,130,246,0.12);
      color: var(--accent2);
      padding: 1px 6px;
      border-radius: 4px;
    }

    /* ROUTES TABLE */
    .routes-grid {
      display: grid;
      gap: 6px;
    }
    .route-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 8px 14px;
      background: var(--surface2);
      border-radius: 8px;
      border: 1px solid transparent;
      transition: border-color 0.2s;
    }
    .route-row:hover { border-color: var(--border); }
    .route-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 4px;
      font-weight: 600;
    }
    .route-tag.fr { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .route-tag.en { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
    .route-tag.ar { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .route-sep { color: var(--muted); font-size: 12px; }

    /* TYPES */
    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 8px;
    }
    .type-item {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .type-item .type-keyword { color: var(--accent3); }
    .type-item .type-name { color: var(--accent2); font-weight: 600; }

    /* TEST PLAN */
    .test-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 8px;
      background: var(--surface2);
      border: 1px solid transparent;
      margin-bottom: 8px;
      transition: border-color 0.2s;
    }
    .test-item:hover { border-color: var(--border); }
    .test-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      flex-shrink: 0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .badge-unit { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
    .badge-comp { background: rgba(6,182,212,0.2); color: #67e8f9; border: 1px solid rgba(6,182,212,0.3); }
    .badge-e2e { background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
    .badge-qa { background: rgba(245,158,11,0.2); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
    .badge-seo { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }

    /* ASSUMPTIONS */
    .assumption-item {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      border-left: 3px solid var(--accent3);
      background: rgba(139,92,246,0.05);
      border-radius: 0 8px 8px 0;
      margin-bottom: 8px;
      font-size: 14px;
      color: #cbd5e1;
    }
    .assumption-item::before { content: '→'; color: var(--accent3); font-weight: 700; flex-shrink: 0; }

    /* DIVIDER */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent);
      margin: 40px 0 0;
    }

    /* FOOTER */
    .plan-footer {
      margin-top: 48px;
      padding: 20px 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: gap;
      gap: 12px;
    }
    .plan-footer .footer-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.3);
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 13px;
      color: var(--green);
      font-weight: 500;
    }
    .status-pill::before {
      content: '';
      width: 7px; height: 7px;
      background: var(--green);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (max-width: 600px) {
      .hero { padding: 36px 20px 32px; }
      .container { padding: 0 16px; }
      .summary-grid { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>

<!-- HERO -->
<div class="hero">
  <div class="container">
    <div class="badge">Migration Plan · JP4F</div>
    <h1>Next.js <span>Multilingual</span><br/>Redesign Plan</h1>
    <div class="hero-meta">
      <div class="chip"><span class="dot blue"></span>Next.js App Router</div>
      <div class="chip"><span class="dot cyan"></span>Tailwind CSS</div>
      <div class="chip"><span class="dot purple"></span>TypeScript</div>
      <div class="chip"><span class="dot green"></span>Vercel Deploy</div>
      <div class="chip"><span class="dot" style="background:#f59e0b"></span>FR · EN · AR</div>
    </div>
  </div>
</div>

<div class="container">

  <!-- SUMMARY -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon icon-blue">📋</div>
      <div class="section-title">Summary</div>
    </div>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="label">Delivery</span>
        <span class="value">Single migration PR</span>
      </div>
      <div class="summary-item">
        <span class="label">Framework</span>
        <span class="value">Next.js App Router</span>
      </div>
      <div class="summary-item">
        <span class="label">Styling</span>
        <span class="value">Tailwind CSS</span>
      </div>
      <div class="summary-item">
        <span class="label">Hosting</span>
        <span class="value">Vercel</span>
      </div>
      <div class="summary-item">
        <span class="label">Pages</span>
        <span class="value">8 pages × 3 locales</span>
      </div>
      <div class="summary-item">
        <span class="label">Content</span>
        <span class="value">Local JSON/MD files</span>
      </div>
      <div class="summary-item">
        <span class="label">Languages</span>
        <span class="value">FR · EN · AR (RTL)</span>
      </div>
      <div class="summary-item">
        <span class="label">Backend / CMS</span>
        <span class="value">None — file-based</span>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- IMPLEMENTATION -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon icon-cyan">⚙️</div>
      <div class="section-title">Implementation Changes</div>
    </div>
    <div class="card">
      <div class="checklist">
        <div class="check-item"><span class="check-icon">✓</span><span>Initialize a new Next.js app with <code>App Router</code>, <code>TypeScript</code>, <code>ESLint</code>, and <code>Tailwind</code></span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Move existing static assets to <code>public/</code> and normalize file naming</span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Redirect <code>/</code> → <code>/fr</code> via <code>middleware.ts</code></span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Create shared components: <code>Header</code>, <code>MobileNav</code>, <code>Footer</code>, <code>BackgroundCanvas</code>, and common section wrappers</span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Replace inline JS with reusable hooks/components for theme toggle, countdown, tabs, reveal-on-scroll, animated counters, progress bars, and canvas background</span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Store all page content in local structured files under <code>content/fr</code>, <code>content/en</code>, <code>content/ar</code></span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Add typed content contracts in <code>src/content/types.ts</code></span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Add locale config in <code>src/config/locales.ts</code> — default locale: <code>fr</code></span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Add site/event constants in <code>src/config/site.ts</code></span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Keep Innov4 registration as external link — no backend or DB</span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Implement Arabic <code>dir="rtl"</code> behavior and mirrored layout/alignment rules</span></div>
        <div class="check-item"><span class="check-icon">✓</span><span>Add localized metadata per route (title, description, OG basics)</span></div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- ROUTES -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon icon-yellow">🗺️</div>
      <div class="section-title">Route Structure</div>
    </div>
    <div class="card">
      <div class="routes-grid">
        <div class="route-row">
          <span class="route-tag fr">/fr</span><span class="route-sep">·</span>
          <span class="route-tag en">/en</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar</span>
          <span style="font-size:13px;color:var(--muted);margin-left:4px;">— Home</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/programme</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/programme</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/programme</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/filieres</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/filieres</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/filieres</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/competition</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/competition</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/competition</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/intervenants</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/intervenants</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/intervenants</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/clubs</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/clubs</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/clubs</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/comite</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/comite</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/comite</span>
        </div>
        <div class="route-row">
          <span class="route-tag fr">/fr/comite-scientifique</span><span class="route-sep">·</span>
          <span class="route-tag en">/en/comite-scientifique</span><span class="route-sep">·</span>
          <span class="route-tag ar">/ar/comite-scientifique</span>
        </div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- TYPES -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon icon-purple">🧩</div>
      <div class="section-title">Public Interfaces & Types</div>
    </div>
    <div class="types-grid">
      <div class="type-item"><span class="type-keyword">type </span><span class="type-name">SiteLocale</span> = "fr" | "en" | "ar"</div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">NavigationItem</span></div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">FooterLink</span></div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">ScheduleItem</span></div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">CompetitionTimelineItem</span></div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">Speaker</span></div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">Club</span></div>
      <div class="type-item"><span class="type-keyword">interface </span><span class="type-name">CommitteeMember</span></div>
    </div>
    <div style="margin-top:10px;padding:12px 16px;background:rgba(139,92,246,0.07);border:1px solid rgba(139,92,246,0.2);border-radius:8px;font-size:13px;color:#a78bfa;">
      📁 Editable content interface is <strong>file-based</strong> (<code style="font-family:'JetBrains Mono',monospace;font-size:11px;background:rgba(139,92,246,0.15);padding:1px 6px;border-radius:3px;">content/*</code>) — not hardcoded JSX
    </div>
  </div>

  <div class="divider"></div>

  <!-- TEST PLAN -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon icon-green">🧪</div>
      <div class="section-title">Test Plan</div>
    </div>
    <div class="card">
      <div class="test-item">
        <span class="test-badge badge-unit">Unit</span>
        <span style="font-size:14px;color:#cbd5e1;">Locale utilities and content schema validation</span>
      </div>
      <div class="test-item">
        <span class="test-badge badge-comp">Comp</span>
        <span style="font-size:14px;color:#cbd5e1;">Tabs, countdown, counters, theme toggle, and RTL behavior</span>
      </div>
      <div class="test-item">
        <span class="test-badge badge-e2e">E2E</span>
        <span style="font-size:14px;color:#cbd5e1;">Locale routing, root redirect, navigation across all pages, external registration CTA</span>
      </div>
      <div class="test-item">
        <span class="test-badge badge-e2e">E2E</span>
        <span style="font-size:14px;color:#cbd5e1;">Language switching and Arabic layout direction correctness</span>
      </div>
      <div class="test-item">
        <span class="test-badge badge-qa">QA</span>
        <span style="font-size:14px;color:#cbd5e1;">Responsive testing — mobile, tablet, and desktop breakpoints</span>
      </div>
      <div class="test-item" style="margin-bottom:0">
        <span class="test-badge badge-seo">SEO</span>
        <span style="font-size:14px;color:#cbd5e1;">Localized metadata + Lighthouse sanity check on key routes</span>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- ASSUMPTIONS -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon icon-yellow">⚠️</div>
      <div class="section-title">Assumptions</div>
    </div>
    <div class="assumption-item">Existing images/logos are reused unless replaced during migration</div>
    <div class="assumption-item">EN/AR translations are completed inside this migration branch <strong>before merge</strong></div>
    <div class="assumption-item">No CMS, no admin panel, and no submission storage in this phase</div>
    <div class="assumption-item">Vercel previews are used for review before production release</div>
  </div>

  <!-- FOOTER -->
  <div class="plan-footer">
    <div>
      <div class="footer-label">Plan Status</div>
      <div style="font-size:13px;color:var(--muted);margin-top:2px;">Ready for implementation</div>
    </div>
    <div class="status-pill">Approved · Ready to build</div>
  </div>

</div>
</body>
</html>