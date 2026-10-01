import {path, ellipse, gradient, rect} from './christmas-drawing.js';

function begin(ctx, p, mirror = false) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y);
  ctx.scale(p.size * (mirror && p.vx < 0 ? -1 : 1), p.size);
  ctx.rotate(p.rotation || 0); ctx.globalAlpha *= p.opacity ?? 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; return true;
}
function coal(ctx, x, y, rx, ry = rx) {
  ellipse(ctx, x, y, rx, ry, '#20252c');
  ellipse(ctx, x - rx * 0.25, y - ry * 0.25, rx * 0.25, ry * 0.2, '#58616a');
}
export function drawGhost(ctx, p, time = p.time || 0) {
  if (!begin(ctx, p)) return;
  const flutter = Math.sin(time * 0.004) * 0.08;
  ctx.shadowColor = '#a7c1c5'; ctx.shadowBlur = 5;
  path(ctx, [['moveTo', -0.57, -0.37], ['bezierCurveTo', -0.57, -1.22, 0.6, -1.2, 0.58, -0.35], ['quadraticCurveTo', 0.56, 0.08, 0.86, 0.4 + flutter], ['quadraticCurveTo', 0.56, 0.37, 0.48, 0.57], ['quadraticCurveTo', 0.27, 0.4, 0.11, 0.65 - flutter], ['quadraticCurveTo', -0.13, 0.41, -0.32, 0.6], ['quadraticCurveTo', -0.44, 0.36, -0.79, 0.44 - flutter], ['quadraticCurveTo', -0.55, 0.05, -0.57, -0.37], ['closePath']], gradient(ctx, -1, 0.7, ['#fff7df', '#dfe9e8', '#91aab8']));
  ctx.shadowBlur = 0;
  for (const side of [-1, 1]) path(ctx, [['moveTo', side * 0.37, -0.05], ['quadraticCurveTo', side * 0.29, 0.29, side * 0.39, 0.42]], null, '#a7bac2', 0.02);
  coal(ctx, -0.18, -0.44, 0.065, 0.1); coal(ctx, 0.2, -0.47, 0.065, 0.1);
  ellipse(ctx, 0.045, -0.13, 0.07, 0.085, '#566779');
  ellipse(ctx, -0.32, -0.23, 0.09, 0.04, 'rgba(218,155,151,0.28)');
  ctx.restore();
}
export function drawBat(ctx, p, time = p.time || 0) {
  if (!begin(ctx, p, true)) return;
  const flap = Math.sin(time * 0.01) * 0.35;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1); ctx.rotate(flap);
    path(ctx, [['moveTo', 0.13, -0.14], ['quadraticCurveTo', 0.7, -0.88, 1.55, -0.38], ['quadraticCurveTo', 1.06, -0.26, 1.27, 0.2], ['quadraticCurveTo', 0.91, -0.06, 0.75, 0.39], ['quadraticCurveTo', 0.5, 0.1, 0.22, 0.52], ['lineTo', 0.1, 0.18], ['closePath']], gradient(ctx, -0.7, 0.6, ['#7b657e', '#3d364e', '#202939']), '#967f91', 0.018);
    for (const [x, y] of [[1.4, -0.37], [1.22, 0.13], [0.75, 0.31]]) path(ctx, [['moveTo', 0.14, -0.1], ['quadraticCurveTo', x * 0.56, -0.1, x, y]], null, '#8b7188', 0.015);
    ctx.restore();
  }
  ellipse(ctx, 0, 0.09, 0.22, 0.36, '#443a4b');
  for (const side of [-1, 1]) path(ctx, [['moveTo', side * 0.18, -0.18], ['lineTo', side * 0.21, -0.62], ['quadraticCurveTo', side * 0.02, -0.46, side * 0.04, -0.18]], '#514454');
  ellipse(ctx, 0, -0.22, 0.23, 0.21, '#514454');
  for (const x of [-0.085, 0.085]) { ellipse(ctx, x, -0.24, 0.035, 0.04, '#e8ba7a'); ellipse(ctx, x, -0.24, 0.013, 0.03, '#26303c'); }
  path(ctx, [['moveTo', -0.06, -0.06], ['quadraticCurveTo', 0, -0.015, 0.06, -0.06]], null, '#c4a5a1', 0.018);
  ctx.restore();
}
function pumpkin(ctx, p, time, carved) {
  if (!begin(ctx, p)) return;
  ellipse(ctx, 0, 0.8, 1.1, 0.13, 'rgba(10,15,27,0.25)');
  // Overlapping rounded ribs model the pumpkin instead of flat orange stripes.
  for (const side of [-1, 1]) for (const [x, rx, ry] of [[0.56, 0.44, 0.68], [0.29, 0.42, 0.76]]) {
    ellipse(ctx, side * x, 0.06, rx, ry, gradient(ctx, -0.75, 0.8, ['#eab474', '#c87942', '#7d4136']));
    path(ctx, [['moveTo', side * x, -0.53], ['quadraticCurveTo', side * (x + 0.12), -0.25, side * (x + 0.07), 0.48]], null, '#f1be7d', 0.025);
  }
  ellipse(ctx, 0, 0.05, 0.37, 0.76, gradient(ctx, -0.75, 0.8, ['#efb876', '#d58a48', '#98543a']));
  path(ctx, [['moveTo', -0.1, -0.65], ['quadraticCurveTo', -0.17, -0.94, 0.11, -1.02], ['lineTo', 0.2, -0.89], ['quadraticCurveTo', 0.04, -0.9, 0.06, -0.65], ['closePath']], '#526953', '#a6a077', 0.02);
  path(ctx, [['moveTo', 0.05, -0.72], ['bezierCurveTo', 0.41, -0.99, 0.62, -0.73, 0.42, -0.66], ['bezierCurveTo', 0.3, -0.64, 0.3, -0.83, 0.44, -0.79]], null, '#718665', 0.025);
  if (carved) {
    ctx.shadowColor = '#f1b960'; ctx.shadowBlur = 5 + Math.sin(time * 0.006 + (p.glowPhase || 0)) * 2;
    const light = gradient(ctx, -0.3, 0.55, ['#fff0bc', '#e7aa59']);
    for (const side of [-1, 1]) path(ctx, [['moveTo', side * 0.12, -0.19], ['lineTo', side * 0.53, -0.28], ['quadraticCurveTo', side * 0.44, 0.04, side * 0.18, 0.02], ['closePath']], light, '#7c4935', 0.025);
    path(ctx, [['moveTo', -0.52, 0.22], ['lineTo', -0.28, 0.29], ['lineTo', -0.24, 0.2], ['lineTo', -0.09, 0.32], ['lineTo', 0.1, 0.25], ['lineTo', 0.16, 0.35], ['lineTo', 0.32, 0.26], ['lineTo', 0.51, 0.19], ['quadraticCurveTo', 0.21, 0.7, -0.13, 0.5], ['quadraticCurveTo', -0.36, 0.48, -0.52, 0.22], ['closePath']], light, '#7c4935', 0.025);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}
export function drawPumpkin(ctx, p, time = p.time || 0) { pumpkin(ctx, p, time, false); }
export function drawJackOLantern(ctx, p, time = p.time || 0) { pumpkin(ctx, p, time, true); }

export function drawScarecrow(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  ctx.rotate(Math.sin(time * 0.002 + (p.swayPhase || 0)) * 0.025);
  rect(ctx, -0.055, 0.1, 0.11, 1.85, 0.025, gradient(ctx, 0, 2, ['#9b805c', '#635042']));
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1);
    path(ctx, [['moveTo', 0.31, -0.01], ['lineTo', 1.06, 0.1], ['lineTo', 1, 0.38], ['lineTo', 0.62, 0.3], ['lineTo', 0.33, 0.5], ['closePath']], gradient(ctx, 0, 0.5, ['#8a9b88', '#566e68']), '#b1ab87', 0.018);
    for (let i = 0; i < 5; i++) path(ctx, [['moveTo', 0.99, 0.19 + i * 0.025], ['lineTo', 1.2 + i % 2 * 0.08, 0.13 + i * 0.05]], null, '#d5b679', 0.02);
    path(ctx, [['moveTo', 0.62, 0.11], ['lineTo', 0.6, 0.25]], null, '#c2b991', 0.012);
    ctx.restore();
  }
  path(ctx, [['moveTo', -0.37, -0.01], ['quadraticCurveTo', -0.51, 0.45, -0.55, 1.02], ['lineTo', -0.36, 0.92], ['lineTo', -0.2, 1.12], ['lineTo', 0.02, 1.02], ['lineTo', 0.24, 1.13], ['lineTo', 0.5, 0.97], ['quadraticCurveTo', 0.47, 0.45, 0.35, -0.01], ['closePath']], gradient(ctx, 0, 1.15, ['#899782', '#536960', '#394e4c']), '#a7a98b', 0.018);
  for (const y of [0.27, 0.52, 0.78]) { coal(ctx, 0.025, y, 0.028); path(ctx, [['moveTo', -0.25, y], ['lineTo', -0.13, y + 0.1]], null, '#b2ad89', 0.012); }
  rect(ctx, 0.16, 0.48, 0.2, 0.22, 0.01, '#b28966', '#d7b78c', 0.015);
  for (let i = 0; i < 7; i++) path(ctx, [['moveTo', -0.37 + i * 0.12, 1], ['lineTo', -0.4 + i * 0.12, 1.2 + i % 2 * 0.08]], null, '#d3b77d', 0.016);
  ellipse(ctx, 0, -0.38, 0.35, 0.35, gradient(ctx, -0.75, 0, ['#ddc8a0', '#b99a71']));
  for (const x of [-0.12, 0.12]) { path(ctx, [['moveTo', x - 0.04, -0.45], ['lineTo', x + 0.04, -0.37], ['moveTo', x + 0.04, -0.45], ['lineTo', x - 0.04, -0.37]], null, '#554b47', 0.026); }
  path(ctx, [['moveTo', -0.17, -0.24], ['quadraticCurveTo', 0, -0.13, 0.17, -0.25]], null, '#655448', 0.02);
  for (let i = 0; i < 5; i++) path(ctx, [['moveTo', -0.13 + i * 0.06, -0.25], ['lineTo', -0.14 + i * 0.06, -0.18]], null, '#655448', 0.018);
  path(ctx, [['moveTo', -0.39, -0.65], ['lineTo', -0.25, -1.16], ['quadraticCurveTo', -0.05, -1.24, 0.28, -1.12], ['lineTo', 0.38, -0.62], ['closePath']], gradient(ctx, -1.2, -0.5, ['#655655', '#322f39']));
  rect(ctx, -0.31, -0.76, 0.66, 0.12, 0.02, '#ab725d');
  ellipse(ctx, 0, -0.61, 0.58, 0.09, '#3e3942');
  path(ctx, [['moveTo', -0.2, -0.03], ['lineTo', -0.07, 0.12], ['lineTo', 0.12, 0.05], ['lineTo', 0.34, 0.41], ['lineTo', 0.51, 0.32], ['lineTo', 0.19, -0.06], ['closePath']], '#b96858');
  ctx.restore();
}

export function drawHauntedHouse(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  ellipse(ctx, 0, 1.53, 1.16, 0.13, 'rgba(5,12,23,0.35)');
  // Leaning towers, tall chimneys and asymmetrical rooflines.
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1); ctx.rotate(side * 0.015);
    path(ctx, [['moveTo', 0.61, -0.56], ['lineTo', 1.04, -0.61], ['lineTo', 1.08, 1.41], ['lineTo', 0.56, 1.41], ['closePath']], gradient(ctx, -0.6, 1.4, ['#586172', '#303d51', '#19283c']), '#71808a', 0.018);
    path(ctx, [['moveTo', 0.49, -0.55], ['lineTo', 0.77, -1.25], ['lineTo', 1.16, -0.58], ['closePath']], '#303347', '#879095', 0.02);
    path(ctx, [['moveTo', 0.77, -1.25], ['lineTo', 0.77, -1.49]], null, '#97a1a5', 0.015);
    for (const y of [-0.22, 0.27, 0.75]) {
      rect(ctx, 0.72, y, 0.18, 0.25, 0.035, '#e8bb7d', '#a58066', 0.02);
      path(ctx, [['moveTo', 0.81, y], ['lineTo', 0.81, y + 0.25], ['moveTo', 0.72, y + 0.13], ['lineTo', 0.9, y + 0.13]], null, '#5f5c5c', 0.022);
    }
    ctx.restore();
  }
  rect(ctx, -0.52, 0.11, 1.09, 1.32, 0.025, gradient(ctx, 0, 1.5, ['#4a556a', '#28384d']), '#65737d', 0.018);
  rect(ctx, 0.28, -0.94, 0.12, 0.55, 0.01, '#475266');
  path(ctx, [['moveTo', -0.64, 0.16], ['lineTo', -0.12, -0.73], ['lineTo', 0.63, 0.14], ['closePath']], '#353b51', '#849092', 0.02);
  for (let row = 0; row < 4; row++) path(ctx, [['moveTo', -0.48 + row * 0.11, 0.03 - row * 0.17], ['lineTo', 0.49 - row * 0.15, 0.03 - row * 0.17]], null, '#5e6271', 0.012);
  ellipse(ctx, -0.08, -0.11, 0.12, 0.16, '#dcac73');
  for (const x of [-0.32, 0.26]) {
    rect(ctx, x, 0.35, 0.21, 0.31, 0.07, '#e8b980', '#7f7972', 0.025);
    path(ctx, [['moveTo', x + 0.1, 0.35], ['lineTo', x + 0.1, 0.66], ['moveTo', x, 0.5], ['lineTo', x + 0.21, 0.5]], null, '#575c65', 0.02);
    rect(ctx, x - 0.035, 0.7, 0.28, 0.035, 0.01, '#8b9699');
  }
  rect(ctx, -0.15, 0.86, 0.34, 0.54, 0.15, '#182739', '#6f7e89', 0.025);
  ellipse(ctx, 0.11, 1.15, 0.018, 0.018, '#d6b582');
  for (const y of [1.43, 1.49]) rect(ctx, -0.27, y, 0.59, 0.055, 0.01, '#64707c');
  for (let i = 0; i < 12; i++) {
    const x = (i < 6 ? -1.15 : 0.72) + (i % 6) * 0.085;
    path(ctx, [['moveTo', x, 1.5], ['lineTo', x, 1.15], ['lineTo', x - 0.025, 1.2], ['moveTo', x, 1.15], ['lineTo', x + 0.025, 1.2]], null, '#78868c', 0.012);
  }
  path(ctx, [['moveTo', -1.16, 1.32], ['lineTo', -0.68, 1.32], ['moveTo', 0.73, 1.32], ['lineTo', 1.17, 1.32]], null, '#78868c', 0.018);
  // Thin smoke curls, kept translucent so the house remains the focal point.
  ctx.save(); ctx.globalAlpha *= 0.3;
  path(ctx, [['moveTo', 0.34, -0.94], ['bezierCurveTo', 0.06, -1.23, 0.65, -1.42, 0.32 + Math.sin(time * 0.001) * 0.07, -1.7]], null, '#a1b2bb', 0.045);
  ctx.restore(); ctx.restore();
}
