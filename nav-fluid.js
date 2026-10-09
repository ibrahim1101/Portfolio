"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("header nav[aria-label='Main navigation']");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a[href]"));
  const active = nav.querySelector("a[aria-current='page']") || links[0];
  if (!active) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "nav-venom");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "#ee6d2d");
  svg.appendChild(path);
  nav.prepend(svg);
  let current = null, target = null, trail = null, frame = 0;
  function rectFor(link) {
    const n = nav.getBoundingClientRect(), b = link.getBoundingClientRect();
    return { x: b.left - n.left, y: b.top - n.top + 1, w: b.width, h: b.height - 2 };
  }
  function capsule(x, y, w, h) {
    const r = Math.min(h / 2, w / 2);
    return "M " + (x+r) + " " + y + " H " + (x+w-r) +
      " A " + r + " " + r + " 0 0 1 " + (x+w) + " " + (y+r) +
      " V " + (y+h-r) + " A " + r + " " + r + " 0 0 1 " + (x+w-r) + " " + (y+h) +
      " H " + (x+r) + " A " + r + " " + r + " 0 0 1 " + x + " " + (y+h-r) +
      " V " + (y+r) + " A " + r + " " + r + " 0 0 1 " + (x+r) + " " + y + " Z";
  }
  function draw() {
    if (!current || !trail) return;
    const n = nav.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + Math.max(n.width, 1) + " " + Math.max(n.height, 1));
    const mid = current.x + current.w / 2, lag = trail.x + trail.w / 2;
    const distance = Math.abs(mid-lag);
    const y = current.y, h = current.h;
    if (distance < 3 || reduced.matches) {
      path.setAttribute("d", capsule(current.x, y, current.w, h));
      return;
    }
    const left = Math.min(current.x, trail.x);
    const right = Math.max(current.x+current.w, trail.x+trail.w);
    const radius = h/2;
    const neck = Math.max(h*.30, h/2 - Math.min(distance*.07, h*.17));
    const center = (mid+lag)/2;
    // Elastic liquid body: rounded ends, narrower neck joining the two positions.
    path.setAttribute("d",
      "M "+(left+radius)+" "+y+
      " C "+(left+radius*.35)+" "+y+" "+left+" "+(y+radius*.35)+" "+left+" "+(y+radius)+
      " C "+left+" "+(y+h-radius*.35)+" "+(left+radius*.35)+" "+(y+h)+" "+(left+radius)+" "+(y+h)+
      " C "+(center-radius)+" "+(y+h)+" "+(center-radius*.55)+" "+(y+h/2+neck)+" "+center+" "+(y+h/2+neck)+
      " C "+(center+radius*.55)+" "+(y+h/2+neck)+" "+(right-radius)+" "+(y+h)+" "+(right-radius)+" "+(y+h)+
      " C "+(right-radius*.35)+" "+(y+h)+" "+right+" "+(y+h-radius*.35)+" "+right+" "+(y+h-radius)+
      " C "+right+" "+(y+radius*.35)+" "+(right-radius*.35)+" "+y+" "+(right-radius)+" "+y+
      " C "+(center+radius)+" "+y+" "+(center+radius*.55)+" "+(y+h/2-neck)+" "+center+" "+(y+h/2-neck)+
      " C "+(center-radius*.55)+" "+(y+h/2-neck)+" "+(left+radius)+" "+y+" "+(left+radius)+" "+y+" Z");
  }
  function tick() {
    frame = 0;
    if (!target || !current || !trail) return;
    const ease = reduced.matches ? 1 : .19;
    const lagEase = reduced.matches ? 1 : .105;
    ["x","y","w","h"].forEach(function(k) {
      current[k] += (target[k] - current[k]) * ease;
      trail[k] += (current[k] - trail[k]) * lagEase;
    });
    draw();
    if (["x","y","w","h"].some(k => Math.abs(target[k]-current[k])>.12 || Math.abs(current[k]-trail[k])>.12)) frame=requestAnimationFrame(tick);
    else { current={...target}; trail={...target}; draw(); }
  }
  function move(link, instant) {
    target = rectFor(link);
    if (!current || instant || reduced.matches) {
      current={...target}; trail={...target};
      if (frame) cancelAnimationFrame(frame);
      frame=0; draw(); return;
    }
    if (!frame) frame=requestAnimationFrame(tick);
  }
  move(active, true);
  links.forEach(function(link) {
    link.addEventListener("pointerenter", function() { if (matchMedia("(hover: hover)").matches) move(link, false); });
    link.addEventListener("focus", function() { move(link, false); });
    link.addEventListener("click", function(event) {
      if (event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target==="_blank") return;
      const destination = new URL(link.href, location.href);
      if (destination.origin!==location.origin || destination.pathname===location.pathname) return;
      if (reduced.matches) return;
      event.preventDefault();
      move(link, false);
      window.setTimeout(function(){ location.assign(link.href); }, 500);
    });
  });
  nav.addEventListener("pointerleave", function(){ move(active, false); });
  nav.addEventListener("focusout", function(){
    requestAnimationFrame(function(){ if (!nav.contains(document.activeElement)) move(active, false); });
  });
  function resize(){ move(active, true); }
  window.addEventListener("resize", resize);
  nav.addEventListener("scroll", resize, {passive:true});
  reduced.addEventListener("change", function(){ move(active, true); });
});