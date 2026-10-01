import {path, ellipse, gradient, rect} from './christmas-drawing.js';

function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.size, p.size);
  ctx.globalAlpha *= p.opacity ?? 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; return true;
}
function spark(ctx, x, y, radius, phase) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(phase);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, length = radius * (0.65 + Math.sin(phase + i * 2) * 0.3);
    path(ctx, [['moveTo', Math.cos(a) * radius * 0.14, Math.sin(a) * radius * 0.14], ['lineTo', Math.cos(a) * length, Math.sin(a) * length]], null, i % 2 ? '#e6ad69' : '#fff0c4', 0.018);
  }
  ellipse(ctx, 0, 0, 0.035, 0.035, '#fff6d7'); ctx.restore();
}
export function drawBonfire(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  const halo = ctx.createRadialGradient(0, -0.42, 0, 0, -0.42, 1.5);
  halo.addColorStop(0, 'rgba(225,139,66,0.22)'); halo.addColorStop(1, 'rgba(225,139,66,0)');
  ellipse(ctx, 0, -0.42, 1.5, 1.5, halo); ellipse(ctx, 0, 0.53, 1.1, 0.15, 'rgba(9,16,25,0.3)');
  for (const [x, y, angle] of [[0, 0.36, 0], [-0.05, 0.2, -0.24], [0.04, 0.17, 0.3]]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    rect(ctx, -0.9, -0.11, 1.8, 0.24, 0.1, gradient(ctx, -0.1, 0.15, ['#8b7156', '#473e3b']), '#a48765', 0.02);
    for (let i = 0; i < 3; i++) path(ctx, [['moveTo', -0.67, -0.06 + i * 0.06], ['quadraticCurveTo', 0, -0.1 + i * 0.06, 0.73, -0.04 + i * 0.06]], null, '#c29160', 0.012);
    ellipse(ctx, 0.8, 0.01, 0.075, 0.1, '#b89366'); ellipse(ctx, 0.8, 0.01, 0.035, 0.06, '#675447'); ctx.restore();
  }
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 0.23, height = 0.8 + (i % 2) * 0.42 + Math.sin(time * 0.004 + i) * 0.11, sway = Math.sin(time * 0.003 + i * 2) * 0.1;
    path(ctx, [['moveTo', x - 0.24, 0.19], ['bezierCurveTo', x - 0.5, -0.12, x + 0.17, -height * 0.62, x + sway, -height], ['bezierCurveTo', x + 0.55, -height * 0.33, x + 0.36, -0.04, x + 0.23, 0.19], ['closePath']], gradient(ctx, -height, 0.25, ['#be5942', '#e39751', '#f3d294']));
    path(ctx, [['moveTo', x - 0.11, 0.18], ['quadraticCurveTo', x + 0.14, -0.04, x + sway * 0.4, -height * 0.6], ['quadraticCurveTo', x + 0.26, -0.02, x + 0.11, 0.18]], '#fae6b2');
  }
  for (let i = 0; i < 8; i++) {
    const progress = ((time * 0.00035 + i * 0.127) % 1 + 1) % 1;
    ctx.save(); ctx.globalAlpha *= Math.sin(progress * Math.PI) * 0.8;
    const x = Math.sin(i * 2.3 + progress * 2) * 0.45, y = -0.5 - progress * 1.3;
    path(ctx, [['moveTo', x, y], ['lineTo', x + 0.025, y + 0.06]], null, '#eec58c', 0.018); ctx.restore();
  }
  ctx.restore();
}
export function drawGuyEffigy(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  ctx.globalAlpha *= 1 - Math.max(0, Math.min(1, p.burnProgress || 0));
  rect(ctx, -0.05, 0.15, 0.1, 1.6, 0.02, '#836b54');
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1);
    path(ctx, [['moveTo', 0.29, 0.07], ['lineTo', 0.9, 0.19], ['lineTo', 0.91, 0.44], ['lineTo', 0.32, 0.36], ['closePath']], gradient(ctx, 0.1, 0.45, ['#748595', '#3a4b60']), '#97a1a5', 0.018);
    for (let i = 0; i < 4; i++) path(ctx, [['moveTo', 0.88, 0.22 + i * 0.04], ['lineTo', 1.1 + i % 2 * 0.05, 0.21 + i * 0.07]], null, '#d1b27b', 0.018);
    ctx.restore();
  }
  path(ctx, [['moveTo', -0.33, 0.02], ['quadraticCurveTo', -0.5, 0.78, -0.51, 1.28], ['lineTo', -0.06, 1.19], ['lineTo', 0.06, 0.76], ['lineTo', 0.14, 1.21], ['lineTo', 0.5, 1.3], ['quadraticCurveTo', 0.51, 0.8, 0.32, 0.02], ['closePath']], gradient(ctx, 0, 1.3, ['#758493', '#40536b', '#293c53']), '#859197', 0.02);
  for (const side of [-1, 1]) path(ctx, [['moveTo', side * 0.19, 0.03], ['lineTo', side * 0.3, 0.42], ['lineTo', 0.04, 0.22], ['closePath']], '#a0a9a6');
  for (const y of [0.46, 0.67, 0.88]) ellipse(ctx, 0.03, y, 0.028, 0.028, '#c8ad77');
  rect(ctx, -0.34, 0.58, 0.17, 0.19, 0.01, '#ad8b73', '#d1b990', 0.015);
  ellipse(ctx, 0, -0.33, 0.35, 0.4, gradient(ctx, -0.72, 0.04, ['#efdfbf', '#c8ad8a']));
  for (const side of [-1, 1]) { ellipse(ctx, side * 0.13, -0.39, 0.045, 0.033, '#584b48'); path(ctx, [['moveTo', side * 0.06, -0.49], ['quadraticCurveTo', side * 0.14, -0.53, side * 0.22, -0.47]], null, '#776158', 0.027); }
  path(ctx, [['moveTo', -0.17, -0.17], ['quadraticCurveTo', 0, -0.11, 0.17, -0.2]], null, '#796059', 0.021);
  for (let i = 0; i < 5; i++) path(ctx, [['moveTo', -0.11 + i * 0.055, -0.22], ['lineTo', -0.11 + i * 0.055, -0.15]], null, '#796059', 0.015);
  path(ctx, [['moveTo', -0.37, -0.63], ['lineTo', -0.28, -1.12], ['quadraticCurveTo', 0, -1.23, 0.27, -1.09], ['lineTo', 0.36, -0.62], ['closePath']], gradient(ctx, -1.2, -0.6, ['#655b60', '#2e3544']));
  rect(ctx, -0.3, -0.78, 0.63, 0.11, 0.01, '#a87f63'); ellipse(ctx, 0, -0.63, 0.53, 0.08, '#343b4a');
  path(ctx, [['moveTo', -0.19, 0], ['lineTo', -0.07, 0.15], ['lineTo', 0.12, 0.05], ['lineTo', 0.25, 0.43], ['lineTo', 0.41, 0.35], ['lineTo', 0.17, -0.04], ['closePath']], '#ac695d');
  if (p.burning) {ctx.save(); ctx.globalAlpha *= 0.35; ellipse(ctx, 0, 0.68, 0.4, 0.6, '#e4a058'); ctx.restore();}
  ctx.restore();
}
export function drawCatherineWheel(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  rect(ctx, -0.05, -0.14, 0.1, 1.47, 0.02, '#7a6954');
  ctx.save(); ctx.rotate(p.rotation || 0);
  ctx.beginPath(); ctx.arc(0, 0, 0.63, 0, Math.PI * 2); ctx.strokeStyle = '#b69a73'; ctx.lineWidth = 0.08; ctx.stroke();
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 3);
    path(ctx, [['moveTo', 0, 0], ['lineTo', 0.64, 0]], null, '#8c7965', 0.045);
    rect(ctx, 0.48, -0.13, 0.28, 0.11, 0.025, '#735867', '#c5a789', 0.015);
    spark(ctx, 0.8, -0.1, 0.22, time * 0.004 + i); ctx.restore();
  }
  ellipse(ctx, 0, 0, 0.11, 0.11, '#cdaf7f'); ellipse(ctx, 0, 0, 0.035, 0.035, '#67717a');
  for (const s of p.sparks || []) {
    if (![s.x, s.y, s.size].every(Number.isFinite)) continue;
    ctx.save(); ctx.globalAlpha *= s.opacity ?? 1;
    ellipse(ctx, s.x / p.size, s.y / p.size, s.size / p.size, s.size / p.size, s.color || '#efc07c'); ctx.restore();
  }
  ctx.restore(); ctx.restore();
}
export function drawRomanCandle(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  rect(ctx, -0.22, 0, 0.44, 1.55, 0.06, gradient(ctx, 0, 1.55, ['#8f5263', '#603f55']), '#c7a487', 0.025);
  rect(ctx, -0.22, 0.57, 0.44, 0.49, 0.01, '#d8bd8d');
  path(ctx, [['moveTo', 0, 0.64], ['lineTo', 0.04, 0.76], ['lineTo', 0.16, 0.77], ['lineTo', 0.06, 0.85], ['lineTo', 0.1, 0.98], ['lineTo', 0, 0.9], ['lineTo', -0.1, 0.98], ['lineTo', -0.06, 0.85], ['lineTo', -0.16, 0.77], ['lineTo', -0.04, 0.76], ['closePath']], '#896473');
  ellipse(ctx, 0, 0, 0.23, 0.07, '#453b4b');
  path(ctx, [['moveTo', 0, 0], ['quadraticCurveTo', -0.13, -0.15, 0.06, -0.25]], null, '#b6a085', 0.035);
  if ((p.shotCount || 0) < (p.maxShots ?? 8)) spark(ctx, 0.06, -0.25, 0.27, time * 0.005);
  ctx.restore();
  for (const shot of p.shots || []) {
    if (![shot.x, shot.y, shot.size].every(Number.isFinite)) continue;
    ctx.save(); ctx.globalAlpha *= (p.opacity ?? 1) * (shot.opacity ?? 1);
    path(ctx, [['moveTo', shot.x, shot.y], ['lineTo', shot.x, shot.y + 12]], null, shot.color || '#f3c17b', 1.8);
    ellipse(ctx, shot.x, shot.y, shot.size, shot.size, '#fff0c6'); ctx.restore();
  }
}
export function drawSparklerBundle(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  for (let i = 0; i < 5; i++) {
    ctx.save(); ctx.translate((i - 2) * 0.1, 0); ctx.rotate((i - 2) * 0.11);
    path(ctx, [['moveTo', 0, 0.12], ['lineTo', 0, -1.67]], null, '#a3a8ab', 0.024);
    path(ctx, [['moveTo', 0, -0.72], ['lineTo', 0, -1.61]], null, '#736d70', 0.048);
    spark(ctx, 0, -1.67, 0.31, time * 0.006 + (p.sparklePhase || 0) + i);
    ctx.restore();
  }
  rect(ctx, -0.31, -0.08, 0.62, 0.27, 0.025, '#8e7155', '#b89a73', 0.015);
  path(ctx, [['moveTo', -0.12, -0.08], ['lineTo', -0.12, 0.19], ['moveTo', 0.12, -0.08], ['lineTo', 0.12, 0.19]], null, '#c5aa80', 0.018);
  ctx.restore();
}
