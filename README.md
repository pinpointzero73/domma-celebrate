# domma-celebrate

Seasonal canvas celebrations for any website. Twenty themes that know their own place in the
calendar, drawn on a transparent overlay that never touches your layout.

Zero dependencies. Works with a script tag, a bundler, or neither.

```html
<script src="domma-celebrate.min.js" data-celebrate></script>
```

That is the whole integration. On 25 December the page snows, with trees, a steam train and
Santa's sleigh crossing the top; a control disc lets a visitor turn it off, or turn off just the
train, and the choice is remembered. In July, Summer Garden brings flowers and butterflies. Outside a seasonal window, nothing loads or appears.

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

Dates are inclusive and use the visitor's local calendar. Easter follows Gregorian Easter Sunday each year; its window starts five days before Sunday and ends on Easter Monday. Easter takes priority if its window overlaps a patron saint's day. Summer Garden uses June through August, matching the UK summer; select it manually for other climates.

| Theme | Key | Dates | What you get |
|---|---|---|---|
| Winter | `winter` | 1 Dec to 28 Feb, after specific holidays | Snowflakes, frosted pines, snowdrifts, icicles and winter stars |
| Autumn | `autumn` | Sep-Nov, after specific holidays | Leaves, acorns and mushrooms |
| Graduation | `graduation` | Manual only | Tossed caps, diplomas and a personalised greeting |
| Birthday | `birthday` | Manual only | Cake, balloons and a personalised greeting |
| Anniversary | `anniversary` | Manual only | Rings, hearts and a personalised greeting |
| Greeting | `greeting` | Manual only | Standalone sparkler lettering |
| Money Rain | `money-rain` | Manual only | Fluttering banknotes |
| Make it rain | `make-it-rain` | Manual only | Falling water and ground splashes |
| Chinese New Year | `chinese-new-year` | First day and the six days following it | A flowing Chinese dragon, red lanterns, red and gold confetti, fireworks and a sparkler greeting |
| New Year | `new-year` | 31 Dec to 2 Jan | Confetti, curled streamers, fireworks, balloons and a midnight clock |
| Easter | `easter` | Five days before Easter Sunday through Easter Monday | Blossom, decorated eggs, a bunny, flowers and butterflies |
| Summer Garden | `summer-garden` | 1 Jun to 31 Aug | Drifting petals, flowers, butterflies, bumblebees and ladybirds |
| Christmas | `christmas` | 1 Dec to 30 Dec | Crystalline snowflakes, decorated trees, wreaths, snowmen, a north star, Santa's sleigh with reindeer, a steam train, elves, robins, fireworks |
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

The twenty themes are delivered in two ways:

| Artefact | Format | Size | Themes |
|---|---|---|---|
| `dist/domma-celebrate.esm.js` | ESM, code-split | Engine + theme chunks | Fetched one at a time, only when in season (shared artwork is split into reusable chunks) |
| `dist/domma-celebrate.min.js` | UMD | Includes font outlines | All twenty inlined, one file, one request |
| `dist/domma-celebrate.cjs` | CommonJS | Includes font outlines | All twenty inlined |

The ESM build is what a bundler and a `<script type="module">` page both get: a visitor in July
downloads the engine plus the garden scene, and a visitor in December downloads the engine plus
Christmas. Garden artwork is shared by the Easter and Summer Garden chunks. The UMD build trades that for a single script tag with no module support needed.

Serving the ESM build yourself means serving `dist/chunks/` alongside it. Copy the entry without
the chunks and every celebration 404s on the day it matters.

All builds are minified and carry a version banner. ESM keeps custom font outlines in a separate lazy chunk; UMD and CommonJS include them in the single bundle.

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
`package.json`, that the ESM entry really splits (no theme code leaked into it, at least twenty
chunks emitted) and that the UMD build really inlines with no unresolved chunk import.

---

## Sparkler messages

New Year writes **Happy New Year**, Christmas writes **Merry Christmas**, and Chinese New Year writes **新年快乐**. A glowing tip draws each message, shedding sparks before the lettering shimmers, fades and repeats. Both `stroke` and `cursive` lettering work in `gold` or `silver`. The Chinese seasonal greeting uses Chinese strokes in either colour.

Use a preset with a year:

```js
const celebration = new Celebrations({
  theme: 'new-year',
  sparkler: {style: 'cursive', colour: 'silver', greeting: 'best-wishes', year: 2027}
});
await celebration.init(); // Best wishes for 2027!
```

Or supply your own message, including names, punctuation and Latin accents:

```js
const graduation = new Celebrations({
  theme: 'graduation',
  message: 'Congratulations, Chloé! Class of {year}',
  sparkler: {style: 'cursive', colour: 'silver', year: 2027}
});
await graduation.init();
```

| Option | Default | Values |
|---|---|---|
| `message` | Theme greeting | Custom text, up to 120 characters; overrides the greeting preset |
| `sparkler.style` | `stroke` | `stroke`, `cursive` |
| `sparkler.colour` | `gold` | `gold`, `silver` |
| `sparkler.greeting` | `default` | `default`, `best-wishes` |
| `sparkler.year` | Current year | 1-9999; replaces `{year}` in custom text and supplies the Best wishes year |

Omit `theme` when passing `message` for standalone lettering without other decorations. Custom messages also work with `christmas`, `new-year`, `chinese-new-year`, `graduation`, `birthday` and `anniversary`. On narrow screens, multiword greetings wrap across two lines. Disable lettering with `traits: {sparklerMessage: false}`.

Custom lettering supports Latin and extended Latin characters; the Chinese seasonal greeting has its own strokes. ESM loads the bundled font outlines only when needed. No external font service is required.

## Gardens, seasons and occasions

Summer Garden and Easter reuse Domma's illustrated butterflies, with wandering flight, wingbeats and the meadow palette. Bees fly to flower heads, hover to visit, then move to another flower; without flowers they keep flying. Easter's bunny makes short hops between rests.

Winter provides snow, frosted pines, snowdrifts, icicles and stars. Autumn adds falling leaves, acorns and mushrooms. These seasonal backgrounds yield to specific holidays in automatic mode. Date windows use the visitor's local calendar; manually select any scene for another climate or occasion.

Chinese New Year includes fireworks, red lanterns and a flowing dragon. Its seven-day window uses the Hong Kong Observatory's published dates for 2020-2050, falling back to the runtime's Chinese calendar outside those years. Easter follows Gregorian Easter Sunday. Both moving holidays take priority over overlapping fixed celebrations.

Graduation tosses mortarboards and diplomas, Birthday adds cake and balloons, and Anniversary includes rings and hearts. They are manual themes available throughout the year, each with a sparkler greeting you can personalise.

## Make it rain

`makeItRain()` produces actual weather rain with water streaks and ground splashes. `moneyRain()` is the separately named shower of illustrated banknotes. Both run independently of the calendar:

```js
import {makeItRain, moneyRain} from 'domma-celebrate';

const rain = await makeItRain({intensity: 'medium', duration: 8000});
// rain?.destroy() stops early. duration: 0 runs until destroyed.

const notes = await moneyRain({intensity: 'light', duration: 4000});
```

Duration defaults to 8000 milliseconds and is capped at 600000. Timed effects remove their canvas and listeners when finished; explicit destruction clears the timer. Both return `null` when reduced motion is preferred. You can also use `theme: 'make-it-rain'` or `theme: 'money-rain'` with the regular engine for continuous effects.

## Standalone characters

Characters can be mounted inline, without seasonal particles or a date check:

```js
import {mountCharacter, getCharacters} from 'domma-celebrate';

const character = await mountCharacter('#mascot', {
  character: 'mooning-leprechaun',
  size: 'large'
});
// character.pause(), .play(), .replay(), .destroy()
```

`size` is the displayed height: `small` (96px), `medium` (160px, default),
`large` (240px), `xlarge` (360px), or pixels such as `200` / `'200px'`
(clamped to 16-1024px). The transparent canvas preserves the character's
proportions and shrinks to fit its container. `facing: 'left'` mirrors it;
`animate: false` draws a still pose. Reduced-motion preferences also produce
a still pose. Call `destroy()` when removing your component.

`getCharacters()` lists the cast: elf, peeing elf, thieving elf, mooning elf,
leprechaun, mooning leprechaun, bagpiper, knight, dragon, Welsh dragon, Cupid,
robin and snowman. The browser script exposes the same functions as
`DommaCelebrate.mountCharacter` and `DommaCelebrate.getCharacters`.

Run the demo and open `/demo/standalone.html` to compare the characters and sizes.
The mooning scenes in full celebrations are optional: enable Christmas's
`mooningElf` or St Patrick's `mooningLeprechaun` trait explicitly.


## Local framework previews

Build this checkout, then run `DOMMA_CELEBRATE_SOURCE=../domma-celebrate npm run copy:celebrate` in the sibling Domma JS checkout to preview without changing its published dependency pin.

## Licence

The library is MPL-2.0. See [LICENSE](./LICENSE). Custom lettering uses bundled outlines from Allura and ABeeZee under SIL OFL 1.1; their notices ship in `dist/licenses/` and the original files are in [assets/fonts](./assets/fonts).
