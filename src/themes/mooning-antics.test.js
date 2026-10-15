import {describe, it, expect, vi, afterEach} from 'vitest';
import christmas from './christmas.js';
import irish from './st-patricks.js';
import {resolveTraits, applyTraitsToConfig} from '../core/traits.js';
import {spawnMooningCharacter, updateMooningCharacter} from './mooning-antics.js';
import {drawMooningElf, drawMooningLeprechaun} from './mooning-drawing.js';

afterEach(() => vi.restoreAllMocks());
describe('optional mooning scenes', () => {
  for (const [theme, name, type, chance] of [[christmas, 'mooningElf', 'mooning-elf', 'mooningElfChance'], [irish, 'mooningLeprechaun', 'mooning-leprechaun', 'mooningLeprechaunChance']]) {
    it(`${type} is disabled at every intensity and must be opted into`, () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      for (const config of Object.values(theme.intensityConfig)) {
        const defaults = applyTraitsToConfig(config, resolveTraits(theme));
        expect(spawnMooningCharacter([], 400, 300, defaults, type, chance)).toBeNull();
        const enabled = applyTraitsToConfig(config, resolveTraits(theme, {[name]: true}));
        const particle = spawnMooningCharacter([], 400, 300, enabled, type, chance);
        expect(particle.state).toBe('approaching');
        expect(spawnMooningCharacter([particle], 400, 300, enabled, type, chance)).toBeNull();
        for (let i = 0; i < 200; i++) updateMooningCharacter(particle, 50, 400);
        expect(particle.state).toBe('escaping');
        for (let i = 0; i < 200; i++) updateMooningCharacter(particle, 50, 400);
        expect(particle.active).toBe(false);
      }
    });
  }
  for (const draw of [drawMooningElf, drawMooningLeprechaun]) {
    it(`${draw.name} draws finite geometry, preserves its particle and balances transforms`, () => {
      let depth = 0;
      const ctx = new Proxy({globalAlpha: 1}, {get(target, name) {
        if (name in target) return target[name];
        if (name === 'createLinearGradient') return () => ({addColorStop() {}});
        return (...args) => {
          for (const n of args) if (typeof n === 'number') expect(Number.isFinite(n)).toBe(true);
          if (name === 'save') depth++; if (name === 'restore') depth--;
        };
      }});
      const p = {x: 50, y: 50, size: 30, vx: -1, state: 'mooning', time: 2000};
      const before = structuredClone(p); draw(ctx, p); expect(depth).toBe(0); expect(p).toEqual(before);
    });
  }
});
