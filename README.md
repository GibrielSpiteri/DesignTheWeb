# Design The Web

A demo-first web studio for local businesses in Windsor Mill (21244) and greater Baltimore.

**The model:** find a local business that's losing web leads → build them a real demo website → show it to them → close the sale.

## What's in this repo

| Path | What it is |
|---|---|
| [`site/`](site/) | **Our agency website**: the portfolio we send prospects to. Static, deploy as-is. |
| [`site/work/`](site/work/) | Showcase concept sites (fictional businesses). They are portfolio pieces and also our starting templates per vertical. |
| [`demos/`](demos/) | **Private sales demos** built for real local businesses. Concept-labeled and `noindex`. Never link them from the portfolio. |
| [`leads/LEADS.md`](leads/LEADS.md) | 51 researched and fact-checked leads around 21244, ranked. CSV/JSON for your CRM are in the same folder. |
| [`leads/outreach/`](leads/outreach/) | Personalized outreach kits for each business we've built a demo for. |
| [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md) | The sales process: targeting rubric, demo rules, scripts, objection handling, packages, compliance. |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md) | The Claude Code + Higgsfield MCP + Seedance 2.0 workflow (from the YouTube Short), with setup, costs, prompts and ffmpeg recipes. |
| [`brand/BRAND.md`](brand/BRAND.md) | Our brand: positioning, voice, palette, type, logo. |
| [`tools/qa.mjs`](tools/qa.mjs) | Automated QA for any site folder: broken links, console errors, mobile overflow, hidden text, reduced motion, screenshots. |
| [`shared/vendor/`](shared/vendor/) | GSAP 3.13 + ScrollTrigger, Lenis, three.js. Each site keeps its own copy, so every folder is self-contained. |

## Tech stack (short version)

- **Build:** Claude Code writes plain HTML/CSS/JS with GSAP ScrollTrigger and Lenis smooth scroll. There's no framework and no build step, so every folder deploys anywhere.
- **Hero media:** Higgsfield MCP → Seedance 2.0 image-to-video. Each site has a video slot (`data-hero-video`) and ships with an animated fallback until you generate the clip. Prompts are in each site's `HIGGSFIELD_PROMPTS.md`.
- **QA:** `node tools/qa.mjs <folder>` (Playwright).
- **Hosting:** Cloudflare Pages (free tier allows commercial use) or Netlify. See below.

Full details are in [`docs/TECH_STACK.md`](docs/TECH_STACK.md).

## Preview locally

```bash
python3 -m http.server 8080 --directory site                       # agency site → http://localhost:8080
python3 -m http.server 8081 --directory demos/wallace-roofing      # a demo
```

## QA a site

```bash
node tools/qa.mjs site --out .qa/site
node tools/qa.mjs demos/tier-car-care --out .qa/tier
```
Screenshots and `report.json` are written to `.qa/` (gitignored). The command exits non-zero if there are errors.

## Deploy

**Agency site (`site/`)**: Cloudflare Pages → *Create project* → connect this repo → build command: *(none)* → output directory: `site`. Then add your domain.

**Demos (`demos/<slug>/`)**: deploy each demo as its *own* project, so you can take it down on its own. Use a neutral preview URL such as `<slug>.pages.dev`, or `<slug>.preview.<yourdomain>`. Each demo ships `noindex` meta, `robots.txt` and a `_headers` file (`X-Robots-Tag: noindex`). For extra privacy, put Cloudflare Access in front of it. **Never register a domain using the prospect's business name.**

## Hooking up Higgsfield (from the video)

```bash
# Option A: remote MCP inside Claude Code
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
# then run /mcp in Claude Code → Higgsfield → sign in (paid Higgsfield plan required; every generation costs credits)

# Option B: Higgsfield's recommended CLI + skills
npm i -g @higgsfield/cli && higgsfield auth login
```
Then, in Claude Code, from the repo root:
> "Read demos/wallace-roofing/HIGGSFIELD_PROMPTS.md. Generate the hero still with Higgsfield, show it to me for approval, then animate it with Seedance 2.0 (8s, 1080p, no audio). Run the ffmpeg recipes and wire it into the hero's data-hero-video slot."

Budget about 100–200 credits per demo for a hero loop. Don't auto-approve generation tools.

## Before the agency site goes live

Edit `site/assets/js/site-config.js`: set your real email, phone, form endpoint (Formspree or Web3Forms), social links and prices. Then follow the "Before you launch" checklist in `site/README.md`. Check that the "Design The Web" name and domain are free before you print anything.

## Weekly loop

1. Re-check and re-score leads in `leads/leads.csv`, and add new ones.
2. Pick 3–5 leads scoring ≥ 70 → copy the closest `site/work/<vertical>` template → build `demos/<slug>/` with Claude Code → `node tools/qa.mjs demos/<slug>`.
3. Generate the hero clip (Higgsfield), deploy the preview, and reach out using `leads/outreach/` and `docs/PLAYBOOK.md`.
4. When a business signs, swap in their real photos, logo, reviews and domain, remove the concept ribbon and `noindex`, and ask for permission to feature it in `site/work/`.
