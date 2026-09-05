# domma-celebrate: usage

Every option, the complete API, the trait tables theme by theme, styling hooks and recipes.
[README.md](./README.md) is the shorter tour.

---

## Contents

- [The three ways in](#the-three-ways-in)
  - [1. A script tag](#1-a-script-tag)
  - [2. autoInit()](#2-autoinit)
  - [3. The engine on its own](#3-the-engine-on-its-own)
- [Options](#options)
- [Intensity](#intensity)
- [Traits: turning individual things off](#traits-turning-individual-things-off)
  - [How it works, and why it matters](#how-it-works-and-why-it-matters)
  - [Trait reference, theme by theme](#trait-reference-theme-by-theme)
- [API](#api)
  - [Instance methods](#instance-methods)
  - [Instance properties](#instance-properties)
  - [Module functions](#module-functions)
- [Events](#events)
- [The control widget](#the-control-widget)
- [Styling](#styling)
- [Stored preferences](#stored-preferences)
- [Recipes](#recipes)
- [Custom themes](#custom-themes)
- [Low-level exports](#low-level-exports)
- [Troubleshooting](#troubleshooting)

---

## The three ways in

### 1. A script tag

Nothing else to write. The presence of `data-celebrate` is what switches it on.

```html
<script src="domma-celebrate.min.js" data-celebrate></script>
```

Everything is configurable from attributes:

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `data-celebrate` | present | required | Without it the script defines the API and starts nothing |
| `data-theme` | a theme key, or `auto` | `auto` | Force one celebration instead of following the calendar |
| `data-intensity` | `light` `medium` `heavy` | `medium` | How much is on screen |
| `data-position` | `bottom-right` `bottom-left` `top-right` `top-left` | `bottom-right` | Where the control disc sits |
| `data-z-index` | a number | `999` | Overlay stacking order |
| `data-container` | a CSS selector | none | Scope the canvas to an element instead of the viewport |
| `data-ui` | `false` | on | Suppress the control widget entirely |
| `data-debug` | present, or `false` | off | Log lifecycle detail to the console |

```html
<script src="domma-celebrate.min.js"
        data-celebrate
        data-theme="christmas"
        data-intensity="light"
        data-position="bottom-left"></script>
```

The script reads `document.currentScript` synchronously, so it works from `<head>` or from the
end of `<body>`; mounting waits for `DOMContentLoaded` either way.

### 2. autoInit()

Canvas plus controls, preferences remembered, one call.

```js
import { autoInit } from 'domma-celebrate';

const started = await autoInit({ intensity: 'light' });

if (started) {
  console.log(started.celebrations.currentTheme);   // 'halloween'
  started.control.destroy();                        // remove just the widget
}
```

**Returns `null`** when there is no celebration in season, having created nothing and mounted
nothing. That is the normal outcome for most of the year, and it is why the controls do not
appear on a random Tuesday in July: a disc that toggles nothing is worse than no disc.

Otherwise it returns `{ celebrations, control }`, where `control` is `null` if you passed
`ui: false`.

`autoInit()` takes every [option](#options) below, plus:

| Option | Default | What it does |
|---|---|---|
| `ui` | `true` | Mount the control widget. An object is passed through to `mountControl()` |
| `storageKey` | `'domma-celebrate'` | localStorage prefix for remembered preferences. `null` remembers nothing |

A visitor's remembered choices win over `enabled`, `intensity` and `traits`, so turning the
effect (or just the steam train) off stays off across pages and across visits. Their trait
choices layer over yours, so a trait the site disabled stays disabled.

### 3. The engine on its own

For a host with its own chrome: a settings page, an existing toolbar, a framework component.

```js
import { Celebrations } from 'domma-celebrate';

const celebrations = new Celebrations({ theme: 'auto', intensity: 'medium' });
const started = await celebrations.init();
```

Nothing is remembered and no widget is mounted. You drive it, you store what you like.

---

## Options

Everything `new Celebrations(options)` takes. All are optional.

| Option | Type | Default | What it does |
|---|---|---|---|
| `theme` | string | `'auto'` | A theme key, or `'auto'` to pick whatever is in season |
| `intensity` | string | `'medium'` | `'light'`, `'medium'` or `'heavy'`. An unrecognised value falls back to `'medium'` |
| `enabled` | boolean | `true` | Start animating as soon as `init()` finishes |
| `traits` | object | `{}` | Per-decoration control. See [Traits](#traits-turning-individual-things-off) |
| `container` | Element, string or null | `null` | Scope the canvas to an element. Null is a fixed, full-viewport overlay |
| `zIndex` | number | `999` | Overlay stacking order |
| `canvasId` | string | `'domma-celebrate-canvas'` | Id given to the canvas element |
| `mobileReduction` | number | `0.5` | Falling-particle multiplier below 768px. `1` disables the reduction. Decorations are placed rather than scattered, so they are left alone |
| `respectMotionPreference` | boolean | `true` | Do nothing at all when the visitor has asked for reduced motion |
| `debug` | boolean | `false` | Log lifecycle detail. Errors are reported either way |

A `container` that is `position: static` is promoted to `position: relative`, because a static
one would push the canvas up to the nearest positioned ancestor and the effect would land in the
wrong place. A scoped canvas is watched with `ResizeObserver` as well as the window resize, so
it keeps up with a sidebar opening or a flex sibling growing.

---

## Intensity

Three levels, defined per theme rather than globally, because 150 snowflakes and 150 fireworks
are not the same page.

```js
celebrations.setIntensity('heavy');
```

`count` is the falling-particle population; the rest are decoration counts and per-frame spawn
probabilities that [traits](#traits-turning-individual-things-off) scale.

| Theme | light | medium | heavy |
|---|---|---|---|
| `christmas` | 50 particles, 3 trees, 2 wreaths, 2 snowmen | 150 particles, 6 trees, 3 wreaths, 3 snowmen | 300 particles, 10 trees, 4 wreaths, 4 snowmen |
| `valentines` | 40 particles, 1 garland, 2 butterflies, 3 envelopes | 80 particles, 2 garlands, 3 butterflies, 4 envelopes | 150 particles, 3 garlands, 5 butterflies, 6 envelopes |
| `st-davids` | 50 particles, 2 fields, 10 stars | 100 particles, 3 fields, 18 stars | 150 particles, 4 fields, 25 stars |
| `st-patricks` | 40 particles, 1 pot, 10 stars | 80 particles, 2 pots, 18 stars | 120 particles, 3 pots, 25 stars |
| `st-georges` | 40 particles, 3 roses, 10 stars | 80 particles, 5 roses, 18 stars | 120 particles, 8 roses, 25 stars |
| `halloween` | 30 particles, 3 gravestones, 2 lanterns, 8 stars | 60 particles, 5 gravestones, 4 lanterns, 15 stars | 100 particles, 8 gravestones, 6 lanterns, 25 stars |
| `guy-fawkes` | 60 particles, 1 bonfire | 120 particles, 2 bonfires | 200 particles, 3 bonfires |
| `st-andrews` | 50 particles, 4 thistles, 12 stars | 100 particles, 6 thistles, 20 stars | 200 particles, 8 thistles, 30 stars |

Guy Fawkes starts at a quarter of its particle count and builds towards it, so the bonfire
catches rather than arriving fully lit.

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

Four ways to write a setting, all meaning the same thing in different shapes:

| Value | Meaning |
|---|---|
| `true` | On, untouched |
| `false` | Off |
| a number | Density multiplier. `0` is off, `1` is untouched, `2` is twice as many |
| `{ enabled, density }` | Both at once |

At runtime:

```js
celebrations.getTraits();
// {
//   train: { name: 'train', label: 'Steam train', types: ['train'],
//            kind: 'decoration', countKey: null, chanceKey: null,
//            global: false, enabled: true, density: 1 },
//   ...
// }

celebrations.setTrait('train', false);
celebrations.setTraits({ elf: false, robin: false });   // one reseed, not two
```

`setTraits()` is batched on purpose: each change reseeds every particle, so setting six traits
one at a time would rebuild the canvas six times and visibly stutter.

And before a theme is running, for a settings screen:

```js
import { getThemeTraits } from 'domma-celebrate';

const traits = await getThemeTraits('halloween');
Object.values(traits).map(trait => trait.label);
// ['Falling pumpkins', 'Bats', 'Ghosts', 'Spiders', ... 'Witches', 'Lightning']
```

Settings are keyed by trait name, so one `traits` object may safely name traits from several
themes. Each theme only consults its own, and a name the current theme does not know is ignored
rather than an error. Trait settings survive a theme change.

### How it works, and why it matters

Two mechanisms sit behind a trait, picked per trait by what the theme itself exposes:

- **Config keys.** Where a trait's population comes from an intensity value (`trees: 6`,
  `cupidChance: 0.0005`) the density scales that value before the theme runs, so the theme
  simply creates fewer. Cheaper, and it looks right.
- **Type filtering.** Several themes hardcode their spawn odds and read no config at all
  (Santa's sleigh and the Halloween witches are both like this). Those are dropped by particle
  type on the way out of the theme, with density applied as a probability.

The two never both apply to one trait, so a density of `0.5` thins by half rather than by three
quarters. The tables below say which applies where, which matters if you are tuning: a
config-key trait thins exactly, a filtered one thins on average.

Falling particles are a special case. A theme picks its own particle type at random (Halloween
is 70% pumpkins, 30% spiders), so honouring `{ spider: false }` means asking again until
something allowed comes back, bounded at twelve attempts. Switch off every particle trait and
the falling layer is skipped entirely rather than churning.

### Trait reference, theme by theme

**Mechanism** says how density is applied: a named config key thins exactly; *type filter* thins
on average; *global* gates the theme's whole-canvas drawing pass.

#### christmas

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `snowflake` | Snowflakes | particle | type filter |
| `tree` | Christmas trees | decoration | `trees` |
| `wreath` | Wreaths | decoration | `wreaths` |
| `snowman` | Snowmen | decoration | `snowmen` |
| `northStar` | North star | decoration | `northStars` |
| `sleigh` | Santa's sleigh | decoration | type filter |
| `robin` | Robins | decoration | type filter |
| `train` | Steam train | decoration | type filter |
| `elf` | Elves | decoration | type filter |
| `firework` | Fireworks | decoration | type filter |

#### valentines

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `heart` | Hearts | particle | type filter |
| `rosePetal` | Rose petals | particle | type filter |
| `sparkle` | Sparkles | particle | type filter |
| `lips` | Kisses | particle | type filter |
| `heartGarland` | Heart garlands | decoration | `garlands` |
| `butterfly` | Butterflies | decoration | `butterflies` |
| `envelope` | Envelopes | decoration | `envelopes` |
| `heartMoon` | Heart moon | decoration | type filter |
| `cupid` | Cupid | decoration | `cupidChance` |
| `loveLetter` | Love letters | decoration | type filter |
| `neonSign` | Neon sign | decoration | type filter |

#### st-davids

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `daffodilPetal` | Daffodil petals | particle | type filter |
| `daffodil` | Daffodils | particle | type filter |
| `springSparkle` | Spring sparkles | particle | type filter |
| `leek` | Leeks | particle | type filter |
| `daffodilField` | Daffodil fields | decoration | `daffodilFields` |
| `twinklingStar` | Twinkling stars | decoration | `twinklingStars` |
| `welshDragon` | Welsh dragon | decoration | `dragonChance` |
| `flag` | Welsh flag | decoration | type filter |
| `harp` | Harp | decoration | type filter |
| `leekBundle` | Leek bundles | decoration | type filter |

#### st-patricks

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `cloverPetal` | Clover petals | particle | type filter |
| `shamrock` | Shamrocks | particle | type filter |
| `goldCoin` | Gold coins | particle | type filter |
| `sparkle` | Sparkles | particle | type filter |
| `potOfGold` | Pots of gold | decoration | `pots` |
| `twinklingStar` | Twinkling stars | decoration | `twinklingStars` |
| `leprechaun` | Leprechauns | decoration | `leprechaunChance` |
| `rainbow` | Rainbow | decoration | type filter |
| `banshee` | Banshee | decoration | type filter |
| `moon` | Moon | decoration | type filter |

#### st-georges

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `rosePetal` | Rose petals | particle | type filter |
| `tudorRose` | Tudor roses | particle | type filter |
| `oakLeaf` | Oak leaves | particle | type filter |
| `sparkle` | Sparkles | particle | type filter |
| `englishRose` | English roses | decoration | `roses` |
| `twinklingStar` | Twinkling stars | decoration | `twinklingStars` |
| `knight` | Knight | decoration | `knightChance` |
| `dragon` | Dragon | decoration | type filter |
| `castle` | Castle | decoration | type filter |
| `shield` | Shields | decoration | type filter |
| `stGeorgesCross` | St George's cross | decoration | type filter |

#### halloween

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `pumpkin` | Falling pumpkins | particle | type filter |
| `bat` | Bats | particle | type filter |
| `ghost` | Ghosts | particle | type filter |
| `spider` | Spiders | decoration | `spiders` |
| `gravestone` | Gravestones | decoration | `gravestones` |
| `jackOLantern` | Jack-o-lanterns | decoration | `jackOLanterns` |
| `scarecrow` | Scarecrows | decoration | `scarecrows` |
| `twinklingStar` | Twinkling stars | decoration | `twinklingStars` |
| `hauntedHouse` | Haunted house | decoration | type filter |
| `moon` | Moon | decoration | type filter |
| `witch` | Witches | decoration | type filter |
| `cauldron` | Cauldron | decoration | type filter |
| `floatingPumpkin` | Floating pumpkins | decoration | type filter |
| `lightning` | Lightning | global | gates `drawGlobalEffects` |

#### guy-fawkes

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `ember` | Embers | particle | type filter |
| `spark` | Sparks | particle | type filter |
| `bonfire` | Bonfires | decoration | `bonfires` |
| `guyEffigy` | Guy effigies | decoration | type filter |
| `catherineWheel` | Catherine wheels | decoration | type filter |
| `romanCandle` | Roman candles | decoration | type filter |
| `sparklerBundle` | Sparklers | decoration | type filter |
| `firework` | Fireworks | decoration | `fireworkChance` |
| `rocket` | Rockets | decoration | `rocketChance` |
| `burst` | Bursts | decoration | `burstChance` |
| `moon` | Moon | decoration | type filter |
| `lightning` | Lightning | global | gates `drawGlobalEffects` |

#### st-andrews

| Trait | Label | Layer | Mechanism |
|---|---|---|---|
| `heatherPetal` | Heather petals | particle | type filter |
| `heather` | Heather | particle | type filter |
| `saltireSparkle` | Saltire sparkles | particle | type filter |
| `thistle` | Thistles | particle | type filter |
| `thistlePlant` | Thistle plants | decoration | `thistles` |
| `twinklingStar` | Twinkling stars | decoration | `twinklingStars` |
| `bagpiper` | Bagpiper | decoration | `bagpiperChance` |
| `saltireFlag` | Saltire flag | decoration | type filter |
| `tartanPattern` | Tartan | decoration | type filter |
| `highlandScene` | Highland scene | decoration | type filter |

---

## API

### Instance methods

| Method | Returns | What it does |
|---|---|---|
| `init()` | `Promise<boolean>` | Resolve the theme, build the canvas, seed particles. Starts animating if `enabled` |
| `start()` | | Begin animating. No-op unless `init()` has succeeded |
| `pause()` | | Stop animating, keeping the canvas and particles |
| `resume()` | | Alias for `start()` |
| `enable()` | `Promise<boolean>` | `init()` if needed, then `start()`. Resolves to whether it is running |
| `disable()` | | Alias for `pause()` |
| `toggle()` | `Promise<boolean>` | Flip. Resolves to whether it is now running |
| `destroy()` | | Remove the canvas, unbind every listener, reset to pre-`init()` state |
| `setIntensity(level)` | `boolean` | `'light'`, `'medium'` or `'heavy'`. False for an unrecognised level |
| `setTheme(name)` | `Promise<boolean>` | Swap themes in place, reusing the canvas. Restores the old theme if the new one will not load |
| `setTrait(name, value)` | `boolean` | False if the current theme has no such trait |
| `setTraits(settings)` | `boolean` | Several at once, merged over the existing ones, one reseed |
| `getState()` | object | `{ enabled, initialized, theme, intensity, particles, reducedMotion }` |
| `getTraits()` | object | Resolved traits for the loaded theme, keyed by name |
| `resetParticles()` | | Rebuild everything from the current theme, intensity, traits and canvas size |
| `on(event, handler)` | function | Subscribe. Returns an unsubscribe function |
| `off(event, handler?)` | | Unsubscribe. Omit the handler to drop every listener for the event |

**`init()` returns `false` rather than throwing** when there is nothing to show: no celebration
in season, an unknown theme name, a theme that failed to load, or a visitor who has asked for
reduced motion. It never throws. Check the return value if you care which.

### Instance properties

Read them; do not write them.

| Property | Type | What it is |
|---|---|---|
| `currentTheme` | string or null | The resolved theme name, after `'auto'` has been worked out |
| `initialized` | boolean | Whether `init()` has succeeded |
| `running` | boolean | Whether the animation loop is live |
| `reducedMotion` | boolean | Whether it stood down for a motion preference |
| `particles` | array | The falling layer |
| `specialParticles` | array | Decorations and spawned specials |
| `options` | object | The resolved options, including `traits` |
| `canvasManager` | CanvasManager or null | The canvas wrapper, for `clear()` and `getDimensions()` |

### Module functions

```js
import {
  Celebrations, autoInit, mountControl, readPreferences, injectStyles, CSS,
  getThemes, getTheme, getCurrentTheme, isCelebrationSeason, isDateInRange,
  getThemeTraits, registerTheme, unregisterTheme, THEMES, version
} from 'domma-celebrate';
```

| Function | Returns | What it does |
|---|---|---|
| `autoInit(options?)` | `Promise<{celebrations, control} \| null>` | Canvas, controls and remembered preferences in one call |
| `mountControl(instance, options?)` | `{element, refresh, renderTraits, destroy}` | Mount the widget against an instance you built |
| `readPreferences(storageKey?)` | `{enabled, intensity, traits}` | What the visitor chose last time. Each is null if unset |
| `injectStyles(document?)` | | Inject the widget stylesheet. Idempotent; `mountControl` calls it for you |
| `CSS` | string | The widget stylesheet as text, if you would rather ship it yourself |
| `getThemes()` | object | Every theme's metadata, built-in and registered, keyed by name |
| `getTheme(name)` | object or undefined | One theme's descriptor |
| `getCurrentTheme(date?)` | string or null | The theme whose window contains the date. Defaults to now |
| `isCelebrationSeason(date?)` | boolean | Whether any celebration is in season |
| `isDateInRange(start, end, date?)` | boolean | `[month, day]` pairs, inclusive, wrapping the year if the end month is earlier |
| `getThemeTraits(name)` | `Promise<object>` | A theme's trait manifest, loading it if needed. Empty for an unknown theme |
| `registerTheme(name, definition)` | | Add a theme at runtime. See [Custom themes](#custom-themes) |
| `unregisterTheme(name)` | | Remove a registered theme. Built-ins cannot be removed |
| `THEMES` | object | The built-in table, without runtime registrations |
| `version` | string | The package version, substituted at build time |

The statics `Celebrations.getThemes()`, `.getCurrentTheme()`, `.isCelebrationSeason()` and
`.isDateInRange()` mirror the module functions, so a page that only imported the class can still
ask before constructing anything.

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

Every handler also receives the instance as a second argument. A handler that throws is reported
to the console and does not stop the others.

---

## The control widget

`autoInit()` mounts it for you. Mount it yourself to drive an instance you built:

```js
import { Celebrations, mountControl } from 'domma-celebrate';

const celebrations = new Celebrations({ theme: 'auto' });
const control = mountControl(celebrations, { position: 'bottom-left' });

control.refresh();       // redraw pressed states from the engine
control.renderTraits();  // rebuild the trait list, after a theme change
control.destroy();       // unmount and unbind
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

Two discs: the sparkles one toggles the effect, the sliders one opens a panel listing every
trait the current theme publishes. The intensity buttons appear on hover or focus. The panel
closes on Escape or an outside click, and is rebuilt on every theme change, because the traits
belong to the theme: switching from Christmas to Halloween replaces "Steam train" with
"Witches".

The widget listens to the instance's events, so changes you make through the API are reflected
in it without asking.

---

## Styling

The stylesheet is injected from JavaScript, so there is no second file to link. Every colour is
a `var(--dm-*, fallback)`: on a [Domma](https://dommajs.org) page the widget inherits the active
theme for free, anywhere else the fallback applies and it renders as a neutral light control.

| Variable | Fallback | Used for |
|---|---|---|
| `--dm-surface` | `#fff` | Disc, button and panel backgrounds |
| `--dm-border` | `#dee2e6` | Borders |
| `--dm-text` | `#212529` | Text and icons |
| `--dm-primary` | `#0d6efd` | Active state, focus rings, checkboxes |
| `--dm-white` | `#fff` | Text on the active intensity button |
| `--dm-hover-bg` | `rgba(0,0,0,.04)` | Hover backgrounds |
| `--dm-gray-800` | `#343a40` | Tooltip background |
| `--dm-font-family` | system stack | Widget typeface |

Define those on `:root` to restyle it wholesale, or target the classes directly, which win
because the injected sheet is first in the cascade:

```
.domma-celebrate-control      the positioned wrapper, with data-position
.domma-celebrate-discs        the row of round buttons
.domma-celebrate-toggle       the on/off disc, carries aria-pressed
.domma-celebrate-settings     the traits disc, carries aria-expanded
.domma-celebrate-intensity    the light/medium/heavy group
.domma-celebrate-panel        the traits popover
.domma-celebrate-panel-title  its heading
.domma-celebrate-panel-list   the checkbox list
.domma-celebrate-trait        one checkbox row
```

The canvas itself takes its id from `canvasId` and is inline-styled, so set `zIndex` and
`container` through options rather than CSS.

---

## Stored preferences

Only the widget and `autoInit()` store anything. The engine on its own never touches storage.

| Key | Shape |
|---|---|
| `domma-celebrate:enabled` | boolean |
| `domma-celebrate:intensity` | `'light'`, `'medium'` or `'heavy'` |
| `domma-celebrate:traits` | object of trait name to boolean |

Change the prefix with `storageKey`, or pass `storageKey: null` to remember nothing.

Every access is wrapped in `try`/`catch`. Reading `window.localStorage` throws outright in a
Safari private window and under a third-party-cookie block, and `setItem` throws once the quota
is full. An effect that decorates the page must not be the thing that breaks it, so a failure
means preferences are not remembered, never a broken page.

---

## Recipes

**Scoped to a hero rather than the whole page.**

```js
new Celebrations({ theme: 'christmas', container: '#hero', zIndex: 2 });
```

**No widget, your own controls.**

```js
const { celebrations } = await autoInit({ ui: false }) ?? {};
myButton.addEventListener('click', () => celebrations?.toggle());
```

**Force a theme for a screenshot or a test.**

```js
new Celebrations({ theme: 'halloween', respectMotionPreference: false, debug: true });
```

**Tune performance without dropping the theme.** Thin the expensive traits rather than the lot.

```js
new Celebrations({ intensity: 'light', traits: { firework: 0.3, twinklingStar: 0.5 } });
```

**A single-page app.** Tear down on unmount or the canvas outlives the route.

```js
useEffect(() => {
  const celebrations = new Celebrations({ theme: 'auto' });
  celebrations.init();
  return () => celebrations.destroy();
}, []);
```

**Vue, the same shape.**

```js
let celebrations = null;
onMounted(async () => {
  celebrations = new Celebrations({ theme: 'auto' });
  await celebrations.init();
});
onBeforeUnmount(() => celebrations?.destroy());
```

**Let the visitor pick a theme out of season.**

```js
for (const [name, theme] of Object.entries(getThemes())) {
  select.append(new Option(`${theme.emoji} ${theme.displayName}`, name));
}
select.onchange = () => celebrations.setTheme(select.value);
```

---

## Custom themes

A theme is a plain object. Nothing about the engine is Christmas-specific.

```js
import { registerTheme, Celebrations } from 'domma-celebrate';

registerTheme('midsummer', {
  displayName: 'Midsummer',
  emoji: '\u{1F33B}',
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
    createFallingParticle: (width, height, config) => ({ type: 'petal', /* ... */ }),
    createInitialDecorations: (width, height, config) => [/* ... */],
    drawPetal: (ctx, particle) => { /* ... */ },
    drawSun: (ctx, particle, time) => { /* ... */ }
  }
});
```

`registerTheme` takes either `module` (the theme object, already loaded) or `load` (a function
returning a promise for `{ default: theme }`), so a custom theme can stay lazy:

```js
registerTheme('midsummer', { dates: [[6, 20], [6, 24]], load: () => import('./midsummer.js') });
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
| `colors.primary` | no | Fallback fill for a particle type with no draw method |

A particle needs `x`, `y` and usually `size`, `opacity`, `speed` or `vy`, `rotation` and
`rotationSpeed`. A decoration also needs `active: true`, and `static: true` if it should not
move. Non-finite coordinates are dropped rather than drawn, because a `NaN` reaching the context
silently blanks the rest of the frame.

Trait definitions take `label`, `types` (the particle `type` values the trait owns), and
optionally `kind: 'particle'`, `count` or `chance` (an `intensityConfig` key), or `global: true`
to gate `drawGlobalEffects`.

---

## Low-level exports

The pieces the themes are built from, exported for a custom theme:

```js
import {
  CanvasManager,
  PhysicsEngine, updateParticlePhysics, updateMovingParticle,
  applyGravity, applyBounce, normalizeDelta, lerp, clamp,
  createParticle, createStaticDecoration, createMovingParticle,
  recycleParticle, isOffScreen,
  resolveTraits, buildTypeIndex, applyTraitsToConfig, allowsType
} from 'domma-celebrate';
```

`createParticle(config, width, height)` builds a depth-layered particle: front-layer ones are
larger, faster and more opaque, back-layer ones smaller, slower and fainter, which is what gives
the falling layer its sense of depth. `PhysicsEngine` supplies the wind gusts every theme drifts
on.

---

## Troubleshooting

**Nothing appears.** Check the date: each theme runs for a short window, and `getCurrentTheme()`
tells you what it thinks. Check whether the visitor previously turned it off
(`readPreferences()`). Check whether the browser reports `prefers-reduced-motion: reduce`, which
stands the effect down entirely. Turn on `debug: true` and the engine narrates.

**A theme 404s.** The ESM build is code-split: the entry is the engine and each theme is a chunk
under `dist/chunks/`. Serve the whole `dist/` tree, or use the UMD build, which inlines
everything.

**The effect is behind my content.** Raise `zIndex`. It defaults to `999`.

**The effect is in the wrong place inside a container.** The container needs a non-static
position; the library promotes a static one to `relative`, but a container with no height will
still produce a 1px canvas.

**Performance.** Drop to `light`, or thin the expensive traits rather than the whole theme:
`{ traits: { firework: 0.3, twinklingStar: 0.5 } }`. Particle counts already halve below 768px.

**Nothing is remembered.** The engine on its own stores nothing by design. Use `autoInit()` or
`mountControl()`, and check `storageKey` is not `null`.
