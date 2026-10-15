/** Shared standalone launcher, with explicit cleanup and an optional duration. */
export async function launchMakeItRain(Effect, options = {}, theme = 'make-it-rain') {
  if (options.respectMotionPreference !== false && typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
  const effect = new Effect({...options, theme});
  const ready = await effect.init();
  if (ready === false || !effect.initialized) {effect.destroy(); return null;}
  const raw = Number(options.duration);
  const duration = Number.isFinite(raw) && raw >= 0 ? Math.min(raw, 600000) : 8000;
  const destroy = effect.destroy.bind(effect);
  let timer = null;
  effect.destroy = () => {if (timer !== null) clearTimeout(timer); timer = null; destroy();};
  if (duration > 0) timer = setTimeout(() => effect.destroy(), duration);
  return effect;
}
