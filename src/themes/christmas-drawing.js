/** Small canvas illustrations, drawn in local coordinates and mirrored as a whole. */
export function path(ctx, points, fill, stroke, width = 1) {
  ctx.beginPath();
  for (const [command, ...args] of points) ctx[command](...args);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
}
export function gradient(ctx, y1, y2, colors) {
  const paint = ctx.createLinearGradient(0, y1, 0, y2);
  colors.forEach((color, i) => paint.addColorStop(i / (colors.length - 1), color));
  return paint;
}
export function rect(ctx, x, y, width, height, radius, fill, stroke, strokeWidth = 0.6) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeWidth; ctx.stroke(); }
}

