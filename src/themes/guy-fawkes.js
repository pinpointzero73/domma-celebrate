import {drawBonfire, drawGuyEffigy, drawCatherineWheel, drawRomanCandle, drawSparklerBundle} from './bonfire-drawing.js';

/**
 * Guy Fawkes Night Theme for Domma Celebrations
 * (Bonfire Night - November 5th, UK)
 *
 * Features:
 * - Spectacular firework displays with multiple colors
 * - Animated bonfires with crackling flames and embers
 * - Rocket trails shooting upward before exploding
 * - Catherine wheels spinning with colorful sparks
 * - Roman candles shooting multiple bursts
 * - Guy Fawkes effigy silhouette
 * - Floating embers and ash particles
 * - Dark night sky with dramatic pyrotechnics
 */

// Import firework functions from Christmas theme (reusable!)
import christmas from './christmas.js';

export default {
  name: 'guy-fawkes',
  displayName: 'Guy Fawkes Night',
  emoji: '🎆',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 60,
      initialParticleRatio: 0.25,  // Start with 25% of particles (15), build up to full count
      speedRange: [0.5, 1.5],
      sizeRange: [2, 4],
      bonfires: 1,
      fireworkChance: 0.0009,   // ~1 firework every 18 seconds
      rocketChance: 0.0007,
      burstChance: 0.0012
    },
    medium: {
      count: 120,
      initialParticleRatio: 0.25,  // Start with 25% of particles (30), build up to full count
      speedRange: [0.5, 2.0],
      sizeRange: [2, 5],
      bonfires: 2,
      fireworkChance: 0.0011,   // ~1 firework every 15 seconds
      rocketChance: 0.0009,
      burstChance: 0.0015
    },
    heavy: {
      count: 200,
      initialParticleRatio: 0.25,  // Start with 25% of particles (50), build up to full count
      speedRange: [0.5, 2.5],
      sizeRange: [3, 6],
      bonfires: 3,
      fireworkChance: 0.0014,   // ~1 firework every 12 seconds
      rocketChance: 0.0012,
      burstChance: 0.0018
    }
  },

  particles: ['ember', 'firework', 'spark', 'rocket', 'burst', 'trail'],
  decorations: ['bonfire', 'guy-effigy', 'catherine-wheel', 'roman-candle', 'sparkler-bundle', 'moon'],

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
    ember: { label: 'Embers', types: ['ember'], kind: 'particle' },
    spark: { label: 'Sparks', types: ['spark', 'trail'], kind: 'particle' },
    bonfire: { label: 'Bonfires', types: ['bonfire'], count: 'bonfires' },
    guyEffigy: { label: 'Guy effigies', types: ['guy-effigy'] },
    catherineWheel: { label: 'Catherine wheels', types: ['catherine-wheel'] },
    romanCandle: { label: 'Roman candles', types: ['roman-candle'] },
    sparklerBundle: { label: 'Sparklers', types: ['sparkler-bundle'] },
    firework: { label: 'Fireworks', types: ['firework'], chance: 'fireworkChance' },
    rocket: { label: 'Rockets', types: ['rocket'], chance: 'rocketChance' },
    burst: { label: 'Bursts', types: ['burst'], chance: 'burstChance' },
    moon: { label: 'Moon', types: ['moon'] },
    lightning: { label: 'Lightning', global: true }
  },
  colors: {
    primary: '#ff4500',    // Orange-red flames
    secondary: '#ffd700',  // Gold sparks
    accent: '#8b0000',     // Deep red
    fire: ['#ff4500', '#ffa500', '#ffff00', '#ff0000'], // Flame colors
    firework: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff']
  },

  // Lightning effect properties
  lightningChance: 0.0005, // 0.05% chance per frame to strike
  lightningDuration: 200, // Lightning flash lasts 200ms
  lightningTimer: 0,
  lightningActive: false,
  lightningColor: '#fefefe', // Bright white/blue flash

  /**
   * Draw a procedurally generated lightning bolt
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {number} segments - Number of segments for the bolt (controls detail)
   * @param {number} displacement - Max displacement for forks
   * @param {number} roughness - How jagged the line is
   * @param {number} branchChance - Probability of branching
   * @param {number} lineWidth - Base line width
   * @param {string} color - Color of the lightning
   */
  drawLightning(ctx, x1, y1, x2, y2, segments, displacement, roughness, branchChance, lineWidth, color) {
    if (segments < 1) {
      return;
    }

    const midpointX = (x1 + x2) / 2;
    const midpointY = (y1 + y2) / 2;

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpendicularAngle = angle + Math.PI / 2;

    const offset = (Math.random() - 0.5) * displacement;
    const newMidpointX = midpointX + Math.cos(perpendicularAngle) * offset;
    const newMidpointY = midpointY + Math.sin(perpendicularAngle) * offset;

    const newSegments = segments - 1;
    const newDisplacement = displacement * roughness;
    const newLineWidth = lineWidth * 0.8;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw main segment
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(newMidpointX, newMidpointY);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Recursive call for sub-segments
    if (newSegments > 0) {
      this.drawLightning(ctx, x1, y1, newMidpointX, newMidpointY, newSegments, newDisplacement, roughness, branchChance, newLineWidth, color);
      this.drawLightning(ctx, newMidpointX, newMidpointY, x2, y2, newSegments, newDisplacement, roughness, branchChance, newLineWidth, color);

      // Create a fork
      if (Math.random() < branchChance && newSegments > 1) {
        const forkLength = Math.random() * displacement * 0.5;
        const forkAngle = (Math.random() - 0.5) * Math.PI / 3; // Max 60 degree deviation
        const forkX = newMidpointX + Math.cos(angle + forkAngle) * forkLength;
        const forkY = newMidpointY + Math.sin(angle + forkAngle) * forkLength;
        this.drawLightning(ctx, newMidpointX, newMidpointY, forkX, forkY, newSegments - 1, newDisplacement * 0.5, roughness, branchChance * 0.5, newLineWidth * 0.6, color);
      }
    }
  },

  /**
   * Create rising ember particle that will explode
   */
  createEmber(canvasWidth, canvasHeight, config) {
    // Ensure config has required properties with defaults
    const sizeRange = config?.sizeRange || [2, 4];
    const speedRange = config?.speedRange || [0.5, 1.5];

    const emberColors = this.colors.firework;
    const startX = Math.random() * canvasWidth;
    const startY = canvasHeight - 50; // Start near bottom
    const targetY = 100 + Math.random() * 300; // Explode at random height

    return {
      type: 'ember',
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 1.5, // Horizontal drift
      vy: -2 - Math.random() * 2, // Upward velocity
      targetY: targetY,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
      opacity: 1,
      color: emberColors[Math.floor(Math.random() * emberColors.length)],
      trailColor: emberColors[Math.floor(Math.random() * emberColors.length)],
      glowPhase: Math.random() * Math.PI * 2,
      exploded: false,
      explosionParticles: [],
      active: true
    };
  },

  /**
   * Create bonfire decoration
   */
  createBonfire(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'bonfire',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2,
      y: options.y !== undefined ? options.y : canvasHeight - 60,
      size: 30 + Math.random() * 20,
      opacity: 1,
      flames: [],
      logs: [],
      embers: [],
      time: 0,
      cracklePhase: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create Guy Fawkes effigy (on bonfire)
   */
  createGuyEffigy(canvasWidth, canvasHeight, bonfireX, bonfireY) {
    return {
      type: 'guy-effigy',
      x: bonfireX,
      y: bonfireY - 50,
      size: 20 + Math.random() * 10,
      opacity: 0.8,
      burning: false,
      burnProgress: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create Catherine wheel (spinning firework)
   */
  createCatherineWheel(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'catherine-wheel',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : 100 + Math.random() * 200,
      size: 15 + Math.random() * 10,
      opacity: 1,
      rotation: 0,
      rotationSpeed: 0.05 + Math.random() * 0.1,
      sparks: [], // Keep this for internal spark management
      sparkTimer: 0, // New: timer for emitting sparks
      sparkInterval: 50, // New: emit sparks every 50ms
      time: 0,
      duration: 5000 + Math.random() * 3000,
      active: true,
      static: true
    };
  },

  /**
   * Create Roman candle (shoots bursts upward)
   */
  createRomanCandle(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'roman-candle',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 30,
      size: 8 + Math.random() * 4,
      opacity: 1,
      shots: [],
      shotInterval: 800 + Math.random() * 400,
      lastShotTime: 0,
      shotCount: 0,
      maxShots: 5 + Math.floor(Math.random() * 5),
      time: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create rocket particle (shoots up then explodes)
   */
  createRocket(canvasWidth, canvasHeight, config) {
    const sizeRange = config?.sizeRange || [2, 4];
    const startX = 50 + Math.random() * (canvasWidth - 100);
    const targetY = 80 + Math.random() * 150; // Explode in upper third

    return {
      type: 'rocket',
      x: startX,
      y: canvasHeight - 20,
      vx: (Math.random() - 0.5) * 0.5, // Slight drift
      vy: -3 - Math.random() * 2, // Fast upward
      targetY: targetY,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      opacity: 1,
      color: this.colors.firework[Math.floor(Math.random() * this.colors.firework.length)],
      trail: [], // Trail particles behind rocket
      exploded: false,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      active: true
    };
  },

  /**
   * Create burst particle (explosion fragment)
   */
  createBurst(canvasWidth, canvasHeight, config, origin) {
    const sizeRange = config?.sizeRange || [1, 3];
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;

    return {
      type: 'burst',
      x: origin?.x || canvasWidth / 2,
      y: origin?.y || canvasHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      opacity: 1,
      color: this.colors.firework[Math.floor(Math.random() * this.colors.firework.length)],
      life: 1.0, // Fades out over time
      fadeRate: 0.015 + Math.random() * 0.015,
      gravity: 0.05,
      sparkle: Math.random() < 0.3, // 30% chance to sparkle
      active: true
    };
  },

  /**
   * Create trail particle (follows rockets)
   */
  createTrail(canvasWidth, canvasHeight, config, origin) {
    const sizeRange = config?.sizeRange || [1, 2];

    return {
      type: 'trail',
      x: origin?.x || canvasWidth / 2,
      y: origin?.y || canvasHeight / 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      opacity: 0.8,
      color: origin?.color || '#ffd700',
      life: 1.0,
      fadeRate: 0.03 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create spark particle (small glowing bits)
   */
  createSpark(canvasWidth, canvasHeight, config, origin) {
    const sizeRange = config?.sizeRange || [0.5, 1.5];
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;

    return {
      type: 'spark',
      x: origin?.x || Math.random() * canvasWidth,
      y: origin?.y || Math.random() * canvasHeight,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      opacity: 1,
      color: this.colors.secondary, // Gold sparks
      life: 1.0,
      fadeRate: 0.02 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create falling particle (embers)
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    return this.createEmber(canvasWidth, canvasHeight, config);
  },

  /**
   * Create initial static decorations (bonfires, Guy effigy, etc.)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Create bonfires
    const bonfireCount = config.bonfires || 2;
    for (let i = 0; i < bonfireCount; i++) {
      const bonfireX = (canvasWidth / (bonfireCount + 1)) * (i + 1);
      const bonfireY = canvasHeight - 60;

      decorations.push(this.createBonfire(canvasWidth, canvasHeight, {
        x: bonfireX,
        y: bonfireY
      }));

      // Guy effigy on top of bonfire
      decorations.push(this.createGuyEffigy(canvasWidth, canvasHeight, bonfireX, bonfireY));
    }

    // Catherine wheels mounted on sides
    const wheelCount = Math.min(bonfireCount, 2);
    for (let i = 0; i < wheelCount; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      decorations.push(this.createCatherineWheel(canvasWidth, canvasHeight, {
        x: side === 'left' ? 100 : canvasWidth - 100,
        y: 150 + i * 100
      }));
    }

    // Roman candles at ground level
    const candleCount = Math.min(bonfireCount, 2);
    for (let i = 0; i < candleCount; i++) {
      decorations.push(this.createRomanCandle(canvasWidth, canvasHeight, {
        x: 150 + i * ((canvasWidth - 300) / (candleCount)),
        y: canvasHeight - 30
      }));
    }

    // Sparkler bundles (decorative)
    const sparklerCount = Math.min(bonfireCount + 1, 3);
    for (let i = 0; i < sparklerCount; i++) {
      decorations.push({
        type: 'sparkler-bundle',
        x: 80 + i * ((canvasWidth - 160) / (sparklerCount - 1)),
        y: canvasHeight - 20,
        size: 12 + Math.random() * 4,
        opacity: 0.85,
        sparklePhase: Math.random() * Math.PI * 2,
        active: true,
        static: true
      });
    }

    // Soft red moon (top right corner)
    decorations.push({
      type: 'moon',
      x: canvasWidth - 120,
      y: 100,
      size: 60 + Math.random() * 20,
      opacity: 0.75,
      glowPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    return decorations;
  },

  /**
   * Spawn special Guy Fawkes particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Fireworks (uses Christmas firework code!)
    if (choice < config.fireworkChance) {
      // Random explosion height between 20% and 70% of screen height (always visible)
      const targetY = canvasHeight * (0.2 + Math.random() * 0.5);
      const startY = canvasHeight;
      const distance = startY - targetY;

      // Calculate velocity to reach target in reasonable time
      const flightTime = 40 + Math.random() * 20; // 40-60 frames (~0.7-1 second)
      const vy = -(distance / flightTime);

      return {
        type: 'firework',
        x: Math.random() * canvasWidth,
        y: startY,
        targetY: targetY, // Explosion height
        vx: (Math.random() - 0.5) * 3, // Slight horizontal drift
        vy: vy, // Calculated to reach target
        size: 2 + Math.random() * 2,
        opacity: 1,
        active: true,
        static: false,
        time: 0,
        exploded: false,
        explosionTime: flightTime, // Time to reach target
        color: this.colors.firework[Math.floor(Math.random() * this.colors.firework.length)]
      };
    }

    // Bonfire (rare, max 3)
    if (choice < 0.0003) {
      const bonfireCount = specialParticles.filter(p => p.type === 'bonfire').length;
      if (bonfireCount < config.bonfires) {
        return this.createBonfire(canvasWidth, canvasHeight);
      }
    }

    // Catherine wheel (rare)
    if (choice < 0.0005) {
      return this.createCatherineWheel(canvasWidth, canvasHeight);
    }

    // Roman candle (rare)
    if (choice < 0.0008) {
      return this.createRomanCandle(canvasWidth, canvasHeight);
    }

    return null;
  },

  /**
   * Update special particles (fireworks, sparks, etc.)
   */
  updateSpecialParticles(specialParticles, deltaTime) {
    // Update lightning effect
    if (this.lightningActive) {
      this.lightningTimer += deltaTime;
      if (this.lightningTimer >= this.lightningDuration) {
        this.lightningActive = false;
        this.lightningTimer = 0;
      }
    } else {
      if (Math.random() < this.lightningChance) {
        this.lightningActive = true;
        this.lightningTimer = 0;
      }
    }

    for (const particle of specialParticles) {
      // Increment time for animated particles
      if (particle.time !== undefined) {
        particle.time++;
      }

      // Check firework explosion
      if (particle.type === 'firework' && !particle.exploded) {
        // Explode when reached target height OR after flight time
        const reachedTarget = particle.targetY && particle.y <= particle.targetY;
        const timeExpired = particle.time >= particle.explosionTime;

        if (reachedTarget || timeExpired) {
          particle.exploded = true;
          this.explodeFirework(particle, specialParticles);
          particle.active = false; // Remove the firework itself
        }
      }

      // Fade out sparks
      if (particle.type === 'spark') {
        particle.opacity -= 0.015;
        particle.vy += 0.15; // Gravity
        if (particle.opacity <= 0) {
          particle.active = false;
        }
      }

      // Update Catherine Wheel
      if (particle.type === 'catherine-wheel') {
        particle.rotation += particle.rotationSpeed * (deltaTime / 16); // Normalize rotation speed
        particle.time += deltaTime;

        // Deactivate after duration
        if (particle.time > particle.duration) {
          particle.active = false;
        }

        // Emit new sparks
        particle.sparkTimer += deltaTime;
        if (particle.sparkTimer >= particle.sparkInterval) {
          particle.sparkTimer = 0;
          // Emit multiple sparks per interval
          const numSparks = 2 + Math.floor(Math.random() * 3); // 2-4 sparks
          for (let i = 0; i < numSparks; i++) {
            const angle = Math.random() * Math.PI * 2; // Random direction
            const speed = 1 + Math.random() * 3;
            particle.sparks.push({
              x: 0, // Relative to wheel center
              y: 0, // Relative to wheel center
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 1 + Math.random() * 1.5,
              opacity: 1,
              life: 1.0,
              fadeRate: 0.05 + Math.random() * 0.03,
              color: this.colors.firework[Math.floor(Math.random() * this.colors.firework.length)]
            });
          }
        }

        // Update existing sparks
        particle.sparks = particle.sparks.filter(spark => {
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.life -= spark.fadeRate;
          spark.opacity = Math.max(0, spark.life);
          return spark.life > 0;
        });
      }
    }
  },

  /**
   * Draw floating ember
   */
  drawEmber(ctx, particle, time) {
    // Safety check: validate particle properties
    if (!isFinite(particle.x) || !isFinite(particle.y) || !isFinite(particle.size) ||
        !isFinite(particle.vx) || !isFinite(particle.vy)) {
      console.warn('[Guy Fawkes] Invalid ember particle values, deactivating:', particle);
      particle.active = false;
      return;
    }

    // Update physics - rising motion
    if (!particle.exploded) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.02; // Slight gravity

      // Validate after update
      if (!isFinite(particle.x) || !isFinite(particle.y)) {
        console.warn('[Guy Fawkes] Ember particle became non-finite after update, deactivating');
        particle.active = false;
        return;
      }

      // Check if reached target height
      if (particle.y <= particle.targetY) {
        particle.exploded = true;
        // Create DRAMATIC explosion particles (MORE and BIGGER!)
        const explosionCount = 50 + Math.floor(Math.random() * 40); // 50-90 particles
        for (let i = 0; i < explosionCount; i++) {
          const angle = (i / explosionCount) * Math.PI * 2;
          const speed = 2 + Math.random() * 5; // Faster spread
          const isTracer = i % 5 === 0; // Every 5th particle is a bright tracer
          particle.explosionParticles.push({
            x: particle.x,
            y: particle.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: isTracer ? 2 + Math.random() * 2 : 0.8 + Math.random() * 2, // Bigger particles
            color: isTracer ? '#ffffff' : this.colors.firework[Math.floor(Math.random() * this.colors.firework.length)],
            opacity: 1,
            life: 1.0,
            trail: [] // Add trail for tracer particles
          });
        }
      }
    }

    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();

    if (!particle.exploded) {
      // Rising ember with trail
      const glowIntensity = 0.8 + (Math.sin(time * 0.01 + particle.glowPhase) + 1) * 0.2;

      // Trail
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = particle.trailColor;
      ctx.lineWidth = size * 0.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - particle.vx * 5, y - particle.vy * 5);
      ctx.stroke();

      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(0.5, `${particle.color}80`);
      gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
      ctx.globalAlpha = glowIntensity;
      ctx.fillStyle = gradient;
      ctx.fillRect(x - size * 4, y - size * 4, size * 8, size * 8);

      // Core
      ctx.globalAlpha = 1;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = size * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw explosion particles
      particle.explosionParticles = particle.explosionParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravity on explosion particles
        p.life -= 0.015;
        p.opacity = p.life;

        if (p.life <= 0) return false;

        // Draw explosion particle
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Deactivate when all explosion particles are gone
      if (particle.explosionParticles.length === 0) {
        particle.active = false;
      }
    }

    ctx.restore();
  },

  /**
   * Draw bonfire with animated flames
   */
  drawBonfire,

  /**
   * Draw Guy Fawkes effigy
   */
  drawGuyEffigy,

  /**
   * Draw Catherine wheel (spinning firework) - IMPROVED
   */
  drawCatherineWheel,

  /**
   * Draw Roman candle
   */
  drawRomanCandle,

  /**
   * Draw sparkler bundle (decorative handheld fireworks)
   */
  drawSparklerBundle,

  /**
   * Draw firework (reuses Christmas firework code)
   */
  drawFirework(ctx, particle) {
    return christmas.drawFirework(ctx, particle);
  },

  /**
   * Explode firework (reuses Christmas explosion code)
   */
  explodeFirework(particle, specialParticles) {
    // Use themed colors instead of Christmas colors
    const sparkCount = 60 + Math.random() * 60;
    const colors = this.colors.firework;

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      specialParticles.push({
        type: 'spark',
        x: particle.x,
        y: particle.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        opacity: 1,
        active: true,
        static: false,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    }
  },

  /**
   * Draw soft red moon (Bonfire Night atmosphere)
   */
  drawMoon(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Moon body (soft red/orange tint)
    const moonGradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
    moonGradient.addColorStop(0, '#ffb6a0');    // Soft peachy center
    moonGradient.addColorStop(0.5, '#ff8c66');  // Warm orange-red
    moonGradient.addColorStop(1, '#cc6644');    // Deeper red edge
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Craters (darker red)
    ctx.fillStyle = 'rgba(120, 50, 40, 0.25)';
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.25, size * 0.1, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.1, -size * 0.4, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Soft smoke wisps drifting across moon surface
    ctx.strokeStyle = 'rgba(100, 60, 50, 0.15)';
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';
    const smokeWave = Math.sin(time * 0.001 + particle.glowPhase) * size * 0.3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yPos = -size * 0.4 + i * size * 0.4;
      ctx.moveTo(-size * 0.8, yPos + smokeWave * (i % 2 === 0 ? 1 : -1));
      ctx.bezierCurveTo(
        -size * 0.3, yPos + smokeWave * 0.5,
        size * 0.3, yPos - smokeWave * 0.5,
        size * 0.8, yPos + smokeWave * (i % 2 === 0 ? -1 : 1)
      );
      ctx.stroke();
    }

    // Soft red glow (pulsing gently)
    const glowIntensity = 0.25 + Math.sin(time * 0.0015 + particle.glowPhase) * 0.1;
    ctx.globalAlpha = glowIntensity;
    const glowGradient = ctx.createRadialGradient(0, 0, size * 0.8, 0, 0, size * 2.0);
    glowGradient.addColorStop(0, 'rgba(255, 140, 100, 0.6)');
    glowGradient.addColorStop(0.5, 'rgba(255, 100, 80, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 80, 60, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw rocket particle (shoots up with trail, then explodes)
   */
  drawRocket(ctx, particle, time) {
    ctx.save();

    if (!particle.exploded) {
      // Update physics - upward flight
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;

      // Check if reached target explosion height
      if (particle.y <= particle.targetY) {
        particle.exploded = true;

        // Create MASSIVE explosion - more burst particles than embers!
        const explosionCount = 80 + Math.floor(Math.random() * 60); // 80-140 particles!
        particle.explosionParticles = [];

        for (let i = 0; i < explosionCount; i++) {
          const angle = (i / explosionCount) * Math.PI * 2;
          const speed = 2 + Math.random() * 6; // Fast explosive spread
          const isTracer = i % 6 === 0; // Every 6th particle is bright tracer

          particle.explosionParticles.push({
            x: particle.x,
            y: particle.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: isTracer ? 2.5 + Math.random() * 2 : 1 + Math.random() * 2,
            color: isTracer ? '#ffffff' : this.colors.firework[Math.floor(Math.random() * this.colors.firework.length)],
            opacity: 1,
            life: 1.0,
            gravity: 0.05,
            sparkle: Math.random() < 0.3
          });
        }
      }

      const x = particle.x;
      const y = particle.y;
      const size = particle.size;

      // Draw rocket trail
      const trailLength = 15;
      ctx.globalAlpha = 0.6;
      const trailGradient = ctx.createLinearGradient(x, y, x - particle.vx * trailLength, y - particle.vy * trailLength);
      trailGradient.addColorStop(0, particle.color);
      trailGradient.addColorStop(0.5, `${particle.color}80`);
      trailGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
      ctx.strokeStyle = trailGradient;
      ctx.lineWidth = size * 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - particle.vx * trailLength, y - particle.vy * trailLength);
      ctx.stroke();

      // Rocket glow
      ctx.globalAlpha = 0.8;
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
      glowGradient.addColorStop(0, particle.color);
      glowGradient.addColorStop(0.5, `${particle.color}60`);
      glowGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(x - size * 5, y - size * 5, size * 10, size * 10);

      // Rocket core (bright white-hot center)
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = size * 3;
      ctx.beginPath();
      ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Outer colored ring
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = size * 2;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw explosion particles (similar to ember explosions)
      particle.explosionParticles = particle.explosionParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity; // Gravity pulls down
        p.life -= 0.012; // Faster fade than embers for dramatic effect
        p.opacity = p.life;

        if (p.life <= 0) return false;

        // Draw explosion particle with glow
        ctx.globalAlpha = p.opacity * 0.6;
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glowGradient.addColorStop(0, p.color);
        glowGradient.addColorStop(0.5, `${p.color}60`);
        glowGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);

        // Core
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 3;

        // Sparkle effect
        if (p.sparkle && Math.random() < 0.3) {
          ctx.shadowBlur = p.size * 5;
          ctx.fillStyle = '#ffffff';
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Deactivate rocket when all explosion particles are gone
      if (particle.explosionParticles.length === 0) {
        particle.active = false;
      }
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw burst particle (explosion fragment)
   */
  drawBurst(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();

    // Update physics
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity; // Gravity pulls down
    particle.life -= particle.fadeRate;
    particle.opacity = Math.max(0, particle.life);

    // Deactivate when faded out
    if (particle.life <= 0) {
      particle.active = false;
      ctx.restore();
      return;
    }

    // Glow effect
    ctx.globalAlpha = particle.opacity * 0.6;
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
    glowGradient.addColorStop(0, particle.color);
    glowGradient.addColorStop(0.5, `${particle.color}60`);
    glowGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x - size * 4, y - size * 4, size * 8, size * 8);

    // Core particle
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 2;

    // Sparkle effect (randomly brighter)
    if (particle.sparkle && Math.random() < 0.3) {
      ctx.shadowBlur = size * 4;
      ctx.fillStyle = '#ffffff';
    }

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw trail particle (follows rockets)
   */
  drawTrail(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();

    // Update physics
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= particle.fadeRate;
    particle.opacity = Math.max(0, particle.life * 0.8);

    // Deactivate when faded out
    if (particle.life <= 0) {
      particle.active = false;
      ctx.restore();
      return;
    }

    // Glow
    ctx.globalAlpha = particle.opacity * 0.4;
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    glowGradient.addColorStop(0, particle.color);
    glowGradient.addColorStop(0.6, `${particle.color}40`);
    glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);

    // Core
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw spark particle (small glowing bits)
   */
  drawSpark(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();

    // Update physics
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= particle.fadeRate;
    particle.opacity = Math.max(0, particle.life);

    // Deactivate when faded out
    if (particle.life <= 0) {
      particle.active = false;
      ctx.restore();
      return;
    }

    // Glow
    ctx.globalAlpha = particle.opacity * 0.5;
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    glowGradient.addColorStop(0, particle.color);
    glowGradient.addColorStop(0.5, `${particle.color}60`);
    glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);

    // Core (very small, bright gold)
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 2;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw global theme effects (e.g., lightning)
   */
  drawGlobalEffects(ctx, currentTime, canvasWidth, canvasHeight) {
    if (this.lightningActive) {
      ctx.save();
      ctx.globalAlpha = 0.8 + Math.sin(this.lightningTimer * 0.01) * 0.2; // Pulsing effect during flash
      ctx.shadowColor = this.lightningColor;
      ctx.shadowBlur = 20;

      // Draw main lightning bolt from top-center to random bottom position
      const startX = canvasWidth * (0.4 + Math.random() * 0.2); // Top middle
      const startY = 0;
      const endX = canvasWidth * Math.random();
      const endY = canvasHeight;

      this.drawLightning(
        ctx,
        startX,
        startY,
        endX,
        endY,
        5 + Math.floor(Math.random() * 3), // 5-7 segments
        50 + Math.random() * 50, // 50-100 displacement
        0.7, // Roughness
        0.3, // Branch chance
        3 + Math.random() * 2, // Line width
        this.lightningColor
      );

      ctx.restore();
    }
  }
};
