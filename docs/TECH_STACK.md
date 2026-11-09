# Research brief: the "Claude Code + Higgsfield MCP + Seedance 2.0 = $10k websites" workflow

*Researched 2026-11-09 for a new web design agency targeting local businesses in the 21244 / Windsor Mill / Baltimore area.*

> **Read this first: what the sources can and cannot tell us.** Ed Hill's Short (@EdHillAI, published Aug 31 2026) has no public transcript or description that I could retrieve, so its exact steps are **not confirmed**. None of the three "start here" articles is about Ed Hill's video:
> - frontiermodels.cc summarizes **Nate Herk's** video "Seedance 2.0 + Claude Code Creates $10k Websites in Minutes" (Apr 11 2026).
> - thefuturist.co and startup.whatfinger.com summarize a **Liam Ottley** video.
>
> The details below come from the tools' own documentation and from creators who teach the same pattern. The most important of these are Higgsfield's official `higgsfield-ai/skills` repo, the community `Arnie936/higgsfield-website-skill`, the `Motionsites-AI/claude-skill` repo and Higgsfield's help center. Ed Hill's public footprint is a paid Skool community, "AI Automation Space" ($87/mo). It lists Claude Code training and a "Website Builder Agent Blueprint", and does not mention Higgsfield.

> **How we apply this in this repo.** Every site here (the portfolio in `site/` and the demos in `demos/`) is plain static HTML, CSS and JS with GSAP 3.13, ScrollTrigger and Lenis vendored locally from `shared/vendor/`, so there's no build step and any static host works. Each hero has a **video slot** (`data-hero-video`) and an animated fallback until you generate the Seedance 2.0 clip through Higgsfield. Each site's `HIGGSFIELD_PROMPTS.md` holds ready-to-run prompts. QA runs on `node tools/qa.mjs <folder>`.

---

## 1. What the video is showing

Each step is tagged:
- **[C]**: confirmed by a cited source. The source is named.
- **[C-other]**: confirmed for another creator's version of the same workflow.
- **[I]**: inferred.

1. **Connect Higgsfield's own MCP server to Claude Code.** **[C]** The Short's title names Claude Code, Higgsfield "using its own MCP" and Seedance 2.0. The thumbnail shows the Claude and Higgsfield logos under "$10,000 Websites". **[I]** The connection is probably either `claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp` or the Claude custom connector. Higgsfield's official MCP URL is `https://mcp.higgsfield.ai/mcp` (help center). See §3.
2. **Brief Claude on the business or brand.** **[C-other]** Herk: Claude Code writes cinematic video prompts from a brand brief. ZEUS: you give a brand kit and business details. Arnie936's skill starts with an interview covering brand, input image, HD or 4K, language and devices. **[I]** Ed Hill does the same.
3. **Generate a hero still first.** **[C-other]**
   - Herk uses Nano Banana 2 (via key.ai) for a reference image.
   - Arnie936's skill uses GPT Image 2 or Nano Banana Pro, with an approval checkpoint before any video is made.
   - Higgsfield's own skill generates the hero image, then runs image-to-video with `--start-image`.
4. **Animate it with Seedance 2.0 (image-to-video).** **[C]** Seedance 2.0 is named in the title. **[C-other]**
   - Herk sets the **same image as first and last frame** and renders 10 s, which makes the loop seamless.
   - Arnie936 uses "Seedance 2.0, std mode", about 8 s clips, no audio, with the hero image as the reference for every clip.
5. **Post-process the clip with ffmpeg.** **[C-other]** Arnie936 encodes H.264 at about CRF 28 with `+faststart`. Higgsfield's skill ships an ffmpeg helper for scrub encodes and posters. ZEUS: Claude "extracts every frame."
6. **Build the site around the video.** **[I]** We don't know which pattern Ed Hill uses. Two patterns are documented:
   - **(a) Full-viewport looping background hero.** Herk's version: HTML/CSS/JS, video as the hero with text overlay. **[C-other]**
   - **(b) Scroll-scrubbed hero, where scrolling plays the film.** ZEUS's playbook uses GSAP ScrollTrigger and Lenis. Arnie936's skill draws a canvas frame sequence on top of Lenis and GSAP, with only the hero scrubbing and support clips as `<video muted playsinline autoplay loop>`. Higgsfield's official skill defaults to a scroll-scrubbed MP4 driven by `video.currentTime` and says a passive autoplay loop "is never the Tier-1 mechanic." **[C-other]**
7. **QA in a real browser.** **[C-other]** Arnie936 and Motionsites both use Playwright to check scrub behavior, console errors, layout and viewports.
8. **Deploy.** **[C-other]**
   - Herk: GitHub plus Vercel.
   - Arnie936: hosting "on request" through the Higgsfield MCP.
   - Higgsfield's official skill: `higgsfield website deploy`, which runs a Cloudflare Worker on a Higgsfield subdomain.
   - The dev.to author only launched on localhost.
   - **[I]** Ed Hill's host is unknown.
9. **Sell it as a "$10k website."** **[C]** That's the thumbnail's framing. **[C-other]** ZEUS cites agency benchmarks of "$2,500–$10,000+". The dev.to author suggests $3K–$5K for a hero landing page and $8K–$12K for a full 3D scroll site. **The $10k figure is marketing, not a verified result.**

**Related variant (Liam Ottley, same genre):**
- Claude Code, "Fable 5" and "3.js" (presumably Three.js).
- Higgsfield via MCP to outpaint portrait photos into widescreen and turn stills into moving clips.
- Mobbin and 21st.dev (via MCP) for UI references and components.
- Osprey for visitor-to-lead resolution.
- Source: thefuturist and whatfinger summaries.

---

## 2. The stack

| Layer | Tool | Role | Cost | Source |
|---|---|---|---|---|
| Agent / IDE | Claude Code (terminal or VS Code extension) | Writes prompts, drives Higgsfield, builds and QAs the site | Claude Pro/Max subscription (pricing not checked here) | Herk (frontiermodels, Skool), all repos |
| Design skill (pick ONE) | `higgsfield-ai/skills` → `higgsfield-websites` | Official: React 19 + TanStack Start SSR on a Cloudflare Worker. Animated scroll-scrub by default | Free (MIT) plus credits | github.com/higgsfield-ai/skills |
| | `Arnie936/higgsfield-website-skill` | Static `index.html`, Lenis, GSAP/ScrollTrigger, canvas scrub, 10 templates incl. Restaurant/Local, Playwright QA | Free plus credits (README uses referral links) | github.com/Arnie936/... |
| | `Motionsites-AI/claude-skill` | 40 example designs, 50+ hero video shelf, 55+ technique recipes, screenshot-and-fix loop | Code is MIT. Example media is © MotionSites, usable in sites built with the skill | trendshift.io/repositories/321816, GitHub |
| | Anthropic "frontend design plugin" plus plan mode | Herk's choice | Included | frontiermodels |
| Media gateway | Higgsfield MCP (`https://mcp.higgsfield.ai/mcp`) or Higgsfield CLI (`higgsfield …`) | One OAuth login for 30+ image/video/audio models, plus upscale, background removal, outpaint and reframe | Paid subscription required. Every MCP generation deducts credits | Higgsfield help center, higgsfield.ai/cli |
| Image model | Nano Banana Pro / Nano Banana 2 / GPT Image 2 | Hero stills, start frames, storyboards, OG images | Nano Banana Pro is about 2 credits (4K about 4) | Higgsfield pricing blog (Oct 2026) |
| Video model | **Seedance 2.0** (ByteDance) | Image-to-video hero loops and scrub films | 8 s clip: 48 credits at 720p, 96 at 1080p, 208 at 4K. Fast 8 s/720p: 28. Mini 8 s/720p: 20 | higgsfield.ai/blog/seedance-2-0-pricing-2026 |
| Video alternatives | Seedance 2.5, Kling 3.0 (and `kling3_0_turbo`), Veo 3.1, Wan | Longer clips (2.5 does up to 30 s native), cheaper drafts | Seedance 2.5, 5 s: 35 credits at 720p, 80 at 1080p | Higgsfield pricing blog, skills README |
| Post-processing | ffmpeg | Compress, poster frames, frame sequences, loop crossfades | Free | Arnie936, Higgsfield, Motionsites |
| Front end | Plain HTML/CSS/JS + GSAP ScrollTrigger + Lenis | Scroll-scrub, reveals, smooth scroll | Free | ZEUS (youmind), Arnie936 |
| | React 19 + TanStack Start, Tailwind/custom CSS | Higgsfield official stack | Free | higgsfield-websites SKILL.md |
| | Three.js | 3D elements | Free | Ottley summaries |
| UI references | Mobbin, 21st.dev MCP | Layout and component references | Not stated | Ottley summaries |
| QA | Playwright MCP: `claude mcp add --scope project playwright -- npx @playwright/mcp@latest` | Screenshots, scrub tests, console checks | Free | Arnie936 README |
| Hosting | GitHub + Vercel | Herk's deploy | Vercel Hobby is reportedly non-commercial only (third-party sources) | Skool post, comparison blogs |
| | Higgsfield hosting (`higgsfield website deploy` / MCP hosting tool) | Live public URL on a Higgsfield subdomain | Included | Higgsfield skill, Arnie936 |
| | Cloudflare Pages (recommended for us) | Static hosting | Free tier allows commercial use. **25 MiB per-file cap**, 20,000 files, 500 builds/mo | developers.cloudflare.com |
| Lead capture (optional) | Osprey | Turns site visitors into named leads | Not stated | Ottley summaries |

**Higgsfield plans** (Higgsfield blog, "verified October 2026", monthly):

| Plan | Price | Credits/month |
|---|---|---|
| Starter | $15 | 200 |
| Plus | $49 | 1,000 |
| Ultra | $129 | 3,000 |
| Team | $79/seat | 1,000/seat |
| Scale | $215/seat | 2,500/seat |

- MeltFlex quotes annual billing at Starter $15, Plus $39, Ultra $99.
- One third-party source says Starter excludes Seedance 2.0. Higgsfield's own Seedance pricing blog prices Seedance Fast/Mini on the $15 plan. **Check at checkout.**
- Credit figures in older tutorials don't match. Herk's April numbers (about 410 credits for 10 s at 720p) are on a different scale or platform, so don't budget from them.

---

## 3. Setting up Higgsfield MCP in Claude Code

**Key finding: Higgsfield's own help center tells Claude Code users to install the CLI, not the MCP.** The MCP URL is official and works with any MCP client, including Claude Code. Several third-party guides and the Arnie936 skill use `claude mcp add`. MeltFlex calls this "the Claude Code trap", but that article is from a competitor and says so.

### Option A — Vendor-recommended for Claude Code: CLI plus skills

From the Higgsfield help center and higgsfield.ai/cli:
```bash
npm i -g @higgsfield/cli
higgsfield auth login           # finish sign-in in the browser window that opens
npx skills add higgsfield-ai/skills
```
- The skills repo's INSTALL.md gives an alternative CLI installer: `curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh`. Read the script before you pipe it to a shell.
- Claude Code plugin route, from the skills README:
  ```
  /plugin marketplace add higgsfield-ai/skills
  /plugin install higgsfield@higgsfield
  ```
- **Verify:** ask Claude "Generate a minimal test image with Higgsfield." It should run `higgsfield generate create z_image --prompt "test" --wait` (INSTALL.md). `higgsfield account status` shows whether the session has expired.
- Useful CLI commands documented in the skill files:
  - `higgsfield model list` and `higgsfield model get <job_type>` show the current schemas.
  - `higgsfield generate create <job_type> … [--start-image path|uuid] [--wait]`, then `higgsfield generate wait|get <job_id>`.
  - `higgsfield website create --type website --subdomain <slug>`, then `higgsfield website deploy <website_id>` and `higgsfield website status`.
- Job types named in the official skill:
  - Images: `gpt_image_2`, `nano_banana_pro`
  - Video: `seedance_2_0`
  - Editing and 3D: `image_background_remover`, `bytedance_image_upscale`, `outpaint`, `multi_image_to_3d`
  - Defaults: `seedance_2_5` for video, `nano_banana_flash`/`gpt_image_2_6` for images. Image-to-video prefers `seedance_2_5 --mode omni_reference --start-image`, with `kling3_0_turbo` as the cheaper option.

### Option B — The remote MCP (what "its own MCP" in the title refers to)

The URL is official (help center). The command syntax is Anthropic's documented form for remote HTTP servers (code.claude.com/docs/en/mcp):
```bash
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
# Project scope, shared via .mcp.json (what the Arnie936 skill does):
claude mcp add --scope project --transport http higgsfield https://mcp.higgsfield.ai/mcp
```
- **Authenticate:** run `/mcp` inside Claude Code, choose Higgsfield and complete the browser OAuth. No API key is needed.
  - MeltFlex: authorization code with PKCE (S256), scopes `openid email offline_access`.
  - Techsy: re-authenticate from `/mcp` when calls start returning "unauthorized".
- **Verify:** `claude mcp list` should show it as connected. Then ask "What is my Higgsfield credit balance?" (the help center's check).
- Ignore variants I couldn't verify, such as an `/sse` endpoint and `npx @higgsfield/mcp-server`.

### Option C — Claude.ai or Claude Desktop connector (help center)

1. Open Settings (or Customize) → Connectors → Add custom connector.
2. Name it `Higgsfield` and enter the URL `https://mcp.higgsfield.ai/mcp`.
3. Click Connect and authorize.

### What the MCP exposes

From the official help center, which does not give tool names:
- Image and video generation (all models)
- Upscaling
- Background removal for images and video
- Expand image (outpaint) and expand video (reframe)
- Kling 3.0 Motion Control
- Soul characters and reference Elements
- Audio: voiceover, voice cloning, voice change, dubbing
- Personal Clipper
- Credit balance, and listing generations and uploads

One third-party guide (techsy.io) lists tool names `generate_image`, `generate_video`, `create_character`, `get_generation_status` and `list_characters`. **These are unverified.** mcp.directory says the names "will evolve." Video calls are asynchronous: a generation returns a job you poll, and techsy says jobs can take 90+ seconds.

### Auth and credits notes

- **An active paid subscription is required.** Per the help center, every generation through a connected agent deducts credits whatever your plan, and unlimited access and free generations don't apply through MCP.
- That conflicts with Higgsfield's "Unlimited MCP" blog: a 24-hour unlimited trial for new users "until July 31" (no year given) that converts to a monthly Plus plan. Treat it as an expired, time-limited promotion.
- **There's no built-in per-session spending cap.** Put a credit budget in your prompts. Never auto-approve generate tools; auto-approve only read tools such as status or balance. The Arnie936 skill makes you approve a shot plan with a credit estimate before anything is generated. Copy that habit.

---

## 4. Seedance 2.0 prompt patterns for website hero videos

### Recommended settings

| Use | Aspect | Resolution | Duration | Mode |
|---|---|---|---|---|
| Background loop hero | 16:9 (optional 9:16 or 4:5 just for mobile) | 1080p final, 720p drafts | 8 s (5–10) | Image-to-video. **Same image as first and last frame** (Herk) |
| Scroll-scrub hero | 16:9 | 1080p | One take, 8–15 s (Higgsfield's default is about 15 s) | Image-to-video. **Start state ≠ end state** |
| Section/support loops | 16:9 or 1:1 | 720p | 5–8 s | Autoplay loops, never scrubbed |
| Drafts | — | 480p/720p, Seedance 2.0 Fast or Mini | 8 s | 8–28 credits |

Spec sources:
- Duration is 4–15 s (Higgsfield's Seedance pricing blog, plus a Scenario/apiyi search summary).
- Aspect ratios: 16:9, 9:16, 4:3, 3:4, 1:1, 21:9.
- First/last frame is supported.
- Maximum resolution differs by source and platform. Higgsfield lists 720p, 1080p and 4K for standard Seedance 2.0.

Always turn audio off: the page plays video, not sound.

### The footage contract

These rules come from Higgsfield's `scroll-scrub.md`, Arnie936's `craft.md` and Motionsites' `assets.md`:
- **One continuous move, no cuts.** Use a slow orbit, push-in, rise or a transformation.
- **One subject, center-safe,** with clean negative space for the headline. `object-fit: cover` crops the edges on phones.
- **Dark or low-detail background** behind any copy. Busy, bright backgrounds are "the single most common reason a beautiful film reads as unusable."
- **Locked exposure and white balance, no flicker, minimal motion blur.** In a scrub, every frame is seen as a still.
- **No text, logos, UI or watermarks** in the footage. Set all type in HTML.
- Lock a style preamble covering palette hexes, light direction and lens, and reuse it verbatim across every prompt for a site.
- **Approve the still before you pay for video.** A still costs about 2 credits; a 1080p clip costs about 96.
- **Content filters:**
  - Novitckii's guide swaps "explosion" for "radial particle scatter, dynamic reveal".
  - Higgsfield's skill reports false NSFW flags on innocent prompts that use words like "intimate", "ambient" or "seamless loop feel". Rewrite the prompt as a plain product film.
- Avoid realistic people's faces (§7). Use hands, silhouettes or empty rooms.

Placeholders below: `[BRAND_HEX]`, `[ACCENT_HEX]`, `[CITY/NEIGHBORHOOD]`.

### Templates

**1. HVAC — "Comfort, delivered" (loop)**
- *Still:* "Cinematic interior photograph of a calm modern suburban living room at blue hour, a slim white wall-mounted ductless air handler high on the right wall, sheer linen curtains beneath it, warm lamp glow balanced against cool window light, palette warm ivory, slate blue [BRAND_HEX], soft brass, subject in the right third, clean negative space on the left half for a headline, 35mm film still, shallow depth of field, no people, no text, no logos, no watermark, 16:9."
- *Motion:* "Single continuous shot, no cuts. Camera locked off on a tripod. The sheer curtains ripple gently in cool airflow from the unit; fine dust motes drift slowly through a beam of window light; lamp light constant. Locked exposure and white balance, no flicker, no camera shake. Calm, half real-time. 8 seconds; last frame matches the first frame. No text, no logos."
- *Scrub variant:* "Macro product film on charcoal seamless: a copper evaporator coil with aluminum fins, centered. One slow continuous push-in along the fins while frost crystallizes across the copper from left to right; warm amber rim light cools to icy [BRAND_HEX] blue. Start: bare warm copper. End: fully frosted, glowing. Constant speed, no cuts, no text."

**2. Roofing — "Built for Baltimore weather" (scrub, exploded view)**
- *Still:* "Architectural cutaway render of a single pitched roof section centered on a dark slate seamless background, soft top light and warm rim light, photoreal materials, negative space above, no text, no labels, no logos, 16:9."
- *Motion:* "Single continuous shot, no cuts. Slow 20° orbit while the roof layers separate vertically in order and float apart with even gaps: plywood decking, ice-and-water shield, synthetic underlayment, drip edge, charcoal architectural shingles, ridge vent. Start: fully assembled section. End: cleanly exploded stack. Constant speed, locked exposure, minimal motion blur, no text, no labels. 12–15 seconds." Put the layer labels in HTML callouts.
- *Loop variant:* "Golden-hour aerial of a two-story brick colonial with a new charcoal shingle roof in a leafy [CITY/NEIGHBORHOOD] suburb, house centered at about 35% of frame, clean sky in the top 40%. Drone hovers almost still; leaves sway; dappled light shifts gently; 8 s; last frame matches first. No people, no vehicles, no signage."

**3. Dental — "Calm, bright, modern" (loop)**
- *Still:* "High-key editorial photograph of a sunlit modern dental treatment room, white ergonomic chair center-right, pale sage [BRAND_HEX] accent wall, potted olive tree, morning sun through sheer blinds, airy negative space on the left half, palette white, sage, light oak, photoreal, shallow depth of field, no people, no text, no logos, no watermark, 16:9."
- *Motion:* "Camera locked off. Soft morning light shimmers slowly across the chair and wall as the blinds sway slightly; olive leaves flutter gently. No cuts, steady exposure, calm. 8 seconds; last frame matches first. No text."
- *Scrub variant:* "Studio macro on pale-mint seamless: a single clear aligner tray, centered, rotating 180° as a soft light sweep crosses it. Start: side view in soft shadow. End: front view, fully lit."
- Don't use an AI-generated "patient smile" (§7).

**4. Barbershop — "The ritual" (loop)**
- *Still:* "Moody low-key photograph of a vintage barber station: folded straight razor, badger shaving brush and a steaming rolled hot towel on a dark walnut counter, warm tungsten rim light from the right, a softly blurred red-white-blue barber pole glow deep in the background, palette near-black, walnut, amber, one deep red accent, objects lower-right third, dark empty space upper-left for a headline, 35mm grain, no people, no text, no logos, 16:9."
- *Motion:* "Camera locked off. Wisps of steam rise slowly from the towel and curl through the rim light; the distant barber pole rotates softly out of focus. No cuts, locked exposure, no flicker. 8 seconds; last frame matches first. No text."

**5. Restaurant — "Signature plate" (loop)**
- *Still:* "Close-up food photograph, 45° angle, of a golden pan-seared lump crab cake on dark stoneware with a lemon wedge and remoulade, a dusting of red seasoning, dark oak table, warm side light, plate in the right third, dark negative space on the left, palette deep brown, gold, lemon, one red-orange accent, photoreal, shallow depth of field, no hands, no text, no logos, 16:9."
  - Don't name trademarked seasonings in the prompt.
  - If the restaurant gives permission, use its real dish photo as the start frame. Arnie936's Restaurant template recommends real menu and food photos as references.
- *Motion:* "Camera locked with imperceptible drift. Fine steam rises and curls away from the crab cake; a candle in the soft background flickers subtly. No cuts, steady exposure, slow. 8 seconds; last frame matches first. No text."

**6. Auto repair — "Precision" (scrub, with a loop variant)**
- *Scrub still:* "Macro product photograph of a drilled brake rotor and red caliper assembly centered on black seamless, single cool rim light, negative space left, photoreal, no brand marks, no text, 16:9."
- *Scrub motion:* "Single continuous shot, no cuts. Slow 180° orbit around the rotor as a rim-light sweep travels across the metal. Start: side profile in shadow. End: three-quarter view, fully lit, every drilled hole crisp. Constant speed, locked exposure, minimal motion blur, no text. 10–15 seconds."
- *Loop variant:* "Clean modern repair bay at night, dark gray sedan on a two-post lift, centered, cool LED strips, polished epoxy floor reflections, palette graphite, steel blue, one safety-orange accent, no people, no badges, no plate text. Camera locked; one soft light sweep glides across the paint left to right, starting and ending off-frame; 8 s; last frame matches first."

**7. Our agency's portfolio hero — "We light up local business" (scroll-scrub)**
- *Storyboard first (Higgsfield's single-shot method, one image):* "A single 16:9 image laid out as a 6-panel grid showing 6 keyframes of ONE continuous camera move (NOT six different scenes): a miniature matte-clay block of six Baltimore rowhouses with white marble front steps on a dark navy plinth, windows gradually lighting up from panel 1 to panel 6. No text anywhere."
- *Still:* the same rowhouse block, dark and unlit at dusk, centered, tilt-shift look, palette navy, clay white, warm amber, one [ACCENT_HEX] glow, negative space above, no text, no signage.
- *Motion:* "Single continuous shot, no cuts. Slow push-in with a gentle 15° orbit; as the camera approaches, the windows light up one by one in warm amber and a soft [ACCENT_HEX] glow spreads from each doorway onto the street. Start: dark, unlit block. End: every window glowing. Constant speed, locked exposure, minimal motion blur, no people, no text, no logos. 15 seconds, 1080p, audio off."
- Each chapter of the portfolio (HVAC, roofing, dental…) can map to a moment of this film.

### Seamless loops

- Generate with the **same image as first and last frame** (Herk).
- Choose motion that loops naturally: steam, fabric, foliage, light shimmer, a rotating barber pole, a light sweep that starts and ends off-frame.
- Avoid camera travel in loops.
- Fix a visible seam in post with a crossfade. This is Motionsites' command for an 8 s clip (output is 7 s):
  ```bash
  ffmpeg -i in.mp4 -filter_complex "[0]split[a][b];[a]trim=1:8,setpts=PTS-STARTPTS[main];[b]trim=0:1,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1:offset=6[v]" -map "[v]" -an loop.mp4
  ```
- Last-resort "boomerang" (the direction reversal is visible):
  ```bash
  ffmpeg -i in.mp4 -filter_complex "[0:v]split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1:a=0[v]" -map "[v]" -an boomerang.mp4
  ```
- Check the seam. The "reverse" trick, which gets the exact final frame, is from Higgsfield's helper:
  ```bash
  ffmpeg -v error -y -ss 0 -i loop.mp4 -frames:v 1 first.png
  ffmpeg -v error -y -i loop.mp4 -vf reverse -frames:v 1 last.png
  ffmpeg -i first.png -i last.png -lavfi ssim -f null -   # "All:" close to 1.0 = invisible seam
  ```

### Web-friendly export

```bash
# 1) Desktop MP4 (H.264, 1080p, 24 fps, no audio, fast start)  [Motionsites recipe]
ffmpeg -i src.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart hero-1080.mp4
# 2) Mobile MP4
ffmpeg -i src.mp4 -an -vf "scale=960:-2,fps=24" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart hero-960.mp4
# 3) WebM (VP9) for smaller files in Chrome, Firefox and Edge
ffmpeg -i src.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 hero-1080.webm
# 4) Poster = first frame of the FINAL encoded clip (Higgsfield's rule: first paint must match playback)
ffmpeg -v error -y -ss 0 -i hero-1080.mp4 -frames:v 1 -c:v libwebp -q:v 80 hero-poster.webp
ffmpeg -v error -y -ss 0 -i hero-1080.mp4 -frames:v 1 -q:v 2 hero-poster.jpg
# 5) Frame sequence for canvas scrubbing
mkdir -p frames/hero frames/hero-m
ffmpeg -i src.mp4 -vf "fps=15,scale=1600:-2" -c:v libwebp -q:v 70 frames/hero/%04d.webp     # 8 s → 120 frames
ffmpeg -i src.mp4 -vf "fps=7.5,scale=800:-2" -c:v libwebp -q:v 65 frames/hero-m/%04d.webp    # 8 s → 60 frames, mobile
#    Higgsfield's JPEG recipe: fps=20,scale=1280:-2 → about 100 frames, about 4 MB for a 5 s clip at q4
ffmpeg -i src.mp4 -vf "fps=20,scale=1280:-2" -q:v 4 frames/hero-jpg/%04d.jpg
# 6) Scrub-optimized MP4 for the video.currentTime method (short GOP = fast seeks)  [Higgsfield helper]
ffmpeg -v error -y -i src.mp4 -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart hero-scrub.mp4
ffmpeg -v error -y -i src.mp4 -an -vf "scale=-2:'min(720,ih)'" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart hero-scrub-mobile.mp4
du -sh frames/* *.mp4 *.webm
```

---

## 5. Front-end implementation patterns

### A. Autoplay, muted, looping hero with poster, reduced-motion support and a pause control

```html
<link rel="preload" as="image" href="/media/hero-poster.webp" fetchpriority="high">

<section class="hero">
  <video class="hero__video" muted playsinline loop preload="none"
         poster="/media/hero-poster.webp" aria-hidden="true" tabindex="-1"
         data-mp4="/media/hero-1080.mp4" data-webm="/media/hero-1080.webm"
         data-mobile="/media/hero-960.mp4"></video>
  <div class="hero__scrim"></div>
  <div class="hero__copy">
    <h1>Same-day AC repair in Windsor Mill</h1>
    <a class="hero__cta" href="tel:+14105550100">Call (410) 555-0100</a>
  </div>
  <button class="hero__toggle" type="button">Pause video</button>
</section>
```
```css
.hero{position:relative;min-height:100svh;display:grid;place-items:center;overflow:hidden;
      background:#111 url(/media/hero-poster.webp) center/cover no-repeat}
.hero__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero__scrim{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgb(0 0 0/.55),transparent 70%)}
.hero__copy,.hero__toggle{position:relative;z-index:1}
@media (prefers-reduced-motion: reduce){.hero__video,.hero__toggle{display:none}}
```
```js
const v = document.querySelector('.hero__video');
const btn = document.querySelector('.hero__toggle');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection && navigator.connection.saveData;
let userPaused = false;
if (!reduce && !saveData) {
  const mobile = matchMedia('(max-width: 768px)').matches;
  v.src = mobile ? v.dataset.mobile
        : (v.canPlayType('video/webm; codecs="vp9"') ? v.dataset.webm : v.dataset.mp4);
  // Pause while off-screen to save battery
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !userPaused) v.play().catch(() => {}); else v.pause();
  }).observe(v);
} else { btn.hidden = true; }
btn.addEventListener('click', () => {
  userPaused = !v.paused;
  if (userPaused) { v.pause(); btn.textContent = 'Play video'; }
  else { v.play().catch(() => {}); btn.textContent = 'Pause video'; }
});
```
- The pause button covers WCAG 2.2.2 "Pause, Stop, Hide" for auto-playing motion longer than 5 s.
- If autoplay is blocked, the poster simply stays.

### B. Scroll-scrubbed canvas frame sequence with GSAP ScrollTrigger and Lenis

This follows the pattern in Arnie936's skill and Higgsfield's `asset-system.md` §7: paint frame 1 immediately, stream the rest, cover-fit the draw, fall back to the nearest loaded frame, and show a static frame under reduced motion. The CDN URLs below were checked and return HTTP 200.

```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.4/dist/lenis.css">
<section class="scrub" aria-label="How we install your new roof">
  <canvas class="scrub__canvas" aria-hidden="true"></canvas>
  <img class="scrub__still" src="/frames/hero/0120.webp" alt="" hidden>
  <!-- chapter copy stays in the DOM as real HTML -->
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.3.4/dist/lenis.min.js"></script>
```
```css
.scrub{position:relative;height:100vh}
.scrub__canvas,.scrub__still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
```
```js
const section = document.querySelector('.scrub');
const canvas  = section.querySelector('.scrub__canvas');
const ctx     = canvas.getContext('2d');
const mobile  = matchMedia('(max-width: 768px)').matches;
const DIR     = mobile ? 'hero-m' : 'hero';
const COUNT   = mobile ? 60 : 120;          // must equal the number of files ffmpeg wrote
const url     = i => `/frames/${DIR}/${String(i + 1).padStart(4, '0')}.webp`;
const imgs = [], state = { frame: 0 };

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  canvas.hidden = true; section.querySelector('.scrub__still').hidden = false;
} else {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();                       // Lenis ↔ GSAP ticker bridge (stops scrub stutter)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const load  = i => { const im = new Image(); im.decoding = 'async'; im.src = url(i); return (imgs[i] = im); };
  const ready = im => im && im.complete && im.naturalWidth > 0;
  const nearest = i => { for (let d = 0; d < COUNT; d++) {
      if (ready(imgs[i - d])) return imgs[i - d]; if (ready(imgs[i + d])) return imgs[i + d]; } };
  function draw() {
    const im = nearest(Math.round(state.frame)); if (!im) return;
    const s = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);   // cover-fit
  }
  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; draw();
  }
  load(0).addEventListener('load', size, { once: true });           // paint frame 1 immediately
  (window.requestIdleCallback || setTimeout)(() => { for (let i = 1; i < COUNT; i++) load(i); });
  addEventListener('resize', size);

  gsap.to(state, {
    frame: COUNT - 1, snap: 'frame', ease: 'none', onUpdate: draw,
    scrollTrigger: { trigger: section, start: 'top top', end: '+=250%', scrub: 0.5, pin: true }
  });
}
```

### B2. Alternative: scrub one MP4 with `video.currentTime`

This is Higgsfield's default "A4" method. It's lighter than hundreds of frame files, but it needs the short-GOP encode from §4 step 6. Higgsfield's rules:
- Fetch the clip to a Blob URL so it stays seekable.
- Coalesce seeks while `video.seeking` is true.
- Prime the video on the first touch for iOS.
- Add `blob:` to the CSP `media-src`.
- Under reduced motion, fetch nothing and show posters.

```js
const v = document.querySelector('#scrubVideo');            // <video muted playsinline preload="auto" poster="...">
fetch('/media/hero-scrub.mp4').then(r => r.blob()).then(b => { v.src = URL.createObjectURL(b); });
addEventListener('touchstart', () => v.play().then(() => v.pause()).catch(() => {}), { once: true });
let target = 0, seeking = false;
const seek = () => { seeking = true; v.currentTime = target; };
v.addEventListener('seeked', () => { seeking = false; if (Math.abs(v.currentTime - target) > 0.04) seek(); });
ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: '+=200%', pin: true, scrub: true,
  onUpdate: s => { if (!v.duration) return; target = s.progress * v.duration; if (!seeking) seek(); } });
```

### Performance budget (proposed for local-business sites)

| Asset | Target | Notes |
|---|---|---|
| Poster (usually the LCP element) | ≤120 KB WebP, 1600–1920 px wide | Preload with `fetchpriority="high"` |
| Desktop loop | 2–5 MB (Motionsites' hard cap is ≤8 MB), 1080p, 8 s, CRF 26–28 | Offer WebM plus MP4 |
| Mobile loop | ≤1.5–2 MB, 720–960 px wide | Skip it entirely under Save-Data |
| Desktop frame sequence | ≤120 frames, about 3–6 MB total | Higgsfield: about 100 JPEG frames ≈ 4 MB, under its 15 MB cap |
| Mobile frame sequence | ≤60 frames at 800 px, ≤2 MB | |
| Full multi-scene "cinema" chain | Higgsfield's budget: ≤32 MiB desktop, ≤16 MiB mobile | Too heavy for a plumber's site. Treat this as a ceiling, not a target |
| Below-the-fold videos | `preload="none"` plus IntersectionObserver | Never scrub more than one clip per page (Arnie936: a second scrub "looks frozen") |

- Keep any single file under 25 MiB, which is Cloudflare Pages' per-asset limit.
- Test with Lighthouse on mobile throttling and aim for LCP under 2.5 s.

---

## 6. Recommended pipeline for our agency

**Default build:** static HTML + CSS + GSAP + Lenis, a **loop hero** for every demo, and a **scroll-scrub hero** saved for the premium tier and our own portfolio site.

Install **one** website skill at a time. Higgsfield's official skill tells the agent that "no other skill … overrides these rules," so stacked skills give the agent conflicting instructions.

| Step | What to do | Tools | Time (estimate) | Cost (estimate) |
|---|---|---|---|---|
| 1. Prospect | List service businesses in 21244 / Baltimore County with strong reviews (e.g. 4.5★ and 50+ reviews) but a weak or no website: not mobile-friendly, slow, no booking, no clear calls to action. Prioritize high-ticket trades (HVAC, roofing, auto repair, dental, med-spa, legal) | Google Maps / Business Profiles, PageSpeed Insights, Wappalyzer, a spreadsheet or CRM | 10–15 min per lead, batched | $0 |
| 2. Brief | Pull public facts (services, service area, hours, phone). Write a thesis line, palette and section plan. Pick a template (Arnie936's has Restaurant/Local, Real Estate, Gym, Automotive) | Claude Code, chosen skill | 20–30 min | Included in the Claude plan |
| 3. Hero media | 2 still candidates, approve one, then one Seedance 2.0 clip (8 s; 720p draft, then 1080p final), budgeting one re-roll. Run the §4 ffmpeg recipes | Higgsfield CLI or MCP, ffmpeg | 30–60 min wall-clock (video jobs run asynchronously) | Lean: about 100–200 credits ≈ $5–10 on Plus ($0.049/credit). Premium scrub (15 s 1080p ≈ 180 credits, extrapolated from 60 credits per 5 s, ×2 tries, plus support loops and images): about 400–600 credits ≈ $20–30 |
| 4. Build and QA | Build the page, check mobile layout, contrast, reduced motion and the file budget | Claude Code plus Playwright MCP | 45–120 min | $0 |
| 5. Preview deploy | Put the demo on an unguessable or labeled subdomain (e.g. `joes-hvac.demo.<agency>.com`). Add a **"Concept demo" banner** and **noindex** (below) | Cloudflare Pages (free, commercial use OK). If you use Higgsfield hosting, **do not** publish to its community feed | 5–10 min | $0 |
| 6. Outreach | 2–3 min Loom walkthrough, short email or in-person visit with a tablet, a clear offer and opt-out | Loom, email | 15–20 min | $0–15/mo |
| 7. Close | Proposal with tiers (loop hero vs. scroll-scrub cinema), contract, deposit invoice | Proposal doc, invoicing | — | — |
| 8. Handoff | Swap AI stand-ins for the client's real photos. Remove the banner and noindex. Connect their domain, wire forms to their email or CRM, add analytics. Link from their Google Business Profile. Accessibility pass. Assign generated assets to the client in the contract | Cloudflare/Vercel account in the **client's** name, or ours under a retainer | 1–3 h | Domain cost; Vercel Pro if hosting commercially on Vercel |

**Totals:**
- About **2.5–4.5 h per lean demo** at first, dropping to about 1.5–2 h once templated. These are my estimates. "Minutes" claims are marketing.
- Higgsfield Plus (1,000 credits) supports about 5–10 lean demos a month; Ultra (3,000 credits) about 15–30.

**Noindex for a demo on Cloudflare Pages.** Put a `_headers` file in the site root, and also add `<meta name="robots" content="noindex,nofollow">`:
```
/*
  X-Robots-Tag: noindex, nofollow
```
Don't rely on `robots.txt` alone: a disallowed URL can still be indexed from links. For more privacy, put Cloudflare Access (password or email gate) in front of the demo.

---

## 7. Risks & gotchas

**Licensing and commercial use**
- Higgsfield's help center (citing ToS §4.4) says Higgsfield does not claim ownership of your inputs or outputs and "does not restrict the use of outputs for commercial purposes," on any plan.
- Watermarks are embedded at generation on some plans; "Paid plans include watermark-free downloads."
- **You are responsible for third-party IP and likeness** (ToS §5.1(ii)(b)). §5.3 bars using an image of another person without permission.
- **IP indemnification is Enterprise-only.**
- A third-party site (Flowith) claims free-plan output is personal-use only. That contradicts the official page, but it's one more reason to generate client work on a paid plan.
- Seedance 2.0 drew IP action within days of its February 2026 release (Wikipedia):
  - The MPA denounced it.
  - Disney sent a cease-and-desist on Feb 13.
  - Paramount alleged infringement on Feb 15.
  - US senators asked ByteDance to shut it down on Mar 16, 2026.
  - So never prompt for characters, celebrities, logos or brand look-alikes.
- **Not verified in this research:** the US Copyright Office's position that purely AI-generated imagery may not be copyrightable. If that holds, clients can't easily stop others copying AI-only assets. Say so in contracts.

**Spec demos that use real business names**
- Label every page: "Concept demo prepared by [Agency] for [Business]. Not the official website of [Business]; not affiliated with or endorsed by them."
- Use noindex. Never buy look-alike domains.
- Don't use their logo or trademark in a way that could pass for their official site.
- Don't reuse their photos without permission.
- **Disable live forms and booking widgets**, or make them open a "this is a demo" modal, so their customers' data never reaches you.
- Don't invent reviews or testimonials. The FTC rule on consumer reviews and testimonials (effective Oct 21, 2024) bans fake and AI-generated reviews, with civil penalties. Use clearly marked placeholders, or quote real Google reviews with attribution only after the client signs.
- Take the demo down when the business asks.

**AI-generated people and likeness**
- Don't generate realistic "staff," "Dr. ___" or "happy customer" faces for a real business. It misleads, and Seedance restricts real-person faces: in February 2026 ByteDance limited real-person generation to identity-verified users (Trivium China, CGTN, Comfy docs via search).
- Use hands, silhouettes, empty rooms and products, then swap in real team photos at handoff.

**Platform and billing**
- Every MCP generation costs credits, and there's no built-in cap. Agent retry loops can drain a balance, so don't auto-approve generate tools.
- Forbes (Feb 2026, via Dealroom) reported billing and refund complaints and moderation problems at Higgsfield. Third-party reports say annual billing can be pre-selected at checkout. Pay monthly, check the plan, and use a card with a limit.
- Many tutorials use referral or affiliate links (Arnie936, Ottley, dev.to), and MeltFlex sells a competing product. Weigh their claims accordingly.
- Higgsfield's CLI and model names change fast: MeltFlex counted 50 CLI releases since May 2026. Run `higgsfield model list` instead of trusting old tutorials.
- `higgsfield website deploy` "ships the live public site immediately; there is no preview stage." The site lives on Higgsfield's infrastructure, and the skill offers to publish to a public community feed. For spec demos of real businesses, use your own hosting.
- Vercel Hobby is reportedly non-commercial only (third-party sources), so use Vercel Pro or Cloudflare Pages for client work. Cloudflare Pages caps each file at 25 MiB.

**Accessibility**
- Auto-playing video over 5 s needs a pause control (WCAG 2.2.2).
- Respect `prefers-reduced-motion`: no video fetch, show a static poster or frame.
- Mark decorative video `aria-hidden`.
- Keep text contrast over video with a scrim or halo. Arnie936 requires a "soft dark halo" behind hero text.
- Keep chapter copy as real HTML in reading order.
- Scroll-jacking and pinning can frustrate keyboard and screen-reader users, so test them.

**File weight**
- Local customers browse on phones over cellular. A 30 MB cinema site hurts load time and conversions.
- Stick to the §5 budget, serve mobile encodes, honor Save-Data, and scrub one clip per page at most.

**Hype check**
- Nothing found confirms that sites built this way sell for $10k to local businesses, or that they're built "in minutes."
- The benchmarks cited ($2.5k–$10k+) are general agency figures from the ZEUS article. Price on the value to the client: booked calls and jobs.

---

## 8. Sources

**Pages fetched**
- https://youtube.com/shorts/-KykjvLOsts (the Short; transcript not accessed, per instructions)
- https://frontiermodels.cc/video/seedance-2-0-claude-code-creates-10k-websites-in-minutes/ (Nate Herk video summary)
- https://www.thefuturist.co/claude-code-higgsfield-insane-10k-websites/ (Liam Ottley video summary)
- https://startup.whatfinger.com/2026/09/25/claude-code-higgsfield-insane-10k-websites/ (Liam Ottley video summary)
- https://en.wikipedia.org/wiki/Seedance_2.0
- https://en.wikipedia.org/wiki/Higgsfield_AI (returned HTTP 404 at research time; company facts taken from TechCrunch instead)
- https://trendshift.io/repositories/321816
- https://github.com/Motionsites-AI/claude-skill
  - https://raw.githubusercontent.com/Motionsites-AI/claude-skill/main/README.md
  - https://raw.githubusercontent.com/Motionsites-AI/claude-skill/main/plugins/motionsites-web-builder/skills/motionsites-web-builder/SKILL.md
  - https://raw.githubusercontent.com/Motionsites-AI/claude-skill/main/plugins/motionsites-web-builder/skills/motionsites-web-builder/references/assets.md
- https://github.com/Arnie936/higgsfield-website-skill
  - https://raw.githubusercontent.com/Arnie936/higgsfield-website-skill/main/higgsfield-website/SKILL.md
  - https://raw.githubusercontent.com/Arnie936/higgsfield-website-skill/main/higgsfield-website/references/craft.md
  - https://raw.githubusercontent.com/Arnie936/higgsfield-website-skill/main/higgsfield-website/references/templates.md
- https://github.com/higgsfield-ai/skills
  - https://raw.githubusercontent.com/higgsfield-ai/skills/main/INSTALL.md
  - https://raw.githubusercontent.com/higgsfield-ai/skills/main/higgsfield-websites/SKILL.md
  - https://raw.githubusercontent.com/higgsfield-ai/skills/main/higgsfield-websites/references/scroll-scrub.md
  - https://raw.githubusercontent.com/higgsfield-ai/skills/main/higgsfield-websites/references/scroll-scrub-asset-video.md
  - https://raw.githubusercontent.com/higgsfield-ai/skills/main/higgsfield-websites/references/website-flow.md
  - https://raw.githubusercontent.com/higgsfield-ai/skills/main/higgsfield-websites/references/asset-system.md
- https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent
- https://higgsfield.ai/cli
- https://higgsfield.ai/mcp?tab=claude
- https://higgsfield.ai/blog/unlimited-mcp
- https://higgsfield.ai/pricing (loads dynamically; no data captured)
- https://higgsfield.ai/blog/higgsfield-pricing-explained
- https://higgsfield.ai/blog/seedance-2-0-pricing-2026
- https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially
- https://code.claude.com/docs/en/mcp
- https://www.meltflexai.com/blog/higgsfield-mcp
- https://techsy.io/en/blog/higgsfield-mcp-claude-code
- https://mcp.directory/blog/higgsfield-mcp-guide
- https://youmind.com/landing/x-viral-articles/motion-website-playbook-higgsfield-claude
- https://openclawdatabase.com/news/videos/2026-04-11-seedance-claude-code-luxury-website-workflow/index.md
- https://www.skool.com/ai-automation-society/new-video-seedance-20-claude-code-creates-10k-websites-in-minutes
- https://novitckii.pages.dev/resources/claude-higgsfield-seedance-2-0-full-setup-guid/
- https://dev.to/gptaiclips/i-shipped-a-10k-3d-scroll-site-in-90-seconds-using-claude-fable-5-higgsfield-mcp-4lej
- https://developereducators.com/channel/edhillai/
- https://edhill.ai/community
- https://techcrunch.com/2026/01/15/ai-video-startup-higgsfield-founded-by-ex-snap-exec-lands-1-3b-valuation
- https://dealroom.co/news/125907-higgsfields-rapid-growth-draws-scrutiny-over-racist-ai-videos-and-billin/
- https://developers.cloudflare.com/pages/platform/limits/

**CDN files checked (HTTP 200)**
- https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js
- https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js
- https://unpkg.com/lenis@1.3.4/dist/lenis.min.js
- https://unpkg.com/lenis@1.3.4/dist/lenis.css

**Seen only in search results (not opened; treat as secondary)**
- https://x.com/higgsfield/status/2049477473843450067 (Higgsfield MCP announcement for Claude)
- Seedance specs:
  - https://help.scenario.com/articles/7140699840-seedance-2-0-the-complete-guide
  - https://docs.apiyi.com/en/api-capabilities/seedance2/overview
  - https://www.segmind.com/seedance2
- Seedance real-face restrictions:
  - https://triviumchina.com/2026/02/10/bytedance-stops-uploads-of-human-photos-for-seedance-2-0/
  - https://news.cgtn.com/news/2026-02-10/AI-models-as-digital-directors-Seedance-2-0-takes-up-the-challenge-1KEtxmEwntu/p.html
  - https://docs.comfy.org/tutorials/partner-nodes/bytedance/seedance-2-0-real-human.md
- Free-plan licensing claim: https://flowith.io/blog/higgsfield-faq-video-length-skin-rendering-commercial-rights
- Higgsfield background:
  - https://www.theregister.com/2026/02/06/higgsfield_ai_job_loss/
  - https://www.mindstudio.ai/blog/higgsfield-subscription-cancellation-complaints
- Vercel Hobby vs. Cloudflare Pages:
  - https://dev.to/libme/vercel-vs-netlify-vs-cloudflare-pages-where-your-side-project-should-actually-live-1j30
  - https://agentdeals.dev/cloudflare-pages-vs-vercel
- FTC reviews rule:
  - https://www.federalregister.gov/documents/2024/08/22/2024-18519/trade-regulation-rule-on-the-use-of-consumer-reviews-and-testimonials
  - https://datamatters.sidley.com/2024/08/30/u-s-ftcs-new-rule-on-fake-and-ai-generated-reviews-and-social-media-bots/
- Referral links seen in sources (not used): https://higgsfield.ai/s/mcp-liamottley-SfAEQx, https://higgsfield.ai/s/mcp-arnold-oberleiter-tNjMkM

**General knowledge, not checked in this session**
- WCAG 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- GSAP being free for commercial use, including plugins, since v3.13 (2025)
- US Copyright Office guidance on AI-generated works
- Claude plan pricing
- CAN-SPAM and TCPA outreach rules
