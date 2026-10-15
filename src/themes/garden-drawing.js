// Canvas-native artwork shared by Easter and Summer Garden. Coordinates are
// normalised so every decoration scales cleanly on small and retina screens.
import {drawIllustratedButterfly} from './butterfly-drawing.js';

function begin(ctx, p, time = 0, sway = false) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.size, p.size);
  ctx.globalAlpha *= p.opacity ?? 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (sway) ctx.rotate(Math.sin(time / 1700 + (p.phase || 0)) * 0.035);
  return true;
}

function oval(ctx, x, y, rx, ry, color, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function line(ctx, points, color, width) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawBlossom(ctx, p) {
  if (!begin(ctx, p)) return;
  ctx.rotate(p.rotation || 0);
  for (let i = 0; i < 5; i++) {
    ctx.rotate(Math.PI * 2 / 5);
    oval(ctx, 0, -0.38, 0.24, 0.43, p.color || '#f5b4cd');
  }
  oval(ctx, 0, 0, 0.17, 0.17, '#efc660');
  ctx.restore();
}

export function drawFlower(ctx, p, time) {
  if (!begin(ctx, p, time, true)) return;
  line(ctx, [[0, 0], [0.04, -0.7], [0, -1.45]], '#598353', 0.055);
  oval(ctx, -0.19, -0.55, 0.29, 0.095, '#80a75f', 0.5);
  oval(ctx, 0.2, -0.9, 0.29, 0.095, '#668f50', -0.5);
  ctx.translate(0, -1.45);
  const gradient = ctx.createLinearGradient(-0.5, -0.5, 0.5, 0.5);
  gradient.addColorStop(0, '#fff7de');
  gradient.addColorStop(1, p.color || '#efb8d1');
  for (let i = 0; i < 10; i++) {
    ctx.rotate(Math.PI * 2 / 10);
    oval(ctx, 0, -0.3, 0.12, 0.33, gradient);
  }
  oval(ctx, 0, 0, 0.2, 0.2, '#d8a636');
  oval(ctx, -0.04, -0.04, 0.13, 0.13, '#f4ce65');
  for (let i = 0; i < 8; i++) oval(ctx, Math.cos(i * 2.4) * 0.12, Math.sin(i * 2.4) * 0.12, 0.018, 0.018, '#b58b38');
  ctx.restore();
}

export function drawEasterEgg(ctx, p) {
  if (!begin(ctx, p)) return;
  ctx.rotate(p.rotation || 0);
  const paint = ctx.createLinearGradient(-0.5, -1.4, 0.6, 0);
  paint.addColorStop(0, '#fff4dc');
  paint.addColorStop(0.35, p.color || '#d7a5c5');
  paint.addColorStop(1, '#967fba');
  ctx.beginPath();
  ctx.moveTo(0, -1.5);
  ctx.bezierCurveTo(0.49, -1.5, 0.78, -0.55, 0.48, -0.17);
  ctx.bezierCurveTo(0.29, 0.07, -0.29, 0.07, -0.48, -0.17);
  ctx.bezierCurveTo(-0.78, -0.55, -0.49, -1.5, 0, -1.5);
  ctx.closePath();
  ctx.fillStyle = paint;
  ctx.fill();
  ctx.save();
  ctx.clip();
  line(ctx, [[-0.8, -0.58], [-0.4, -0.8], [0, -0.58], [0.4, -0.8], [0.8, -0.58]], '#fff2d1', 0.11);
  line(ctx, [[-0.8, -0.35], [0.8, -0.35]], '#f5d786', 0.07);
  for (let i = -1; i <= 1; i++) oval(ctx, i * 0.24, -1.05, 0.055, 0.055, '#fff4e5');
  oval(ctx, -0.23, -1.05, 0.065, 0.23, '#ffffff55', 0.35);
  ctx.restore();
  ctx.restore();
}

export function drawBunny(ctx, p, time) {
  if (!begin(ctx, p)) return;
  ctx.scale(p.facing === 'right' ? -1 : 1, 1);
  if (p.hopping) ctx.rotate((p.facing === 'left' ? 1 : -1) * Math.sin(p.age / 700 * Math.PI) * 0.1);
  const breathe = Math.sin(time / 800 + (p.phase || 0)) * 0.015;
  oval(ctx, 0.55, -0.35, 0.22, 0.22, '#fff7e8');
  oval(ctx, 0.05, -0.45, 0.53, 0.64 + breathe, '#d8c7b6');
  oval(ctx, -0.17, -0.43, 0.3, 0.49, '#f3e8da');
  oval(ctx, -0.28, -1.63, 0.15, 0.6, '#d8c7b6', -0.15);
  oval(ctx, 0.08, -1.66, 0.15, 0.64, '#e6d7c6', 0.16);
  oval(ctx, -0.28, -1.65, 0.07, 0.43, '#dca9ad', -0.15);
  oval(ctx, 0.08, -1.69, 0.07, 0.46, '#e5b6b8', 0.16);
  oval(ctx, -0.13, -1.12, 0.43, 0.42, '#ecdfcf');
  oval(ctx, -0.33, -1.16, 0.035, 0.045, '#4e423e');
  oval(ctx, 0.08, -1.16, 0.035, 0.045, '#4e423e');
  oval(ctx, -0.12, -1.03, 0.055, 0.035, '#c78e90');
  line(ctx, [[-0.12, -1], [-0.12, -0.94]], '#8e7365', 0.018);
  for (const side of [-1, 1]) {
    line(ctx, [[-0.12 + side * 0.13, -0.99], [-0.12 + side * 0.48, -1.02]], '#a69080', 0.012);
    oval(ctx, side * 0.3, -0.04, 0.27, 0.12, '#e7d8c7');
  }
  ctx.restore();
}

export function drawBee(ctx, p, time) {
  if (!begin(ctx, p)) return;
  ctx.scale(p.facing === 'left' ? -1 : 1, 1);
  const flap = 0.4 + Math.abs(Math.sin(time / 35 + (p.phase || 0))) * 0.6;
  oval(ctx, -0.1, -0.35, 0.22, 0.4 * flap, '#e7f0f3bb', -0.5);
  oval(ctx, 0.18, -0.35, 0.22, 0.4 * flap, '#f8fcffcc', 0.5);
  oval(ctx, 0, 0, 0.55, 0.32, '#edc65f');
  ctx.save();
  ctx.beginPath(); ctx.ellipse(0, 0, 0.55, 0.32, 0, 0, Math.PI * 2); ctx.clip();
  for (const x of [-0.3, 0.02, 0.34]) {
    line(ctx, [[x, -0.35], [x, 0.35]], '#4b413b', 0.12);
  }
  ctx.restore();
  oval(ctx, 0.45, -0.04, 0.22, 0.23, '#4b413b');
  oval(ctx, 0.53, -0.11, 0.035, 0.035, '#fff8df');
  line(ctx, [[0.46, -0.22], [0.52, -0.43], [0.62, -0.46]], '#4b413b', 0.025);
  ctx.restore();
}

export function drawLadybird(ctx, p) {
  if (!begin(ctx, p)) return;
  oval(ctx, 0, -0.18, 0.48, 0.38, '#b74d43');
  oval(ctx, -0.1, -0.25, 0.32, 0.27, '#dd6956');
  line(ctx, [[0, -0.55], [0, 0.18]], '#4a3935', 0.035);
  for (const side of [-1, 1]) {
    oval(ctx, side * 0.22, -0.32, 0.075, 0.075, '#473a37');
    oval(ctx, side * 0.27, -0.08, 0.065, 0.065, '#473a37');
  }
  oval(ctx, 0, -0.54, 0.2, 0.17, '#443b37');
  ctx.restore();
}

export function drawGardenButterfly(ctx, p, time) {
  drawIllustratedButterfly(ctx, {...p, alpha: p.opacity});
}
