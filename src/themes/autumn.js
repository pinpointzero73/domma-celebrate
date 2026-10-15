const colours = ['#d98b39', '#b9553b', '#d8b74b', '#a86438', '#d77c4a'];
const item = (type, x, y, size, extra = {}) => ({type, x, y, size, vx: 0, vy: 0, opacity: 0.95, static: true, active: true, phase: Math.random() * Math.PI * 2, ...extra});
function begin(ctx, p) {
  if (![p.x, p.y, p.size].every(Number.isFinite) || p.size <= 0) return false;
  ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.size, p.size);
  ctx.globalAlpha *= p.opacity; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; return true;
}
function oval(ctx, x, y, rx, ry, colour) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = colour; ctx.fill();
}

const theme = {
  name: 'autumn', displayName: 'Autumn', emoji: '🍂', colors: {primary: '#d98b39'},
  intensityConfig: {
    light: {count: 20, speedRange: [0.4, 0.8], sizeRange: [7, 12], trees: 2, acorns: 3, mushrooms: 2},
    medium: {count: 40, speedRange: [0.6, 1.2], sizeRange: [9, 16], trees: 3, acorns: 5, mushrooms: 3},
    heavy: {count: 70, speedRange: [0.8, 1.6], sizeRange: [12, 20], trees: 5, acorns: 8, mushrooms: 5}
  },
  particles: ['maple-leaf', 'oak-leaf'], decorations: ['autumn-tree', 'acorn', 'mushroom'],
  traits: {
    mapleLeaf: {label: 'Maple leaves', types: ['maple-leaf'], kind: 'particle'},
    oakLeaf: {label: 'Oak leaves', types: ['oak-leaf'], kind: 'particle'},
    tree: {label: 'Autumn trees', types: ['autumn-tree'], count: 'trees'},
    acorn: {label: 'Acorns', types: ['acorn'], count: 'acorns'},
    mushroom: {label: 'Mushrooms', types: ['mushroom'], count: 'mushrooms'}
  },
  createFallingParticle(width, height, config) {
    return item(Math.random() < 0.5 ? 'maple-leaf' : 'oak-leaf', Math.random() * width, -30,
      config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]), {
        static: false, speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        windOffset: Math.random() * Math.PI * 2, windSpeed: 0.018,
        rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - 0.5) * 0.022,
        color: colours[Math.floor(Math.random() * colours.length)]
      });
  },
  createInitialDecorations(width, height, config) {
    const items = [], scale = Math.min(1, width / 600);
    for (let i = 0; i < config.trees; i++) items.push(item('autumn-tree', (i + 0.5) * width / config.trees, height - 3, (36 + Math.random() * 12) * scale));
    for (let i = 0; i < config.acorns; i++) items.push(item('acorn', (i + 0.8) * width / (config.acorns + 1), height - 4, 12 * scale, {rotation: (Math.random() - 0.5) * 0.8}));
    for (let i = 0; i < config.mushrooms; i++) items.push(item('mushroom', (i + 0.3) * width / config.mushrooms, height - 2, (13 + Math.random() * 5) * scale));
    return items;
  },
  drawMapleLeaf(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.rotate(p.rotation); ctx.scale(0.35 + Math.abs(Math.sin(time / 800 + p.phase)) * 0.65, 1);
    const points = [[0, -1], [0.2, -0.42], [0.55, -0.68], [0.5, -0.17], [1, -0.22], [0.72, 0.2], [0.9, 0.36], [0.15, 0.65], [0, 0.95], [-0.15, 0.65], [-0.9, 0.36], [-0.72, 0.2], [-1, -0.22], [-0.5, -0.17], [-0.55, -0.68], [-0.2, -0.42]];
    ctx.beginPath(); ctx.moveTo(...points[0]); for (const point of points.slice(1)) ctx.lineTo(...point); ctx.closePath();
    ctx.fillStyle = p.color; ctx.fill();
    ctx.strokeStyle = '#795334'; ctx.lineWidth = 0.035; ctx.beginPath(); ctx.moveTo(0, 1.2); ctx.lineTo(0, -0.8);
    for (const side of [-1, 1]) {ctx.moveTo(0, 0.5); ctx.lineTo(side * 0.77, 0.22); ctx.moveTo(0, 0.05); ctx.lineTo(side * 0.45, -0.46);}
    ctx.stroke(); ctx.restore();
  },
  drawOakLeaf(ctx, p, time) {
    if (!begin(ctx, p)) return;
    ctx.rotate(p.rotation); ctx.scale(0.4 + Math.abs(Math.sin(time / 950 + p.phase)) * 0.6, 1);
    ctx.beginPath(); ctx.moveTo(0, -1.1);
    for (const side of [1, -1]) {
      const ys = side === 1 ? [-0.9, -0.45, 0, 0.45] : [0.45, 0, -0.45, -0.9];
      for (const y of ys) ctx.quadraticCurveTo(side * 0.95, y + (side === 1 ? 0.1 : -0.1), side * 0.27, y + (side === 1 ? 0.35 : -0.35));
    }
    ctx.closePath(); ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 1.25); ctx.lineTo(0, -0.95); ctx.strokeStyle = '#856037'; ctx.lineWidth = 0.035; ctx.stroke(); ctx.restore();
  },
  drawAutumnTree(ctx, p) {
    if (!begin(ctx, p)) return;
    ctx.strokeStyle = '#74543b'; ctx.lineWidth = 0.16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -1.75);
    for (const side of [-1, 1]) {ctx.moveTo(0, -0.65); ctx.lineTo(side * 0.65, -1.55); ctx.moveTo(0, -1.2); ctx.lineTo(side * 0.4, -2.1);} ctx.stroke();
    for (const [x, y, radius, color] of [[0, -2.1, 0.75, '#bf793b'], [-0.63, -1.6, 0.65, '#d69442'], [0.59, -1.67, 0.7, '#aa6035'], [0, -1.5, 0.65, '#d2a044'], [-0.1, -2.45, 0.4, '#dfb457']]) oval(ctx, x, y, radius, radius * 0.9, color);
    ctx.restore();
  },
  drawAcorn(ctx, p) {
    if (!begin(ctx, p)) return;
    ctx.rotate(p.rotation || 0); oval(ctx, 0, -0.55, 0.46, 0.65, '#bb8d54'); oval(ctx, -0.13, -0.59, 0.25, 0.5, '#d4aa70');
    oval(ctx, 0, -1.02, 0.56, 0.28, '#7d6446'); ctx.beginPath(); ctx.moveTo(0, -1.2); ctx.quadraticCurveTo(-0.1, -1.5, 0.12, -1.5); ctx.strokeStyle = '#70543b'; ctx.lineWidth = 0.11; ctx.stroke();
    for (let i = -2; i <= 2; i++) {ctx.beginPath(); ctx.moveTo(i * 0.16 - 0.08, -1.12); ctx.lineTo(i * 0.16 + 0.08, -0.95); ctx.strokeStyle = '#a18a60'; ctx.lineWidth = 0.025; ctx.stroke();} ctx.restore();
  },
  drawMushroom(ctx, p) {
    if (!begin(ctx, p)) return;
    ctx.fillStyle = '#e9d9b9'; ctx.fillRect(-0.16, -0.95, 0.32, 0.95);
    oval(ctx, 0, -0.88, 0.72, 0.2, '#e2cbaa'); ctx.beginPath(); ctx.moveTo(-0.75, -0.95); ctx.bezierCurveTo(-0.65, -2.1, 0.65, -2.1, 0.75, -0.95); ctx.quadraticCurveTo(0, -0.78, -0.75, -0.95); ctx.fillStyle = '#a66a4c'; ctx.fill();
    for (const [x, y] of [[-0.3, -1.3], [0.2, -1.53], [0.4, -1.18]]) oval(ctx, x, y, 0.1, 0.055, '#d7b48a'); ctx.restore();
  }
};
export default theme;
