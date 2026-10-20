// Original illustrations retained solely for the before/after review gallery.
const tartanPatternCanvases = new WeakMap();
export const st_georges = {
  colors: {greenStem: '#228B22', rainbow: ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']},
  drawEnglishRose(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const bloom = 0.8 + (Math.sin(time * 0.002 + particle.bloomPhase) + 1) * 0.1;

    ctx.save();
    ctx.translate(x, y);

    // Stem
    ctx.strokeStyle = this.colors.greenStem;
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      -size * 0.2, size * 0.8,
      0, size * 1.5
    );
    ctx.stroke();

    // Leaves
    ctx.fillStyle = '#2D5016';
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.translate(side * size * 0.15, size * 0.8);
      ctx.rotate(side * Math.PI / 6);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Rose petals (layered circular pattern)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = particle.color === '#FFFFFF' ? '#FFE6E6' : '#8B0000';
    ctx.lineWidth = 1;

    // Outer layer
    for (let i = 0; i < particle.petalCount; i++) {
      const angle = (i / particle.petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.4 * bloom);

      ctx.beginPath();
      ctx.moveTo(0, size * 0.25);
      ctx.bezierCurveTo(
        -size * 0.25, -size * 0.1,
        -size * 0.15, -size * 0.35,
        0, -size * 0.25
      );
      ctx.bezierCurveTo(
        size * 0.15, -size * 0.35,
        size * 0.25, -size * 0.1,
        0, size * 0.25
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Inner layer (offset rotation)
    ctx.globalAlpha = 0.9;
    for (let i = 0; i < particle.petalCount - 2; i++) {
      const angle = (i / (particle.petalCount - 2)) * Math.PI * 2 + (Math.PI / particle.petalCount);
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.25 * bloom);

      ctx.beginPath();
      ctx.moveTo(0, size * 0.15);
      ctx.bezierCurveTo(
        -size * 0.15, -size * 0.05,
        -size * 0.1, -size * 0.2,
        0, -size * 0.15
      );
      ctx.bezierCurveTo(
        size * 0.1, -size * 0.2,
        size * 0.15, -size * 0.05,
        0, size * 0.15
      );
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Center (yellow stamens)
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15 * bloom, 0, Math.PI * 2);
    ctx.fill();

    // Stamen dots
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = size * 0.08 * bloom;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        size * 0.03,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  },
  drawTudorRose(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Outer petals (red) - 5 petals
    ctx.fillStyle = '#C8102E';
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = size * 0.05;

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);

      // Heart-shaped petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.4, -size * 0.6, -size * 0.8, 0, -size * 1.2);
      ctx.bezierCurveTo(size * 0.6, -size * 0.8, size * 0.5, -size * 0.4, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Inner petals (white) - 5 petals, offset
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E0E0E0';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2 + Math.PI / 5;
      ctx.save();
      ctx.rotate(angle);

      // Smaller heart-shaped petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size * 0.3, -size * 0.25, -size * 0.35, -size * 0.5, 0, -size * 0.7);
      ctx.bezierCurveTo(size * 0.35, -size * 0.5, size * 0.3, -size * 0.25, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Golden center
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Stamens
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dist = size * 0.12;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
  drawShield(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const glint = (Math.sin(time * 0.003 + particle.glintPhase) + 1) * 0.5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Shield outline (kite shield shape)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(size * 0.5, -size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.3);
    ctx.lineTo(0, size * 0.7);
    ctx.lineTo(-size * 0.5, size * 0.3);
    ctx.lineTo(-size * 0.5, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // St George's Cross
    ctx.fillStyle = '#C8102E';
    // Vertical bar
    ctx.fillRect(-size * 0.1, -size * 0.6, size * 0.2, size * 1.2);
    // Horizontal bar
    ctx.fillRect(-size * 0.45, -size * 0.1, size * 0.9, size * 0.2);

    // Metallic edge highlights
    ctx.strokeStyle = `rgba(255, 215, 0, ${glint * 0.8})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(size * 0.5, -size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.3);
    ctx.stroke();

    // Central boss (decorative)
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glint on boss
    ctx.fillStyle = `rgba(255, 255, 255, ${glint * 0.6})`;
    ctx.beginPath();
    ctx.arc(-size * 0.05, -size * 0.05, size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
  drawStGeorgesCross(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const waveOffset = time * particle.waveSpeed + particle.waveOffset;

    ctx.save();
    ctx.translate(x, y);

    // ===== FLAGPOLE (wooden with grain detail) =====
    const poleGradient = ctx.createLinearGradient(-size * 0.64, 0, -size * 0.56, 0);
    poleGradient.addColorStop(0, '#5a4a3a');
    poleGradient.addColorStop(0.5, '#8B4513');
    poleGradient.addColorStop(1, '#6a5343');
    ctx.fillStyle = poleGradient;
    ctx.fillRect(-size * 0.64, -size * 0.35, size * 0.08, size * 1.9);

    // Pole edge highlight
    ctx.strokeStyle = '#9a6333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.64, -size * 0.35);
    ctx.lineTo(-size * 0.64, size * 1.55);
    ctx.stroke();

    // Pole shadow
    ctx.strokeStyle = '#3a2a1a';
    ctx.beginPath();
    ctx.moveTo(-size * 0.56, -size * 0.35);
    ctx.lineTo(-size * 0.56, size * 1.55);
    ctx.stroke();

    // Gold finial (decorative top)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-size * 0.6, -size * 0.4, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ===== FLAG FABRIC (smooth wave, proper cross) =====
    const flagWidth = size * 1.5;
    const flagHeight = size * 1.0;
    const verticalStripes = 12; // More stripes for smoother wave

    // Draw flag in vertical strips with wave displacement
    for (let i = 0; i < verticalStripes; i++) {
      const stripX = -size * 0.5 + (i / verticalStripes) * flagWidth;
      const nextStripX = -size * 0.5 + ((i + 1) / verticalStripes) * flagWidth;
      const stripWidth = nextStripX - stripX;

      // Wave calculation for this strip
      const wave = Math.sin(waveOffset + i * 0.4) * size * 0.12;
      const nextWave = Math.sin(waveOffset + (i + 1) * 0.4) * size * 0.12;

      // Calculate if this strip is in the cross area
      const stripCenter = stripX + stripWidth / 2 + size * 0.5;
      const normalizedX = stripCenter / flagWidth; // 0 to 1

      const isVerticalBar = normalizedX > 0.4 && normalizedX < 0.6;

      ctx.save();

      // ===== WHITE BACKGROUND STRIP =====
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(stripX, -flagHeight / 2 + wave);
      ctx.lineTo(nextStripX, -flagHeight / 2 + nextWave);
      ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
      ctx.lineTo(stripX, flagHeight / 2 + wave);
      ctx.closePath();
      ctx.fill();

      // ===== RED CROSS STRIPS =====
      ctx.fillStyle = '#C8102E';

      // Vertical bar of cross (center strip)
      if (isVerticalBar) {
        ctx.beginPath();
        ctx.moveTo(stripX, -flagHeight / 2 + wave);
        ctx.lineTo(nextStripX, -flagHeight / 2 + nextWave);
        ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
        ctx.lineTo(stripX, flagHeight / 2 + wave);
        ctx.closePath();
        ctx.fill();
      }

      // Horizontal bar of cross (middle section of each strip)
      ctx.beginPath();
      ctx.moveTo(stripX, -flagHeight * 0.15 + wave);
      ctx.lineTo(nextStripX, -flagHeight * 0.15 + nextWave);
      ctx.lineTo(nextStripX, flagHeight * 0.15 + nextWave);
      ctx.lineTo(stripX, flagHeight * 0.15 + wave);
      ctx.closePath();
      ctx.fill();

      // ===== FABRIC SHADING (alternating for depth) =====
      const shade = Math.sin(waveOffset + i * 0.4) * 0.15;
      if (shade > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${shade * 0.3})`;
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${-shade * 0.2})`;
      }
      ctx.beginPath();
      ctx.moveTo(stripX, -flagHeight / 2 + wave);
      ctx.lineTo(nextStripX, -flagHeight / 2 + nextWave);
      ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
      ctx.lineTo(stripX, flagHeight / 2 + wave);
      ctx.closePath();
      ctx.fill();

      // Strip edge line (fabric texture)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(nextStripX, -flagHeight / 2 + nextWave);
      ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
      ctx.stroke();

      ctx.restore();
    }

    // ===== FLAG BORDER (subtle outline) =====
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Top edge
    ctx.moveTo(-size * 0.5, -flagHeight / 2 + Math.sin(waveOffset) * size * 0.12);
    for (let i = 1; i <= verticalStripes; i++) {
      const stripX = -size * 0.5 + (i / verticalStripes) * flagWidth;
      const wave = Math.sin(waveOffset + i * 0.4) * size * 0.12;
      ctx.lineTo(stripX, -flagHeight / 2 + wave);
    }
    // Right edge
    ctx.lineTo(
      -size * 0.5 + flagWidth,
      flagHeight / 2 + Math.sin(waveOffset + verticalStripes * 0.4) * size * 0.12
    );
    // Bottom edge
    for (let i = verticalStripes; i >= 0; i--) {
      const stripX = -size * 0.5 + (i / verticalStripes) * flagWidth;
      const wave = Math.sin(waveOffset + i * 0.4) * size * 0.12;
      ctx.lineTo(stripX, flagHeight / 2 + wave);
    }
    // Left edge (back to pole)
    ctx.closePath();
    ctx.stroke();

    // ===== HOIST ATTACHMENT (flag grommets) =====
    ctx.fillStyle = '#A9A9A9'; // Metal grommets
    for (let i = 0; i < 3; i++) {
      const yPos = -flagHeight / 2 + (i / 2) * flagHeight;
      const wave = Math.sin(waveOffset) * size * 0.12;
      ctx.beginPath();
      ctx.arc(-size * 0.48, yPos + wave, size * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  },
};
export const st_andrews = {
  colors: {greenStem: '#228B22', rainbow: ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']},
  drawHeather(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const sway = Math.sin(particle.sway) * size * 0.4;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x + sway, y);
    ctx.rotate(particle.rotation);

    // Stem (thin green-brown)
    ctx.strokeStyle = '#6b5c4d';
    ctx.lineWidth = size * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, size * 0.6);
    ctx.lineTo(0, -size * 0.8);
    ctx.stroke();

    // Bell-shaped flowers along the stem (small purple bells)
    const bellCount = particle.bellCount || 4;
    for (let i = 0; i < bellCount; i++) {
      const yPos = -size * 0.7 + (i / bellCount) * size * 1.2;
      const bellSize = size * (0.18 + Math.random() * 0.08);
      const side = i % 2 === 0 ? 1 : -1; // Alternate sides

      ctx.save();
      ctx.translate(side * size * 0.15, yPos);
      ctx.rotate(side * 0.3);

      // Bell flower (small oval with darker top)
      const bellGradient = ctx.createLinearGradient(0, -bellSize, 0, bellSize * 0.3);
      bellGradient.addColorStop(0, particle.color);
      bellGradient.addColorStop(0.6, particle.color);
      bellGradient.addColorStop(1, `${particle.color}CC`); // Slightly darker at bottom
      ctx.fillStyle = bellGradient;

      // Bell shape (elongated oval, wider at bottom)
      ctx.beginPath();
      ctx.ellipse(0, 0, bellSize * 0.4, bellSize, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bell opening (darker rim)
      ctx.strokeStyle = `${particle.color}AA`;
      ctx.lineWidth = bellSize * 0.1;
      ctx.beginPath();
      ctx.ellipse(0, bellSize * 0.7, bellSize * 0.35, bellSize * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Small stamen (thin line protruding from bell)
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = bellSize * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, bellSize * 0.8);
      ctx.lineTo(0, bellSize * 1.1);
      ctx.stroke();

      ctx.restore();
    }

    // Small leaves at base (green-grey)
    ctx.fillStyle = '#6b8b6b';
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, size * 0.5, size * 0.1, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  },
  drawThistle(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Stem (woody, slightly curved)
    ctx.strokeStyle = '#5a704a';
    ctx.lineWidth = size * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, size * 2);
    ctx.quadraticCurveTo(size * 0.1, size * 1.2, 0, size * 0.5);
    ctx.stroke();

    // Spiky bracts (green spiny base around flower head)
    const bractCount = 16;
    ctx.strokeStyle = '#4a7a3a';
    ctx.fillStyle = '#5a8a4a';
    ctx.lineWidth = size * 0.06;
    ctx.lineCap = 'round';

    for (let i = 0; i < bractCount; i++) {
      const angle = (i / bractCount) * Math.PI * 2;
      const bractLength = size * (0.35 + Math.random() * 0.15);
      const bendAngle = angle + (Math.random() - 0.5) * 0.3;

      // Bract spine (sharp and pointed)
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.2);

      // Curved spiky bract
      const controlX = size * 0.15;
      const controlY = -size * 0.3;
      const endX = Math.sin(0.4) * bractLength;
      const endY = -Math.cos(0.4) * bractLength - size * 0.2;

      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();

      // Tiny spines along bract edge
      for (let j = 0; j < 3; j++) {
        const t = (j + 1) / 4;
        const spineX = t * endX;
        const spineY = -size * 0.2 + t * (endY + size * 0.2);
        ctx.beginPath();
        ctx.moveTo(spineX, spineY);
        ctx.lineTo(spineX + size * 0.08, spineY - size * 0.06);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Flower head base (bulbous receptacle)
    ctx.fillStyle = '#6a8a5a';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.15, size * 0.28, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flower petals (white or blue - Scottish Saltire colors)
    const petalLayers = 3;
    const petalColors = particle.petalColors || ['#9b59b6', '#b980d1', '#d4a5e3']; // Fallback to purple

    for (let layer = 0; layer < petalLayers; layer++) {
      const layerRadius = size * (0.25 + layer * 0.08);
      const petalCount = 8 + layer * 4;
      const layerColor = petalColors[layer];

      ctx.fillStyle = layerColor;

      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + layer * 0.15;
        const petalX = Math.cos(angle) * layerRadius;
        const petalY = Math.sin(angle) * layerRadius - size * 0.15;

        // Thin wispy petal
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size * (0.2 + layer * 0.05));
        ctx.lineWidth = size * 0.02;
        ctx.strokeStyle = layerColor;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Serrated leaves (2-3 along stem with spiny edges)
    ctx.fillStyle = '#4a6a3a';
    ctx.strokeStyle = '#3a5a2a';
    ctx.lineWidth = 1;

    for (let i = 0; i < 2; i++) {
      const leafY = size * (0.8 + i * 0.6);
      const leafSide = i % 2 === 0 ? 1 : -1;

      ctx.save();
      ctx.translate(0, leafY);

      // Leaf base shape with deep serrations
      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Create deeply lobed, spiny leaf edge
      const lobes = 5;
      const depth = size * 0.15;  // Moved outside loop so it's accessible below

      for (let j = 0; j <= lobes; j++) {
        const t = j / lobes;
        const leafWidth = size * 0.25 * Math.sin(t * Math.PI);

        if (j < lobes) {
          // Deep cut between lobes
          ctx.lineTo(leafSide * leafWidth * 0.3, -depth * t);
          // Sharp spine point
          ctx.lineTo(leafSide * (leafWidth + size * 0.08), -depth * (t + 0.05));
          ctx.lineTo(leafSide * leafWidth * 0.7, -depth * (t + 0.1));
        } else {
          ctx.lineTo(0, -depth);
        }
      }

      // Return path (smooth inner edge)
      ctx.quadraticCurveTo(leafSide * size * 0.05, -depth * 0.5, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leaf vein
      ctx.strokeStyle = '#2a4a1a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -depth);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  },
  drawThistlePlant(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Gentle sway
    const sway = Math.sin(time * 0.001 + particle.swayPhase) * 0.1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(sway);

    // Multiple stems
    for (let stem = 0; stem < 3; stem++) {
      const stemX = (stem - 1) * size * 0.4;
      const stemHeight = size * (1.5 + stem * 0.3);

      // Stem
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = size * 0.1;
      ctx.beginPath();
      ctx.moveTo(stemX, 0);
      ctx.quadraticCurveTo(stemX + sway * size, -stemHeight * 0.5, stemX, -stemHeight);
      ctx.stroke();

      // Flower head
      ctx.fillStyle = '#8B008B';
      ctx.beginPath();
      ctx.arc(stemX, -stemHeight, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Spikes
      const spikeCount = 8;
      ctx.strokeStyle = '#8B008B';
      ctx.lineWidth = size * 0.05;
      for (let i = 0; i < spikeCount; i++) {
        const angle = (i / spikeCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(stemX, -stemHeight);
        ctx.lineTo(
          stemX + Math.cos(angle) * size * 0.6,
          -stemHeight + Math.sin(angle) * size * 0.6
        );
        ctx.stroke();
      }
    }

    ctx.restore();
  },
  drawTartanPattern(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Create authentic tartan weave pattern
    const patternSize = 120; // Smaller repeating unit
    const patternDocument = ctx.canvas?.ownerDocument || document;
    let patternCanvas = tartanPatternCanvases.get(patternDocument);
    if (!patternCanvas) {
      patternCanvas = patternDocument.createElement('canvas');
      patternCanvas.width = patternSize;
      patternCanvas.height = patternSize;
      const pCtx = patternCanvas.getContext('2d');

    // Royal Stewart tartan colors
    const NAVY = '#1a237e';
    const RED = '#c62828';
    const FOREST = '#1b5e20';
    const YELLOW = '#f9a825';
    const WHITE = '#ffffff';
    const BLACK = '#000000';

    // Tartan stripe sequence (width, color) - authentic Royal Stewart pattern
    const stripeSequence = [
      [4, RED], [2, BLACK], [2, RED], [2, BLACK], [4, RED],
      [8, NAVY], [2, BLACK], [2, NAVY], [2, BLACK], [8, NAVY],
      [2, FOREST], [2, YELLOW], [2, FOREST],
      [8, NAVY], [2, BLACK], [2, NAVY], [2, BLACK], [8, NAVY],
      [4, RED], [2, BLACK], [2, RED], [2, BLACK], [4, RED]
    ];

    // Draw horizontal stripes
    let ypos = 0;
    for (let i = 0; i < 2; i++) { // Repeat pattern twice
      for (const [width, color] of stripeSequence) {
        pCtx.fillStyle = color;
        pCtx.fillRect(0, ypos, patternSize, width);
        ypos += width;
      }
    }

    // Draw vertical stripes with blending (creates the weave effect)
    pCtx.globalCompositeOperation = 'multiply';
    pCtx.globalAlpha = 0.8;

    let xpos = 0;
    for (let i = 0; i < 2; i++) { // Repeat pattern twice
      for (const [width, color] of stripeSequence) {
        pCtx.fillStyle = color;
        pCtx.fillRect(xpos, 0, width, patternSize);
        xpos += width;
      }
    }

    // Add white highlights (creates tartan shine)
    pCtx.globalCompositeOperation = 'lighten';
    pCtx.globalAlpha = 0.15;
    xpos = 0;
    for (let i = 0; i < 2; i++) {
      for (const [width, color] of stripeSequence) {
        if (color === YELLOW || color === WHITE) {
          pCtx.fillStyle = WHITE;
          pCtx.fillRect(xpos, 0, width, patternSize);
        }
        xpos += width;
      }
    }

    // Reset composite operation
    pCtx.globalCompositeOperation = 'source-over';
    pCtx.globalAlpha = 1;
      tartanPatternCanvases.set(patternDocument, patternCanvas);
    }

    // Draw the tartan pattern (tiled)
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    // Fabric edge (darker border to show it's fabric)
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = size * 0.03;
    ctx.strokeRect(-size / 2, -size / 2, size, size);

    // Inner decorative border (silver/white tartan trim)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = size * 0.015;
    ctx.strokeRect(-size / 2 + size * 0.04, -size / 2 + size * 0.04,
                    size - size * 0.08, size - size * 0.08);

    // Fabric texture overlay (subtle diagonal lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = -size; i < size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(-size / 2 + i, -size / 2);
      ctx.lineTo(-size / 2 + i + size, size / 2);
      ctx.stroke();
    }

    // Silver thistle brooch in corner (holds the tartan)
    ctx.save();
    ctx.translate(-size * 0.35, -size * 0.35);

    // Brooch circle (silver)
    ctx.fillStyle = '#c0c0c0';
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Thistle emblem on brooch
    ctx.scale(0.06, 0.06);
    ctx.fillStyle = '#8B008B';
    ctx.strokeStyle = '#6A006A';
    ctx.lineWidth = 2;

    // Stylized thistle flower
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4);
      ctx.stroke();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore();
  },
  drawHighlandScene(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Sky gradient (misty blue)
    const skyGradient = ctx.createLinearGradient(0, -size, 0, size * 0.5);
    skyGradient.addColorStop(0, '#4a7ba7');
    skyGradient.addColorStop(1, '#b0c4de');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(-size, -size, size * 2, size * 1.5);

    // Distant mountains (layered)
    ctx.fillStyle = 'rgba(80, 100, 130, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-size, size * 0.3);
    ctx.lineTo(-size * 0.6, -size * 0.3);
    ctx.lineTo(-size * 0.2, size * 0.1);
    ctx.lineTo(size * 0.2, -size * 0.5);
    ctx.lineTo(size * 0.6, size * 0.2);
    ctx.lineTo(size, size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Closer mountains (darker)
    ctx.fillStyle = 'rgba(60, 80, 100, 0.8)';
    ctx.beginPath();
    ctx.moveTo(-size, size * 0.4);
    ctx.lineTo(-size * 0.7, size * 0.1);
    ctx.lineTo(-size * 0.3, -size * 0.1);
    ctx.lineTo(size * 0.1, -size * 0.2);
    ctx.lineTo(size * 0.5, size * 0.15);
    ctx.lineTo(size, size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Highland castle silhouette (on hill)
    ctx.fillStyle = '#2a3a4a';

    // Castle base
    ctx.fillRect(-size * 0.15, size * 0.25, size * 0.3, size * 0.2);

    // Castle tower (left)
    ctx.fillRect(-size * 0.2, size * 0.15, size * 0.1, size * 0.15);

    // Castle tower (right)
    ctx.fillRect(size * 0.1, size * 0.15, size * 0.1, size * 0.15);

    // Central keep (tall)
    ctx.fillRect(-size * 0.06, size * 0.05, size * 0.12, size * 0.25);

    // Battlements
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(-size * 0.06 + i * size * 0.06, size * 0.02, size * 0.03, size * 0.03);
      }
    }

    // Loch (water) at bottom
    const lochGradient = ctx.createLinearGradient(0, size * 0.45, 0, size * 0.6);
    lochGradient.addColorStop(0, '#1e3a5f');
    lochGradient.addColorStop(1, '#0a1f3d');
    ctx.fillStyle = lochGradient;
    ctx.fillRect(-size, size * 0.45, size * 2, size * 0.15);

    // Reflection in loch (simplified)
    ctx.globalAlpha = particle.opacity * 0.3;
    ctx.fillStyle = '#4a6a8a';
    ctx.fillRect(-size * 0.15, size * 0.48, size * 0.3, size * 0.08);

    // Mist over loch
    ctx.globalAlpha = particle.opacity * 0.2;
    ctx.fillStyle = '#d0e0f0';
    ctx.fillRect(-size, size * 0.5, size * 2, size * 0.05);

    ctx.restore();
  },
};
export const st_davids = {
  colors: {greenStem: '#228B22', rainbow: ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']},
  drawDaffodil(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Trumpet (center corona)
    ctx.fillStyle = '#FFA500'; // Orange center
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.moveTo(-size * 0.25, 0);
    ctx.lineTo(-size * 0.3, size * 0.3);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.lineTo(size * 0.25, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Petals (6 petals around trumpet)
    ctx.fillStyle = '#FFDD00';
    ctx.strokeStyle = '#FFC700';
    ctx.lineWidth = size * 0.06;

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.7);

      // Petal shape (pointed ellipse)
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Stem
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.lineTo(0, size * 1.5);
    ctx.stroke();

    ctx.restore();
  },
  drawDaffodilField(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;

    ctx.save();
    ctx.globalAlpha = particle.opacity;

    particle.flowers.forEach(flower => {
      const sway = Math.sin(time * 0.001 + flower.swayPhase) * flower.size * 0.2;

      ctx.save();
      ctx.translate(x + flower.x, y - flower.y);
      ctx.rotate(sway * 0.1);

      // Stem
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = flower.size * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sway, -flower.size * 2);
      ctx.stroke();

      // Flower head (simplified)
      ctx.fillStyle = '#FFDD00';
      ctx.shadowColor = '#FFDD00';
      ctx.shadowBlur = flower.size * 0.5;
      ctx.beginPath();
      ctx.arc(sway, -flower.size * 2, flower.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Orange center
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(sway, -flower.size * 2, flower.size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  },
  drawLeek(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // White bulb (bottom)
    ctx.fillStyle = '#F5F5F5';
    ctx.strokeStyle = '#DCDCDC';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.ellipse(0, size * 1.2, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Green stalk/leaves
    ctx.fillStyle = '#228B22';
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = size * 0.05;

    // Main stalk
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 1.2);
    ctx.quadraticCurveTo(-size * 0.25, size * 0.5, -size * 0.15, 0);
    ctx.quadraticCurveTo(0, -size * 0.2, size * 0.15, 0);
    ctx.quadraticCurveTo(size * 0.25, size * 0.5, size * 0.3, size * 1.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Leaves spreading at top
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, 0);
    ctx.quadraticCurveTo(-size * 0.6, -size * 0.3, -size * 0.8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.15, 0);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.3, size * 0.8, 0);
    ctx.stroke();

    // Roots
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = size * 0.05;
    for (let i = 0; i < 5; i++) {
      const rootX = (i - 2) * size * 0.15;
      ctx.beginPath();
      ctx.moveTo(rootX, size * 1.5);
      ctx.lineTo(rootX + Math.sin(i * 1.7) * size * 0.15, size * 1.8);
      ctx.stroke();
    }

    ctx.restore();
  },
  drawLeekBundle(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Bundle of 5 leeks
    for (let i = 0; i < 5; i++) {
      ctx.save();
      const offsetX = (i - 2) * size * 0.15;
      const rotation = (i - 2) * 0.1;
      ctx.translate(offsetX, 0);
      ctx.rotate(rotation);

      // Leek white part (bulb)
      ctx.fillStyle = '#f5f5dc';
      ctx.strokeStyle = '#d3d3c0';
      ctx.lineWidth = 1;
      ctx.fillRect(-size * 0.08, size * 0.2, size * 0.16, size * 0.6);
      ctx.strokeRect(-size * 0.08, size * 0.2, size * 0.16, size * 0.6);

      // Leek green part (leaves)
      ctx.fillStyle = '#228B22';
      ctx.strokeStyle = '#1a6b1a';
      ctx.beginPath();
      ctx.moveTo(-size * 0.08, size * 0.2);
      ctx.lineTo(-size * 0.12, -size * 0.5);
      ctx.lineTo(0, -size * 0.7);
      ctx.lineTo(size * 0.12, -size * 0.5);
      ctx.lineTo(size * 0.08, size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leaf texture
      ctx.strokeStyle = '#1a5a1a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.2);
      ctx.lineTo(0, -size * 0.65);
      ctx.stroke();

      ctx.restore();
    }

    // Ribbon tying the bundle (red Welsh ribbon)
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(-size * 0.5, size * 0.4, size, size * 0.12);

    // Ribbon bow
    ctx.beginPath();
    ctx.ellipse(-size * 0.6, size * 0.46, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.6, size * 0.46, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
  drawHarp(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Harp frame (curved wooden structure)
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';

    // Curved pillar (left side)
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 0.5);
    ctx.bezierCurveTo(
      -size * 0.5, size * 0.1,
      -size * 0.4, -size * 0.4,
      -size * 0.2, -size * 0.7
    );
    ctx.stroke();

    // Straight neck (top)
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.7);
    ctx.lineTo(size * 0.4, -size * 0.5);
    ctx.stroke();

    // Soundboard (right side)
    ctx.beginPath();
    ctx.moveTo(size * 0.4, -size * 0.5);
    ctx.lineTo(-size * 0.3, size * 0.5);
    ctx.stroke();

    // Harp strings (golden)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = size * 0.02;
    const stringCount = 12;
    for (let i = 0; i < stringCount; i++) {
      const t = i / (stringCount - 1);
      const startX = -size * 0.3 + t * size * 0.65;
      const startY = size * 0.5 - t * size * 1.0;
      const endX = -size * 0.25 + t * size * 0.55;
      const endY = -size * 0.65 + t * size * 0.15;

      // Slight wave to strings
      const wave = Math.sin(time * 0.003 + i * 0.3 + particle.glintPhase) * size * 0.02;

      ctx.beginPath();
      ctx.moveTo(startX + wave, startY);
      ctx.lineTo(endX + wave, endY);
      ctx.stroke();
    }

    // Decorative carvings on pillar (Celtic patterns)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = size * 0.03;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 4; i++) {
      const yPos = size * 0.3 - i * size * 0.25;
      ctx.beginPath();
      ctx.arc(-size * 0.35, yPos, size * 0.08, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  },
};
export const st_patricks = {
  colors: {greenStem: '#228B22', rainbow: ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']},
  drawPotOfGold(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.translate(x, y);

    // Pot (black cauldron)
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.7, 0, Math.PI);
    ctx.lineTo(-size * 0.7, size * 0.4);
    ctx.quadraticCurveTo(0, size * 0.6, size * 0.7, size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Handle
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.5, Math.PI, 0);
    ctx.stroke();

    // Gold coins overflowing
    const coinPositions = [
      {x: -size * 0.4, y: -size * 0.2, s: 0.8},
      {x: size * 0.3, y: -size * 0.3, s: 0.9},
      {x: -size * 0.1, y: -size * 0.5, s: 1.0},
      {x: size * 0.5, y: -size * 0.1, s: 0.7},
      {x: -size * 0.5, y: 0, s: 0.75},
      {x: size * 0.1, y: -size * 0.6, s: 0.85},
      {x: 0, y: -size * 0.3, s: 0.95}
    ];

    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;

    coinPositions.forEach((coin, i) => {
      const glintPhase = time * 0.002 + i * 0.5;
      const glint = (Math.sin(glintPhase) + 1) * 0.5;

      ctx.save();
      ctx.translate(coin.x, coin.y);

      // Coin
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2 * coin.s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glint
      ctx.fillStyle = `rgba(255, 255, 255, ${glint * 0.6})`;
      ctx.beginPath();
      ctx.arc(-size * 0.08 * coin.s, -size * 0.08 * coin.s, size * 0.08 * coin.s, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Glow
    ctx.globalAlpha = 0.3;
    const glowGradient = ctx.createRadialGradient(0, -size * 0.2, 0, 0, -size * 0.2, size * 1.5);
    glowGradient.addColorStop(0, '#FFD700');
    glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(-size * 1.5, -size * 1.5, size * 3, size * 1.5);

    ctx.restore();
  },
  drawSmallGoldPot(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    // Pot (black cauldron)
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;

    ctx.beginPath();
    // Arc for the top of the pot
    ctx.arc(0, -size * 0.4, size * 0.7, 0, Math.PI, true);
    // Sides of the pot
    ctx.lineTo(size * 0.7, size * 0.4);
    ctx.quadraticCurveTo(0, size * 0.6, -size * 0.7, size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gold coins overflowing (simple blob)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -size * 0.7, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
  drawRainbow(ctx, particle) {
    const startX = particle.startX;
    const endX = particle.endX;
    const endY = particle.endY;
    const canvasHeight = particle.height;

    ctx.save();
    ctx.globalAlpha = 0.5;

    const rainbowWidth = Math.abs(endX - startX);
    const centerX = (startX + endX) / 2;
    const rainbowHeight = canvasHeight * 0.2;

    // Calculate radius and center Y for a circular arc
    const radius = (rainbowWidth * rainbowWidth + 4 * rainbowHeight * rainbowHeight) / (8 * rainbowHeight);
    const arcCenterY = endY + rainbowHeight - radius;

    // Draw 7 rainbow bands from outer to inner
    const colors = this.colors.rainbow;
    const bandWidth = 5; // Smaller bands for the compact rainbow

    for (let i = colors.length - 1; i >= 0; i--) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = bandWidth;
      ctx.beginPath();
      ctx.arc(centerX, arcCenterY, radius + (colors.length - 1 - i) * bandWidth, Math.PI, 0);
      ctx.stroke();
    }

    ctx.restore();

    // Draw single small gold pot at the right end
    const potSize = 20;
    this.drawSmallGoldPot(ctx, endX, endY, potSize);
  },
  drawBanshee(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y + Math.sin(time * particle.waveFrequency + particle.waveOffset) * particle.waveAmplitude;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Intense ghostly aura (larger, more ethereal)
    const aura = ctx.createRadialGradient(0, -size * 0.5, 0, 0, -size * 0.5, size * 3);
    aura.addColorStop(0, 'rgba(180, 255, 180, 0.4)');
    aura.addColorStop(0.3, 'rgba(150, 255, 150, 0.2)');
    aura.addColorStop(0.6, 'rgba(120, 255, 120, 0.1)');
    aura.addColorStop(1, 'rgba(100, 255, 100, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(-size * 3, -size * 3, size * 6, size * 6);

    // Flowing tattered shroud (multiple layers for depth)
    const shroudWave = Math.sin(time * 0.008 + particle.wailPhase) * size * 0.25;

    // Back layer (darker, more transparent)
    ctx.fillStyle = 'rgba(200, 240, 200, 0.3)';
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, -size * 1.2);
    ctx.bezierCurveTo(
      -size * 1.2 + shroudWave * 2, -size * 0.4,
      -size * 1.0 + shroudWave * 1.5, size * 0.6,
      -size * 0.6 + shroudWave, size * 1.8
    );
    ctx.bezierCurveTo(
      -size * 0.3, size * 1.5,
      size * 0.3, size * 1.5,
      size * 0.6 - shroudWave, size * 1.8
    );
    ctx.bezierCurveTo(
      size * 1.0 - shroudWave * 1.5, size * 0.6,
      size * 1.2 - shroudWave * 2, -size * 0.4,
      size * 0.8, -size * 1.2
    );
    ctx.closePath();
    ctx.fill();

    // Main shroud (brighter, more solid)
    ctx.fillStyle = 'rgba(230, 255, 230, 0.85)';
    ctx.strokeStyle = 'rgba(180, 255, 180, 0.6)';
    ctx.lineWidth = size * 0.04;
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, -size * 1.0);
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const waveOffset = Math.sin(time * 0.012 + t * Math.PI * 3 + particle.wailPhase) * size * 0.3;
      const posX = (t - 0.5) * size * 1.8 + waveOffset;
      const posY = -size * 1.0 + t * size * 2.2;

      if (i === 0) {
        ctx.moveTo(posX, posY);
      } else {
        ctx.lineTo(posX, posY);
      }
    }
    ctx.lineTo(-size * 0.5, -size * 1.0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tattered edges (vertical streaks)
    ctx.strokeStyle = 'rgba(180, 255, 180, 0.4)';
    ctx.lineWidth = size * 0.02;
    for (let i = 0; i < 8; i++) {
      const xPos = -size * 0.7 + i * (size * 1.4 / 7);
      const streakWave = Math.sin(time * 0.015 + i * 0.8) * size * 0.2;
      ctx.beginPath();
      ctx.moveTo(xPos, size * 0.4);
      ctx.lineTo(xPos + streakWave, size * 1.2 + (i % 2) * size * 0.4);
      ctx.stroke();
    }

    // Gaunt head and elongated face
    const headTilt = Math.sin(time * 0.006) * 0.15;
    ctx.save();
    ctx.rotate(headTilt);

    // Head (very pale, almost translucent)
    ctx.fillStyle = 'rgba(240, 255, 240, 0.9)';
    ctx.strokeStyle = 'rgba(180, 230, 180, 0.5)';
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.8, size * 0.35, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hollow, sunken eye sockets (dark green shadows)
    ctx.fillStyle = 'rgba(50, 100, 50, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-size * 0.15, -size * 0.85, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.15, -size * 0.85, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Intensely glowing eyes (pulsing bright green)
    const eyePulse = 0.6 + Math.sin(time * 0.008 + particle.wailPhase) * 0.4;
    ctx.fillStyle = `rgba(100, 255, 150, ${eyePulse})`;
    ctx.shadowColor = '#64ff96';
    ctx.shadowBlur = size * 0.6;
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.85, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.85, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Gaping mouth (wailing/screaming - O shape)
    const mouthOpen = 0.2 + Math.sin(time * 0.01 + particle.wailPhase) * 0.1;
    ctx.fillStyle = 'rgba(80, 150, 80, 0.7)';
    ctx.strokeStyle = 'rgba(50, 100, 50, 0.8)';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.6, size * 0.15, size * (0.2 + mouthOpen), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Wild, flowing hair (very long, chaotic strands)
    ctx.strokeStyle = 'rgba(220, 255, 220, 0.7)';
    for (let i = 0; i < 12; i++) {
      const hairX = -size * 0.35 + (i / 11) * size * 0.7;
      const hairWave1 = Math.sin(time * 0.01 + i * 0.6 + particle.wailPhase) * size * 0.5;
      const hairWave2 = Math.cos(time * 0.008 + i * 0.4) * size * 0.3;

      ctx.lineWidth = size * (0.04 + (i % 3) * 0.02);
      ctx.beginPath();
      ctx.moveTo(hairX, -size * 1.1);
      ctx.bezierCurveTo(
        hairX + hairWave1 * 0.3, -size * 0.5,
        hairX + hairWave1 * 0.6 + hairWave2 * 0.5, size * 0.2,
        hairX + hairWave1 + hairWave2, size * 1.0 + (i % 2) * size * 0.5
      );
      ctx.stroke();
    }

    // Spectral hands reaching forward
    const handReach = Math.sin(time * 0.01 + particle.wailPhase) * size * 0.3;

    // Left hand
    ctx.fillStyle = 'rgba(230, 255, 230, 0.8)';
    ctx.strokeStyle = 'rgba(180, 230, 180, 0.6)';
    ctx.lineWidth = size * 0.02;
    ctx.save();
    ctx.translate(-size * 0.6, -size * 0.2);
    ctx.rotate(-0.3 + handReach * 0.002);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Fingers (skeletal)
    for (let f = 0; f < 4; f++) {
      const fingerX = -size * 0.08 + f * size * 0.055;
      ctx.beginPath();
      ctx.moveTo(fingerX, size * 0.15);
      ctx.lineTo(fingerX, size * 0.35);
      ctx.stroke();
    }
    ctx.restore();

    // Right hand
    ctx.save();
    ctx.translate(size * 0.6, -size * 0.2);
    ctx.rotate(0.3 - handReach * 0.002);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Fingers
    for (let f = 0; f < 4; f++) {
      const fingerX = -size * 0.08 + f * size * 0.055;
      ctx.beginPath();
      ctx.moveTo(fingerX, size * 0.15);
      ctx.lineTo(fingerX, size * 0.35);
      ctx.stroke();
    }
    ctx.restore();

    // Ethereal wisps trailing behind
    ctx.strokeStyle = 'rgba(180, 255, 180, 0.3)';
    ctx.lineWidth = size * 0.02;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const wispWave = Math.sin(time * 0.01 + i * 0.8) * size * 0.6;
      const wispLength = size * (1.5 + (i % 2) * 0.5);
      ctx.beginPath();
      ctx.moveTo(0, size * 0.4);
      ctx.bezierCurveTo(
        Math.cos(angle) * size * 0.8 + wispWave * 0.5, size * 1.0,
        Math.cos(angle) * size * 1.5 + wispWave, size * 1.8,
        Math.cos(angle) * wispLength + wispWave * 1.5, size * 2.5
      );
      ctx.stroke();
    }

    ctx.restore();
  },
};
export const halloween = {
  colors: {greenStem: '#228B22', rainbow: ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']},
  drawWitch(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y + Math.sin(time * particle.waveFrequency + particle.waveOffset) * particle.waveAmplitude;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Broomstick (horizontal, pointing backward relative to direction of travel)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = size * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.6);  // Start point near witch's body
    ctx.lineTo(-size * 1.5, size * 0.6); // End point extending backward
    ctx.stroke();

    // Bristles (at back of broom)
    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = size * 0.06;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 3) * ((i / 7) - 0.5);
      ctx.beginPath();
      ctx.moveTo(-size * 1.5, size * 0.6); // Bristles start at the back of the broom
      ctx.lineTo(
        -size * 1.5 + Math.cos(angle) * size * 0.4,
        size * 0.6 + Math.sin(angle) * size * 0.4
      );
      ctx.stroke();
    }

    // Flowing black cloak (side profile)
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.6); // Bottom of cloak on broom
    ctx.quadraticCurveTo(-size * 0.5, size * 0.4, -size * 0.8, size * 0.1);
    ctx.lineTo(-size * 0.7, -size * 0.3);
    ctx.quadraticCurveTo(-size * 0.3, -size * 0.5, 0, -size * 0.6);
    ctx.lineTo(size * 0.3, -size * 0.4);
    ctx.lineTo(size * 0.3, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head (side profile, greenish skin)
    ctx.fillStyle = '#8B9355';
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.6, size * 0.3, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crooked nose (prominent hooked nose)
    ctx.fillStyle = '#7a8245';
    ctx.beginPath();
    ctx.moveTo(size * 0.45, -size * 0.6);
    ctx.quadraticCurveTo(size * 0.7, -size * 0.65, size * 0.72, -size * 0.5);
    ctx.lineTo(size * 0.6, -size * 0.52);
    ctx.quadraticCurveTo(size * 0.58, -size * 0.58, size * 0.4, -size * 0.55);
    ctx.closePath();
    ctx.fill();

    // Pointed witch hat (side profile)
    ctx.fillStyle = '#2C1810';
    // Hat cone (tilted forward)
    ctx.beginPath();
    ctx.moveTo(size * 0.05, -size * 0.85);
    ctx.lineTo(size * 0.4, -size * 1.6);
    ctx.lineTo(size * 0.5, -size * 0.8);
    ctx.closePath();
    ctx.fill();
    // Hat brim
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.85, size * 0.5, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye (single glowing eye, profile view)
    ctx.fillStyle = '#ff6600';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = size * 0.3;
    ctx.beginPath();
    ctx.arc(size * 0.35, -size * 0.65, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Hands gripping broom
    ctx.fillStyle = '#8B9355';
    ctx.beginPath();
    ctx.arc(size * 0.1, size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.3, size * 0.55, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Legs dangling
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(size * 0.15, size * 0.6);
    ctx.lineTo(size * 0.1, size * 1.0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.05, size * 0.6);
    ctx.lineTo(size * 0.2, size * 0.95);
    ctx.stroke();

    ctx.restore();
  },
  drawCauldron(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.translate(x, y);

    // Cauldron body
    ctx.fillStyle = '#222222';
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI);
    ctx.lineTo(-size * 0.8, size * 0.5);
    ctx.quadraticCurveTo(0, size * 0.8, size * 0.8, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Legs
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    [-size * 0.5, 0, size * 0.5].forEach(legX => {
      ctx.beginPath();
      ctx.moveTo(legX, size * 0.5);
      ctx.lineTo(legX, size * 0.9);
      ctx.stroke();
    });

    // Bubbling potion (green)
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.7, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bubbles
    particle.bubbles.forEach(bubble => {
      ctx.globalAlpha = bubble.opacity;
      ctx.fillStyle = '#88ff88';
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Smoke/steam
    particle.smoke.forEach(smoke => {
      ctx.globalAlpha = smoke.opacity;
      ctx.fillStyle = '#aaaaaa';
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  },
  drawSpider(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Calculate swing position
    const swingOffset = Math.sin(time * particle.swingSpeed + particle.swingPhase) * particle.swingAmplitude;

    ctx.save();
    ctx.globalAlpha = particle.opacity;

    // Thread
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + swingOffset, y + particle.threadLength);
    ctx.stroke();
    ctx.setLineDash([]);

    // Spider body
    ctx.translate(x + swingOffset, y + particle.threadLength);
    ctx.fillStyle = '#000000';

    // Abdomen
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Legs (8 legs)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = size * 0.1;
    const legAngle = Math.sin(time * 0.005) * 0.2;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI - Math.PI / 2;
      const legLength = size * 1.5;

      // Left legs
      ctx.beginPath();
      ctx.moveTo(-size * 0.3, -size * 0.2 + i * size * 0.2);
      ctx.quadraticCurveTo(
        -size - Math.sin(angle + legAngle) * size * 0.3,
        -size * 0.2 + i * size * 0.2 - size * 0.5,
        -size * 1.2,
        -size * 0.2 + i * size * 0.2
      );
      ctx.stroke();

      // Right legs
      ctx.beginPath();
      ctx.moveTo(size * 0.3, -size * 0.2 + i * size * 0.2);
      ctx.quadraticCurveTo(
        size + Math.sin(angle + legAngle) * size * 0.3,
        -size * 0.2 + i * size * 0.2 - size * 0.5,
        size * 1.2,
        -size * 0.2 + i * size * 0.2
      );
      ctx.stroke();
    }

    // Eyes (8 eyes)
    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-size * 0.15 + (i % 2) * size * 0.3, -size * 0.55 + Math.floor(i / 2) * size * 0.1, size * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
  drawSpiderSmall(ctx, particle) {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    // Tiny spider body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    ctx.fill();

    // Tiny legs
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = particle.size * 0.3;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI - Math.PI / 2;
      // Left leg
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * particle.size * 2, Math.sin(angle) * particle.size * 2);
      ctx.stroke();
      // Right leg
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-Math.cos(angle) * particle.size * 2, Math.sin(angle) * particle.size * 2);
      ctx.stroke();
    }

    ctx.restore();
  },
  drawGravestone(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = '#555555';
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;

    if (particle.shape === 'rounded') {
      // Rounded top gravestone
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, size * 0.8);
      ctx.lineTo(-size * 0.5, -size * 0.3);
      ctx.arc(0, -size * 0.3, size * 0.5, Math.PI, 0);
      ctx.lineTo(size * 0.5, size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (particle.shape === 'cross') {
      // Cross-shaped gravestone
      ctx.fillRect(-size * 0.15, -size, size * 0.3, size * 1.8);
      ctx.fillRect(-size * 0.5, -size * 0.3, size, size * 0.3);
    } else {
      // Obelisk
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, size * 0.8);
      ctx.lineTo(-size * 0.5, -size * 0.5);
      ctx.lineTo(0, -size);
      ctx.lineTo(size * 0.5, -size * 0.5);
      ctx.lineTo(size * 0.4, size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Moss/aging texture
    ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
    ctx.fillRect(-size * 0.4, size * 0.5, size * 0.8, size * 0.3);

    // RIP text
    ctx.fillStyle = '#222222';
    ctx.font = `${size * 0.4}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RIP', 0, 0);

    ctx.restore();
  },
};
export const valentines = {
  colors: {greenStem: '#228B22', rainbow: ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']},
  drawLips(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Pulsing/kissing effect
    const pulse = 1 + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.1;
    const kissAnimation = Math.sin(time * 0.008 + particle.kissPhase);

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);
    ctx.scale(pulse, pulse);

    // Lip color with gradient (darker at edges)
    const lipGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
    lipGradient.addColorStop(0, particle.color);
    lipGradient.addColorStop(0.6, particle.color);
    lipGradient.addColorStop(1, '#8b0000');

    ctx.fillStyle = lipGradient;
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = size * 0.1;

    // Upper lip (two curves meeting in middle)
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    // Left side of cupid's bow
    ctx.bezierCurveTo(
      -size * 0.8, -size * 0.8,
      -size * 0.3, -size * 1.0,
      0, -size * 0.6
    );
    // Right side of cupid's bow
    ctx.bezierCurveTo(
      size * 0.3, -size * 1.0,
      size * 0.8, -size * 0.8,
      size, 0
    );
    ctx.fill();
    ctx.stroke();

    // Lower lip (fuller, puckered)
    const puckerAmount = kissAnimation * size * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.bezierCurveTo(
      -size * 0.7, size * (0.7 + puckerAmount),
      -size * 0.3, size * (1.0 + puckerAmount),
      0, size * (0.8 + puckerAmount)
    );
    ctx.bezierCurveTo(
      size * 0.3, size * (1.0 + puckerAmount),
      size * 0.7, size * (0.7 + puckerAmount),
      size, 0
    );
    ctx.fill();
    ctx.stroke();

    // Glossy highlight on upper lip
    ctx.globalAlpha = particle.opacity * 0.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-size * 0.4, -size * 0.4, size * 0.2, size * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.4, -size * 0.4, size * 0.2, size * 0.15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Glossy highlight on lower lip (center)
    ctx.beginPath();
    ctx.ellipse(0, size * 0.5, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Optional: add tiny sparkle for "mwah" kiss effect
    if (kissAnimation > 0.8) {
      const sparkleDistance = size * 1.5;
      const sparkleX = Math.sin(particle.kissPhase) * sparkleDistance;
      const sparkleY = -Math.abs(Math.cos(particle.kissPhase)) * sparkleDistance;

      ctx.globalAlpha = particle.opacity * (kissAnimation - 0.8) * 5;
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = size * 0.5;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Star sparkle
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + time * 0.01;
        const tipX = sparkleX + Math.cos(angle) * size * 0.4;
        const tipY = sparkleY + Math.sin(angle) * size * 0.4;
        ctx.beginPath();
        ctx.moveTo(sparkleX, sparkleY);
        ctx.lineTo(tipX, tipY);
        ctx.lineWidth = size * 0.05;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }
    }

    ctx.restore();
  },
  drawLoveLetter(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Envelope
    ctx.fillStyle = '#fff5e6';
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 1;
    ctx.fillRect(-size, -size * 0.7, size * 2, size * 1.4);
    ctx.strokeRect(-size, -size * 0.7, size * 2, size * 1.4);

    // Envelope flap (top triangle)
    ctx.fillStyle = '#ffe4b3';
    ctx.beginPath();
    ctx.moveTo(-size, -size * 0.7);
    ctx.lineTo(0, 0);
    ctx.lineTo(size, -size * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heart seal
    ctx.fillStyle = '#dc143c';
    ctx.shadowColor = '#dc143c';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.1);
    ctx.bezierCurveTo(-size * 0.3, -size * 0.1, -size * 0.2, -size * 0.3, 0, -size * 0.15);
    ctx.bezierCurveTo(size * 0.2, -size * 0.3, size * 0.3, -size * 0.1, 0, size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },
  drawEnvelope(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Envelope body
    ctx.fillStyle = '#fff5f5';
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = size * 0.05;
    ctx.fillRect(-size * 0.7, -size * 0.5, size * 1.4, size);
    ctx.strokeRect(-size * 0.7, -size * 0.5, size * 1.4, size);

    // Envelope flap (closed)
    ctx.fillStyle = '#ffe4e1';
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, -size * 0.5);
    ctx.lineTo(0, size * 0.1);
    ctx.lineTo(size * 0.7, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heart seal
    ctx.fillStyle = '#ff1493';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = size * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.25);
    ctx.bezierCurveTo(
      -size * 0.3, -size * 0.1,
      -size * 0.2, -size * 0.3,
      0, -size * 0.15
    );
    ctx.bezierCurveTo(
      size * 0.2, -size * 0.3,
      size * 0.3, -size * 0.1,
      0, size * 0.25
    );
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },
  drawHeartGarland(ctx, particle, time) {
    const y = particle.y;
    const width = particle.width;
    const sag = particle.sag;
    const hearts = particle.hearts;

    ctx.save();
    ctx.globalAlpha = particle.opacity;

    // Sway effect
    const swayOffset = Math.sin(time * 0.001 + particle.swayPhase) * particle.swayAmplitude;

    // String
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(width / 2, y + sag + swayOffset, width, y);
    ctx.stroke();

    // Hearts along the string
    hearts.forEach(heart => {
      const heartX = heart.offset * width;
      const heartY = y + Math.sin(Math.PI * heart.offset) * (sag + swayOffset);

      // Pulsing
      const pulse = 1 + Math.sin(time * 0.003 + heart.pulsePhase) * 0.1;

      ctx.save();
      ctx.translate(heartX, heartY);
      ctx.scale(pulse, pulse);

      ctx.fillStyle = heart.color;
      ctx.shadowColor = heart.color;
      ctx.shadowBlur = heart.size * 0.5;

      // Heart shape
      ctx.beginPath();
      ctx.moveTo(0, heart.size * 0.3);
      ctx.bezierCurveTo(
        -heart.size, -heart.size * 0.3,
        -heart.size * 0.6, -heart.size,
        0, -heart.size * 0.4
      );
      ctx.bezierCurveTo(
        heart.size * 0.6, -heart.size,
        heart.size, -heart.size * 0.3,
        0, heart.size * 0.3
      );
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.restore();
    });

    ctx.restore();
  },
};
