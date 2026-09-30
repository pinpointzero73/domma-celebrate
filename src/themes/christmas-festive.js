import {path, ellipse, gradient, rect} from './christmas-drawing.js';

function begin(ctx, particle, mirror = false) {
  if (![particle.x, particle.y, particle.size].every(Number.isFinite) || particle.size <= 0) return false;
  ctx.save(); ctx.translate(particle.x, particle.y);
  ctx.scale(particle.size * (mirror && particle.vx < 0 ? -1 : 1), particle.size);
  ctx.rotate(particle.rotation || 0);
  ctx.globalAlpha *= particle.opacity ?? 1;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return true;
}
function star(ctx, x, y, size) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, r = size * (i % 2 ? 0.44 : 1);
    points.push([i ? 'lineTo' : 'moveTo', x + Math.cos(a) * r, y + Math.sin(a) * r]);
  }
  points.push(['closePath']); path(ctx, points, '#f4d68b', '#bb9655', 0.02);
}
export const TREE_GIFTS = [
  {x: -0.78, y: 0.94, width: 0.48, height: 0.38, color: '#ad3448'},
  {x: 0.36, y: 1.04, width: 0.5, height: 0.3, color: '#39766e'},
  {x: -0.16, y: 1.04, width: 0.37, height: 0.29, color: '#b58948'}
];
export function drawGift(ctx, gift, x = gift.x, y = gift.y) {
  rect(ctx, x, y, gift.width, gift.height, 0.025, gift.color, '#d8bc82', 0.015);
  rect(ctx, x - 0.015, y, gift.width + 0.03, 0.07, 0.012, gift.color, '#d8bc82', 0.015);
  path(ctx, [['moveTo', x + gift.width / 2, y], ['lineTo', x + gift.width / 2, y + gift.height]], null, '#f2dca6', 0.055);
  const center = x + gift.width / 2;
  path(ctx, [['moveTo', center, y], ['bezierCurveTo', center - 0.25, y - 0.21, center - 0.24, y + 0.02, center, y], ['bezierCurveTo', center + 0.25, y - 0.21, center + 0.24, y + 0.02, center, y]], null, '#f2dca6', 0.025);
}
export function drawTree(ctx, particle, time = 0) {
  if (!begin(ctx, particle)) return;
  rect(ctx, -0.13, 0.64, 0.26, 0.65, 0.04, gradient(ctx, 0.6, 1.3, ['#a58154', '#674933']));
  // Layered, curved boughs give a full fir silhouette instead of stacked triangles.
  for (let tier = 3; tier >= 0; tier--) {
    const top = -1.38 + tier * 0.47, width = 0.38 + tier * 0.24, bottom = top + 0.88;
    path(ctx, [['moveTo', 0, top], ['quadraticCurveTo', -width * 0.33, bottom - 0.2, -width, bottom], ['quadraticCurveTo', -width * 0.66, bottom + 0.11, -width * 0.45, bottom + 0.04], ['quadraticCurveTo', 0, bottom + 0.22, width * 0.45, bottom + 0.04], ['quadraticCurveTo', width * 0.66, bottom + 0.11, width, bottom], ['quadraticCurveTo', width * 0.33, bottom - 0.2, 0, top], ['closePath']], gradient(ctx, top, bottom + 0.2, ['#5c8b72', '#2d5c48', '#173d35']));
    // Needle strokes follow the bough, deterministic across frames.
    for (let side of [-1, 1]) for (let branch = 1; branch <= 3; branch++) {
      const by = top + 0.28 + branch * 0.14, bx = side * width * branch / 5;
      path(ctx, [['moveTo', side * 0.04, by - 0.09], ['quadraticCurveTo', bx * 0.7, by + 0.07, bx, by + 0.04]], null, '#6a9875', 0.016);
    }
    const gy = bottom - 0.12;
    path(ctx, [['moveTo', -width * 0.7, gy], ['quadraticCurveTo', 0, gy + 0.29, width * 0.7, gy]], null, '#c9aa6d', 0.024);
    for (let bulb = 0; bulb < 5; bulb++) {
      const t = bulb / 4, x = (t * 2 - 1) * width * 0.7, y = gy + 0.58 * t * (1 - t);
      ctx.save(); ctx.globalAlpha *= 0.75 + Math.sin(time * 0.002 + bulb + tier) * 0.2;
      ctx.shadowColor = '#ffdd8e'; ctx.shadowBlur = 3;
      ellipse(ctx, x, y, 0.035, 0.035, '#ffe4a4'); ctx.restore();
    }
    for (const side of [-1, 1]) {
      const bx = side * width * 0.38, by = bottom - 0.01;
      ellipse(ctx, bx, by, 0.07, 0.085, side < 0 ? '#c55459' : '#d5b16d');
      ellipse(ctx, bx - 0.025, by - 0.03, 0.02, 0.025, '#f4d9b0');
    }
  }
  ctx.save(); ctx.shadowColor = '#eacd8e'; ctx.shadowBlur = 6; star(ctx, 0, -1.47, 0.2); ctx.restore();
  for (const gift of particle.gifts || TREE_GIFTS) if (!gift.stolen) drawGift(ctx, gift);
  ctx.restore();
}

export function drawWreath(ctx, particle, time = 0) {
  if (!begin(ctx, particle)) return;
  ctx.beginPath(); ctx.arc(0, 0, 0.85, 0, Math.PI * 2); ctx.strokeStyle = '#1c3e33'; ctx.lineWidth = 0.38; ctx.stroke();
  // Individual overlapping evergreen sprigs around an open centre.
  for (let i = 0; i < 28; i++) {
    const angle = i * Math.PI * 2 / 28;
    ctx.save(); ctx.rotate(angle); ctx.translate(0.85, 0); ctx.rotate(0.45);
    path(ctx, [['moveTo', -0.2, 0], ['quadraticCurveTo', 0, -0.06, 0.27, -0.02]], null, '#86a580', 0.016);
    for (let j = 0; j < 3; j++) {
      const x = -0.16 + j * 0.11;
      path(ctx, [['moveTo', x, 0], ['quadraticCurveTo', x - 0.11, -0.17, x + 0.13, -0.14], ['quadraticCurveTo', x + 0.12, -0.04, x, 0], ['moveTo', x, 0], ['quadraticCurveTo', x - 0.11, 0.18, x + 0.13, 0.14], ['quadraticCurveTo', x + 0.12, 0.04, x, 0]], i % 3 ? '#3c7053' : '#61916c');
    }
    ctx.restore();
  }
  for (const angle of [-0.5, 0.35, 2, 3.3, 4.6]) {
    const x = Math.cos(angle) * 0.86, y = Math.sin(angle) * 0.86;
    for (const [dx, dy] of [[-0.045, -0.035], [0.05, -0.015], [0, 0.055]]) {
      ellipse(ctx, x + dx, y + dy, 0.055, 0.055, '#b63d4a');
      ellipse(ctx, x + dx - 0.016, y + dy - 0.017, 0.014, 0.014, '#efac93');
    }
  }
  for (let i = 0; i < 7; i++) {
    const a = i * Math.PI * 2 / 7, x = Math.cos(a) * 0.91, y = Math.sin(a) * 0.91;
    ctx.save(); ctx.globalAlpha *= 0.7 + Math.sin(time * 0.002 + i) * 0.2;
    ctx.shadowColor = '#ffe3a1'; ctx.shadowBlur = 3; ellipse(ctx, x, y, 0.028, 0.028, '#ffe3a1'); ctx.restore();
  }
  // Ribbon tails and folded satin bow.
  path(ctx, [['moveTo', -0.08, 0.68], ['lineTo', -0.28, 1.34], ['lineTo', -0.05, 1.24], ['lineTo', 0.08, 1.37], ['lineTo', 0.16, 0.76], ['closePath']], '#9c293e');
  path(ctx, [['moveTo', 0.06, 0.74], ['lineTo', 0.23, 1.3], ['lineTo', 0.35, 1.18], ['lineTo', 0.55, 1.29], ['lineTo', 0.31, 0.73], ['closePath']], '#c14653');
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1);
    path(ctx, [['moveTo', 0, 0.78], ['bezierCurveTo', 0.6, 0.28, 0.76, 0.95, 0.39, 1.02], ['quadraticCurveTo', 0.19, 1.01, 0, 0.78], ['closePath']], gradient(ctx, 0.45, 1.05, ['#e16b70', '#a32d43']));
    path(ctx, [['moveTo', 0.09, 0.79], ['quadraticCurveTo', 0.38, 0.6, 0.48, 0.73]], null, '#f4a79b', 0.025); ctx.restore();
  }
  ellipse(ctx, 0.03, 0.8, 0.13, 0.12, '#c64858');
  ctx.restore();
}

export function drawRobin(ctx, particle, time = 0) {
  if (!begin(ctx, particle, true)) return;
  const flying = particle.state !== 'sitting';
  const phase = time * 0.014 + (particle.waveOffset || 0);
  // Fine tail feathers, warm grey belly and the distinctive orange-red bib.
  path(ctx, [['moveTo', -0.4, 0.14], ['lineTo', -1.15, 0.05], ['lineTo', -1.02, 0.35], ['lineTo', -0.4, 0.44], ['closePath']], '#715f50');
  ellipse(ctx, -0.03, 0.04, 0.66, 0.71, gradient(ctx, -0.6, 0.75, ['#a48b6e', '#ddd2bc']));
  ellipse(ctx, 0.3, -0.4, 0.46, 0.44, '#a18b6d');
  ellipse(ctx, 0.38, -0.02, 0.39, 0.49, gradient(ctx, -0.5, 0.5, ['#e99050', '#be5839']));
  // A single shaped wing opens about the shoulder, returning to the body at rest.
  ctx.save(); ctx.translate(-0.24, -0.15);
  ctx.rotate(flying ? -0.4 + Math.sin(phase) * 0.85 : -0.12);
  path(ctx, [['moveTo', 0.1, 0], ['bezierCurveTo', -0.27, -0.39, -0.96, -0.21, -0.68, 0.17], ['quadraticCurveTo', -0.26, 0.54, 0.1, 0], ['closePath']], gradient(ctx, -0.35, 0.38, ['#b69c78', '#796449']));
  for (let i = 0; i < 3; i++) path(ctx, [['moveTo', -0.15 - i * 0.14, -0.07], ['quadraticCurveTo', -0.39 - i * 0.12, 0.16, -0.58 - i * 0.05, 0.12]], null, '#d1b58b', 0.025);
  ctx.restore();
  path(ctx, [['moveTo', 0.68, -0.38], ['lineTo', 0.91, -0.29], ['lineTo', 0.68, -0.24], ['closePath']], '#41352e');
  ellipse(ctx, 0.49, -0.48, 0.07, 0.077, '#24252b'); ellipse(ctx, 0.51, -0.5, 0.022, 0.022, '#fff2db');
  for (const x of [-0.12, 0.19]) path(ctx, [['moveTo', x, 0.62], ['lineTo', x + (flying ? -0.14 : 0.02), flying ? 0.76 : 0.97], ['lineTo', x + 0.17, flying ? 0.77 : 0.97]], null, '#957155', 0.045);
  path(ctx, [['moveTo', -0.1, -0.72], ['quadraticCurveTo', 0.12, -1.32, 0.56, -1.09], ['quadraticCurveTo', 0.75, -0.99, 0.77, -0.79], ['quadraticCurveTo', 0.46, -1.03, 0.55, -0.71], ['closePath']], gradient(ctx, -1.25, -0.7, ['#d75b61', '#aa3147']));
  path(ctx, [['moveTo', -0.12, -0.72], ['quadraticCurveTo', 0.22, -0.83, 0.56, -0.71]], null, '#f4e9d0', 0.1);
  ellipse(ctx, 0.77, -0.8, 0.09, 0.09, '#f4e9d0'); ctx.restore();
}

export function drawElf(ctx, particle) {
  if (!begin(ctx, particle, true)) return;
  const time = particle.time || 0;
  const peeing = particle.type === 'peeing-elf' && particle.state === 'peeing';
  const carrying = particle.type === 'thieving-elf' && particle.state === 'escaping';
  const walking = particle.type === 'elf' || particle.state === 'approaching' || particle.state === 'escaping';
  const stride = walking ? Math.sin(time * (carrying ? 0.019 : 0.009)) * 0.3 : 0;
  if (peeing) {
    // A clothed rear-view silhouette and a small animated stream. No nudity.
    for (let i = 0; i < 15; i++) {
      const t = ((time * 0.0007 + i / 15) % 1);
      ellipse(ctx, 0.26 + t * 1.12, 0.3 - t * 0.65 + t * t * 1.16, 0.015, 0.022, '#dfc477');
    }
  }
  for (const [index, x] of [[0, -0.16], [1, 0.14]]) {
    const move = stride * (index ? -1 : 1);
    path(ctx, [['moveTo', x, 0.21], ['lineTo', x + move, 0.53], ['lineTo', x + move * 1.5, 0.88]], null, index ? '#ebe2c4' : '#b8ae91', 0.13);
    // Alternating red stocking stripes.
    for (let i = 0; i < 3; i++) path(ctx, [['moveTo', x + move * (1 + i / 6) - 0.06, 0.57 + i * 0.1], ['lineTo', x + move * (1 + i / 6) + 0.06, 0.57 + i * 0.1]], null, '#b8444a', 0.045);
    path(ctx, [['moveTo', x + move * 1.5 - 0.09, 0.85], ['quadraticCurveTo', x + move * 1.5 - 0.18, 1.05, x + move * 1.5 + 0.17, 1], ['quadraticCurveTo', x + move * 1.5 + 0.44, 0.98, x + move * 1.5 + 0.33, 0.82], ['quadraticCurveTo', x + move * 1.5 + 0.22, 0.94, x + move * 1.5 + 0.12, 0.84]], '#543c36');
  }
  path(ctx, [['moveTo', -0.22, -0.47], ['quadraticCurveTo', -0.44, -0.19, -0.4, 0.37], ['lineTo', -0.18, 0.3], ['lineTo', -0.07, 0.42], ['lineTo', 0.07, 0.3], ['lineTo', 0.3, 0.38], ['quadraticCurveTo', 0.38, -0.2, 0.2, -0.47], ['closePath']], gradient(ctx, -0.5, 0.4, ['#648e67', '#315c43']));
  path(ctx, [['moveTo', -0.37, 0.14], ['lineTo', 0.32, 0.14]], null, '#533b32', 0.09);
  rect(ctx, -0.045, 0.07, 0.13, 0.13, 0.018, '#d9b870', '#ffe5a2', 0.018);
  // Pointed collar and sleeves.
  path(ctx, [['moveTo', -0.2, -0.49], ['lineTo', -0.23, -0.26], ['lineTo', 0, -0.4], ['lineTo', 0.18, -0.24], ['lineTo', 0.2, -0.49]], '#b5454e');
  const armY = peeing ? 0.2 : carrying ? -0.02 : 0.22;
  path(ctx, [['moveTo', 0.19, -0.35], ['quadraticCurveTo', 0.34, -0.1, 0.41, armY]], null, '#4a7654', 0.14);
  ellipse(ctx, 0.43, armY, 0.085, 0.075, '#edc296');
  if (carrying) drawGift(ctx, {width: 0.52, height: 0.39, color: particle.gift?.color || '#b74450'}, 0.3, -0.15);
  ellipse(ctx, 0, -0.69, 0.28, 0.3, peeing ? '#967349' : '#efc89f');
  for (const side of [-1, 1]) path(ctx, [['moveTo', side * 0.22, -0.81], ['lineTo', side * 0.43, -0.9], ['quadraticCurveTo', side * 0.42, -0.62, side * 0.21, -0.65]], '#e2b38a');
  if (!peeing) {
    ellipse(ctx, 0.13, -0.75, 0.024, 0.035, '#322e30'); ellipse(ctx, 0.29, -0.65, 0.07, 0.055, '#dc9e7c');
    path(ctx, [['moveTo', 0.08, -0.57], ['quadraticCurveTo', 0.17, -0.49, 0.22, -0.58]], null, '#956349', 0.025);
  }
  path(ctx, [['moveTo', -0.29, -0.91], ['quadraticCurveTo', -0.21, -1.38, 0.21, -1.3], ['quadraticCurveTo', 0.48, -1.29, 0.5, -1.06], ['quadraticCurveTo', 0.25, -1.2, 0.28, -0.9], ['closePath']], gradient(ctx, -1.38, -0.9, ['#d56862', '#a33747']));
  path(ctx, [['moveTo', -0.29, -0.9], ['quadraticCurveTo', 0, -0.97, 0.28, -0.9]], null, '#d9b878', 0.065);
  ellipse(ctx, 0.5, -1.05, 0.06, 0.075, '#f1ce7e'); ctx.restore();
}
