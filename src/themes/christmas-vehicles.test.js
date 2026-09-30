import { describe, it, expect } from 'vitest';
import { drawSleigh, drawTrain } from './christmas-vehicles.js';
import { drawTree, drawWreath, drawRobin, drawElf, drawSnowman } from './christmas-festive.js';

// Record the canvas boundary: bad coordinates and leaked transforms can break
// every particle drawn after a vehicle, even when the vehicle looks correct.
function context() {
  const calls = [];
  let depth = 0;
  const ctx = new Proxy({ globalAlpha: 0.6 }, {
    get(target, key) {
      if (key in target) return target[key];
      if (key === 'createLinearGradient' || key === 'createRadialGradient') {
        return () => ({ addColorStop() {} });
      }
      return (...args) => {
        for (const value of args) if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
        if (key === 'save') depth++;
        if (key === 'restore') { depth--; expect(depth).toBeGreaterThanOrEqual(0); }
        calls.push([key, ...args]);
      };
    }
  });
  return { ctx, calls, depth: () => depth };
}
const sleigh = { x: 200, baseY: 180, size: 20, startX: -100, targetX: 1000, arcHeight: 100, time: 500, opacity: 0.9 };
const train = { x: 400, y: 220, size: 25, time: 500, carriages: 3, opacity: 0.9, smoke: [{ x: 430, y: 120, size: 12, opacity: 0.5 }] };

describe('Christmas vehicle drawing', () => {
  for (const [name, draw, particle] of [['sleigh', drawSleigh, sleigh], ['train', drawTrain, train]]) {
    it.each([-1, 1])(`${name} mirrors the complete drawing in direction %s and balances canvas state`, (direction) => {
      const c = context();
      const input = { ...particle, vx: direction };
      const before = structuredClone(input);
      draw(c.ctx, input);
      expect(c.depth()).toBe(0);
      expect(Math.sign(c.calls.find(([key]) => key === 'scale')[1])).toBe(direction);
      expect(input).toEqual(before);
    });
    it(`${name} skips invalid coordinates without altering canvas state`, () => {
      const c = context();
      draw(c.ctx, { ...particle, x: NaN, vx: 1 });
      expect(c.calls).toEqual([]);
    });
  }
  it('handles a stationary sleigh with coincident flight endpoints', () => {
    const c = context();
    drawSleigh(c.ctx, { ...sleigh, vx: 0, startX: 200, targetX: 200 });
    expect(c.calls.length).toBeGreaterThan(0);
    expect(c.depth()).toBe(0);
  });
});


describe('Christmas decoration drawing', () => {
  for (const draw of [drawTree, drawWreath, drawRobin, drawElf, drawSnowman]) {
    it(`${draw.name} draws finite geometry and restores canvas state`, () => {
      const c = context();
      const particle = {x: 40, y: 50, size: 20, time: 500, vx: -1, opacity: 0.8, state: 'sitting'};
      const before = structuredClone(particle);
      draw(c.ctx, particle, 500);
      expect(c.calls.length).toBeGreaterThan(0);
      expect(c.depth()).toBe(0);
      expect(particle).toEqual(before);
    });
    it(`${draw.name} skips a zero-size decoration`, () => {
      const c = context();
      draw(c.ctx, {x: 40, y: 50, size: 0});
      expect(c.calls).toEqual([]);
    });
  }
});
