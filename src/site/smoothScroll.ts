import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth, slightly slowed wheel/trackpad scrolling (Lenis).
 * Chosen over GSAP ScrollSmoother because it keeps native scrolling: every `position: sticky`
 * section (hero, manifesto, capabilities, gallery) keeps working, and all scroll listeners
 * (Framer Motion, the hero, the magnet dots) see real scroll positions.
 * Touch keeps the device's native scroll; reduced-motion users get no smoothing at all.
 */
let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  lenis = new Lenis({
    lerp: 0.085, // lower = smoother/heavier glide
    wheelMultiplier: 0.75, // each wheel notch travels less: no racing past the story
    smoothWheel: true,
    syncTouch: false,
    autoRaf: true,
  });

  // Overlays (menu, project sheet, language modal) lock body scroll: pause Lenis with them.
  const mo = new MutationObserver(() => {
    if (document.body.style.overflow === "hidden") lenis?.stop();
    else lenis?.start();
  });
  mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

  return () => {
    mo.disconnect();
    lenis?.destroy();
    lenis = null;
  };
}

/** Scroll to an element (smoothly when Lenis is active) or to the top. */
export function scrollToTarget(el: HTMLElement | null, immediate = false) {
  if (lenis) {
    lenis.scrollTo(el ?? 0, { immediate, duration: 1.3 });
    return;
  }
  if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}
