import {path, ellipse, gradient, rect} from './christmas-drawing.js';
import {beginIllustration as begin, line, leaf} from './illustration-utils.js';

export function drawGravestone(ctx,p) {
  if(!begin(ctx,p))return;
  ellipse(ctx,0,0.78,0.72,0.12,'rgba(28,40,37,0.23)');
  let stone=[['moveTo',-0.48,0.7],['lineTo',-0.48,-0.35],['bezierCurveTo',-0.48,-0.91,0.48,-0.91,0.48,-0.35],['lineTo',0.48,0.7],['closePath']];
  const shape = p.shape || ['rounded', 'cross', 'obelisk'][p.variant || 0];
  if(shape === 'cross') stone=[['moveTo',-0.15,0.7],['lineTo',-0.15,-0.25],['lineTo',-0.48,-0.25],['lineTo',-0.48,-0.51],['lineTo',-0.15,-0.51],['lineTo',-0.15,-0.98],['lineTo',0.15,-0.98],['lineTo',0.15,-0.51],['lineTo',0.48,-0.51],['lineTo',0.48,-0.25],['lineTo',0.15,-0.25],['lineTo',0.15,0.7],['closePath']];
  if(shape === 'obelisk') stone=[['moveTo',-0.35,0.7],['lineTo',-0.4,-0.53],['lineTo',0,-0.97],['lineTo',0.4,-0.53],['lineTo',0.35,0.7],['closePath']];
  ctx.save();ctx.translate(0.055,0.02);path(ctx,stone,'#65706b','#485950',0.025);ctx.restore();
  path(ctx,stone,gradient(ctx,-0.8,0.8,['#b7beb0','#7e8e85']),'#53665d',0.028);
  ctx.save();ctx.clip();
  line(ctx,[['moveTo',-0.39,0.52],['lineTo',-0.39,-0.32],['bezierCurveTo',-0.39,-0.78,0.38,-0.78,0.38,-0.32],['lineTo',0.38,0.51]],'#d6d6bd',0.018);
  line(ctx,[['moveTo',0,-0.55],['lineTo',0,-0.18],['moveTo',-0.12,-0.42],['lineTo',0.12,-0.42]],'#63746a',0.044);
  // Engraved letter strokes remain legible without a font dependency.
  const letters=[[['moveTo',-0.25,0.2],['lineTo',-0.25,-0.02],['quadraticCurveTo',-0.08,-0.04,-0.12,0.08],['lineTo',-0.25,0.08],['moveTo',-0.2,0.08],['lineTo',-0.11,0.2]], [['moveTo',-0.03,-0.02],['lineTo',0.05,-0.02],['moveTo',0.01,-0.02],['lineTo',0.01,0.2],['moveTo',-0.03,0.2],['lineTo',0.05,0.2]], [['moveTo',0.14,0.2],['lineTo',0.14,-0.02],['quadraticCurveTo',0.34,-0.04,0.28,0.09],['lineTo',0.14,0.09]]];
  for(const letter of letters)line(ctx,letter,'#53665f',0.023);
  line(ctx,[['moveTo',0.3,-0.58],['lineTo',0.2,-0.42],['lineTo',0.29,-0.3],['lineTo',0.22,-0.18]],'#6f7f73',0.016);
  ctx.restore();
  rect(ctx,-0.57,0.63,1.14,0.14,0.035,'#89988a','#5d7163',0.023);
  for(const [x,y,s]of[[-0.41,0.53,0.12],[-0.32,0.6,0.1],[0.37,0.63,0.15]])ellipse(ctx,x,y,s,s*0.45,'#688366');
  leaf(ctx,-0.47,0.64,-0.3,0.27,'#5d795c');ctx.restore();
}
export function drawCauldron(ctx,p,time=0) {
  if(!begin(ctx,p))return;
  for(const side of [-1,1]) {
    rect(ctx,side*0.43-0.06,0.49,0.12,0.25,0.04,'#303f45');
    ellipse(ctx,side*0.68,-0.09,0.14,0.2,'#8a8f82');ellipse(ctx,side*0.68,-0.09,0.08,0.13,'#263a40');
  }
  path(ctx,[['moveTo',-0.58,-0.29],['bezierCurveTo',-0.95,0.21,-0.75,0.67,0,0.66],['bezierCurveTo',0.75,0.67,0.95,0.21,0.58,-0.29],['closePath']],gradient(ctx,-0.3,0.7,['#586b6d','#2f444a','#1e303b']),'#1f3139',0.035);
  ellipse(ctx,-0.27,0.15,0.13,0.29,'rgba(173,191,177,0.12)');
  ellipse(ctx,0,-0.29,0.63,0.16,'#8e9b8c');ellipse(ctx,0,-0.31,0.55,0.105,'#7fbb79');
  ellipse(ctx,-0.17,-0.34,0.19,0.035,'#c4d69a');
  for(let i=0;i<7;i++) {
    const phase=((time*0.0003+i*0.145)%1+1)%1;
    const x=Math.sin(i*2.7)*0.38+Math.sin(time*0.001+i)*0.03, y=-0.35-phase*0.9;
    ctx.save();ctx.globalAlpha*=1-phase;
    ellipse(ctx,x,y,0.035+(i%3)*0.014,0.04+(i%3)*0.014,'#a5d493');
    ellipse(ctx,x-0.012,y-0.012,0.012,0.012,'#e4efbe');ctx.restore();
  }
  for(let i=0;i<3;i++) {
    const shift=Math.sin(time*0.001+i)*0.08;
    line(ctx,[['moveTo',-0.3+i*0.28,-0.5],['bezierCurveTo',-0.45+i*0.28+shift,-0.8,-0.07+i*0.28,-0.85,-0.2+i*0.28+shift,-1.15]],'rgba(160,194,172,0.22)',0.035);
  }
  line(ctx,[['moveTo',-0.51,0.47],['quadraticCurveTo',0,0.67,0.51,0.47]],'#536a6c',0.02);ctx.restore();
}
function spider(ctx,time,phase=0) {
  for(const side of [-1,1])for(let i=0;i<4;i++) {
    const y=-0.23+i*0.12,step=Math.sin(time*0.006+phase+i)*0.04;
    line(ctx,[['moveTo',side*0.14,y],['quadraticCurveTo',side*0.49,y-0.34,side*(0.57+i*0.05),y-0.25],['lineTo',side*(0.77+i*0.045),y+0.16+step]],'#5d5264',0.045);
    line(ctx,[['moveTo',side*0.31,y-0.17],['lineTo',side*0.53,y-0.26]],'#9b8792',0.012);
  }
  ellipse(ctx,0,-0.18,0.28,0.35,gradient(ctx,-0.55,0.2,['#826b86','#403c52']));
  ellipse(ctx,-0.065,-0.31,0.09,0.14,'rgba(206,170,190,0.2)');
  ellipse(ctx,0,0.18,0.21,0.18,'#58465b');
  for(const side of [-1,1]) {ellipse(ctx,side*0.075,0.18,0.04,0.045,'#dfc69f');ellipse(ctx,side*0.075,0.19,0.018,0.025,'#302e3b');}
  line(ctx,[['moveTo',-0.04,0.31],['quadraticCurveTo',0,0.35,0.04,0.31]],'#b9979b',0.014);
}
export function drawSpider(ctx,p,time=0) {
  if(![p.x,p.y,p.size].every(Number.isFinite)||p.size<=0)return;
  const swing=Math.sin(time*(p.swingSpeed||0.002)+(p.swingPhase||0))*(p.swingAmplitude||0);
  const length=p.threadLength??50;
  if(!begin(ctx,p))return;
  line(ctx,[['moveTo',0,0],['lineTo',swing/p.size,length/p.size-0.48]],'rgba(203,207,198,0.5)',0.04);
  ctx.translate(swing/p.size,length/p.size);
  spider(ctx,time,p.legPhase||0);ctx.restore();
}
export function drawSpiderSmall(ctx,p,time=0) {if(!begin(ctx,p))return;spider(ctx,time,p.legPhase||0);ctx.restore();}
export function drawWitch(ctx,p,time=0) {
  const y=p.y+Math.sin(time*(p.waveFrequency||0)+(p.waveOffset||0))*(p.waveAmplitude||0);
  if(!begin(ctx,{...p,y},true))return;
  const flutter=Math.sin(time*0.004+(p.waveOffset||0))*0.09;
  // Broom, bristles and boots are behind the coat.
  line(ctx,[['moveTo',-1.6,0.7],['quadraticCurveTo',-0.2,0.49,1.12,0.53]],'#967352',0.08);
  line(ctx,[['moveTo',-1.4,0.67],['lineTo',1.08,0.51]],'#d1b084',0.017);
  path(ctx,[['moveTo',-1.38,0.6],['quadraticCurveTo',-1.76,0.34,-2.05,0.55],['lineTo',-1.96,0.69],['lineTo',-2.04,0.86],['quadraticCurveTo',-1.68,0.99,-1.37,0.73],['closePath']],'#b9955e','#846c4e',0.02);
  for(let i=0;i<7;i++)line(ctx,[['moveTo',-1.4,0.66],['quadraticCurveTo',-1.7,0.55+i*0.045,-1.98,0.55+i*0.045]],i%2?'#d6b978':'#8a704d',0.014);
  line(ctx,[['moveTo',-1.42,0.58],['lineTo',-1.4,0.76]],'#776044',0.05);
  for(const [x,y]of[[0.08,0.51],[0.38,0.45]]) {
    line(ctx,[['moveTo',x,y],['lineTo',x+0.25,0.75],['lineTo',x+0.05,1.05]],'#9b8a9d',0.11);
    for(let i=0;i<3;i++)line(ctx,[['moveTo',x+0.11+i*0.04,0.94-i*0.07],['lineTo',x+0.21+i*0.04,0.95-i*0.07]],'#d2bbc0',0.025);
    path(ctx,[['moveTo',x,1],['lineTo',x+0.14,1.03],['quadraticCurveTo',x+0.36,1.17,x+0.45,1.01],['quadraticCurveTo',x+0.47,1.28,x-0.03,1.17],['closePath']],'#3a3d48');
  }
  path(ctx,[['moveTo',0.12,-0.32],['quadraticCurveTo',-0.53,-0.26,-0.78,0.45+flutter],['lineTo',-0.93,0.58+flutter],['quadraticCurveTo',-0.18,0.73,0.41,0.5],['quadraticCurveTo',0.51,0.1,0.35,-0.23],['closePath']],gradient(ctx,-0.4,0.7,['#82718d','#4a425e','#343b4d']),'#3a364c',0.025);
  line(ctx,[['moveTo',-0.13,-0.14],['quadraticCurveTo',-0.1,0.15,-0.49,0.48]],'#ac91a7',0.023);
  ellipse(ctx,0.22,-0.57,0.24,0.28,'#d6c7a0');
  path(ctx,[['moveTo',0.35,-0.59],['lineTo',0.57,-0.47],['quadraticCurveTo',0.5,-0.39,0.36,-0.44]],'#d6c7a0','#ad9e83',0.014);
  path(ctx,[['moveTo',0.04,-0.78],['quadraticCurveTo',-0.37,-0.46,-0.42,-0.17+flutter],['quadraticCurveTo',-0.13,-0.28,0.1,-0.5],['closePath']],'#b6a390');
  for(let i=0;i<4;i++)line(ctx,[['moveTo',0.04-i*0.035,-0.67],['quadraticCurveTo',-0.2-i*0.035,-0.4,-0.29-i*0.035,-0.21+flutter]],'#d7c2a6',0.018);
  ellipse(ctx,0.32,-0.57,0.023,0.03,'#4e5146');line(ctx,[['moveTo',0.31,-0.36],['quadraticCurveTo',0.4,-0.34,0.44,-0.39]],'#987b70',0.015);
  path(ctx,[['moveTo',-0.14,-0.76],['quadraticCurveTo',-0.18,-1.16,-0.43,-1.36],['quadraticCurveTo',0.09,-1.43,0.42,-0.73],['closePath']],gradient(ctx,-1.4,-0.7,['#80728a','#45425d']),'#3f3d51',0.025);
  ellipse(ctx,0.11,-0.74,0.59,0.11,'#47445d');
  line(ctx,[['moveTo',-0.16,-0.87],['quadraticCurveTo',0.08,-0.82,0.33,-0.86]],'#b18e6d',0.07);
  rect(ctx,0.03,-0.91,0.13,0.12,0.015,'#d1b477','#745f50',0.016);
  line(ctx,[['moveTo',0.24,-0.1],['quadraticCurveTo',0.6,0.11,0.72,0.48]],'#625675',0.14);ellipse(ctx,0.73,0.46,0.09,0.075,'#d6c7a0');ctx.restore();
}
export function drawBanshee(ctx,p,time=0) {
  const y=p.y+Math.sin(time*(p.waveFrequency||0)+(p.waveOffset||0))*(p.waveAmplitude||0);
  if(!begin(ctx,{...p,y},true))return;
  const sway=Math.sin(time*0.003+(p.wailPhase||0))*0.12;
  // Layered trailing fabric and hair stay deterministic between frames.
  path(ctx,[['moveTo',0.07,-0.83],['bezierCurveTo',-0.69,-0.87,-0.5,0.45,-1.35,0.93+sway],['quadraticCurveTo',-0.72,0.97,-0.18,0.55],['lineTo',0.3,-0.24],['closePath']],'rgba(136,170,167,0.36)');
  path(ctx,[['moveTo',-0.15,-0.43],['bezierCurveTo',-0.6,-0.14,-0.15,0.68,-0.93,1.22+sway],['quadraticCurveTo',-0.38,1.02,-0.2,1.23],['quadraticCurveTo',0.04,0.86,0.24,1.06-sway],['quadraticCurveTo',0.59,0.3,0.31,-0.43],['closePath']],gradient(ctx,-0.5,1.3,['#dce2ce','#abbfb3','#7b9d9e']),'#89a69f',0.018);
  for(let i=0;i<4;i++)line(ctx,[['moveTo',-0.1+i*0.1,-0.16],['bezierCurveTo',-0.2+i*0.1,0.39,0.12-i*0.15,0.7,-0.43+i*0.16,1.02+sway]],'#d2ddc9',0.018);
  ellipse(ctx,0.14,-0.72,0.2,0.26,'#e5e4cc');
  path(ctx,[['moveTo',0.03,-0.98],['bezierCurveTo',-0.44,-1.08,-0.4,-0.38,-0.7,-0.12+sway],['quadraticCurveTo',-0.24,-0.18,0.02,-0.53],['lineTo',0.2,-0.94],['closePath']],gradient(ctx,-1,-0.1,['#c4d0c3','#829e9c']));
  for(let i=0;i<5;i++)line(ctx,[['moveTo',0.01-i*0.035,-0.91],['bezierCurveTo',-0.23-i*0.035,-0.63,-0.12-i*0.08,-0.35,-0.45-i*0.04,-0.2+sway]],'#d9dfcc',0.014);
  for(const x of[0.1,0.25]){ellipse(ctx,x,-0.75,0.027,0.039,'#617f7b');line(ctx,[['moveTo',x,-0.7],['lineTo',x-0.02,-0.62]],'#9db5aa',0.014);}
  ellipse(ctx,0.21,-0.54,0.042,0.06,'#7d8f83');
  for(const side of[-1,1]){
    const x=0.13+side*0.37;
    line(ctx,[['moveTo',0.13+side*0.13,-0.3],['quadraticCurveTo',x+side*0.13,-0.24,x,-0.6]],'#b8cbbd',0.12);
    ellipse(ctx,x,-0.62,0.06,0.1,'#d9dfc8');
    for(let i=0;i<3;i++)line(ctx,[['moveTo',x-0.04+i*0.035,-0.66],['lineTo',x-0.04+i*0.035,-0.79-i*0.012]],'#d9dfc8',0.02);
  }
  ctx.restore();
}
