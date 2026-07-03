# Claude Code Prompt: The Ambered Jack Website Fixes

> Paste everything inside the code fence into Claude Code, run from the Ambered Jack project folder
> (where the deployed index.html + /assets live). It consolidates the audit into an actionable task
> list. It builds on the existing CLAUDE-CODE-BRIEF.md in the Website Mockup folder.

---

```
You are turning an existing, well-designed single-file restaurant website into a production-ready,
indexable, multi-page site for The Ambered Jack, a family-run scratch Italian + pizzeria in
Burnsville, NC (Yancey County). The current build is one index.html that shows five sections
(Home, Menu, Catering, About, Contact) via CSS :target tabs, all on one URL, and it still carries
a noindex tag. Keep the look and content. Re-architect, fix SEO/performance/accessibility, and wire
the interactive pieces. The assets (logo, food photos, menu PDF, favicons) are in /assets.

READ FIRST: the current index.html (all of it) and CLAUDE-CODE-BRIEF.md so you preserve the design
system before changing anything.

== HARD RULES (do not violate) ==
1. NO em-dashes anywhere. Use commas, periods, colons, or parentheses.
2. NEVER invent reviews, ratings, names, or quotes. The current reviews and weekly specials are
   placeholders. Either insert real owner-supplied content or leave a clearly-marked
   "TODO(owner):" placeholder. Do not ship fabricated content.
3. Preserve the existing design system exactly: the ink/amber/gold/cream palette and CSS variables,
   the Playfair Display / Inter / Caveat type stack, the inline SVG icons, the mobile quick-action
   bar (Call / Menu / Directions), the mobile hours strip, the specials board, and the menu layout.
   Improve on this base, do not redesign it.
4. Keep it a fast static site. Astro (preferred) or Eleventy or plain multi-page HTML. No SPA
   frameworks, no CMS unless the owner asks to self-edit.
5. For anything needing an owner-supplied asset or fact (real photos, real reviews, real specials,
   confirmed hours, family-name spellings, Instagram handle, domain), insert a working placeholder
   plus a "TODO(owner):" comment describing exactly what is needed.
6. NAP source of truth, must match the Google Business Profile exactly everywhere:
   Name: The Ambered Jack
   Address: 447 E US Hwy 19E, Burnsville, NC 28714
   Phone: (828) 536-5273
   Hours: Tue to Sat 11:00am to 9:00pm; closed Sun and Mon
   Store hours as ONE data object and render it in the header strip, contact page, footer, and schema
   so it can never drift out of sync.

== TASK LIST (in order) ==

[GROUP A: CRITICAL / LAUNCH BLOCKERS]
A1. Remove the `<meta name="robots" content="noindex, nofollow">` tag so the site is indexable.
    Make robots.txt allow crawling and reference the sitemap.
A2. Convert the single :target file into REAL routes with their own URLs and their own <head>:
    / (home), /menu, /catering, /about, /contact. Exactly ONE <main> element per page (the current
    build has five <main> tags, which is invalid HTML). Update the nav, footer, and mobile bar links
    to real hrefs. Preserve all existing content and styling on each page.
A3. Add Restaurant JSON-LD schema to the homepage (none exists today). Include servesCuisine, priceRange,
    telephone, url, menu URL, full PostalAddress, geo coordinates (TODO(owner): confirm exact lat/long
    from the Google listing), openingHoursSpecification from the hours data object, and sameAs with the
    Facebook URL (https://www.facebook.com/theamberedjack/).
A4. Add per-page unique <title> and <meta name="description">, plus Open Graph and Twitter card tags
    on every page, using a strong food photo or the logo as og:image.
A5. Wire the contact form to a no-backend service (Formspree or Netlify Forms). Add a hidden honeypot
    field, required attributes, real label/input associations (for/id), client-side validation, and a
    visible success state. It is currently non-functional.

[GROUP B: PERFORMANCE / IMAGES]
B1. Optimize all images (the biggest performance issue). Several food photos are low-res phone
    thumbnails and pepperoni-pizza.jpg is oversized (1536x2048). Generate responsive sizes, serve webp
    with srcset/sizes, set explicit width and height on every img (prevents layout shift), and lazy-load
    everything below the fold. Target Lighthouse 90+ on mobile and desktop.
    TODO(owner): a fresh set of professional food, interior, and team photos. This converts diners more
    than any code change. Leave the current photos in place until real ones arrive.
B2. Add a real interior or exterior hero option, not only the pizza shot, once better photography exists.

[GROUP C: SEO / LOCAL FOOTPRINT]
C1. Add sitemap.xml (all real routes) and a site.webmanifest referencing the existing favicons.
C2. Keep the Google Map embed and the "Get Directions" link pointing at the named business listing.
    Confirm the call-ahead number and address are identical to GBP.
C3. Add the Instagram link in the footer once the owner confirms a handle (markup is already stubbed
    in a comment). Keep the Facebook link.
C4. Leave an "Online ordering coming soon" slot. TODO(owner): decide on Slice (pizza-focused) or
    Square Online later; do not build a custom cart.

[GROUP D: CONTENT PLACEHOLDERS TO RESOLVE (never fabricate)]
D1. Reviews section: replace the three placeholder quotes/names with real Google review content
    (with permission) or embed a live Google reviews widget. TODO(owner) until provided.
D2. Weekly specials board: replace the placeholder lineup with the kitchen's real weekly specials, or
    wire Meta's free Facebook Page Plugin to mirror their daily posts. TODO(owner) to confirm approach.
D3. Confirm hours and the family-story names/spellings (Bill Riddle, Larry and Phyllis Silvers,
    Laura Boyd, Lily) with the owner before publishing. TODO(owner).

[GROUP E: ACCESSIBILITY / QA]
E1. Fix accessibility: one main per page (from A2), proper form labels, visible focus states, logical
    heading order, and verify the amber (#c5641b) on cream passes AA contrast at the sizes used.
E2. Run Lighthouse (Performance, Accessibility, Best Practices, SEO) on mobile and desktop and W3C
    HTML validation. Report scores before and after, and fix validation errors.

== OUTPUT ==
Work group by group. After each group, summarize what changed and list every TODO(owner) placeholder
you created, so the owner gets one clean punch list of assets and facts to supply. Do not call the job
done while the noindex tag, any fabricated content, or the single-URL structure remains.
```
