/**
 * The celebration engine.
 *
 * Owns the canvas, the particle arrays and the animation loop; the themes own
 * everything that is drawn. A theme is a plain object of `drawX(ctx, particle,
 * time)` methods plus an `intensityConfig`, so adding a celebration never means
 * touching this file.
 */

import { CanvasManager } from './canvas.js';
import { PhysicsEngine, updateParticlePhysics, updateMovingParticle } from './physics.js';
import { createParticle } from './particles.js';
import {
  resolveTraits,
  buildTypeIndex,
  applyTraitsToConfig,
  allowsType,
  allParticleTraitsDisabled,
  globalEffectsEnabled
} from './traits.js';
import {
  getTheme,
  getThemes,
  getCurrentTheme,
  isCelebrationSeason,
  isDateInRange
} from '../themes/index.js';

const INTENSITIES = ['light', 'medium', 'heavy'];

export class Celebrations {
  /**
   * @param {Object} [options]
   * @param {string} [options.theme='auto'] - Theme name, or 'auto' to pick the
   *   celebration whose window contains today's date
   * @param {string} [options.intensity='medium'] - 'light' | 'medium' | 'heavy'
   * @param {boolean} [options.enabled=true] - Start animating as soon as
   *   `init()` finishes
   * @param {number} [options.zIndex=999] - Overlay stacking order
   * @param {HTMLElement|string|null} [options.container=null] - Scope the
   *   canvas to an element instead of the viewport
   * @param {string} [options.canvasId] - Overlay element id
   * @param {Object} [options.traits] - Per-decoration control, keyed by the
   *   trait names the theme publishes: `{ train: false, tree: 0.5 }`. `false`
   *   is off, a number is a density multiplier. See `getTraits()`
   * @param {number} [options.mobileReduction=0.5] - Particle-count multiplier
   *   applied below 768px. 1 disables the reduction
   * @param {boolean} [options.respectMotionPreference=true] - Do nothing when
   *   the visitor has asked for reduced motion
   * @param {boolean} [options.debug=false] - Log lifecycle detail to the
   *   console. Errors are reported regardless
   */
  constructor(options = {}) {
    this.options = {
      theme: options.theme || 'auto',
      intensity: INTENSITIES.includes(options.intensity) ? options.intensity : 'medium',
      enabled: options.enabled !== undefined ? options.enabled : true,
      zIndex: options.zIndex !== undefined ? options.zIndex : 999,
      container: options.container || null,
      traits: options.traits || {},
      canvasId: options.canvasId || 'domma-celebrate-canvas',
      mobileReduction: options.mobileReduction !== undefined ? options.mobileReduction : 0.5,
      respectMotionPreference: options.respectMotionPreference !== false,
      debug: options.debug === true
    };

    this.canvasManager = null;
    this.physicsEngine = null;
    this.themeModule = null;
    this.currentTheme = null;

    this.particles = [];
    this.specialParticles = [];
    this.targetCount = 0;

    // Derived from the theme's manifest plus `options.traits`; rebuilt whenever
    // either changes, never recomputed per frame.
    this._traits = Object.create(null);
    this._typeIndex = new Map();
    this._effectiveConfig = null;
    this._skipParticles = false;
    this._globalEffects = true;

    this.animationFrame = null;
    this.lastTime = 0;
    this.running = false;
    this.initialized = false;
    this.reducedMotion = false;

    this._listeners = Object.create(null);
    this._animate = this._animate.bind(this);
  }

  // ── Date and theme lookup, as statics so a page can ask before constructing ─

  static getThemes() {
    return getThemes();
  }

  static getCurrentTheme(date) {
    return getCurrentTheme(date);
  }

  static isCelebrationSeason(date) {
    return isCelebrationSeason(date);
  }

  static isDateInRange(start, end, date) {
    return isDateInRange(start, end, date);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  /**
   * Resolve the theme, build the canvas, seed the particles.
   *
   * @returns {Promise<boolean>} False when there is nothing to show - no
   *   celebration in season, an unknown theme name, a theme that failed to
   *   load, or a visitor who has asked for reduced motion. Never throws.
   */
  async init() {
    if (this.initialized) {
      this._log('already initialised');
      return true;
    }

    if (this.options.respectMotionPreference && prefersReducedMotion()) {
      this.reducedMotion = true;
      this._log('reduced motion requested - standing down');
      return false;
    }

    if (!(await this._loadTheme(this.options.theme))) {
      return false;
    }

    this.canvasManager = new CanvasManager({
      canvasId: this.options.canvasId,
      zIndex: this.options.zIndex,
      container: this.options.container,
      onResize: () => {
        // Decorations are placed against canvas dimensions, so a resize
        // invalidates them. Particles are cheap to rebuild; keeping them would
        // leave trees floating in mid-air.
        if (this.initialized) this.resetParticles();
      }
    });
    this.canvasManager.create();

    this.physicsEngine = new PhysicsEngine({
      gustInterval: [5000, 15000],
      gustStrength: [-2, 2]
    });

    this.resetParticles();

    this.initialized = true;
    this._emit('init', this.currentTheme);
    this._log(`initialised (${this.currentTheme}, ${this.options.intensity})`);

    if (this.options.enabled) {
      this.start();
    }

    return true;
  }

  /** Begin animating. No-op unless `init()` has succeeded. */
  start() {
    if (!this.initialized) {
      this._log('cannot start - not initialised');
      return;
    }
    if (this.running) return;

    this.running = true;
    this.lastTime = now();
    this.animationFrame = requestAnimationFrame(this._animate);
    this._emit('stateChange', true);
    this._log('running');
  }

  /** Stop animating, keeping the canvas and particles for a later `resume()`. */
  pause() {
    if (!this.running) return;

    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this._emit('stateChange', false);
    this._log('paused');
  }

  /** Resume after `pause()`. */
  resume() {
    this.start();
  }

  /**
   * Turn the effect on, initialising first if it has not been yet.
   * @returns {Promise<boolean>} Whether the effect is now running
   */
  async enable() {
    if (!this.initialized) {
      const ok = await this.init();
      if (!ok) return false;
    }
    this.start();
    return this.running;
  }

  /** Turn the effect off, keeping it initialised. */
  disable() {
    this.pause();
  }

  /**
   * Flip between enabled and disabled.
   * @returns {Promise<boolean>} Whether the effect is now running
   */
  async toggle() {
    if (this.running) {
      this.disable();
      return false;
    }
    return this.enable();
  }

  /** Remove the canvas, unbind every listener, and reset to pre-`init()` state. */
  destroy() {
    this.pause();

    if (this.canvasManager) {
      this.canvasManager.destroy();
      this.canvasManager = null;
    }

    this.particles = [];
    this.specialParticles = [];
    this.physicsEngine = null;
    this.themeModule = null;
    this.initialized = false;

    this._emit('destroy', this.currentTheme);
    this._log('destroyed');
  }

  // ── Configuration ──────────────────────────────────────────────────────────

  /**
   * Change how much is on screen.
   * @param {string} intensity - 'light' | 'medium' | 'heavy'
   */
  setIntensity(intensity) {
    if (!INTENSITIES.includes(intensity)) {
      console.error(`[domma-celebrate] Invalid intensity: ${intensity}`);
      return false;
    }
    if (intensity === this.options.intensity) return true;

    this.options.intensity = intensity;
    this._refreshConfig();
    if (this.initialized) {
      this.resetParticles();
    }
    this._emit('intensityChange', intensity);
    this._log(`intensity ${intensity}`);
    return true;
  }

  /**
   * Swap themes in place.
   *
   * Reuses the existing canvas rather than building a second one - the version
   * this was extracted from constructed a fresh CanvasManager here, so every
   * switch orphaned a canvas element and its listeners in the DOM.
   *
   * @param {string} themeName - Theme name, or 'auto'
   * @returns {Promise<boolean>} Whether the new theme is live
   */
  async setTheme(themeName) {
    if (!this.initialized) {
      this.options.theme = themeName;
      return this.init();
    }

    const wasRunning = this.running;
    this.pause();

    this.particles = [];
    this.specialParticles = [];
    this.canvasManager.clear();

    const previous = { theme: this.options.theme, module: this.themeModule, name: this.currentTheme };
    this.options.theme = themeName;

    if (!(await this._loadTheme(themeName))) {
      // Put the old theme back rather than leaving a live canvas with nothing
      // to draw on it.
      this.options.theme = previous.theme;
      this.themeModule = previous.module;
      this.currentTheme = previous.name;
      this.resetParticles();
      if (wasRunning) this.start();
      return false;
    }

    this.resetParticles();
    this._emit('themeChange', this.currentTheme);
    this._log(`theme ${this.currentTheme}`);

    if (wasRunning) this.start();
    return true;
  }

  /**
   * What this theme lets a host switch off, and where each trait currently
   * stands. The shape a controls panel builds itself from.
   *
   * Empty until a theme is loaded, because the traits belong to the theme
   * rather than to the engine.
   *
   * @returns {Object} Traits keyed by name, each `{ name, label, types, kind,
   *   enabled, density }`
   */
  getTraits() {
    return Object.fromEntries(
      Object.entries(this._traits).map(([name, trait]) => [name, { ...trait }])
    );
  }

  /**
   * Turn one trait off, back on, or thin it out.
   *
   * @param {string} name - Trait name from `getTraits()`
   * @param {boolean|number|Object} value - `false` to switch off, `true` to
   *   restore, a number as a density multiplier, or `{ enabled, density }`
   * @returns {boolean} False when the current theme has no such trait
   */
  setTrait(name, value) {
    if (!this._traits[name]) {
      console.error(`[domma-celebrate] Theme "${this.currentTheme}" has no trait "${name}"`);
      return false;
    }
    return this.setTraits({ [name]: value });
  }

  /**
   * Apply several trait settings at once, merged over the existing ones.
   *
   * Batched rather than looped over `setTrait` because each change rebuilds
   * every particle: setting six traits one at a time would reseed the canvas
   * six times and visibly stutter.
   *
   * @param {Object} settings - Trait names to values, as `setTrait` accepts
   * @returns {boolean}
   */
  setTraits(settings) {
    this.options.traits = { ...this.options.traits, ...settings };
    this._refreshTraits();
    if (this.initialized) {
      this.resetParticles();
    }
    this._emit('traitChange', this.getTraits());
    return true;
  }

  /**
   * Current state, for a control panel to render from.
   * @returns {{enabled: boolean, initialized: boolean, theme: string|null,
   *   intensity: string, particles: number, reducedMotion: boolean}}
   */
  getState() {
    return {
      enabled: this.running,
      initialized: this.initialized,
      theme: this.currentTheme,
      intensity: this.options.intensity,
      particles: this.particles.length + this.specialParticles.length,
      reducedMotion: this.reducedMotion
    };
  }

  // ── Events ─────────────────────────────────────────────────────────────────

  /**
   * Subscribe to 'init', 'stateChange', 'themeChange', 'intensityChange' or
   * 'destroy'.
   * @returns {Function} Unsubscribe
   */
  on(event, handler) {
    (this._listeners[event] || (this._listeners[event] = [])).push(handler);
    return () => this.off(event, handler);
  }

  /** Unsubscribe. Omit `handler` to drop every listener for the event. */
  off(event, handler) {
    if (!this._listeners[event]) return;
    if (!handler) {
      delete this._listeners[event];
      return;
    }
    this._listeners[event] = this._listeners[event].filter(fn => fn !== handler);
  }

  // ── Particles ──────────────────────────────────────────────────────────────

  /**
   * Rebuild every particle and decoration from the current theme, intensity and
   * canvas size. Called on init, on an intensity or theme change, and on resize.
   */
  resetParticles() {
    if (!this.themeModule || !this.canvasManager || !this.canvasManager.canvas) return;

    const config = this._config();
    const { width, height } = this.canvasManager.getDimensions();

    this.particles = [];
    this.specialParticles = [];

    // Themes that build up over time (fireworks, say) start with a fraction of
    // their eventual population and grow towards it in the animation loop.
    const scale = this.canvasManager.isMobile() ? clamp(this.options.mobileReduction, 0, 1) : 1;
    this.targetCount = Math.max(0, Math.floor(config.count * scale));

    const initialRatio = config.initialParticleRatio !== undefined ? config.initialParticleRatio : 1;
    const initialCount = Math.floor(this.targetCount * initialRatio);

    for (let i = 0; i < initialCount; i++) {
      const particle = this._makeFallingParticle(width, height, config);
      if (!particle) continue;
      particle.y = Math.random() * height; // spread over the screen, not stacked above it
      this.particles.push(particle);
    }

    if (this.themeModule.createInitialDecorations) {
      // Traits with a config key were already thinned in `config`; the rest are
      // filtered here, which is the only handle on a decoration a theme creates
      // unconditionally.
      const decorations = this.themeModule.createInitialDecorations(width, height, config)
        .filter(decoration => allowsType(this._typeIndex, decoration.type, true));
      this.specialParticles.push(...decorations);
    }

    // Reports what was actually seeded, not what was asked for. The two differ
    // whenever a trait filters particles out, which is exactly when the number
    // is worth looking at.
    this._log(`${this.particles.length}/${this.targetCount} particles, ${this.specialParticles.length} decorations`);
  }

  // ── Internals ──────────────────────────────────────────────────────────────

  /**
   * Resolve a theme name (handling 'auto') and load its module.
   * @private
   * @returns {Promise<boolean>}
   */
  async _loadTheme(requested) {
    let name = requested;

    if (name === 'auto') {
      name = getCurrentTheme();
      if (!name) {
        this._log('no celebration in season');
        return false;
      }
    }

    const descriptor = getTheme(name);
    if (!descriptor) {
      console.error(`[domma-celebrate] Unknown theme: ${name}`);
      return false;
    }

    try {
      const module = await descriptor.load();
      this.themeModule = module.default || module;
      this.currentTheme = name;
      this._refreshTraits();
      return true;
    } catch (error) {
      console.error(`[domma-celebrate] Failed to load theme "${name}":`, error);
      return false;
    }
  }

  /**
   * The intensity block the theme should see - the raw one with every thinned
   * or disabled trait's config key already adjusted.
   *
   * Cached rather than derived per frame: `_animate()` asks for it sixty times
   * a second and the answer only changes when the theme, the intensity or the
   * traits do.
   * @private
   */
  _config() {
    if (!this._effectiveConfig) this._refreshConfig();
    return this._effectiveConfig;
  }

  /**
   * The theme's own intensity block, before traits are applied. Falls back to
   * 'medium' and then to whatever the theme defines first, so a theme missing a
   * level renders rather than throwing on `config.count`.
   * @private
   */
  _rawConfig() {
    const configs = (this.themeModule && this.themeModule.intensityConfig) || {};
    return (
      configs[this.options.intensity] ||
      configs.medium ||
      Object.values(configs)[0] ||
      { count: 0, speedRange: [1, 2], sizeRange: [2, 4] }
    );
  }

  /**
   * Rebuild the resolved trait table and everything derived from it.
   * @private
   */
  _refreshTraits() {
    this._traits = resolveTraits(this.themeModule, this.options.traits);
    this._typeIndex = buildTypeIndex(this._traits);
    this._skipParticles = allParticleTraitsDisabled(this._traits);
    this._globalEffects = globalEffectsEnabled(this._traits);
    this._refreshConfig();
  }

  /** @private */
  _refreshConfig() {
    this._effectiveConfig = applyTraitsToConfig(this._rawConfig(), this._traits);
  }

  /**
   * One frame: physics, recycling, rendering, spawning.
   * @private
   */
  _animate() {
    if (!this.running || !this.canvasManager || !this.canvasManager.ctx) return;

    const currentTime = now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const ctx = this.canvasManager.ctx;
    const { width, height } = this.canvasManager.getDimensions();
    const config = this._config();

    this.canvasManager.clear();

    this.physicsEngine.updateWind(currentTime);
    const windForce = this.physicsEngine.getWindForce();

    // Grow towards the target population for themes that start sparse.
    if (this.particles.length < this.targetCount && Math.random() < 0.05) {
      const particle = this._makeFallingParticle(width, height, config);
      if (particle) {
        if (particle.y === undefined || particle.y < 0) {
          particle.y = -20;
        }
        this.particles.push(particle);
      }
    }

    for (const particle of this.particles) {
      updateParticlePhysics(particle, deltaTime, windForce);

      // Wrap rather than respawn: a particle that leaves one edge re-enters
      // from the opposite one, so the population stays constant.
      if (particle.y > height + 50) {
        particle.y = -20;
        particle.x = Math.random() * width;
      }
      if (particle.x < -50) particle.x = width + 50;
      if (particle.x > width + 50) particle.x = -50;

      this._drawParticle(ctx, particle, currentTime);
    }

    if (this.themeModule.updateSpecialParticles) {
      this.themeModule.updateSpecialParticles(this.specialParticles, deltaTime, width, height);
    }

    this.specialParticles = this.specialParticles.filter(particle => {
      if (!particle.active) return false;

      if (!particle.static) {
        updateMovingParticle(particle, deltaTime, currentTime);

        // Wide loads (a steam train, say) need a longer runway before they
        // count as gone.
        const margin = particle.offscreenMargin || (particle.type === 'train' ? 600 : 200);
        if (particle.x < -margin || particle.x > width + margin) {
          particle.active = false;
          return false;
        }
      }

      // A NaN that reaches ctx silently blanks the rest of the frame, so a bad
      // particle is dropped rather than drawn.
      if (!isFinite(particle.x) || !isFinite(particle.y) || (particle.size !== undefined && !isFinite(particle.size))) {
        this._log(`dropping invalid ${particle.type} particle`);
        particle.active = false;
        return false;
      }

      const draw = this.themeModule['draw' + pascalCase(particle.type)];
      if (draw) draw.call(this.themeModule, ctx, particle, currentTime);

      return true;
    });

    if (this.themeModule.spawnSpecialParticle) {
      const spawned = this.themeModule.spawnSpecialParticle(
        this.specialParticles, width, height, config
      );
      // Several themes hardcode their spawn odds and never read `config`, so a
      // disabled sleigh or witch can only be stopped on the way out.
      if (spawned && allowsType(this._typeIndex, spawned.type, true)) {
        this.specialParticles.push(spawned);
      }
    }

    if (this._globalEffects && this.themeModule.drawGlobalEffects) {
      this.themeModule.drawGlobalEffects(ctx, currentTime, width, height);
    }

    this.animationFrame = requestAnimationFrame(this._animate);
  }

  /**
   * One falling particle of a type the host has not switched off, or null.
   *
   * A theme picks its own particle type at random - Halloween is 70% pumpkins,
   * 30% spiders - so the only way to honour `{ spider: false }` is to ask again
   * until something allowed comes back. Bounded, because with a rare type as
   * the sole survivor the retries would otherwise run long; the population
   * simply comes up short that frame and the next attempt fills it in.
   * @private
   */
  _makeFallingParticle(width, height, config) {
    if (this._skipParticles) return null;

    const make = this.themeModule.createFallingParticle
      ? () => this.themeModule.createFallingParticle(width, height, config)
      : () => createParticle(config, width, height);

    for (let attempt = 0; attempt < 12; attempt++) {
      const particle = make();
      if (allowsType(this._typeIndex, particle.type, true)) {
        return particle;
      }
    }
    return null;
  }

  /**
   * Render one falling particle, preferring the theme's own `drawType` method
   * and falling back to a plain dot so an unhandled particle type still shows.
   * @private
   */
  _drawParticle(ctx, particle, currentTime) {
    const draw = particle.type && this.themeModule['draw' + pascalCase(particle.type)];
    if (draw) {
      draw.call(this.themeModule, ctx, particle, currentTime);
      return;
    }

    ctx.save();
    ctx.globalAlpha = particle.opacity !== undefined ? particle.opacity : 1;
    ctx.fillStyle = (this.themeModule.colors && this.themeModule.colors.primary) || '#ffffff';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size || 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /** @private */
  _emit(event, payload) {
    const handlers = this._listeners[event];
    if (!handlers) return;
    for (const handler of handlers.slice()) {
      try {
        handler(payload, this);
      } catch (error) {
        console.error(`[domma-celebrate] Listener for "${event}" threw:`, error);
      }
    }
  }

  /** @private */
  _log(message) {
    if (this.options.debug) {
      console.log(`[domma-celebrate] ${message}`);
    }
  }
}

/**
 * 'sparkler-bundle' → 'SparklerBundle', so a theme's `drawSparklerBundle`
 * matches a particle of type `sparkler-bundle`.
 */
function pascalCase(str) {
  if (!str) return '';
  const camel = String(str).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function now() {
  return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default Celebrations;
