# Design The Web: brand brief

> Working brand. The name comes from the repo name. Before you print anything, check that the name and domain are free (USPTO TESS search, Maryland SDAT business-entity search, and a domain registrar). Name, email, phone and pricing all live in `site/assets/js/site-config.js` so they can be changed in one place.

## Who we are
We're a Baltimore-area web studio for local businesses: home-service trades, clinics, shops, restaurants and other neighborhood businesses around Windsor Mill / Woodlawn (21244) and greater Baltimore.

## The one idea: demo-first
**We build your new website before you pay for it.**
We research your business, then build a working demo of your new site and send you the link. You look at it on your phone. If you like it, we launch it. If you don't, you owe nothing.

Every page of our own site should support that idea: lower the risk, show the work, make it easy to say "build mine."

## Positioning lines (use, adapt, don't stack them all at once)
- Headline options: "See your new website before you spend a dime." / "Your next customer is searching right now." / "Built before you buy."
- Promise: Websites that turn "near me" searches into calls, quotes and bookings.
- Proof we *can* claim honestly today: speed (demo in days), mobile-first builds, conversion features (instant quotes, booking, click-to-call), local SEO foundations, cinematic AI-generated hero video.
- Proof we must NOT invent: client counts, revenue figures, testimonials, awards, "as seen in", years in business. We are new. Concept work is always labeled **Concept**.

## Voice
Plain-spoken and local. Confident, not slick. Short sentences. Talk about the business owner's results (calls, booked jobs, fewer no-shows), not our tech. No jargon like "synergy", "leverage" or "digital transformation." It's OK to have a little Baltimore warmth, but no clichés, no crab and Old Bay jokes.

## Visual identity
Dark, cinematic and editorial: the "$10k website" look, built for local businesses.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0B0C` | Page background |
| `--ink-2` | `#141416` | Raised surfaces, cards |
| `--line` | `#26262A` | Hairlines, borders |
| `--paper` | `#F2EEE6` | Primary text on dark; light sections |
| `--muted` | `#9A968E` | Secondary text (check AA contrast on ink) |
| `--signal` | `#FF5B2E` | The single accent: CTAs, highlights, the cursor-mark |
| `--signal-ink` | `#1A0A04` | Text on signal backgrounds |
| `--harbor` | `#16324A` | Deep blue for gradients and glows only (Baltimore harbor at night) |

Rules: one accent color. Generous negative space. Large display type with tight tracking. Thin hairline grids. Motion is smooth and purposeful (no bouncy easing). Respect `prefers-reduced-motion`.

### Type (Google Fonts)
- Display: **Bricolage Grotesque**, 600–800, tight letter-spacing (-0.02 to -0.04em), very large sizes (clamp up to about 9rem).
- Accent: **Instrument Serif** *italic*, for one or two emphasis words per headline, never whole paragraphs.
- Body/UI: **Inter**, 400/500/600.
- Labels, numbers, meta: **JetBrains Mono**, 400/500, uppercase, letter-spaced +0.08em, small.

### Logo
A lowercase wordmark, `design the web`, followed by a blinking text-cursor block in `--signal`, a nod to building things live. The square cursor block on its own is the favicon/mark. Keep it SVG, and keep it legible at 16px (favicon) and 24px (nav).

## Hero media (from the video's workflow)
The portfolio hero is built to take a cinematic AI video generated with **Higgsfield (Seedance 2.0)**. Until that video exists, it shows an animated WebGL/canvas hero. Prompts are in `site/HIGGSFIELD_PROMPTS.md`.
