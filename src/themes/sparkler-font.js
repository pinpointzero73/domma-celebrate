let fonts = null;
let loading = null;

/** Only custom text loads the complete fonts; preset greetings keep their strokes. */
export async function prepareSparklerFont(message) {
  if (typeof message !== 'string' || !message.trim()) return;
  if (!loading) loading = import('./sparkler-font-data.js').then(module => {fonts = module;});
  await loading;
}

export function sparklerFont(style) {
  return fonts?.[style === 'cursive' ? 'CURSIVE_FONT' : 'STROKE_FONT'] || null;
}
