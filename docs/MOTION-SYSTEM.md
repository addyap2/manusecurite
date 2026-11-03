# Motion system: « Le veilleur ne court pas »

**The watchman doesn't run.** Cabinet Thorelle sells calm attention, so the site moves the way a careful person does: slowly, precisely, and only when there is a reason. Motion here is **light arriving in the dark**: things don't fly in, they *become visible*.

Implemented in [`styles.css`](../styles.css) (tokens at the top, the "MOTION SYSTEM" section at the end) and [`script.js`](../script.js).

---

## 1. Principles

| # | Principle | In practice |
|---|---|---|
| 1 | **Light, not movement** | Most reveals are opacity first, with a short rise (28px) or a mask. Nothing slides in from the side, nothing bounces, nothing rotates for show. |
| 2 | **Lines before words** | A hairline draws first (chapter rules, field focus, link underlines), then text appears. The eye is led, not grabbed. |
| 3 | **Every motion carries meaning** | The beam reveals risks (anticipation). The clock advances (vigilance). The session pins while its four steps pass (3 hours of training). Dawn arrives at contact (relief). If a motion has no meaning, it is removed. |
| 4 | **Arrive slow, leave fast** | Entrances use expo-out over 0.9–1.8s. Exits (page out, accordion close) use ease-in over 0.24–0.32s. Waiting for something to leave is never pleasant. |
| 5 | **Never block the user** | Content is readable during animation, links work immediately, and nothing waits for an animation to finish. |

---

## 2. Tokens

Defined on `:root` in `styles.css`.

### Easing

| Token | Curve | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | All arrivals: reveals, titles, hovers that move, lines drawing |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Things that go back and forth: beam sweep, scroll cue |
| `--ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | Departures: page out, accordion close |
| `--ease-soft` | `cubic-bezier(0.33, 1, 0.68, 1)` | Colour and opacity changes (no "pop") |

### Duration

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 120ms | Press feedback (`:active`) |
| `--dur-quick` | 240ms | Colour changes, exits |
| `--dur-base` | 480ms | UI state: menu items, accordion, label swaps |
| `--dur-slow` | 900ms | Hairlines, hover movement, active steps |
| `--dur-reveal` | 1400ms | Scroll reveals (opacity) |
| `--dur-cinematic` | 1800ms | Titles, hero, large movements |

### Rhythm

| Token | Value | Use |
|---|---|---|
| `--stagger` | 70ms | Gap between items of a group (`data-stagger`), capped at 8 items (max 560ms) |
| title words | 55ms | Gap between words of a `data-split` title, capped at 12 words |
| `--rise` | 28px | Distance travelled by a reveal |

**Rule:** no new raw duration or curve in the code. Use a token, or add one here first.

---

## 3. Choreography, surface by surface

### 3.1 Home loading sequence (« Le Phare »), about 2.8s

| t | Event | Property | Duration / curve |
|---|---|---|---|
| 0 | Darkness, stars | — | — |
| 0.25s | Lamp ignites, with a flicker | scale + opacity keyframes | 1.5s |
| 0.45s | Horizontal lens flare | scaleX | 1.8s, `--ease` |
| 0.6s | The ridge line draws | stroke-dashoffset | 3s, `--ease` |
| 0.8s | Beam rises and starts sweeping | JS: opacity 0→1 between 0.8s and 2.3s | smoothstep |
| 0.7s | Small label above the headline | opacity + rise | `--dur-reveal` |
| 0.9–1.36s | Headline, line by line from a mask | translateY 108%→0 | `--dur-cinematic`, 120ms steps |
| 1.7s | Subheadline | opacity + rise | `--dur-reveal` |
| 1.85s | Buttons | opacity + rise | `--dur-reveal` |
| 2.2s | Bottom bar (quick links, scroll cue) | opacity + rise | `--dur-reveal` |
| 2.4s | Hint "Déplacez la lumière" (fine pointer only) | opacity | 1.4s |

### 3.2 Inner-page loading sequence, about 1.4s

| t | Event |
|---|---|
| 0 | Header is already there (it never moves between pages) |
| 120ms | The lamp at the bottom of the hero ignites (same flicker as the home page, smaller) |
| 150ms | Breadcrumbs fade in |
| 300ms + 55ms per word | Title rises word by word from a mask |
| 400ms | Beam fades in over 1.8s |
| 820ms | Intro (or article meta) |
| 980ms | Buttons |

### 3.3 Page transitions: "through the night"

Cross-document View Transitions, CSS only (`@view-transition { navigation: auto; }`).

- **Out:** the old page fades to the night background in `--dur-quick` with `--ease-exit`.
- **In:** the new page fades in and rises 14px over `--dur-slow` with `--ease`, after an 80ms beat.
- **The header doesn't move**: it has its own `view-transition-name: bridge` with a 0s animation, so the brand and the clock stay perfectly still while the page changes underneath.
- Browsers without support (Firefox today) simply navigate normally: nothing breaks.

### 3.4 Text reveals

| Type | Where | How |
|---|---|---|
| **Line mask** | Home headline | Each line in an `overflow: hidden` wrapper; the inner span goes from `translateY(108%)` to 0 |
| **Word mask** (`data-split`) | Page titles, closing calls to action, home contact title | JS wraps each word (`.wm > .wi`); words rise from their mask, 55ms apart. Gold italic words carry their own gradient so it survives the split. |
| **Reading scrub** | Home chapter I (Emmanuel's words) | Words go from 16% to 100% opacity as the paragraph crosses the screen: reading lights the text up |
| **Litany** | Home chapter IV (values) | Only the value at the centre of the screen is fully lit and turns gold italic; the others fade with distance |

### 3.5 Scroll-triggered reveals

- `data-reveal`: opacity 0→1 (`--dur-reveal`, `--ease-soft`) and rise 28px→0 (`--dur-cinematic`, `--ease`). It triggers when the element passes 12% above the bottom of the screen, **plays once**, and is never reversed on scroll up.
- `data-draw`: hairline `scaleX(0→1)` from the left, `--dur-slow`… `--dur-cinematic`.
- `data-stagger` on a parent: its revealed children get `--i` = 0, 1, 2…, and wait `--i × 70ms`. Used on service lists, processes, article lists, the 3 pillars, the 4 session steps.

### 3.6 Parallax (deliberately modest)

| Layer | Factor | Note |
|---|---|---|
| Home stars | pointer ±10px / ±6px, and scroll ×0.12 | lerp 0.05 |
| Home headline block | scroll ×−0.18, fades out over 650px | |
| Home beam | lowers towards the horizon and dims with scroll | |
| Inner-page beam | scroll ×0.22 | CSS `translate`, driven by `--py` |

Parallax only runs during the first ~1.2 screens of scroll, when it is visible. Never on text the user is reading.

### 3.7 Pinned section: "La session" (desktop ≥ 1100px)

On the home page (chapter III) and on `/entreprises/`:

- The big **3 heures** stays pinned (CSS `position: sticky`, top 16vh) while the four steps scroll past on the right.
- Each step takes 54vh. The step crossing the middle of the screen is **lit** (opacity 0.22 → 1, its marker fills with gold). The others stay dim.
- A gold line on the left fills from top to bottom with progress (`--sp`, scaleY).
- Under the "3", **"En cours: Observation"** changes with each step (a 480ms swap).
- Meaning: the visitor *lives through* the session as it progresses.
- On tablets and phones there is no pinning: the four steps are a simple vertical list. Pinning on small screens steals the scroll.

Pinning uses `position: sticky`, not JS scroll-jacking: native scroll speed is never altered.

### 3.8 Hover and press

| Element | Hover | Press |
|---|---|---|
| Gold button (`.cta`) | Lifts 2px, light glow grows, a soft sheen follows the pointer, arrow stretches (34→50px) | `scale(.985)`, 120ms |
| Text link with line (`.link-line`, `.quick`) | Underline draws from the left / arrow stretches | — |
| Service list row (`.index li`) | Text moves 0.6rem right, number turns gold, gold line draws over the row | — |
| Article row (`.post-link`) | Title turns gold italic, arrow stretches 44→72px | — |
| Menu item | Turns gold italic, number turns gold | — |
| Home CTA | **The lighthouse beam swings onto it** | — |
| Phone number | Gold underline draws under the number | — |

Nothing important depends on hover: every hover effect is decoration on a link or button that works the same with a tap or the keyboard.

### 3.9 Micro-interactions

| Interaction | Behaviour |
|---|---|
| **Field focus** | A pale gold line draws under the field from the left (`--dur-slow`) |
| **Profile choice** | The chosen word turns italic and gets a gold underline |
| **Invalid field** | The line turns coral and focus moves to the field; no shaking |
| **Submit** | The mail app opens; the button turns ivory and reads "Messagerie ouverte ✓" for 5s |
| **FAQ** | Answers unfold (560ms, `--ease`) and fold back faster (320ms, `--ease-exit`); the "+" turns into "−" |
| **Menu** | The two lines cross into an ×; the label becomes "Fermer"; items rise one after another (40ms steps); Esc closes and returns focus |
| **Reading progress** | A 1px gold line across the top of article pages |
| **Watch clock** | Advances from 21:47 to 06:12 with scroll position |

### 3.10 Transitions between sections (home)

The home page is one continuous night, so sections are not separated by visual breaks. Each chapter opens the same way: **number → hairline draws → label** (the "chapter head"), then content. The only colour change on the whole page is **dawn**, when the sky warms during the last 18% of the scroll (`--dawn`), just as the contact section arrives.

### 3.11 Images (future portrait)

No photography yet. When Emmanuel's portrait arrives, wrap it in `.media-reveal`: it **develops in the dark**. A clip-path opens from the bottom (`--dur-cinematic`) while the image settles from scale 1.08 to 1 over 2.4s.

```html
<figure class="media-reveal"><img src="/assets/emmanuel.jpg" alt="Emmanuel Thorelle" width="900" height="1200"></figure>
```

---

## 4. Reduced motion

When the system setting "reduce motion" is on (`prefers-reduced-motion: reduce`):

| Feature | Behaviour |
|---|---|
| All duration tokens | Become 1ms; stagger 0; rise 0px |
| Reveals, word masks, line masks | Content visible immediately, in place |
| Page transitions | Off (`@view-transition { navigation: none; }`) |
| Beam | Fixed, no sweep, no pointer; all risk words softly visible |
| Dust, grain flicker, scroll cue | Off |
| Parallax, reading scrub, litany | Off; all text at full opacity |
| Pinned session | Off; a normal list |
| FAQ | Opens instantly |
| Reading progress line | Hidden |
| Clock, dawn tint | Kept (they change state, not position) |

---

## 5. Performance budget

- **Only `transform`, `opacity` and `clip-path` are animated.** Never width, height, top or left, except the FAQ height (one element, on click).
- **One scroll handler**, throttled to animation frames, using passive listeners. Reveals use `IntersectionObserver`, not scroll math.
- The hero canvas (sea and dust) **stops** when the hero leaves the screen or the tab is hidden. Sea at 30fps; dust particles halved on screens under 700px.
- `will-change` only on the few layers that move continuously (beam, stars, litany).
- No animation library. The whole site script (motion, hero, menu, form) is about 25KB, unminified.
- Target: 60fps on a mid-range phone; no layout shift caused by animation.

---

## 6. Checklist for a new element

1. What does this motion **mean**? If there's no answer, leave it out.
2. Is it an arrival (`--ease`, slow) or a departure (`--ease-exit`, quick)?
3. Pick a duration token. Don't invent one.
4. Animate `transform` or `opacity` only.
5. Is the content usable before the animation ends?
6. Check it with "reduce motion" turned on.
7. Check it on a phone, with a touch screen.
