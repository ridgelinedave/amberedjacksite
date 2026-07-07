# Project Memory — The Ambered Jack

> Working memory for this project. Read this first in any session. Keep it current.

## Who / What
- **Client:** The Ambered Jack — family-run scratch Italian + pizzeria, Burnsville, NC (Yancey County). Opened April 2024.
- **Agency / me:** David Price · **Ridgeline Marketing** (dprice922@gmail.com). Web + digital management.
- **Engagement:** Custom 6-page website build ($3,500 one-time) + optional monthly management ($500/mo, founding rate $400/mo for first 12 months if started by July 15, 2026). See `The Amber Jack/` proposal + service agreement.

## Business facts (source of truth — keep consistent everywhere)
- **Name:** The Ambered Jack (throwback to the 1960s–70s "Amber Jack")
- **Address:** 447 E US Hwy 19E, Burnsville, NC 28714
- **Phone:** (828) 536-5273
- **Hours:** Tue–Sat 11:00am–9:00pm; closed Sun & Mon
- **Cuisine:** Italian, pizza, subs, salads, wings, scratch desserts; gluten-free options
- **Owners:** Laura Boyd & daughter Lily. Lineage at this location: grandfather Bill Riddle's "Yancey Fish Camp" → parents' "Yancey Fish & Steakhouse" → now "The Ambered Jack"
- **Google rating:** ~4.3 (confirm before launch)
- **Facebook:** facebook.com/theamberedjack (posts daily specials)
- **Domain:** amberedjack.com (confirmed 2026-06-24; used in all absolute URLs)

## Where things live (folder: "The Ambered Jack")
- `Website Mockup/` — **the actual built site.** Real multi-page HTML/CSS/JS. Pages: index, menu, catering, about, contact, 404, preview. `css/style.css`, `js/script.js`, `assets/` (logos, favicons, food photos, menu PDF).
- `Website Mockup/CLAUDE-CODE-BRIEF.md` — original build brief + audit checklist.
- `Food Pictures/` — source food/interior photos (mostly low-res phone shots).
- `Logo/` — Ambered Jack logo.
- `Menu/` — official menu PDF (8-8-2024).
- `website-deploys/` — zipped deploy snapshots.
- `The Amber Jack/` — Ridgeline proposal (PDF) + service agreement (DOCX).
- `Build-Deploy-Zip.ps1`, `MAKE WEBSITE ZIP.cmd` — packaging scripts.

## Site status (launch-prep pass done 2026-06-24)
Build quality is strong: per-page routes, Restaurant JSON-LD schema, OG/Twitter tags, mobile quick-action bar, a11y skip-links, lazy/responsive images, brand palette (ink #1b1511, amber #c5641b, cream #f5efe3).

**Launch-prep work completed (per CLAUDE-CODE-INSTRUCTIONS.md, Tasks A–G):** all in `Website Mockup/`.
- New `js/site.js` (defer, every page): sticky-header `is-scrolled` state; accessible mobile nav drawer (hamburger ≤900px, focus trap, Esc/backdrop/link close, focus returns to toggle); live Open/Closed status chip + hours SINGLE SOURCE OF TRUTH (`AJ_HOURS`, America/New_York) that also patches the JSON-LD `openingHoursSpecification`; scroll-reveal (`.reveal`, gated by `html.js` + `prefers-reduced-motion`, JS-off safe); auto footer year (`#yr`); GA phone-click event; DORMANT event pop-up (`AJ_EVENT.enabled=false`).
- `js/script.js` still owns the contact form; now fires GA `contact_form_submit`.
- Menu: categories are `<section id>`s + sticky jump-to chip bar (`.menu-chipbar`) with active highlight + smooth scroll (reduced-motion aware) + `scroll-margin-top`.
- Contact: form `action="/thank-you.html"` (no-JS fallback) + new `thank-you.html` (noindex, not in sitemap); JS keeps inline success. Netlify email-notification + optional captcha left as owner TODOs in-page.
- GA4 `gtag.js` on every page with placeholder `G-XXXXXXXXXX` (identical string everywhere for one find/replace).
- Specials: owner-editable banner comments + single Facebook CTA "Check out our Facebook page for regular updates".
- Cleanup: removed `.mockwatermark` divs + CSS site-wide (NOTE: standalone `preview.html` dev artifact still has it — not a shipped page).
- Verified live via preview server (eval-based; screenshot flaky): status chip, schema patch, drawer a11y, menu chips, form validation+success, GA events, no console errors.

**Content added 2026-06-24 (second pass):**
- Google rating updated **4.3 → 4.4** everywhere (owner-confirmed).
- Real **weekly specials** transcribed from owner's photos into a restructured **day-block** layout (one `.day-block` per day, masonry via CSS columns; items in course order appetizer→entrée→dessert; `.sp-cat` course labels; `.day-head`/`.sp-line`/`.sp-item`/`.sp-price`/`.sp-note`/`.kids-free` classes). Lineup: **Tue** Chicken Salad Sub $11.99 / BBQ Chicken Sub $9.99; **Wed** apps Fried Squash $3.99 + Potato Cakes $3.99, entrées Lasagna $16.99 [standing] + Homemade Chicken Salad $11.99 + Large 2-Topping Pizza w/ 12 wings or 2 salads $25.99, + "Kids eat free EVERY Wednesday 4pm" callout in the Wed block; **Thu** Home Cooking (rotates); **Fri** Ribeye/Shrimp/Crab Oscar $26.99 or Pan-Seared Salmon $19.99 (pick 2 sides); **Sat** Boyd's Seafood Platter $20.99. Owner rule: keep each day in ONE block; never split a day.
- Real **5-star Google reviews** swapped into homepage reviews section (Geoff W., Madison O., Abbe M.) + "Read more on Google" link; placeholder names removed.
- **Owner photo** (Laura + husband at fireplace holding original Amber Jack newspaper article) optimized to `assets/owners-amberjack.webp` (1000×1333) and placed on **About** page as `.owner-figure` after the lede. Source files in `Weekly specials + cool photo/`. Could also feature on homepage story teaser if wanted.
- Deleted leftover `preview.html` (last file carrying the MOCKUP watermark).
- **Owner contact captured from her note (NOT on site):** email `lauraboyd906@yahoo.com`, cell `828-208-1541` — use the email for the Netlify form notification setup.

**Menu pricing corrected from owner's CURRENT menu (2026-06-26):** the old PDF (`Menu/The Ambered Jack Menu OLD.pdf`, also `assets/ambered-jack-menu.pdf`) had outdated prices. Source of truth is now `Menu/menu - current.jpeg` + `menu page 2 - current.jpeg` (photographed sideways; rotate 90° CW to read). Updated `Website Mockup/menu.html` AND the homepage `index.html` featured-dishes prices (one source each — responsive CSS serves both mobile + desktop, no separate mobile menu). Changes: **Specialty pizzas all $18.99/$19.99 → $20.99** (Buffalo, Philly Cheese Steak, White Chicken, Hawaiian, The Jack, Mediterranean). **Calzone** restructured: now 3 sizes — Personal $10.99 (NEW) / Small $11.99→$12.99 / Large $16.99→$18.99. **Appetizers:** Spinach Dip $7.99→$9.99, Mega Mozzarella Logs $7.99→$8.99, Wings Bone-In $8.99/$14.99→$9.99/$15.99, Wings Boneless $5.99/$8.99 (Sm5/Lg10)→$6.99/$10.99 (Sm6/Lg12); added **Stinging Honey Garlic** sauce. **Subs:** dropped the single flat price; each sub now per-item 6"/12" (Meatball 11.99/16.99, Cheeseburger Sub 12.99/17.99, Philly Cheesesteak 13.99/18.99, Turkey 10.99/15.99) + Chicken Fillet Sandwich $10.99 and Cheeseburger $12.99 (single). **Pasta** now Small/Large $10.99/$14.99 (was flat $13.99); add-ons grilled chicken $3.99 / shrimp $5.99 / meatballs $3.99; large includes small salad. **Salads** add-on $2.99 → chicken +$3.99 / shrimp +$5.99. **Little Bunnies** $8.99→$9.99 + "adult Chicken Tenders $10.99". **Desserts:** Cake $5.49→$5.99, Pie $4.99→$5.99, Cookies $1.99→$3.99. **NEW item added: Personal Pizza $10.99** (#pizza). Pizza base sizes + toppings list were already correct. **PDF download button removed** (owner request); `ambered-jack-menu.pdf` kept in assets/ for reference but now **excluded from the deploy zip** (stale prices) via `$excludeNames` in `Build-Deploy-Zip.ps1` — re-link + un-exclude once a corrected PDF exists. Full Playwright suite green (72) after; deploy `AmberedJack-website_2026-06-26_1120.zip`.

**Full weekly specials rewrite (2026-07-07):** homepage `#specials` board rebuilt from the owner's Facebook message (forwarded via Randi → David) — the authoritative weekly board. New lineup: **Tue** Shrimp Fettuccine Alfredo, side salad + garlic bread, $15.99 supper / $12.99 lunch; **Wed** Lasagna $15.99 all day, side salad + garlic bread (kept the standing "Kids eat free every Wednesday 4pm" callout — owner's msg didn't restate it but it's a permanent promo); **Thu** Salisbury Steak & Gravy $15.99 all day, mashed potatoes + corn on the cob + roll; **Fri** lunch Philly Cheesesteak Bowl $10.99 + Small One-Topping Pizza $9.99, from 4pm New York Strip (baked potato/side salad/roll, **no price yet** — owner hasn't set it, shown as "ask your server"); **Sat** Boyd's Seafood Platter $20.99 all day (pick 3, choice of potato/hushpuppies/slaw). Two items flagged to David for confirmation: Tue lunch $12.99 (from whiteboard, not the text) and Fri NY-strip price. Removed prior week's items (BBQ Sirloin Tipper, Wed apps/chicken salad, Thu BBQ Chicken Plate, Fri BLT Sub + Hamburger Steak). Also earlier this session: removed the leftover Google-rating `TODO(owner)` HTML comment on index.html (4.4 already confirmed & rendered).

**Test harness + mobile-nav bug fix (2026-06-24):**
- **Playwright suite added** in `Website Mockup/` (`package.json`, `playwright.config.js`, `tests/`, `TESTING.md`). `npm test` runs 38 tests across desktop + 2 mobile device projects (a keep-alive Node static server in `tools/static-server.js`). Pre-push guard: `prepush` npm script + `tools/git-hooks/pre-push` (enable with `npm run install:hook` once the folder is a git repo). Deploy zip + `.gitignore` updated to exclude `node_modules/tests/tools/package.json/...` from production.
- **Real mobile-nav bugs found by the suite and fixed (CSS only):** (1) drawer links untappable because `.drawer-backdrop` (z110, header sibling) covered the drawer trapped in `header.nav`'s sticky `z-index:50` stacking context → `header.nav{z-index:120}`. (2) off-screen drawer caused horizontal scroll → `html{overflow-x:clip}`. (3) **drawer rendered off the LEFT edge on mobile** because `header.nav`'s `backdrop-filter:blur(8px)` made the header a containing block for the nested fixed drawer → removed the filter (header bg is 97% opaque, blur invisible). Plus reduced-motion drawer handling + `/* END OF STYLESHEET */` sentinel. Suite now runs on Chromium (iPhone+Pixel) AND **WebKit/Safari** (`mobile-safari` project) — the backdrop-filter bug only showed under real mobile emulation. See `TESTING.md` Pitfalls #11–#14. **Lesson: a fixed overlay must not be nested in an ancestor with transform/filter/backdrop-filter; test the OPEN drawer's on-screen position, on WebKit too.**

**Still open before launch (owner inputs — NOT code):**
- Real **GA4 Measurement ID** (replace `G-XXXXXXXXXX` everywhere).
- ~~Confirm domain~~ DONE: **amberedjack.com** (owner-confirmed 2026-06-24; all absolute URLs in canonical/OG/twitter/JSON-LD/sitemap/robots updated from the old theamberedjack.com assumption).
- Set **Netlify form-notification email** to `lauraboyd906@yahoo.com` in the dashboard (not in code).
- ~~JSON-LD geo lat/lng~~ DONE: `35.9186014, -82.2734526` (owner-provided 2026-06-24).
- Replace low-res phone food photos with high-res photography (biggest lever).
- Register domain; deploy to Netlify (publish dir = `Website Mockup`, static, no build); connect Google Business Profile. Online ordering still "call ahead" (add Slice/Square later).

## Benchmark / competitor
- **Rigo's Pizzeria (Cary, NC)** — rigospizzeriacary.com. David admires it as "clean and professional." Key finding: it's a **SpotHopper** template (restaurant SaaS) + done-for-you photography, video, social & email service. Its polish = pro photography + video hero + fresh dynamic content + third-party ordering (SkyTab/Slice/ChowNow), NOT superior hand-coding. The Ambered Jack's custom site can match/beat it visually; the real gap is photography, content freshness, and ordering/marketing integrations — not code.

---

## Deployment — git → GitHub → Cloudflare Pages (current, 2026-07-03)

> This section supersedes the older Netlify / "Website Mockup/" references above.
> The live site now lives in **`site/`** and deploys automatically from git.

- **GitHub repo (private):** https://github.com/ridgelinedave/amberedjacksite
- **Host:** Cloudflare Pages project `amberedjacksite`, git-connected. **Production branch `main` — every push to `main` auto-publishes the live site** in ~1 min (no more manual zip upload).
- **Cloudflare build settings:** Build command = **(blank)**; **Build output directory = `site`**. Pure static, no build step.
- **Live:** https://www.amberedjack.com (canonical host = **www**; apex 301→www via the Cloudflare zone Redirect Rule). URLs are clean/extensionless.
- **The served folder is website-only (hard rule).** Cloudflare serves the entire `site/` folder as-is, so nothing but website files may live in it. The Playwright test harness + internal docs physically inside `site/` (`tests/`, `tools/`, `package.json`, `netlify.toml`, `README-DEPLOY.md`, `CLAUDE-CODE-BRIEF.md`, `TESTING.md`) are **gitignored in place** — they stay local for testing but are excluded from the repo/deploy. So the **test suite is local-only, not on GitHub** (by choice; it's in the backup zips).
- **`.gitignore`** also excludes the private `assets/` + `retainer/`, the `website-deploys/` backup zips, and `node_modules/`.
- **Headers:** `site/_headers` (Cloudflare-native security headers; **no CSP** on this site, so the Web3Forms POST isn't restricted). **Redirects:** apex→www is a **zone Redirect Rule**, NOT `_redirects` (Cloudflare Pages `_redirects` matches path only, not hostname).
- **Forms:** Web3Forms. The `access_key` in `site/contact.html` + `site/js/script.js` is a **public routing token, not a secret** — do not scrub it.
- **Deploy zips in `website-deploys/` are frozen backups — never delete** (rollback is now Cloudflare → Deployments → "Rollback to this deployment").
- **To make a change:** edit files in `site/`, commit, push to `main` → live in ~1 min. Risky change → do it on a branch (Cloudflare gives a preview URL) → merge to `main` once confirmed.
