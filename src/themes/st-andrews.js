import {drawTartanPattern, drawHighlandScene} from './heritage-drawing.js';
import {drawHeather, drawThistle, drawThistlePlant} from './botanical-drawing.js';
import {drawBagpiper} from './character-drawing.js';

/**
 * St Andrew's Day Theme for Domma Celebrations
 * (November 30th, Scottish Celebration)
 *
 * Features:
 * - Falling thistles (Scottish national flower)
 * - Snowflakes (Scottish winter)
 * - Saltire flag patterns (white X on blue)
 * - Bagpiper silhouette
 * - Tartan patterns
 * - Blue and white color scheme with purple thistles
 */


export default {
  name: 'st-andrews',
  displayName: 'St Andrew\'s Day',
  emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 50,
      speedRange: [0.5, 1.5],
      sizeRange: [2, 4],
      thistles: 4,
      bagpiperChance: 0.0002,
      twinklingStars: 12
    },
    medium: {
      count: 100,
      speedRange: [0.6, 2.0],
      sizeRange: [2, 5],
      thistles: 6,
      bagpiperChance: 0.0004,
      twinklingStars: 20
    },
    heavy: {
      count: 200,
      speedRange: [0.8, 2.5],
      sizeRange: [3, 6],
      thistles: 8,
      bagpiperChance: 0.0006,
      twinklingStars: 30
    }
  },

  particles: ['heather-petal', 'heather', 'saltire-sparkle'],
  decorations: ['thistle-plant', 'bagpiper', 'saltire-flag', 'tartan-pattern', 'highland-scene', 'twinkling-star'],

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
    heatherPetal: { label: 'Heather petals', types: ['heather-petal'], kind: 'particle' },
    heather: { label: 'Heather', types: ['heather'], kind: 'particle' },
    saltireSparkle: { label: 'Saltire sparkles', types: ['saltire-sparkle'], kind: 'particle' },
    thistle: { label: 'Thistles', types: ['thistle'], kind: 'particle' },
    thistlePlant: { label: 'Thistle plants', types: ['thistle-plant'], count: 'thistles' },
    twinklingStar: { label: 'Twinkling stars', types: ['twinkling-star'], count: 'twinklingStars' },
    bagpiper: { label: 'Bagpiper', types: ['bagpiper'], chance: 'bagpiperChance' },
    saltireFlag: { label: 'Saltire flag', types: ['saltire-flag'] },
    tartanPattern: { label: 'Tartan', types: ['tartan-pattern'] },
    highlandScene: { label: 'Highland scene', types: ['highland-scene'] }
  },
  colors: {
    primary: '#0065BD',    // Scottish blue (Saltire)
    secondary: '#FFFFFF',  // White (Saltire)
    accent: '#8B008B',     // Thistle purple (decorations only)
    tartan: ['#0065BD', '#006400', '#8B0000', '#FFDD00']
  },

  /**
   * Create heather petal particle (simple purple petal)
   */
  createHeatherPetal(canvasWidth, canvasHeight, config) {
    // Purple/pink heather shades
    const purpleShades = ['#9370DB', '#BA55D3', '#DA70D6', '#DDA0DD', '#8B008B'];
    return {
      type: 'heather-petal',
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
      color: purpleShades[Math.floor(Math.random() * purpleShades.length)],
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.02 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create thistle particle (white and blue - Scottish Saltire colors - full flower)
   */
  createThistle(canvasWidth, canvasHeight, config) {
    const isWhite = Math.random() < 0.5; // 50% white, 50% blue
    const flowerColor = isWhite ? '#FFFFFF' : '#0065BD';
    const petalColors = isWhite
      ? ['#FFFFFF', '#f0f0f0', '#e0e0e0']  // White shades
      : ['#0065BD', '#1a7dd4', '#3399ee']; // Blue shades

    return {
      type: 'thistle',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.7,  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.15,  // Gentle vertical bobbing
      opacity: 0.7 + Math.random() * 0.3,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      flowerColor: flowerColor,
      petalColors: petalColors,
      active: true
    };
  },

  /**
   * Create heather particle (Scottish Highland heather - purple flowers - full sprig)
   */
  createHeather(canvasWidth, canvasHeight, config) {
    // Heather color variations (purple/pink shades)
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.5) {
      color = '#9370DB';  // 50% medium purple
    } else if (colorChoice < 0.8) {
      color = '#BA55D3';  // 30% medium orchid
    } else {
      color = '#DA70D6';  // 20% orchid pink
    }

    return {
      type: 'heather',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.6,  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.15,  // Gentle vertical bobbing
      opacity: 0.75 + Math.random() * 0.25,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.02 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: color,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      bellCount: 3 + Math.floor(Math.random() * 3), // 3-5 bells per sprig
      active: true
    };
  },

  /**
   * Create saltire sparkle particle
   */
  createSaltireSparkle(canvasWidth, canvasHeight, config) {
    const colors = ['#0065BD', '#FFFFFF']; // Scottish blue and white
    return {
      type: 'saltire-sparkle',
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
   * Note: St. Andrew's Day particles drift horizontally (left-to-right), not vertically
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // 60% heather petals, 20% full heather, 15% sparkles, 5% thistles
    if (choice < 0.6) {
      return this.createHeatherPetal(canvasWidth, canvasHeight, config);
    } else if (choice < 0.8) {
      return this.createHeather(canvasWidth, canvasHeight, config);
    } else if (choice < 0.95) {
      return this.createSaltireSparkle(canvasWidth, canvasHeight, config);
    } else {
      return this.createThistle(canvasWidth, canvasHeight, config);
    }
  },

  /**
   * Create static thistle plant decoration
   */
  createThistlePlant(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'thistle-plant',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 40,
      size: 15 + Math.random() * 10,
      opacity: 0.8 + Math.random() * 0.2,
      swayPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations (Scottish-themed)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Thistle plants (Scottish national flower, multiple positions)
    const thistleCount = config.thistles || 5;
    for (let i = 0; i < thistleCount; i++) {
      decorations.push(this.createThistlePlant(canvasWidth, canvasHeight, {
        x: 80 + (i / (thistleCount - 1)) * (canvasWidth - 160),
        y: canvasHeight - 60 - Math.random() * 30
      }));
    }

    // Bagpiper (Highland piper in traditional dress, left side)
    decorations.push({
      type: 'bagpiper',
      x: 150,
      y: canvasHeight - 60,
      baseY: canvasHeight - 60,
      vx: 0, // Static display
      size: 30 + Math.random() * 8,
      opacity: 1,
      time: 0,
      legPhase: 0,
      bagInflate: 0.5,
      active: true,
      static: true
    });

    // Saltire flag (St Andrew's Cross, top right)
    decorations.push({
      type: 'saltire-flag',
      x: canvasWidth - 100,
      y: 80,
      size: 60,
      opacity: 1,
      wavePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Tartan pattern display (decorative Scottish pattern, bottom center)
    decorations.push({
      type: 'tartan-pattern',
      x: canvasWidth * 0.5,
      y: canvasHeight - 80,
      size: 80 + Math.random() * 20,
      opacity: 0.9,
      active: true,
      static: true
    });

    // Highland scene silhouette (mountains, castle, loch - right side)
    decorations.push({
      type: 'highland-scene',
      x: canvasWidth - 200,
      y: canvasHeight - 150,
      size: 100,
      opacity: 0.7,
      active: true,
      static: true
    });

    // Create twinkling stars (Scottish winter night sky)
    const starCount = config.twinklingStars || 20;
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
      y: Math.random() * (canvasHeight * 0.6), // Upper portion of sky
      size: 1 + Math.random() * 2,
      opacity: 0.6 + Math.random() * 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.003,
      active: true,
      static: true
    };
  },

  /**
   * Spawn special St Andrew's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Bagpiper (very rare, max 1)
    if (choice < config.bagpiperChance) {
      if (specialParticles.some(p => p.type === 'bagpiper')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'bagpiper',
        x: fromLeft ? -60 : canvasWidth + 60,
        y: canvasHeight - 50,
        vx: fromLeft ? 0.8 + Math.random() * 0.5 : -(0.8 + Math.random() * 0.5),
        size: 18 + Math.random() * 8,
        opacity: 0.9,
        time: 0,
        marchPhase: Math.random() * Math.PI * 2,
        active: true,
        static: false
      };
    }

    // Saltire flag (rare, max 2)
    if (choice < 0.0004) {
      const flagCount = specialParticles.filter(p => p.type === 'saltire-flag').length;
      if (flagCount < 2) {
        return {
          type: 'saltire-flag',
          x: Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2,
          y: 50 + Math.random() * 100,
          size: 40 + Math.random() * 20,
          opacity: 0.8,
          waveOffset: Math.random() * Math.PI * 2,
          time: 0,
          active: true,
          static: false
        };
      }
    }

    // Sparkles
    if (choice < 0.01) {
      return this.createSaltireSparkle(canvasWidth, canvasHeight, config);
    }

    return null;
  },

  /**
   * Draw heather petal (simple purple bell-shaped petal)
   */
  drawHeatherPetal(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Flutter effect (petal curling as it drifts)
    const flutter = Math.sin(time * particle.flutterSpeed + particle.flutter) * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation + flutter);

    // Heather bell petal shape (small bell)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = '#6A0DAD'; // Purple edge
    ctx.lineWidth = size * 0.08;

    ctx.beginPath();
    // Bell shape with slight flare at bottom
    ctx.moveTo(0, -size * 0.6);
    ctx.bezierCurveTo(
      size * 0.4, -size * 0.5,
      size * 0.5, size * 0.2,
      size * 0.3, size * 0.8
    );
    ctx.lineTo(-size * 0.3, size * 0.8);
    ctx.bezierCurveTo(
      -size * 0.5, size * 0.2,
      -size * 0.4, -size * 0.5,
      0, -size * 0.6
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Add bell texture lines
    ctx.strokeStyle = 'rgba(106, 13, 173, 0.3)';
    ctx.lineWidth = size * 0.04;
    for (let i = 0; i < 4; i++) {
      const yPos = -size * 0.5 + i * size * 0.35;
      ctx.beginPath();
      ctx.moveTo(-size * 0.25, yPos);
      ctx.lineTo(size * 0.25, yPos);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw heather (Scottish Highland heather sprig with bell-shaped flowers)
   */
  drawHeather,

  /**
   * Draw thistle (Scottish thistle with realistic spiky bracts)
   */
  drawThistle,

  /**
   * Draw thistle plant (ground decoration)
   */
  drawThistlePlant,

  /**
   * Draw bagpiper
   */
  drawBagpiper,

  /**
   * Draw Saltire flag (white X on blue)
   */
  drawSaltireFlag(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Wave effect
    const wavePhase = time * 0.002 + particle.waveOffset;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Flagpole
    ctx.fillStyle = '#654321';
    ctx.fillRect(-size * 0.05, 0, size * 0.1, size * 1.5);

    // Flag (waving)
    const segments = 10;
    const flagWidth = size * 1.2;
    const flagHeight = size * 0.8;

    ctx.fillStyle = '#0065BD'; // Scottish blue

    for (let i = 0; i < segments; i++) {
      const segmentWidth = flagWidth / segments;
      const x1 = i * segmentWidth;
      const x2 = (i + 1) * segmentWidth;
      const wave1 = Math.sin(wavePhase + i * 0.3) * size * 0.1;
      const wave2 = Math.sin(wavePhase + (i + 1) * 0.3) * size * 0.1;

      ctx.beginPath();
      ctx.moveTo(x1, wave1);
      ctx.lineTo(x2, wave2);
      ctx.lineTo(x2, flagHeight + wave2);
      ctx.lineTo(x1, flagHeight + wave1);
      ctx.closePath();
      ctx.fill();
    }

    // White X (Saltire)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = size * 0.12;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 5;

    // Draw X with wave
    for (let i = 0; i < segments; i++) {
      const segmentWidth = flagWidth / segments;
      const x1 = i * segmentWidth;
      const x2 = (i + 1) * segmentWidth;
      const wave1 = Math.sin(wavePhase + i * 0.3) * size * 0.1;
      const wave2 = Math.sin(wavePhase + (i + 1) * 0.3) * size * 0.1;

      // Top-left to bottom-right
      ctx.beginPath();
      ctx.moveTo(x1, wave1);
      ctx.lineTo(x2, flagHeight + wave2);
      ctx.stroke();

      // Bottom-left to top-right
      ctx.beginPath();
      ctx.moveTo(x1, flagHeight + wave1);
      ctx.lineTo(x2, wave2);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw saltire sparkle
   */
  drawSaltireSparkle(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const twinkle = 0.6 + Math.sin(time * 0.004 + particle.twinklePhase) * 0.4;

    ctx.save();
    ctx.globalAlpha = particle.opacity * twinkle;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Draw 4-pointed sparkle (Scottish blue or white)
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
   * Draw authentic Scottish tartan pattern (Stewart/Royal Stewart style)
   */
  drawTartanPattern,

  /**
   * Draw Highland scene silhouette (mountains, castle, loch)
   */
  drawHighlandScene,

  /**
   * Draw twinkling star
   */
  drawTwinklingStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Calculate twinkle intensity
    const twinkleIntensity = 0.5 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;

    // Scottish blue and white color scheme
    const starColor = `rgba(200, 220, 255, ${twinkleIntensity})`;
    const glowColor = `rgba(150, 180, 255, ${twinkleIntensity * 0.4})`;

    ctx.save();
    ctx.translate(x, y);

    // Outer glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = size * 3 * twinkleIntensity;
    ctx.fillStyle = starColor;

    // Draw 4-pointed star
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

    // Bright center
    ctx.shadowBlur = size * 2 * twinkleIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};
