/**
 * Canvas Management
 *
 * Creates, sizes and tears down the overlay canvas the effect draws on, and
 * owns the *only* resize listener in the library.
 *
 * That last point is deliberate. The version this package was extracted from
 * bound a resize listener here and a second one in the effect class, removed
 * neither on destroy, and constructed a fresh CanvasManager on every
 * `setTheme()` - so switching themes four times left four canvases in the DOM
 * and eight live listeners. Resize handling lives here and nowhere else, and
 * `destroy()` unbinds it.
 */

export class CanvasManager {
  /**
   * @param {Object} [options]
   * @param {string} [options.canvasId='domma-celebrate-canvas'] - Element id
   * @param {number} [options.zIndex=999] - Stacking order of the overlay
   * @param {HTMLElement|string|null} [options.container=null] - Element (or
   *   selector) to scope the canvas to. Null means a fixed, full-viewport
   *   overlay on `document.body`.
   * @param {Function} [options.onResize] - Called after a debounced resize
   */
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'domma-celebrate-canvas';
    this.zIndex = options.zIndex !== undefined ? options.zIndex : 999;
    this.container = resolveContainer(options.container);
    this.resizeCallback = options.onResize || null;

    this.canvas = null;
    this.ctx = null;
    this.resizeTimeout = null;
    this.observer = null;

    this._handleResize = this._handleResize.bind(this);
  }

  /** Create the canvas and attach it. Idempotent. */
  create() {
    if (this.canvas) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = this.canvasId;
    this.canvas.setAttribute('aria-hidden', 'true');

    if (this.container) {
      // A scoped overlay needs a positioned ancestor to sit inside; a static
      // container would push the canvas up to the nearest positioned parent
      // (often the viewport) and the effect would appear in the wrong place.
      const position = window.getComputedStyle(this.container).position;
      if (position === 'static') {
        this.container.style.position = 'relative';
      }
      this.canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${this.zIndex};
      `;
    } else {
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: ${this.zIndex};
      `;
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.resize();
    (this.container || document.body).appendChild(this.canvas);

    window.addEventListener('resize', this._handleResize);

    // A scoped canvas can change size without the window doing so - a sidebar
    // opening, a flex sibling growing. ResizeObserver catches that; the window
    // listener above stays as the fallback where it is unavailable.
    if (this.container && typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(this._handleResize);
      this.observer.observe(this.container);
    }
  }

  /** Match the drawing buffer to the current display size. */
  resize() {
    if (!this.canvas) return;

    if (this.container) {
      this.canvas.width = this.container.clientWidth || 1;
      this.canvas.height = this.container.clientHeight || 1;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /** Wipe the whole canvas. */
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Current drawing-buffer dimensions. */
  getDimensions() {
    return {
      width: this.canvas ? this.canvas.width : 0,
      height: this.canvas ? this.canvas.height : 0
    };
  }

  /** Narrow viewport, used to thin particle counts on phones. */
  isMobile() {
    return window.innerWidth < 768;
  }

  /** Detach the canvas and unbind every listener this manager owns. */
  destroy() {
    window.removeEventListener('resize', this._handleResize);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Debounced resize: re-size the buffer, then let the owner rebuild whatever
   * it positioned against the old dimensions.
   * @private
   */
  _handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = null;
      this.resize();
      if (this.resizeCallback) {
        this.resizeCallback();
      }
    }, 250);
  }
}

/**
 * Accept a selector, an element, or nothing.
 * @private
 */
function resolveContainer(container) {
  if (!container) return null;
  if (typeof container === 'string') {
    return document.querySelector(container);
  }
  return container;
}
