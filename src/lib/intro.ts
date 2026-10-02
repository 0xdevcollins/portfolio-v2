"use client";

/**
 * The intro loader plays once per session. An inline script in <head> sets
 * <html data-intro="play"> before first paint; the loader flips it to "done".
 * Anything that animates in on load waits for that.
 */
const EVENT = "intro:done";

export function introIsPending() {
  return document.documentElement.dataset.intro === "play";
}

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void) {
  if (!introIsPending()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
