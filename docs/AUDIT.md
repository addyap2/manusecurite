# Creative audit: Cabinet Thorelle Conseils

**Date:** 3 November 2026 · **Scope:** every page of manusecurite.vercel.app, desktop (1440×900) and mobile (375×812), plus `styles.css` and `script.js`.

## Verdict

The concept is strong and distinctive: a night watch, a lighthouse that reveals risks, dawn at contact. Very few security firms look like this. What holds it back from "elite" is not a lack of effects but **small inconsistencies that break the spell**. The story's clock contradicts the chapter hours, the heraldic font is used for everything, there are too many small labels competing in the first screen, and there are three slightly different golds. Premium is mostly **discipline**: fewer voices, one rule applied everywhere.

---

## Ranked findings

Impact: how much a visitor would feel the difference. Effort: S < 1h, M = a few hours, L = needs outside input.

| # | Finding | Area | Impact | Effort | Priority | Status |
|---|---|---|---|---|---|---|
| 1 | The watch clock contradicts the story: chapter II is stamped **01:00** but the clock reads ~23:46 when you get there | Storytelling | High | S | P1 | ✅ Fixed |
| 2 | **Cinzel (heraldic caps) used 33 times**: labels, buttons, breadcrumbs, form labels, meta, footer, hint. The "voice of the crest" becomes noise, and it is unreadable at 10–11px | Typography | High | M | P1 | ✅ Fixed |
| 3 | **Text as small as 10.2px** (`.64rem`) with 0.3em tracking: hint, reassurance, labels | Typography, accessibility | High | S | P1 | ✅ Fixed |
| 4 | **Hero clutter**: 11 competing elements in the first screen (clock, header CTA, label, headline, sub, CTA, phone, reassurance, quick links, scroll cue, hint), and the header "Entretien" duplicates the main CTA | Hierarchy | High | S | P1 | ✅ Fixed |
| 5 | **"Entretien" is ambiguous** in French (interview? servicing?) and differs from the main CTA "Réserver un premier échange" | Copy, consistency | Medium | S | P1 | ✅ Fixed: "Premier échange" |
| 6 | **Three different golds** for fills (CTA, submit button, gradient text), and the dawn gradient defined three times | Colour | Medium | S | P2 | ✅ Fixed: tokens |
| 7 | **Numbering systems mixed**: Roman chapters, Arabic 01–06 items, lowercase Roman session steps, *upper* Roman process steps; ✦ used for both the Journal and Dawn chapters | Consistency | Medium | S | P2 | ✅ Fixed (rule below) |
| 8 | **Every inner page has the identical hero** (same beam, same angle, same lamp position): the template shows | Composition | Medium | S | P2 | ✅ Fixed: beam per page |
| 9 | Hovering a service row animates `padding-left`, which breaks the site's own "transform and opacity only" motion rule and shifts text | Motion | Low | S | P2 | ✅ Fixed |
| 10 | Hard edge between the warm closing block and the flat footer on inner pages | Depth, colour | Medium | S | P2 | ✅ Fixed: horizon line |
| 11 | Film grain blends over everything, including on phones, where a full-screen animated blend layer costs battery | Performance | Low | S | P2 | ✅ Fixed: lighter, still on touch |
| 12 | **Link previews use a 484px crest** on a transparent background: sharing on WhatsApp or LinkedIn looks unfinished | Polish | High | S | P1 | ✅ Fixed: 1200×630 card |
| 13 | Once "seen", the risk words stay at 20% with a gold ✦; after a minute the sky becomes busy | Hero | Low | S | P3 | ✅ Fixed: 12% |
| 14 | **The crest is a cut-out from a 600px photo of a business card**: slight halo and soft edges, no vector | Identity | High | L | P1 | ⏳ Needs the original vector file from whoever designed the card |
| 15 | **No photography at all.** A security consultancy is a relationship of trust, and a face matters | Imagery | High | L | P1 | ⏳ Portrait of Emmanuel (see the brief below) |
| 16 | The legal notice shows "à compléter" in orange on the live site | Finish | High | L | P1 | ⏳ Needs SIRET, address, legal form, CNAPS |
| 17 | Fonts load from Google: brief flash of fallback text on large titles, and a GDPR grey area in the EU | Performance, legal | Medium | M | P2 | Recommended: self-host the 3 fonts as WOFF2 |
| 18 | The contact form opens the visitor's mail app: on a phone without mail set up, nothing happens | Conversion | Medium | M | P2 | Recommended: a form service (Formspree, Netlify Forms) |
| 19 | The home "Deux terrains" lists repeat the service pages word for word | Content | Low | S | P3 | Recommended: keep 3 headline items on home and link to the page |
| 20 | Header, menu and footer are copied into 12 HTML files | Maintainability | Low | M | P3 | Recommended: a small template build if pages keep growing |

---

## What changed, and why

### 1. A clock that tells the truth (storytelling)
**Before:** the clock ran linearly from 21:47 to 06:12 across the page height, while each chapter showed its own hour. Long chapters (the values litany) dragged the clock out of sync.
**Now:** the clock interpolates **between the chapter stamps themselves**. When a chapter's heading crosses the middle of the screen, the clock reads that chapter's hour, and moves smoothly to the next. The prologue starts at 21:47, and dawn arrives exactly at 06:12. On inner pages the clock still advances with reading.
**Why:** the clock is the spine of the narrative. If it lies, the concept becomes decoration.

### 2. Three voices, each in its place (typography)
| Voice | Font | Now used only for |
|---|---|---|
| Heraldic | Cinzel caps | Chapter labels and numerals, the clock, the brand name, the small label above the headline |
| Engraved | Cormorant | Headlines, quotes, lists of things that matter (services, values, steps), phone number |
| Clear | Hanken Grotesk | Everything functional: **buttons, breadcrumbs, form labels, article meta, footer titles, hints**, in sentence case at 13–15px |

Minimum text size is now **12px** (was 10.2px); functional labels are sentence case with light tracking instead of 0.3em capitals.
**Why:** luxury typography is restraint. A heraldic voice is powerful precisely because it is rare.

### 3. A quieter first screen (hierarchy)
- The header button is **hidden on the home page while the main CTA is visible**, and fades in once you scroll past it: one call to action at a time.
- The "Échange confidentiel" line is merged into the phone line ("ou appeler le 06… · confidentiel").
- The scroll cue loses its text: only the falling line remains.
- Result: 8 elements instead of 11, with a single obvious next step.

### 4. One gold, one dawn (colour)
New tokens: `--gold-fill` (buttons), `--gold-text` (gold italic), `--dawn-text` and `--dawn-glow` (dawn only). Every fill and gradient now uses them.

### 5. A numbering rule (consistency)
| Kind | Style | Example |
|---|---|---|
| Chapters (structure) | Roman capitals, Cinzel | I · II · III · IV · V |
| Moments in time (session steps, process) | Lowercase Roman, Cormorant italic | *i · ii · iii · iv* |
| Items in a list | Arabic, two digits | 01 … 06 |
| Dawn and contact only | ✦ | L'aube, Contact |

The Journal teaser on the home page becomes **chapter V (05:40)**, and the chapter rail now lists it.

### 6. Each inner page has its own light (composition)
The beam on inner pages now has a different angle and origin per page (companies, private clients, firm, journal, questions, contact, articles), so the pages feel related, not templated. Same light, different hour.

### 7. Smaller finishes
- Service rows: hover is now a gold line and a gold number only, with no text shift.
- Footer: a warm horizon hairline, like the one at dawn on the home page, joins the closing block to the footer.
- Grain: 5% on touch screens, and static there.
- Risk words keep only a 12% trace once seen.
- Social card: a 1200×630 image (night, beam, crest, motto) for link previews on every page.

---

## Still to do (needs the client)

1. **Vector crest.** Ask whoever designed the business card for the original file (AI, EPS, SVG or PDF). The site will then be crisp at any size, including the social card.
2. **Portrait of Emmanuel.** Brief: shot at night or in a dark room, **one warm light from the side** (like the beam), dark navy background, calm expression, no uniform or security props. Use it on "Le cabinet" and, small, next to the founder's quote on the home page. It plugs into the ready-made "develop in the dark" reveal (`.media-reveal`).
3. **Legal details** for `mentions-legales/`.
4. **A real domain**, then update the address used in the pages, `sitemap.xml` and `robots.txt`.
5. **A form service**, so that requests arrive even when the visitor has no mail app set up.
