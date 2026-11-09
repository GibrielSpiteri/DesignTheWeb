# Demo-first sales playbook

The model: **find a local business that's losing web leads → build them a real demo site → show them → close.**
The demo does the selling. Everything below is about picking the right businesses, building fast, and reaching out the right way.

---

## 1. The pipeline at a glance

| # | Stage | Output | Target time |
|---|---|---|---|
| 1 | Prospect | Lead in `leads/leads.csv` with score ≥ 70 | 15 min / lead |
| 2 | Qualify | Confirm operating, independent, weak web presence, reachable owner | 10 min |
| 3 | Build demo | Self-contained site in `demos/<slug>/`, QA passing | 2–4 hrs with Claude Code |
| 4 | Hero media | Seedance 2.0 hero video via Higgsfield MCP (optional, about $1–3 in credits) | 30 min |
| 5 | Preview deploy | Unlisted URL (e.g. `<slug>.preview.yourdomain.com` or a Netlify/Vercel preview), `noindex` | 5 min |
| 6 | Outreach | Walk-in / call / email with the link | Day 0 |
| 7 | Follow-up | 3 more touches | Days 2, 5, 12 |
| 8 | Walkthrough | 15-min screen share or in person; collect real photos, logo, hours, reviews | Week 1 |
| 9 | Close | Signed one-page agreement + 50% deposit | Week 1–2 |
| 10 | Launch | Real domain, Google Business Profile link, analytics, form → owner's phone/email | Within 14 days |
| 11 | Retain | Monthly care plan; ask for a review and a referral at day 30 | Ongoing |

Weekly rhythm while you're starting out: **prospect 20 → qualify 10 → build 3–5 demos → contact all of them.**

---

## 2. Who to target (scoring)

Run `leads/leads.csv` with the rubric below. Build demos only for scores ≥ 70.

- **Value of one web lead (0–30).** One HVAC install, roof, implant case or personal-injury client is worth thousands. One haircut isn't, but a barbershop with online booking gets dozens of bookings a week. Both can work. Price accordingly.
- **Web-presence gap (0–30).** No site or Facebook-only is the best case. A site that isn't mobile-friendly, has no SSL, or has no quote/booking form is next.
- **Active & reachable (0–20).** Recent reviews, a working phone, a storefront you can walk into.
- **Search demand (0–20).** Their customers Google "near me" for this service.

Best signal of all: **lots of great reviews, no real website.** That business already makes customers happy and is invisible online.

Skip: chains and franchises (corporate controls the site), anyone with a strong modern site, businesses in active turmoil (closing, moving).

---

## 3. Building the demo (what "good" looks like)

Every demo in `demos/` follows the same rules:

1. **Real facts only.** Use the business's real name, phone, address, services and hours from public listings. Never invent testimonials, awards, license numbers, guarantees, "years in business" or prices they didn't publish. Where content is needed, use clearly marked placeholders ("Your Google reviews will appear here").
2. **Labeled as a concept.** A visible ribbon: *"Concept preview designed for {Business} by Design The Web. Not the official website."* Add `noindex, nofollow` and keep demos out of the public portfolio and the sitemap.
3. **One killer conversion feature** chosen for the vertical:
   - Trades: instant quote / estimate flow + emergency click-to-call bar + service-area list
   - Clinics: request-an-appointment flow + new-patient info
   - Restaurants/caterers: menu + order/catering inquiry
   - Barbers/salons: service → time → book flow
   - Auto: quote request by year/make/model + service checklist
   - Law/tax/insurance: free-consultation intake with practice-area routing
4. **Mobile first.** Owners will open your link on their phone, usually in a truck or between customers. The first screen on a phone has to be impressive.
5. **Fast.** No heavy frameworks. Hero video ≤ 4 MB with a poster image. Run `node tools/qa.mjs demos/<slug>` and fix every error.
6. **Hero media.** Generate a cinematic hero clip with Seedance 2.0 through the Higgsfield MCP (prompts in each demo's `HIGGSFIELD_PROMPTS.md`). Until then, the animated fallback hero ships.

---

## 4. Outreach scripts

> Personalize every message with **one specific, true observation** about their business (from the lead's `outreach_angle`). Never fake familiarity.

### Walk-in (best for storefronts in 21244: barbers, salons, restaurants, auto shops)
> "Hi, I'm ___. I run a small web design studio here in Windsor Mill. I noticed people searching for [service] near here can't [book / get a quote / see your menu] online for [Business], so I built you a sample of what your website could look like. Mind if I show you on my phone? It takes 60 seconds."

Show the demo on your phone. Let them scroll. Stop talking. Then:
> "If you like it, I can make it yours with your real photos and launch it in about two weeks. If not, no hard feelings. I'll leave you my card with the link."

### Phone (trades, service-area businesses)
> "Hi, is this the owner? My name's ___, I'm a local web designer in Windsor Mill. Quick reason for the call: I built a free sample website for [Business] because I noticed [specific gap: e.g. 'your Google listing has 120 great reviews but no website, so people searching "AC repair near me" can't request a quote']. Can I text or email you the link so you can look when you have a minute?"

Only text them if they say yes on the call (see compliance below).

### Email
**Subject:** I built a sample website for [Business]

> Hi [Name, or "there"],
>
> I'm ___, a web designer based in Windsor Mill. I noticed [one specific, true observation]. So I went ahead and built a sample of what a new website for [Business] could look like:
>
> **[demo link]**
>
> It's mobile-friendly, loads fast, and has [the conversion feature: e.g. "a quote form that texts you the job details instantly"]. Everything is editable, so we'd swap in your real photos, logo and reviews.
>
> If you like it, I can launch it in about two weeks. If not, no worries, and I'll take it down.
>
> [Your name] · Design The Web · [phone] · [physical mailing address]
> *Not interested? Reply "no thanks" and I won't email again.*

### Follow-up cadence
- **Day 2:** "Did you get a chance to look? Here's the link again: …"
- **Day 5:** Share one improvement you made using their real info (hours, a service you missed).
- **Day 12:** Last touch: "I'll take the preview down Friday unless you'd like to keep it."

Then stop. Take the preview down when you said you would.

### Objections
| They say | You say |
|---|---|
| "All my work is word of mouth." | "That's the best kind. Those referrals still Google you before they call, and right now they find [what they find]. This makes the referral stick." |
| "I have a Facebook page." | "Keep it! Facebook is where your regulars are. Google is where new customers are, and it ranks real websites. This links the two." |
| "My nephew built my site." | "Love that. This just shows what's possible now, like instant quotes and booking. Happy to work with him or hand him the files." |
| "How much?" | Quote from the packages below. Lead with the outcome: "One extra [job] a month pays for it." |
| "I'm too busy." | "That's exactly why it's already built. I just need 15 minutes to swap in your photos." |

---

## 5. Packages (starting points; edit in `site/assets/js/site-config.js`)

| Package | Starting at | What's in it |
|---|---|---|
| **Starter** | $1,800 | Up to 5 pages, mobile-first, contact/quote form, click-to-call, Google Business Profile tune-up, basic local SEO |
| **Growth** | $3,800 | Up to 10 pages, instant-quote or booking flow, service-area pages, reviews feed, analytics dashboard |
| **Signature** | from $7,500 | Custom cinematic design, AI hero video (Seedance 2.0), advanced animations, copywriting, photo shoot coordination |
| **Care plan** | $99–$249 / mo | Hosting, SSL, backups, updates, monthly edits, uptime monitoring, quarterly SEO check |

Ask for a 50% deposit to start and 50% at launch. Care plans are monthly with no contract.

---

## 6. Compliance & ethics (read this before you reach out)

*Not legal advice. Have a Maryland attorney review your agreement and outreach process.*

- **Spec demos:** Label every demo as a concept, add `noindex`, and don't put it in your public portfolio until they're a client. Don't use their logo or photos without permission. Build a clean wordmark instead. Take it down promptly if they ask.
- **Domains:** **Never register a domain with their business name** as leverage. That can be cybersquatting. Host previews on *your* domain or a neutral preview URL.
- **Cold email (CAN-SPAM):** Use an honest subject line, your real identity, a physical mailing address, and a working opt-out that you honor within 10 business days.
- **Calls and texts (TCPA and Maryland law):** Call business numbers manually. Don't autodial or send marketing texts to cell numbers without prior consent. Don't send "texted" outreach unless they've said yes. Check whether the number is on the Do-Not-Call registry before calling. Maryland's *Stop the Spam Calls Act* (2023) adds state rules: confirm with counsel how it applies to B2B calls.
- **Reviews and claims:** Never write fake reviews or testimonials, on demos or on our own site. Use real reviews only with the business's permission once they're a client.
- **AI media:** Check Higgsfield's current commercial-use terms for your plan. Don't generate realistic depictions of real, identifiable people (the owner, staff) without their consent.
- **Accessibility:** Build to WCAG 2.1 AA. ADA website suits hit small businesses too, and accessible builds are a selling point.

---

## 7. Scoreboard (track weekly)

`leads prospected → demos built → contacted → replied → walkthroughs → closed → care-plan MRR`

Starting benchmarks to beat: 30–40% of walk-ins agree to look at the demo, 10–20% of demos get a walkthrough, and 25–50% of walkthroughs close.
These benchmarks are conservative assumptions, not data. Replace them with your own numbers after the first 20 demos.
