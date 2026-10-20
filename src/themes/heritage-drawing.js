import {path, ellipse, gradient, rect} from './christmas-drawing.js';
import {beginIllustration as begin, line, stud} from './illustration-utils.js';

export function drawShield(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  const contour = [['moveTo', 0, -0.78], ['quadraticCurveTo', 0.3, -0.54, 0.56, -0.56], ['lineTo', 0.5, 0.12], ['quadraticCurveTo', 0.4, 0.51, 0, 0.83], ['quadraticCurveTo', -0.4, 0.51, -0.5, 0.12], ['lineTo', -0.56, -0.56], ['quadraticCurveTo', -0.3, -0.54, 0, -0.78], ['closePath']];
  path(ctx, contour, gradient(ctx, -0.8, 0.9, ['#e0c796', '#8b7049']), '#615541', 0.035);
  ctx.save(); ctx.scale(0.86, 0.86);
  path(ctx, contour, gradient(ctx, -0.8, 0.9, ['#fff9e9', '#ded7c4']));
  ctx.clip();
  rect(ctx, -0.095, -0.9, 0.19, 1.8, 0, '#b63548'); rect(ctx, -0.65, -0.25, 1.3, 0.2, 0, '#b63548');
  line(ctx, [['moveTo', -0.4, -0.48], ['quadraticCurveTo', -0.43, 0.14, -0.21, 0.4]], 'rgba(255,255,240,0.6)', 0.035);
  ctx.restore();
  for (const [x,y] of [[0,-0.69],[-0.46,-0.47],[0.46,-0.47],[-0.41,0.15],[0.41,0.15],[0,0.68]]) stud(ctx,x,y,0.023);
  const glint = 0.55 + Math.sin(time * 0.003 + (p.glintPhase || 0)) * 0.15;
  ellipse(ctx, -0.03, -0.15, 0.1, 0.1, '#b0915d');
  ellipse(ctx, -0.05, -0.18, 0.035, 0.03, `rgba(255,240,190,${glint})`);
  ctx.restore();
}
export function drawStGeorgesCross(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  const wave = Math.sin(time * (p.waveSpeed || 0.002) + (p.waveOffset || 0)) * 0.12;
  rect(ctx, -0.63, -0.55, 0.055, 2.15, 0.018, gradient(ctx, -0.5, 1.6, ['#b59a6b', '#665844']));
  stud(ctx, -0.6, -0.58, 0.06);
  const flag = [['moveTo', -0.56, -0.48], ['bezierCurveTo', -0.02, -0.65 + wave, 0.25, -0.22 - wave, 0.92, -0.48 + wave], ['lineTo', 0.92, 0.49 + wave], ['bezierCurveTo', 0.25, 0.74 - wave, -0.02, 0.32 + wave, -0.56, 0.49], ['closePath']];
  path(ctx, flag, gradient(ctx, -0.6, 0.7, ['#fffbeb', '#d2d0be']), '#a9a68e', 0.02);
  ctx.save(); ctx.clip();
  path(ctx, [['moveTo', 0.02, -0.65], ['lineTo', 0.24, -0.65], ['lineTo', 0.24, 0.8], ['lineTo', 0.02, 0.8], ['closePath']], '#b92e43');
  path(ctx, [['moveTo', -0.6, -0.1], ['bezierCurveTo', -0.02, -0.27 + wave, 0.25, 0.16 - wave, 1, -0.1 + wave], ['lineTo', 1, 0.1 + wave], ['bezierCurveTo', 0.25, 0.36 - wave, -0.02, -0.07 + wave, -0.6, 0.1], ['closePath']], '#b92e43');
  const fold = ctx.createLinearGradient(-0.6, 0, 1, 0);
  ['rgba(255,255,230,0.2)','rgba(255,255,230,0)','rgba(38,49,53,0.16)','rgba(255,255,230,0.25)','rgba(38,49,53,0.05)'].forEach((c,i) => fold.addColorStop(i/4,c));
  ctx.fillStyle = fold; ctx.fillRect(-0.6,-0.8,1.7,1.7); ctx.restore(); ctx.restore();
}
export function drawHarp(ctx, p, time = 0) {
  if (!begin(ctx, p)) return;
  // Strings terminate on the sloped soundbox, with red and blue tuning guides.
  for (let i = 0; i < 12; i++) {
    const t = i / 11, x = -0.37 + t * 0.82;
    const y1 = -0.78 + t * 0.18, y2 = 0.75 - t * 1.25;
    const wave = Math.sin(time * 0.003 + i + (p.glintPhase || 0)) * 0.003;
    line(ctx, [['moveTo', x, y1], ['quadraticCurveTo', x + wave, (y1+y2)/2, x, y2]], i % 7 === 0 ? '#af6061' : i % 7 === 3 ? '#668392' : '#d6c6a2', 0.012);
  }
  path(ctx, [['moveTo', -0.54, 0.82], ['bezierCurveTo', -0.76, 0.35, -0.79, -0.47, -0.5, -0.91], ['quadraticCurveTo', -0.34, -1.05, -0.21, -0.82], ['lineTo', -0.37, -0.72], ['quadraticCurveTo', -0.64, -0.12, -0.35, 0.73], ['closePath']], gradient(ctx,-1,0.9,['#c69b60','#8e5d3d','#b98a52']), '#674e3c',0.028);
  path(ctx, [['moveTo', -0.48, -0.87], ['bezierCurveTo', -0.19, -1.01, 0.09, -0.58, 0.5, -0.74], ['lineTo', 0.57, -0.56], ['quadraticCurveTo', 0.05, -0.48, -0.38, -0.72], ['closePath']], '#c39a5e','#76563b',0.025);
  path(ctx, [['moveTo', 0.49, -0.63], ['lineTo', 0.67, -0.5], ['lineTo', -0.33, 0.88], ['lineTo', -0.52, 0.74], ['closePath']], gradient(ctx,-0.6,0.9,['#dab77c','#976844']), '#6c503b',0.025);
  for(let i=0;i<12;i++) stud(ctx,-0.37+i*0.075,-0.78+i*0.016,0.018);
  for(let i=0;i<5;i++) {
    const y=-0.53+i*0.23;
    line(ctx,[['moveTo',-0.56,y],['bezierCurveTo',-0.73,y-0.13,-0.34,y-0.08,-0.56,y+0.08]],'#e0bb7e',0.02);
  }
  rect(ctx,-0.6,0.78,0.45,0.12,0.035,'#795438','#d4ad72',0.018); ctx.restore();
}
function goldPot(ctx, time) {
  for(const side of [-1,1]) {
    ellipse(ctx,side*0.68,-0.05,0.14,0.21,'#a28b62'); ellipse(ctx,side*0.68,-0.05,0.08,0.14,'#273b3a');
    rect(ctx,side*0.44-0.07,0.5,0.14,0.23,0.04,'#344846');
  }
  path(ctx,[['moveTo',-0.57,-0.27],['bezierCurveTo',-1.07,0.49,-0.58,0.8,0,0.7],['bezierCurveTo',0.58,0.8,1.07,0.49,0.57,-0.27],['closePath']],gradient(ctx,-0.3,0.8,['#506762','#253a39','#172b2e']),'#172b2b',0.035);
  ellipse(ctx,-0.24,0.17,0.16,0.3,'rgba(161,187,162,0.14)');
  ellipse(ctx,0,-0.24,0.61,0.14,'#b7a275'); ellipse(ctx,0,-0.24,0.52,0.085,'#283935');
  for(let row=0;row<3;row++) for(let col=0;col<5-row;col++) {
    const x=(col-(4-row)/2)*0.22+(row%2)*0.03, y=-0.27-row*0.11;
    ellipse(ctx,x,y,0.13,0.065,'#ad7939'); ellipse(ctx,x,y-0.025,0.12,0.06,'#dfba62');
    line(ctx,[['moveTo',x-0.07,y-0.04],['lineTo',x+0.04,y-0.05]],'#fff0af',0.014);
  }
  const glint=0.035+Math.sin(time*0.002)*0.009;
  line(ctx,[['moveTo',0.28,-0.66],['lineTo',0.28,-0.54],['moveTo',0.22,-0.6],['lineTo',0.34,-0.6]],'#ffe8a2',glint);
}
export function drawPotOfGold(ctx,p,time=0) {if(!begin(ctx,p))return; goldPot(ctx,time);ctx.restore();}
export function drawSmallGoldPot(ctx,x,y,size) {drawPotOfGold(ctx,{x,y,size,opacity:1});}
export function drawRainbow(ctx,p) {
  const {startX,endX,endY,height}=p;
  if(![startX,endX,endY,height].every(Number.isFinite)||height<=0||startX===endX)return;
  const width=Math.abs(endX-startX), rise=Math.min(height*0.25,width*0.45), band=Math.max(1,Math.min(4,width/100));
  ctx.save();ctx.globalAlpha *= (p.opacity ?? 0.65);ctx.lineCap='round';
  ['#ca6570','#dfa06c','#e7cc81','#89ac85','#72a6af','#7f8fb4','#a28dad'].forEach((color,i)=>{
    const inset=i*band;
    line(ctx,[['moveTo',Math.min(startX,endX)+inset,endY],['bezierCurveTo',Math.min(startX,endX)+width*0.12,endY-rise*1.33+inset,Math.max(startX,endX)-width*0.12,endY-rise*1.33+inset,Math.max(startX,endX)-inset,endY]],color,band+0.4);
  });
  ctx.restore();drawSmallGoldPot(ctx,endX,endY,20);
}
export function drawTartanPattern(ctx,p) {
  if(!begin(ctx,p))return;
  ctx.rotate(-0.08);
  const cloth=[['moveTo',-0.94,-0.65],['quadraticCurveTo',0,-0.78,0.92,-0.65],['lineTo',0.84,0.65],['quadraticCurveTo',0.1,0.8,-0.85,0.63],['closePath']];
  path(ctx,cloth,'#8b3b43','#66343e',0.02);ctx.save();ctx.clip();
  for(let i=-2;i<=2;i++) {
    const x=i*0.48;
    rect(ctx,x-0.13,-0.85,0.22,1.7,0,'rgba(30,61,63,0.8)');rect(ctx,-1,x-0.13,2,0.22,0,'rgba(30,61,63,0.7)');
    for(const d of [-0.18,0.18]) {line(ctx,[['moveTo',x+d,-0.9],['lineTo',x+d,0.9]],'#d6b775',0.014);line(ctx,[['moveTo',-1,x+d],['lineTo',1,x+d]],'#d6b775',0.014);}
    line(ctx,[['moveTo',x,-0.9],['lineTo',x,0.9]],'#9fb8a7',0.016);line(ctx,[['moveTo',-1,x],['lineTo',1,x]],'#9fb8a7',0.016);
  }
  for(let i=-55;i<=55;i++) line(ctx,[['moveTo',-1,i*0.018],['lineTo',1,i*0.018+0.13]],'rgba(242,221,184,0.09)',0.004);
  ctx.fillStyle=gradient(ctx,-0.8,0.8,['rgba(255,229,195,0.17)','rgba(0,0,0,0)','rgba(22,28,30,0.22)']);ctx.fillRect(-1,-1,2,2);ctx.restore();
  for(let i=0;i<23;i++) {const x=-0.84+i*0.074;line(ctx,[['moveTo',x,0.66+Math.cos(x*2)*0.07],['lineTo',x-0.025,0.82+Math.cos(x*2)*0.07]],i%2?'#b78275':'#8d9b87',0.012);}
  ellipse(ctx,-0.58,-0.4,0.12,0.12,'#adad98');ellipse(ctx,-0.58,-0.4,0.085,0.085,'#46605c');
  stud(ctx,-0.58,-0.4,0.043);ctx.restore();
}
function highlandCastle(ctx) {
  path(ctx,[['moveTo',-0.34,0.13],['lineTo',-0.34,-0.36],['lineTo',-0.22,-0.36],['lineTo',-0.22,-0.25],['lineTo',-0.1,-0.25],['lineTo',-0.1,-0.52],['lineTo',0.13,-0.52],['lineTo',0.13,-0.22],['lineTo',0.25,-0.22],['lineTo',0.25,-0.4],['lineTo',0.4,-0.4],['lineTo',0.4,0.13],['closePath']],gradient(ctx,-0.5,0.15,['#c9bb95','#8b917c']),'#556860',0.015);
  for(const [x,y,w]of[[-0.34,-0.4,0.12],[-0.1,-0.57,0.23],[0.25,-0.45,0.15]])for(let i=0;i<3;i++)rect(ctx,x+i*w/3,y,w/6,0.07,0,'#bdb38e');
  path(ctx,[['moveTo',-0.34,-0.34],['lineTo',-0.34,0.1],['lineTo',-0.27,0.1],['lineTo',-0.27,-0.34]],'#e0d0a8');
  rect(ctx,-0.035,-0.03,0.13,0.17,0.06,'#394f4e');
  for(const [x,y]of[[-0.29,-0.25],[0,-0.42],[0.31,-0.3],[0.02,-0.23]])rect(ctx,x,y,0.035,0.07,0.01,'#425a55');
  for(let row=0;row<5;row++)line(ctx,[['moveTo',-0.21,-0.2+row*0.065],['lineTo',0.23,-0.2+row*0.065]],'rgba(69,83,69,0.2)',0.006);
}
export function drawHighlandScene(ctx,p) {
  if(!begin(ctx,p))return;
  // An oval vignette avoids the hard rectangular edges of the original scene.
  ctx.beginPath();ctx.ellipse(0,-0.12,1.14,0.92,0,0,Math.PI*2);ctx.clip();
  rect(ctx,-1.2,-1.1,2.4,2,0,gradient(ctx,-1.1,0.9,['#a5c1c5','#e7dbba','#718d87']));
  ellipse(ctx,0.63,-0.69,0.11,0.11,'#f6e6ba');
  path(ctx,[['moveTo',-1.3,0.24],['lineTo',-1.02,-0.49],['lineTo',-0.79,-0.35],['lineTo',-0.44,-0.88],['lineTo',-0.05,-0.38],['lineTo',0.33,-0.69],['lineTo',0.86,-0.14],['lineTo',1.3,-0.5],['lineTo',1.3,0.6],['closePath']],'#829c9b');
  path(ctx,[['moveTo',-0.64,-0.61],['lineTo',-0.44,-0.88],['lineTo',-0.19,-0.56],['lineTo',-0.41,-0.68],['lineTo',-0.46,-0.58],['lineTo',-0.51,-0.68],['closePath']],'#d3d6c6');
  path(ctx,[['moveTo',-1.2,0.23],['lineTo',-0.8,-0.21],['lineTo',-0.49,-0.09],['lineTo',-0.13,-0.38],['lineTo',0.3,0.04],['lineTo',0.75,-0.35],['lineTo',1.2,0.12],['lineTo',1.2,0.6],['closePath']],'#5e7c79');
  rect(ctx,-1.2,0.16,2.4,0.85,0,gradient(ctx,0.16,0.9,['#a2b4a5','#4d7476']));
  // Reflection is clipped to the loch before the near shore is painted.
  ctx.save();ctx.globalAlpha*=0.22;ctx.translate(0,0.41);ctx.scale(1,-0.6);highlandCastle(ctx);ctx.restore();
  path(ctx,[['moveTo',-0.76,0.31],['quadraticCurveTo',-0.4,-0.05,0.17,0.02],['quadraticCurveTo',0.56,0.08,0.83,0.29],['quadraticCurveTo',0,0.42,-0.76,0.31],['closePath']],'#526d57');
  ctx.save();ctx.translate(0,0.07);highlandCastle(ctx);ctx.restore();
  for(let i=0;i<13;i++){const y=0.37+i*0.033,w=0.12+(i%4)*0.08;line(ctx,[['moveTo',Math.sin(i*2.4)*0.7-w,y],['lineTo',Math.sin(i*2.4)*0.7+w,y]],i%2?'#c2c8ae':'#668c88',0.009);}
  path(ctx,[['moveTo',-1.2,0.58],['quadraticCurveTo',-0.59,0.4,-0.24,0.94],['lineTo',-1.2,1],['closePath']],'#3a5950');
  path(ctx,[['moveTo',0.73,0.71],['lineTo',0.88,0.39],['lineTo',0.97,0.72],['lineTo',1.06,0.31],['lineTo',1.14,0.83],['closePath']],'#496553');
  ctx.restore();
}
