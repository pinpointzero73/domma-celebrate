import {createSparklerMessage, updateSparklerMessage, drawSparklerMessage} from './sparkler-writing.js';

const colors = ['#efc96b', '#f3e9c9', '#b8a0dd', '#8cbec9', '#dd98aa'];
const pick = () => colors[Math.floor(Math.random() * colors.length)];
const item = (type, x, y, size, extra = {}) => ({
  type, x, y, size, vx: 0, vy: 0, rotation: 0, opacity: 0.95,
  active: true, static: true, phase: Math.random() * Math.PI * 2, ...extra
});

function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(p.size, p.size);
  ctx.globalAlpha *= p.opacity ?? 1;
  return true;
}

const theme = {
  name: 'new-year',
  displayName: 'New Year',
  emoji: '🎉',
  colors: {primary: '#efc96b'},
  intensityConfig: {
    light: {count: 25, speedRange: [0.6, 1], sizeRange: [3, 6], balloons: 2, fireworkChance: 0.008},
    medium: {count: 55, speedRange: [0.8, 1.5], sizeRange: [4, 8], balloons: 4, fireworkChance: 0.015},
    heavy: {count: 95, speedRange: [1, 2], sizeRange: [5, 10], balloons: 6, fireworkChance: 0.025}
  },
  particles: ['confetti', 'streamer'],
  decorations: ['new-year-firework', 'balloon', 'midnight-clock', 'sparkler-message'],
  traits: {
    confetti: {label: 'Confetti', types: ['confetti'], kind: 'particle'},
    streamer: {label: 'Streamers', types: ['streamer'], kind: 'particle'},
    firework: {label: 'Fireworks', types: ['new-year-firework'], chance: 'fireworkChance'},
    balloon: {label: 'Balloons', types: ['balloon'], count: 'balloons'},
    midnightClock: {label: 'Midnight clock', types: ['midnight-clock']},
    sparklerMessage: {label: 'Sparkler greeting', types: ['sparkler-message']}
  },
  createFallingParticle(width, height, config) {
    return item(Math.random() < 0.7 ? 'confetti' : 'streamer', Math.random() * width, -30,
      config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]), {
        static: false, speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - 0.5) * 0.05,
        windOffset: Math.random() * Math.PI * 2, windSpeed: 0.02, color: pick()
      });
  },
  createInitialDecorations(width, height, config) {
    const scale = Math.min(1, width / 600);
    const items = [item('midnight-clock', width / 2, height - 50 * scale, 36 * scale), createSparklerMessage('Happy New Year', width, height, config.sparkler)];
    for (let i = 0; i < config.balloons; i++) {
      const left = i % 2 === 0;
      items.push(item('balloon', left ? 28 + i * 8 : width - 28 - i * 8,
        height - (100 + i * 28) * scale, 23 * scale, {color: pick()}));
    }
    if (config.fireworkChance > 0) items.push(this.createFirework(width, height));
    return items;
  },
  createFirework(width, height) {
    return item('new-year-firework', width * (0.15 + Math.random() * 0.7), height * (0.12 + Math.random() * 0.32),
      Math.min(width * 0.18, 70 + Math.random() * 45), {age: 0, duration: 2100, color: pick()});
  },
  spawnSpecialParticle(items, width, height, config) {
    if (items.filter(p => p.type === 'new-year-firework' && p.active).length >= 3) return null;
    return Math.random() < config.fireworkChance ? this.createFirework(width, height) : null;
  },
  updateSpecialParticles(items, delta) {
    for (const p of items) {
      if (p.type === 'sparkler-message') updateSparklerMessage(p, delta);
      if (p.type !== 'new-year-firework') continue;
      p.age += delta;
      if (p.age >= p.duration) p.active = false;
    }
  },
  drawSparklerMessage,
  drawConfetti(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.rotate(p.rotation || 0);
    ctx.scale(0.25 + Math.abs(Math.cos(time / 400 + p.phase)) * 0.75, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(-0.5, -0.35, 1, 0.7);
    ctx.fillStyle = '#ffffff66';
    ctx.fillRect(-0.5, -0.35, 0.25, 0.7);
    ctx.restore();
  },
  drawStreamer(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.rotate(p.rotation || 0);
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const x = Math.sin(i * 0.55 + time / 600 + p.phase) * 0.45;
      const y = i / 7 - 1.7;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  },
  drawNewYearFirework(ctx, p) {
    if (!begin(ctx, p)) return;
    const progress = Math.min(1, p.age / p.duration);
    const radius = 1 - (1 - progress) ** 3;
    ctx.globalAlpha *= (1 - progress) ** 1.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 36; i++) {
      const angle = i * Math.PI * 2 / 36 + p.phase;
      const length = radius * (i % 2 ? 0.78 : 1);
      const sag = progress * progress * 0.35;
      ctx.strokeStyle = i % 3 ? p.color : '#fff4d6';
      ctx.lineWidth = 0.012;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * length * 0.65, Math.sin(angle) * length * 0.65 + sag);
      ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length + sag);
      ctx.stroke();
      ctx.fillStyle = '#fff5da';
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * length, Math.sin(angle) * length + sag, 0.018, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  drawBalloon(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.rotate(Math.sin(time / 1400 + p.phase) * 0.08);
    ctx.strokeStyle = '#a49476'; ctx.lineWidth = 0.025;
    ctx.beginPath(); ctx.moveTo(0, 0.9); ctx.bezierCurveTo(-0.3, 1.4, 0.35, 1.8, 0, 2.2); ctx.stroke();
    const paint = ctx.createLinearGradient(-0.7, -1, 0.7, 0.7);
    paint.addColorStop(0, '#fff9dc'); paint.addColorStop(0.35, p.color); paint.addColorStop(1, '#8a7398');
    ctx.fillStyle = paint;
    ctx.beginPath(); ctx.ellipse(0, -0.1, 0.75, 1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.moveTo(0, 0.85); ctx.lineTo(-0.12, 1.05); ctx.lineTo(0.12, 1.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff77';
    ctx.beginPath(); ctx.ellipse(-0.3, -0.45, 0.1, 0.29, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
  drawMidnightClock(ctx, p) {
    if (!begin(ctx, p)) return;
    const rim = ctx.createLinearGradient(-1, -1, 1, 1);
    rim.addColorStop(0, '#fff2bf'); rim.addColorStop(0.5, '#d8ac53'); rim.addColorStop(1, '#a57936');
    for (const [radius, color] of [[1, rim], [0.84, '#353448'], [0.76, '#f6ecd4']]) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#67543c'; ctx.lineWidth = 0.035;
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      ctx.beginPath(); ctx.moveTo(Math.sin(a) * 0.64, -Math.cos(a) * 0.64); ctx.lineTo(Math.sin(a) * 0.7, -Math.cos(a) * 0.7); ctx.stroke();
    }
    ctx.lineWidth = 0.055; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0.08); ctx.lineTo(0, -0.57); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-0.08, -0.4); ctx.stroke();
    ctx.fillStyle = '#b38c42'; ctx.beginPath(); ctx.arc(0, 0, 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
};

export default theme;
