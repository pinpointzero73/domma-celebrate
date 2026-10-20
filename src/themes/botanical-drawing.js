import {path, ellipse, gradient} from './christmas-drawing.js';
import {beginIllustration as begin, line, leaf} from './illustration-utils.js';

function roseHead(ctx, white, tudor = false, bloom = 1) {
  const dark = white ? '#b7a28d' : '#7f3046';
  const colors = white ? ['#fff9e8', '#e2d6c0'] : ['#d55b6a', '#982c48'];
  for (let layer = 0; layer < 3; layer++) {
    const scale = bloom * (1 - layer * 0.27);
    ctx.save(); ctx.scale(scale, scale); ctx.rotate(layer * 0.6);
    for (let i = 0; i < 5; i++) {
      ctx.save(); ctx.rotate(i * Math.PI * 2 / 5);
      const cream = tudor && layer === 1;
      path(ctx, [['moveTo', 0, 0.19], ['bezierCurveTo', -0.71, -0.15, -0.78, -0.78, -0.25, -0.92], ['quadraticCurveTo', 0, -1.1, 0.25, -0.92], ['bezierCurveTo', 0.78, -0.78, 0.71, -0.15, 0, 0.19], ['closePath']], gradient(ctx, -1, 0.2, cream ? ['#fff5dc', '#d8c9ac'] : colors), cream ? '#b4a88d' : dark, 0.025);
      line(ctx, [['moveTo', -0.46, -0.62], ['quadraticCurveTo', -0.26, -0.83, 0.02, -0.76]], cream || white ? '#fffdf0' : '#ee9290', 0.027);
      ctx.restore();
    }
    ctx.restore();
  }
  ellipse(ctx, 0, 0, 0.14, 0.14, '#b98a42');
  for (let i = 0; i < 9; i++) ellipse(ctx, Math.cos(i * 2.4) * 0.09, Math.sin(i * 2.4) * 0.09, 0.025, 0.025, '#f6d887');
}
export function drawEnglishRose(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  line(ctx, [['moveTo', 0, 0.1], ['bezierCurveTo', -0.25, 0.5, 0.1, 1.1, 0, 1.55]], '#436448', 0.075);
  leaf(ctx, -0.04, 0.95, -0.85, 0.65); leaf(ctx, -0.05, 1.15, 0.9, 0.55);
  roseHead(ctx, p.color?.toLowerCase() === '#ffffff', false, 0.83 + Math.sin(time * 0.002 + (p.bloomPhase || 0)) * 0.035);
  ctx.restore();
}
export function drawTudorRose(ctx, p) {
  if (!begin(ctx, p)) return;
  for (let i = 0; i < 5; i++) leaf(ctx, 0, 0, i * Math.PI * 2 / 5 + 0.63, 1.1, '#45674d');
  roseHead(ctx, false, true);
  ctx.restore();
}
function thistle(ctx, colors = ['#8f639a', '#b286b5', '#e4b9d9']) {
  ellipse(ctx, 0, 0.14, 0.32, 0.36, gradient(ctx, -0.2, 0.5, ['#789073', '#3d6257']));
  for (let row = 0; row < 3; row++) for (let i = -2; i <= 2; i++) {
    const x = i * 0.11 + (row % 2) * 0.04, y = row * 0.13;
    line(ctx, [['moveTo', x, y + 0.12], ['lineTo', x - 0.09, y - 0.09], ['lineTo', x - 0.16, y - 0.12]], '#a5b28a', 0.018);
  }
  for (let i = 0; i < 27; i++) {
    const x = (i / 26 - 0.5) * 0.62, tip = -0.5 - Math.sin(i * 1.9) * 0.065;
    line(ctx, [['moveTo', x * 0.8, -0.04], ['quadraticCurveTo', x * 1.15, -0.28, x, tip]], colors[i % colors.length], 0.024);
  }
}
export function drawThistle(ctx, p) {
  if (!begin(ctx, p)) return;
  line(ctx, [['moveTo', 0, 1.9], ['quadraticCurveTo', 0.14, 1, 0, 0.35]], '#536e55', 0.055);
  leaf(ctx, 0.025, 1.25, 0.9, 0.7); leaf(ctx, 0.035, 1.6, -0.9, 0.65);
  for (const side of [-1, 1]) line(ctx, [['moveTo', side * 0.1, 1.18], ['lineTo', side * 0.45, 0.82], ['lineTo', side * 0.35, 1.08], ['lineTo', side * 0.57, 1.03]], '#6e8765', 0.025);
  thistle(ctx, p.petalColors); ctx.restore();
}
export function drawThistlePlant(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  ctx.rotate(Math.sin(time * 0.001 + (p.swayPhase || 0)) * 0.04);
  for (let i = -1; i <= 1; i++) {
    const x = i * 0.55, y = -1.55 - (i === 0 ? 0.35 : 0);
    line(ctx, [['moveTo', 0, 0], ['quadraticCurveTo', x * 0.8, -0.8, x, y]], '#57765b', 0.045);
    leaf(ctx, x * 0.6, -0.7, i <= 0 ? -1 : 1, 0.7);
    ctx.save(); ctx.translate(x, y); ctx.scale(0.8, 0.8); thistle(ctx); ctx.restore();
  }
  ctx.restore();
}
export function drawHeather(ctx, p) {
  if (!begin(ctx, p)) return;
  ctx.rotate(Math.sin(p.sway || 0) * 0.1);
  line(ctx, [['moveTo', 0.08, 0.8], ['quadraticCurveTo', -0.1, 0, 0.05, -0.9]], '#617258', 0.035);
  const count = p.bellCount || 7;
  for (let i = 0; i < count; i++) {
    const side = i % 2 ? -1 : 1, y = -0.8 + i * 1.25 / count;
    line(ctx, [['moveTo', 0, y + 0.08], ['lineTo', side * 0.18, y]], '#6b7b5d', 0.022);
    ctx.save(); ctx.translate(side * 0.18, y); ctx.rotate(-side * 0.25);
    path(ctx, [['moveTo', -0.07, -0.09], ['quadraticCurveTo', -0.18, -0.04, -0.14, 0.17], ['quadraticCurveTo', 0, 0.24, 0.14, 0.17], ['quadraticCurveTo', 0.18, -0.04, 0.07, -0.09], ['closePath']], gradient(ctx, -0.1, 0.2, ['#d2a4c1', p.color || '#95649a']), '#855582', 0.016);
    ellipse(ctx, 0, 0.17, 0.1, 0.025, '#714a75');
    line(ctx, [['moveTo', -0.045, 0.18], ['lineTo', -0.025, 0.24]], '#e6caac', 0.018);
    ctx.restore();
    leaf(ctx, 0, y + 0.2, side * 0.85, 0.24, '#6e8765');
  }
  ctx.restore();
}
function daffodilHead(ctx) {
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 3);
    path(ctx, [['moveTo', 0, 0.1], ['quadraticCurveTo', -0.62, -0.36, -0.22, -0.97], ['lineTo', 0, -1.13], ['quadraticCurveTo', 0.64, -0.72, 0, 0.1], ['closePath']], gradient(ctx, -1.1, 0, ['#fff1a0', '#e6b745']), '#c8973b', 0.018);
    line(ctx, [['moveTo', 0, -0.19], ['lineTo', -0.03, -0.89]], '#fff5b0', 0.027); ctx.restore();
  }
  path(ctx, [['moveTo', -0.21, -0.17], ['lineTo', -0.3, 0.16], ['quadraticCurveTo', 0, 0.39, 0.3, 0.16], ['lineTo', 0.21, -0.17], ['closePath']], '#dfa339', '#c58a31', 0.025);
  ellipse(ctx, 0, -0.14, 0.26, 0.18, '#f7cc61'); ellipse(ctx, 0, -0.13, 0.17, 0.11, '#aa6a27');
  for (let i = -1; i <= 1; i++) line(ctx, [['moveTo', i * 0.05, -0.1], ['lineTo', i * 0.07, -0.2]], '#f7d282', 0.018);
}
export function drawDaffodil(ctx, p) {
  if (!begin(ctx, p)) return;
  line(ctx, [['moveTo', 0, 1.6], ['quadraticCurveTo', 0.12, 0.6, 0, 0]], '#58754e', 0.065);
  leaf(ctx, 0, 1.5, -0.35, 1.05, '#67865a');
  daffodilHead(ctx); ctx.restore();
}
export function drawDaffodilField(ctx, p, time = 0) {
  if (![p.x, p.y].every(Number.isFinite)) return;
  ctx.save(); ctx.globalAlpha *= p.opacity ?? 1;
  for (const f of p.flowers || []) {
    if (!Number.isFinite(f.size) || f.size <= 0) continue;
    const x = p.x + f.x, y = p.y - f.y;
    const sway = Math.sin(time * 0.001 + (f.swayPhase || 0)) * 0.08;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
    drawDaffodil(ctx, {x: 0, y: -f.size * 1.55, size: f.size, opacity: 1});
    ctx.restore();
  }
  ctx.restore();
}
function leek(ctx) {
  for (let i = -2; i <= 2; i++) {
    const x = i * 0.27;
    path(ctx, [['moveTo', -0.12, 0.95], ['quadraticCurveTo', x * 0.6, -0.1, x, -0.97 + Math.abs(i) * 0.13], ['quadraticCurveTo', x + 0.3, -0.55, 0.14, 1], ['closePath']], gradient(ctx, -1, 1.2, [i % 2 ? '#6e9271' : '#3b6e5c', '#94ad86', '#efe9cd']), '#64866c', 0.015);
    line(ctx, [['moveTo', 0, 0.9], ['quadraticCurveTo', x * 0.75, -0.1, x + 0.025, -0.7]], '#b5c5a0', 0.013);
  }
  path(ctx, [['moveTo', -0.14, 0.6], ['lineTo', -0.19, 1.28], ['quadraticCurveTo', 0, 1.43, 0.19, 1.28], ['lineTo', 0.14, 0.6], ['closePath']], gradient(ctx, 0.6, 1.4, ['#c6d0af', '#fff6de']), '#b8ba9c', 0.018);
  for (let i = -2; i <= 2; i++) line(ctx, [['moveTo', i * 0.055, 1.32], ['quadraticCurveTo', i * 0.08, 1.48, i * 0.11 + 0.035, 1.57]], '#b7a78b', 0.015);
}
export function drawLeek(ctx, p) {if (!begin(ctx, p)) return; leek(ctx); ctx.restore();}
export function drawLeekBundle(ctx, p) {
  if (!begin(ctx, p)) return;
  for (const i of [-2, 2, -1, 1, 0]) {ctx.save(); ctx.translate(i * 0.17, -0.05); ctx.rotate(i * 0.14); ctx.scale(0.7, 0.7); leek(ctx); ctx.restore();}
  path(ctx, [['moveTo', -0.49, 0.4], ['quadraticCurveTo', 0, 0.55, 0.49, 0.4], ['lineTo', 0.46, 0.56], ['quadraticCurveTo', 0, 0.68, -0.46, 0.56], ['closePath']], '#ae4650', '#793541', 0.025);
  for (const side of [-1, 1]) path(ctx, [['moveTo', 0, 0.5], ['bezierCurveTo', side * 0.7, 0.1, side * 0.7, 0.8, 0, 0.5], ['closePath']], '#cf6770', '#873c4c', 0.025);
  ellipse(ctx, 0, 0.5, 0.09, 0.1, '#e49b8b'); ctx.restore();
}
