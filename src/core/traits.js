/**
 * Traits - per-decoration control.
 *
 * A theme is not one switch. Christmas is trees, wreaths, snowmen, a north
 * star, Santa's sleigh, robins, a steam train, elves and fireworks, and a site
 * may well want the snow and the trees but not a train crossing the header. So
 * every theme publishes a `traits` manifest naming what it draws, and a host
 * turns any of it off or thins it out:
 *
 *   new Celebrations({ traits: { train: false, elf: false, tree: 0.5 } })
 *
 * Two mechanisms sit behind that, chosen per trait by what the theme itself
 * exposes:
 *
 *   - **Config keys.** Where a trait's population comes from an
 *     `intensityConfig` value - `trees: 6`, `cupidChance: 0.0005` - the trait
 *     names that key and the density scales it before the theme ever runs. The
 *     theme then simply creates fewer, which is cheaper and looks right.
 *   - **Type filtering.** Several themes hardcode their spawn odds and take no
 *     config at all (Santa's sleigh and the Halloween witches are both like
 *     this). For those the engine drops the particle by its `type` after the
 *     theme creates it, and applies density as a probability.
 *
 * The two never both apply to the same trait, so a density of 0.5 thins by half
 * rather than by three quarters.
 */

/**
 * Normalise a host's trait settings against a theme's manifest.
 *
 * Accepted setting values, all meaning the same thing in different shapes:
 * `true`, `false`, a number used as a density multiplier (`0` is off, `1` is
 * untouched, `2` is twice as many), or `{ enabled, density }`.
 *
 * @param {Object} themeModule - Loaded theme
 * @param {Object} [settings] - Host's `traits` option
 * @returns {Object} Resolved traits keyed by name
 */
export function resolveTraits(themeModule, settings = {}) {
  const manifest = (themeModule && themeModule.traits) || {};
  const resolved = Object.create(null);

  for (const [name, definition] of Object.entries(manifest)) {
    const setting = settings[name];
    let enabled = true;
    let density = 1;

    if (setting === false) {
      enabled = false;
    } else if (typeof setting === 'number') {
      density = Math.max(0, setting);
      enabled = density > 0;
    } else if (setting && typeof setting === 'object') {
      if (setting.enabled === false) enabled = false;
      if (typeof setting.density === 'number') {
        density = Math.max(0, setting.density);
        if (density === 0) enabled = false;
      }
    }

    resolved[name] = {
      name,
      label: definition.label || name,
      types: definition.types || [],
      kind: definition.kind || 'decoration',
      countKey: definition.count || null,
      chanceKey: definition.chance || null,
      global: definition.global === true,
      enabled,
      density
    };
  }

  return resolved;
}

/**
 * Map every particle `type` to the trait that owns it, so a filter decision is
 * one lookup rather than a scan of the manifest.
 *
 * @param {Object} resolved - Output of `resolveTraits`
 * @returns {Map<string, Object>}
 */
export function buildTypeIndex(resolved) {
  const index = new Map();
  for (const trait of Object.values(resolved)) {
    for (const type of trait.types) {
      index.set(type, trait);
    }
  }
  return index;
}

/**
 * Produce the intensity config the theme should actually see, with the count
 * and chance keys of disabled or thinned traits adjusted.
 *
 * Returns the original object untouched when nothing needs changing, so the
 * common case allocates nothing.
 *
 * @param {Object} config - Raw `intensityConfig[level]`
 * @param {Object} resolved - Output of `resolveTraits`
 * @returns {Object}
 */
export function applyTraitsToConfig(config, resolved) {
  let next = null;

  for (const trait of Object.values(resolved)) {
    if (trait.enabled && trait.density === 1) continue;

    for (const key of [trait.countKey, trait.chanceKey]) {
      if (!key) continue;
      const base = config[key];
      if (typeof base !== 'number') continue;

      next = next || { ...config };
      if (!trait.enabled) {
        next[key] = 0;
      } else if (key === trait.countKey) {
        // A count is a number of objects, so it has to stay a whole number.
        // Round rather than floor: a density of 0.5 against `trees: 3` should
        // leave 2 trees, not 1.
        next[key] = Math.max(0, Math.round(base * trait.density));
      } else {
        next[key] = base * trait.density;
      }
    }
  }

  return next || config;
}

/**
 * Should a particle of this type be drawn?
 *
 * Unknown types pass. A theme may emit something its manifest does not list -
 * an incidental spark, a type added in a later release - and silently dropping
 * it would be a worse failure than showing something the host did not name.
 *
 * @param {Map<string, Object>} typeIndex - Output of `buildTypeIndex`
 * @param {string} type - Particle type
 * @param {boolean} [applyDensity=false] - Also roll against the trait's density.
 *   Only pass true where the density has not already been applied through a
 *   config key
 * @returns {boolean}
 */
export function allowsType(typeIndex, type, applyDensity = false) {
  if (!type) return true;

  const trait = typeIndex.get(type);
  if (!trait) return true;
  if (!trait.enabled) return false;

  if (applyDensity && trait.density !== 1 && !trait.countKey && !trait.chanceKey) {
    return Math.random() < trait.density;
  }

  return true;
}

/**
 * Is every falling-particle trait switched off?
 *
 * Worth knowing up front: without it, seeding 300 particles against a theme
 * whose particle traits are all disabled means 300 rounds of create-and-discard
 * with nothing to show for it.
 *
 * @param {Object} resolved - Output of `resolveTraits`
 * @returns {boolean} False when the theme declares no particle traits at all
 */
export function allParticleTraitsDisabled(resolved) {
  const particleTraits = Object.values(resolved).filter(trait => trait.kind === 'particle');
  return particleTraits.length > 0 && particleTraits.every(trait => !trait.enabled);
}

/**
 * Is the theme's `drawGlobalEffects` pass wanted?
 *
 * Gated by any trait marked `global: true` - lightning, in both themes that
 * have one.
 *
 * @param {Object} resolved - Output of `resolveTraits`
 * @returns {boolean}
 */
export function globalEffectsEnabled(resolved) {
  return Object.values(resolved).every(trait => !trait.global || trait.enabled);
}
