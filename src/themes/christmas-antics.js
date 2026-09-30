/** Opt-in elf scenes. Scene particles manage their own motion (`static: true`). */
export function spawnElfAntic(particles, width, height, config = {}) {
  for (const [type, key] of [['peeing-elf', 'peeingElfChance'], ['thieving-elf', 'thievingElfChance']]) {
    if (!(config[key] > 0) || particles.some(p => p.active && p.type === type)) continue;
    if (Math.random() >= config[key]) continue;
    const trees = particles.filter(p => p.type === 'tree' && p.active && p.gifts?.some(gift => !gift.stolen && !gift.reserved));
    // The thief needs a real visible present. No tree means no theft scene.
    if (type === 'thieving-elf' && !trees.length) continue;
    const tree = trees[Math.floor(Math.random() * trees.length)];
    const fromLeft = Math.random() < 0.5;
    const size = 13 + Math.random() * 3;
    const elf = {
      type, x: fromLeft ? -40 : width + 40, y: height - size * 1.02 - 8,
      size, vx: fromLeft ? 1 : -1, vy: 0, opacity: 0.95, rotation: 0,
      time: 0, state: 'approaching', stateTime: 0, active: true, static: true,
      targetX: tree ? tree.x + tree.size * 0.7 : width * (fromLeft ? 0.72 : 0.28),
      targetTree: tree || null
    };
    if (type === 'thieving-elf') {
      elf.gift = tree.gifts.find(gift => !gift.stolen && !gift.reserved);
      elf.gift.reserved = true;
      elf.targetX = tree.x + (elf.gift.x + elf.gift.width / 2) * tree.size;
      elf.y = tree.y + (elf.gift.y + elf.gift.height) * tree.size - size * 1.02;
    }
    return elf;
  }
  return null;
}

export function updateElfAntic(elf, deltaTime, width) {
  const dt = Math.max(0, Math.min(deltaTime, 50));
  // If a tree disappears while the scene is running, leave without a gift.
  if (elf.type === 'thieving-elf' && !elf.targetTree?.active) {
    if (elf.gift) elf.gift.reserved = false;
    elf.active = false;
    return;
  }
  elf.stateTime += dt;
  if (elf.state === 'approaching') {
    const dx = elf.targetX - elf.x;
    const step = (elf.type === 'thieving-elf' ? 145 : 75) * dt / 1000;
    elf.vx = dx >= 0 ? 1 : -1;
    if (Math.abs(dx) <= step) {
      elf.x = elf.targetX;
      elf.state = elf.type === 'thieving-elf' ? 'grabbing' : 'peeing';
      elf.stateTime = 0;
    } else elf.x += Math.sign(dx) * step;
  } else if (elf.state === 'grabbing' && elf.stateTime >= 450) {
    // Hide that exact tree present, then carry the same wrapping colour away.
    elf.gift.stolen = true;
    elf.gift.reserved = false;
    elf.state = 'escaping'; elf.stateTime = 0;
    elf.vx = elf.x < width / 2 ? -1 : 1;
  } else if (elf.state === 'peeing' && elf.stateTime >= 4200) {
    elf.state = 'escaping'; elf.stateTime = 0;
    elf.vx = elf.x < width / 2 ? -1 : 1;
  } else if (elf.state === 'escaping') {
    elf.x += elf.vx * (elf.type === 'thieving-elf' ? 230 : 90) * dt / 1000;
    if (elf.x < -60 || elf.x > width + 60) elf.active = false;
  }
}
