/**
 * Christmas Theme for Domma Celebrations
 *
 * Features:
 * - 6-pointed crystalline snowflakes with rotation and depth layers
 * - Decorated Christmas trees with twinkling lights, baubles, tinsel, and gold star
 * - Christmas wreaths with bows and ornaments
 * - Santa's sleigh with 5 reindeer (including Rudolph with glowing red nose)
 * - Smooth sine wave flight motion for sleigh
 * - Christmas Steam Train with animated smoke, carriages, decorations
 * - Walking elves in green costumes
 * - Robins with Santa hats doing swoop flights
 * - Festive fireworks
 * - Wind gusts and realistic physics simulation
 * - Mobile-responsive particle reduction
 */

import { createParticle } from './../core/particles.js';
import { drawSleigh, drawTrain } from './christmas-vehicles.js';
import { drawTree, drawWreath, drawRobin, drawElf, drawSnowman, TREE_GIFTS } from './christmas-festive.js';
import { spawnElfAntic, updateElfAntic } from './christmas-antics.js';

export default {
  name: 'christmas',
  displayName: 'Christmas',
  emoji: '🎄',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 50,
      speedRange: [0.5, 1.5],
      sizeRange: [1, 3],
      peeingElfChance: 0.0007,
      thievingElfChance: 0.001,
      trees: 3,
      wreaths: 2,
      northStars: 1,
      snowmen: 2
    },
    medium: {
      count: 150,
      speedRange: [0.8, 2.5],
      sizeRange: [1, 4],
      peeingElfChance: 0.0007,
      thievingElfChance: 0.001,
      trees: 6,
      wreaths: 3,
      northStars: 1,
      snowmen: 3
    },
    heavy: {
      count: 300,
      speedRange: [1.0, 3.5],
      sizeRange: [1, 5],
      peeingElfChance: 0.0007,
      thievingElfChance: 0.001,
      trees: 10,
      wreaths: 4,
      northStars: 1,
      snowmen: 4
    }
  },

  particles: ['snowflake'],
  decorations: ['tree', 'wreath', 'sleigh', 'robin', 'train', 'elf', 'firework', 'north-star', 'snowman', 'peeing-elf', 'thieving-elf'],

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
    snowflake: { label: 'Snowflakes', types: ['snowflake'], kind: 'particle' },
    tree: { label: 'Christmas trees', types: ['tree'], count: 'trees' },
    wreath: { label: 'Wreaths', types: ['wreath'], count: 'wreaths' },
    snowman: { label: 'Snowmen', types: ['snowman'], count: 'snowmen' },
    northStar: { label: 'North star', types: ['north-star'], count: 'northStars' },
    sleigh: { label: "Santa's sleigh", types: ['sleigh'] },
    robin: { label: 'Robins', types: ['robin'] },
    train: { label: 'Steam train', types: ['train'] },
    elf: { label: 'Elves', types: ['elf'] },
    peeingElf: { label: 'Peeing elf', types: ['peeing-elf'], chance: 'peeingElfChance', enabled: false },
    thievingElf: { label: 'Thieving elf', types: ['thieving-elf'], chance: 'thievingElfChance', enabled: false },
    firework: { label: 'Fireworks', types: ['firework', 'spark'] }
  },
  colors: {
    primary: '#ffffff',    // Snow white
    secondary: '#228B22',  // Forest green
    accent: '#c00',        // Christmas red
    gold: '#FFD700'        // Gold star/trim
  },

  /**
   * Create a snowflake particle
   */
  createSnowflakeParticle(canvasWidth, canvasHeight, config) {
    const particle = createParticle(config, canvasWidth, canvasHeight);
    particle.type = 'snowflake';
    return particle;
  },

  /**
   * Create falling particle (snowflakes)
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    return this.createSnowflakeParticle(canvasWidth, canvasHeight, config);
  },

  /**
   * Create Christmas tree decoration
   */
  createTree(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'tree',
      gifts: TREE_GIFTS.map(gift => ({ ...gift, stolen: false, reserved: false })),
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : Math.random() * canvasHeight,
      vx: 0,
      vy: 0,
      size: 20 + Math.random() * 15,
      opacity: 0.6 + Math.random() * 0.3,
      rotation: 0,
      rotationSpeed: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create Christmas wreath decoration
   */
  createWreath(canvasWidth, canvasHeight, options = {}) {
    // Generate the wreath's shape data once
    const wreathShape = [];
    const segments = 20;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      wreathShape.push({
        angle: angle,
        radius: 0.9 + Math.random() * 0.2,
        thickness: 0.2 + Math.random() * 0.15,
        color: i % 2 === 0 ? '#1a6b1a' : '#228B22'
      });
    }

    return {
      type: 'wreath',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : Math.random() * canvasHeight,
      vx: 0,
      vy: 0,
      size: 15 + Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.2,
      rotation: 0,
      rotationSpeed: 0,
      active: true,
      static: true,
      shape: wreathShape
    };
  },

  /**
   * Create North Star (Star of Bethlehem) decoration
   */
  createNorthStar(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'north-star',
      x: options.x !== undefined ? options.x : canvasWidth / 2,  // Center by default
      y: options.y !== undefined ? options.y : 80,  // Top of screen by default
      vx: 0,
      vy: 0,
      size: 25,  // Fixed size for prominence
      opacity: 1.0,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003,  // Extremely slow, barely noticeable twinkle
      active: true,
      static: true
    };
  },

  /**
   * Create snowman decoration
   */
  createSnowman(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'snowman',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 50,
      vx: 0,
      vy: 0,
      size: 15 + Math.random() * 10,
      opacity: 1.0,
      time: Math.random() * 1000,
      wavePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations (trees, wreaths, and North Stars)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Create trees
    const treeCount = config.trees || 6;
    for (let i = 0; i < treeCount; i++) {
      decorations.push(this.createTree(canvasWidth, canvasHeight, {
        x: (canvasWidth / (treeCount + 1)) * (i + 1),
        y: canvasHeight - 60 - Math.random() * 20
      }));
    }

    // Create wreaths
    const wreathCount = config.wreaths || 3;
    for (let i = 0; i < wreathCount; i++) {
      decorations.push(this.createWreath(canvasWidth, canvasHeight, {
        x: (canvasWidth / (wreathCount + 1)) * (i + 1),
        y: 50 + Math.random() * 100
      }));
    }

    // Create North Star (Star of Bethlehem) - single centered star
    if (config.northStars) {
      decorations.push(this.createNorthStar(canvasWidth, canvasHeight, {
        x: canvasWidth / 2,
        y: 60
      }));
    }

    // Create snowmen
    const snowmanCount = config.snowmen || 3;
    for (let i = 0; i < snowmanCount; i++) {
      decorations.push(this.createSnowman(canvasWidth, canvasHeight, {
        x: (canvasWidth / (snowmanCount + 1)) * (i + 1),
        y: canvasHeight - 50 - Math.random() * 10
      }));
    }

    return decorations;
  },

  /**
   * Spawn special particles with configurable probability
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config = {}) {
    const antic = spawnElfAntic(specialParticles, canvasWidth, canvasHeight, config);
    if (antic) return antic;
    const choice = Math.random();

    // Santa's sleigh (0.05% chance, max 1)
    if (choice < 0.0005) {
      if (specialParticles.some(p => p.type === 'sleigh')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -100 : canvasWidth + 100;
      const baseY = 100 + Math.random() * (canvasHeight * 0.3);
      return {
        type: 'sleigh',
        x: startX,
        startX: startX,           // Store starting X for arc calculation
        y: baseY,
        baseY: baseY,
        targetX: fromLeft ? canvasWidth + 100 : -100, // Store target X
        canvasWidth: canvasWidth, // Store canvas width for arc calculation
        vx: fromLeft ? 3 + Math.random() * 2 : -(3 + Math.random() * 2),
        vy: 0,
        arcHeight: 150 + Math.random() * 100, // Height of the arc
        time: 0,
        size: 15 + Math.random() * 10,
        opacity: 0.9,
        rotation: 0,
        active: true,
        static: false
      };
    } else if (choice < 0.0013) { // Elf (0.08% chance) - Sequential range after sleigh
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'elf',
        x: fromLeft ? -50 : canvasWidth + 50,
        y: canvasHeight - 30,
        baseY: canvasHeight - 30,
        vx: fromLeft ? 1.5 + Math.random() * 1 : -(1.5 + Math.random() * 1),
        waveAmplitude: 3,
        waveFrequency: 0.05,
        waveOffset: Math.random() * Math.PI * 2,
        time: 0,
        size: 10 + Math.random() * 5,
        opacity: 0.95,
        rotation: 0,
        active: true,
        static: false
      };
    } else if (choice < 0.005) { // Christmas train (0.37% chance - much more frequent)
      if (specialParticles.some(p => p.type === 'train')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -500 : canvasWidth + 500;
      const trainSize = 21 + Math.random() * 9; // 21-30 (40% reduction from 35-50)

      // Calculate Y position so wheels sit near the bottom
      // size = trainSize * 1.8
      // baseUnit = size / 20
      // wheelRadius = baseUnit * 8 = (trainSize * 1.8 / 20) * 8 = trainSize * 0.72
      const wheelRadius = trainSize * 0.72;
      const trainY = canvasHeight - wheelRadius - 10; // Position wheels 10px from bottom

      return {
        type: 'train',
        x: startX,
        y: trainY,
        baseY: trainY,
        vx: fromLeft ? 4 + Math.random() * 2 : -(4 + Math.random() * 2),
        vy: 0,
        size: trainSize,
        opacity: 1,
        time: 0,
        smoke: [],
        active: true,
        static: false,
        carriages: 2 + Math.floor(Math.random() * 2)
      };
    } else if (choice < 0.008) { // Fireworks (0.3% chance) - Sequential range after train
      return {
        type: 'firework',
        x: Math.random() * canvasWidth,
        y: canvasHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: -10 - Math.random() * 5,
        size: 2 + Math.random() * 2,
        opacity: 1,
        active: true,
        static: false,
        time: 0,
        exploded: false,
        explosionTime: 30 + Math.random() * 30
      };
    } else if (choice < 0.012) { // Robin (0.4% chance, max 1) - Sequential range after fireworks
      if (specialParticles.some(p => p.type === 'robin')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      const startY = Math.random() * (canvasHeight * 0.2);
      const startX = fromLeft ? -50 : canvasWidth + 50;
      const robinSize = 10 + Math.random() * 5;
      // Ensure targetY is within reasonable visible bounds
      const targetY = Math.max(robinSize * 3, Math.min(canvasHeight * 0.6 - robinSize * 2, canvasHeight * 0.2 + Math.random() * (canvasHeight * 0.4)));
      const targetX = Math.random() * (canvasWidth * 0.6) + (canvasWidth * 0.2); // Also ensure targetX is not too far off

      return {
        type: 'robin',
        state: 'flying_in',
        x: startX,
        y: startY,
        startX: startX,
        startY: startY,
        targetX: targetX,
        targetY: targetY,
        vx: fromLeft ? 0.5 + Math.random() * 0.5 : -(0.5 + Math.random() * 0.5),
        vy: 0,
        size: robinSize,
        opacity: 0.95,
        active: true,
        static: false,
        sitTime: 3000 + Math.random() * 2000,
        sitStartTime: 0,
        flightProgress: 0,
        time: 0,
        waveOffset: Math.random() * Math.PI * 2
      };
    }

    return null;
  },

  /**
   * Update special particles (sleigh, robin, train, firework)
   */
  updateSpecialParticles(specialParticles, deltaTime, canvasWidth = 1024, canvasHeight = 768) { // Added default canvas dimensions
    specialParticles.forEach(particle => {
      // Increment time for animated particles
      if (particle.time !== undefined) {
        particle.time += deltaTime;
      }

      switch (particle.type) {
        case 'peeing-elf':
        case 'thieving-elf':
          updateElfAntic(particle, deltaTime, canvasWidth);
          break;
        case 'sleigh':
          // Sleigh movement (arc motion is handled in drawSleigh based on particle.x)
          // Just need to ensure it deactivates when off-screen
          if ((particle.vx > 0 && particle.x > particle.targetX) || (particle.vx < 0 && particle.x < particle.targetX)) {
            particle.active = false;
          }
          break;

        case 'robin':
          // Robin flight pattern: fly in -> sit -> flit off
          switch (particle.state) {
            case 'flying_in':
              const dx = particle.targetX - particle.x;
              const dy = particle.targetY - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 20) {
                particle.state = 'sitting';
                particle.vx = 0;
                particle.vy = 0;
                particle.sitStartTime = particle.time;
              } else {
                // Calculate desired velocity components based on direction to target
                const targetDirectionX = dx / distance;
                const targetDirectionY = dy / distance;

                // Max speed for flying in
                const maxFlightSpeed = 3;

                // Base horizontal speed towards target
                particle.vx = targetDirectionX * maxFlightSpeed;

                // Add undulating wave motion (bird-like bobbing flight)
                const waveAmplitude = 30; // Vertical wave height
                const waveFrequency = 0.008; // Wave frequency
                const waveMotion = Math.sin(particle.time * waveFrequency + particle.waveOffset) * waveAmplitude;

                // Calculate vertical velocity: base direction + wave derivative
                const waveDerivative = Math.cos(particle.time * waveFrequency + particle.waveOffset) * waveAmplitude * waveFrequency;
                particle.vy = targetDirectionY * maxFlightSpeed * 0.3 + waveDerivative;
              }
              break;

            case 'sitting':
              particle.vx = 0;
              particle.vy = 0;
              if (particle.time - particle.sitStartTime > particle.sitTime) {
                particle.state = 'flying_away';
                // Set base horizontal velocity (away from center)
                const baseVx = particle.x < canvasWidth / 2 ? -4 : 4;
                particle.vx = baseVx;
                particle.flyAwayStartTime = particle.time;
              }
              break;

            case 'flying_away':
              // Maintain horizontal velocity
              const flyDirection = particle.vx > 0 ? 1 : -1;
              particle.vx = flyDirection * 4;

              // Add undulating wave motion for natural bird flight
              const waveAmplitude = 25;
              const waveFrequency = 0.01;
              const flyTime = particle.time - particle.flyAwayStartTime;

              // Upward bias + wave motion
              const waveMotion = Math.sin(flyTime * waveFrequency + particle.waveOffset) * waveAmplitude;
              const waveDerivative = Math.cos(flyTime * waveFrequency + particle.waveOffset) * waveAmplitude * waveFrequency;
              particle.vy = -1.5 + waveDerivative; // Gentle upward + wave

              if (particle.x < -50 || particle.x > canvasWidth + 50 || particle.y < -50) {
                particle.active = false;
              }
              break;
          }
          break;

        case 'train':
          // Initialize smoke array if needed
          if (!particle.smoke) {
            particle.smoke = [];
          }

          // Train deactivates when off-screen
          if ((particle.vx > 0 && particle.x > canvasWidth + 500) || (particle.vx < 0 && particle.x < -500)) {
            particle.active = false;
          }

          // Emit smoke puffs - every 150ms
          if (!particle.lastSmokeTime) {
            particle.lastSmokeTime = 0;
          }

          if (particle.time - particle.lastSmokeTime > 150) {
            particle.lastSmokeTime = particle.time;

            // Calculate smoke position from chimney - must match drawing code exactly
            const size = particle.size * 1.8;
            const baseUnit = size / 20;
            const dir = particle.vx > 0 ? 1 : -1;

            // From drawing code:
            const wheelRadius = baseUnit * 8;
            const chassisHeight = baseUnit * 7;
            const boilerRadius = baseUnit * 10;
            const engineChassisBottomY = -wheelRadius - baseUnit; // -9 * baseUnit
            const boilerTopY = engineChassisBottomY - chassisHeight - boilerRadius * 2; // -36 * baseUnit
            const chimneyTopY = boilerTopY - baseUnit * 8; // -44 * baseUnit

            const engineLength = baseUnit * 70;
            const cabWidth = baseUnit * 25;
            const boilerWidth = engineLength - cabWidth; // 45 * baseUnit
            const chimneyX = boilerWidth * 0.7; // 31.5 * baseUnit

            // Convert from local drawing coords to world coords
            const smokeX = particle.x + (chimneyX * dir);
            const smokeY = particle.y + chimneyTopY; // chimneyTopY is negative, so this goes UP

            const smokeParticle = {
              x: smokeX,
              y: smokeY,
              vx: (Math.random() - 0.5) * 0.8,
              vy: -0.8 - Math.random() * 0.4,
              size: 8 + Math.random() * 6,
              opacity: 0.7 + Math.random() * 0.2,
              fadeRate: 0.012 + Math.random() * 0.008
            };

            particle.smoke.push(smokeParticle);
          }

          // Update smoke puffs
          particle.smoke = particle.smoke.filter(smoke => {
            smoke.x += smoke.vx;
            smoke.y += smoke.vy;
            smoke.vy *= 0.99; // Slow vertical lift
            smoke.size *= 1.02; // Expand as it rises
            smoke.opacity -= smoke.fadeRate;
            return smoke.opacity > 0;
          });
          break;

        case 'firework':
          // Check firework explosion
          if (!particle.exploded) {
            // Explode when reached target height OR after flight time
            const reachedTarget = particle.y <= particle.targetY;
            const timeExpired = particle.time >= particle.explosionTime;

            if (reachedTarget || timeExpired) {
              particle.exploded = true;
              this.explodeFirework(particle, specialParticles);
              particle.active = false; // Remove the firework itself
            }
          }
          break;
      }
    });
  },

  /**
   * Draw 6-pointed crystalline snowflake
   */
  drawSnowflake(ctx, particle) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(particle.size * 0.15, 0.5);

    const branches = 6;
    const radius = particle.size;

    for (let i = 0; i < branches; i++) {
      const angle = (Math.PI * 2 * i) / branches;

      // Main branch
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
      );
      ctx.stroke();

      // Side branches
      const sideLength = radius * 0.4;
      const sideAngle = Math.PI / 6;
      const midX = Math.cos(angle) * (radius * 0.6);
      const midY = Math.sin(angle) * (radius * 0.6);

      // Left side branch
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX + Math.cos(angle - sideAngle) * sideLength,
        midY + Math.sin(angle - sideAngle) * sideLength
      );
      ctx.stroke();

      // Right side branch
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX + Math.cos(angle + sideAngle) * sideLength,
        midY + Math.sin(angle + sideAngle) * sideLength
      );
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw Christmas tree with lights, baubles, tinsel, and star
   */
  drawTree,

  /**
   * Draw Christmas wreath with bow and lights
   */
  drawWreath,

  /**
   * Draw North Star (Star of Bethlehem) - Silver 4-pointed star, non-spinning
   */
  drawNorthStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Calculate twinkle intensity (gentle pulsing)
    const twinkleIntensity = 0.8 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.2;

    ctx.save();
    ctx.translate(x, y);

    // Outer glow halo (pulsing silver aura)
    const glowSize = size * 4 * twinkleIntensity;
    const haloGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
    haloGradient.addColorStop(0, 'rgba(220, 230, 240, 0.4)');
    haloGradient.addColorStop(0.4, 'rgba(200, 210, 220, 0.2)');
    haloGradient.addColorStop(1, 'rgba(180, 190, 200, 0)');
    ctx.fillStyle = haloGradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw 4-pointed star with pointed tips (taller and thinner)
    const horizontalLength = size * 1.0;  // Horizontal arms
    const verticalLength = size * 1.5;    // Vertical arms (much taller)
    const armWidth = size * 0.12;         // Width at base of each arm (thinner)

    // Silver gradient for star body
    const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    starGradient.addColorStop(0, '#ffffff');           // Bright white center
    starGradient.addColorStop(0.3, '#f0f0f0');         // Light silver
    starGradient.addColorStop(0.6, '#c0c0c0');         // Silver
    starGradient.addColorStop(1, '#a0a0a0');           // Darker silver edge

    ctx.shadowColor = 'rgba(220, 230, 240, 0.9)';
    ctx.shadowBlur = size * 0.8 * twinkleIntensity;
    ctx.fillStyle = starGradient;

    // Draw 4-pointed star with pointed tips
    ctx.beginPath();
    // Top point
    ctx.moveTo(0, -verticalLength);
    ctx.lineTo(armWidth, -armWidth);
    // Right point
    ctx.lineTo(horizontalLength, 0);
    ctx.lineTo(armWidth, armWidth);
    // Bottom point
    ctx.lineTo(0, verticalLength);
    ctx.lineTo(-armWidth, armWidth);
    // Left point
    ctx.lineTo(-horizontalLength, 0);
    ctx.lineTo(-armWidth, -armWidth);
    ctx.closePath();
    ctx.fill();

    // Inner bright white core (circular center)
    ctx.shadowBlur = size * 1.2 * twinkleIntensity;
    ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.6, '#f5f5f5');
    coreGradient.addColorStop(1, 'rgba(200, 200, 200, 0.8)');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw Santa's sleigh with 5 reindeer (including Rudolph)
   */
  drawSleigh,

  /**
   * Draw walking elf
   */
  drawElf,
  drawPeeingElf: drawElf,
  drawThievingElf: drawElf,

  /**
   * Draw Christmas steam train
   */
  drawTrain,

  /**
   * Draw firework particle or spark
   */
  drawFirework(ctx, particle) {
    ctx.fillStyle = particle.color || '#ffffff';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  },

  /**
   * Explode firework into sparks
   */
  explodeFirework(particle, specialParticles) {
    const sparkCount = 50 + Math.random() * 50;
    const colors = ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ffffff'];
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      specialParticles.push({
        type: 'spark',
        x: particle.x,
        y: particle.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        opacity: 1,
        active: true,
        static: false,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  },

  /**
   * Draw robin (British red-breasted robin with Santa hat)
   */
  drawRobin,

  /**
   * Draw snowman with top hat, scarf, and coal features
   */
  drawSnowman
};
