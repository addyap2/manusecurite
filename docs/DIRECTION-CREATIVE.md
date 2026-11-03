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
