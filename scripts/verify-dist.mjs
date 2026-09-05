/**
 * Post-build sanity check.
 *
 * Every artefact has failed silently at least once in some project or other:
 * a stale `dist/` that still builds, a UMD file that defines no global, a
 * code-split ESM entry whose theme chunks were never emitted. Each of those
 * ships happily and breaks at the consumer. This asserts the shape instead.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const failures = [];

function check(description, condition) {
  if (condition) return;
  failures.push(description);
}

const artefacts = [
  'dist/domma-celebrate.esm.js',
  'dist/domma-celebrate.min.js',
  'dist/domma-celebrate.cjs'
];

for (const file of artefacts) {
  check(`${file} exists`, existsSync(file));
  if (!existsSync(file)) continue;

  const source = readFileSync(file, 'utf8');
  check(`${file} carries the v${version} banner`, source.includes(`domma-celebrate v${version}`));
}

// The ESM entry must actually split: if the themes were inlined, a July visitor
// downloads all eight of them for nothing.
const chunkDir = 'dist/chunks';
check('dist/chunks exists', existsSync(chunkDir));
if (existsSync(chunkDir)) {
  const chunks = readdirSync(chunkDir);
  check(`dist/chunks holds at least 8 theme chunks (found ${chunks.length})`, chunks.length >= 8);

  const esm = readFileSync('dist/domma-celebrate.esm.js', 'utf8');
  check('ESM entry references its chunks', esm.includes('./chunks/'));
  check(
    'ESM entry does not inline a theme (christmas draw code leaked into the entry)',
    !esm.includes('drawSleigh')
  );
}

// The UMD build is the opposite promise: one file, nothing else to fetch.
if (existsSync('dist/domma-celebrate.min.js')) {
  const umd = readFileSync('dist/domma-celebrate.min.js', 'utf8');
  check('UMD defines the DommaCelebrate global', umd.includes('DommaCelebrate'));
  check('UMD inlines the themes', umd.includes('drawSleigh'));
  check('UMD has no unresolved chunk import', !umd.includes('./chunks/'));
}

if (failures.length) {
  console.error('dist verification failed:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`dist verified for v${version}: ${artefacts.length} artefacts, themes split in ESM and inlined in UMD.`);
