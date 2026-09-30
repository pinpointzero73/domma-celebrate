/** Small canvas illustrations, drawn in local coordinates and mirrored as a whole. */
function path(ctx, points, fill, stroke, width = 1) {
  ctx.beginPath();
  for (const [command, ...args] of points) ctx[command](...args);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
}
function gradient(ctx, y1, y2, colors) {
  const paint = ctx.createLinearGradient(0, y1, 0, y2);
  colors.forEach((color, i) => paint.addColorStop(i / (colors.length - 1), color));
  return paint;
}
function rect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.6; ctx.stroke(); }
}

export function drawSleigh(ctx, particle) {
  const distance = Math.abs(particle.targetX - particle.startX);
  const progress = distance ? Math.min(1, Math.abs(particle.x - particle.startX) / distance) : 0;
  const y = particle.baseY - Math.sin(progress * Math.PI) * particle.arcHeight;
  const scale = particle.size * 1.5;
  if (![particle.x, y, scale].every(Number.isFinite) || scale <= 0) return;
  const time = particle.time || 0;
  ctx.save();
  ctx.translate(particle.x, y);
  ctx.scale((particle.vx >= 0 ? 1 : -1) * scale, scale);
  ctx.globalAlpha *= particle.opacity ?? 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // Fine reins connect all five deer; staggered pairs retain distinct silhouettes.
  path(ctx, [['moveTo', 0.65, -0.48], ['bezierCurveTo', 2, -0.1, 4, -0.2, 6.7, -0.35]], null, '#d6b675', 0.022);
  const deer = [[3.1, -0.46], [4.65, -0.46], [2.65, 0.18], [4.2, 0.18], [6.05, -0.12]];
  deer.forEach(([x, dy], index) => {
    const phase = time * 0.008 + index * 0.85;
    ctx.save(); ctx.translate(x, dy + Math.sin(phase) * 0.035);
    // Articulated legs, with the far legs slightly darker.
    for (let leg = 0; leg < 4; leg++) {
      const hip = leg < 2 ? -0.27 : 0.28;
      const swing = Math.sin(phase + leg * 1.7) * 0.2;
      path(ctx, [['moveTo', hip, 0.02], ['lineTo', hip + swing, 0.26], ['lineTo', hip + swing - 0.14, 0.43]], null, leg % 2 ? '#b88960' : '#674832', 0.055);
      path(ctx, [['moveTo', hip + swing - 0.17, 0.43], ['lineTo', hip + swing - 0.08, 0.43]], null, '#302a29', 0.055);
    }
    ellipse(ctx, 0, -0.08, 0.46, 0.2, gradient(ctx, -0.3, 0.12, ['#cfa274', '#98623d']));
    // Raised neck, muzzle and pointed ears, rather than floating round heads.
    path(ctx, [['moveTo', 0.19, -0.1], ['quadraticCurveTo', 0.34, -0.34, 0.33, -0.55], ['lineTo', 0.5, -0.62], ['lineTo', 0.7, -0.49], ['quadraticCurveTo', 0.76, -0.38, 0.59, -0.37], ['lineTo', 0.47, -0.4], ['lineTo', 0.43, -0.02], ['closePath']], '#b58356');
    path(ctx, [['moveTo', 0.39, -0.55], ['lineTo', 0.26, -0.73], ['quadraticCurveTo', 0.48, -0.73, 0.49, -0.56]], '#cfaa80');
    path(ctx, [['moveTo', -0.4, -0.09], ['lineTo', -0.57, -0.2]], null, '#cba178', 0.07);
    path(ctx, [['moveTo', 0.38, -0.61], ['lineTo', 0.28, -0.83], ['lineTo', 0.3, -1.01], ['moveTo', 0.29, -0.82], ['lineTo', 0.13, -0.91], ['lineTo', 0.11, -1.02], ['moveTo', 0.28, -0.9], ['lineTo', 0.4, -0.98]], null, '#dfc59a', 0.03);
    ellipse(ctx, 0.52, -0.51, 0.018, 0.025, '#201e22');
    path(ctx, [['moveTo', -0.11, -0.25], ['lineTo', 0.03, 0.1], ['moveTo', 0.39, -0.3], ['lineTo', 0.48, -0.24]], null, '#9a2630', 0.055);
    ellipse(ctx, 0.07, 0.03, 0.035, 0.035, '#f2cf7c');
    if (index === 4) {
      ctx.save(); ctx.shadowColor = '#ff493b'; ctx.shadowBlur = 7;
      ellipse(ctx, 0.71, -0.44, 0.045, 0.04, '#ff5c45'); ctx.restore();
    } else ellipse(ctx, 0.71, -0.44, 0.025, 0.03, '#35272a');
    ctx.restore();
  });

  // Gifts and velvet sack sit behind Santa and the sleigh's side panel.
  ellipse(ctx, -0.4, -0.49, 0.47, 0.55, gradient(ctx, -1, 0, ['#806846', '#483824']));
  rect(ctx, -0.72, -0.96, 0.33, 0.29, 0.035, '#247260');
  rect(ctx, -0.43, -1.13, 0.32, 0.37, 0.035, '#a73345');
  path(ctx, [['moveTo', -0.55, -0.96], ['lineTo', -0.55, -0.67], ['moveTo', -0.27, -1.13], ['lineTo', -0.27, -0.76]], null, '#e6c681', 0.035);
  // Santa's coat, face, beard and softly folded hat.
  ellipse(ctx, 0.35, -0.48, 0.3, 0.39, '#b92e40');
  ellipse(ctx, 0.42, -0.93, 0.19, 0.21, '#edbf9a');
  path(ctx, [['moveTo', 0.22, -0.95], ['quadraticCurveTo', 0.24, -0.58, 0.42, -0.57], ['quadraticCurveTo', 0.68, -0.75, 0.6, -0.94], ['quadraticCurveTo', 0.4, -0.79, 0.22, -0.95]], '#fff1d9');
  path(ctx, [['moveTo', 0.2, -1.09], ['quadraticCurveTo', 0.36, -1.52, 0.68, -1.17], ['lineTo', 0.72, -1.1], ['quadraticCurveTo', 0.46, -1.3, 0.58, -1.08]], '#c73a46');
  path(ctx, [['moveTo', 0.21, -1.08], ['lineTo', 0.6, -1.08]], null, '#fff4de', 0.09);
  ellipse(ctx, 0.71, -1.12, 0.07, 0.07, '#fff4de');
  path(ctx, [['moveTo', 0.45, -0.53], ['quadraticCurveTo', 0.63, -0.36, 0.79, -0.49]], null, '#d7434b', 0.13);
  ellipse(ctx, 0.8, -0.48, 0.08, 0.055, '#f2ddbd');
  // Swept body, inset panel and curled brass runners.
  path(ctx, [['moveTo', -0.94, -0.64], ['quadraticCurveTo', -0.83, 0.3, -0.35, 0.32], ['lineTo', 0.86, 0.32], ['quadraticCurveTo', 1.34, 0.26, 1.4, -0.62], ['quadraticCurveTo', 1.11, -0.19, 0.81, -0.12], ['lineTo', -0.36, -0.12], ['quadraticCurveTo', -0.64, -0.17, -0.94, -0.64], ['closePath']], gradient(ctx, -0.65, 0.35, ['#ed5b5b', '#ae2038', '#631a30']), '#e7c789', 0.04);
  path(ctx, [['moveTo', -0.48, 0], ['quadraticCurveTo', -0.38, 0.2, -0.16, 0.21], ['lineTo', 0.8, 0.21], ['quadraticCurveTo', 1, 0.16, 1.06, -0.02]], null, '#d59959', 0.025);
  for (const offset of [0, 0.1]) {
    path(ctx, [['moveTo', -0.48, 0.32], ['lineTo', -0.6, 0.52 + offset], ['moveTo', 0.77, 0.32], ['lineTo', 0.87, 0.52 + offset]], null, '#b99559', 0.045);
    path(ctx, [['moveTo', -1.04, 0.5 + offset], ['quadraticCurveTo', 0.4, 0.72 + offset, 1.31, 0.49 + offset], ['bezierCurveTo', 1.76, 0.36 + offset, 1.64, 0.03 + offset, 1.43, 0.17 + offset]], null, '#f0ce88', 0.045);
  }
  ctx.restore();
}

export function drawTrain(ctx, particle) {
  if (![particle.x, particle.y, particle.size].every(Number.isFinite) || particle.size <= 0) return;
  ctx.save(); ctx.globalAlpha *= particle.opacity ?? 1;
  for (const smoke of particle.smoke || []) {
    ctx.save(); ctx.globalAlpha *= Math.max(0, smoke.opacity);
    const paint = ctx.createRadialGradient(smoke.x, smoke.y, 0, smoke.x, smoke.y, smoke.size);
    paint.addColorStop(0, 'rgba(237,231,216,0.55)'); paint.addColorStop(0.55, 'rgba(213,218,224,0.3)'); paint.addColorStop(1, 'rgba(213,218,224,0)');
    ellipse(ctx, smoke.x, smoke.y, smoke.size, smoke.size, paint); ctx.restore();
  }
  ctx.translate(particle.x, particle.y);
  ctx.scale((particle.vx >= 0 ? 1 : -1) * particle.size * 1.8 / 20, particle.size * 1.8 / 20);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const angle = (particle.time || 0) * 0.005;
  const gold = '#d9b779';
  const green = gradient(ctx, -42, -12, ['#42766b', '#204c45', '#12312f']);
  const steel = gradient(ctx, -36, -16, ['#56626b', '#232e36', '#101b23']);
  function wheel(x, radius) {
    ctx.save(); ctx.translate(x, -radius);
    ellipse(ctx, 0, 0, radius, radius, '#101820');
    ctx.beginPath(); ctx.arc(0, 0, radius - 0.5, 0, Math.PI * 2); ctx.strokeStyle = '#84908d'; ctx.lineWidth = 0.7; ctx.stroke();
    ctx.rotate(angle);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      path(ctx, [['moveTo', 0, 0], ['lineTo', Math.cos(a) * (radius - 1.4), Math.sin(a) * (radius - 1.4)]], null, '#a05a4b', 0.8);
    }
    ellipse(ctx, 0, 0, 1.4, 1.4, gold); ctx.restore();
  }
  const carriages = Math.max(0, Math.min(4, particle.carriages ?? 3));
  for (let i = carriages; i >= 1; i--) {
    const x = -25 - i * 75 + 15;
    path(ctx, [['moveTo', x + 60, -10], ['lineTo', x + 75, -10]], null, '#a1aaa5', 1.3);
    wheel(x + 13, 5); wheel(x + 47, 5);
    rect(ctx, x, -43, 60, 35, 2, green, gold);
    rect(ctx, x - 2, -47, 64, 5, 2, steel, '#78847f');
    rect(ctx, x - 1, -12, 62, 4, 1, '#17252a');
    for (let window = 0; window < 4; window++) {
      const wx = x + 5 + window * 13;
      rect(ctx, wx, -38, 10, 17, 1.5, gradient(ctx, -38, -21, ['#fff1bd', '#d7a759']), gold);
      path(ctx, [['moveTo', wx + 5, -38], ['lineTo', wx + 5, -21]], null, '#746b4b', 0.6);
      // Restrained silhouettes preserve the warm window light.
      if (window % 2 === 0) { ellipse(ctx, wx + 3, -27, 1.7, 2, '#594b3d'); rect(ctx, wx + 0.8, -25, 4.5, 4, 1, '#594b3d'); }
    }
    path(ctx, [['moveTo', x + 3, -17], ['lineTo', x + 57, -17]], null, gold, 0.55);
    // A string of small festive lamps under the eaves.
    for (let lamp = 0; lamp < 9; lamp++) ellipse(ctx, x + 5 + lamp * 6, -41, 0.8, 0.8, lamp % 2 ? '#efbc65' : '#df6e60');
  }
  rect(ctx, -29, -16, 86, 6, 1, '#17232b', '#64716f');
  rect(ctx, -25, -42, 25, 27, 2, green, gold);
  rect(ctx, -29, -46, 32, 5, 2, steel, '#7e8980');
  rect(ctx, -20, -38, 13, 14, 1.4, gradient(ctx, -38, -24, ['#ffedb1', '#cba565']), gold);
  path(ctx, [['moveTo', -13.5, -38], ['lineTo', -13.5, -24]], null, '#53655d', 0.8);
  rect(ctx, -2, -36, 50, 20, 8, steel, '#a0a394');
  for (const x of [5, 22, 39]) rect(ctx, x, -35, 1.6, 18, 0.3, gold);
  ellipse(ctx, 48, -26, 4, 10, '#24353b');
  // Chimney mouth stays at (31.5, -44), shared with smoke emission.
  path(ctx, [['moveTo', 28, -35], ['lineTo', 27, -43], ['lineTo', 36, -43], ['lineTo', 35, -35], ['closePath']], steel, '#929787', 0.7);
  rect(ctx, 26, -45, 11, 2, 0.8, '#26353c', gold);
  ellipse(ctx, 12, -36, 4, 3, gold);
  rect(ctx, 50, -28, 5, 5, 1, '#e6c780');
  ctx.save(); ctx.shadowColor = '#ffe4a1'; ctx.shadowBlur = 8;
  ellipse(ctx, 54, -25.5, 1.6, 2, '#fff1c5'); ctx.restore();
  path(ctx, [['moveTo', 56, -15], ['lineTo', 64, -3], ['lineTo', 52, -3], ['closePath']], '#273841', '#9eaa9f', 0.6);
  for (const x of [15, 35]) wheel(x, 8);
  wheel(51, 4); wheel(-15, 5);
  // Crank pins and coupling rod turn with the wheel spokes.
  const dx = Math.cos(angle) * 4.6, dy = Math.sin(angle) * 4.6;
  path(ctx, [['moveTo', 15 + dx, -8 + dy], ['lineTo', 35 + dx, -8 + dy], ['lineTo', 45, -14]], null, '#d0d0b9', 1.3);
  for (const x of [15, 35]) ellipse(ctx, x + dx, -8 + dy, 1, 1, '#f2d08c');
  ctx.restore();
}
