import {CHARACTERS, resolveCharacterSize} from './character-catalog.mjs';

export {CHARACTERS, CHARACTER_SIZES, getCharacters, resolveCharacterSize} from './character-catalog.mjs';

const loaders = {
  mooning: () => import('./themes/mooning-drawing.js'),
  characters: () => import('./themes/character-drawing.js'),
  festive: () => import('./themes/christmas-festive.js')
};

/** Mount just one character, inline, at any time of year. Size is displayed height. */
export async function mountCharacter(container, {character = 'elf', size = 'medium', animate = true, facing = 'right', label} = {}) {
  const definition = Object.hasOwn(CHARACTERS, character) ? CHARACTERS[character] : null;
  if (!definition) throw new RangeError(`Unknown celebration character: ${character}`);
  const host = typeof container === 'string' ? document.querySelector(container) : container;
  if (!host?.appendChild) throw new TypeError('A character needs a container element.');
  const module = await loaders[definition.module]();
  const draw = module[definition.draw];
  const height = resolveCharacterSize(size);
  const [left, top, right, bottom] = definition.bounds;
  const width = Math.ceil(height * (right - left) / (bottom - top));
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label || definition.label);
  canvas.style.cssText = `display:block;width:${width}px;height:auto;max-width:100%;aspect-ratio:${width}/${height}`;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas drawing is unavailable.');
  host.appendChild(canvas);
  const particle = {
    type: character, x: -left * height / (bottom - top), y: -top * height / (bottom - top),
    size: height / (bottom - top), opacity: 1, vx: 1,
    state: character === 'peeing-elf' ? 'peeing' : character === 'thieving-elf' ? 'escaping' : character === 'robin' ? 'sitting' : 'mooning', time: 0
  };
  // Mirror around the frame centre; asymmetric characters keep their full bounds.
  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let playing = animate !== false, frame = null, time = 0, last = null, destroyed = false;

  function paint() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    if (facing === 'left') {ctx.translate(width, 0); ctx.scale(-1, 1);}
    particle.time = time;
    draw(ctx, particle, time);
    ctx.restore();
  }
  function schedule() {
    if (!destroyed && playing && !motion?.matches && !document.hidden && frame === null) frame = window.requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = null;
    if (destroyed) return;
    time += last === null ? 0 : Math.max(0, Math.min(50, now - last));
    last = now;
    paint(); schedule();
  }
  function suspend() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null; last = null;
  }
  function visibility() {suspend(); schedule();}
  document.addEventListener('visibilitychange', visibility);
  motion?.addEventListener?.('change', visibility);
  paint(); schedule();
  return {
    canvas, character,
    play() {if (destroyed) return; playing = true; schedule();},
    pause() {playing = false; suspend();},
    replay() {if (destroyed) return; time = 0; last = null; paint(); playing = true; schedule();},
    destroy() {
      if (destroyed) return;
      destroyed = true; suspend();
      document.removeEventListener('visibilitychange', visibility);
      motion?.removeEventListener?.('change', visibility);
      canvas.remove();
    }
  };
}
