# Changelog

## 1.0.0

First release. Extracted from Domma's `public/layouts/js/modules/celebrations/`, where it
worked only inside Domma's layout system and could not be used anywhere else.

### Added

- **Standalone distribution.** A UMD build with all eight themes inlined for a single script
  tag, a code-split ESM build that fetches one theme's chunk only when that celebration is in
  season, and a CommonJS build for `require()`.
- **Script-tag auto-init.** `<script src="domma-celebrate.min.js" data-celebrate>` is the whole
  integration, configurable through `data-*` attributes.
- **`autoInit()`** - canvas, controls and remembered preferences in one call. Returns `null`
  outside a celebration window rather than mounting a control that toggles nothing.
- **A control widget of its own** (`mountControl`) - toggle disc, intensity buttons and a
  per-trait panel, with its stylesheet injected from JavaScript so there is no second file to
  link. Keyboard-operable, `aria-pressed`/`aria-expanded` throughout, Escape closes the panel.
- **Traits.** Every theme publishes a manifest of what it draws, and any of it can be switched
  off or thinned: `{ traits: { train: false, tree: 0.5 } }`, plus `getTraits()`, `setTrait()`,
  `setTraits()` and `getThemeTraits()`. Density works through the theme's own intensity config
  where one exists, and by filtering particle types where the theme hardcodes its spawn odds.
- **`container` option** - scope the canvas to an element instead of the viewport, resized by
  `ResizeObserver` rather than only by window resize.
- **`respectMotionPreference`**, on by default: with `prefers-reduced-motion: reduce` no canvas
  is created at all.
- **`mobileReduction`**, on by default at 0.5. Documented in the original but never implemented.
- **Events** - `init`, `stateChange`, `themeChange`, `intensityChange`, `traitChange`,
  `destroy`. A throwing handler is reported and does not stop the others.
- **`enable()`, `disable()`, `toggle()`, `getState()`** - all four were documented in the
  original's usage guide and none of them existed.
- **`registerTheme()` / `unregisterTheme()`** for custom celebrations.
- **83 tests** covering the date windows (including the year-wrapping Christmas range), the
  trait mechanics, and the engine's lifecycle.

### Fixed

Carried over from the in-repo version, where none of these had a test:

- **Theme switching leaked a canvas every time.** `setTheme()` constructed a fresh
  `CanvasManager`, whose `create()` then appended a *second* canvas with the same id while the
  first stayed in the DOM with its listeners bound. Four switches left five canvases. The
  canvas is now built once and reused.
- **Two resize listeners, neither removed.** One was bound by `CanvasManager`, another by the
  effect class, and `destroy()` removed the canvas element directly without unbinding either.
  Resize handling now lives in one place and `destroy()` unbinds it.
- **Dynamic theme imports could not be bundled.** Themes were loaded with
  `import(themeData.module)` from a path held in a variable, which every bundler leaves
  untouched - so a bundled copy 404ed at runtime. Loaders are now literal `import()` calls
  inside closures, which keeps the laziness and lets rollup emit a chunk per theme.
- **A failed theme change left a live canvas with nothing on it.** `setTheme()` now restores the
  previous theme when the new one will not load.
- **`config.butterflies` and the envelope count in the Valentine's theme** were read but never
  defined in any intensity block, so both silently fell back to a literal and neither could be
  tuned.
- **Console noise.** The engine logged a dozen lines per initialisation unconditionally. Logging
  is now behind `debug: false`; errors are still reported.
