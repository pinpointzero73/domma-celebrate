# domma-celebrate

Seasonal canvas celebrations for any website. Eight themes that know their own place in the
calendar, drawn on a transparent overlay that never touches your layout.

Zero dependencies. Works with a script tag, a bundler, or neither.

```html
<script src="domma-celebrate.min.js" data-celebrate></script>
```

That is the whole integration. On 25 December the page snows, with trees, a steam train and
Santa's sleigh crossing the top; a control disc lets a visitor turn it off, and the choice is
remembered. On 15 July nothing loads and nothing appears.

This is the celebrations engine of [Domma](https://dommajs.org), extracted so it can be used
without it.

---

## Contents

- [Install](#install)
- [The three ways in](#the-three-ways-in)
- [The celebrations](#the-celebrations)
- [Traits: turning individual things off](#traits-turning-individual-things-off)
- [Options](#options)
- [API](#api)
- [Events](#events)
- [The control widget](#the-control-widget)
- [Custom themes](#custom-themes)
- [What gets downloaded](#what-gets-downloaded)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Licence](#licence)

---

## Install

```bash
npm install domma-celebrate
```

Or drop `dist/domma-celebrate.min.js` next to your HTML and point a script tag at it.

---

## The three ways in

**A script tag.** Nothing else to write. Recognised attributes: `data-theme`, `data-intensity`,
`data-position`, `data-z-index`, `data-container`, `data-ui="false"`, `data-debug`.

```html
<script src="domma-celebrate.min.js" data-celebrate data-intensity="light"></script>
```

**`autoInit()`.** Canvas plus controls, preferences remembered, one call. Returns `null` when
there is no celebration in season, which is most of the year.

```js
import { autoInit } from 'domma-celebrate';

const started = await autoInit({ intensity: 'light' });
if (started) console.log(started.celebrations.currentTheme);
```

**The engine on its own.** For a host with its own chrome - a settings page, an existing
toolbar, a framework component.

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
| 🎄 Christmas | `christmas` | 1 Dec – 1 Jan | Crystalline snowflakes, decorated trees, wreaths, snowmen, a north star, Santa's sleigh with reindeer, a steam train, elves, robins, fireworks |
| 💕 Valentine's Day | `valentines` | 9 – 14 Feb | Hearts, rose petals, kisses, heart garlands, butterflies, envelopes, love letters, Cupid, a heart-shaped moon, a neon sign |
| 🏴󠁧󠁢󠁷󠁬󠁳󠁿 St David's Day | `st-davids` | 24 Feb – 1 Mar | Daffodil petals, daffodils, leeks, daffodil fields, the Welsh dragon, a harp, the flag |
| ☘️ St Patrick's Day | `st-patricks` | 12 – 17 Mar | Clover petals, shamrocks, gold coins, pots of gold, a rainbow, leprechauns, a banshee, a green moon |
| 🏴󠁧󠁢󠁥󠁮󠁧󠁿 St George's Day | `st-georges` | 18 – 23 Apr | Rose petals, Tudor roses, oak leaves, English roses, a knight, a dragon, a castle, shields, the cross |
| 🎃 Halloween | `halloween` | 26 – 31 Oct | Bats, ghosts, pumpkins, spiders, gravestones, jack-o-lanterns, scarecrows, a haunted house, a cauldron, witches, lightning |
| 🎆 Guy Fawkes Night | `guy-fawkes` | 1 – 5 Nov | Embers, sparks, bonfires, guy effigies, Catherine wheels, Roman candles, sparklers, fireworks, rockets, a red moon, lightning |
| 🏴󠁧󠁢󠁳󠁣󠁴󠁿 St Andrew's Day | `st-andrews` | 25 – 30 Nov | Heather petals, thistles, thistle plants, a bagpiper, the saltire, tartan, a Highland scene |

Ask without starting anything:

```js
import { getCurrentTheme, isCelebrationSeason, getThemes } from 'domma-celebrate';

getCurrentTheme();                        // 'halloween' | null
getCurrentTheme(new Date(2026, 11, 25));  // 'christmas'
isCelebrationSeason();                    // boolean
getThemes();                              // every theme's metadata
```

---

## Traits: turning individual things off

A theme is not one switch. You may want the snow and the trees but not a steam train crossing
your header. Every theme publishes a **trait manifest** naming what it draws, and any of it can
be switched off or thinned out:

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
```

A value of `false` is off, `true` is on, and a number is a density multiplier - `0` is off, `1`
is untouched, `2` is twice as many. `{ enabled, density }` says both at once.

At runtime:

```js
celebrations.getTraits();
// { train: { label: 'Steam train', enabled: true, density: 1, types: ['train'], kind: 'decoration' }, ... }

celebrations.setTrait('train', false);
celebrations.setTraits({ elf: false, robin: false });   // one reseed, not two
```

And before a theme is running, for a settings screen:

```js
import { getThemeTraits } from 'domma-celebrate';

const traits = await getThemeTraits('halloween');
Object.values(traits).map(trait => trait.label);
// ['Falling pumpkins', 'Bats', 'Ghosts', 'Spiders', ... 'Witches', 'Lightning']
```

### What each theme lets you switch

| Theme | Traits |
|---|---|
| `christmas` | `snowflake` `tree` `wreath` `snowman` `northStar` `sleigh` `robin` `train` `elf` `firework` |
| `valentines` | `heart` `rosePetal` `sparkle` `lips` `heartGarland` `butterfly` `envelope` `heartMoon` `cupid` `loveLetter` `neonSign` |
| `st-davids` | `daffodilPetal` `daffodil` `springSparkle` `leek` `daffodilField` `twinklingStar` `welshDragon` `flag` `harp` `leekBundle` |
| `st-patricks` | `cloverPetal` `shamrock` `goldCoin` `sparkle` `potOfGold` `twinklingStar` `leprechaun` `rainbow` `banshee` `moon` |
| `st-georges` | `rosePetal` `tudorRose` `oakLeaf` `sparkle` `englishRose` `twinklingStar` `knight` `dragon` `castle` `shield` `stGeorgesCross` |
| `halloween` | `pumpkin` `bat` `ghost` `spider` `gravestone` `jackOLantern` `scarecrow` `twinklingStar` `hauntedHouse` `moon` `witch` `cauldron` `floatingPumpkin` `lightning` |
| `guy-fawkes` | `ember` `spark` `bonfire` `guyEffigy` `catherineWheel` `romanCandle` `sparklerBundle` `firework` `rocket` `burst` `moon` `lightning` |
| `st-andrews` | `heatherPetal` `heather` `saltireSparkle` `thistle` `thistlePlant` `twinklingStar` `bagpiper` `saltireFlag` `tartanPattern` `highlandScene` |

Settings are keyed by trait name, so a `traits` object may safely name traits from several
themes - each theme only consults its own.

### How it works, and why it matters

Two mechanisms sit behind a trait, picked per trait by what the theme itself exposes:

- **Config keys.** Where a trait's population comes from an intensity value - `trees: 6`,
  `cupidChance: 0.0005` - the density scales that value before the theme runs, so the theme
  simply creates fewer. Cheaper, and it looks right.
- **Type filtering.** Several themes hardcode their spawn odds and read no config at all
  (Santa's sleigh and the Halloween witches are both like this). Those are dropped by particle
  type on the way out of the theme, with density applied as a probability.

The two never both apply to one trait, so a density of `0.5` thins by half rather than by three
quarters.

---

## Options

Everything `new Celebrations(options)` takes:

| Option | Default | What it does |
|---|---|---|
| `theme` | `'auto'` | A theme key, or `'auto'` to pick whatever is in season |
| `intensity` | `'medium'` | `'light'`, `'medium'` or `'heavy'` |
| `enabled` | `true` | Start animating as soon as `init()` finishes |
| `traits` | `{}` | Per-decoration control, [above](#traits-turning-individual-things-off) |
| `container` | `null` | Element or selector to scope the canvas to. Null is a fixed, full-viewport overlay |
| `zIndex` | `999` | Overlay stacking order |
| `canvasId` | `'domma-celebrate-canvas'` | Id given to the canvas element |
| `mobileReduction` | `0.5` | Particle-count multiplier below 768px. `1` disables it |
| `respectMotionPreference` | `true` | Do nothing at all when the visitor has asked for reduced motion |
| `debug` | `false` | Log lifecycle detail. Errors are reported either way |

`autoInit()` takes all of those plus:

| Option | Default | What it does |
|---|---|---|
| `ui` | `true` | Mount the control widget. An object is passed to `mountControl()` |
| `storageKey` | `'domma-celebrate'` | localStorage prefix for remembered preferences. `null` remembers nothing |

Scoped to a hero section rather than the whole page:

```js
new Celebrations({ theme: 'christmas', container: '#hero', zIndex: 2 });
```

---

## API

### Lifecycle

```js
await celebrations.init();      // resolve the theme, build the canvas, seed particles
celebrations.start();           // begin animating
celebrations.pause();           // stop, keeping the canvas
celebrations.resume();
await celebrations.enable();    // init if needed, then start
celebrations.disable();
await celebrations.toggle();    // → whether it is now running
celebrations.destroy();         // remove the canvas, unbind everything
```

`init()` returns `false` rather than throwing when there is nothing to show: no celebration in
season, an unknown theme, a theme that failed to load, or a visitor who asked for reduced
motion. It never throws.

### Configuration

```js
celebrations.setIntensity('heavy');
await celebrations.setTheme('valentines');   // reuses the same canvas
celebrations.setTrait('train', false);
celebrations.setTraits({ elf: false, tree: 0.5 });
```

### Inspection

```js
celebrations.getState();
// { enabled, initialized, theme, intensity, particles, reducedMotion }

celebrations.getTraits();
```

### Module functions

```js
import {
  autoInit, mountControl, readPreferences,
  getThemes, getTheme, getCurrentTheme, isCelebrationSeason, isDateInRange,
  getThemeTraits, registerTheme, unregisterTheme, version
} from 'domma-celebrate';
```

---

## Events

```js
const off = celebrations.on('stateChange', running => console.log(running));
off();
```

| Event | Payload |
|---|---|
| `init` | Theme name |
| `stateChange` | `true` when running, `false` when paused |
| `themeChange` | New theme name |
| `intensityChange` | New intensity |
| `traitChange` | The full resolved trait map |
| `destroy` | Theme name |

Every handler also receives the instance as a second argument. A handler that throws is
reported and does not stop the others.

---

## The control widget

`autoInit()` mounts it for you; mount it yourself to drive an instance you built:

```js
import { Celebrations, mountControl } from 'domma-celebrate';

const celebrations = new Celebrations({ theme: 'auto' });
const control = mountControl(celebrations, { position: 'bottom-left' });

control.destroy();
```

| Option | Default | What it does |
|---|---|---|
| `position` | `'bottom-right'` | Also `'bottom-left'`, `'top-right'`, `'top-left'` |
| `mount` | `document.body` | Where to append it |
| `intensity` | `true` | Show the light/medium/heavy buttons |
| `traits` | `true` | Show the per-trait panel |
| `label` | `'Celebration effects'` | Accessible name and tooltip on the disc |
| `storageKey` | `'domma-celebrate'` | localStorage prefix. `null` remembers nothing |
| `icon` | sparkles | Replacement SVG markup for the disc |

The widget's stylesheet is injected from JavaScript, so there is no second file to link. Every
colour is a `var(--dm-*, fallback)`: on a Domma page it inherits the active theme, anywhere else
it renders as a neutral light control. Override `.domma-celebrate-*` to restyle it.

---

## Custom themes

A theme is a plain object. Nothing about the engine is Christmas-specific.

```js
import { registerTheme, Celebrations } from 'domma-celebrate';

registerTheme('midsummer', {
  displayName: 'Midsummer',
  emoji: '🌻',
  dates: [[6, 20], [6, 24]],
  module: {
    name: 'midsummer',
    intensityConfig: {
      light:  { count: 30, speedRange: [0.4, 1.0], sizeRange: [2, 4], suns: 1 },
      medium: { count: 60, speedRange: [0.5, 1.4], sizeRange: [2, 5], suns: 2 },
      heavy:  { count: 120, speedRange: [0.6, 1.8], sizeRange: [3, 6], suns: 3 }
    },
    traits: {
      petal: { label: 'Petals', types: ['petal'], kind: 'particle' },
      sun:   { label: 'Suns', types: ['sun'], count: 'suns' }
    },
    createFallingParticle: (width, height, config) => ({ type: 'petal', /* … */ }),
    createInitialDecorations: (width, height, config) => [/* … */],
    drawPetal: (ctx, particle) => { /* … */ },
    drawSun: (ctx, particle, time) => { /* … */ }
  }
});
```

The contract the engine expects:

| Member | Required | Purpose |
|---|---|---|
| `intensityConfig` | yes | `light` / `medium` / `heavy`, each with at least `count`, `speedRange`, `sizeRange` |
| `traits` | no | What a host may switch off. Without it, everything is always on |
| `createFallingParticle(w, h, config)` | no | One particle for the falling layer. Falls back to a generic one |
| `createInitialDecorations(w, h, config)` | no | Decorations placed once per reseed |
| `spawnSpecialParticle(existing, w, h, config)` | no | Called every frame; return a particle or nothing |
| `updateSpecialParticles(list, delta, w, h)` | no | Theme-owned physics for its decorations |
| `drawGlobalEffects(ctx, time, w, h)` | no | A whole-canvas pass, for lightning and similar |
| `draw<Type>(ctx, particle, time)` | per type | `type: 'sun'` is drawn by `drawSun`; `'sparkler-bundle'` by `drawSparklerBundle` |

Pass `load: () => import('./midsummer.js')` instead of `module` to keep a custom theme lazy too.

---

## What gets downloaded

The eight themes are 420 KB of source, so how they are delivered is the whole question. Two
builds, and they answer it differently:

| Artefact | Format | Size | Themes |
|---|---|---|---|
| `dist/domma-celebrate.esm.js` | ESM, code-split | ~31 KB + one chunk | Fetched one at a time, only when in season (15–27 KB each) |
| `dist/domma-celebrate.min.js` | UMD | ~192 KB | All eight inlined - one file, one request |
| `dist/domma-celebrate.cjs` | CommonJS | ~192 KB | All eight inlined |

The ESM build is what a bundler and a `<script type="module">` page both get: a visitor in July
downloads the engine and nothing else, and a visitor in December downloads the engine plus
Christmas. The UMD build trades that for a single script tag with no module support needed.

Both are minified and carry a version banner.

---

## Accessibility

- **Reduced motion is honoured by default.** With `prefers-reduced-motion: reduce` set, `init()`
  returns `false` and no canvas is created at all - not a slower animation, nothing. Pass
  `respectMotionPreference: false` to override, deliberately.
- The canvas is `aria-hidden` and `pointer-events: none`, so it is invisible to assistive
  technology and never intercepts a click.
- The control widget is keyboard-operable throughout, with `aria-pressed` on the toggles,
  `aria-expanded` on the traits panel, visible focus rings, and Escape to close the panel.
- A visitor's choice to turn the effect off is remembered in localStorage, so they are asked
  once rather than on every page.

---

## Browser support

Canvas 2D, ES2020 and `requestAnimationFrame`: Chrome/Edge 90+, Firefox 88+, Safari 14+. The
ESM build additionally needs dynamic `import()`; the UMD build does not.

localStorage access is wrapped in `try`/`catch` throughout - a Safari private window throws on
the mere act of reading it - so blocked storage means preferences are not remembered, never a
broken page.

---

## Licence

MPL-2.0. See [LICENSE](./LICENSE).
