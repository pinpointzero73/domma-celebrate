import {describe, it, expect} from 'vitest';
import {easterSunday, isEasterSeason} from './calendar.js';
import {getCurrentTheme} from './index.js';
import newYear from './new-year.js';
import easter from './easter.js';
import summer from './summer-garden.js';
import chineseNewYear from './chinese-new-year.js';
import winter from './winter.js';
import rain from './make-it-rain.js';
import money from './money-rain.js';
import graduation from './graduation.js';
import birthday from './birthday.js';
import anniversary from './anniversary.js';
import greeting from './greeting.js';
import autumn from './autumn.js';
import {prepareSparklerFont} from './sparkler-font.js';
await prepareSparklerFont('Congratulations!');
import {MEADOW_COLOURS, createGardenButterfly, updateGardenButterfly} from './butterfly-flight.js';
import {applyTraitsToConfig, resolveTraits, buildTypeIndex, allowsType} from '../core/traits.js';

describe('seasonal calendar boundaries', () => {
  it.each([[2024, 3, 31], [2025, 4, 20], [2026, 4, 5], [2027, 3, 28], [2038, 4, 25]])('Easter moves in %s', (year, month, day) => {
    const sunday = easterSunday(year);
    expect([sunday.getMonth() + 1, sunday.getDate()]).toEqual([month, day]);
    for (const [offset, active] of [[-6, false], [-5, true], [0, true], [1, true], [2, false]]) {
      const date = new Date(year, month - 1, day + offset, 23, 59);
      expect(isEasterSeason(date)).toBe(active);
      if (active) expect(getCurrentTheme(date)).toBe('easter');
    }
  });

  it.each([
    [12, 30, 'christmas'], [12, 31, 'new-year'], [1, 1, 'new-year'], [1, 2, 'new-year'], [1, 3, 'winter'],
    [5, 31, null], [6, 1, 'summer-garden'], [8, 31, 'summer-garden'], [9, 1, 'autumn']
  ])('selects %s/%s without seasonal overlap', (month, day, expected) => {
    expect(getCurrentTheme(new Date(2026, month - 1, day, 12))).toBe(expected);
  });
});

describe.each([newYear, easter, summer, chineseNewYear, winter, rain, money, graduation, birthday, anniversary, greeting, autumn])('$name artwork and controls', theme => {
  it('draws every seeded type with finite geometry and balanced canvas state at desktop and phone widths', () => {
    for (const width of [390, 1440]) {
      for (const config of Object.values(theme.intensityConfig)) {
        const items = theme.createInitialDecorations(width, 800, config);
        for (let i = 0; i < 60; i++) items.push(theme.createFallingParticle(width, 800, config));
        let depth = 0;
        let calls = 0;
        const ctx = new Proxy({globalAlpha: 1}, {get(target, key) {
          if (key in target) return target[key];
          if (key === 'createLinearGradient') return () => ({addColorStop() {}});
          return (...args) => {
            calls++;
            if (key === 'save') depth++;
            if (key === 'restore') depth--;
            expect(depth).toBeGreaterThanOrEqual(0);
            for (const arg of args) if (typeof arg === 'number') expect(Number.isFinite(arg), key).toBe(true);
          };
        }});
        theme.updateSpecialParticles?.(items, 1000, width, 800);
        for (const p of items) {
          const method = 'draw' + p.type.replace(/(^|-)([a-z])/g, (_, dash, letter) => letter.toUpperCase());
          expect(typeof theme[method], p.type).toBe('function');
          const before = structuredClone(p);
          theme[method](ctx, p, 1000);
          expect(p).toEqual(before);
          expect(depth).toBe(0);
        }
        expect(calls).toBeGreaterThan(0);
      }
    }
  });

  it('leaves no decoration when every decoration trait is disabled', () => {
    const switches = Object.fromEntries(Object.entries(theme.traits).filter(([, trait]) => trait.kind !== 'particle').map(([name]) => [name, false]));
    const traits = resolveTraits(theme, switches);
    const config = applyTraitsToConfig(theme.intensityConfig.medium, traits);
    const index = buildTypeIndex(traits);
    const items = theme.createInitialDecorations(800, 600, config).filter(p => allowsType(index, p.type, true));
    expect(items).toEqual([]);
    if (theme.spawnSpecialParticle) expect(theme.spawnSpecialParticle([], 800, 600, config)).toBeNull();
  });
});

it('fireworks expire and cannot accumulate without limit', () => {
  const items = Array.from({length: 3}, () => newYear.createFirework(800, 600));
  expect(newYear.spawnSpecialParticle(items, 800, 600, {...newYear.intensityConfig.heavy, fireworkChance: 1})).toBeNull();
  newYear.updateSpecialParticles(items, 2200);
  expect(items.every(p => !p.active)).toBe(true);
});

it('garden insects return after leaving the right edge', () => {
  for (const theme of [easter, summer]) {
    const items = theme.createInitialDecorations(390, 800, theme.intensityConfig.medium);
    const insects = items.filter(p => p.type === 'garden-butterfly');
    expect(insects.length).toBeGreaterThan(0);
    insects.forEach(p => {p.x = 450;});
    theme.updateSpecialParticles(items, 16, 390, 800);
    expect(insects.every(p => p.x === -35 && p.active)).toBe(true);
  }
});

it('garden butterflies use the existing meadow colours, wingbeats and rising flight', () => {
  const p = createGardenButterfly(800, 600);
  expect(MEADOW_COLOURS).toContain(p.colourUpper);
  expect(MEADOW_COLOURS).toContain(p.colourLower);
  const y = p.y, flap = p.flapPhase;
  for (let i = 0; i < 60; i++) updateGardenButterfly(p, 1000 / 60, 800, 600);
  expect(p.y).toBeLessThan(y); expect(p.flapPhase).toBeGreaterThan(flap);
  expect(Number.isFinite(p.heading)).toBe(true);
});

it('bees reach flower heads, pause to visit, then choose the next flower', () => {
  const items = summer.createInitialDecorations(800, 600, summer.intensityConfig.medium);
  const bee = items.find(p => p.type === 'bee');
  const flowers = items.filter(p => p.type === 'flower');
  const target = flowers[bee.targetIndex];
  const initialDistance = Math.hypot(bee.x - target.x, bee.y - target.y);
  for (let i = 0; i < 1000 && bee.state !== 'visiting'; i++) summer.updateSpecialParticles(items, 16, 800);
  expect(bee.state).toBe('visiting');
  expect(Math.abs(bee.x - target.x)).toBeLessThan(bee.size);
  expect(Math.abs(bee.y - (target.y - target.size * 1.45))).toBeLessThan(bee.size);
  expect(initialDistance).toBeGreaterThan(0);
  const index = bee.targetIndex;
  for (let i = 0; i < 101; i++) summer.updateSpecialParticles(items, 16, 800);
  expect(bee.targetIndex).toBe((index + 1) % flowers.length);
});

it('bees keep flying when flowers are disabled', () => {
  const items = summer.createInitialDecorations(390, 800, {...summer.intensityConfig.medium, flowers: 0});
  const bee = items.find(p => p.type === 'bee');
  const before = bee.x;
  summer.updateSpecialParticles(items, 16, 390);
  expect(bee.x).not.toBe(before);
  expect(Number.isFinite(bee.x) && Number.isFinite(bee.y)).toBe(true);
});

it('bunny hops rise, land and stay on the page through repeated turns', () => {
  const items = easter.createInitialDecorations(390, 800, easter.intensityConfig.medium);
  const bunny = items.find(p => p.type === 'bunny');
  const start = bunny.x;
  let airborne = false, moved = false;
  for (let i = 0; i < 8000; i++) {
    easter.updateSpecialParticles(items, 16, 390);
    if (bunny.y < bunny.baseY - 2) airborne = true;
    if (Math.abs(bunny.x - start) > 10) moved = true;
    expect(bunny.x).toBeGreaterThan(0);
    expect(bunny.x).toBeLessThan(390);
    if (!bunny.hopping) expect(bunny.y).toBe(bunny.baseY);
  }
  expect(airborne && moved).toBe(true);
});
