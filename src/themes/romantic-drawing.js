import {path, ellipse, gradient, rect} from './christmas-drawing.js';
import {beginIllustration as begin, line, heart} from './illustration-utils.js';

export function drawLips(ctx,p,time=0) {
  if(!begin(ctx,p))return;
  const pulse=1+Math.sin(time*0.003+(p.kissPhase||0))*0.035;ctx.scale(pulse,pulse);
  path(ctx,[['moveTo',-1,0],['bezierCurveTo',-0.52,-0.1,-0.37,-0.65,0,-0.32],['bezierCurveTo',0.37,-0.65,0.52,-0.1,1,0],['quadraticCurveTo',0.35,0.2,0,0.09],['quadraticCurveTo',-0.35,0.2,-1,0],['closePath']],gradient(ctx,-0.5,0.15,['#e68a8f',p.color||'#b53d5b']),'#963c53',0.025);
  path(ctx,[['moveTo',-1,0],['quadraticCurveTo',0,0.9,1,0],['quadraticCurveTo',0.25,0.18,0,0.08],['quadraticCurveTo',-0.25,0.18,-1,0],['closePath']],gradient(ctx,0,0.5,[p.color||'#bd4963','#d5767e']),'#963c53',0.025);
  line(ctx,[['moveTo',-0.81,0.05],['quadraticCurveTo',-0.3,0.17,0,0.08],['quadraticCurveTo',0.3,0.17,0.81,0.05]],'#80384e',0.03);
  line(ctx,[['moveTo',-0.3,0.34],['quadraticCurveTo',0,0.43,0.27,0.32]],'#f8bcaf',0.035);ctx.restore();
}
function envelope(ctx,open) {
  const ink='#b39887';
  if(open) {
    path(ctx,[['moveTo',-0.94,-0.34],['lineTo',-0.14,-1.04],['quadraticCurveTo',0,-1.16,0.14,-1.04],['lineTo',0.94,-0.34],['closePath']],'#d9bdaa',ink,0.02);
    rect(ctx,-0.71,-0.86,1.42,1.1,0.035,gradient(ctx,-0.9,0.3,['#fff9e6','#e9dcc5']),ink,0.02);
    heart(ctx,0,-0.61,0.18,'#bf6170');
    for(let i=0;i<3;i++)line(ctx,[['moveTo',-0.48,-0.3+i*0.13],['quadraticCurveTo',-0.08,-0.34+i*0.13,0.44-i*0.12,-0.3+i*0.13]],'#baa994',0.018);
  }
  rect(ctx,-1,-0.43,2,1.12,0.045,gradient(ctx,-0.4,0.7,['#f9ead6','#dec6b5']),ink,0.025);
  path(ctx,[['moveTo',-0.98,-0.4],['lineTo',0,0.31],['lineTo',0.98,-0.4],['lineTo',0.98,0.66],['lineTo',-0.98,0.66],['closePath']],'#f1dfc7',ink,0.018);
  line(ctx,[['moveTo',-0.97,0.65],['lineTo',-0.16,0.11],['moveTo',0.97,0.65],['lineTo',0.16,0.11]],'#c8b19b',0.018);
  if(!open)path(ctx,[['moveTo',-0.98,-0.41],['lineTo',-0.08,0.24],['quadraticCurveTo',0,0.31,0.08,0.24],['lineTo',0.98,-0.41],['closePath']],gradient(ctx,-0.45,0.3,['#fff2dc','#e2ccb5']),ink,0.02);
  ellipse(ctx,0,0.27,0.16,0.145,'#994352');ellipse(ctx,-0.012,0.252,0.13,0.115,'#bc6370');
  ctx.save();ctx.translate(0,0.25);ctx.scale(0.12,0.12);heart(ctx,0,0,0.8,'#d99194','#8b3d50');ctx.restore();
}
export function drawLoveLetter(ctx,p) {if(!begin(ctx,p))return;envelope(ctx,true);ctx.restore();}
export function drawEnvelope(ctx,p) {if(!begin(ctx,p))return;ctx.scale(0.72,0.72);envelope(ctx,false);ctx.restore();}
export function drawHeartGarland(ctx,p,time=0) {
  if(![p.y,p.width].every(Number.isFinite)||p.width<=0)return;
  ctx.save();ctx.globalAlpha*=p.opacity??1;
  const x=p.x||0,sag=(p.sag??50)+Math.sin(time*0.001+(p.swayPhase||0))*(p.swayAmplitude??10);
  line(ctx,[['moveTo',x,p.y],['quadraticCurveTo',x+p.width/2,p.y+sag,x+p.width,p.y]],'#b19a74',1.3);
  for(const h of p.hearts||[]) {
    if(![h.offset,h.size].every(Number.isFinite)||h.size<=0)continue;
    // This is the quadratic cord's exact curve, so each heart stays attached.
    const t=h.offset,hx=x+t*p.width,hy=p.y+2*(1-t)*t*sag;
    line(ctx,[['moveTo',hx,hy],['lineTo',hx,hy+7]],'#bca780',0.8);
    ctx.save();ctx.translate(hx,hy+7+h.size*0.6);ctx.rotate(Math.sin(time*0.0015+t*6)*0.09);
    const pulse=1+Math.sin(time*0.003+(h.pulsePhase||0))*0.035;
    const paint=gradient(ctx,-h.size,h.size,['#ecb0a8',h.color||'#bc6174']);
    heart(ctx,0,0,h.size*pulse,paint);
    line(ctx,[['moveTo',0,-h.size*0.25],['lineTo',0,h.size*0.5]],'rgba(255,231,212,0.45)',0.5);
    ctx.restore();
  }
  ctx.restore();
}
