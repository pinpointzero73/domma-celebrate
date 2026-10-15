import {drawBlossom, drawFlower, drawEasterEgg, drawBunny, drawBee, drawLadybird, drawGardenButterfly} from './garden-drawing.js';
import {createGardenButterfly, updateGardenButterfly} from './butterfly-flight.js';

const palette = ['#f3c2d2', '#e9db9f', '#c7b8da', '#eab48f'];
const pick = values => values[Math.floor(Math.random() * values.length)];
const decoration = (type, x, y, size, extra = {}) => ({
  type, x, y, size, vx: 0, vy: 0, rotation: 0, opacity: 0.95,
  active: true, static: true, phase: Math.random() * Math.PI * 2, ...extra
});

/** The two gardens share artwork, but expose only their own scene's traits. */
export function createGardenTheme(easter = false) {
  return {
    name: easter ? 'easter' : 'summer-garden',
    displayName: easter ? 'Easter' : 'Summer Garden',
    emoji: easter ? '🐣' : '🌼',
    colors: {primary: '#f3c2d2'},
    intensityConfig: {
      light: {count: 18, speedRange: [0.3, 0.6], sizeRange: [3, 6], flowers: 4, eggs: 3, butterflies: 2, bees: 1, ladybirds: 1},
      medium: {count: 35, speedRange: [0.4, 0.8], sizeRange: [4, 8], flowers: 7, eggs: 5, butterflies: 4, bees: 2, ladybirds: 2},
      heavy: {count: 60, speedRange: [0.5, 1], sizeRange: [5, 10], flowers: 11, eggs: 7, butterflies: 6, bees: 3, ladybirds: 3}
    },
    particles: ['blossom'],
    decorations: easter ? ['flower', 'easter-egg', 'bunny', 'garden-butterfly'] : ['flower', 'garden-butterfly', 'bee', 'ladybird'],
    traits: {
      blossom: {label: easter ? 'Falling blossom' : 'Drifting petals', types: ['blossom'], kind: 'particle'},
      flower: {label: 'Flowers', types: ['flower'], count: 'flowers'},
      butterfly: {label: 'Butterflies', types: ['garden-butterfly'], count: 'butterflies'},
      ...(easter ? {
        easterEgg: {label: 'Decorated eggs', types: ['easter-egg'], count: 'eggs'},
        bunny: {label: 'Easter bunny', types: ['bunny']}
      } : {
        bee: {label: 'Bumblebees', types: ['bee'], count: 'bees'},
        ladybird: {label: 'Ladybirds', types: ['ladybird'], count: 'ladybirds'}
      })
    },
    createFallingParticle(width, height, config) {
      return {
        ...decoration('blossom', Math.random() * width, -20, config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0])),
        static: false, speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
        rotationSpeed: (Math.random() - 0.5) * 0.025, windOffset: Math.random() * 6.28,
        windSpeed: 0.015, color: pick(palette), opacity: 0.65
      };
    },
    createInitialDecorations(width, height, config) {
      const items = [];
      // Keep flowers on the lower edge, leaving the centre free for content.
      const scale = Math.min(1, width / 600);
      for (let i = 0; i < config.flowers; i++) {
        items.push(decoration('flower', (i + 0.5) * width / config.flowers, height - 3, (26 + Math.random() * 15) * scale, {color: pick(palette)}));
      }
      if (easter) {
        for (let i = 0; i < config.eggs; i++) {
          items.push(decoration('easter-egg', (i + 0.5) * width / config.eggs, height - 4, (18 + Math.random() * 7) * scale, {color: pick(palette)}));
        }
        items.push(decoration('bunny', width * 0.13, height - 4, 45 * scale, {
          baseY: height - 4, homeX: width * 0.13, age: 0, hopping: false, facing: 'right'
        }));
      } else {
        for (let i = 0; i < config.ladybirds; i++) {
          items.push(decoration('ladybird', (i + 0.7) * width / (config.ladybirds + 1), height - 10, 12 * scale));
        }
      }
      for (const [type, count, size] of [['garden-butterfly', config.butterflies, 26], ['bee', easter ? 0 : config.bees, 12]]) {
        for (let i = 0; i < count; i++) {
          if (type === 'garden-butterfly') {
            items.push(createGardenButterfly(width, height, scale));
            continue;
          }
          const y = height * (0.6 + Math.random() * 0.28);
          items.push(decoration(type, Math.random() * width, y, size * scale, {
            static: false, vx: 0.3 + Math.random() * 0.4, baseY: y,
            waveAmplitude: 15 * scale, waveFrequency: 1.4, waveOffset: Math.random() * 6.28,
            ...(type === 'bee' ? {
              static: true, vx: 0, targetIndex: i % Math.max(1, config.flowers),
              state: 'flying', visitTime: 0, age: 0, facing: 'right'
            } : {})
          }));
        }
      }
      return items;
    },
    updateSpecialParticles(items, delta, width, height = 800) {
      const elapsed = Math.min(100, Math.max(0, delta));
      const flowers = items.filter(p => p.type === 'flower' && p.active);
      for (const p of items) {
        if (p.type === 'garden-butterfly') updateGardenButterfly(p, delta, width, height);
        if (p.type === 'bee') {
          p.age += elapsed;
          const flower = flowers[p.targetIndex % flowers.length];
          if (!flower) {
            // With flowers switched off, the bees continue their gentle flight.
            p.x += elapsed * 0.035;
            p.y = p.baseY + Math.sin(p.age / 700 + p.phase) * 10;
            if (p.x > width + 35) p.x = -35;
            p.state = 'flying'; p.facing = 'right';
            continue;
          }
          const targetX = flower.x + p.size * 0.25;
          const targetY = flower.y - flower.size * 1.45 - p.size * 0.2;
          if (p.state === 'visiting') {
            p.visitTime += elapsed;
            p.x = targetX; p.y = targetY + Math.sin(p.age / 160) * 1.2;
            if (p.visitTime >= 1600) {
              p.targetIndex = (p.targetIndex + 1) % flowers.length;
              p.state = 'flying'; p.visitTime = 0;
            }
          } else {
            const dx = targetX - p.x, dy = targetY - p.y;
            const distance = Math.hypot(dx, dy);
            const step = Math.min(distance, elapsed * 0.085);
            if (distance > 0) {p.x += dx / distance * step; p.y += dy / distance * step;}
            p.facing = dx < 0 ? 'left' : 'right';
            if (distance <= step + 0.5) {p.state = 'visiting'; p.visitTime = 0;}
          }
        }
        if (p.type === 'bunny') {
          p.age += elapsed;
          const wait = 2800, hop = 700;
          if (!p.hopping && p.age >= wait) {
            p.hopping = true; p.age = 0;
            const direction = p.homeX + p.size * 2.5 > width ? -1 : p.homeX - p.size * 2.5 < 0 ? 1 : p.facing === 'left' ? -1 : 1;
            p.facing = direction < 0 ? 'left' : 'right';
            p.hopTarget = p.homeX + direction * p.size * 1.7;
          }
          if (p.hopping) {
            const progress = Math.min(1, p.age / hop);
            p.x = p.homeX + (p.hopTarget - p.homeX) * progress;
            p.y = p.baseY - Math.sin(progress * Math.PI) * p.size * 0.85;
            if (progress >= 1) {p.homeX = p.x; p.y = p.baseY; p.hopping = false; p.age = 0;}
          }
        }
      }
    },
    drawBlossom, drawFlower, drawEasterEgg, drawBunny, drawBee, drawLadybird, drawGardenButterfly
  };
}
