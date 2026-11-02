import { World } from './world.js';
import { AsciiRenderer } from './renderer.js';

// One simulation in document coordinates; the canvas only paints the visible window.
const canvas = document.querySelector('.shark-water canvas');
const renderer = new AsciiRenderer(canvas);
renderer.setFontFamily(getComputedStyle(canvas).fontFamily);
const starts = [[.73,.10,2.62,35],[.29,.38,-.92,48],[.57,.60,.38,30],[.41,.86,-2.05,42]];
const world = new World([1,.86,.94,.78].map(size => ({kind:'hammerhead',size})), 60);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let width=0, height=0, pageHeight=0, last=0, frame=0;
function resize(){
  const w=canvas.clientWidth,h=canvas.clientHeight, ph=document.body.offsetHeight;
  if(!w||!h||!ph)return;
  if(w!==width||h!==height) renderer.resize(w,h,Math.min(devicePixelRatio||1,2));
  if(w!==width||ph!==pageHeight){
    world.resize(w,ph,renderer.cellWidth,renderer.cellHeight);
    for(const sh of world.sharks){
      const n=sh.nodes;
      if(!width){
        const [fx,fy,a,speed]=starts[sh.id-1];
        sh.heading=a+(Math.random()-.5)*.35; sh.speed=speed;
        const cx=w*(fx+(Math.random()-.5)*.05),cy=ph*fy;
        for(let i=0;i<n.length;i+=2){
          const d=(.5-i/(n.length-2))*sh.length;
          n[i]=cx+d*Math.cos(sh.heading); n[i+1]=cy+d*Math.sin(sh.heading);
        }
      }else{
        const dx=n[0]*(w/width-1),dy=n[1]*(ph/pageHeight-1);
        for(let i=0;i<n.length;i+=2){n[i]+=dx;n[i+1]+=dy;}
      }
    }
  }
  width=w;height=h;pageHeight=ph;paint();
}
function paint(){
  const offset=-document.body.getBoundingClientRect().top;
  const sharks=world.sharks.map(sh=>{
    const nodes=sh.nodes.slice();
    for(let i=1;i<nodes.length;i+=2)nodes[i]-=offset;
    return {...sh,nodes};
  });
  renderer.render({sharks,time:world.time,events:world.events},0);
}
function tick(now){
  frame=0;
  if(!motion.matches && !document.hidden){
    const dt=last?Math.min((now-last)/1000,.06):0;
    if(dt>0){world.step(dt/2);world.step(dt/2);}
    last=now;frame=requestAnimationFrame(tick);
  }else last=0;
  paint();
}
function schedule(){if(!frame)frame=requestAnimationFrame(tick);}
new ResizeObserver(resize).observe(document.body);
new ResizeObserver(resize).observe(canvas);
addEventListener('scroll',schedule,{passive:true});
addEventListener('pointermove',e=>{
  Object.assign(world.pointer,{x:e.clientX,y:e.clientY-document.body.getBoundingClientRect().top,active:e.pointerType!=='touch'});
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{world.pointer.active=false;});
addEventListener('blur',()=>{world.pointer.active=false;});
addEventListener('pointerdown',e=>{
  if(!motion.matches)world.splash(e.clientX,e.clientY-document.body.getBoundingClientRect().top);
},{passive:true});
motion.addEventListener('change',schedule);
document.addEventListener('visibilitychange',()=>{last=0;schedule();});
resize();schedule();
