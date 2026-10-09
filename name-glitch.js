"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const heading = document.getElementById("animated-name");
  if (!heading) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;
  const letters = [];
  heading.querySelectorAll(".name-word").forEach(function (word) {
    const value = word.textContent;
    word.textContent = "";
    Array.from(value).forEach(function (character) {
      const span = document.createElement("span");
      span.className = "name-letter";
      span.textContent = character;
      span.setAttribute("aria-hidden", "true");
      word.appendChild(span);
      letters.push(span);
    });
  });
  let timeout;
  let lastIndex = -1;
  function schedule() {
    if (document.hidden || reducedMotion.matches) return;
    timeout = window.setTimeout(function () {
      let index = Math.floor(Math.random() * letters.length);
      if (letters.length > 1 && index === lastIndex) index = (index + 1) % letters.length;
      lastIndex = index;
      const letter = letters[index];
      letter.classList.add("mirror-active");
      window.setTimeout(function () {
        letter.classList.remove("mirror-active");
        schedule();
      }, 550);
    }, 2200 + Math.random() * 2600);
  }
  document.addEventListener("visibilitychange", function () {
    window.clearTimeout(timeout);
    letters.forEach(function (letter) { letter.classList.remove("mirror-active"); });
    if (!document.hidden) schedule();
  });
  reducedMotion.addEventListener("change", function () {
    window.clearTimeout(timeout);
    letters.forEach(function (letter) { letter.classList.remove("mirror-active"); });
    if (!reducedMotion.matches && !document.hidden) schedule();
  });
  schedule();
});