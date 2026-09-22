# domma-celebrate

Seasonal canvas celebrations for any website. Eight themes that know their own place in the
calendar, drawn on a transparent overlay that never touches your layout.

Zero dependencies. Works with a script tag, a bundler, or neither.

```html
<script src="domma-celebrate.min.js" data-celebrate></script>
```

That is the whole integration. On 25 December the page snows, with trees, a steam train and
Santa's sleigh crossing the top; a control disc lets a visitor turn it off, or turn off just the
train, and the choice is remembered. On 15 July nothing loads and nothing appears.

This is the celebrations engine of [Domma](https://dommajs.org), extracted so it can be used
without it.

**[Usage.md](./Usage.md) is the full reference**: every option, the complete API, the trait
tables theme by theme, styling hooks and recipes. This page is the tour.

---

## Install

```bash
npm install domma-celebrate
```

Or drop `dist/domma-celebrate.min.js` next to your HTML and point a script tag at it.

```js
import { Celebrations, autoInit } from 'domma-celebrate';        // bundler or <script type="module">
const { Celebrations } = require('domma-celebrate');             // CommonJS
window.DommaCelebrate.autoInit();                                // plain <script>
```

---

## The three ways in

**A script tag.** Nothing else to write. Configurable from `data-*` attributes:
[full list](./Usage.md#1-a-script-tag).

```html
<script src="domma-celebrate.min.js" data-celebrate data-intensity="light"></script>
```

**`autoInit()`.** Canvas plus controls, preferences remembered, one call. Returns `null` when
there is no celebration in season, having created nothing and mounted nothing.

```js
import { autoInit } from 'domma-celebrate';

const started = await autoInit({ intensity: 'light' });
if (started) console.log(started.celebrations.currentTheme);
```

**The engine on its own.** For a host with its own chrome: a settings page, an existing toolbar,
a framework component. Nothing is stored and no widget is mounted.

```js
import { Celebrations } from 'domma-celebrate';

const celebrations = new Celebrations({ theme: 'auto', intensity: 'medium' });
await celebrations.init();
```

---

## The celebrations

Each runs for a short lead-up and ends at midnight on the day itself.

| Theme | Key | Dates | What you get |
|---|---|---|---|
| Christmas | `christmas` | 1 Dec to 1 Jan | Crystalline snowflakes, decorated trees, wreaths, snowmen, a north star, Santa's sleigh with reindeer, a steam train, elves, robins, fireworks |
| Valentine's Day | `valentines` | 9 to 14 Feb | Hearts, rose petals, kisses, heart garlands, butterflies, envelopes, love letters, Cupid, a heart-shaped moon, a neon sign |
| St David's Day | `st-davids` | 24 Feb to 1 Mar | Daffodil petals, daffodils, leeks, daffodil fields, the Welsh dragon, a harp, the flag |
| St Patrick's Day | `st-patricks` | 12 to 17 Mar | Clover petals, shamrocks, gold coins, pots of gold, a rainbow, leprechauns, a banshee, a green moon |
| St George's Day | `st-georges` | 18 to 23 Apr | Rose petals, Tudor roses, oak leaves, English roses, a knight, a dragon, a castle, shields, the cross |
| Halloween | `halloween` | 26 to 31 Oct | Bats, ghosts, pumpkins, spiders, gravestones, jack-o-lanterns, scarecrows, a haunted house, a cauldron, witches, lightning |
| Guy Fawkes Night | `guy-fawkes` | 1 to 5 Nov | Embers, sparks, bonfires, guy effigies, Catherine wheels, Roman candles, sparklers, fireworks, rockets, a red moon, lightning |
| St Andrew's Day | `st-andrews` | 25 to 30 Nov | Heather petals, thistles, thistle plants, a bagpiper, the saltire, tartan, a Highland scene |

Ask without starting anything:

```js
import { getCurrentTheme, isCelebrationSeason } from 'domma-celebrate';

getCurrentTheme();                        // 'halloween' or null
getCurrentTheme(new Date(2026, 11, 25));  // 'christmas'
isCelebrationSeason();                    // boolean
```

---

## Traits

A theme is not one switch. You may want the snow and the trees but not a steam train crossing
your header. Every theme publishes a manifest of what it draws, and any of it can be switched
off or thinned out:

```js
const celebrations = new Celebrations({
  theme: 'christmas',
  traits: {
    train: false,   // no steam train
    elf: false,     // no elves
    tree: 0.5,      // half as many trees
    firework: 2     // twice as many fireworks
  }
});

celebrations.setTrait('sleigh', false);
celebrations.getTraits();   // labels and state, for building a UI
```

`false` is off, `true` is on, and a number is a density multiplier. Every theme's traits are
listed in [Usage.md](./Usage.md#trait-reference-theme-by-theme), along with
[how it works](./Usage.md#how-it-works-and-why-it-matters) and why some traits thin exactly
while others thin on average.

---

## What gets downloaded

The eight themes are 420 KB of source, so how they are delivered is the whole question. Two
builds answer it differently:

| Artefact | Format | Size | Themes |
|---|---|---|---|
| `dist/domma-celebrate.esm.js` | ESM, code-split | ~31 KB + one chunk | Fetched one at a time, only when in season (15 to 27 KB each) |
| `dist/domma-celebrate.min.js` | UMD | ~192 KB | All eight inlined, one file, one request |
| `dist/domma-celebrate.cjs` | CommonJS | ~192 KB | All eight inlined |

The ESM build is what a bundler and a `<script type="module">` page both get: a visitor in July
downloads the engine and nothing else, and a visitor in December downloads the engine plus
Christmas. The UMD build trades that for a single script tag with no module support needed.

Serving the ESM build yourself means serving `dist/chunks/` alongside it. Copy the entry without
the chunks and every celebration 404s on the day it matters.

Both are minified and carry a version banner.

---

## Accessibility

- **Reduced motion is honoured by default.** With `prefers-reduced-motion: reduce` set, `init()`
  returns `false` and no canvas is created at all: not a slower animation, nothing. Pass
  `respectMotionPreference: false` to override, deliberately.
- The canvas is `aria-hidden` and `pointer-events: none`, so it is invisible to assistive
  technology and never intercepts a click.
- The control widget is keyboard-operable throughout, with `aria-pressed` on the toggles,
  `aria-expanded` on the traits panel, visible focus rings, and Escape to close the panel.
- A visitor's choice to turn the effect off is remembered, so they are asked once rather than on
  every page.

---

## Browser support

Canvas 2D, ES2020 and `requestAnimationFrame`: Chrome/Edge 90+, Firefox 88+, Safari 14+. The
ESM build additionally needs dynamic `import()`; the UMD build does not. `ResizeObserver` is used
when scoped to a container and falls back to the window resize without it.

localStorage access is wrapped in `try`/`catch` throughout, because a Safari private window
throws on the mere act of reading it. Blocked storage means preferences are not remembered,
never a broken page.

---

## Development

```bash
npm install --legacy-peer-deps   # plain install trips over vitest's peer graph in npm 10
npm test                         # watch
npm run test:run                 # once
npm run build                    # dist/
npm run test:dist                # build, then verify the artefacts are the right shape
npm run demo                     # build and serve demo/ on :4173
```

`scripts/verify-dist.mjs` asserts what the build promises: that the version banner matches
`package.json`, that the ESM entry really splits (no theme code leaked into it, at least eight
chunks emitted) and that the UMD build really inlines with no unresolved chunk import.

---

## Licence

MPL-2.0. See [LICENSE](./LICENSE).
