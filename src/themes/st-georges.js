import {drawShield, drawStGeorgesCross} from './heritage-drawing.js';
import {drawEnglishRose, drawTudorRose} from './botanical-drawing.js';
import {drawKnight, drawDragon} from './character-drawing.js';

/**
 * St George's Day Theme for Domma Celebrations
 * (April 23rd, English Celebration)
 *
 * Features:
 * - Rose petals (red and white - English colors)
 * - English roses blooming
 * - St George's Cross (red cross on white)
 * - Knight silhouette (St George)
 * - Dragon (medieval European style)
 * - Shield and sword imagery
 * - Red and white color scheme with gold accents
 */

export default {
  name: 'st-georges',
  displayName: 'St George\'s Day',
  emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 40,
      speedRange: [0.3, 1.0],
      sizeRange: [2, 4],
      roses: 3,
      knightChance: 0.0002,
      twinklingStars: 10
    },
    medium: {
      count: 80,
      speedRange: [0.4, 1.3],
      sizeRange: [2, 5],
      roses: 5,
      knightChance: 0.0004,
      twinklingStars: 18
    },
    heavy: {
      count: 120,
      speedRange: [0.5, 1.6],
      sizeRange: [3, 6],
      roses: 8,
      knightChance: 0.0006,
      twinklingStars: 25
    }
  },

  particles: ['rose-petal', 'tudor-rose', 'oak-leaf', 'sparkle'],
  decorations: ['english-rose', 'st-georges-cross', 'knight', 'dragon', 'shield', 'castle','twinkling-star'],

  /**
   * Trait manifest - what a host is allowed to turn on, off or thin out.
   *
   * Each entry names the particle `type` values it owns, so the engine can
   * filter this theme's output without knowing anything about the theme. Where
   * a trait's population is driven by an `intensityConfig` key, `count` (a
   * number of items) or `chance` (a per-frame spawn probability) names it, and
   * a density below 1 scales that key rather than discarding particles after
   * the fact. `kind: 'particle'` marks the falling layer as opposed to a
   * decoration; `global: true` marks a trait drawn by `drawGlobalEffects`
   * rather than as a particle.
   */
  traits: {
    rosePetal: { label: 'Rose petals', types: ['rose-petal'], kind: 'particle' },
    tudorRose: { label: 'Tudor roses', types: ['tudor-rose'], kind: 'particle' },
    oakLeaf: { label: 'Oak leaves', types: ['oak-leaf'], kind: 'particle' },
    sparkle: { label: 'Sparkles', types: ['sparkle'], kind: 'particle' },
    englishRose: { label: 'English roses', types: ['english-rose'], count: 'roses' },
    twinklingStar: { label: 'Twinkling stars', types: ['twinkling-star'], count: 'twinklingStars' },
    knight: { label: 'Knight', types: ['knight'], chance: 'knightChance' },
    dragon: { label: 'Dragon', types: ['dragon'] },
    castle: { label: 'Castle', types: ['castle'] },
    shield: { label: 'Shields', types: ['shield'] },
    stGeorgesCross: { label: "St George's cross", types: ['st-georges-cross'] }
  },
  colors: {
    primary: '#C8102E',    // English red
    secondary: '#FFFFFF',  // White
    tertiary: '#012169',   // English blue (from Union Jack)
    accent: '#FFD700',     // Gold
    greenStem: '#228B22'   // Rose stem
  },

  /**
   * Create rose petal particle (simple red/white petal)
   */
  createRosePetal(canvasWidth, canvasHeight, config) {
    // 70% red petals, 30% white petals (English colors)
    const isRed = Math.random() < 0.7;
    const petalColors = isRed
      ? ['#C8102E', '#DC143C', '#B91C1C', '#991B1B']  // Red shades
      : ['#FFFFFF', '#FFF5F5', '#FECACA', '#FEE2E2']; // White to pink shades

    return {
      type: 'rose-petal',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),  // Horizontal drift
      size: (config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0])) * 1.5,  // Larger petals
      speed: (Math.random() - 0.5) * 0.2,  // Gentle vertical bobbing
      opacity: 0.75 + Math.random() * 0.25,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.02 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create Tudor Rose particle (red and white layered rose - full flower)
   */
  createTudorRose(canvasWidth, canvasHeight, config) {
    return {
      type: 'tudor-rose',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.15,  // Gentle vertical bobbing
      opacity: 0.8 + Math.random() * 0.2,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      petalCount: 5, // Tudor rose has 5 petals
      active: true
    };
  },

  /**
   * Create Oak Leaf particle (English oak - national tree)
   */
  createOakLeaf(canvasWidth, canvasHeight, config) {
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.6) {
      color = '#2d5016'; // 60% dark green
    } else if (colorChoice < 0.85) {
      color = '#6b8e23'; // 25% olive green
    } else {
      color = '#8b4513'; // 15% autumn brown
    }

    return {
      type: 'oak-leaf',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.8,  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.2,  // Gentle vertical bobbing
      opacity: 0.75 + Math.random() * 0.25,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.02 + Math.random() * 0.03,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: color,
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.03 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create sparkle particle (English celebration sparkles)
   */
  createSparkle(canvasWidth, canvasHeight, config) {
    const colors = ['#FFD700', '#FFFFFF', '#C8102E']; // Gold, white, red
    return {
      type: 'sparkle',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.8,  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.6,
      vy: (Math.random() - 0.5) * 0.2,  // Minimal random vertical movement
      opacity: 0.6 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinklePhase: Math.random() * Math.PI * 2,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      active: true,
      static: false
    };
  },

  /**
   * Create drifting particle (randomly picks type)
   * Note: St. George's Day particles drift horizontally (left-to-right), not vertically
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // 60% rose petals, 20% full Tudor roses, 15% sparkles, 5% oak leaves
    if (choice < 0.6) {
      return this.createRosePetal(canvasWidth, canvasHeight, config);
    } else if (choice < 0.8) {
      return this.createTudorRose(canvasWidth, canvasHeight, config);
    } else if (choice < 0.95) {
      return this.createSparkle(canvasWidth, canvasHeight, config);
    } else {
      return this.createOakLeaf(canvasWidth, canvasHeight, config);
    }
  },

  /**
   * Create English rose decoration (blooming flower)
   */
  createEnglishRose(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'english-rose',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1,
      y: options.y !== undefined ? options.y : canvasHeight - 60 - Math.random() * 100,
      size: 15 + Math.random() * 10,
      opacity: 1,
      color: Math.random() < 0.7 ? '#C8102E' : '#FFFFFF', // 70% red, 30% white
      bloomPhase: Math.random() * Math.PI * 2,
      petalCount: 8 + Math.floor(Math.random() * 5),
      active: true,
      static: true
    };
  },

  /**
   * Create St George's Cross flag decoration
   */
  createStGeorgesCross(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'st-georges-cross',
      x: options.x !== undefined ? options.x : canvasWidth * 0.1 + Math.random() * canvasWidth * 0.8,
      y: options.y !== undefined ? options.y : 50 + Math.random() * 100,
      size: 40 + Math.random() * 20,
      opacity: 1,
      waveOffset: Math.random() * Math.PI * 2,
      waveSpeed: 0.001 + Math.random() * 0.001,
      active: true,
      static: true
    };
  },

  /**
   * Create knight (St George) decoration
   */
  createKnight(canvasWidth, canvasHeight) {
    const fromLeft = Math.random() < 0.5;
    return {
      type: 'knight',
      x: fromLeft ? -80 : canvasWidth + 80,
      y: canvasHeight - 50,
      baseY: canvasHeight - 50,
      vx: fromLeft ? 0.8 + Math.random() * 0.4 : -(0.8 + Math.random() * 0.4),
      size: 20 + Math.random() * 10,
      opacity: 1,
      marchPhase: Math.random() * Math.PI * 2,
      marchSpeed: 0.015,
      active: true,
      static: false
    };
  },

  /**
   * Create dragon decoration (medieval European style)
   */
  createDragon(canvasWidth, canvasHeight, options = {}) {
    const fromLeft = Math.random() < 0.5;
    return {
      type: 'dragon',
      x: fromLeft ? -100 : canvasWidth + 100,
      y: canvasHeight * 0.3 + Math.random() * canvasHeight * 0.2,
      baseY: canvasHeight * 0.3 + Math.random() * canvasHeight * 0.2,
      vx: fromLeft ? 1.5 + Math.random() * 0.5 : -(1.5 + Math.random() * 0.5),
      size: 30 + Math.random() * 15,
      opacity: 1,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.012,
      breatheFirePhase: Math.random() * Math.PI * 2,
      active: true,
      static: false
    };
  },

  /**
   * Create shield decoration (with St George's Cross)
   */
  createShield(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'shield',
      x: options.x !== undefined ? options.x : canvasWidth * 0.2 + Math.random() * canvasWidth * 0.6,
      y: options.y !== undefined ? options.y : canvasHeight - 80 - Math.random() * 150,
      size: 20 + Math.random() * 10,
      opacity: 1,
      rotation: -Math.PI / 12 + Math.random() * (Math.PI / 6),
      glintPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Castle (left side)
    decorations.push({
      type: 'castle',
      x: 150,
      y: canvasHeight - 100,
      size: 80 + Math.random() * 20,
      opacity: 1,
      active: true,
      static: true
    });

    // Static dragon (perched on castle or ground, right side)
    decorations.push({
      type: 'dragon',
      x: canvasWidth - 200,
      y: canvasHeight - 60,
      baseY: canvasHeight - 60,
      vx: 0, // Static, not moving
      size: 25 + Math.random() * 10,
      opacity: 1,
      time: 0,
      wingPhase: Math.random() * Math.PI * 2,
      breathePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Knight on steed (center-left, facing dragon)
    decorations.push({
      type: 'knight',
      x: canvasWidth * 0.4,
      y: canvasHeight - 45,
      baseY: canvasHeight - 45,
      vx: 0, // Static, mounted and ready
      size: 20 + Math.random() * 5,
      opacity: 1,
      time: 0,
      legPhase: 0, // Standing still
      weaponRaised: true, // Lance raised toward dragon
      active: true,
      static: true
    });

    // Separate St George's Cross flag beside the castle
    decorations.push(this.createStGeorgesCross(canvasWidth, canvasHeight, {
      x: 55,
      y: canvasHeight - 190,
      size: 30
    }));

    // Shields displayed (decorative)
    decorations.push(this.createShield(canvasWidth, canvasHeight, {
      x: canvasWidth * 0.15,
      y: canvasHeight - 60
    }));

    // Create twinkling stars
    const starCount = config.twinklingStars || 18;
    for (let i = 0; i < starCount; i++) {
      decorations.push(this.createTwinklingStar(canvasWidth, canvasHeight));
    }

    return decorations;
  },

  /**
   * Create twinkling star particle
   */
  createTwinklingStar(canvasWidth, canvasHeight) {
    return {
      type: 'twinkling-star',
      x: Math.random() * canvasWidth,
      y: Math.random() * (canvasHeight * 0.5),
      size: 1 + Math.random() * 2,
      opacity: 0.6 + Math.random() * 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.003,
      active: true,
      static: true
    };
  },

  /**
   * Spawn special St George's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Knight (very rare, max 1)
    if (choice < config.knightChance) {
      if (specialParticles.some(p => p.type === 'knight')) {
        return null;
      }
      return this.createKnight(canvasWidth, canvasHeight);
    }

    // Dragon (very rare, max 1)
    if (choice < config.knightChance * 1.2) {
      if (specialParticles.some(p => p.type === 'dragon')) {
        return null;
      }
      return this.createDragon(canvasWidth, canvasHeight);
    }

    // English rose (rare)
    if (choice < 0.0005) {
      const roseCount = specialParticles.filter(p => p.type === 'english-rose').length;
      if (roseCount < config.roses) {
        return this.createEnglishRose(canvasWidth, canvasHeight);
      }
    }

    // St George's Cross flag (rare, max 2)
    if (choice < 0.0003) {
      const flagCount = specialParticles.filter(p => p.type === 'st-georges-cross').length;
      if (flagCount < 2) {
        return this.createStGeorgesCross(canvasWidth, canvasHeight);
      }
    }

    // Shield (rare, max 3)
    if (choice < 0.0004) {
      const shieldCount = specialParticles.filter(p => p.type === 'shield').length;
      if (shieldCount < 3) {
        return this.createShield(canvasWidth, canvasHeight);
      }
    }

    return null;
  },

  /**
   * Draw rose petal (simple red/white petal)
   */
  drawRosePetal(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Flutter effect (petal curling as it drifts)
    const flutter = Math.sin(time * particle.flutterSpeed + particle.flutter) * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation + flutter);

    // Determine if this is a white or red petal based on color
    const isWhite = particle.color.includes('FFF') || particle.color.includes('fff');

    // Petal shape (heart-like rose petal)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = isWhite ? '#FFE6E6' : '#8B0000';
    ctx.lineWidth = size * 0.08;

    ctx.beginPath();
    // Top curves (two rounded lobes)
    ctx.moveTo(0, -size * 0.4);
    ctx.bezierCurveTo(
      size * 0.6, -size * 0.8,
      size * 0.8, -size * 0.2,
      size * 0.4, size * 0.2
    );
    // Bottom point
    ctx.lineTo(0, size * 1.0);
    ctx.lineTo(-size * 0.4, size * 0.2);
    // Left curve
    ctx.bezierCurveTo(
      -size * 0.8, -size * 0.2,
      -size * 0.6, -size * 0.8,
      0, -size * 0.4
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central vein
    ctx.strokeStyle = isWhite ? 'rgba(255, 182, 193, 0.5)' : 'rgba(139, 0, 0, 0.4)';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(0, size * 0.9);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw English rose (blooming flower)
   */
  drawEnglishRose,

  /**
   * Draw St George's Cross flag (redesigned)
   */
  drawStGeorgesCross,

  /**
   * Draw knight (St George)
   */
  drawKnight,

  /**
   * Draw dragon (medieval European style)
   */
  drawDragon,

  /**
   * Draw shield with St George's Cross
   */
  drawShield,

  /**
   * Draw a limestone gatehouse with drum towers and a raised central keep.
   * Geometry uses a 100-unit grid so outlines and masonry scale together.
   */
  drawCastle(ctx, particle) {
    if (!Number.isFinite(particle.size) || particle.size <= 0) return;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(particle.x, particle.y);
    ctx.scale(particle.size / 100, particle.size / 100);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const outline = '#4c514e';
    const stone = (left, right) => {
      const gradient = ctx.createLinearGradient(left, 0, right, 0);
      gradient.addColorStop(0, '#a69e88');
      gradient.addColorStop(0.28, '#e0d6bb');
      gradient.addColorStop(0.62, '#c5bba1');
      gradient.addColorStop(1, '#8c8b7c');
      return gradient;
    };
    const path = (points, fill) => {
      ctx.beginPath();
      points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
    // One continuous parapet contour keeps the merlons attached to the wall.
    const battlements = (left, top, width, bottom, count, fill) => {
      const step = width / (count * 2 - 1);
      const points = [[left, bottom], [left, top]];
      for (let i = 0; i < count * 2 - 1; i++) {
        const x = left + (i + 1) * step;
        const y = top + (i % 2 ? 9 : 0);
        points.push([x, y]);
        if (i < count * 2 - 2) points.push([x, top + (i % 2 ? 0 : 9)]);
      }
      points.push([left + width, bottom]);
      path(points, fill);
    };
    const masonry = (left, top, width, bottom) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, width, bottom - top);
      ctx.clip();
      ctx.strokeStyle = 'rgba(88, 82, 66, 0.23)';
      ctx.lineWidth = 0.7;
      for (let row = 0, y = top; y < bottom; row++, y += 12) {
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + width, y);
        for (let x = left + (row % 2 ? -9 : 3); x < left + width; x += 21) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 12);
        }
        ctx.stroke();
      }
      ctx.restore();
    };
    const arch = (x, bottom, width, spring, fill) => {
      ctx.beginPath();
      ctx.moveTo(x - width, bottom);
      ctx.lineTo(x - width, spring);
      ctx.arc(x, spring, width, Math.PI, Math.PI * 2);
      ctx.lineTo(x + width, bottom);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };
    const window = (x, y) => {
      arch(x, y + 15, 4, y + 4, '#666857');
      arch(x, y + 14, 2.3, y + 4, '#303b3b');
      ctx.fillStyle = '#e8dfc6';
      ctx.fillRect(x - 5, y + 15, 10, 1.5);
    };

    // A low stone footing and soft contact shadow ground the silhouette.
    ctx.fillStyle = 'rgba(24, 34, 31, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 5, 116, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    path([[-109, 1], [-104, -7], [104, -7], [109, 1]], '#8c917c');

    // The keep sits behind the lower curtain wall and the two front towers.
    battlements(-42, -137, 84, -37, 5, stone(-42, 42));
    masonry(-41, -122, 82, -37);
    ctx.fillStyle = '#ede3c9';
    ctx.fillRect(-42, -123, 84, 3);
    ctx.fillStyle = 'rgba(72, 77, 66, 0.22)';
    ctx.fillRect(-42, -120, 84, 4);
    window(-22, -110);
    window(22, -110);
    window(0, -76);

    battlements(-81, -78, 162, 0, 9, stone(-81, 81));
    masonry(-80, -63, 160, -2);
    ctx.fillStyle = '#e7ddc4';
    ctx.fillRect(-81, -64, 162, 3);
    ctx.fillStyle = 'rgba(72, 77, 66, 0.2)';
    ctx.fillRect(-81, -61, 162, 4);

    // Recessed gate with individual arch stones and a clipped iron portcullis.
    arch(0, -1, 25, -35, '#a29980');
    ctx.strokeStyle = '#716f60';
    ctx.lineWidth = 0.9;
    for (let i = 0; i <= 9; i++) {
      const angle = Math.PI + i * Math.PI / 9;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 20, -35 + Math.sin(angle) * 20);
      ctx.lineTo(Math.cos(angle) * 25, -35 + Math.sin(angle) * 25);
      ctx.stroke();
    }
    arch(0, 0, 19, -35, '#263334');
    ctx.save();
    ctx.clip();
    ctx.fillStyle = '#46504a';
    ctx.fillRect(-19, -7, 38, 7);
    ctx.strokeStyle = '#92907b';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    for (let x = -15; x <= 15; x += 6) {
      ctx.moveTo(x, -56);
      ctx.lineTo(x, -9);
    }
    for (let y = -47; y <= -12; y += 9) {
      ctx.moveTo(-19, y);
      ctx.lineTo(19, y);
    }
    ctx.stroke();
    ctx.restore();
    path([[-22, 0], [-28, 5], [28, 5], [22, 0]], '#d3c6a6');

    for (const x of [-80, 80]) {
      // Straight shafts with curved feet read as solid cylindrical towers.
      ctx.beginPath();
      ctx.moveTo(x - 24, -101);
      ctx.lineTo(x + 24, -101);
      ctx.lineTo(x + 24, -5);
      ctx.quadraticCurveTo(x, 4, x - 24, -5);
      ctx.closePath();
      ctx.fillStyle = stone(x - 24, x + 24);
      ctx.fill();
      ctx.strokeStyle = outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      masonry(x - 23, -98, 46, -7);
      battlements(x - 27, -118, 54, -98, 4, stone(x - 27, x + 27));
      ctx.fillStyle = '#eee3c8';
      ctx.fillRect(x - 27, -100, 54, 3);
      ctx.fillStyle = 'rgba(72, 77, 66, 0.24)';
      ctx.fillRect(x - 24, -97, 48, 4);
      window(x, -85);
      window(x, -49);
      ctx.strokeStyle = '#8c8976';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 23, -11);
      ctx.quadraticCurveTo(x, -4, x + 23, -11);
      ctx.stroke();
    }

    // A small folded St George's flag crowns the keep.
    ctx.strokeStyle = '#68624f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -138);
    ctx.lineTo(0, -185);
    ctx.stroke();
    const flag = [[2, -182], [18, -180], [38, -183], [38, -159], [18, -156], [2, -158]];
    path(flag, '#fff9e9');
    ctx.save();
    ctx.clip();
    ctx.fillStyle = '#b92435';
    ctx.fillRect(14, -185, 6, 32);
    path([[2, -173], [18, -171], [38, -174], [38, -168], [18, -165], [2, -167]], '#b92435');
    ctx.restore();
    ctx.fillStyle = '#d9b56b';
    ctx.beginPath();
    ctx.arc(0, -186, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  /**
   * Draw Tudor Rose (iconic English rose with 5 petals, red outer/white inner)
   */
  drawTudorRose,

  /**
   * Draw Oak Leaf (lobed English oak leaf)
   */
  drawOakLeaf(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Leaf color
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = particle.color === '#8b4513' ? '#654321' : '#1a3a0a';
    ctx.lineWidth = size * 0.08;

    // Oak leaf shape (characteristic lobes)
    ctx.beginPath();
    ctx.moveTo(0, size * 1.5); // Stem end

    // Right side lobes (3 lobes)
    ctx.bezierCurveTo(size * 0.3, size * 1.2, size * 0.4, size * 1.0, size * 0.5, size * 0.8);
    ctx.bezierCurveTo(size * 0.7, size * 0.7, size * 0.8, size * 0.5, size * 0.6, size * 0.3);
    ctx.bezierCurveTo(size * 0.8, size * 0.2, size * 0.9, 0, size * 0.7, -size * 0.3);
    ctx.bezierCurveTo(size * 0.85, -size * 0.5, size * 0.8, -size * 0.8, size * 0.5, -size * 1.0);

    // Tip
    ctx.bezierCurveTo(size * 0.3, -size * 1.2, 0, -size * 1.3, -size * 0.3, -size * 1.2);

    // Left side lobes (3 lobes, mirror)
    ctx.bezierCurveTo(-size * 0.8, -size * 0.8, -size * 0.85, -size * 0.5, -size * 0.7, -size * 0.3);
    ctx.bezierCurveTo(-size * 0.9, 0, -size * 0.8, size * 0.2, -size * 0.6, size * 0.3);
    ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.7, size * 0.7, -size * 0.5, size * 0.8);
    ctx.bezierCurveTo(-size * 0.4, size * 1.0, -size * 0.3, size * 1.2, 0, size * 1.5);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central vein
    ctx.strokeStyle = particle.color === '#8b4513' ? '#654321' : '#0a2505';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(0, size * 1.4);
    ctx.lineTo(0, -size * 1.15);
    ctx.stroke();

    // Side veins (branching)
    ctx.lineWidth = size * 0.03;
    for (let i = 0; i < 4; i++) {
      const yPos = size * 0.8 - i * size * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(size * 0.4, yPos - size * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(-size * 0.4, yPos - size * 0.15);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw sparkle (English celebration sparkle)
   */
  drawSparkle(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const twinkle = 0.6 + Math.sin(time * 0.004 + particle.twinklePhase) * 0.4;

    ctx.save();
    ctx.globalAlpha = particle.opacity * twinkle;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Draw 4-pointed sparkle
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 2;

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.3, size * 0.3);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.3, -size * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw Royal Crown (St Edward's Crown style)
   */
  drawCrown(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const glint = (Math.sin(particle.glint) + 1) * 0.5;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Crown base (golden)
    const crownGradient = ctx.createLinearGradient(-size, 0, size, 0);
    crownGradient.addColorStop(0, '#B8860B');
    crownGradient.addColorStop(0.5, '#FFD700');
    crownGradient.addColorStop(1, '#B8860B');
    ctx.fillStyle = crownGradient;
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = size * 0.05;

    // Crown band (base)
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 0.8, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lower band detail (jewels band)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 0.7, size * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crown arches (5 points)
    ctx.fillStyle = crownGradient;
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = size * 0.05;

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const baseX = Math.cos(angle) * size * 0.7;
      const baseY = size * 0.3 + Math.sin(angle) * size * 0.2;

      // Fleur-de-lis point
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.rotate(angle + Math.PI / 2);

      ctx.beginPath();
      // Center spike
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(-size * 0.12, -size * 0.3);
      ctx.lineTo(size * 0.12, -size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Side curves
      ctx.beginPath();
      ctx.moveTo(-size * 0.12, -size * 0.3);
      ctx.bezierCurveTo(-size * 0.25, -size * 0.5, -size * 0.28, -size * 0.65, -size * 0.2, -size * 0.75);
      ctx.lineTo(-size * 0.15, -size * 0.65);
      ctx.bezierCurveTo(-size * 0.18, -size * 0.55, -size * 0.15, -size * 0.4, -size * 0.08, -size * 0.32);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(size * 0.12, -size * 0.3);
      ctx.bezierCurveTo(size * 0.25, -size * 0.5, size * 0.28, -size * 0.65, size * 0.2, -size * 0.75);
      ctx.lineTo(size * 0.15, -size * 0.65);
      ctx.bezierCurveTo(size * 0.18, -size * 0.55, size * 0.15, -size * 0.4, size * 0.08, -size * 0.32);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Cross on top (St Edward's Crown has a cross)
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = size * 0.04;
    ctx.beginPath();
    // Vertical bar
    ctx.fillRect(-size * 0.05, -size * 0.9, size * 0.1, size * 0.25);
    ctx.strokeRect(-size * 0.05, -size * 0.9, size * 0.1, size * 0.25);
    // Horizontal bar
    ctx.fillRect(-size * 0.15, -size * 0.82, size * 0.3, size * 0.08);
    ctx.strokeRect(-size * 0.15, -size * 0.82, size * 0.3, size * 0.08);

    // Jewels (red rubies, blue sapphires)
    const jewels = [
      { x: 0, y: size * 0.3, color: '#DC143C', size: 0.12 }, // Center ruby
      { x: size * 0.4, y: size * 0.3, color: '#0000CD', size: 0.08 }, // Right sapphire
      { x: -size * 0.4, y: size * 0.3, color: '#0000CD', size: 0.08 }, // Left sapphire
    ];

    for (const jewel of jewels) {
      ctx.fillStyle = jewel.color;
      ctx.beginPath();
      ctx.arc(jewel.x, jewel.y, size * jewel.size, 0, Math.PI * 2);
      ctx.fill();

      // Glint effect
      ctx.fillStyle = `rgba(255, 255, 255, ${glint * 0.7})`;
      ctx.beginPath();
      ctx.arc(jewel.x - size * jewel.size * 0.3, jewel.y - size * jewel.size * 0.3, size * jewel.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw twinkling star
   */
  drawTwinklingStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    const twinkleIntensity = 0.5 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;

    const starColor = `rgba(255, 220, 220, ${twinkleIntensity})`;
    const glowColor = `rgba(255, 180, 180, ${twinkleIntensity * 0.4})`;

    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = glowColor;
    ctx.shadowBlur = size * 3 * twinkleIntensity;
    ctx.fillStyle = starColor;

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const outerX = Math.cos(angle) * size;
      const outerY = Math.sin(angle) * size;
      const innerAngle = angle + Math.PI / 4;
      const innerX = Math.cos(innerAngle) * (size * 0.3);
      const innerY = Math.sin(innerAngle) * (size * 0.3);

      if (i === 0) {
        ctx.moveTo(outerX, outerY);
      } else {
        ctx.lineTo(outerX, outerY);
      }
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = size * 2 * twinkleIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};
