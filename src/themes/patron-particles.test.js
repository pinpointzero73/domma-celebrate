import {describe, it, expect, vi} from 'vitest';
import english from './st-georges.js';
import scottish from './st-andrews.js';
import welsh from './st-davids.js';
import irish from './st-patricks.js';
import {updateParticlePhysics} from '../core/physics.js';

const themes = [
  [english, ['createRosePetal', 'createTudorRose', 'createOakLeaf', 'createSparkle']],
  [scottish, ['createHeatherPetal', 'createThistle', 'createHeather', 'createSaltireSparkle']],
  [welsh, ['createDaffodilPetal', 'createDaffodil', 'createLeek', 'createSpringSparkle']],
  [irish, ['createCloverPetal', 'createShamrock', 'createGoldCoin', 'createSparkle']]
];

describe('Patron Saints Day particle placement', () => {
  for (const [theme, creators] of themes) {
    for (const creator of [...creators, 'createFallingParticle']) {
      it.each([0.1, 0.5, 0.9])(`${theme.name} ${creator} starts across the scene at %s of its width and height`, fraction => {
        const random = vi.spyOn(Math, 'random').mockReturnValue(fraction);
        try {
          const p = theme[creator](1000, 600, theme.intensityConfig.medium);
          expect(p.x).toBe(fraction * 1000);
          expect(p.y).toBe(fraction * 600);
          expect(p.vx).toBeGreaterThan(0);
          const x = p.x;
          // Isolate the existing horizontal velocity from the gust/sway layer.
          const drift = {...p, windSpeed: undefined};
          updateParticlePhysics(drift, 1000 / 60);
          expect(drift.x).toBeCloseTo(x + p.vx);
        } finally {
          random.mockRestore();
        }
      });
    }
  }
});
