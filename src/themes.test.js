import { describe, it, expect } from 'vitest';
import {
  THEMES,
  getThemes,
  getTheme,
  getCurrentTheme,
  isCelebrationSeason,
  isDateInRange,
  registerTheme,
  unregisterTheme,
  getThemeTraits
} from './themes/index.js';

/**
 * Dates are the whole premise of this library - a theme that shows up in the
 * wrong week is the failure mode that matters - so they are pinned rather than
 * left to whatever day the suite happens to run on.
 */
const on = (month, day) => new Date(2026, month - 1, day, 12, 0, 0);

describe('date ranges', () => {
  it('includes both endpoints', () => {
    expect(isDateInRange([10, 26], [10, 31], on(10, 26))).toBe(true);
    expect(isDateInRange([10, 26], [10, 31], on(10, 31))).toBe(true);
  });

  it('excludes the day either side', () => {
    expect(isDateInRange([10, 26], [10, 31], on(10, 25))).toBe(false);
    expect(isDateInRange([10, 26], [10, 31], on(11, 1))).toBe(false);
  });

  // The arm that is easy to get wrong, and the reason it is exported.
  it('wraps the year end', () => {
    expect(isDateInRange([12, 1], [1, 1], on(12, 1))).toBe(true);
    expect(isDateInRange([12, 1], [1, 1], on(12, 25))).toBe(true);
    expect(isDateInRange([12, 1], [1, 1], on(1, 1))).toBe(true);
    expect(isDateInRange([12, 1], [1, 1], on(1, 2))).toBe(false);
    expect(isDateInRange([12, 1], [1, 1], on(6, 15))).toBe(false);
  });

  it('spans a month boundary without wrapping', () => {
    expect(isDateInRange([2, 24], [3, 1], on(2, 24))).toBe(true);
    expect(isDateInRange([2, 24], [3, 1], on(2, 28))).toBe(true);
    expect(isDateInRange([2, 24], [3, 1], on(3, 1))).toBe(true);
    expect(isDateInRange([2, 24], [3, 1], on(3, 2))).toBe(false);
  });
});

describe('current theme', () => {
  it.each([
    ['christmas', on(12, 25)],
    ['christmas', on(1, 1)],
    ['valentines', on(2, 14)],
    ['st-davids', on(3, 1)],
    ['st-patricks', on(3, 17)],
    ['st-georges', on(4, 23)],
    ['halloween', on(10, 31)],
    ['guy-fawkes', on(11, 5)],
    ['st-andrews', on(11, 30)]
  ])('resolves %s', (expected, date) => {
    expect(getCurrentTheme(date)).toBe(expected);
  });

  it('is null on an ordinary day', () => {
    expect(getCurrentTheme(on(7, 15))).toBeNull();
    expect(isCelebrationSeason(on(7, 15))).toBe(false);
  });

  it('leaves no gap between St Andrew\'s and Christmas', () => {
    // 30 November is St Andrew's, 1 December is Christmas. A one-day hole here
    // would be invisible except to whoever loaded the site on the 1st.
    expect(getCurrentTheme(on(11, 30))).toBe('st-andrews');
    expect(getCurrentTheme(on(12, 1))).toBe('christmas');
  });
});

describe('registry', () => {
  it('accepts a runtime theme and drops it again', () => {
    registerTheme('midsummer', {
      displayName: 'Midsummer',
      dates: [[6, 20], [6, 24]],
      module: { name: 'midsummer', intensityConfig: { medium: { count: 1 } } }
    });

    expect(getCurrentTheme(on(6, 21))).toBe('midsummer');
    expect(getTheme('midsummer').displayName).toBe('Midsummer');

    unregisterTheme('midsummer');
    expect(getCurrentTheme(on(6, 21))).toBeNull();
  });

  it('rejects a definition with nothing to load', () => {
    expect(() => registerTheme('broken', {})).toThrow(/module.*load/);
  });
});

describe('shipped themes', () => {
  const names = Object.keys(THEMES);

  it('all eight are registered', () => {
    expect(names).toHaveLength(8);
    expect(getThemes()).toEqual(expect.objectContaining(THEMES));
  });

  it.each(names)('%s loads and declares what it draws', async name => {
    const module = await THEMES[name].load();
    const theme = module.default;

    expect(theme.name).toBe(name);
    expect(theme.intensityConfig.light).toBeDefined();
    expect(theme.intensityConfig.medium).toBeDefined();
    expect(theme.intensityConfig.heavy).toBeDefined();
    expect(Object.keys(theme.traits).length).toBeGreaterThan(0);
  });

  /**
   * The check that keeps the trait manifests honest.
   *
   * A trait naming `count: 'trees'` only does anything if the theme's
   * intensity blocks actually carry a `trees` key - mistype it and the trait
   * silently loses its density control while still looking configured. Nothing
   * else in the system would notice.
   */
  it.each(names)('%s trait config keys exist in its intensity blocks', async name => {
    const theme = (await THEMES[name].load()).default;
    const levels = Object.values(theme.intensityConfig);

    for (const [trait, definition] of Object.entries(theme.traits)) {
      for (const key of [definition.count, definition.chance]) {
        if (!key) continue;
        const present = levels.some(level => typeof level[key] === 'number');
        expect(present, `${name}.${trait} names config key "${key}", which no intensity block defines`).toBe(true);
      }
    }
  });

  it.each(names)('%s traits claim no type twice', async name => {
    const theme = (await THEMES[name].load()).default;
    const seen = new Map();

    for (const [trait, definition] of Object.entries(theme.traits)) {
      for (const type of definition.types || []) {
        expect(seen.has(type), `"${type}" is claimed by both ${seen.get(type)} and ${trait}`).toBe(false);
        seen.set(type, trait);
      }
    }
  });

  it('reports a theme\'s traits without an instance', async () => {
    const traits = await getThemeTraits('christmas');
    expect(traits.train.label).toBe('Steam train');
    expect(traits.sleigh.types).toEqual(['sleigh']);
  });

  it('returns an empty manifest for an unknown theme', async () => {
    expect(await getThemeTraits('diwali')).toEqual({});
  });
});
