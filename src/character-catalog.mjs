/** Standalone character names, drawing bounds and displayed heights in pixels. */
export const CHARACTER_SIZES = Object.freeze({small: 96, medium: 160, large: 240, xlarge: 360});

export const CHARACTERS = Object.freeze({
  'mooning-leprechaun': {label: 'Mooning leprechaun', module: 'mooning', draw: 'drawMooningLeprechaun', bounds: [-0.9, -1.55, 0.9, 1.5]},
  'mooning-elf': {label: 'Mooning elf', module: 'mooning', draw: 'drawMooningElf', bounds: [-0.9, -1.55, 0.9, 1.5]},
  leprechaun: {label: 'Leprechaun', module: 'characters', draw: 'drawLeprechaun', bounds: [-0.7, -1.55, 0.7, 1.6]},
  elf: {label: 'Elf', module: 'festive', draw: 'drawElf', bounds: [-0.8, -1.55, 0.85, 1.2]},
  'peeing-elf': {label: 'Peeing elf', module: 'festive', draw: 'drawElf', bounds: [-0.8, -1.55, 1.6, 1.2]},
  'thieving-elf': {label: 'Thieving elf', module: 'festive', draw: 'drawElf', bounds: [-0.8, -1.55, 1.1, 1.2]},
  bagpiper: {label: 'Bagpiper', module: 'characters', draw: 'drawBagpiper', bounds: [-0.7, -1.5, 0.7, 1.6]},
  knight: {label: 'Knight', module: 'characters', draw: 'drawKnight', bounds: [-1, -1.5, 0.8, 1.6]},
  dragon: {label: 'Dragon', module: 'characters', draw: 'drawDragon', bounds: [-2, -1.5, 1.8, 0.9]},
  'welsh-dragon': {label: 'Welsh dragon', module: 'characters', draw: 'drawWelshDragon', bounds: [-2, -1.5, 1.8, 0.9]},
  cupid: {label: 'Cupid', module: 'characters', draw: 'drawCupid', bounds: [-1.4, -1.25, 1.9, 1.25]},
  robin: {label: 'Robin', module: 'festive', draw: 'drawRobin', bounds: [-1.35, -1.5, 1.1, 1.25]},
  snowman: {label: 'Snowman', module: 'festive', draw: 'drawSnowman', bounds: [-2, -1.5, 2, 2.6]}
});

export function resolveCharacterSize(value = 'medium') {
  const key = String(value).toLowerCase();
  const named = Object.hasOwn(CHARACTER_SIZES, key) ? CHARACTER_SIZES[key] : null;
  if (named) return named;
  const text = String(value).trim();
  const size = /^\d+(?:\.\d+)?(?:px)?$/i.test(text) ? Number(text.replace(/px$/i, '')) : NaN;
  return Number.isFinite(size) && size > 0 ? Math.min(1024, Math.max(16, size)) : CHARACTER_SIZES.medium;
}

export function getCharacters() {
  return Object.entries(CHARACTERS).map(([name, {label}]) => ({name, label}));
}
