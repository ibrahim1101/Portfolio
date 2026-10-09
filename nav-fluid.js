"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("header nav[aria-label='Main navigation']");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a[href]"));
  const active = nav.querySelector("a[aria-current='page']") || links[0];
  if (!active) return;
  const pill = document.createElement("span");
  pill.className = "nav-droplet";
  pill.setAttribute("aria-hidden", "true");
  nav.prepend(pill);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function move(target, immediate) {
    if (!target) return;
    if (immediate) pill.style.transition = "none";
    const previousLeft = parseFloat(pill.style.left);
    const previousWidth = parseFloat(pill.style.width);
    const n = nav.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    pill.style.left = (b.left - n.left + 2) + "px";
    pill.style.top = (b.top - n.top + 3) + "px";
    pill.style.width = Math.max(0, b.width - 4) + "px";
    pill.style.height = Math.max(0, b.height - 7) + "px";
    pill.classList.add("is-ready");
    if (!immediate && !reduce.matches && Number.isFinite(previousLeft) && Number.isFinite(previousWidth) && pill.animate) {
      const destinationLeft = b.left - n.left + 2;
      const distance = Math.abs(destinationLeft - previousLeft);
      if (distance > 8) {
        const direction = destinationLeft > previousLeft ? 1 : -1;
        pill.getAnimations().forEach(function (animation) { animation.cancel(); });
        pill.animate([
          { transform: "translateX(0) scaleX(1) scaleY(1)", borderRadius: "999px" },
          { transform: "translateX(" + (-direction * Math.min(distance * .11, 13)) + "px) scaleX(1.18) scaleY(.87)", borderRadius: "45% 55% 55% 45% / 50% 50% 50% 50%", offset: .35 },
          { transform: "translateX(0) scaleX(.95) scaleY(1.05)", borderRadius: "999px", offset: .8 },
          { transform: "translateX(0) scaleX(1) scaleY(1)", borderRadius: "999px" }
        ], { duration: 510, easing: "cubic-bezier(.2,.75,.2,1)" });
      }
    }
    if (immediate) requestAnimationFrame(function () { pill.style.transition = ""; });
  }
  move(active, true);
  links.forEach(function (link) {
    link.addEventListener("pointerenter", function () {
      if (window.matchMedia("(hover: hover)").matches) move(link, reduce.matches);
    });
    link.addEventListener("focus", function () { move(link, reduce.matches); });
    link.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank" || reduce.matches) return;
      const destination = new URL(link.href, location.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
      event.preventDefault();
      move(link, false);
      window.setTimeout(function () { location.assign(link.href); }, 260);
    });
  });
  nav.addEventListener("pointerleave", function () { move(active, reduce.matches); });
  nav.addEventListener("focusout", function () {
    requestAnimationFrame(function () {
      if (!nav.contains(document.activeElement)) move(active, reduce.matches);
    });
  });
  window.addEventListener("resize", function () { move(active, true); });
  nav.addEventListener("scroll", function () { move(active, true); }, { passive: true });
});