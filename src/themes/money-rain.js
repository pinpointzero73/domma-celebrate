// Fictional illustrated banknotes, with folded paper and tumbling motion.
export default {
  name: 'money-rain', displayName: 'Money Rain', emoji: '💸',
  colors: {primary: '#9ab89a'},
  intensityConfig: {
    light: {count: 18, speedRange: [1.1, 2], sizeRange: [22, 34]},
    medium: {count: 35, speedRange: [1.4, 2.6], sizeRange: [26, 42]},
    heavy: {count: 65, speedRange: [1.8, 3.3], sizeRange: [28, 48]}
  },
  particles: ['banknote'], decorations: [],
  traits: {banknote: {label: 'Banknotes', types: ['banknote'], kind: 'particle'}},
  createFallingParticle(width, height, config) {
    return {
      type: 'banknote', x: Math.random() * width, y: -60, active: true, static: false,
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
      opacity: 0.92, rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - 0.5) * 0.035,
      windOffset: Math.random() * Math.PI * 2, windSpeed: 0.025,
      phase: Math.random() * Math.PI * 2, color: ['#88aa8e', '#9abda0', '#b7c79a'][Math.floor(Math.random() * 3)]
    };
  },
  createInitialDecorations() {return [];},
  drawBanknote(ctx, p, time) {
    if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
    ctx.scale(p.size, p.size * (0.22 + Math.abs(Math.cos(time / 700 + p.phase)) * 0.78));
    ctx.globalAlpha *= p.opacity;
    const paint = ctx.createLinearGradient(-1, -0.45, 1, 0.45);
    paint.addColorStop(0, '#d7dec5'); paint.addColorStop(0.35, p.color); paint.addColorStop(0.55, '#e1e7cd'); paint.addColorStop(1, p.color);
    ctx.fillStyle = paint; ctx.fillRect(-1, -0.45, 2, 0.9);
    ctx.strokeStyle = '#44674e'; ctx.lineWidth = 0.022; ctx.strokeRect(-0.9, -0.35, 1.8, 0.7);
    ctx.beginPath(); ctx.ellipse(0, 0, 0.27, 0.33, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -0.07, 0.11, 0.13, 0, 0, Math.PI * 2); ctx.fillStyle = '#658469'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0.2, 0.18, 0.14, 0, Math.PI, Math.PI * 2); ctx.fill();
    for (const side of [-1, 1]) {
      for (let row = 0; row < 4; row++) {ctx.beginPath(); ctx.moveTo(side * 0.4, -0.16 + row * 0.1); ctx.lineTo(side * 0.75, -0.16 + row * 0.1); ctx.stroke();}
      ctx.beginPath(); ctx.arc(side * 0.76, side * 0.22, 0.065, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0.15, -0.45); ctx.lineTo(0.03, 0.45); ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 0.045; ctx.stroke();
    ctx.restore();
  }
};
