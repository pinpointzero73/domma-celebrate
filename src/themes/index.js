/**
 * Theme registry.
 *
 * Every theme is described here once - its display metadata, the window of the
 * year it belongs to, and a loader.
 *
 * The loader is a **function returning a literal `import()`**, not a module
 * path string, and that shape is load-bearing rather than stylistic. The
 * original in-repo version stored `module: './themes/christmas.js'` and called
 * `import(themeData.module)`. A bundler cannot see through a variable: rollup,
 * esbuild and Vite all leave `import(someVariable)` untouched, so the theme
 * files never make it into the build and the import fails at runtime with a
 * 404. Writing the specifier as a literal inside a closure keeps the lazy
 * loading *and* lets the bundler emit each theme as its own chunk.
 *
 * Date ranges are `[[startMonth, startDay], [endMonth, endDay]]`, inclusive at
 * both ends, months 1-12. A range whose end month is earlier than its start
 * month wraps the year (Christmas runs 1 December to 1 January).
 */

export const THEMES = {
  christmas: {
    name: 'christmas',
    displayName: 'Christmas',
    emoji: '🎄',
    dates: [[12, 1], [1, 1]],
    load: () => import('./christmas.js')
  },
  valentines: {
    name: 'valentines',
    displayName: "Valentine's Day",
    emoji: '💕',
    dates: [[2, 9], [2, 14]],
    load: () => import('./valentines.js')
  },
  'st-davids': {
    name: 'st-davids',
    displayName: "St David's Day",
    emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    dates: [[2, 24], [3, 1]],
    load: () => import('./st-davids.js')
  },
  'st-patricks': {
    name: 'st-patricks',
    displayName: "St Patrick's Day",
    emoji: '☘️',
    dates: [[3, 12], [3, 17]],
    load: () => import('./st-patricks.js')
  },
  'st-georges': {
    name: 'st-georges',
    displayName: "St George's Day",
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    dates: [[4, 18], [4, 23]],
    load: () => import('./st-georges.js')
  },
  halloween: {
    name: 'halloween',
    displayName: 'Halloween',
    emoji: '🎃',
    dates: [[10, 26], [10, 31]],
    load: () => import('./halloween.js')
  },
  'guy-fawkes': {
    name: 'guy-fawkes',
    displayName: 'Guy Fawkes Night',
    emoji: '🎆',
    dates: [[11, 1], [11, 5]],
    load: () => import('./guy-fawkes.js')
  },
  'st-andrews': {
    name: 'st-andrews',
    displayName: "St Andrew's Day",
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    dates: [[11, 25], [11, 30]],
    load: () => import('./st-andrews.js')
  }
};

/**
 * Themes registered at runtime by `registerTheme()`, kept apart from the
 * built-in table so `getThemes()` can report both without a consumer's theme
 * silently shadowing a shipped one on a later release.
 */
const custom = Object.create(null);

/**
 * Add a theme at runtime.
 *
 * @param {string} name - Theme key, used by `theme:` and `setTheme()`
 * @param {Object} definition - `{ displayName, emoji, dates, module }` where
 *   `module` is the theme object itself (already loaded), or `{ ..., load }`
 *   with a loader function returning a promise for `{ default: themeObject }`
 */
export function registerTheme(name, definition) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('registerTheme: name must be a non-empty string');
  }
  if (Object.prototype.hasOwnProperty.call(THEMES, name)) {
    throw new TypeError(`registerTheme("${name}"): cannot replace a built-in theme`);
  }
  if (!definition || (!definition.module && typeof definition.load !== 'function')) {
    throw new TypeError(`registerTheme("${name}"): needs either a "module" object or a "load" function`);
  }

  custom[name] = {
    name,
    displayName: definition.displayName || name,
    emoji: definition.emoji || '',
    dates: definition.dates || null,
    load: definition.load || (() => Promise.resolve({ default: definition.module }))
  };
}

/** Remove a runtime-registered theme. Built-in themes cannot be removed. */
export function unregisterTheme(name) {
  delete custom[name];
}

/** Every known theme, built-in and runtime-registered, keyed by name. */
export function getThemes() {
  return { ...custom, ...THEMES };
}

/** One theme's descriptor, or undefined. */
export function getTheme(name) {
  return THEMES[name] || custom[name];
}

/**
 * Is `date` inside the given inclusive range?
 *
 * Split out and exported because the year-wrapping arm is the part that is
 * easy to get wrong and worth testing directly.
 *
 * @param {number[]} start - `[month, day]`, month 1-12
 * @param {number[]} end - `[month, day]`, month 1-12
 * @param {Date} [date] - defaults to now
 */
export function isDateInRange(start, end, date = new Date()) {
  const [startMonth, startDay] = start;
  const [endMonth, endDay] = end;
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (endMonth < startMonth) {
    // Wraps the year end: in range if at-or-after the start, or at-or-before
    // the end. Anything between the two is out of range.
    return (
      month > startMonth ||
      (month === startMonth && day >= startDay) ||
      month < endMonth ||
      (month === endMonth && day <= endDay)
    );
  }

  return (
    (month > startMonth || (month === startMonth && day >= startDay)) &&
    (month < endMonth || (month === endMonth && day <= endDay))
  );
}

/**
 * The theme whose window contains `date`, or null.
 *
 * Themes are checked in registry order, so an overlapping runtime-registered
 * theme wins only if it does not collide with a built-in one.
 *
 * @param {Date} [date] - defaults to now
 * @returns {string|null} Theme name
 */
export function getCurrentTheme(date = new Date()) {
  for (const [name, theme] of Object.entries(getThemes())) {
    if (theme.dates && isDateInRange(theme.dates[0], theme.dates[1], date)) {
      return name;
    }
  }
  return null;
}

/** Is any celebration in season right now? */
export function isCelebrationSeason(date = new Date()) {
  return getCurrentTheme(date) !== null;
}

/**
 * A theme's trait manifest, loading the theme if it is not already in memory.
 *
 * For a controls panel that wants to list what Christmas offers before anyone
 * has switched Christmas on.
 *
 * @param {string} name - Theme name
 * @returns {Promise<Object>} Traits keyed by name, or an empty object for an
 *   unknown theme or one that declares none
 */
export async function getThemeTraits(name) {
  const descriptor = getTheme(name);
  if (!descriptor) return {};

  try {
    const module = await descriptor.load();
    const theme = module.default || module;
    return theme.traits ? { ...theme.traits } : {};
  } catch (error) {
    console.error(`[domma-celebrate] Could not read traits for "${name}":`, error);
    return {};
  }
}
