import {prepareSparklerFont} from './sparkler-font.js';
await prepareSparklerFont('custom');
import {describe, it, expect} from 'vitest';
import {createSparklerMessage, updateSparklerMessage, drawSparklerMessage, sparklerPoint, SPARKLER_TIMING, SPARKLER_CYCLE} from './sparkler-writing.js';
import {chineseNewYear, isChineseNewYearSeason} from './calendar.js';
import {getCurrentTheme} from './index.js';

describe('sparkler handwriting', () => {
  for (const style of ['stroke', 'cursive']) for (const colour of ['gold', 'silver']) {
    for (const message of ['Merry Christmas', 'Happy New Year', '新年快乐']) {
      it.each([320, 1440])(`${style} ${colour} ${message} has finite, responsive strokes at %spx`, width => {
        for (const greeting of ['default', 'best-wishes']) {
          const p = createSparklerMessage(message, width, 800, {style, colour, greeting, year: 2027});
          expect(p.message).toBe(greeting === 'best-wishes' ? 'Best wishes for 2027!' : message);
          expect(p.style).toBe(style); expect(p.colour).toBe(colour);
          expect(p.segments.length).toBeGreaterThan(10);
          for (const segment of p.segments) for (const [x, y] of [segment.from, segment.to]) {
            expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
            expect(p.x + x * p.size).toBeGreaterThanOrEqual(20);
            expect(p.x + x * p.size).toBeLessThan(width - 20);
            expect(p.y + y * p.size).toBeLessThan(300);
          }
        }
      });
    }
  }

  it('invalid settings fall back to gold stroke lettering and a safe current year', () => {
    const p = createSparklerMessage('Happy New Year', 800, 600, {style: '<script>', colour: 'url(x)', greeting: 'best-wishes', year: '2027<script>'});
    expect(p.style).toBe('stroke'); expect(p.colour).toBe('gold');
    expect(p.message).toBe(`Best wishes for ${new Date().getFullYear()}!`);
  });

  it.each(['gold', 'silver'])('%s uses its own spark and glow palette with finite drawing geometry', colour => {
    const p = createSparklerMessage('Best wishes for 2027!', 1440, 900, {style: 'cursive', colour});
    p.age = 4000;
    const paints = new Set();
    let depth = 0;
    const ctx = new Proxy({globalAlpha: 1}, {
      set(target, key, value) {if (['fillStyle', 'strokeStyle', 'shadowColor'].includes(key)) paints.add(value); target[key] = value; return true;},
      get(target, key) {
        if (key in target) return target[key];
        return (...args) => {
          if (key === 'save') depth++; if (key === 'restore') depth--;
          for (const value of args) if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
        };
      }
    });
    drawSparklerMessage(ctx, p);
    expect(depth).toBe(0);
    expect(paints.has(colour === 'silver' ? '#c1dfff' : '#ffb746')).toBe(true);
    expect(paints.has(colour === 'silver' ? '#ffb746' : '#c1dfff')).toBe(false);
  });
  for (const message of ['Happy New Year', 'Merry Christmas']) {
    it.each([320, 390, 1440])(`${message} stays in the sky at %spx`, width => {
      const p = createSparklerMessage(message, width, 800);
      expect(p.lines).toBe(width < 600 ? 2 : 1);
      for (const segment of p.segments) for (const [x, y] of [segment.from, segment.to]) {
        expect(p.x + x * p.size).toBeGreaterThanOrEqual(20);
        expect(p.x + x * p.size).toBeLessThan(width - 20);
        expect(p.y + y * p.size).toBeGreaterThan(0);
        expect(p.y + y * p.size).toBeLessThan(260);
      }
      expect(sparklerPoint(p, 1)).toEqual(p.segments.at(-1).to);
    });
  }

  it('advances by elapsed time and cycles without accumulating particles', () => {
    const one = createSparklerMessage('Happy New Year', 1440, 900);
    const many = createSparklerMessage('Happy New Year', 1440, 900);
    updateSparklerMessage(one, 1600);
    for (let i = 0; i < 100; i++) updateSparklerMessage(many, 16);
    expect(one.age).toBe(many.age);
    const geometry = one.segments;
    updateSparklerMessage(one, SPARKLER_CYCLE);
    expect(one.age).toBe(1600);
    expect(one.segments).toBe(geometry);
  });

  it('reveals strokes progressively, rests between greetings and preserves state while drawing', () => {
    const p = createSparklerMessage('Merry Christmas', 1440, 900);
    let depth = 0, calls = [];
    const ctx = new Proxy({globalAlpha: 1}, {get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        if (key === 'save') depth++;
        if (key === 'restore') depth--;
        expect(depth).toBeGreaterThanOrEqual(0);
        for (const n of args) if (typeof n === 'number') expect(Number.isFinite(n)).toBe(true);
        calls.push(key);
      };
    }});
    drawSparklerMessage(ctx, p); expect(calls).toHaveLength(0);
    p.age = SPARKLER_TIMING.delay + 300;
    const before = structuredClone(p);
    drawSparklerMessage(ctx, p);
    expect(p).toEqual(before); expect(depth).toBe(0);
    const earlyStrokes = calls.filter(key => key === 'lineTo').length;
    calls = []; p.age = SPARKLER_TIMING.delay + SPARKLER_TIMING.write + 1000;
    drawSparklerMessage(ctx, p);
    expect(calls.filter(key => key === 'lineTo').length).toBeGreaterThan(earlyStrokes);
    calls = []; p.age = SPARKLER_CYCLE - 100;
    drawSparklerMessage(ctx, p); expect(calls).toHaveLength(0);
  });
});

describe('Chinese New Year follows the lunar calendar', () => {
  it.each([[2024, 2, 10], [2025, 1, 29], [2026, 2, 17], [2027, 2, 6], [2028, 1, 26]])('%s starts on %s/%s and lasts seven local days', (year, month, day) => {
    const start = chineseNewYear(year);
    expect([start.getMonth() + 1, start.getDate()]).toEqual([month, day]);
    for (const [offset, active] of [[-1, false], [0, true], [6, true], [7, false]]) {
      const date = new Date(year, month - 1, day + offset, 23, 59);
      expect(isChineseNewYearSeason(date)).toBe(active);
      if (active) expect(getCurrentTheme(date)).toBe('chinese-new-year');
    }
  });
});

describe('custom sparkler messages', () => {
  for (const style of ['stroke', 'cursive']) it(`${style} supports names, accents, punctuation and year substitution`, () => {
    const p = createSparklerMessage('Happy New Year', 320, 700, {
      message: '  Congratulations, Chloé & José! Best wishes for {year}!  ', style, colour: 'silver', year: 2027
    });
    expect(p.message).toBe('Congratulations, Chloé & José! Best wishes for 2027!');
    expect(p.segments.length).toBeGreaterThan(100);
    for (const segment of p.segments) for (const [x, y] of [segment.from, segment.to]) {
      expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
      expect(p.x + x * p.size).toBeGreaterThanOrEqual(19);
      expect(p.x + x * p.size).toBeLessThanOrEqual(301);
    }
  });
  it('caps free text at 120 characters', () => {
    const p = createSparklerMessage('', 320, 700, {message: 'a'.repeat(200), style: 'cursive'});
    expect([...p.message]).toHaveLength(120);
  });
});
