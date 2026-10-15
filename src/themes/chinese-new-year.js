import newYear from './new-year.js';
import {createSparklerMessage} from './sparkler-writing.js';

const decoration = (type, x, y, size, extra = {}) => ({
  type, x, y, size, opacity: 1, active: true, static: true, vx: 0, vy: 0,
  phase: Math.random() * Math.PI * 2, age: 0, ...extra
});

function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.size, p.size);
  ctx.globalAlpha *= p.opacity ?? 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return true;
}

function oval(ctx, x, y, rx, ry, color) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
}

function stroke(ctx, points, color, width) {
  ctx.beginPath(); ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}

export default {
  name: 'chinese-new-year', displayName: 'Chinese New Year', emoji: '🐉',
  colors: {primary: '#d54339'},
  intensityConfig: {
    light: {count: 20, speedRange: [0.5, 1], sizeRange: [3, 6], lanterns: 2, fireworkChance: 0.008},
    medium: {count: 45, speedRange: [0.7, 1.3], sizeRange: [4, 7], lanterns: 4, fireworkChance: 0.015},
    heavy: {count: 80, speedRange: [0.9, 1.6], sizeRange: [5, 9], lanterns: 6, fireworkChance: 0.025}
  },
  particles: ['confetti'],
  decorations: ['lantern', 'chinese-dragon', 'new-year-firework', 'sparkler-message'],
  traits: {
    confetti: {label: 'Red and gold confetti', types: ['confetti'], kind: 'particle'},
    lantern: {label: 'Red lanterns', types: ['lantern'], count: 'lanterns'},
    dragon: {label: 'Chinese dragon', types: ['chinese-dragon']},
    firework: {label: 'Fireworks', types: ['new-year-firework'], chance: 'fireworkChance'},
    sparklerMessage: {label: 'Sparkler greeting', types: ['sparkler-message']}
  },
  createFallingParticle(width, height, config) {
    return {...newYear.createFallingParticle(width, height, config), type: 'confetti', color: Math.random() < 0.55 ? '#d54339' : '#efc764'};
  },
  createInitialDecorations(width, height, config) {
    const scale = Math.min(1, width / 600);
    const items = [
      createSparklerMessage('新年快乐', width, height, config.sparkler),
      decoration('chinese-dragon', width * 0.72, height * 0.42, Math.min(32, width / 20), {baseY: height * 0.42})
    ];
    for (let i = 0; i < config.lanterns; i++) {
      const side = i % 2;
      items.push(decoration('lantern', side ? width - (35 + i * 16) * scale : (35 + i * 16) * scale,
        (90 + i * 32) * scale, 28 * scale));
    }
    if (config.fireworkChance > 0) items.push(this.createFirework(width, height));
    return items;
  },
  createFirework(width, height) {
    return {...newYear.createFirework(width, height), color: Math.random() < 0.5 ? '#f0c354' : '#e76647'};
  },
  spawnSpecialParticle: newYear.spawnSpecialParticle,
  updateSpecialParticles(items, delta, width = 1024) {
    newYear.updateSpecialParticles(items, delta);
    for (const p of items) {
      if (p.type !== 'chinese-dragon') continue;
      p.age += Math.max(0, delta);
      p.x += delta * 0.025;
      p.y = p.baseY + Math.sin(p.age / 1800) * p.size * 0.6;
      if (p.x > width + p.size * 10) p.x = -p.size * 2;
    }
  },
  drawConfetti: newYear.drawConfetti,
  drawNewYearFirework: newYear.drawNewYearFirework,
  drawSparklerMessage: newYear.drawSparklerMessage,
  drawLantern(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.rotate(Math.sin(time / 1800 + p.phase) * 0.065);
    stroke(ctx, [[0, -2.2], [0, -0.9]], '#ae8644', 0.025);
    const paint = ctx.createLinearGradient(-0.8, 0, 0.8, 0);
    paint.addColorStop(0, '#9f2b2c'); paint.addColorStop(0.45, '#ee6550'); paint.addColorStop(1, '#ac3030');
    oval(ctx, 0, 0, 0.85, 0.95, paint);
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 0.2, -0.9); ctx.bezierCurveTo(side * 0.65, -0.3, side * 0.65, 0.3, side * 0.2, 0.9);
      ctx.strokeStyle = '#edbe62'; ctx.lineWidth = 0.025; ctx.stroke();
    }
    for (const y of [-0.9, 0.9]) {
      ctx.fillStyle = '#d9aa52'; ctx.fillRect(-0.3, y - 0.07, 0.6, 0.14);
    }
    stroke(ctx, [[0, 0.95], [0, 1.25]], '#d9aa52', 0.04);
    oval(ctx, 0, 1.22, 0.09, 0.09, '#f0c96c');
    for (let i = -2; i <= 2; i++) stroke(ctx, [[i * 0.035, 1.3], [i * 0.07, 1.85]], '#daba62', 0.025);
    ctx.restore();
  },
  drawChineseDragon(ctx, p) {
    if (!begin(ctx, p)) return;
    const phase = p.age / 700 + p.phase;
    const body = i => [-i * 0.46, Math.sin(i * 0.58 - phase) * 0.55];
    for (const index of [4, 10]) {
      const [x, y] = body(index);
      for (const side of [-1, 1]) {
        stroke(ctx, [[x, y], [x - 0.2, y + side * 0.6], [x + 0.25, y + side * 0.8]], '#b84635', 0.15);
        for (let claw = 0; claw < 3; claw++) stroke(ctx, [[x + 0.2, y + side * 0.8], [x + 0.5, y + side * (0.66 + claw * 0.12)]], '#e8bc64', 0.035);
      }
    }
    for (let i = 17; i >= 0; i--) {
      const [x, y] = body(i);
      const radius = i > 12 ? 0.34 * (18 - i) / 6 : 0.34;
      ctx.fillStyle = '#efc35d'; ctx.beginPath();
      ctx.moveTo(x - 0.2, y - radius); ctx.lineTo(x - 0.37, y - radius - 0.3); ctx.lineTo(x + 0.17, y - radius * 0.7); ctx.fill();
      oval(ctx, x, y, radius * 1.4, radius, '#a7312d');
      oval(ctx, x, y - 0.07, radius * 1.25, radius * 0.8, i % 2 ? '#d14c38' : '#df6243');
      stroke(ctx, [[x - 0.13, y + radius * 0.5], [x, y + radius * 0.78], [x + 0.15, y + radius * 0.5]], '#e8b85a', 0.035);
    }
    ctx.translate(0.15, body(0)[1]);
    // Golden mane, branching horns, long whiskers and a wingless serpentine body.
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 7 + Math.PI / 2;
      stroke(ctx, [[Math.cos(a) * 0.35, Math.sin(a) * 0.4], [Math.cos(a) * 0.8 - 0.15, Math.sin(a) * 0.8]], '#e7b856', 0.12);
    }
    stroke(ctx, [[-0.1, -0.3], [-0.35, -1.05], [-0.1, -1.3]], '#e8ca8a', 0.095);
    stroke(ctx, [[-0.3, -0.9], [-0.6, -1.06]], '#e8ca8a', 0.065);
    stroke(ctx, [[0.2, -0.3], [0.35, -0.95], [0.62, -1.08]], '#e8ca8a', 0.085);
    oval(ctx, 0, 0, 0.57, 0.5, '#d94f37');
    oval(ctx, 0.53, 0.16, 0.54, 0.27, '#e2a44f');
    oval(ctx, 0.75, 0.05, 0.24, 0.17, '#b74330');
    oval(ctx, 0.85, 0, 0.045, 0.04, '#513b30');
    oval(ctx, 0.25, -0.18, 0.18, 0.14, '#f3d778');
    oval(ctx, 0.3, -0.18, 0.055, 0.1, '#294d42');
    oval(ctx, 0.32, -0.21, 0.022, 0.028, '#fff4d8');
    stroke(ctx, [[0.05, -0.38], [0.42, -0.34]], '#e4bc62', 0.075);
    stroke(ctx, [[0.35, 0.3], [0.9, 0.3]], '#78382c', 0.03);
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(0.7, 0.22); ctx.bezierCurveTo(1.5, side * 0.8, 1.65, side * 0.85, 1.9, side * 0.3);
      ctx.strokeStyle = '#efcf88'; ctx.lineWidth = 0.035; ctx.stroke();
    }
    ctx.restore();
  }
};
