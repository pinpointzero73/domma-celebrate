import {path, ellipse, gradient, rect} from './christmas-drawing.js';
import {drawElf} from './christmas-festive.js';
import {drawLeprechaun} from './character-drawing.js';

/** Adult, rear-view cartoon characters: lowered trousers and a cheeky wiggle. */
function drawMooner(ctx, p, time, irish) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return;
  if (p.state && p.state !== 'mooning') {
    (irish ? drawLeprechaun : drawElf)(ctx, p, time);
    return;
  }
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.size * (p.vx < 0 ? -1 : 1), p.size);
  ctx.globalAlpha *= p.opacity ?? 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const wiggle = Math.sin(time * 0.005) * 0.055;
  ctx.rotate(wiggle);
  const green = irish ? '#376852' : '#315c43';
  const skin = gradient(ctx, 0.18, 0.8, ['#f2d0ad', '#dda382']);
  for (const side of [-1, 1]) {
    rect(ctx, side * 0.22 - 0.065, 0.7, 0.13, 0.53, 0.04, '#e5d9ba');
    if (!irish) for (const y of [0.88, 1.02, 1.14]) rect(ctx, side * 0.22 - 0.068, y, 0.136, 0.045, 0, '#b8444a');
    path(ctx, [['moveTo', side * 0.22 - 0.1, 1.18], ['lineTo', side * 0.22 + 0.09, 1.18], ['quadraticCurveTo', side * 0.22 + 0.29, 1.2, side * 0.22 + 0.27, 1.33], ['lineTo', side * 0.22 - 0.12, 1.32], ['closePath']], '#493c37');
    rect(ctx, side * 0.22 - 0.04, 1.2, 0.1, 0.065, 0.012, '#d6b278');
  }
  // Trousers gathered at the knees, visibly below the two cartoon cheeks.
  rect(ctx, -0.39, 0.75, 0.78, 0.23, 0.075, green, '#a0b095', 0.02);
  for (const x of [-0.24, -0.08, 0.12, 0.28]) path(ctx, [['moveTo', x, 0.78], ['lineTo', x - 0.03, 0.94]], null, '#203f34', 0.018);
  // Bent-forward jacket and rounded, non-explicit rump.
  path(ctx, [['moveTo', -0.26, -0.47], ['quadraticCurveTo', -0.47, -0.18, -0.36, 0.29], ['quadraticCurveTo', 0, 0.42, 0.37, 0.29], ['quadraticCurveTo', 0.46, -0.18, 0.25, -0.47], ['closePath']], gradient(ctx, -0.5, 0.4, ['#73966c', green]));
  ellipse(ctx, -0.17, 0.49, 0.26, 0.3, skin);
  ellipse(ctx, 0.17, 0.49, 0.26, 0.3, skin);
  path(ctx, [['moveTo', 0, 0.35], ['quadraticCurveTo', -0.025, 0.57, 0, 0.74]], null, '#bd846d', 0.018);
  for (const side of [-1, 1]) {
    path(ctx, [['moveTo', side * 0.25, -0.3], ['quadraticCurveTo', side * 0.59, 0.02, side * 0.43, 0.58]], null, green, 0.15);
    ellipse(ctx, side * 0.41, 0.65, 0.075, 0.09, '#ecc2a0');
  }
  // Turning over a shoulder, with a grin and the original costume's hat.
  ellipse(ctx, 0.03, -0.68, 0.28, 0.31, '#e7b994');
  if (irish) {
    path(ctx, [['moveTo', 0.2, -0.63], ['quadraticCurveTo', 0.5, -0.5, 0.28, -0.3], ['lineTo', 0.13, -0.48]], '#a36643');
    rect(ctx, -0.27, -1.35, 0.6, 0.62, 0.04, green, '#8ba17e', 0.018);
    rect(ctx, -0.27, -0.98, 0.6, 0.12, 0, '#414c3e');
    rect(ctx, 0.08, -1, 0.16, 0.16, 0.02, '#dbb779');
    rect(ctx, 0.115, -0.965, 0.09, 0.09, 0, green);
    ellipse(ctx, 0.02, -0.75, 0.46, 0.065, green);
  } else {
    path(ctx, [['moveTo', -0.23, -0.68], ['lineTo', -0.42, -0.84], ['lineTo', -0.25, -0.87], ['closePath']], '#e7b994');
    path(ctx, [['moveTo', -0.27, -0.93], ['quadraticCurveTo', -0.13, -1.46, 0.29, -1.28], ['quadraticCurveTo', 0.5, -1.22, 0.54, -1.02], ['quadraticCurveTo', 0.29, -1.19, 0.3, -0.92], ['closePath']], gradient(ctx, -1.4, -0.9, ['#d56862', '#a33747']));
    path(ctx, [['moveTo', -0.27, -0.92], ['quadraticCurveTo', 0, -1, 0.3, -0.92]], null, '#d9b878', 0.065);
    ellipse(ctx, 0.54, -1.02, 0.065, 0.075, '#f1ce7e');
  }
  ellipse(ctx, 0.29, -0.62, 0.09, 0.06, '#dfa582');
  ellipse(ctx, 0.19, -0.71, 0.025, 0.033, '#423736');
  path(ctx, [['moveTo', 0.15, -0.54], ['quadraticCurveTo', 0.26, -0.47, 0.32, -0.55]], null, '#8b5949', 0.018);
  ctx.restore();
}

export function drawMooningElf(ctx, particle, time = particle.time || 0) {drawMooner(ctx, particle, time, false);}
export function drawMooningLeprechaun(ctx, particle, time = particle.time || 0) {drawMooner(ctx, particle, time, true);}
