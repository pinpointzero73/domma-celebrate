// Preset strokes and optional bundled font outlines are sampled once per scene.
import {sparklerFont} from './sparkler-font.js';
const GLYPHS = {
  B: [['M', 0.04, 1], ['L', 0.04, 0], ['C', 0.84, -0.08, 0.83, 0.53, 0.04, 0.48], ['C', 0.93, 0.4, 0.93, 1.12, 0.04, 1]],
  F: [['M', 0.05, 1], ['L', 0.05, 0], ['L', 0.65, 0], ['M', 0.05, 0.48], ['L', 0.52, 0.48]],
  O: [['M', 0.35, 0], ['C', -0.13, 0, -0.13, 1, 0.35, 1], ['C', 0.83, 1, 0.83, 0, 0.35, 0]],
  A: [['M', 0, 1], ['L', 0.34, 0], ['L', 0.68, 1], ['M', 0.15, 0.6], ['L', 0.53, 0.6]],
  C: [['M', 0.65, 0.15], ['C', 0.12, -0.3, -0.17, 0.5, 0.15, 0.9], ['C', 0.3, 1.08, 0.54, 1.02, 0.67, 0.85]],
  E: [['M', 0.62, 0], ['L', 0.05, 0], ['L', 0.05, 1], ['L', 0.65, 1], ['M', 0.05, 0.48], ['L', 0.52, 0.48]],
  H: [['M', 0.04, 0], ['L', 0.04, 1], ['M', 0.66, 0], ['L', 0.66, 1], ['M', 0.04, 0.5], ['L', 0.66, 0.5]],
  I: [['M', 0.12, 0], ['L', 0.58, 0], ['M', 0.35, 0], ['L', 0.35, 1], ['M', 0.1, 1], ['L', 0.6, 1]],
  M: [['M', 0.03, 1], ['L', 0.03, 0], ['L', 0.35, 0.65], ['L', 0.67, 0], ['L', 0.67, 1]],
  N: [['M', 0.04, 1], ['L', 0.04, 0], ['L', 0.66, 1], ['L', 0.66, 0]],
  P: [['M', 0.05, 1], ['L', 0.05, 0], ['C', 0.9, -0.1, 0.9, 0.65, 0.05, 0.53]],
  R: [['M', 0.05, 1], ['L', 0.05, 0], ['C', 0.9, -0.1, 0.9, 0.65, 0.05, 0.53], ['M', 0.36, 0.54], ['L', 0.71, 1]],
  S: [['M', 0.65, 0.13], ['C', 0.17, -0.22, -0.15, 0.26, 0.3, 0.48], ['C', 1.02, 0.78, 0.54, 1.3, 0.02, 0.88]],
  T: [['M', 0, 0], ['L', 0.7, 0], ['M', 0.35, 0], ['L', 0.35, 1]],
  W: [['M', 0, 0], ['L', 0.15, 1], ['L', 0.36, 0.4], ['L', 0.57, 1], ['L', 0.72, 0]],
  Y: [['M', 0, 0], ['L', 0.35, 0.52], ['L', 0.7, 0], ['M', 0.35, 0.52], ['L', 0.35, 1]],
  '0': [['M', 0.35, 0], ['C', -0.08, 0, -0.08, 1, 0.35, 1], ['C', 0.78, 1, 0.78, 0, 0.35, 0]],
  '1': [['M', 0.13, 0.2], ['L', 0.4, 0], ['L', 0.4, 1], ['M', 0.12, 1], ['L', 0.65, 1]],
  '2': [['M', 0.05, 0.22], ['C', 0.2, -0.22, 0.93, -0.03, 0.56, 0.43], ['L', 0.03, 1], ['L', 0.68, 1]],
  '3': [['M', 0.06, 0.13], ['C', 0.75, -0.25, 0.86, 0.48, 0.29, 0.48], ['C', 0.94, 0.39, 0.82, 1.31, 0.03, 0.91]],
  '4': [['M', 0.52, 0], ['L', 0.03, 0.66], ['L', 0.7, 0.66], ['M', 0.52, 0], ['L', 0.52, 1]],
  '5': [['M', 0.66, 0], ['L', 0.09, 0], ['L', 0.06, 0.46], ['C', 0.93, 0.21, 0.9, 1.33, 0.03, 0.91]],
  '6': [['M', 0.6, 0.05], ['C', -0.1, -0.18, -0.2, 1.14, 0.4, 1], ['C', 1, 0.83, 0.6, 0.14, 0.07, 0.59]],
  '7': [['M', 0.02, 0], ['L', 0.7, 0], ['L', 0.21, 1]],
  '8': [['M', 0.35, 0.48], ['C', -0.34, 0.08, 0.93, -0.31, 0.65, 0.29], ['C', 0.46, 0.62, -0.07, 0.51, 0.05, 0.88], ['C', 0.28, 1.31, 1.14, 0.81, 0.35, 0.48]],
  '9': [['M', 0.61, 0.42], ['C', -0.1, 0.88, -0.17, -0.07, 0.39, 0.02], ['C', 0.92, 0.07, 0.64, 1.11, 0.1, 0.98]],
  '!': [['M', 0.35, 0], ['L', 0.32, 0.72], ['M', 0.31, 0.96], ['L', 0.31, 1]]
};

// Lowercase loops join on the baseline. Capitals retain their flourishes.
const CURSIVE = {
  H: [['M', -0.05, 0.25], ['C', 0.5, -0.35, 0.2, -0.02, 0.07, 1], ['M', 0.18, 0.55], ['C', 0.48, 0.2, 0.82, 0.8, 0.93, 0.18], ['C', 0.8, 0.52, 0.55, 1.18, 0.91, 0.9]],
  M: [['M', -0.05, 0.9], ['C', 0.42, -0.3, 0.3, -0.17, 0.12, 1], ['C', 0.64, -0.18, 0.69, -0.27, 0.55, 0.98], ['C', 1.1, -0.18, 1.16, -0.14, 0.96, 0.9]],
  N: [['M', -0.05, 0.9], ['C', 0.33, -0.27, 0.38, -0.14, 0.19, 1], ['M', 0.26, 0.05], ['C', 0.46, -0.08, 0.53, 0.96, 0.7, 0.95], ['C', 0.86, 0.82, 0.95, 0.12, 0.95, 0.04]],
  Y: [['M', 0, 0.16], ['C', 0.1, -0.13, 0.08, 0.85, 0.48, 0.46], ['C', 0.66, 0.28, 0.74, -0.21, 0.75, 0.08], ['C', 0.73, 0.52, 0.41, 1.51, 0.11, 1.35], ['C', -0.13, 1.18, 0.74, 0.98, 0.91, 0.9]],
  C: [['M', 0.77, 0.23], ['C', 0.95, -0.31, 0.24, -0.19, 0.08, 0.47], ['C', -0.09, 1.19, 0.56, 1.12, 0.91, 0.9]],
  B: [['M', -0.04, 1], ['C', 0.18, 0.62, 0.43, -0.22, 0.26, 0.07], ['C', 0.96, -0.3, 1.08, 0.38, 0.37, 0.48], ['C', 1.1, 0.26, 0.97, 1.25, 0.14, 0.98], ['C', 0.3, 1.12, 0.66, 1.04, 0.91, 0.9]],
  a: [['M', 0, 0.9], ['C', 0.23, 0.8, 0.44, 0.24, 0.51, 0.48], ['C', 0.07, 0.16, -0.04, 1.26, 0.42, 0.94], ['C', 0.57, 0.72, 0.57, 0.38, 0.55, 0.54], ['C', 0.39, 1.09, 0.54, 1.03, 0.62, 0.9]],
  p: [['M', 0, 0.9], ['C', 0.16, 0.74, 0.27, 0.28, 0.23, 0.52], ['L', 0.02, 1.45], ['M', 0.2, 0.63], ['C', 0.65, 0.1, 0.74, 0.93, 0.32, 0.97], ['C', 0.43, 1.04, 0.53, 0.99, 0.62, 0.9]],
  y: [['M', 0, 0.9], ['C', 0.2, 0.69, 0.22, 0.38, 0.2, 0.5], ['C', -0.01, 1.34, 0.45, 1.01, 0.56, 0.49], ['C', 0.37, 1.2, 0.27, 1.64, 0.07, 1.43], ['C', -0.09, 1.22, 0.47, 1.06, 0.62, 0.9]],
  e: [['M', 0, 0.9], ['C', 0.69, 0.61, 0.39, 0.3, 0.18, 0.55], ['C', -0.05, 0.88, 0.28, 1.17, 0.62, 0.9]],
  w: [['M', 0, 0.9], ['C', 0.19, 0.69, 0.22, 0.3, 0.17, 0.54], ['C', -0.06, 1.29, 0.34, 1.07, 0.39, 0.54], ['C', 0.16, 1.34, 0.64, 1.06, 0.62, 0.9]],
  r: [['M', 0, 0.9], ['C', 0.12, 0.77, 0.32, 0.25, 0.25, 0.49], ['C', 0.34, 0.72, 0.51, 0.39, 0.46, 0.62], ['C', 0.29, 1.07, 0.46, 1.06, 0.62, 0.9]],
  h: [['M', 0, 0.9], ['C', 0.44, 0.29, 0.52, -0.22, 0.31, 0.01], ['C', 0.18, 0.21, 0.09, 0.91, 0.09, 1], ['C', 0.67, 0.02, 0.52, 0.68, 0.45, 0.91], ['C', 0.44, 1.06, 0.54, 1.01, 0.62, 0.9]],
  i: [['M', 0, 0.9], ['C', 0.29, 0.69, 0.28, 0.36, 0.21, 0.63], ['C', 0.05, 1.11, 0.37, 1.06, 0.62, 0.9], ['M', 0.3, 0.25], ['L', 0.32, 0.23]],
  s: [['M', 0, 0.9], ['C', 0.28, 0.77, 0.5, 0.3, 0.39, 0.49], ['C', 0.24, 0.63, 0.62, 0.83, 0.31, 1], ['C', 0.18, 1.11, 0.1, 0.84, 0.24, 0.87], ['C', 0.37, 1.04, 0.52, 1, 0.62, 0.9]],
  t: [['M', 0, 0.9], ['C', 0.24, 0.64, 0.4, 0.01, 0.33, 0.17], ['C', 0.12, 0.76, 0.02, 1.21, 0.62, 0.9], ['M', 0.05, 0.45], ['L', 0.57, 0.4]],
  m: [['M', 0, 0.9], ['C', 0.19, 0.62, 0.19, 0.38, 0.15, 0.57], ['L', 0.06, 1], ['C', 0.43, 0.19, 0.4, 0.49, 0.28, 1], ['C', 0.65, 0.2, 0.62, 0.56, 0.51, 0.9], ['C', 0.49, 1.06, 0.55, 1.02, 0.62, 0.9]],
  f: [['M', 0, 0.9], ['C', 0.51, 0.23, 0.58, -0.25, 0.36, 0.03], ['C', 0.16, 0.36, 0.02, 1.7, 0.18, 1.4], ['C', 0.32, 1.16, 0.35, 1.06, 0.62, 0.9], ['M', 0.04, 0.55], ['L', 0.57, 0.46]],
  o: [['M', 0, 0.9], ['C', 0.49, 0.31, 0.6, 0.47, 0.43, 0.8], ['C', 0.18, 1.3, -0.06, 0.75, 0.22, 0.49], ['C', 0.49, 0.27, 0.37, 0.95, 0.62, 0.9]]
};

const CHINESE = {
  '新': [['M', 0.28, 0.02], ['L', 0.36, 0.1], ['M', 0.06, 0.17], ['L', 0.57, 0.17], ['M', 0.16, 0.23], ['L', 0.22, 0.34], ['M', 0.46, 0.22], ['L', 0.4, 0.34], ['M', 0.05, 0.4], ['L', 0.58, 0.4], ['M', 0.1, 0.56], ['L', 0.55, 0.56], ['M', 0.32, 0.43], ['L', 0.32, 0.97], ['M', 0.25, 0.66], ['L', 0.06, 0.88], ['M', 0.4, 0.67], ['L', 0.55, 0.83], ['M', 0.95, 0.06], ['L', 0.65, 0.17], ['L', 0.64, 0.62], ['L', 0.55, 0.97], ['M', 0.66, 0.43], ['L', 0.99, 0.43], ['M', 0.86, 0.44], ['L', 0.86, 0.98]],
  '年': [['M', 0.28, 0.02], ['L', 0.08, 0.3], ['M', 0.23, 0.15], ['L', 0.94, 0.15], ['M', 0.22, 0.39], ['L', 0.89, 0.39], ['M', 0.22, 0.39], ['L', 0.22, 0.67], ['M', 0.03, 0.67], ['L', 0.99, 0.67], ['M', 0.59, 0.15], ['L', 0.59, 1]],
  '快': [['M', 0.22, 0.03], ['L', 0.22, 0.99], ['M', 0.1, 0.3], ['L', 0.04, 0.51], ['M', 0.32, 0.28], ['L', 0.4, 0.43], ['M', 0.44, 0.24], ['L', 0.85, 0.24], ['L', 0.85, 0.56], ['M', 0.39, 0.56], ['L', 0.99, 0.56], ['M', 0.65, 0.04], ['C', 0.65, 0.49, 0.72, 0.78, 0.37, 0.99], ['M', 0.66, 0.57], ['C', 0.72, 0.79, 0.86, 0.94, 1, 1]],
  '乐': [['M', 0.84, 0.04], ['L', 0.25, 0.17], ['M', 0.25, 0.17], ['L', 0.18, 0.55], ['L', 0.94, 0.55], ['M', 0.56, 0.23], ['L', 0.56, 0.98], ['L', 0.42, 0.92], ['M', 0.34, 0.69], ['L', 0.06, 0.94], ['M', 0.76, 0.68], ['L', 0.99, 0.92]]
};

const PALETTES = {
  gold: {edge: '#bc6f25', body: '#ffd57b', core: '#fff5d0', glow: '#ffb746', spark: '#efb355', bright: '#fff9df'},
  silver: {edge: '#73879d', body: '#d3e3f1', core: '#ffffff', glow: '#c1dfff', spark: '#c2d8ee', bright: '#ffffff'}
};

export const SPARKLER_TIMING = Object.freeze({delay: 700, write: 6500, hold: 2600, fade: 1800, rest: 4500});
export const SPARKLER_CYCLE = Object.values(SPARKLER_TIMING).reduce((sum, value) => sum + value, 0);

export function createSparklerMessage(message, width, height, options = {}) {
  options = options && typeof options === 'object' ? options : {};
  const style = options.style === 'cursive' ? 'cursive' : 'stroke';
  const colour = options.colour === 'silver' || options.color === 'silver' ? 'silver' : 'gold';
  const year = /^\d{1,4}$/.test(String(options.year)) && Number(options.year) > 0
    ? Number(options.year) : new Date().getFullYear();
  const custom = typeof options.message === 'string' && options.message.trim();
  if (custom) message = [...options.message.trim().replace(/\s+/g, ' ').replaceAll('{year}', String(year))].slice(0, 120).join('');
  else if (options.greeting === 'best-wishes') message = `Best wishes for ${year}!`;
  const font = custom ? sparklerFont(style) : null;
  if (custom && !font) throw new Error('Custom sparkler text needs prepareSparklerFont() before seeding');
  const words = (style === 'stroke' ? message.toUpperCase() : message).split(' ');
  const advance = letter => CHINESE[letter] ? 1.2 : font ? (font.glyphs[letter] || font.fallback).advance : letter === ' ' ? 0.52
    : style === 'cursive' ? /[A-Z]/.test(letter) ? 1.05 : /[a-z]/.test(letter) ? 0.7 : letter === '!' ? 0.45 : 0.82 : 0.88;
  const measure = text => [...text].reduce((sum, letter) => sum + advance(letter), 0);
  let lines = [words.join(' ')];
  if (width < 600 && words.length > 1) {
    // Balance whole words across two lines, including the longer Best wishes greeting.
    let best = Infinity;
    for (let split = 1; split < words.length; split++) {
      const candidate = [words.slice(0, split).join(' '), words.slice(split).join(' ')];
      const longest = Math.max(...candidate.map(measure));
      if (longest < best) {best = longest; lines = candidate;}
    }
  }
  const longest = Math.max(...lines.map(measure));
  const segments = [];
  let length = 0;
  const add = (from, to) => {
    const distance = Math.hypot(to[0] - from[0], to[1] - from[1]);
    if (distance === 0) return;
    segments.push({from, to, start: length, end: length + distance});
    length += distance;
  };
  lines.forEach((text, row) => {
    const offset = (longest - measure(text)) / 2;
    let cursor = 0, previousExit = null;
    for (const letter of text) {
      let point = [0, 0];
      const script = !font && style === 'cursive' && CURSIVE[letter];
      const glyph = CHINESE[letter] || (font && (font.glyphs[letter] || font.fallback).commands) || script || GLYPHS[letter.toUpperCase()] || [];
      const position = ([x, y]) => [offset + cursor + x + (CHINESE[letter] || font ? 0 : (1 - y) * 0.09), row * (font ? 2 : 1.75) + y];
      let strokeIndex = 0;
      for (const [command, ...values] of glyph) {
        const end = values.slice(-2);
        if (command === 'M') {
          if (strokeIndex === 0 && previousExit && script) add(previousExit, position(end));
          else length += 0.12;
          strokeIndex++;
        } else if (command === 'L') {
          add(position(point), position(end));
        } else {
          let previous = point;
          const samples = font ? 6 : 18;
          for (let step = 1; step <= samples; step++) {
            const t = step / samples, u = 1 - t;
            const next = [0, 1].map(axis => u ** 3 * point[axis] + 3 * u * u * t * values[axis] + 3 * u * t * t * values[axis + 2] + t ** 3 * end[axis]);
            add(position(previous), position(next)); previous = next;
          }
        }
        point = end;
      }
      previousExit = script ? position([/[A-Z]/.test(letter) ? 0.91 : 0.62, 0.9]) : null;
      cursor += advance(letter);
    }
  });
  const points = segments.flatMap(segment => [segment.from, segment.to]);
  if (!points.length) return createSparklerMessage('Happy New Year', width, height, {...options, message: undefined});
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of points) {minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);}
  for (const point of points) {point[0] -= minX; point[1] -= minY;}
  const span = maxX - minX;
  const size = Math.max(font ? 0.1 : 1, Math.min(52, Math.max(1, width - 56) / span, height * 0.07));
  return {
    type: 'sparkler-message', message, style, colour, year,
    x: (width - span * size) / 2, y: Math.min(90, height * 0.13), size, age: 0, opacity: 1,
    active: true, static: true, vx: 0, vy: 0,
    segments, length, lines: lines.length, layoutWidth: span * size,
    layoutHeight: (maxY - minY) * size
  };
}

export function updateSparklerMessage(particle, delta) {
  if (Number.isFinite(delta) && delta > 0) particle.age = (particle.age + delta) % SPARKLER_CYCLE;
}

/** Pen-up gaps return null, so sparks never connect separate strokes. */
export function sparklerPoint(particle, progress) {
  const distance = Math.max(0, Math.min(1, progress)) * particle.length;
  let low = 0, high = particle.segments.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (particle.segments[middle].end < distance) low = middle + 1; else high = middle;
  }
  const segment = particle.segments[low];
  if (!segment || distance < segment.start) return null;
  const t = (distance - segment.start) / (segment.end - segment.start);
  return segment.from.map((value, axis) => value + (segment.to[axis] - value) * t);
}

const noise = seed => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function drawSparklerMessage(ctx, particle) {
  if (![particle.x, particle.y, particle.size, particle.age].every(Number.isFinite) || particle.size <= 0 || !particle.segments?.length) return;
  const {delay, write, hold, fade} = SPARKLER_TIMING;
  const palette = PALETTES[particle.colour] || PALETTES.gold;
  const elapsed = particle.age - delay;
  if (elapsed <= 0 || elapsed >= write + hold + fade) return;
  const progress = Math.min(1, elapsed / write);
  const opacity = Math.max(0, 1 - Math.max(0, elapsed - write - hold) / fade);
  ctx.save(); ctx.translate(particle.x, particle.y); ctx.scale(particle.size, particle.size);
  ctx.globalAlpha *= (particle.opacity ?? 1) * opacity;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const distance = progress * particle.length;
  for (const [color, lineWidth, blur] of [[palette.edge, 0.065, 14], [palette.body, 0.032, 7], [palette.core, 0.012, 0]]) {
    ctx.strokeStyle = color; ctx.lineWidth = lineWidth;
    ctx.shadowColor = palette.glow; ctx.shadowBlur = blur;
    ctx.beginPath();
    for (const segment of particle.segments) {
      if (segment.start > distance) break;
      const t = Math.min(1, (distance - segment.start) / (segment.end - segment.start));
      ctx.moveTo(...segment.from);
      ctx.lineTo(...segment.from.map((value, axis) => value + (segment.to[axis] - value) * t));
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  // Fixed emission slots bound the work and keep paused frames still.
  const last = Math.floor(Math.min(elapsed, write) / 18);
  for (let index = Math.max(0, last - 44); index <= last; index++) {
    const born = index * 18, age = (elapsed - born) / 1000;
    if (age < 0 || age > 0.8) continue;
    const origin = sparklerPoint(particle, born / write);
    if (!origin) continue;
    const angle = noise(index + 1) * Math.PI * 2;
    const speed = 0.25 + noise(index + 99) * 1.2;
    const x = origin[0] + Math.cos(angle) * speed * age;
    const y = origin[1] + Math.sin(angle) * speed * age + age * age * 0.9;
    ctx.globalAlpha = (particle.opacity ?? 1) * opacity * (1 - age / 0.8);
    ctx.strokeStyle = index % 3 ? palette.spark : palette.core; ctx.lineWidth = 0.018;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(angle) * 0.06, y - Math.sin(angle) * 0.06); ctx.stroke();
  }
  // Small pinpoints shimmer along completed strokes as the greeting holds.
  for (let index = 1; index <= 24; index++) {
    const position = index / 25;
    if (position > progress) break;
    const point = sparklerPoint(particle, position);
    const brightness = Math.max(0, Math.sin(elapsed / 170 + index * 2.399)) ** 14;
    if (!point || brightness < 0.08) continue;
    ctx.globalAlpha = (particle.opacity ?? 1) * opacity * brightness;
    ctx.strokeStyle = palette.core; ctx.lineWidth = 0.014;
    ctx.shadowColor = palette.glow; ctx.shadowBlur = 9;
    const radius = 0.055 + brightness * 0.06;
    ctx.beginPath();
    ctx.moveTo(point[0] - radius, point[1]); ctx.lineTo(point[0] + radius, point[1]);
    ctx.moveTo(point[0], point[1] - radius); ctx.lineTo(point[0], point[1] + radius);
    ctx.stroke();
  }
  const tip = elapsed < write ? sparklerPoint(particle, progress) : null;
  if (tip) {
    ctx.globalAlpha = particle.opacity ?? 1;
    ctx.shadowColor = palette.glow; ctx.shadowBlur = 18;
    ctx.fillStyle = palette.bright; ctx.beginPath(); ctx.arc(...tip, 0.055, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 0.016; ctx.strokeStyle = palette.core;
    for (let ray = 0; ray < 8; ray++) {
      const angle = ray * Math.PI / 4 + elapsed / 350;
      ctx.beginPath(); ctx.moveTo(...tip);
      ctx.lineTo(tip[0] + Math.cos(angle) * 0.15, tip[1] + Math.sin(angle) * 0.15); ctx.stroke();
    }
  }
  ctx.restore();
}
