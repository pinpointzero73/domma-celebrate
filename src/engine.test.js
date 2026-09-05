import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Celebrations } from './core/engine.js';
import { registerTheme, unregisterTheme } from './themes/index.js';

/**
 * jsdom has no 2D context, and `getContext()` returning null would take the
 * whole engine down before any of this could be tested. A recording stub stands
 * in: nothing here asserts on pixels, only on which draw methods the engine
 * chose to call and with what.
 */
function stubCanvas() {
  const noop = () => {};
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: noop, save: noop, restore: noop, beginPath: noop, closePath: noop,
    arc: noop, fill: noop, stroke: noop, moveTo: noop, lineTo: noop, rect: noop,
    fillRect: noop, strokeRect: noop, translate: noop, rotate: noop, scale: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, ellipse: noop, clip: noop,
    setTransform: noop, drawImage: noop, fillText: noop, strokeText: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    measureText: () => ({ width: 0 })
  });
}

/**
 * A theme small enough to reason about, exercising each mechanism once: a
 * falling particle, a decoration driven by a config count, a decoration the
 * theme spawns on hardcoded odds, and a global drawing pass.
 */
function testTheme(overrides = {}) {
  return {
    name: 'test',
    displayName: 'Test',
    intensityConfig: {
      light: { count: 10, speedRange: [1, 2], sizeRange: [1, 2], trees: 2 },
      medium: { count: 20, speedRange: [1, 2], sizeRange: [1, 2], trees: 6 },
      heavy: { count: 40, speedRange: [1, 2], sizeRange: [1, 2], trees: 10 }
    },
    traits: {
      flake: { label: 'Flakes', types: ['flake'], kind: 'particle' },
      tree: { label: 'Trees', types: ['tree'], count: 'trees' },
      train: { label: 'Train', types: ['train'] },
      lightning: { label: 'Lightning', global: true }
    },
    createFallingParticle: (width, height) => ({
      type: 'flake', x: Math.random() * width, y: -10,
      size: 2, speed: 1, opacity: 1, rotation: 0, rotationSpeed: 0
    }),
    createInitialDecorations: (width, height, config) =>
      Array.from({ length: config.trees }, (unused, index) => ({
        type: 'tree', x: index * 20, y: 10, size: 10, opacity: 1, active: true, static: true
      })),
    spawnSpecialParticle: () => ({
      type: 'train', x: 0, y: 10, vx: 1, vy: 0, size: 10, opacity: 1, active: true, static: false
    }),
    drawFlake: vi.fn(),
    drawTree: vi.fn(),
    drawTrain: vi.fn(),
    drawGlobalEffects: vi.fn(),
    ...overrides
  };
}

let instance = null;

function build(options = {}, theme = testTheme()) {
  registerTheme('test', { displayName: 'Test', module: theme });
  instance = new Celebrations({ theme: 'test', enabled: false, mobileReduction: 1, ...options });
  return instance;
}

beforeEach(() => {
  stubCanvas();
  window.innerWidth = 1200;
  window.innerHeight = 800;
  // jsdom keeps one window for the whole file, and a direct assignment is not
  // something restoreAllMocks can undo - so the reduced-motion tests would
  // otherwise leave every later test standing down.
  window.matchMedia = () => ({ matches: false });
});

afterEach(() => {
  if (instance) instance.destroy();
  instance = null;
  unregisterTheme('test');
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('lifecycle', () => {
  it('builds a canvas and seeds the theme', async () => {
    const celebrations = build();
    expect(await celebrations.init()).toBe(true);

    expect(document.querySelectorAll('canvas')).toHaveLength(1);
    expect(celebrations.particles).toHaveLength(20);
    expect(celebrations.specialParticles).toHaveLength(6);
    expect(celebrations.getState()).toMatchObject({
      enabled: false, initialized: true, theme: 'test', intensity: 'medium'
    });
  });

  it('refuses an unknown theme without throwing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const celebrations = new Celebrations({ theme: 'diwali', enabled: false });
    expect(await celebrations.init()).toBe(false);
    expect(document.querySelectorAll('canvas')).toHaveLength(0);
    expect(spy).toHaveBeenCalled();
  });

  it('stands down for a visitor who asked for reduced motion', async () => {
    window.matchMedia = () => ({ matches: true });
    const celebrations = build();

    expect(await celebrations.init()).toBe(false);
    expect(celebrations.reducedMotion).toBe(true);
    expect(document.querySelectorAll('canvas')).toHaveLength(0);
  });

  it('honours respectMotionPreference: false', async () => {
    window.matchMedia = () => ({ matches: true });
    const celebrations = build({ respectMotionPreference: false });

    expect(await celebrations.init()).toBe(true);
    expect(document.querySelectorAll('canvas')).toHaveLength(1);
  });

  it('takes the canvas away again on destroy', async () => {
    const celebrations = build();
    await celebrations.init();
    celebrations.destroy();

    expect(document.querySelectorAll('canvas')).toHaveLength(0);
    expect(celebrations.initialized).toBe(false);
    expect(celebrations.particles).toHaveLength(0);
    instance = null;
  });

  /**
   * The bug this package was extracted with: `setTheme()` built a fresh
   * CanvasManager every time, so each switch left another canvas and another
   * pair of resize listeners behind. Four switches, five canvases.
   */
  it('reuses one canvas across theme changes', async () => {
    const celebrations = build();
    await celebrations.init();

    registerTheme('other', { displayName: 'Other', module: testTheme({ name: 'other' }) });
    await celebrations.setTheme('other');
    await celebrations.setTheme('test');
    await celebrations.setTheme('other');
    unregisterTheme('other');

    expect(document.querySelectorAll('canvas')).toHaveLength(1);
  });

  it('keeps the old theme when the new one will not load', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const celebrations = build();
    await celebrations.init();

    expect(await celebrations.setTheme('diwali')).toBe(false);
    expect(celebrations.currentTheme).toBe('test');
    expect(celebrations.specialParticles.length).toBeGreaterThan(0);
    expect(spy).toHaveBeenCalled();
  });
});

describe('intensity', () => {
  it('reseeds from the new level', async () => {
    const celebrations = build();
    await celebrations.init();

    celebrations.setIntensity('heavy');
    expect(celebrations.particles).toHaveLength(40);
    expect(celebrations.specialParticles).toHaveLength(10);
  });

  it('rejects a level that is not one of the three', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const celebrations = build();
    await celebrations.init();

    expect(celebrations.setIntensity('extreme')).toBe(false);
    expect(celebrations.options.intensity).toBe('medium');
    expect(spy).toHaveBeenCalled();
  });

  it('thins the falling layer on a narrow viewport', async () => {
    window.innerWidth = 480;
    const celebrations = build({ mobileReduction: 0.5 });
    await celebrations.init();

    expect(celebrations.particles).toHaveLength(10);
    // Decorations are placed, not scattered, so the reduction leaves them be.
    expect(celebrations.specialParticles).toHaveLength(6);
  });
});

describe('traits', () => {
  it('reports what the theme publishes', async () => {
    const celebrations = build();
    await celebrations.init();

    const traits = celebrations.getTraits();
    expect(Object.keys(traits)).toEqual(['flake', 'tree', 'train', 'lightning']);
    expect(traits.train).toMatchObject({ label: 'Train', enabled: true, density: 1 });
  });

  it('switches a decoration off through the config key', async () => {
    const celebrations = build({ traits: { tree: false } });
    await celebrations.init();

    expect(celebrations.specialParticles).toHaveLength(0);
    expect(celebrations.particles).toHaveLength(20);
  });

  it('thins a decoration rather than removing it', async () => {
    const celebrations = build({ traits: { tree: 0.5 } });
    await celebrations.init();

    expect(celebrations.specialParticles).toHaveLength(3);
  });

  it('switches the falling layer off', async () => {
    const celebrations = build({ traits: { flake: false } });
    await celebrations.init();

    expect(celebrations.particles).toHaveLength(0);
    expect(celebrations.specialParticles).toHaveLength(6);
  });

  /**
   * The case the config keys cannot reach: several shipped themes hardcode
   * their spawn odds and never read `config`, so the only handle on Santa's
   * sleigh or a steam train is the type filter on the way out of the theme.
   */
  it('drops a hardcoded spawn the host switched off', async () => {
    const celebrations = build({ traits: { train: false } });
    await celebrations.init();
    celebrations.start();

    await frame();
    expect(celebrations.specialParticles.every(p => p.type !== 'train')).toBe(true);

    celebrations.setTrait('train', true);
    celebrations.start();
    await frame();
    expect(celebrations.specialParticles.some(p => p.type === 'train')).toBe(true);
  });

  it('gates the global drawing pass', async () => {
    const theme = testTheme();
    const celebrations = build({ traits: { lightning: false } }, theme);
    await celebrations.init();
    celebrations.start();

    await frame();
    expect(theme.drawGlobalEffects).not.toHaveBeenCalled();

    celebrations.setTrait('lightning', true);
    await frame();
    expect(theme.drawGlobalEffects).toHaveBeenCalled();
  });

  it('reseeds when a trait changes', async () => {
    const celebrations = build();
    await celebrations.init();
    expect(celebrations.specialParticles).toHaveLength(6);

    celebrations.setTrait('tree', false);
    expect(celebrations.specialParticles).toHaveLength(0);

    celebrations.setTrait('tree', true);
    expect(celebrations.specialParticles).toHaveLength(6);
  });

  it('applies several at once and announces the change', async () => {
    const celebrations = build();
    await celebrations.init();

    const seen = vi.fn();
    celebrations.on('traitChange', seen);
    celebrations.setTraits({ tree: false, flake: false });

    expect(celebrations.particles).toHaveLength(0);
    expect(celebrations.specialParticles).toHaveLength(0);
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('refuses a trait the theme does not have', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const celebrations = build();
    await celebrations.init();

    expect(celebrations.setTrait('pumpkin', false)).toBe(false);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('no trait "pumpkin"'));
  });

  it('carries trait settings across a theme change', async () => {
    const celebrations = build({ traits: { tree: false } });
    await celebrations.init();

    registerTheme('other', { displayName: 'Other', module: testTheme({ name: 'other' }) });
    await celebrations.setTheme('other');
    unregisterTheme('other');

    expect(celebrations.getTraits().tree.enabled).toBe(false);
    expect(celebrations.specialParticles).toHaveLength(0);
  });
});

describe('events', () => {
  it('announces start, stop and theme changes, and unsubscribes', async () => {
    const celebrations = build();
    const state = vi.fn();
    const off = celebrations.on('stateChange', state);

    await celebrations.init();
    celebrations.start();
    expect(state).toHaveBeenLastCalledWith(true, celebrations);

    celebrations.pause();
    expect(state).toHaveBeenLastCalledWith(false, celebrations);

    off();
    celebrations.start();
    expect(state).toHaveBeenCalledTimes(2);
  });

  it('survives a listener that throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const celebrations = build();
    celebrations.on('init', () => { throw new Error('listener blew up'); });

    expect(await celebrations.init()).toBe(true);
    expect(spy).toHaveBeenCalled();
  });
});

/** One animation frame, awaited. */
function frame() {
  return new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
}
