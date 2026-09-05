import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  resolveTraits,
  buildTypeIndex,
  applyTraitsToConfig,
  allowsType,
  allParticleTraitsDisabled,
  globalEffectsEnabled
} from './core/traits.js';

const theme = {
  traits: {
    snowflake: { label: 'Snowflakes', types: ['snowflake'], kind: 'particle' },
    tree: { label: 'Trees', types: ['tree'], count: 'trees' },
    sleigh: { label: "Santa's sleigh", types: ['sleigh'] },
    cupid: { label: 'Cupid', types: ['cupid'], chance: 'cupidChance' },
    lightning: { label: 'Lightning', global: true }
  }
};

const config = { count: 150, trees: 6, cupidChance: 0.0005 };

afterEach(() => vi.restoreAllMocks());

describe('resolveTraits', () => {
  it('defaults everything on at full density', () => {
    const traits = resolveTraits(theme);
    expect(Object.keys(traits)).toHaveLength(5);
    for (const trait of Object.values(traits)) {
      expect(trait.enabled).toBe(true);
      expect(trait.density).toBe(1);
    }
  });

  it('accepts the four setting shapes', () => {
    const traits = resolveTraits(theme, {
      snowflake: true,
      tree: 0.5,
      sleigh: false,
      cupid: { enabled: true, density: 2 }
    });

    expect(traits.snowflake).toMatchObject({ enabled: true, density: 1 });
    expect(traits.tree).toMatchObject({ enabled: true, density: 0.5 });
    expect(traits.sleigh).toMatchObject({ enabled: false });
    expect(traits.cupid).toMatchObject({ enabled: true, density: 2 });
  });

  it('treats a density of zero as off', () => {
    expect(resolveTraits(theme, { tree: 0 }).tree.enabled).toBe(false);
    expect(resolveTraits(theme, { tree: { density: 0 } }).tree.enabled).toBe(false);
  });

  it('ignores settings for traits the theme does not have', () => {
    const traits = resolveTraits(theme, { pumpkin: false });
    expect(traits.pumpkin).toBeUndefined();
    expect(traits.tree.enabled).toBe(true);
  });

  it('survives a theme with no manifest at all', () => {
    expect(resolveTraits({}, { anything: false })).toEqual({});
    expect(resolveTraits(null)).toEqual({});
  });
});

describe('applyTraitsToConfig', () => {
  it('leaves the config object untouched when nothing changes', () => {
    expect(applyTraitsToConfig(config, resolveTraits(theme))).toBe(config);
  });

  it('zeroes the count and chance keys of a disabled trait', () => {
    const next = applyTraitsToConfig(config, resolveTraits(theme, { tree: false, cupid: false }));
    expect(next.trees).toBe(0);
    expect(next.cupidChance).toBe(0);
    expect(next.count).toBe(150);
    expect(config.trees).toBe(6); // the original is never mutated
  });

  it('scales a count to a whole number and a chance as a fraction', () => {
    const next = applyTraitsToConfig(config, resolveTraits(theme, { tree: 0.5, cupid: 0.5 }));
    expect(next.trees).toBe(3);
    expect(next.cupidChance).toBe(0.00025);
  });

  it('rounds rather than floors, so half of three trees is two', () => {
    const next = applyTraitsToConfig({ trees: 3 }, resolveTraits(theme, { tree: 0.5 }));
    expect(next.trees).toBe(2);
  });

  it('can turn a trait up', () => {
    expect(applyTraitsToConfig(config, resolveTraits(theme, { tree: 2 })).trees).toBe(12);
  });

  it('ignores a config key the theme never defined', () => {
    const next = applyTraitsToConfig({ count: 10 }, resolveTraits(theme, { tree: 0.5 }));
    expect(next).toEqual({ count: 10 });
  });
});

describe('allowsType', () => {
  it('passes an enabled type and blocks a disabled one', () => {
    const index = buildTypeIndex(resolveTraits(theme, { sleigh: false }));
    expect(allowsType(index, 'snowflake')).toBe(true);
    expect(allowsType(index, 'sleigh')).toBe(false);
  });

  it('passes a type no trait claims', () => {
    // A theme may emit an incidental particle its manifest does not list.
    // Dropping it would be a worse failure than showing something unnamed.
    const index = buildTypeIndex(resolveTraits(theme));
    expect(allowsType(index, 'reindeer')).toBe(true);
    expect(allowsType(index, undefined)).toBe(true);
  });

  it('rolls against density only when asked, and only without a config key', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const index = buildTypeIndex(resolveTraits(theme, { sleigh: 0.5, tree: 0.5 }));

    // No config key, so density has to be applied here: 0.9 fails a 0.5 roll.
    expect(allowsType(index, 'sleigh', true)).toBe(false);
    // A count key already thinned the trees in the config, so applying the
    // density again here would halve them twice over.
    expect(allowsType(index, 'tree', true)).toBe(true);
    // And without the flag, density is nobody's business.
    expect(allowsType(index, 'sleigh')).toBe(true);
  });
});

describe('whole-layer shortcuts', () => {
  it('spots when every particle trait is off', () => {
    expect(allParticleTraitsDisabled(resolveTraits(theme))).toBe(false);
    expect(allParticleTraitsDisabled(resolveTraits(theme, { snowflake: false }))).toBe(true);
  });

  it('does not claim a theme with no particle traits is fully disabled', () => {
    expect(allParticleTraitsDisabled(resolveTraits({ traits: { moon: { types: ['moon'] } } }))).toBe(false);
  });

  it('gates the global drawing pass on its trait', () => {
    expect(globalEffectsEnabled(resolveTraits(theme))).toBe(true);
    expect(globalEffectsEnabled(resolveTraits(theme, { lightning: false }))).toBe(false);
    expect(globalEffectsEnabled(resolveTraits(theme, { sleigh: false }))).toBe(true);
  });
});
