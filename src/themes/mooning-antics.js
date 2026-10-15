/** Shared approach, wiggle and exit scene for the two optional mooners. */
export function spawnMooningCharacter(particles, width, height, config, type, chanceKey) {
  if (!(config[chanceKey] > 0) || particles.some(p => p.active && p.type === type) || Math.random() >= config[chanceKey]) return null;
  const fromLeft = Math.random() < 0.5;
  const size = 16 + Math.random() * 4;
  return {
    type, size, x: fromLeft ? -size * 2 : width + size * 2,
    y: height - size * 1.4 - 8, vx: fromLeft ? 1 : -1, vy: 0,
    targetX: width * (0.3 + Math.random() * 0.4), opacity: 1,
    time: 0, stateTime: 0, state: 'approaching', active: true, static: true
  };
}

export function updateMooningCharacter(particle, deltaTime, width) {
  const dt = Math.max(0, Math.min(Number(deltaTime) || 0, 50));
  particle.time += dt;
  particle.stateTime += dt;
  if (particle.state === 'approaching') {
    const dx = particle.targetX - particle.x, step = dt * 0.08;
    if (Math.abs(dx) <= step) {
      particle.x = particle.targetX; particle.state = 'mooning'; particle.stateTime = 0;
    } else {particle.vx = Math.sign(dx); particle.x += particle.vx * step;}
  } else if (particle.state === 'mooning' && particle.stateTime >= 4200) {
    particle.state = 'escaping'; particle.stateTime = 0;
    particle.vx = particle.x < width / 2 ? -1 : 1;
  } else if (particle.state === 'escaping') {
    particle.x += particle.vx * dt * 0.12;
    if (particle.x < -particle.size * 2 || particle.x > width + particle.size * 2) particle.active = false;
  }
}
