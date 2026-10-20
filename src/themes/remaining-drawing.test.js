import {describe, it, expect, vi} from 'vitest';
import * as botanical from './botanical-drawing.js';
import * as heritage from './heritage-drawing.js';
import * as spooky from './spooky-props-drawing.js';
import * as romantic from './romantic-drawing.js';
import english from './st-georges.js';
import scottish from './st-andrews.js';
import welsh from './st-davids.js';
import irish from './st-patricks.js';
import halloween from './halloween.js';
import valentines from './valentines.js';

// Model canvas state restoration as well as finite geometry. A drawing must
// preserve the host's opacity and transform even when composed in a scene.
function canvas() {
  const stack = [], calls = [];
  const state = {globalAlpha: 0.6};
  const ctx = new Proxy(state, {get(target, name) {
    if(name in target) return target[name];
    return (...args) => {
      for(const value of args) if(typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
      calls.push([name,...args]);
      if(name === 'save') stack.push({...target});
      if(name === 'restore') {
        expect(stack.length).toBeGreaterThan(0);
        const saved=stack.pop();
        for(const key of Object.keys(target)) delete target[key];
        Object.assign(target,saved);
      }
      if(name === 'createLinearGradient' || name === 'createRadialGradient') return {addColorStop: vi.fn()};
    };
  }});
  return {ctx, stack, calls};
}
const particle = {
  x:150,y:150,size:40,opacity:0.7,rotation:0,vx:-1,sway:0.2,
  flowers:[{x:0,y:0,size:12,swayPhase:0},{x:20,y:10,size:9,swayPhase:1}],
  width:400,sag:45,swayAmplitude:12,swayPhase:0,
  hearts:[{offset:0.25,size:10,color:'#cf7187',pulsePhase:0},{offset:0.75,size:12,color:'#b6546d',pulsePhase:1}],
  startX:40,endX:350,endY:220,height:300,
  threadLength:50,swingAmplitude:20,swingSpeed:0.002,swingPhase:0,
  waveAmplitude:10,waveFrequency:0.002,waveOffset:0
};
const drawings = {...botanical,...heritage,...spooky,...romantic};
delete drawings.drawSmallGoldPot;
describe('remaining seasonal illustrations', () => {
  for(const [name,draw] of Object.entries(drawings)) {
    it(`${name} draws deterministically, preserves its particle and restores host state`, () => {
      const c=canvas(),p=structuredClone(particle),before=structuredClone(p);
      const random=vi.spyOn(Math,'random').mockImplementation(()=>{throw new Error('Randomness during drawing causes flicker');});
      try {draw(c.ctx,p,1250);} finally {random.mockRestore();}
      expect(c.calls.length).toBeGreaterThan(0);
      expect(c.stack).toHaveLength(0);expect(c.ctx.globalAlpha).toBe(0.6);expect(p).toEqual(before);
    });
  }
  it('keeps the dangling spider attached to its thread as it swings', () => {
    const c=canvas();spooky.drawSpider(c.ctx,particle,1000);
    expect(c.calls).toContainEqual(['translate',Math.sin(2)*20/40,50/40]);
  });
  it('attaches garland hearts to the quadratic cord rather than a different curve', () => {
    const c=canvas();romantic.drawHeartGarland(c.ctx,{...particle,swayAmplitude:0},0);
    expect(c.calls).toContainEqual(['translate',250,150+2*0.75*0.25*45+7+10*0.6]);
  });
  it('keeps helper pots and all three gravestone variants composable', () => {
    const c=canvas();heritage.drawSmallGoldPot(c.ctx,10,20,12);
    for(const shape of ['rounded','cross','obelisk'])spooky.drawGravestone(c.ctx,{...particle,shape});
    expect(c.stack).toHaveLength(0);expect(c.ctx.globalAlpha).toBe(0.6);
  });
  for(const [name,draw] of Object.entries(drawings).filter(([name])=>!['drawRainbow','drawHeartGarland','drawDaffodilField'].includes(name))) {
    it.each([0,-1,NaN])(`${name} skips invalid size %s`,size=>{
      const c=canvas();draw(c.ctx,{...particle,size},1000);expect(c.calls).toHaveLength(0);
    });
  }
  for(const theme of [english,scottish,welsh,irish,halloween,valentines]) {
    it(`${theme.name} uses the new drawings for generated decorations and particles`, () => {
      const config=theme.intensityConfig.medium;
      const decorations=theme.createInitialDecorations(1024,768,config);
      const generated=[...decorations,...Array.from({length:30},()=>theme.createFallingParticle(1024,768,config))];
      let count=0;
      for(const p of generated) {
        const name='draw'+p.type.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('');
        if(!drawings[name])continue;
        expect(theme[name]).toBe(drawings[name]);
        const c=canvas();theme[name](c.ctx,p,1700);expect(c.stack).toHaveLength(0);count++;
      }
      expect(count).toBeGreaterThan(0);
    });
  }
});
