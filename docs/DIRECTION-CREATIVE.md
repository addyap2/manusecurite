# La Veille: creative direction

**Cabinet Thorelle Conseils · Risk & Management · Accompagnement de Sûreté**

## 1. The idea

Security consultancy sites all look alike: padlocks, hooded hackers, blue shields, stock photos of handshakes. They sell fear. Cabinet Thorelle sells the opposite: **calm attention**. Someone who stays awake so you don't have to.

The site is built as **one night of watch over the coast**, from dusk to dawn.

The visitor arrives in darkness. A single warm light, like a lighthouse beam, sweeps the horizon. As they scroll, the night passes: a discreet clock in the corner moves from **21:47 to 06:12**. Each chapter is one hour of vigilance. The site ends at **dawn**, which is when the contact form appears. What was protected through the night is still there in the morning.

> *Anticiper les risques, c'est préserver ce qui compte.*
> The motto is not a tagline here. It is the plot.

### Narrative arc (four movements + epilogue)

| Chapter | Hour | Movement | What the visitor feels |
|---|---|---|---|
| Prologue | 21:47 | **La nuit tombe**: a beam over the sea, the motto | Stillness, gravity, curiosity |
| I | 23:00 | **Observer**: Emmanuel's words light up one by one as you read | Being spoken to directly, by a person |
| II | 01:00 | **Deux terrains**: companies / private clients, two dossiers | Recognition: "this is for me" |
| III | 03:00 | **La session**: the 3-hour training as a musical score | Concreteness: it is a real method |
| IV | 04:30 | **Le serment**: eleven values as a slow litany | Trust, character, an oath |
| Epilogue | 06:12 | **L'aube**: the sky warms, contact | Relief and an open door |

## 2. Art direction

**Keywords:** nocturnal, heraldic, editorial, maritime, restrained.

**References (spirit, not copies):** night-time maritime charts; the gold leaf of the business card; slow film title sequences; the layout of luxury watchmaker catalogues; a lighthouse keeper's log book.

**What we refuse:**
- Stock photos, padlocks, shields used as icons, glowing hacker blues
- Cards with rounded corners and drop shadows, three-column feature grids
- Gradients from purple to blue, glassmorphism, bouncy motion
- Testimonials, figures or logos that don't exist

## 3. Colour: light in the dark

Only one warm source of light in a cold world. Gold is never used for large surfaces, only for **light**: hairlines, the beam, a highlighted word.

| Token | Hex | Role |
|---|---|---|
| Nuit | `#03070f` | Background, almost black navy (never pure black) |
| Abysse | `#06111f` | Deep sections |
| Marine | `#0c1e36` | Raised planes, the horizon |
| Or | `#c9a55a` | Light, hairlines, the active state |
| Or pâle | `#ecd59b` | The beam's core, the gold italic |
| Ivoire | `#ede6d6` | Main text: warm, never pure white |
| Brume | `#8a94a5` | Secondary text |
| Aube | `#e9a774 → #6d6f94` | Only at dawn, in the contact section |

## 4. Typography

Three voices, as on the card:

- **Cormorant** (Light 300 / Italic): the voice of the motto. Used **very large** (up to 9vw), tight leading (0.95), the italic in gold for the second half of a sentence. Its contrast evokes engraving.
- **Cinzel** (500, small, letter-spaced 0.3em): the heraldic voice, for chapter labels, Roman numerals, the clock. Never for headlines (too solemn when large).
- **Hanken Grotesk** (400/500): the voice of clarity, for reading. 17–18px, 1.65 line height, 62ch max.

Display to body ratio ≥ 8:1 in the prologue. One idea per screen.

## 5. Composition

- **The horizon line**: a 1px gold hairline at the bottom of the prologue, echoing the mountain-over-water of the crest. It comes back as the structural line of each chapter (a hairline that draws itself as the chapter heading appears).
- **Editorial asymmetry**: a 12-column grid with text weighted to the left and large empty margins. Wide empty space is the luxury here.
- **Chapter rail**: on the left on desktop, a vertical index I–IV in Cinzel, with the active chapter in gold. It works like a log book.
- **Instruments in the corners**: the watch clock top right, and the chapter label. Discreet, like the dials on a ship's bridge.

## 6. Imagery, light and depth

No photography (until a real portrait of Emmanuel exists). Everything is **drawn with light**:

- **The beam**: a slow, very soft conic gradient sweeping the hero (a 14s cycle).
- **The sea**: a canvas of fine horizontal dashes under the horizon. They shimmer when the beam passes over them.
- **The ridge**: the crest's mountain redrawn as a single gold line on the horizon.
- **Grain**: a film-grain layer at 6% over the whole site, so the darkness feels physical rather than flat.
- **Depth**: three planes (sky / horizon / sea) moving at different speeds when scrolling the prologue.

## 7. Motion language: "the watchman doesn't run"

| Principle | Rule |
|---|---|
| Slowness | Reveals 1.2–1.6s, curve `cubic-bezier(.16,1,.3,1)` (expo-out). Nothing bounces. |
| Lines first | Hairlines draw themselves, then text rises from a mask. |
| Reading = light | In chapter I, words go from 18% to 100% opacity as the visitor scrolls: reading the text "lights it up". |
| The litany | In chapter IV, only the value at the centre of the screen is fully lit. |
| Time | The clock advances with scrolling; the sky warms in the last 15%. |
| Respect | `prefers-reduced-motion`: everything static and readable, beam frozen, no scrubbing. |

Only `transform` and `opacity` are animated. The sea canvas stops when it is off screen.

## 8. Emotional experience

1. **Arrival**: silence, darkness, a light. "This is serious."
2. **Introduction**: a man speaks, in the first person. "This is a person, not a corporation."
3. **Recognition**: "Entreprise" or "Particulier", clearly separated. "It's for me."
4. **Proof by method**: the 3 hours set out like a score. "It is concrete."
5. **Character**: eleven words, slowly. "I can trust them."
6. **Dawn**: the colour changes for the first time. "I can call."

## 9. To do before launch

- [ ] Portrait of Emmanuel, shot at night with one warm side light (fits the art direction)
- [ ] Vector version of the crest
- [ ] Legal notice (mentions légales), service area

---

## 10. The hero: « Le Phare »

### Central concept: the light reveals the risks

The night sky of the hero holds **hidden words**, the risks the cabinet deals with: *Intrusion, Imprévu, Conflit, Vie privée, Incident, Déplacement sensible, Accès, Vulnérabilité*. They are invisible in the dark. **They only appear when the lighthouse beam passes over them.** Once seen, a risk keeps a small gold mark ✦: it has been *anticipated*.

The visitor steers the beam with the cursor. Within three seconds, without reading a line, they *do* what the cabinet does: shine a light on the risks before they arrive. The motto then explains what they just felt.

On touch screens the beam sweeps by itself, and dragging a finger steers it.

### Composition (desktop ≥ 1280px)

```
┌──────────────────────────────────────────────────────────────┐
│ [crest] THORELLE CONSEILS            VEILLE 21:47  ENTRETIEN │
│                                   Imprévu        Intrusion   │
│  CONSEIL EN SÛRETÉ ── ENTREPRISES & PARTICULIERS  Vie privée │
│                                                              │
│  Anticiper                                         Conflit   │
│        les risques,                ┌─────────────────────┐   │
│    c'est préserver                 │ sub-headline        │   │
│         ce qui compte.             │ [ RÉSERVER ──→ ]    │   │
│                                    │ ou appeler le 06 …  │   │
│                                    └─────────────────────┘   │
│  ENTREPRISES · PARTICULIERS      ⁄\/\     ✺ ← déplacez la lumière │
│ ════════════════════════ horizon ════════ ¦¦¦ reflection ═══ │
│  ~~~~~~~~~~~~~~~~~~~~~~~~ sea ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
└──────────────────────────────────────────────────────────────┘
```

- The headline is weighted left on 4 staggered lines; the conversion block sits on the right, **in the path of the light**.
- The lamp sits on the horizon at 72% of the width. Everything points to it.
- Below 1280px, the conversion block moves under the headline.

### Words

| Element | Text |
|---|---|
| Eyebrow | CONSEIL EN SÛRETÉ — ENTREPRISES & PARTICULIERS |
| Headline (H1) | Anticiper les risques, *c'est préserver ce qui compte.* |
| Sub-headline | Audit de sûreté, sensibilisation des équipes, accompagnement sur mesure : repérer les risques avant qu'ils ne vous atteignent. |
| Primary CTA | Réserver un premier échange → |
| Secondary CTA | ou appeler le 06 13 73 42 52 |
| Reassurance | Échange confidentiel |
| Quick paths | Entreprises · Particuliers |
| Hint (fine pointer only) | Déplacez la lumière |

The headline is the brand's own motto (emotion); the sub-headline says exactly what is sold (clarity); the CTA names the next step, not "Contact".

### Light, 3D and texture

- **Volumetric beam**: two conic layers (a wide haze and a sharp core) plus **dust in suspension**. Particles exist everywhere, but are only visible inside the beam, which gives real depth for almost no cost (2D canvas, no WebGL).
- **The lamp**: a point of light with a soft halo and a faint horizontal lens flare.
- **The sea**: shimmering dashes; the lamp's reflection is a vertical column, as in the crest.
- **Parallax**: stars, beam, ridge and sea move at different speeds with the pointer (±8px) and on scroll.
- **Grain** over everything, at 7%.

### Entrance (≈ 2.8s, then the page belongs to the visitor)

| Time | Event |
|---|---|
| 0.0s | Darkness. Stars only. |
| 0.25s | **The lamp ignites**: a flicker, then a steady glow (like a lamp being lit). |
| 0.6s | The ridge draws itself along the horizon. |
| 0.8s | The beam rises from the horizon and makes its first sweep, revealing two or three risks. |
| 0.9–1.6s | The headline rises line by line from a mask. |
| 1.7s | Sub-headline, then CTA. |
| 2.4s | Hint "Déplacez la lumière" appears near the lamp, and fades at the first move. |

### Interaction details

- The beam follows the pointer with inertia (lerp 0.06): it feels heavy, like a real lamp.
- **Hovering or focusing the CTA swings the beam onto it**: the button is literally put in the light.
- The CTA carries a soft sheen that follows the pointer.
- After 4 seconds idle, the beam resumes its slow automatic sweep.

### Scroll behaviour

On the first screen of scroll, the headline rises and fades, the beam lowers towards the horizon and dims, and the lamp shrinks: the watch moves on to chapter I.

### Usability and speed

- Real text, real links, and the CTA visible in the first screen (desktop and mobile).
- Risk words are decorative (`aria-hidden`); the meaning is carried by the headline and sub-headline.
- No libraries: one 2D canvas for dust and sea, paused off screen, 30 fps for the sea, particles halved on mobile.
- `prefers-reduced-motion`: fixed beam, all risk words softly visible, no dust, no entrance.
