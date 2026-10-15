import newYear from './new-year.js';
import {createSparklerMessage, updateSparklerMessage, drawSparklerMessage} from './sparkler-writing.js';
import {drawMortarboard, drawDiploma, drawBirthdayCake, drawCelebrationHeart, drawAnniversaryRings, drawRibbonBow} from './occasion-drawing.js';

const item = (type, x, y, size, extra = {}) => ({type, x, y, size, opacity: 1, active: true, static: true, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2, ...extra});
const definitions = {
  graduation: ['Graduation', '🎓', 'Congratulations!'],
  birthday: ['Birthday', '🎂', 'Happy Birthday!'],
  anniversary: ['Anniversary', '💍', 'Happy Anniversary!'],
  greeting: ['Sparkler greeting', '✨', 'Congratulations!']
};

export function createOccasionTheme(kind) {
  const [displayName, emoji, defaultMessage] = definitions[kind];
  const greeting = kind === 'greeting', anniversary = kind === 'anniversary';
  return {
    name: kind, displayName, emoji, defaultMessage,
    colors: {primary: '#e4c77f'},
    intensityConfig: {
      light: {count: greeting ? 0 : 18, speedRange: [0.4, 0.8], sizeRange: [3, 6], caps: 3, diplomas: 1, balloons: 2},
      medium: {count: greeting ? 0 : 36, speedRange: [0.6, 1.1], sizeRange: [4, 8], caps: 5, diplomas: 2, balloons: 4},
      heavy: {count: greeting ? 0 : 60, speedRange: [0.8, 1.5], sizeRange: [5, 10], caps: 8, diplomas: 3, balloons: 6}
    },
    particles: greeting ? [] : [anniversary ? 'celebration-heart' : 'confetti'],
    decorations: ['sparkler-message', ...(kind === 'graduation' ? ['mortarboard', 'diploma'] : kind === 'birthday' ? ['balloon', 'birthday-cake'] : anniversary ? ['anniversary-rings', 'ribbon-bow'] : [])],
    traits: {
      sparklerMessage: {label: 'Sparkler greeting', types: ['sparkler-message']},
      ...(!greeting ? anniversary ? {heart: {label: 'Falling hearts', types: ['celebration-heart'], kind: 'particle'}} : {confetti: {label: 'Confetti', types: ['confetti'], kind: 'particle'}} : {}),
      ...(kind === 'graduation' ? {
        mortarboard: {label: 'Tossed mortarboards', types: ['mortarboard'], count: 'caps'},
        diploma: {label: 'Diplomas', types: ['diploma'], count: 'diplomas'}
      } : kind === 'birthday' ? {
        balloon: {label: 'Balloons', types: ['balloon'], count: 'balloons'},
        cake: {label: 'Birthday cake', types: ['birthday-cake']}
      } : anniversary ? {
        rings: {label: 'Anniversary rings', types: ['anniversary-rings']},
        ribbon: {label: 'Ribbon bows', types: ['ribbon-bow']}
      } : {})
    },
    createFallingParticle(width, height, config) {
      const p = newYear.createFallingParticle(width, height, config);
      return {...p, type: anniversary ? 'celebration-heart' : 'confetti', size: anniversary ? p.size * 1.4 : p.size};
    },
    createInitialDecorations(width, height, config) {
      const scale = Math.min(1, width / 600);
      const options = config.sparkler || {};
      const message = options.message?.trim() || (options.greeting === 'best-wishes' ? undefined : defaultMessage);
      const items = [createSparklerMessage(defaultMessage, width, height, {...options, message})];
      if (kind === 'graduation') {
        for (let i = 0; i < config.caps; i++) items.push(item('mortarboard', (i + 0.5) * width / config.caps, height * 0.7, (22 + Math.random() * 9) * scale, {baseX: (i + 0.5) * width / config.caps, age: Math.random() * 4000, rotation: 0}));
        for (let i = 0; i < config.diplomas; i++) items.push(item('diploma', (i + 0.5) * width / config.diplomas, height - 25 * scale, 38 * scale, {rotation: (i % 2 ? 1 : -1) * 0.08}));
      } else if (kind === 'birthday') {
        items.push(item('birthday-cake', width / 2, height - 12, 50 * scale));
        for (let i = 0; i < config.balloons; i++) items.push(item('balloon', i % 2 ? width - 32 - i * 5 : 32 + i * 5, height - (110 + i * 25) * scale, 24 * scale, {color: ['#d997ad', '#a1becf', '#e4c77f'][i % 3]}));
      } else if (anniversary) {
        items.push(item('anniversary-rings', width / 2, height - 16, 55 * scale));
        for (const x of [width * 0.14, width * 0.86]) items.push(item('ribbon-bow', x, height - 55 * scale, 23 * scale));
      }
      return items;
    },
    updateSpecialParticles(items, delta, width = 1024, height = 800) {
      for (const p of items) {
        if (p.type === 'sparkler-message') updateSparklerMessage(p, delta);
        if (p.type === 'mortarboard') {
          p.age = (p.age + Math.min(100, Math.max(0, delta))) % 4200;
          const progress = p.age / 4200;
          p.x = p.baseX + Math.sin(progress * Math.PI * 2) * p.size * 0.55;
          p.y = height - p.size * 1.3 - Math.sin(progress * Math.PI) * height * 0.55;
          p.rotation = Math.sin(progress * Math.PI * 2) * 0.75;
        }
      }
    },
    drawConfetti: newYear.drawConfetti, drawBalloon: newYear.drawBalloon,
    drawSparklerMessage, drawMortarboard, drawDiploma, drawBirthdayCake,
    drawCelebrationHeart, drawAnniversaryRings, drawRibbonBow
  };
}
