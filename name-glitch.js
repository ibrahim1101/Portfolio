"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const heading = document.getElementById("animated-name");
  if (!heading) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const letters = [];
  heading.querySelectorAll(".name-word").forEach(function (word) {
    const original = word.textContent;
    word.textContent = "";
    Array.from(original).forEach(function (character) {
      const slot = document.createElement("span");
      slot.className = "name-letter";
      slot.dataset.original = character;
      const glyph = document.createElement("span");
      glyph.className = "name-glyph";
      glyph.textContent = character;
      glyph.dataset.glyph = character;
      slot.appendChild(glyph);
      word.appendChild(slot);
      letters.push({ glyph: glyph, original: character });
    });
  });
  let nextTimer = null;
  let restoreTimer = null;
  let active = null;
  let lastIndex = -1;
  function restore() {
    if (!active) return;
    active.glyph.textContent = active.original;
    active.glyph.dataset.glyph = active.original;
    active.glyph.classList.remove("binary-active");
    active = null;
  }
  function stop() {
    window.clearTimeout(nextTimer);
    window.clearTimeout(restoreTimer);
    restore();
  }
  function schedule() {
    if (document.hidden || reducedMotion.matches || !letters.length) return;
    nextTimer = window.setTimeout(function () {
      let index = Math.floor(Math.random() * letters.length);
      if (letters.length > 1 && index === lastIndex) {
        index = (index + 1 + Math.floor(Math.random() * (letters.length - 1))) % letters.length;
      }
      lastIndex = index;
      active = letters[index];
      active.glyph.textContent = Math.random() < 0.5 ? "0" : "1";
      active.glyph.dataset.glyph = active.glyph.textContent;
      active.glyph.classList.add("binary-active");
      restoreTimer = window.setTimeout(function () {
        restore();
        schedule();
      }, 480);
    }, 1700 + Math.random() * 1900);
  }
  document.addEventListener("visibilitychange", function () {
    stop();
    if (!document.hidden) schedule();
  });
  reducedMotion.addEventListener("change", function () {
    stop();
    if (!reducedMotion.matches && !document.hidden) schedule();
  });
  schedule();
});