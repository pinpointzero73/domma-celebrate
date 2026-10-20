import {path, ellipse} from './christmas-drawing.js';

export function beginIllustration(ctx, p, mirror = false) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.size * (mirror && p.vx < 0 ? -1 : 1), p.size);
  ctx.rotate(p.rotation || 0);
  ctx.globalAlpha *= p.opacity ?? 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  return true;
}
export function line(ctx, points, color, width = 0.02) {
  path(ctx, points, null, color, width);
}
export function leaf(ctx, x, y, angle, size = 1, color = '#4e795d') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(size, size);
  path(ctx, [['moveTo', 0, 0], ['quadraticCurveTo', -0.45, -0.24, 0, -0.9], ['quadraticCurveTo', 0.4, -0.32, 0, 0], ['closePath']], color);
  line(ctx, [['moveTo', 0, 0], ['lineTo', 0, -0.7]], '#9cab7a', 0.018);
  ctx.restore();
}
export function heart(ctx, x, y, size, fill, stroke = '#9c4655') {
  ctx.save(); ctx.translate(x, y); ctx.scale(size, size);
  path(ctx, [['moveTo', 0, 0.7], ['bezierCurveTo', -1.25, -0.08, -0.6, -0.95, 0, -0.42], ['bezierCurveTo', 0.6, -0.95, 1.25, -0.08, 0, 0.7], ['closePath']], fill, stroke, 0.035);
  line(ctx, [['moveTo', -0.5, -0.16], ['quadraticCurveTo', -0.49, -0.42, -0.27, -0.38]], '#f6cfca', 0.055);
  ctx.restore();
}
export function stud(ctx, x, y, size = 0.035) {
  ellipse(ctx, x, y, size, size, '#dab878');
  ellipse(ctx, x - size * 0.25, y - size * 0.3, size * 0.3, size * 0.3, '#fff0be');
}
