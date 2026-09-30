import halloween from '../src/themes/halloween.js';
import valentines from '../src/themes/valentines.js';
import {drawIllustratedButterfly} from '../src/themes/butterfly-drawing.js';

const root = document.querySelector('.celebration-lab');
const original = root.dataset.original ? (await import(root.dataset.original)).default : null;
const originalValentines = root.dataset.valentinesOriginal ? (await import(root.dataset.valentinesOriginal)).default : null;
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches, time = 0, last = 0, old = false;
const pause = root.querySelector('[data-pause]');
pause.textContent = paused ? 'Play animation' : 'Pause animation';
pause.onclick = () => {paused = !paused; pause.textContent = paused ? 'Play animation' : 'Pause animation';};
const compare = root.querySelector('[data-compare]');
compare.disabled = !original;
compare.onclick = () => {old = !old; compare.setAttribute('aria-pressed', String(old)); compare.textContent = old ? 'Show redraw' : 'Show original'; root.querySelector('[data-version]').textContent = old ? 'Original artwork' : 'New illustrations';};
const types = ['JackOLantern', 'Ghost', 'Bat', 'Scarecrow', 'HauntedHouse', 'Pumpkin', 'Butterfly'];
const labels = ['Candlelit pumpkins', 'Drifting ghosts', 'Velvet-winged bats', 'A stitched scarecrow', 'The crooked house', 'Autumn pumpkins', 'Butterfly detail'];
const gallery = root.querySelector('[data-gallery]');
for (let i = 0; i < types.length; i++) {
  const section = document.createElement('section');
  section.innerHTML = `<h3>${labels[i]}</h3><canvas data-drawing="${types[i]}" aria-label="${labels[i]}"></canvas>`;
  gallery.append(section);
}
let controls = [], swarmPaused = false, tapeControl = null;
if (root.dataset.effects) {
  const effects = await import(root.dataset.effects);
  const oldEffects = await import(root.dataset.effectsOriginal);
  const swarm = () => {
    controls.forEach(c => c?.destroy());
    const options = {palette: root.querySelector('[data-palette]').value, density: 14, minSize: 24, maxSize: 48, speed: 0.5};
    controls = [oldEffects.butterflies(root.querySelector('[data-swarm-old]'), options), effects.butterflies(root.querySelector('[data-swarm-new]'), options)];
    if (swarmPaused) controls.forEach(c => c?.pause());
  };
  swarm(); root.querySelector('[data-palette]').onchange = swarm;
  root.querySelector('[data-swarm-pause]').onclick = e => {
    const stop = !swarmPaused; swarmPaused = stop;
    controls.forEach(c => stop ? c?.pause() : c?.resume());
    e.currentTarget.setAttribute('aria-pressed', String(stop)); e.currentTarget.textContent = stop ? 'Resume butterflies' : 'Pause butterflies';
  };
  root.querySelector('[data-tape]').onclick = () => {
    tapeControl?.destroy();
    tapeControl = effects.tickerTape(root.querySelector('[data-tape-stage]'), {palette: 'gold', burst: true, burstCount: 70, respectMotionPreference: false});
  };
} else root.querySelector('[data-live]').hidden = true;
function frame(now) {
  const delta = Math.min(50, now - (last || now)); last = now;
  if (!paused) time += delta;
  for (const canvas of root.querySelectorAll('[data-drawing]')) {
    const w = canvas.clientWidth, h = 300, dpr = devicePixelRatio || 1;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== h * dpr) {canvas.width = Math.round(w * dpr); canvas.height = h * dpr;}
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const type = canvas.dataset.drawing;
    const p = {x: w / 2, y: 145, size: 70, opacity: 1, time, vx: 1, rotation: 0, swayPhase: 0, swaySpeed: 0.002, glowPhase: 0, wingPhase: 0, color: 'purple', baseY: 145, waveFrequency: 0, waveAmplitude: 0, waveOffset: 0};
    if (type === 'Scarecrow') {p.size = 65; p.y = 100;}
    if (type === 'HauntedHouse') {p.size = 80; p.y = 135;}
    if (type === 'Bat') {p.size = 65;}
    if (type === 'Butterfly') {
      if (old && originalValentines) originalValentines.drawButterfly(ctx, p, time);
      else drawIllustratedButterfly(ctx, {x: p.x, y: 145, size: 165, flapPhase: time * 0.005 + 1, alpha: 1, colourUpper: '#bc8fc0', colourLower: '#9282b4'});
    } else (old ? original : halloween)[`draw${type}`](ctx, p, time);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
