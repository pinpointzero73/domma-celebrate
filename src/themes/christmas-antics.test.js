import {describe, it, expect, vi, afterEach} from 'vitest';
import christmas from './christmas.js';
import {spawnElfAntic, updateElfAntic} from './christmas-antics.js';
import {resolveTraits, applyTraitsToConfig} from '../core/traits.js';

afterEach(() => vi.restoreAllMocks());
const tree = () => christmas.createTree(1000, 600, {x: 400, y: 500});
const tick = (elf, duration, width = 1000) => {
  for (let t = 0; t < duration; t += 50) { elf.time += 50; updateElfAntic(elf, 50, width); }
};
describe('opt-in Christmas antics', () => {
  it('both are disabled in every default intensity and cannot spawn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const traits = resolveTraits(christmas);
    expect(traits.peeingElf.enabled).toBe(false);
    expect(traits.thievingElf.enabled).toBe(false);
    for (const config of Object.values(christmas.intensityConfig)) {
      const effective = applyTraitsToConfig(config, traits);
      expect(effective.peeingElfChance).toBe(0);
      expect(effective.thievingElfChance).toBe(0);
      expect(spawnElfAntic([tree()], 1000, 600, effective)).toBeNull();
    }
  });
  it.each([true, 1, {enabled: true}])('explicit setting %j enables the trait', (setting) => {
    const traits = resolveTraits(christmas, {peeingElf: setting});
    expect(traits.peeingElf.enabled).toBe(true);
    expect(applyTraitsToConfig(christmas.intensityConfig.light, traits).peeingElfChance).toBeGreaterThan(0);
    expect(traits.thievingElf.enabled).toBe(false);
  });
  it('the thief reserves one real gift, takes it after grabbing, and exits', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const target = tree();
    const elf = spawnElfAntic([target], 1000, 600, {thievingElfChance: 1});
    expect(elf.gift).toBe(target.gifts[0]);
    expect(elf.gift.reserved).toBe(true);
    expect(elf.gift.stolen).toBe(false);
    tick(elf, 3000);
    expect(elf.state).toBe('grabbing');
    expect(elf.gift.stolen).toBe(false);
    tick(elf, 500);
    expect(elf.state).toBe('escaping');
    expect(target.gifts[0].stolen).toBe(true);
    expect(target.gifts.slice(1).every(g => !g.stolen)).toBe(true);
    tick(elf, 5000);
    expect(elf.active).toBe(false);
  });
  it('cannot steal without a tree or from an empty tree', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(spawnElfAntic([], 1000, 600, {thievingElfChance: 1})).toBeNull();
    const target = tree(); target.gifts.forEach(g => g.stolen = true);
    expect(spawnElfAntic([target], 1000, 600, {thievingElfChance: 1})).toBeNull();
  });
  it('cancels a theft safely if its target disappears', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const target = tree();
    const elf = spawnElfAntic([target], 1000, 600, {thievingElfChance: 1});
    target.active = false; tick(elf, 50);
    expect(elf.active).toBe(false); expect(elf.gift.reserved).toBe(false);
    expect(elf.gift.stolen).toBe(false);
  });
  it('tree gift state belongs to each tree and is reset on a new tree', () => {
    const first = tree(), second = tree();
    first.gifts[0].stolen = true;
    expect(second.gifts[0].stolen).toBe(false);
    expect(tree().gifts.every(g => !g.stolen)).toBe(true);
  });
  it('the peeing elf approaches, pauses, then leaves; only one scene at a time', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const elf = spawnElfAntic([], 1000, 600, {peeingElfChance: 1});
    expect(spawnElfAntic([elf], 1000, 600, {peeingElfChance: 1})).toBeNull();
    tick(elf, 11000); expect(elf.state).toBe('peeing');
    tick(elf, 4500); expect(elf.state).toBe('escaping');
    tick(elf, 10000); expect(elf.active).toBe(false);
  });
});
