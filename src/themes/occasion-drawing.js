function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.size, p.size);
  ctx.rotate(p.rotation || 0); ctx.globalAlpha *= p.opacity ?? 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return true;
}
function oval(ctx, x, y, rx, ry, color) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
}
function line(ctx, points, color, width) {
  ctx.beginPath(); ctx.moveTo(...points[0]); for (const p of points.slice(1)) ctx.lineTo(...p);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}

export function drawMortarboard(ctx, p, time) {
  if (!begin(ctx, p)) return;
  ctx.fillStyle = '#303b52'; ctx.beginPath(); ctx.moveTo(-0.48, -0.05); ctx.lineTo(0.48, -0.05); ctx.lineTo(0.4, 0.45); ctx.quadraticCurveTo(0, 0.67, -0.4, 0.45); ctx.closePath(); ctx.fill();
  const paint = ctx.createLinearGradient(-1, -0.5, 1, 0.4);
  paint.addColorStop(0, '#525e77'); paint.addColorStop(1, '#1d2639');
  ctx.fillStyle = paint; ctx.strokeStyle = '#78829a'; ctx.lineWidth = 0.025;
  ctx.beginPath(); ctx.moveTo(-1, -0.1); ctx.lineTo(0, -0.64); ctx.lineTo(1, -0.1); ctx.lineTo(0, 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
  const sway = Math.sin(time / 220 + p.phase) * 0.12;
  line(ctx, [[0, -0.09], [0.7, 0.13], [0.77 + sway, 0.95]], '#d9b263', 0.045);
  oval(ctx, 0, -0.09, 0.07, 0.05, '#edcb80');
  for (let i = -2; i <= 2; i++) line(ctx, [[0.77 + sway, 0.86], [0.77 + sway + i * 0.04, 1.14]], '#e7be6b', 0.025);
  ctx.restore();
}

export function drawDiploma(ctx, p) {
  if (!begin(ctx, p)) return;
  const paint = ctx.createLinearGradient(0, -0.4, 0, 0.4);
  paint.addColorStop(0, '#fff4d9'); paint.addColorStop(0.6, '#e3d0ac'); paint.addColorStop(1, '#bca680');
  ctx.fillStyle = paint; ctx.fillRect(-1, -0.35, 2, 0.7);
  oval(ctx, -1, 0, 0.12, 0.35, '#f8eacb'); oval(ctx, 1, 0, 0.12, 0.35, '#d1bc94');
  line(ctx, [[0, -0.37], [0, 0.38]], '#a34353', 0.17);
  for (const side of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(side * 0.65, -0.5, side * 0.66, 0.36, 0, 0); ctx.strokeStyle = '#ba5864'; ctx.lineWidth = 0.075; ctx.stroke();
    line(ctx, [[0, 0.06], [side * 0.22, 0.65]], '#a34353', 0.1);
  }
  ctx.restore();
}

export function drawBirthdayCake(ctx, p, time) {
  if (!begin(ctx, p)) return;
  oval(ctx, 0, 0.08, 1.3, 0.18, '#c1c9cf');
  ctx.fillStyle = '#b77e6d'; ctx.fillRect(-1, -0.9, 2, 0.92);
  oval(ctx, 0, -0.02, 1, 0.16, '#bb8774');
  ctx.fillStyle = '#f3c2c4'; ctx.fillRect(-1, -0.94, 2, 0.23);
  oval(ctx, 0, -0.94, 1, 0.2, '#f8d9d0');
  for (let i = 0; i < 9; i++) {
    const x = -0.88 + i * 0.22;
    oval(ctx, x, -0.72, 0.11, 0.12 + (i % 3) * 0.035, '#f3c2c4');
    line(ctx, [[x, -0.44], [x + 0.05, -0.36]], i % 2 ? '#e6ce86' : '#c7dbc3', 0.04);
  }
  for (const x of [-0.52, 0, 0.52]) {
    ctx.fillStyle = x === 0 ? '#99b9c9' : '#d69ba9'; ctx.fillRect(x - 0.05, -1.65, 0.1, 0.7);
    for (let i = 0; i < 3; i++) line(ctx, [[x - 0.04, -1.56 + i * 0.2], [x + 0.04, -1.5 + i * 0.2]], '#fff6da', 0.025);
    const flicker = 1 + Math.sin(time / 120 + x * 8) * 0.1;
    oval(ctx, x, -1.83, 0.1, 0.19 * flicker, '#eab45c'); oval(ctx, x, -1.79, 0.05, 0.1, '#fff0af');
  }
  ctx.restore();
}

export function drawCelebrationHeart(ctx, p) {
  if (!begin(ctx, p)) return;
  const paint = ctx.createLinearGradient(-1, -1, 1, 1);
  paint.addColorStop(0, '#f1b2bd'); paint.addColorStop(1, '#b2617c');
  ctx.fillStyle = paint; ctx.beginPath(); ctx.moveTo(0, 0.85);
  ctx.bezierCurveTo(-1.45, -0.1, -0.62, -1.28, 0, -0.52); ctx.bezierCurveTo(0.62, -1.28, 1.45, -0.1, 0, 0.85); ctx.fill(); ctx.restore();
}

export function drawAnniversaryRings(ctx, p) {
  if (!begin(ctx, p)) return;
  const paint = ctx.createLinearGradient(-1, -1, 1, 0.5);
  paint.addColorStop(0, '#fff0b7'); paint.addColorStop(0.35, '#c89443'); paint.addColorStop(0.65, '#f2d38d'); paint.addColorStop(1, '#a77c3b');
  for (const side of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(side * 0.34, -0.5, 0.59, 0.7, side * 0.25, 0, Math.PI * 2); ctx.strokeStyle = paint; ctx.lineWidth = 0.15; ctx.stroke();
  }
  ctx.fillStyle = '#e9f6fa'; ctx.beginPath(); ctx.moveTo(0.25, -1.15); ctx.lineTo(0.5, -1.48); ctx.lineTo(0.74, -1.15); ctx.lineTo(0.49, -0.94); ctx.closePath(); ctx.fill();
  line(ctx, [[0.25, -1.15], [0.74, -1.15], [0.49, -0.94], [0.5, -1.48]], '#9fb9c6', 0.025);
  ctx.restore();
}

export function drawRibbonBow(ctx, p, time) {
  if (!begin(ctx, p)) return;
  ctx.rotate(Math.sin(time / 1600 + p.phase) * 0.03);
  for (const side of [-1, 1]) {
    ctx.fillStyle = side < 0 ? '#bd7b8e' : '#d59aab'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(side * 1.6, -1.5, side * 1.9, 1, 0, 0.2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 0.1); ctx.lineTo(side * 0.8, 1.55); ctx.lineTo(side * 0.35, 1.4); ctx.lineTo(side * 0.35, 1.7); ctx.lineTo(-side * 0.15, 0.2); ctx.closePath(); ctx.fill();
  }
  oval(ctx, 0, 0.1, 0.22, 0.26, '#a7657d'); ctx.restore();
}
