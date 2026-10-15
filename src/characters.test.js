import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {mountCharacter, getCharacters, resolveCharacterSize} from './characters.js';

let frames, next, ctx, media, host;
beforeEach(() => {
  frames = new Map(); next = 0;
  ctx = new Proxy({globalAlpha: 1}, {get(target, name) {
    if (name in target) return target[name];
    if (name === 'createLinearGradient') return () => ({addColorStop() {}});
    return () => {};
  }});
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(fn => {frames.set(++next, fn); return next;});
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id));
  media = {matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn()};
  window.matchMedia = () => media;
  host = document.createElement('div'); document.body.appendChild(host);
});
afterEach(() => {document.body.replaceChildren(); vi.restoreAllMocks();});

describe('standalone characters', () => {
  it('mounts every listed character without a seasonal overlay or calendar check', async () => {
    for (const {name} of getCharacters()) {
      const view = await mountCharacter(host, {character: name, size: 'large', animate: false});
      expect(host.children.length).toBe(1);
      expect(view.canvas.height).toBe(240 * Math.min(3, window.devicePixelRatio));
      expect(view.canvas.getAttribute('aria-label')).toBeTruthy();
      expect(frames.size).toBe(0);
      view.destroy(); expect(host.children.length).toBe(0);
    }
  });
  it.each([['small', 96], ['medium', 160], ['large', 240], ['xlarge', 360], [200, 200], ['200px', 200], [5000, 1024], ['oops', 160], ['__proto__', 160]])('size %s resolves to %s', (input, size) => {
    expect(resolveCharacterSize(input)).toBe(size);
  });
  it('pauses, resumes, replays and destroys without leaving an animation frame', async () => {
    const view = await mountCharacter(host, {character: 'mooning-elf'});
    expect(frames.size).toBe(1); view.pause(); expect(frames.size).toBe(0);
    view.play(); expect(frames.size).toBe(1); view.replay(); expect(frames.size).toBe(1);
    view.destroy(); view.destroy(); view.play(); expect(frames.size).toBe(0);
    expect(host.querySelector('canvas')).toBeNull();
    expect(media.removeEventListener).toHaveBeenCalled();
  });
  it('draws a still pose for reduced motion and suppresses hidden-tab work', async () => {
    media.matches = true;
    const view = await mountCharacter(host, {character: 'mooning-leprechaun'});
    expect(host.querySelector('canvas')).not.toBeNull(); expect(frames.size).toBe(0);
    media.matches = false; media.addEventListener.mock.calls[0][1](); expect(frames.size).toBe(1);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange')); expect(frames.size).toBe(0);
    view.destroy();
  });
  it('rejects unknown characters and missing containers without mounting anything', async () => {
    await expect(mountCharacter(host, {character: '__proto__'})).rejects.toThrow('Unknown');
    await expect(mountCharacter(null)).rejects.toThrow('container'); expect(host.children.length).toBe(0);
  });
});
