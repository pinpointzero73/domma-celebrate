import {drawBanshee} from './spooky-props-drawing.js';
import {drawPotOfGold, drawSmallGoldPot, drawRainbow} from './heritage-drawing.js';
import {drawMooningLeprechaun} from './mooning-drawing.js';
import {spawnMooningCharacter, updateMooningCharacter} from './mooning-antics.js';
import {drawLeprechaun, drawStaticLeprechaun} from './character-drawing.js';

/**
 * St Patrick's Day Theme for Domma Celebrations
 * (March 17th, Irish Celebration)
 *
 * Features:
 * - Falling shamrocks (3-leaf clovers)
 * - Golden coins floating
 * - Rainbow with pot of gold
 * - Leprechaun characters
 * - Irish harps and Celtic knots
 * - Green color scheme with gold accents
 */

export default {
  name: 'st-patricks',
  displayName: 'St Patrick\'s Day',
  emoji: '☘️',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 40,
      speedRange: [0.4, 1.2],
      sizeRange: [2, 4],
      pots: 1,
      mooningLeprechaunChance: 0.0005,
      leprechaunChance: 0.0003,
      twinklingStars: 10
    },
    medium: {
      count: 80,
      speedRange: [0.5, 1.5],
      sizeRange: [2, 5],
      pots: 2,
      mooningLeprechaunChance: 0.0005,
      leprechaunChance: 0.0005,
      twinklingStars: 18
    },
    heavy: {
      count: 120,
      speedRange: [0.6, 1.8],
      sizeRange: [3, 6],
      pots: 3,
      mooningLeprechaunChance: 0.0005,
      leprechaunChance: 0.0008,
      twinklingStars: 25
    }
  },

  particles: ['clover-petal', 'shamrock', 'gold-coin', 'sparkle'],
  decorations: ['pot-of-gold', 'rainbow', 'leprechaun', 'harp', 'static-leprechaun', 'moon', 'twinkling-star', 'mooning-leprechaun'],

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
    cloverPetal: { label: 'Clover petals', types: ['clover-petal'], kind: 'particle' },
    shamrock: { label: 'Shamrocks', types: ['shamrock'], kind: 'particle' },
    goldCoin: { label: 'Gold coins', types: ['gold-coin'], kind: 'particle' },
    sparkle: { label: 'Sparkles', types: ['sparkle'], kind: 'particle' },
    potOfGold: { label: 'Pots of gold', types: ['pot-of-gold'], count: 'pots' },
    twinklingStar: { label: 'Twinkling stars', types: ['twinkling-star'], count: 'twinklingStars' },
    mooningLeprechaun: {label: 'Mooning leprechaun', types: ['mooning-leprechaun'], chance: 'mooningLeprechaunChance', enabled: false},
    leprechaun: { label: 'Leprechauns', types: ['leprechaun', 'static-leprechaun'], chance: 'leprechaunChance' },
    rainbow: { label: 'Rainbow', types: ['rainbow'] },
    banshee: { label: 'Banshee', types: ['banshee'] },
    moon: { label: 'Moon', types: ['moon'] }
  },
  colors: {
    primary: '#228B22',    // Irish green
    secondary: '#90EE90',  // Light green
    white: '#FFFFFF',      // White (Irish flag)
    accent: '#FFD700',     // Gold
    rainbow: ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff']
  },

  /**
   * Create clover petal particle (simple green heart-shaped petal)
   */
  createCloverPetal(canvasWidth, canvasHeight, config) {
    const greenShades = ['#228B22', '#32CD32', '#90EE90', '#3CB371', '#2E8B57'];
    return {
      type: 'clover-petal',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),  // Horizontal drift
      size: (config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0])) * 1.5,  // Larger petals
      speed: (Math.random() - 0.5) * 0.2,  // Gentle vertical bobbing
      opacity: 0.75 + Math.random() * 0.25,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.025,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: greenShades[Math.floor(Math.random() * greenShades.length)],
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.02 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create shamrock particle (full 3-leaf clover - rare)
   */
  createShamrock(canvasWidth, canvasHeight, config) {
    const colorChoice = Math.random();
    let color, strokeColor;
    if (colorChoice < 0.5) {
      color = '#228B22';      // 50% green
      strokeColor = '#006400'; // Dark green
    } else if (colorChoice < 0.75) {
      color = '#FFFFFF';      // 25% white
      strokeColor = '#d0d0d0'; // Light grey
    } else {
      color = '#FFD700';      // 25% gold
      strokeColor = '#DAA520'; // Dark gold
    }

    return {
      type: 'shamrock',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.15,  // Gentle vertical bobbing
      opacity: 0.7 + Math.random() * 0.3,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.025,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: color,
      strokeColor: strokeColor,
      active: true
    };
  },

  /**
   * Create gold coin particle
   */
  createGoldCoin(canvasWidth, canvasHeight, config) {
    return {
      type: 'gold-coin',
      x: Math.random() * canvasWidth,  // Start throughout the scene
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.8,  // Horizontal drift
      size: 2 + Math.random() * 3,
      speed: (Math.random() - 0.5) * 0.1,  // Gentle vertical bobbing
      opacity: 0.9 + Math.random() * 0.1,
      rotation: 0,
      rotationSpeed: 0.05 + Math.random() * 0.1,
      spinPhase: Math.random() * Math.PI * 2,
      glintPhase: Math.random() * Math.PI * 2,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.01 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create pot of gold decoration
   */
  createPotOfGold(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'pot-of-gold',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2,
      y: options.y !== undefined ? options.y : canvasHeight - 40,
      size: 20 + Math.random() * 10,
      opacity: 1,
      glintPhase: Math.random() * Math.PI * 2,
      coins: [],
      active: true,
      static: true
    };
  },

  /**
   * Create rainbow decoration
   */
  createRainbow(canvasWidth, canvasHeight, potX, potY) {
    const rainbowStartX = 20; // Fixed start near left edge
    const rainbowEndX = potX; // End at pot position
    const centerX = (rainbowStartX + potX) / 2;
    const rainbowHeight = canvasHeight * 0.2;
    const centerY = potY - (rainbowHeight / 2);

    return {
      type: 'rainbow',
      x: centerX,
      y: centerY,
      startX: rainbowStartX,
      endX: rainbowEndX,
      endY: potY,
      width: canvasWidth,
      height: canvasHeight,
      opacity: 0.7,
      vx: 0,
      vy: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create sparkle particle (Irish sparkles)
   */
  createSparkle(canvasWidth, canvasHeight, config) {
    const colors = ['#FFD700', '#FFFFFF', '#228B22']; // Gold, white, green
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
   * Note: St. Patrick's Day particles drift horizontally (left-to-right), not vertically
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // 60% clover petals, 20% full shamrocks, 15% gold coins, 5% sparkles
    if (choice < 0.6) {
      return this.createCloverPetal(canvasWidth, canvasHeight, config);
    } else if (choice < 0.8) {
      return this.createShamrock(canvasWidth, canvasHeight, config);
    } else if (choice < 0.95) {
      return this.createGoldCoin(canvasWidth, canvasHeight, config);
    } else {
      return this.createSparkle(canvasWidth, canvasHeight, config);
    }
  },

  /**
   * Create initial static decorations (pots of gold with rainbows)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Green moon (top right corner)
    decorations.push({
      type: 'moon',
      x: canvasWidth - 120,
      y: 100,
      size: 60 + Math.random() * 20,
      opacity: 0.85,
      glowPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Create small corner rainbow with single pot of gold
    const rainbowStartX = 20;
    const rainbowEndX = 220; // Small 200px rainbow
    const potY = canvasHeight - 40;

    // Add single pot of gold at the right end of the rainbow
    decorations.push(this.createPotOfGold(canvasWidth, canvasHeight, {
        x: rainbowEndX,
        y: potY
    }));

    // Add small corner rainbow
    decorations.push(this.createRainbow(canvasWidth, canvasHeight, rainbowEndX, potY));

    // Add 1-2 static leprechauns
    const leprechaunCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < leprechaunCount; i++) {
      const x = 60 + Math.random() * (canvasWidth - 120);
      decorations.push({
        type: 'static-leprechaun',
        x: x,
        y: canvasHeight - 35,
        size: 12 + Math.random() * 4,
        opacity: 1,
        time: Math.random() * 1000,
        wavePhase: Math.random() * Math.PI * 2,
        active: true,
        static: true
      });
    }

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
   * Spawn special St Patrick's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const mooner = spawnMooningCharacter(specialParticles, canvasWidth, canvasHeight, config, 'mooning-leprechaun', 'mooningLeprechaunChance');
    if (mooner) return mooner;
    const choice = Math.random();

    // Leprechaun (very rare, max 1)
    if (choice < config.leprechaunChance) {
      if (specialParticles.some(p => p.type === 'leprechaun')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;

      // Calculate vx for 3-second crossing
      // Core physics: position updates by vx * normalizedDelta (≈1 per frame at 60fps)
      // Per second: vx * 60 pixels
      // For 3 seconds: vx = (canvasWidth + 100) / (3 * 60) = (canvasWidth + 100) / 180
      const baseSpeed = (canvasWidth + 100) / 180;

      const newLeprechaun = {
        type: 'leprechaun',
        x: fromLeft ? -50 : canvasWidth + 50,
        y: canvasHeight - 35,
        baseY: canvasHeight - 35,
        vx: fromLeft ? baseSpeed : -baseSpeed,
        vy: 0,
        size: 12 + Math.random() * 6,
        opacity: 1,
        time: 0,
        legPhase: Math.random() * Math.PI * 2,
        active: true,
        static: false
      };
      return newLeprechaun;
    }

    // Banshee (flying ghostly figure, rare, max 1)
    if (choice < config.leprechaunChance + 0.0003) {
      if (specialParticles.some(p => p.type === 'banshee')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'banshee',
        x: fromLeft ? -100 : canvasWidth + 100,
        y: Math.random() * (canvasHeight * 0.4) + 50,
        baseY: Math.random() * (canvasHeight * 0.4) + 50,
        vx: fromLeft ? 2 + Math.random() * 1 : -(2 + Math.random() * 1),
        size: 18 + Math.random() * 10,
        opacity: 0.6 + Math.random() * 0.2,
        waveAmplitude: 25 + Math.random() * 20,
        waveFrequency: 0.0015 + Math.random() * 0.002,
        waveOffset: Math.random() * Math.PI * 2,
        time: 0,
        wailPhase: Math.random() * Math.PI * 2,
        active: true,
        static: false
      };
    }

    // Pot of gold + rainbow (rare)
    if (choice < 0.001) {
      const potCount = specialParticles.filter(p => p.type === 'pot-of-gold').length;
      if (potCount < config.pots) {
        const pot = this.createPotOfGold(canvasWidth, canvasHeight);
        const rainbow = this.createRainbow(canvasWidth, canvasHeight, pot.x, pot.y);
        specialParticles.push(rainbow);
        return pot;
      }
    }

    return null;
  },

  /**
   * Update special particles (leprechauns, banshees)
   */
  updateSpecialParticles(specialParticles, deltaTime, canvasWidth, canvasHeight) {
    specialParticles.forEach(particle => {
      if (!particle.active) return;
      if (particle.type === 'mooning-leprechaun') {
        updateMooningCharacter(particle, deltaTime, canvasWidth);
        return;
      }

      if (particle.type === 'leprechaun' || particle.type === 'banshee') {
        // Only update time for animation - position is handled by core updateMovingParticle()
        particle.time += deltaTime;

        // Remove if off-screen
        if (particle.type === 'leprechaun') {
          if ((particle.vx > 0 && particle.x > canvasWidth + particle.size * 2) ||
            (particle.vx < 0 && particle.x < -particle.size * 2)) {
            particle.active = false;
          }
        } else if (particle.type === 'banshee') {
          if ((particle.vx > 0 && particle.x > canvasWidth + particle.size * 4) ||
            (particle.vx < 0 && particle.x < -particle.size * 4)) {
            particle.active = false;
          }
        }
      }

      // For static-leprechaun, only update internal time for idle animation
      if (particle.type === 'static-leprechaun') {
        particle.time += deltaTime;
      }
    });

    return specialParticles.filter(p => p.active);
  },

  /**
   * Draw clover petal (simple green heart-shaped petal)
   */
  drawCloverPetal(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Flutter effect (petal curling as it drifts)
    const flutter = Math.sin(time * particle.flutterSpeed + particle.flutter) * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation + flutter);

    // Clover petal is heart-shaped
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = '#006400'; // Dark green edge
    ctx.lineWidth = size * 0.08;

    ctx.beginPath();
    // Top curves (two rounded lobes forming a heart)
    ctx.moveTo(0, -size * 0.3);
    ctx.bezierCurveTo(
      -size * 0.6, -size * 0.7,
      -size * 0.8, -size * 0.3,
      -size * 0.5, size * 0.2
    );
    // Bottom point
    ctx.lineTo(0, size * 0.8);
    ctx.lineTo(size * 0.5, size * 0.2);
    // Right curve
    ctx.bezierCurveTo(
      size * 0.8, -size * 0.3,
      size * 0.6, -size * 0.7,
      0, -size * 0.3
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central vein
    ctx.strokeStyle = 'rgba(0, 100, 0, 0.4)';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.2);
    ctx.lineTo(0, size * 0.7);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw sparkle (Irish celebration sparkle)
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
   * Draw shamrock (3-leaf clover) - Irish colors
   */
  drawShamrock(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = particle.color || '#228B22';
    ctx.strokeStyle = particle.strokeColor || '#006400';
    ctx.lineWidth = size * 0.1;

    // Three heart-shaped leaves
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.7);

      // Heart-shaped leaf
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size * 0.3, -size * 0.6, 0, -size * 0.35);
      ctx.bezierCurveTo(size * 0.3, -size * 0.6, size * 0.5, -size * 0.2, 0, size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Stem
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size * 1.2);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw spinning gold coin
   */
  drawGoldCoin(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // 3D spin effect
    const spinWidth = Math.abs(Math.cos(particle.rotation)) * size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Coin body
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = size * 0.15;

    ctx.beginPath();
    ctx.ellipse(0, 0, spinWidth, size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glint
    if (spinWidth > size * 0.3) {
      const glintIntensity = (Math.sin(time * 0.005 + particle.glintPhase) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${glintIntensity * 0.6})`;
      ctx.beginPath();
      ctx.ellipse(-spinWidth * 0.3, -size * 0.3, spinWidth * 0.3, size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw pot of gold
   */
  drawPotOfGold,

  // Helper function to draw a small gold pot (similar to pot-of-gold but simpler)
  drawSmallGoldPot,


  /**
   * Draw rainbow
   */
  drawRainbow,

  /**
   * Draw leprechaun
   */
  drawLeprechaun,
  drawMooningLeprechaun,

  /**
   * Draw banshee (flying ghostly figure)
   */
  drawBanshee,

  /**
   * Draw green moon
   */
  drawMoon(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Moon body (Irish green tint)
    const moonGradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
    moonGradient.addColorStop(0, '#90EE90');    // Light green center
    moonGradient.addColorStop(0.5, '#7FD87F');  // Medium green
    moonGradient.addColorStop(1, '#5CB85C');    // Darker green edge
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Craters (darker green)
    ctx.fillStyle = 'rgba(60, 130, 60, 0.3)';
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.25, size * 0.1, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.1, -size * 0.4, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Shamrock silhouette on moon surface
    ctx.save();
    ctx.translate(size * 0.2, size * 0.35);
    ctx.scale(0.15, 0.15);
    ctx.fillStyle = 'rgba(34, 139, 34, 0.4)';
    // Three leaves
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.7);
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size * 0.3, -size * 0.6, 0, -size * 0.35);
      ctx.bezierCurveTo(size * 0.3, -size * 0.6, size * 0.5, -size * 0.2, 0, size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Green glow (pulsing)
    const glowIntensity = 0.3 + Math.sin(time * 0.002 + particle.glowPhase) * 0.15;
    ctx.globalAlpha = glowIntensity;
    const glowGradient = ctx.createRadialGradient(0, 0, size * 0.8, 0, 0, size * 1.8);
    glowGradient.addColorStop(0, 'rgba(144, 238, 144, 0.8)');
    glowGradient.addColorStop(0.5, 'rgba(144, 238, 144, 0.4)');
    glowGradient.addColorStop(1, 'rgba(144, 238, 144, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw static leprechaun (standing still)
   */
  drawStaticLeprechaun,

  /**
   * Draw twinkling star
   */
  drawTwinklingStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    const twinkleIntensity = 0.5 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;

    const starColor = `rgba(220, 255, 220, ${twinkleIntensity})`;
    const glowColor = `rgba(180, 255, 180, ${twinkleIntensity * 0.4})`;

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
        ctx.lineTo(outerX, innerY);
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
