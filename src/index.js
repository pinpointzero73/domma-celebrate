/**
 * domma-celebrate - seasonal canvas celebrations for any website.
 *
 * Eight themes that know their own place in the calendar. Point the library at
 * a page and it works out whether anything is in season, loads only that
 * theme's code, and draws it over the top without touching your layout.
 *
 * Three ways in, smallest first:
 *
 *   1. A script tag with `data-celebrate` - nothing else to write.
 *   2. `autoInit()` - one call, canvas plus controls, preferences remembered.
 *   3. `new Celebrations(...)` - the engine on its own, for a host with its
 *      own chrome.
 *
 * @module domma-celebrate
 */

import { Celebrations } from './core/engine.js';
import { mountControl, readPreferences } from './ui/control.js';
import {
  THEMES,
  getTheme,
  getThemes,
  getCurrentTheme,
  isCelebrationSeason,
  isDateInRange,
  registerTheme,
  unregisterTheme,
  getThemeTraits
} from './themes/index.js';

export { Celebrations };
export { CanvasManager } from './core/canvas.js';
export {
  PhysicsEngine,
  updateParticlePhysics,
  updateMovingParticle,
  applyGravity,
  applyBounce,
  normalizeDelta,
  lerp,
  clamp
} from './core/physics.js';
export {
  createParticle,
  createStaticDecoration,
  createMovingParticle,
  recycleParticle,
  isOffScreen
} from './core/particles.js';
export { mountControl, readPreferences };
export { injectStyles, CSS } from './ui/styles.js';
export {
  THEMES,
  getTheme,
  getThemes,
  getCurrentTheme,
  isCelebrationSeason,
  isDateInRange,
  registerTheme,
  unregisterTheme,
  getThemeTraits
};
export {
  resolveTraits,
  buildTypeIndex,
  applyTraitsToConfig,
  allowsType
} from './core/traits.js';

/**
 * Build-time constant, substituted from package.json by rollup. The `typeof`
 * guard is what lets the same source run straight from `src/` under vitest,
 * where no substitution has happened.
 */
export const version = typeof __VERSION__ !== 'undefined' ? __VERSION__ : '0.0.0-dev';

/**
 * Set the whole thing up in one call.
 *
 * Returns null - having created nothing and mounted nothing - when there is no
 * celebration to show. That is the normal outcome for most of the year, and it
 * is why the controls do not appear on a random Tuesday in July: a disc that
 * toggles nothing is worse than no disc.
 *
 * A visitor's remembered choice wins over `enabled` and `intensity`, so turning
 * the effect off stays off across pages and across visits.
 *
 * @param {Object} [options] - Everything `new Celebrations()` accepts, plus:
 * @param {boolean|Object} [options.ui=true] - Mount the control widget. An
 *   object is passed through to `mountControl()`
 * @param {string} [options.storageKey='domma-celebrate'] - localStorage prefix
 *   for remembered preferences; null remembers nothing
 * @returns {Promise<{celebrations: Celebrations, control: Object|null}|null>}
 */
export async function autoInit(options = {}) {
  const storageKey = options.storageKey === null ? null : (options.storageKey || 'domma-celebrate');
  const theme = options.theme || 'auto';

  if (theme === 'auto' && !getCurrentTheme()) {
    return null;
  }

  const saved = readPreferences(storageKey);
  const intensity = saved.intensity || options.intensity || 'medium';
  const wanted = saved.enabled !== null ? saved.enabled : options.enabled !== false;

  // A visitor's trait choices layer over the site's, so switching the train off
  // in the panel survives a reload without overriding what the site disabled.
  const traits = { ...(options.traits || {}), ...(saved.traits || {}) };

  const celebrations = new Celebrations({
    ...options,
    theme,
    intensity,
    traits,
    // Started explicitly below, after the widget exists, so its first paint
    // shows the real state rather than a stale "off".
    enabled: false
  });

  let control = null;
  if (options.ui !== false) {
    control = mountControl(celebrations, {
      storageKey,
      ...(typeof options.ui === 'object' ? options.ui : {})
    });
  }

  if (wanted) {
    await celebrations.enable();
    if (control) control.refresh();
  }

  return { celebrations, control };
}

/**
 * Script-tag entry point.
 *
 * `<script src="domma-celebrate.min.js" data-celebrate></script>` and you are
 * done. `document.currentScript` is read synchronously here because it is only
 * valid during the script's own evaluation - deferring the read to
 * DOMContentLoaded would return null.
 *
 * Recognised attributes: `data-theme`, `data-intensity`, `data-position`,
 * `data-z-index`, `data-container`, `data-ui="false"`, `data-debug`.
 *
 * @private
 */
function bootstrapFromScriptTag() {
  if (typeof document === 'undefined') return;

  const script = document.currentScript;
  if (!script || !script.hasAttribute('data-celebrate')) return;

  const data = script.dataset;
  const options = {
    theme: data.theme || 'auto',
    intensity: data.intensity || 'medium',
    debug: data.debug !== undefined && data.debug !== 'false',
    ui: data.ui === 'false' ? false : (data.position ? { position: data.position } : true)
  };
  if (data.zIndex) options.zIndex = Number(data.zIndex);
  if (data.container) options.container = data.container;

  const run = () => {
    autoInit(options).catch(error => {
      console.error('[domma-celebrate] Auto-init failed:', error);
    });
  };

  // `autoInit` appends to document.body, which a head-loaded script has not met
  // yet.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}

bootstrapFromScriptTag();

export default {
  Celebrations,
  autoInit,
  mountControl,
  readPreferences,
  getThemes,
  getTheme,
  getCurrentTheme,
  isCelebrationSeason,
  isDateInRange,
  registerTheme,
  unregisterTheme,
  getThemeTraits,
  THEMES,
  version
};
