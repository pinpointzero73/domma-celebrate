const decoration = (type, x, y, size, extra = {}) => ({
  type, x, y, size, vx: 0, vy: 0, opacity: 0.9,
  static: true, active: true, phase: Math.random() * Math.PI * 2, ...extra
});

function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.size, p.size);
  ctx.globalAlpha *= p.opacity; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return true;
}

export default {
  name: 'winter', displayName: 'Winter', emoji: '❄️',
  colors: {primary: '#e5f4ff'},
  intensityConfig: {
    light: {count: 35, speedRange: [0.3, 0.8], sizeRange: [1, 3], pines: 3, icicles: 8, stars: 8},
    medium: {count: 80, speedRange: [0.5, 1.2], sizeRange: [1.5, 4], pines: 5, icicles: 14, stars: 14},
    heavy: {count: 150, speedRange: [0.7, 1.8], sizeRange: [2, 5], pines: 8, icicles: 20, stars: 22}
  },
  particles: ['winter-snowflake'],
  decorations: ['frosted-pine', 'snowdrift', 'icicle', 'winter-star'],
  traits: {
    snowflake: {label: 'Snowflakes', types: ['winter-snowflake'], kind: 'particle'},
    pine: {label: 'Frosted pines', types: ['frosted-pine'], count: 'pines'},
    snowdrift: {label: 'Snowdrifts', types: ['snowdrift']},
    icicle: {label: 'Icicles', types: ['icicle'], count: 'icicles'},
    star: {label: 'Winter stars', types: ['winter-star'], count: 'stars'}
  },
  createFallingParticle(width, height, config) {
    return decoration('winter-snowflake', Math.random() * width, -20,
      config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]), {
        static: false, speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        windOffset: Math.random() * 6.28, windSpeed: 0.012,
        rotation: Math.random() * 6.28, rotationSpeed: (Math.random() - 0.5) * 0.012
      });
  },
  createInitialDecorations(width, height, config) {
    const scale = Math.min(1, width / 600);
    const items = [decoration('snowdrift', width / 2, height, width)];
    for (let i = 0; i < config.pines; i++) items.push(decoration('frosted-pine', (i + 0.5) * width / config.pines, height - 8, (30 + Math.random() * 16) * scale));
    for (let i = 0; i < config.icicles; i++) items.push(decoration('icicle', (i + 0.5) * width / config.icicles, 0, (14 + Math.random() * 18) * scale));
    for (let i = 0; i < config.stars; i++) items.push(decoration('winter-star', Math.random() * width, height * Math.random() * 0.45, 1 + Math.random() * 2));
    return items;
  },
  drawWinterSnowflake(ctx, p) {
    if (!begin(ctx, p)) return;
    ctx.rotate(p.rotation || 0); ctx.strokeStyle = '#e6f5ff'; ctx.lineWidth = 0.13;
    for (let branch = 0; branch < 6; branch++) {
      ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -1);
      for (const y of [-0.45, -0.72]) {ctx.moveTo(-0.18, y - 0.18); ctx.lineTo(0, y); ctx.lineTo(0.18, y - 0.18);}
      ctx.stroke();
    }
    ctx.restore();
  },
  drawFrostedPine(ctx, p) {
    if (!begin(ctx, p)) return;
    ctx.fillStyle = '#726d65'; ctx.fillRect(-0.08, -0.6, 0.16, 0.7);
    for (let layer = 0; layer < 4; layer++) {
      const y = -2.6 + layer * 0.5, spread = 0.32 + layer * 0.23;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(spread, y + 0.96); ctx.quadraticCurveTo(0, y + 0.8, -spread, y + 0.96); ctx.closePath();
      ctx.fillStyle = layer % 2 ? '#456b66' : '#365858'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(spread * 0.55, y + 0.54); ctx.quadraticCurveTo(0.2, y + 0.4, 0, y + 0.55); ctx.quadraticCurveTo(-0.2, y + 0.4, -spread * 0.55, y + 0.54); ctx.closePath();
      ctx.fillStyle = '#e1edf0'; ctx.fill();
    }
    ctx.restore();
  },
  drawSnowdrift(ctx, p) {
    if (!begin(ctx, p)) return;
    ctx.beginPath(); ctx.moveTo(-0.5, 0); ctx.lineTo(-0.5, -0.012);
    ctx.bezierCurveTo(-0.28, -0.04, -0.19, 0.002, 0, -0.018); ctx.bezierCurveTo(0.2, -0.04, 0.38, -0.006, 0.5, -0.02);
    ctx.lineTo(0.5, 0); ctx.closePath(); ctx.fillStyle = '#dbeaf0'; ctx.fill(); ctx.restore();
  },
  drawIcicle(ctx, p) {
    if (!begin(ctx, p)) return;
    const paint = ctx.createLinearGradient(-0.14, 0, 0.14, 0);
    paint.addColorStop(0, '#84b3c7aa'); paint.addColorStop(0.5, '#edfcffe6'); paint.addColorStop(1, '#a9d3dfa0');
    ctx.fillStyle = paint; ctx.beginPath(); ctx.moveTo(-0.15, 0); ctx.lineTo(0, 1); ctx.lineTo(0.15, 0); ctx.fill(); ctx.restore();
  },
  drawWinterStar(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.globalAlpha *= 0.45 + (Math.sin(time / 1500 + p.phase) + 1) * 0.25;
    ctx.fillStyle = '#d6edf8'; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0.2, -0.2); ctx.lineTo(1, 0); ctx.lineTo(0.2, 0.2); ctx.lineTo(0, 1); ctx.lineTo(-0.2, 0.2); ctx.lineTo(-1, 0); ctx.lineTo(-0.2, -0.2); ctx.closePath(); ctx.fill(); ctx.restore();
  }
};
