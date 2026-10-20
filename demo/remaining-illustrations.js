import english from '../src/themes/st-georges.js';
import scottish from '../src/themes/st-andrews.js';
import welsh from '../src/themes/st-davids.js';
import irish from '../src/themes/st-patricks.js';
import halloween from '../src/themes/halloween.js';
import valentines from '../src/themes/valentines.js';
import * as originals from './remaining-originals.js';

const themes = {'st-georges':english,'st-andrews':scottish,'st-davids':welsh,'st-patricks':irish,halloween,valentines};
const groups = {
  'st-georges':{EnglishRose:'English rose',TudorRose:'Tudor rose',Shield:'St George\'s shield',StGeorgesCross:'The flag of England'},
  'st-andrews':{HighlandScene:'The Highlands',Thistle:'Scottish thistle',ThistlePlant:'Thistles in bloom',Heather:'Heather bells',TartanPattern:'Woven tartan'},
  'st-davids':{Daffodil:'Spring daffodil',DaffodilField:'A field of daffodils',Leek:'Welsh leek',LeekBundle:'A ribbon of leeks',Harp:'The Celtic harp'},
  'st-patricks':{PotOfGold:'A pot of gold',Rainbow:'At the rainbow\'s end',Banshee:'The wandering banshee'},
  halloween:{Witch:'A passing witch',Cauldron:'Something is brewing',Spider:'A silken thread',SpiderSmall:'The little spider',Gravestone:'Weathered stone'},
  valentines:{Lips:'A little kiss',LoveLetter:'A love letter',Envelope:'Sealed with love',HeartGarland:'Paper hearts'}
};
const gallery=document.querySelector('.gallery'),status=document.getElementById('status');
let old=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,time=1250,last=0,scene=null,sceneRevision=0;
const cards=[];
for(const [theme,drawings] of Object.entries(groups)) for(const [type,label] of Object.entries(drawings)) {
  const card=document.createElement('article');card.dataset.theme=theme;
  const title=document.createElement('h2');title.textContent=label;
  const caption=document.createElement('p');caption.textContent=themes[theme].displayName;
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-label',label);
  card.append(title,caption,canvas);gallery.append(card);cards.push({card,canvas,theme,type});
}
function button(id,callback){const b=document.getElementById(id);b.onclick=()=>callback(b);return b;}
button('compare',b=>{old=!old;b.setAttribute('aria-pressed',String(old));b.textContent=old?'Show redraw':'Show original';paint();});
const pause=button('pause',b=>{paused=!paused;b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'Play animation':'Pause animation';if(scene){if(paused)scene.pause();else scene.start();}});
pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Play animation':'Pause animation';
button('background',b=>{const light=document.body.classList.toggle('light');b.setAttribute('aria-pressed',String(light));b.textContent=light?'Dark background':'Light background';});
document.getElementById('filter').onchange=e=>{for(const {card,theme}of cards)card.hidden=e.target.value!=='all'&&theme!==e.target.value;paint();};
function particle(type,w) {
  const p={x:w/2,y:126,size:65,opacity:1,rotation:0,vx:1,time,bloomPhase:0,petalCount:10,color:'#b64d65',sway:0.1,bellCount:7,glintPhase:0,petalColors:['#8f639a','#b286b5','#e4b9d9'],waveOffset:0,waveSpeed:0.002,waveFrequency:0,waveAmplitude:0,wailPhase:0,swayPhase:0,swingPhase:0,swingSpeed:0.001,swingAmplitude:12,threadLength:55,bubblePhase:0,shape:'rounded',variant:0};
  if(type==='EnglishRose'){p.size=60;p.y=115;}
  if(type==='Thistle'){p.size=65;p.y=93;}
  if(type==='ThistlePlant'){p.y=242;p.size=75;}
  if(type==='Daffodil'){p.size=60;p.y=116;}
  if(type==='DaffodilField'){p.x=w/2;p.y=242;p.flowers=Array.from({length:7},(_,i)=>({x:(i-3)*30,y:(i%2)*15,size:23+(i%3)*3,swayPhase:i}));}
  if(type==='Heather'){p.color='#a875a8';p.size=100;}
  if(type==='HighlandScene'){p.y=153;p.size=Math.min(130,w*0.43);}
  if(type==='TartanPattern'){p.y=137;p.size=Math.min(130,w*0.43);}
  if(type==='Harp'){p.size=115;p.y=147;}
  if(type==='Rainbow'){Object.assign(p,{startX:25,endX:w-35,endY:225,height:320,width:w});}
  if(type==='Witch'){p.size=Math.min(75,w*0.25);p.x=w*0.58;p.y=140;}
  if(type==='Banshee'){p.y=126;p.size=86;}
  if(type==='Cauldron'){p.y=165;p.size=100;p.bubbles=Array.from({length:5},(_,i)=>({x:Math.sin(i*2)*30,y:-20-i*13,size:3+i%3,opacity:0.7}));p.smoke=Array.from({length:3},(_,i)=>({x:Math.sin(i)*20,y:-60-i*20,size:8+i*2,opacity:0.2}));}
  if(type==='Spider'){p.y=70;p.size=80;}
  if(type==='Gravestone'){p.y=146;p.size=95;}
  if(type==='StGeorgesCross'){p.y=104;p.size=80;}
  if(type==='Lips'){p.color='#bb4c68';p.size=95;}
  if(type==='HeartGarland')Object.assign(p,{x:0,y:80,width:w,sag:80,swayAmplitude:8,hearts:Array.from({length:7},(_,i)=>({offset:(i+0.5)/7,size:14+(i%2)*3,color:i%2?'#bd6174':'#d9989a',pulsePhase:i}))});
  return p;
}
function paint() {
  let count=0;
  for(const {card,canvas,theme,type}of cards) {
    if(card.hidden)continue;
    const w=canvas.clientWidth,h=280,dpr=devicePixelRatio||1;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==h*dpr){canvas.width=Math.round(w*dpr);canvas.height=h*dpr;}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const source=old?originals[theme.replaceAll('-','_')]:themes[theme];
    try{source['draw'+type](ctx,particle(type,w),time);count++;}catch(error){status.textContent=`Could not draw ${type}: ${error.message}`;throw error;}
  }
  status.textContent=`${old?'Original artwork':'New illustrations'} - ${count} drawings. Compare the artwork, pause for a closer look, or try a lighter background.`;
}
async function showScene() {
  const revision=++sceneRevision;
  scene?.destroy();scene=null;
  if(!document.getElementById('scene-details').open)return;
  const {Celebrations}=await import('../dist/domma-celebrate.esm.js');
  if(revision!==sceneRevision)return;
  const next=new Celebrations({theme:document.getElementById('scene-theme').value,intensity:'medium',container:document.getElementById('scene'),respectMotionPreference:true});
  await next.init();
  if(revision!==sceneRevision){next.destroy();return;}
  scene=next;
  await new Promise(requestAnimationFrame);
  if(paused)next.pause();
}
document.getElementById('scene-details').ontoggle=showScene;
document.getElementById('scene-theme').onchange=showScene;
function frame(now){if(!paused){time+=Math.min(50,now-(last||now));paint();}last=now;requestAnimationFrame(frame);}
window.addEventListener('resize',paint);
paint();requestAnimationFrame(frame);
