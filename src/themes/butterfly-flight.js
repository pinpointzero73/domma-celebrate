// The meadow palette and flight behaviour of Domma.effects.butterflies.
export const MEADOW_COLOURS = ['#84cc16', '#a3e635', '#bbf7d0', '#bae6fd', '#fef08a', '#ddd6fe'];
const pick = () => MEADOW_COLOURS[Math.floor(Math.random() * MEADOW_COLOURS.length)];

export function createGardenButterfly(width, height, scale = 1) {
  const heading = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
  return {
    type: 'garden-butterfly', static: true, active: true,
    x: Math.random() * width, y: height * (0.6 + Math.random() * 0.3),
    vx: 0, vy: 0, size: (20 + Math.random() * 12) * scale, opacity: 0.95,
    heading, targetHeading: heading, flightSpeed: 0.6 + Math.random() * 0.8,
    wanderTimer: Math.random() * 60, flapPhase: Math.random() * Math.PI * 2,
    flapSpeed: 0.18 + Math.random() * 0.12,
    colourUpper: pick(), colourLower: pick()
  };
}

export function updateGardenButterfly(p, delta, width, height) {
  const frames = Math.min(100, Math.max(0, delta)) / (1000 / 60);
  p.wanderTimer -= frames;
  if (p.wanderTimer <= 0) {
    p.targetHeading = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
    p.wanderTimer = 30 + Math.random() * 60;
  }
  let diff = p.targetHeading - p.heading;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  p.heading += diff * (1 - 0.95 ** frames);
  p.x += (Math.cos(p.heading) * p.flightSpeed + Math.sin(p.flapPhase) * 0.3) * frames;
  p.y += (Math.sin(p.heading) * p.flightSpeed - 0.4) * frames;
  p.flapPhase += p.flapSpeed * frames;
  if (p.x > width + 35) p.x = -35;
  if (p.x < -35) p.x = width + 35;
  if (p.y < -p.size) {p.y = height + p.size; p.x = Math.random() * width;}
}
