# Launch audit: Cabinet Thorelle Conseils

**Date:** 3 November 2026 · **Site:** manusecurite.vercel.app (static HTML/CSS/JS on Vercel)

**Method.** Nothing here is opinion-only. Every issue comes from a tool or a reproducible check:
- **Lighthouse 12.6** (mobile profile: slow 4G, mid-range phone) on 4 representative pages, before and after.
- **axe-core 4.10** on all 10 pages, at 1280px and 375px.
- **Response headers** inspected with `curl`, and the new policy tested locally with a server that applies `vercel.json`.
- **Keyboard and focus**: a scripted check that nothing invisible can take focus.
- **Behaviour**: scripted checks of the mobile dock, the form fallback, the menu name, the chapter clock and horizontal overflow at 375px.

The visual and storytelling audit is in [AUDIT.md](AUDIT.md) and the motion spec is in [MOTION-SYSTEM.md](MOTION-SYSTEM.md). This document covers what makes the site **ready for real users**.

---

## Results

| Metric (mobile) | Before | After |
|---|---|---|
| Lighthouse performance | 86 – 98 | **95 – 97** (local) · **100** (live) |
| Lighthouse accessibility | 85 – 94 | **100** |
| Lighthouse best practices | 100 | **100** |
| Lighthouse SEO | 100 | **100** |
| First text on screen (FCP), home | 3.3s | **1.7s** |
| Largest text on screen (LCP), home | 3.3s | **2.5s** |
| Layout shift (CLS), contact page | 0.128 | **0** |
| axe violations (10 pages × 2 widths) | 62 nodes on 2 pages | **0** |
| Security headers | HSTS only | **CSP, nosniff, frame-blocking, referrer, permissions, COOP** |
| Third-party requests per page | 2 (Google Fonts) | **0** |

### Live re-test after deploy (3 November 2026)

| Page (live URL) | Perf | A11y | Best pr. | SEO | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Home, mobile | 100 | 100 | 100 | 100 | 1.0s | 1.8s | 0 | 10ms |
| Home, desktop | 100 | 100 | 100 | 100 | 0.3s | 0.4s | 0 | 0ms |
| Entreprises, mobile | 100 | 100 | 100 | 100 | 1.1s | 1.7s | 0 | 0ms |
| Contact, mobile | 100 | 100 | 100 | 100 | 1.1s | 1.7s | 0 | 0ms |
| Article, mobile | 100 | 100 | 100 | 100 | 1.1s | 1.8s | 0 | 10ms |
| Particuliers, Cabinet, Journal, Questions | — | 100 | — | 100 | | | | |
| Mentions légales | — | 100 | — | 69 | | | | |

The legal notice scores 69 for SEO **on purpose**: it is marked `noindex`, which Lighthouse counts as "not crawlable".

Also checked live:
- All security and cache headers are present.
- All 11 pages, the sitemap, robots file and social card return 200; unknown URLs return 404.
- `/entreprises` redirects (308) to `/entreprises/`.
- Pages run with no console errors and no third-party requests under the security policy.

**Found during the live re-test:** the internal documents in `docs/` were publicly reachable (for example `/docs/AUDIT.md`). Fixed with a `.vercelignore` that keeps `docs/` and `README.md` out of every deployment (issue 18 below). This takes effect on the next deploy.

---

## Issues

Severity levels:
- **Critical**: blocks launch or carries legal risk.
- **High**: loses visitors or leads.
- **Medium**: real friction.
- **Low**: polish.

### Fixed and verified

| # | Severity | Area | Issue | Impact | Fix | Verified by |
|---|---|---|---|---|---|---|
| 1 | High | Speed | Google Fonts stylesheet blocked rendering: first text at **3.3s** on mobile | Visitors on 4G look at a black screen; some leave | Fonts **self-hosted** (4 variable WOFF2 files, latin subset, 134KB), the 3 visible ones **preloaded**, `font-display: swap` | Lighthouse: FCP 3.3s → 1.5–1.7s |
| 2 | High | Conversion | On phones, after the first screen there was **no call to action** except the menu (the header button is hidden under 640px) | Mobile visitors, the majority, had no direct path to call | **Mobile contact dock**: "Appeler" and "Premier échange". It appears after the first screen and hides near contact areas, the footer and when the menu is open; it respects the iPhone safe area | Scripted: hidden at top, shown mid-page, hidden at the bottom |
| 3 | High | Conversion | The form opens the visitor's mail app; **on a phone with no mail app set up, nothing happens**, silently | Lost leads with no trace | After sending, a **status message** offers the phone number, the email link and a "Copier l'adresse e-mail" button (announced to screen readers) | Scripted on /contact/ |
| 4 | High | Security | No security headers beyond HTTPS | Open to clickjacking, content sniffing, injected scripts | `vercel.json`: **Content-Security-Policy** (scripts from the site only, plus one inline script allowed by hash), `X-Frame-Options: DENY` and `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` | Local server with the same headers: every page loads with 0 console errors and 0 policy violations |
| 5 | High | Accessibility | **Contrast failures**: 52 words of the founder's text start at 16% opacity, and dimmed steps of the pinned session (9 nodes) | Text unreadable for low-vision users; WCAG 1.4.3 failure | Floor raised to 42%, which meets 3:1 for large text; the values litany likewise. Pinned steps are now dimmed **by colour**, not opacity, keeping 5:1 or better | axe: 0 violations |
| 6 | Medium | Accessibility | On phones, the **menu button had no accessible name** (its label was `display: none`); same for the scroll link | Screen readers announce "button" with no name | Labels are now visually hidden but still read | Lighthouse `button-name` and `link-name` pass |
| 7 | Medium | Speed | Contact page **jumped once** as it loaded (CLS 0.128) | Mis-taps, cheap feel | Fixed by preloading fonts (fallback-to-final swap no longer reflows) | Lighthouse CLS 0 on all pages |
| 8 | Medium | Speed | **67KB crest PNG** displayed at 40px on every page | Wasted data on mobile | WebP versions: 10KB (header) and 23KB (footer). The full PNG is kept only for structured data | Lighthouse image audits pass |
| 9 | Medium | Speed | No caching: every asset re-validated on every visit | Slower repeat visits | Fonts cached 1 year (immutable), images 30 days, CSS/JS 1 hour with background refresh, HTML always fresh | Local headers checked with `curl` |
| 10 | Medium | Accessibility | The hidden header button (home, while the main CTA shows) **could still take keyboard focus**; content not yet faded in could be focused while invisible | Keyboard users lose track of focus | Hidden button gets `visibility: hidden`; anything focused appears instantly | Scripted focus scan |
| 11 | Medium | SEO | Home page had **no canonical URL and no structured data**; the 404 page declared a canonical; articles were typed "website" | Weaker search and social previews | Home: canonical, `og:url`, `ProfessionalService` JSON-LD. 404: canonical removed (it stays `noindex`). Articles: `og:type=article`. `og:url` on every page | Lighthouse SEO 100 |
| 12 | Medium | SEO | `/entreprises` and `/entreprises/` both served the page | Duplicate URLs | `trailingSlash: true` in `vercel.json` (one URL, redirect from the other) | Takes effect on deploy |
| 13 | Low | Speed | LCP at 2.6s, just over the 2.5s "good" mark, because titles waited for their entrance | Core Web Vitals "needs improvement" | Hero headline starts at 0.55s (was 0.9s); inner titles at 120ms (was 300ms). Motion spec updated | Lighthouse LCP 2.5s |
| 14 | Low | Accessibility | Focus ring 1px thin; anchor targets could slide under the fixed header | Hard to see focus; hidden headings | 2px ring; `scroll-padding-top: 88px` | Visual check |
| 15 | Low | Accessibility | A sidebar landmark (`aside`) nested inside a section | Confusing landmark navigation | Plain `div` | axe |
| 16 | Low | Mobile | Content could sit under the iPhone home indicator | Dock partly hidden on newer iPhones | `viewport-fit=cover` with a safe-area inset on the dock | Code review |
| 18 | Medium | Security | Internal audit documents in `docs/` were served publicly | Anyone could read internal notes and open items | `.vercelignore` excludes `docs/` and `README.md` from deployments | Live URL check after the next deploy |
| 17 | Low | Legal | The legal notice still said fonts came from Google | Inaccurate privacy statement | Updated: no cookies, no external resources | Text check |

### Open: needs a decision or the client

| # | Severity | Area | Issue | Impact | Precise fix |
|---|---|---|---|---|---|
| A | **Critical** | Legal | **Mentions légales incomplete** (legal form, SIRET, address, CNAPS authorisation if applicable), shown as "à compléter" on the live page | Required by French law (LCEN art. 6); looks unfinished to a cautious client | Get the details from Emmanuel and replace the 4 placeholders in `mentions-legales/index.html` |
| B | High | Conversion | **No analytics**: no way to know if anyone calls or writes | Can't measure or improve anything | Enable **Vercel Web Analytics** (cookieless, no banner needed) in the Vercel dashboard, then add `<script defer src="/_vercel/insights/script.js"></script>` before `</body>` on each page. The CSP already allows it. Track clicks on `tel:` links, the CTAs and form sends |
| C | High | Conversion | The form still depends on the visitor's mail app | Some leads will still give up | Use a form service. **Formspree** (free tier) or **Web3Forms**: point the form's submit at it, add its domain to `form-action` and `connect-src` in the CSP, and keep the current fallback message for errors |
| D | High | Brand | **Domain**: the site lives on `manusecurite.vercel.app` | Looks temporary; an email at gmail.com does too | Buy the domain (for example `cabinet-thorelle.fr`), add it in Vercel → Settings → Domains, then replace the old address in every page's canonical and `og:url`, `sitemap.xml` and `robots.txt`. Ideally, a matching professional email too |
| E | Medium | Compatibility | **Not tested on real Safari (iPhone/Mac) or Firefox.** Only Chrome was available here | Rendering surprises on iPhone, the most likely device for this audience | Test on a real iPhone (Safari) and in Firefox using the checklist below. The feature floor is Safari 15.4+ and Firefox 110+ (see Compatibility) |
| F | Medium | Content | Articles and FAQ answers written for the site, not yet reviewed by Emmanuel | Advice must be his | Review and correct; confirm the answer on prices |
| G | Medium | Brand | Crest cut out of a 600px photo of a business card; no portrait | Softness at large sizes; no face for a trust-based service | Original vector file from the card's designer; a portrait (brief in AUDIT.md) |
| H | Low | Accessibility | The beam and sea animate continuously, with no pause control (WCAG 2.2.2) | Distracting for some users | Decorative and frozen with "reduce motion". Optionally add a small "Figer la lumière" toggle in the hero |
| I | Low | Speed | CSS (65KB) and JS (26KB) are not minified; about 10KB of CSS is page-specific | Roughly 5KB gzipped to save | Add a minify step if a build is ever introduced; not worth a build on its own |

---

## Compatibility

| Feature | Needs | Fallback |
|---|---|---|
| Page transitions (View Transitions) | Chrome/Edge 126+, Safari 18.2+ | Normal navigation (Firefox) |
| `100svh`, `:focus-visible`, `inset` | Safari 15.4+ | `100vh` declared first |
| `mask-image` (beam) | `-webkit-` prefix included | — |
| `background-clip: text` (gold words) | `-webkit-` prefix included | — |
| Canvas, IntersectionObserver, Web Animations | All browsers since 2020 | The FAQ opens instantly without animation |
| Without JavaScript | — | All content visible; no motion, no hero interaction, form not usable (phone and email links still are) |

---

## Launch checklist

### Mobile and fallbacks
- [x] No horizontal scroll at 375px on all pages
- [x] Mobile contact dock: appears after the first screen, hides near contact areas and the footer
- [x] Touch: the beam sweeps by itself and can be steered by dragging
- [x] Pinned session switches to a simple list under 1100px
- [x] Reduced motion: all motion off, content complete
- [x] Without JavaScript: content readable
- [ ] Test on a real iPhone (Safari): hero, menu, dock above the home indicator, form, phone link
- [ ] Test on a real Android phone (Chrome)

### Calls to action
- [x] One primary call to action per screen ("Réserver un premier échange" / "Premier échange")
- [x] Phone number is a `tel:` link everywhere
- [x] Contact form validates and gives a fallback if no mail app opens
- [ ] Call the number from the site once, and send one test request from the form on a phone and on a computer
- [ ] Decide on a form service (open issue C)

### Assets
- [x] Self-hosted fonts, preloaded, cached for a year
- [x] Logo in WebP at the right sizes
- [x] Favicon, Apple touch icon, 1200×630 social card
- [ ] Vector crest from the card's designer (open issue G)
- [ ] Portrait of Emmanuel (open issue G)

### Performance
- [x] Lighthouse mobile ≥ 95 on the home, a service page, an article and contact (local run)
- [x] CLS 0, LCP ≤ 2.5s, TBT ≤ 150ms
- [x] Hero animation pauses off screen and in background tabs
- [x] Re-run Lighthouse on the **live** URL after deploying

### Accessibility
- [x] axe: 0 violations, 10 pages × 2 widths
- [x] Keyboard: skip link, visible focus, menu traps focus and closes with Esc, nothing invisible takes focus
- [x] Contrast: 4.5:1 for text and 3:1 for large text, at rest
- [x] Language `fr`, one `h1` per page, labelled form fields, status messages announced
- [ ] One pass with VoiceOver on iPhone

### Cross-browser
- [x] Chrome (desktop and mobile emulation)
- [ ] Safari macOS, Safari iOS
- [ ] Firefox
- [ ] Edge (Chromium; low risk)

### SEO metadata
- [x] Unique title and description per page
- [x] Canonical and `og:url` per page; `og:image` 1200×630; `twitter:card`
- [x] Structured data: ProfessionalService (home, cabinet), Service (service pages), Article (journal), FAQPage (questions)
- [x] `sitemap.xml`, `robots.txt`, `noindex` on the legal notice and 404 page
- [ ] After the domain switch: update canonicals, `og:url`, `og:image`, sitemap and robots
- [ ] Submit the sitemap in Google Search Console; create a Google Business Profile if the cabinet receives clients

### Analytics
- [ ] Enable Vercel Web Analytics and add its script (open issue B)
- [ ] Track: phone clicks, "Premier échange" clicks, form sends

### Error handling
- [x] Custom 404 page with a way back
- [x] Form errors announced and focused; no silent failure
- [x] Scripts guarded: pages work if the canvas, fonts or animations are unavailable
- [x] 0 console errors on every page under the production security policy

### Security
- [x] HTTPS with HSTS (Vercel)
- [x] CSP, frame blocking, nosniff, referrer and permissions policies
- [x] No third-party scripts, no cookies, no stored personal data
- [x] After deploy: check the live headers with `curl -I https://manusecurite.vercel.app/`

### Deployment
- [x] Every push to `main` deploys automatically on Vercel
- [x] `vercel.json` committed (headers, cache, trailing slashes)
- [x] After deploy: open every page once, check the console, re-run Lighthouse
- [ ] Complete the legal notice (open issue A): **do not announce the site before this**
