export default {
  name: 'make-it-rain', displayName: 'Make it rain', emoji: '🌧️',
  colors: {primary: '#b6d8ef'},
  intensityConfig: {
    light: {count: 60, speedRange: [6, 9], sizeRange: [8, 14], splashes: 4, splashChance: 0.1},
    medium: {count: 120, speedRange: [8, 12], sizeRange: [12, 20], splashes: 7, splashChance: 0.18},
    heavy: {count: 220, speedRange: [11, 16], sizeRange: [16, 26], splashes: 10, splashChance: 0.28}
  },
  particles: ['raindrop'], decorations: ['rain-splash'],
  traits: {
    raindrop: {label: 'Raindrops', types: ['raindrop'], kind: 'particle'},
    splash: {label: 'Rain splashes', types: ['rain-splash'], count: 'splashes', chance: 'splashChance'}
  },
  createFallingParticle(width, height, config) {
    const speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
    return {
      type: 'raindrop', x: Math.random() * width, y: -30, vx: speed * 0.12,
      speed, size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      opacity: 0.2 + Math.random() * 0.45, static: false, active: true
    };
  },
  createSplash(width, height) {
    return {type: 'rain-splash', x: Math.random() * width, y: height - 3 - Math.random() * 12,
      size: 7 + Math.random() * 12, age: 0, duration: 650, opacity: 0.5, static: true, active: true};
  },
  createInitialDecorations(width, height, config) {
    return Array.from({length: config.splashes}, () => ({...this.createSplash(width, height), age: Math.random() * 500}));
  },
  spawnSpecialParticle(items, width, height, config) {
    if (items.length >= config.splashes * 2 || Math.random() >= config.splashChance) return null;
    return this.createSplash(width, height);
  },
  updateSpecialParticles(items, delta) {
    for (const p of items) {p.age += Math.max(0, delta); if (p.age >= p.duration) p.active = false;}
  },
  drawRaindrop(ctx, p) {
    if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return;
    ctx.save(); ctx.globalAlpha *= p.opacity;
    ctx.strokeStyle = '#bedff5'; ctx.lineWidth = 1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x - p.size * 0.12, p.y - p.size); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.restore();
  },
  drawRainSplash(ctx, p) {
    if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return;
    const progress = Math.min(1, p.age / p.duration);
    ctx.save(); ctx.globalAlpha *= p.opacity * (1 - progress); ctx.strokeStyle = '#c3e6fa'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, Math.max(0.01, p.size * progress), Math.max(0.01, p.size * progress * 0.18), 0, 0, Math.PI * 2); ctx.stroke();
    if (progress < 0.5) for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(p.x + side * progress * p.size, p.y - Math.sin(progress * Math.PI * 2) * 5);
      ctx.lineTo(p.x + side * progress * p.size * 0.7, p.y - Math.sin(progress * Math.PI * 2) * 3); ctx.stroke();
    }
    ctx.restore();
  }
};
