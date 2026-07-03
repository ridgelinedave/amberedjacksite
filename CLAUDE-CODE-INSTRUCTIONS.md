# Claude Code — Build Instructions: The Ambered Jack Website

**Author:** Ridgeline Marketing (David)
**Goal:** Get The Ambered Jack's website launch-ready. Keep the site we already built (the client prefers it), but pull the quality-of-life *behaviors* from the newer redesign into it, wire the contact form to Netlify, add Google Analytics, and clean up loose ends for launch.

---

## 0. READ THIS FIRST — Golden Rules

1. **The site you edit is the ONLY site you ship.**
   - ✅ **EDIT THIS:** `The Ambered Jack use=this/Website Mockup/`
   - 📖 **REFERENCE ONLY — DO NOT COPY ITS LOOK, DO NOT EDIT, DO NOT SHIP:** `The Ambered Jack re-design 6.21/site/`
   - The 6.21 redesign is **reference only.** We are NOT using its visual design and we are NOT using any of its `rabbit-*.webp` AI placeholder images. Pull *behavior and code patterns* from it (the JavaScript interactions), not its layout or art direction.

2. **Do not introduce any AI-generated "rabbit" imagery or placeholders.** The client disliked them. Every image must come from the real photo set already in `Website Mockup/assets/` (real food and interior photos). If a feature needs an image we don't have, leave a clearly-commented `<!-- TODO(owner): real photo needed -->` placeholder — never an AI image.

3. **Keep the current multi-page structure.** The site is intentionally multi-page: `index.html`, `menu.html`, `catering.html`, `about.html`, `contact.html`, `404.html`. Do not merge it into one long scroll page.

4. **Match the existing code style.** The current site uses plain HTML/CSS/JS, no framework, no build step. Keep it that way. Progressive enhancement — the site must stay fully usable with JavaScript disabled.

5. **Single source of truth for repeated data.** Hours, phone number, and address appear in many places. When you touch them, keep every copy in sync (top bar, mobile strip, contact page, footer, AND the JSON-LD schema). The current `index.html` already documents where hours live — respect that.

6. **Work in small commits and leave the site runnable after each task.** Test by opening the pages in a browser (or `python3 -m http.server` from inside `Website Mockup/`).

---

## 1. Project Map

```
The Ambered Jack use=this/
├── Website Mockup/          ← THE SITE YOU EDIT
│   ├── index.html
│   ├── menu.html
│   ├── catering.html
│   ├── about.html
│   ├── contact.html         ← contact form already wired for Netlify
│   ├── 404.html
│   ├── css/style.css
│   ├── js/script.js         ← currently only handles the contact form
│   ├── assets/              ← REAL photos + favicons (use these only)
│   ├── netlify.toml
│   ├── robots.txt, sitemap.xml, site.webmanifest
│   └── README-DEPLOY.md
└── CLAUDE-CODE-INSTRUCTIONS.md   ← this file

The Ambered Jack re-design 6.21/    ← REFERENCE ONLY (do not ship)
└── site/assets/js/main.js   ← copy the interaction PATTERNS from here
└── site/assets/js/hours.js  ← copy the open/closed status PATTERN from here
```

---

## 2. Tasks (in order)

### TASK A — Quality-of-life features ported from the 6.21 reference

The 6.21 redesign (`re-design 6.21/site/assets/js/main.js` and `hours.js`) has interaction polish our current site lacks. Re-implement these **into our existing markup and CSS** — adapt them to our class names, do not paste blindly. Each must degrade gracefully with JS off.

1. **Sticky header with scroll state.** Add a subtle shadow / background-solidify on the header once the page is scrolled past ~8px. (Pattern: the `is-scrolled` toggle in reference `main.js`.)

2. **Accessible mobile nav drawer (hamburger).** On phones the primary nav (Home / Menu / Catering / About / Contact) should collapse into a hamburger button that opens a drawer. Requirements:
   - Button has `aria-expanded` and `aria-controls` pointing at the nav.
   - Opening locks body scroll; a backdrop click, the Escape key, or tapping any link closes it.
   - Focus moves into the drawer on open and returns to the toggle on close.
   - Resets correctly when resized back up to desktop.
   - (Pattern: the `setNav()` drawer logic in reference `main.js`.)

3. **Live "Open now / Closed" status chip.** Add a small status indicator (header and/or footer) that computes open vs. closed in real time from a single hours array, in the **America/New_York** timezone (robust regardless of the visitor's own timezone). Hours are: **Tue–Sat 11 AM–9 PM; closed Sun & Mon.**
   - Implement hours as ONE source-of-truth array (pattern: reference `hours.js`). That array should drive the displayed hours list, the open/closed chip, AND patch the JSON-LD `openingHoursSpecification` so static markup and runtime stay in sync.
   - Keep a static/`noscript` fallback so crawlers and no-JS visitors still see correct hours.

4. **Scroll-reveal animations.** Gentle fade/rise on sections as they enter the viewport, via `IntersectionObserver`. Must respect `prefers-reduced-motion` (no animation when the user opts out) and must show all content immediately if `IntersectionObserver` is unavailable. (Pattern: the `.reveal` / `.is-in` logic in reference `main.js`.)

5. **Auto-updating footer year.** Replace any hardcoded year in the footer with a script that sets the current year.

> Put this new JavaScript in a new file `js/site.js` (loaded with `defer` on every page) so the existing `js/script.js` stays focused on the contact form. Add any new CSS to `css/style.css` using the site's existing variables and visual language — **do not import the 6.21 stylesheet.**

---

### TASK B — Menu page: sticky "jump to section" category bar

This is the client's specific request: the menu has no way to jump to a section.

On `menu.html`:
- Wrap each menu category (e.g., Pizza, Calzones, Subs, Salads, Wings, Pasta, Desserts — use whatever sections actually exist on the page) in a `<section>` with a unique `id`.
- Add a **sticky horizontal bar of category "chips"** just under the header. Each chip is an anchor link that smooth-scrolls to its section.
- Account for the sticky header height so a section's heading isn't hidden under the bar when you jump to it (use `scroll-margin-top`).
- Highlight the chip for the section currently in view (active state via `IntersectionObserver`).
- Smooth scroll must respect `prefers-reduced-motion`.
- The chip bar must be horizontally scrollable / wrap nicely on mobile and remain fully keyboard-accessible.

---

### TASK C — Make the contact form fully Netlify-ready

The form in `contact.html` is already set up for Netlify Forms (`data-netlify="true"`, honeypot `bot-field`, hidden `form-name`), and `js/script.js` submits via fetch with an inline success state. Finish the job:

1. **Verify the Netlify wiring is correct and complete:**
   - `name="contact"` on the form, matching hidden `<input name="form-name" value="contact">`.
   - `data-netlify="true"` and `data-netlify-honeypot="bot-field"` present; honeypot field visually hidden but in the DOM.
   - The fetch POST encodes `form-name` along with all fields (Netlify requires `form-name` in the body). Confirm `js/script.js` includes it — if not, fix it.
2. **Add a dedicated thank-you page** `thank-you.html` (matching site style) and have the form also work as a normal POST fallback to it if JS is disabled — set the form `action="/thank-you.html"`. With JS on, keep the existing inline success behavior and prevent the redirect.
3. **Add a hidden static copy of the form for Netlify's build-time detection** if the form markup is generated/anything dynamic — for a plain static form this isn't needed, but confirm the form is plain HTML so Netlify detects it on deploy.
4. **Spam protection:** keep the honeypot. Add a `<!-- TODO(owner): optionally enable Netlify reCAPTCHA/hCaptcha in the dashboard -->` note. Do not hard-add a captcha that needs keys.
5. **Leave a clearly-marked note in `contact.html`** documenting the one manual step that must happen in the Netlify dashboard after deploy: **Forms → Notifications → add email notification → send to the owner's email.** (David will supply the owner's Yahoo address and set this up — do NOT hardcode an email into the page.)

Verify by running the form locally: it should validate, show the success state, and not throw console errors.

---

### TASK D — Google Analytics (GA4) tracking

Add Google Analytics 4 to **every** page (`index`, `menu`, `catering`, `about`, `contact`, `404`, `thank-you`).

- Use the standard GA4 `gtag.js` snippet in `<head>`.
- **Use a placeholder Measurement ID** exactly as `G-XXXXXXXXXX` and wrap it with a comment: `<!-- TODO(owner): replace G-XXXXXXXXXX with the real GA4 Measurement ID before launch -->`. David will swap in the real ID.
- Put the snippet in one place conceptually — since there's no build step, add the identical block to each page's `<head>` so it's trivial to find-and-replace the ID across all files. Make sure the ID string is identical in every file so one find/replace updates them all.
- Add a couple of useful event hooks (optional but nice): fire a GA event on **phone-number click** (`tel:` links) and on **contact-form submit success**, since those are the real conversions for a restaurant. Use `gtag('event', ...)`. Guard the calls so they no-op if `gtag` isn't defined.
- Respect Do Not Track is not required, but do not load any analytics beyond GA4.

---

### TASK E — Weekly specials + Facebook

The current specials section on `index.html` is fine as-is structurally. Two changes:

1. **Make it obviously owner-editable.** Keep all the specials in one clearly-commented block so David can paste in the week's lineup quickly. Add a comment banner like `<!-- ===== WEEKLY SPECIALS — edit the items below each week ===== -->` and `<!-- ===== END WEEKLY SPECIALS ===== -->`.
2. **Add the line/CTA:** include the copy **"Check out our Facebook page for regular updates"** as a prominent link/button pointing to `https://www.facebook.com/theamberedjack/` (target `_blank`, `rel="noopener"`). It can sit alongside or replace the existing "See Daily Specials on Facebook" button — keep one clean Facebook CTA, not two competing ones.

Leave the current placeholder specials in place (David will feed real ones weekly).

---

### TASK F — Pre-launch cleanup

1. **Remove the mockup watermark and "MOCKUP" labels.** `index.html` (and possibly other pages) has a `.mockwatermark` element and "MOCKUP" in the `<title>`/markup. Strip all mockup-only artifacts site-wide.
2. **Resolve the `TODO(owner)` placeholders that we can resolve now**, and leave the ones only the owner can answer as clearly-listed TODOs (see Section 4). Specifically:
   - Domain / canonical / `og:url` / `og:image` absolute URLs / sitemap — leave as TODO unless David has confirmed the final domain (`theamberedjack.com` is the assumed default; flag it for confirmation).
   - Google rating value (currently 4.3) — leave as TODO to confirm.
   - Restaurant `geo` latitude/longitude in JSON-LD — leave as TODO.
3. **Run a consistency check:** phone `(828) 536-5273`, address `447 E US Hwy 19E, Burnsville, NC 28714`, and hours `Tue–Sat 11 AM–9 PM, closed Sun & Mon` must match everywhere including JSON-LD.
4. **Accessibility & validation pass:** all images have meaningful `alt`, nav landmarks present, color contrast intact, no broken internal links, no console errors. Validate HTML.
5. **Update `sitemap.xml`** to include `thank-you.html` only if you want it indexed — actually exclude it (add to robots or leave out of sitemap); thank-you pages shouldn't be indexed.

---

### TASK G — Event pop-up (OPTIONAL — build the spec, do NOT enable by default)

David asked whether a site-wide pop-up for special events is possible. **It is.** Build it as a **dormant, ready-to-activate** component — present but OFF, so we can flip it on when there's an event to promote. Do not show it to visitors on this launch.

Requirements when built:
- A single config flag at the top of `js/site.js`, e.g. `const AJ_EVENT = { enabled: false, id: "2026-fall-festival", title: "...", body: "...", ctaText: "...", ctaHref: "...", start: "2026-09-01", end: "2026-09-15" };`
- When `enabled` is true AND today is within `start`–`end`, show a dismissible modal.
- **Show once per visitor** (remember dismissal in `localStorage`, keyed by the event `id`, so changing the `id` re-shows it for a new event). This is a real deployed website, so `localStorage` is fine here.
- Fully accessible: focus trap, Escape to close, backdrop click to close, `aria-modal`, returns focus on close, respects `prefers-reduced-motion`.
- Uses real imagery or text only — no AI placeholder art.

Leave a short comment block explaining how David flips it on: set `enabled: true`, fill in the fields, bump the `id`.

---

## 3. Deploy notes (Netlify)

- The repo already has `netlify.toml`. Confirm the publish directory points at the `Website Mockup` folder (or wherever the static files live) and that no build command is needed (it's static).
- After David connects the site in Netlify and deploys, the contact form will appear under **Forms** automatically because it's a static HTML form with `data-netlify`. The only manual step is the **email notification** (David adds the owner's Yahoo address in the dashboard).
- Do not commit any secrets, IDs, or emails into the codebase.

---

## 4. INPUTS NEEDED FROM OWNER (leave as TODOs, list them in your final summary)

When you finish, print a short checklist of everything still needed before launch:
- [ ] Real **GA4 Measurement ID** (replace `G-XXXXXXXXXX` everywhere)
- [ ] Confirm final **domain** (default assumed: theamberedjack.com) → update canonical/OG/sitemap absolute URLs
- [ ] Owner's **email for Netlify form notifications** (set in Netlify dashboard, not in code)
- [ ] Confirm current **Google rating** (placeholder 4.3)
- [ ] Restaurant **lat/long** for JSON-LD `geo`
- [ ] This week's **specials** content
- [ ] (If/when wanted) event pop-up content + flip `enabled: true`

---

## 5. Definition of Done

- All of Task A–F implemented in `The Ambered Jack use=this/Website Mockup/` only.
- No AI/rabbit imagery anywhere; no 6.21 visual design copied — only its interaction patterns.
- Sticky header, accessible mobile drawer, live open/closed chip, scroll reveal, auto year — all working and degrading gracefully with JS off.
- Menu page has a working sticky jump-to-section chip bar with active highlighting.
- Contact form validated, Netlify-ready, with a thank-you fallback page and a documented dashboard step.
- GA4 snippet on every page with a clearly-marked placeholder ID, plus phone-click and form-success events.
- Specials block clearly editable with a single clean "Check out our Facebook page for regular updates" CTA.
- Mockup watermark/labels removed; consistency + a11y + HTML validation pass clean.
- Event pop-up component present but disabled, with activation instructions.
- Final summary prints the Section 4 owner checklist.
```
