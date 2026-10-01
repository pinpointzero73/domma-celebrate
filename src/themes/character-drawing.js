import {path, ellipse, gradient, rect} from './christmas-drawing.js';

function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.vx < 0 ? -p.size : p.size, p.size);
  ctx.globalAlpha *= p.opacity ?? 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; return true;
}
function face(ctx, beard = false) {
  ellipse(ctx, 0, -0.47, 0.31, 0.35, gradient(ctx, -0.8, -0.12, ['#f0cfaa', '#d9aa89']));
  ellipse(ctx, 0.28, -0.45, 0.07, 0.1, '#dcae8d');
  if (beard) path(ctx, [['moveTo', -0.29, -0.39], ['quadraticCurveTo', -0.4, 0.12, 0.03, 0.06], ['quadraticCurveTo', 0.39, -0.08, 0.26, -0.41], ['quadraticCurveTo', 0.14, -0.11, -0.05, -0.25], ['quadraticCurveTo', -0.22, -0.24, -0.29, -0.39]], gradient(ctx, -0.4, 0.1, ['#c88654', '#955b44']));
  for (const x of [-0.09, 0.13]) {ellipse(ctx, x, -0.5, 0.023, 0.034, '#4b4347'); ellipse(ctx, x - 0.007, -0.51, 0.007, 0.008, '#fff3d4');}
  path(ctx, [['moveTo', 0.05, -0.48], ['quadraticCurveTo', 0.14, -0.36, 0.04, -0.34]], null, '#b9826d', 0.015);
  path(ctx, [['moveTo', -0.045, -0.28], ['quadraticCurveTo', 0.07, -0.22, 0.15, -0.29]], null, '#925f57', 0.015);
}
function boots(ctx, time, phase, stockings = '#c9ccb6') {
  for (const side of [-1, 1]) {
    const stride = Math.sin(time * 0.009 + phase + (side < 0 ? Math.PI : 0)) * 0.1;
    ctx.save(); ctx.translate(side * 0.16, 0.72); ctx.rotate(stride * side);
    rect(ctx, -0.075, 0, 0.15, 0.6, 0.035, stockings);
    path(ctx, [['moveTo', -0.1, 0.54], ['lineTo', 0.09, 0.54], ['quadraticCurveTo', 0.19, 0.66, 0.29, 0.63], ['quadraticCurveTo', 0.34, 0.77, 0.07, 0.76], ['lineTo', -0.12, 0.75], ['closePath']], '#3e4248');
    rect(ctx, -0.025, 0.58, 0.1, 0.07, 0.012, '#d2b47e'); ctx.restore();
  }
}
export function drawLeprechaun(ctx, p, time = p.time || 0) {
  if (!begin(ctx, p)) return;
  boots(ctx, time, p.walkPhase || 0, '#d3cfb2');
  path(ctx, [['moveTo', -0.29, -0.1], ['quadraticCurveTo', -0.49, 0.26, -0.46, 0.85], ['lineTo', -0.08, 0.76], ['lineTo', 0, 0.5], ['lineTo', 0.09, 0.78], ['lineTo', 0.46, 0.86], ['quadraticCurveTo', 0.44, 0.17, 0.25, -0.1], ['closePath']], gradient(ctx, -0.1, 0.86, ['#6e9677', '#376852', '#264d43']), '#8ca583', 0.018);
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side * 0.3, 0.05); ctx.rotate(side * (0.21 + Math.sin(time * 0.008) * 0.07));
    rect(ctx, -0.075, 0, 0.15, 0.41, 0.06, '#45775d'); ellipse(ctx, 0, 0.43, 0.08, 0.1, '#e0b695'); ctx.restore();
    path(ctx, [['moveTo', side * 0.18, -0.1], ['lineTo', side * 0.3, 0.25], ['lineTo', side * 0.04, 0.16], ['closePath']], '#abc0a0');
  }
  for (const y of [0.24, 0.42, 0.59]) ellipse(ctx, 0.035, y, 0.025, 0.025, '#dec392');
  rect(ctx, -0.39, 0.43, 0.79, 0.09, 0.02, '#3a4440'); rect(ctx, -0.07, 0.415, 0.17, 0.12, 0.018, '#d6b278'); rect(ctx, -0.035, 0.44, 0.1, 0.065, 0.01, '#4b5a49');
  face(ctx, true);
  path(ctx, [['moveTo', -0.32, -0.71], ['lineTo', -0.29, -1.29], ['quadraticCurveTo', 0, -1.4, 0.31, -1.26], ['lineTo', 0.33, -0.7], ['closePath']], gradient(ctx, -1.4, -0.7, ['#648c6e', '#2e5949']));
  rect(ctx, -0.3, -0.88, 0.62, 0.12, 0.01, '#495349'); rect(ctx, -0.05, -0.9, 0.16, 0.15, 0.02, '#d0b079'); rect(ctx, -0.02, -0.87, 0.1, 0.09, 0.01, '#4c654e');
  ellipse(ctx, 0, -0.71, 0.47, 0.075, '#355e4c');
  path(ctx, [['moveTo', -0.24, -0.74], ['lineTo', -0.27, -0.97]], null, '#adc095', 0.014);
  ctx.restore();
}
export function drawStaticLeprechaun(ctx, p, time = p.time || 0) {drawLeprechaun(ctx, p, time * 0.25);}
export function drawBagpiper(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  boots(ctx, time, p.marchPhase || 0, '#d2d1bd');
  rect(ctx, -0.38, -0.06, 0.76, 0.66, 0.1, gradient(ctx, -0.1, 0.6, ['#667989', '#344959']));
  path(ctx, [['moveTo', -0.4, 0.41], ['lineTo', -0.48, 0.86], ['quadraticCurveTo', 0, 1.02, 0.46, 0.88], ['lineTo', 0.37, 0.41], ['closePath']], '#486667');
  ctx.save();
  path(ctx, [['moveTo', -0.4, 0.41], ['lineTo', -0.48, 0.86], ['quadraticCurveTo', 0, 1.02, 0.46, 0.88], ['lineTo', 0.37, 0.41], ['closePath']], null); ctx.clip();
  for (let i = 0; i < 6; i++) {const x = -0.43 + i * 0.17; rect(ctx, x, 0.4, 0.055, 0.55, 0, '#a78272'); path(ctx, [['moveTo', x + 0.075, 0.4], ['lineTo', x + 0.075, 0.98]], null, '#d2bc8c', 0.012);}
  for (const y of [0.57, 0.8]) {rect(ctx, -0.5, y, 1, 0.045, 0, '#93746c'); path(ctx, [['moveTo', -0.5, y + 0.06], ['lineTo', 0.5, y + 0.06]], null, '#cab78e', 0.013);}
  ctx.restore();
  ellipse(ctx, 0, 0.58, 0.12, 0.18, '#b29b7b'); rect(ctx, -0.39, 0.35, 0.77, 0.08, 0.01, '#39434a');
  face(ctx);
  path(ctx, [['moveTo', -0.31, -0.65], ['quadraticCurveTo', -0.31, -0.88, 0.26, -0.79], ['lineTo', 0.32, -0.68], ['closePath']], '#3e5363');
  ellipse(ctx, -0.05, -0.78, 0.37, 0.09, '#526f7d'); ellipse(ctx, 0.23, -0.76, 0.035, 0.035, '#caab73');
  path(ctx, [['moveTo', -0.27, -0.79], ['quadraticCurveTo', -0.27, -1.13, -0.21, -1.19]], null, '#a46b65', 0.04);
  // Three drones with turned ferrules and a dark leather bag.
  for (let i = 0; i < 3; i++) {
    const x = -0.36 + i * 0.12, top = -1.12 + i * 0.11;
    path(ctx, [['moveTo', -0.18 + i * 0.07, 0.16], ['lineTo', x, top]], null, '#43454a', 0.055);
    for (const y of [top + 0.03, top + 0.2, top + 0.42]) rect(ctx, x - 0.04, y, 0.08, 0.045, 0.012, '#c9b98e');
  }
  ellipse(ctx, -0.03, 0.14, 0.36, 0.25, gradient(ctx, -0.15, 0.4, ['#9d846b', '#6d5e56']));
  path(ctx, [['moveTo', 0.12, -0.27], ['lineTo', 0.23, 0.02], ['lineTo', 0.27, 0.76]], null, '#4c4850', 0.045);
  for (const [x, y] of [[-0.21, 0.25], [0.24, 0.31]]) {ellipse(ctx, x, y, 0.07, 0.09, '#e1b494'); path(ctx, [['moveTo', x - 0.02, y], ['lineTo', x + 0.02, y + 0.06]], null, '#b98670', 0.012);}
  ctx.restore();
}

export function drawKnight(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side * 0.15, 0.62); ctx.rotate(Math.sin(time * 0.009 + (p.marchPhase || 0) + (side < 0 ? Math.PI : 0)) * 0.1);
    rect(ctx, -0.08, 0, 0.16, 0.66, 0.05, gradient(ctx, 0, 0.7, ['#a6b5b9', '#617785'])); ellipse(ctx, 0, 0.26, 0.095, 0.1, '#bac6c6');
    path(ctx, [['moveTo', -0.09, 0.61], ['lineTo', 0.1, 0.61], ['quadraticCurveTo', 0.32, 0.73, 0.24, 0.79], ['lineTo', -0.13, 0.78], ['closePath']], '#617685', '#b2c0c0', 0.02); ctx.restore();
  }
  rect(ctx, -0.34, -0.08, 0.68, 0.88, 0.15, gradient(ctx, -0.1, 0.8, ['#ced2c9', '#8499a3']), '#607987', 0.02);
  for (const side of [-1, 1]) {ellipse(ctx, side * 0.31, 0.02, 0.16, 0.17, '#9eafb5'); rect(ctx, side * 0.37 - 0.06, 0.11, 0.12, 0.44, 0.04, '#8da3ae');}
  path(ctx, [['moveTo', -0.24, 0.08], ['lineTo', -0.26, 0.79], ['lineTo', 0.25, 0.79], ['lineTo', 0.24, 0.08], ['closePath']], '#e3d8bd');
  rect(ctx, -0.04, 0.11, 0.1, 0.64, 0.005, '#a9575d'); rect(ctx, -0.23, 0.28, 0.46, 0.1, 0.005, '#a9575d');
  ellipse(ctx, 0, -0.45, 0.3, 0.36, gradient(ctx, -0.85, -0.1, ['#d1d4cc', '#728a9a']));
  path(ctx, [['moveTo', -0.23, -0.47], ['quadraticCurveTo', 0, -0.53, 0.27, -0.46]], null, '#3e5565', 0.04);
  path(ctx, [['moveTo', -0.21, -0.3], ['lineTo', 0.21, -0.3]], null, '#bdc7c6', 0.015);
  for (const x of [-0.11, 0, 0.11]) path(ctx, [['moveTo', x, -0.31], ['lineTo', x, -0.18]], null, '#506878', 0.018);
  path(ctx, [['moveTo', 0, -0.78], ['bezierCurveTo', -0.18, -1.28, 0.43, -1.29, 0.16, -0.81]], '#b96964');
  // Heater shield with St George's cross and small metal studs.
  path(ctx, [['moveTo', -0.78, 0.14], ['quadraticCurveTo', -0.5, 0.02, -0.23, 0.16], ['lineTo', -0.26, 0.6], ['quadraticCurveTo', -0.49, 0.82, -0.55, 0.83], ['quadraticCurveTo', -0.74, 0.63, -0.78, 0.14], ['closePath']], '#efe1c4', '#b49e76', 0.035);
  path(ctx, [['moveTo', -0.56, 0.16], ['lineTo', -0.5, 0.76]], null, '#ad5b60', 0.075); path(ctx, [['moveTo', -0.73, 0.36], ['lineTo', -0.28, 0.35]], null, '#ad5b60', 0.075);
  for (const [x, y] of [[-0.72, 0.2], [-0.3, 0.2], [-0.51, 0.72]]) ellipse(ctx, x, y, 0.014, 0.014, '#947d61');
  ctx.save(); ctx.translate(0.43, 0.33); ctx.rotate(0.2);
  path(ctx, [['moveTo', -0.04, -0.14], ['lineTo', -0.05, -0.94], ['lineTo', 0, -1.09], ['lineTo', 0.05, -0.94], ['lineTo', 0.04, -0.14], ['closePath']], '#cfdbd9', '#6e8796', 0.015);
  path(ctx, [['moveTo', 0, -0.97], ['lineTo', 0, -0.17]], null, '#fff2d3', 0.012); rect(ctx, -0.15, -0.14, 0.3, 0.05, 0.02, '#c5ad7f'); rect(ctx, -0.035, -0.09, 0.07, 0.23, 0.025, '#63777d'); ellipse(ctx, 0, 0.17, 0.05, 0.05, '#c5ad7f'); ctx.restore();
  ctx.restore();
}
function dragon(ctx, p, time, welsh) {
  if (!begin(ctx, p)) return;
  const skin = welsh ? ['#cf8980', '#a95761', '#733e51'] : ['#89a17c', '#526f5c', '#354c4b'];
  const membrane = welsh ? ['#d5a097', '#9c6374'] : ['#b6b68a', '#6e8978'];
  const flap = Math.sin(time * 0.007 + (p.wingPhase || 0)) * 0.16;
  path(ctx, [['moveTo', -0.51, 0.07], ['bezierCurveTo', -1.16, 0.64, -1.55, 0.55, -1.69, -0.04], ['quadraticCurveTo', -1.74, 0.75, -1.03, 0.62], ['quadraticCurveTo', -0.56, 0.51, -0.28, 0.3]], skin[1], skin[0], 0.025);
  path(ctx, [['moveTo', -1.68, -0.02], ['lineTo', -1.81, -0.2], ['lineTo', -1.62, -0.14], ['lineTo', -1.54, 0.05], ['closePath']], skin[2]);
  // A smaller far wing supplies depth behind the shoulders.
  ctx.save(); ctx.translate(-0.05, -0.12); ctx.rotate(-flap);
  path(ctx, [['moveTo', 0, 0], ['quadraticCurveTo', 0.24, -1.05, 0.89, -1.04], ['lineTo', 0.73, -0.6], ['quadraticCurveTo', 0.48, -0.67, 0.53, -0.25], ['quadraticCurveTo', 0.27, -0.33, 0, 0]], membrane[1], skin[0], 0.02); ctx.restore();
  for (const x of [-0.41, 0.29]) path(ctx, [['moveTo', x, 0.25], ['quadraticCurveTo', x + 0.18, 0.48, x - 0.01, 0.62], ['lineTo', x + 0.24, 0.64], ['moveTo', x + 0.08, 0.62], ['lineTo', x + 0.12, 0.7]], null, skin[2], 0.085);
  path(ctx, [['moveTo', -0.57, 0.2], ['bezierCurveTo', -0.54, -0.26, 0.24, -0.35, 0.55, -0.07], ['quadraticCurveTo', 0.71, -0.29, 0.63, -0.68], ['lineTo', 0.9, -0.73], ['quadraticCurveTo', 0.89, -0.2, 0.69, 0.12], ['bezierCurveTo', 0.44, 0.62, -0.52, 0.61, -0.57, 0.2]], gradient(ctx, -0.7, 0.6, skin), skin[0], 0.018);
  path(ctx, [['moveTo', 0.68, -0.48], ['quadraticCurveTo', 0.71, -0.04, 0.43, 0.31], ['quadraticCurveTo', 0.01, 0.58, -0.38, 0.31]], null, '#d2ba8b', 0.07);
  for (let i = 0; i < 4; i++) path(ctx, [['moveTo', 0.55 - i * 0.15, 0.13 + i * 0.052], ['lineTo', 0.61 - i * 0.15, 0.26 + i * 0.035]], null, '#a08d70', 0.018);
  ctx.save(); ctx.translate(-0.17, -0.17); ctx.rotate(flap);
  path(ctx, [['moveTo', 0, 0], ['bezierCurveTo', -0.19, -0.95, -0.96, -1.3, -1.12, -0.98], ['lineTo', -1.07, -0.48], ['quadraticCurveTo', -0.73, -0.61, -0.72, -0.13], ['quadraticCurveTo', -0.41, -0.39, 0, 0]], gradient(ctx, -1.2, 0, membrane), skin[0], 0.03);
  for (const [x, y] of [[-1.09, -0.93], [-1.05, -0.5], [-0.73, -0.17]]) path(ctx, [['moveTo', 0, 0], ['quadraticCurveTo', x * 0.43, y * 0.7, x, y]], null, skin[2], 0.019); ctx.restore();
  ellipse(ctx, 0.88, -0.65, 0.28, 0.23, gradient(ctx, -0.87, -0.42, skin));
  path(ctx, [['moveTo', 0.96, -0.65], ['quadraticCurveTo', 1.4, -0.63, 1.32, -0.44], ['quadraticCurveTo', 1.02, -0.32, 0.78, -0.48]], skin[1], skin[0], 0.018);
  ellipse(ctx, 0.95, -0.67, 0.055, 0.045, '#edcb8f'); ellipse(ctx, 0.96, -0.67, 0.017, 0.035, '#364144'); ellipse(ctx, 1.26, -0.55, 0.014, 0.015, '#4e4348');
  path(ctx, [['moveTo', 1.25, -0.43], ['quadraticCurveTo', 1.04, -0.4, 0.94, -0.47]], null, skin[2], 0.015);
  for (const x of [0.74, 0.87]) path(ctx, [['moveTo', x, -0.82], ['lineTo', x - 0.09, -1.03], ['lineTo', x + 0.09, -0.83]], '#d9c49a');
  for (let i = 0; i < 5; i++) {const x = -0.48 + i * 0.17; path(ctx, [['moveTo', x, -0.17], ['lineTo', x + 0.04, -0.35], ['lineTo', x + 0.1, -0.18]], '#baa97b');}
  ctx.restore();
}
export function drawDragon(ctx, p, time = 0) {dragon(ctx, p, time, false);}
export function drawWelshDragon(ctx, p, time = 0) {dragon(ctx, p, time, true);}

export function drawCupid(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  ctx.rotate(-0.08);
  const flap = Math.sin(time * 0.009 + (p.wingPhase || 0)) * 0.14;
  for (const [x, angle] of [[-0.19, -0.1], [0, 0.12]]) {
    ctx.save(); ctx.translate(x, 0.02); ctx.rotate(angle + flap);
    path(ctx, [['moveTo', 0, 0], ['bezierCurveTo', -0.5, -0.95, -1.19, -0.75, -1.03, -0.17], ['quadraticCurveTo', -0.79, 0.1, -0.36, 0.18], ['closePath']], gradient(ctx, -0.8, 0.2, ['#fff0d6', '#c8d4d4']), '#aebec5', 0.02);
    for (let i = 0; i < 5; i++) path(ctx, [['moveTo', -0.12, -0.03], ['quadraticCurveTo', -0.54 - i * 0.09, -0.03 - i * 0.06, -0.53 - i * 0.1, -0.65 + i * 0.1]], null, '#aebec5', 0.014);
    ctx.restore();
  }
  for (const side of [-1, 1]) {path(ctx, [['moveTo', side * 0.16, 0.45], ['quadraticCurveTo', side * 0.31, 0.69, side * 0.28, 0.98]], null, '#dfb695', 0.11); ellipse(ctx, side * 0.25, 1.02, 0.1, 0.065, '#e8c1a0');}
  path(ctx, [['moveTo', -0.27, -0.08], ['quadraticCurveTo', -0.33, 0.21, -0.36, 0.64], ['quadraticCurveTo', 0, 0.8, 0.32, 0.6], ['quadraticCurveTo', 0.25, 0.14, 0.19, -0.08], ['closePath']], gradient(ctx, -0.1, 0.8, ['#f7e4c6', '#d3bca7']), '#bea99b', 0.015);
  path(ctx, [['moveTo', -0.23, 0.05], ['quadraticCurveTo', 0, 0.3, 0.29, 0.41]], null, '#b77f86', 0.1);
  face(ctx);
  for (const [x, y, radius] of [[-0.25, -0.68, 0.11], [-0.11, -0.8, 0.13], [0.06, -0.82, 0.14], [0.23, -0.71, 0.12]]) ellipse(ctx, x, y, radius, radius, '#d3ad68');
  path(ctx, [['moveTo', 0.25, 0.05], ['quadraticCurveTo', 0.45, 0.14, 0.69, 0.1]], null, '#dfb695', 0.105); ellipse(ctx, 0.72, 0.1, 0.07, 0.09, '#ecc4a1');
  path(ctx, [['moveTo', 0.74, -0.36], ['quadraticCurveTo', 1.06, 0.1, 0.75, 0.58]], null, '#c1a16c', 0.04);
  path(ctx, [['moveTo', 0.74, -0.36], ['lineTo', 0.56, 0.1], ['lineTo', 0.75, 0.58]], null, '#d8cbb6', 0.012);
  path(ctx, [['moveTo', 0.49, 0.1], ['lineTo', 1.4, 0.1]], null, '#ad906c', 0.022);
  path(ctx, [['moveTo', 1.41, 0.14], ['bezierCurveTo', 1.17, -0.02, 1.38, -0.12, 1.41, 0.01], ['bezierCurveTo', 1.48, -0.12, 1.64, -0.02, 1.41, 0.14]], '#b97583');
  ctx.restore();
}
