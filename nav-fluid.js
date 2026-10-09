"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("header nav[aria-label='Main navigation']");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a[href]"));
  let selected = nav.querySelector("a[aria-current='page']") || links[0];
  if (!selected) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "nav-venom");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const shape = document.createElementNS(ns, "path");
  svg.appendChild(shape);
  nav.prepend(svg);
  let motion = null, raf = 0;
  function box(link) {
    const n=nav.getBoundingClientRect(), b=link.getBoundingClientRect();
    const h=Math.min(40,b.height-2);
    return {cx:b.left-n.left+b.width/2, cy:b.top-n.top+b.height/2, w:b.width, h:h};
  }
  function capsule(cx,cy,w,h) {
    const r=Math.min(w/2,h/2), x=cx-w/2, y=cy-h/2;
    return "M "+(x+r)+" "+y+" H "+(x+w-r)+" A "+r+" "+r+" 0 0 1 "+(x+w)+" "+(y+r)+
      " V "+(y+h-r)+" A "+r+" "+r+" 0 0 1 "+(x+w-r)+" "+(y+h)+
      " H "+(x+r)+" A "+r+" "+r+" 0 0 1 "+x+" "+(y+h-r)+
      " V "+(y+r)+" A "+r+" "+r+" 0 0 1 "+(x+r)+" "+y+" Z";
  }
  function paint(b) {
    const n=nav.getBoundingClientRect();
    svg.setAttribute("viewBox","0 0 "+Math.max(1,n.width)+" "+Math.max(1,n.height));
    shape.setAttribute("d",capsule(b.cx,b.cy,b.w,b.h));
  }
  function smooth(t){return t*t*(3-2*t);}
  function interpolate(a,b,t){return a+(b-a)*t;}
  let position=box(selected);
  paint(position);
  function animate(time){
    if (!motion) return;
    const t=Math.min(1,(time-motion.start)/motion.duration);
    const p=smooth(t), neck=Math.pow(Math.sin(Math.PI*t),1.25);
    // A single travelling droplet: full capsule -> narrow droplet -> full capsule.
    // Avoid spanning the whole gap between options.
    const w=interpolate(motion.from.w,motion.to.w,p)*(1-.56*neck);
    const h=interpolate(motion.from.h,motion.to.h,p)*(1-.18*neck);
    position={cx:interpolate(motion.from.cx,motion.to.cx,p),cy:interpolate(motion.from.cy,motion.to.cy,p),w:w,h:h};
    paint(position);
    if(t<1) raf=requestAnimationFrame(animate);
    else {position={...motion.to};motion=null;raf=0;paint(position);}
  }
  function move(link,instant){
    selected=link;
    const dest=box(link);
    if(raf) cancelAnimationFrame(raf);
    raf=0;
    if(instant || reduced.matches || Math.abs(dest.cx-position.cx)<1){
      position=dest;motion=null;paint(position);return;
    }
    const distance=Math.abs(dest.cx-position.cx);
    motion={from:{...position},to:dest,start:performance.now(),duration:Math.min(610,Math.max(360,290+distance*.52))};
    raf=requestAnimationFrame(animate);
  }
  links.forEach(function(link){
    link.addEventListener("pointerenter",function(){if(matchMedia("(hover: hover)").matches)move(link,false);});
    link.addEventListener("focus",function(){move(link,false);});
    link.addEventListener("click",function(event){
      if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target==="_blank")return;
      const dest=new URL(link.href,location.href);
      if(dest.origin!==location.origin || dest.pathname===location.pathname || reduced.matches)return;
      event.preventDefault();
      move(link,false);
      window.setTimeout(function(){location.assign(link.href);},motion?motion.duration:0);
    });
  });
  // Intentionally do NOT reset on pointerleave/focusout: the last hovered tab stays highlighted.
  window.addEventListener("resize",function(){move(selected,true);});
  nav.addEventListener("scroll",function(){move(selected,true);},{passive:true});
  reduced.addEventListener("change",function(){move(selected,true);});
});