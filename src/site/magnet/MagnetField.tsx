import { useEffect, useRef } from "react";
import { armAudio, chime, homecoming, landing, setShimmer } from "./sound";

/** Tiny companions per collected dot. Kept minimal so the swarm never competes with the text. */
const SATELLITES = 1;
/** A dot leaves its heading once it scrolls above this fraction of the viewport… */
const COLLECT_LINE = 0.6;
/** …and flies back home when it scrolls below this one (the gap avoids flip-flopping). */
const RETURN_LINE = 0.72;
/** Distance (px) at which an incoming dot starts to "sing", and at which it counts as joined. */
const NEAR = 170;
const JOIN = 28;

type DotState = "home" | "swarm" | "returning";

interface Dot {
  el: HTMLElement;
  /** Fixed by document order, so each dot always plays the same note going down or up. */
  note: number;
  state: DotState;
}

interface Particle {
  dot: Dot;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  core: boolean;
  /** Orbit radius (px) and angular speed (rad/s, signed). */
  orbit: number;
  ang: number;
  spd: number;
  /** ms timestamp before which the particle drifts free (staggered "peel off"). */
  free: number;
  alpha: number;
  /** Cores only: reached the swarm orbit (and chimed) since the last collection. */
  joined: boolean;
  dead: boolean;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Visual centre of a period glyph inside its span (it sits on the baseline). */
function dotCenter(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.74 };
}

/** The dot is "readable" (e.g. the manifesto lights words up as you scroll). */
const readable = (el: HTMLElement) => !el.parentElement || parseFloat(getComputedStyle(el.parentElement).opacity) >= 0.9;

/**
 * Global layer for magnet dots. Each heading's final period (`[data-magnet-dot]`) detaches when
 * its section is passed, flies to the pointer and joins a small orbiting swarm. Scrolling back up
 * sends each dot home to its heading. When the footer is in view the swarm settles around the
 * footer's own period (`[data-magnet-home]`). Pointer-transparent; idle while there's nothing to draw.
 */
export function MagnetField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let parts: Particle[] = [];
    const dots = new Map<HTMLElement, Dot>();
    // Touch devices have no hover cursor: start the swarm low on screen until a finger moves.
    const anchor = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.78 };
    let home = false;
    let landed = false;
    let accent = "#3d8bff";
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readAccent = () => {
      accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || accent;
    };

    const start = () => {
      if (!raf && parts.length) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const showInHeading = (dot: Dot, visible: boolean) => {
      dot.el.style.transition = "opacity 0.25s ease";
      dot.el.style.opacity = visible ? "1" : "0";
    };

    /** Heading → swarm. Reuses the dot's particles if it was on its way home. */
    const collect = (dot: Dot) => {
      const wasReturning = dot.state === "returning";
      dot.state = "swarm";
      if (wasReturning) {
        // Turned around mid-flight: rejoin (and chime again on arrival).
        parts.forEach((p) => p.dot === dot && p.core && (p.joined = false));
        return;
      }
      const { x: cx, y: cy } = dotCenter(dot.el);
      const fs = parseFloat(getComputedStyle(dot.el).fontSize) || 48;
      const now = performance.now();
      const dir = Math.random() < 0.5 ? -1 : 1;
      showInHeading(dot, false);

      parts.push({
        dot, x: cx, y: cy, vx: 0, vy: -1.5, r: Math.min(4.5, Math.max(2.4, fs * 0.045)), core: true,
        orbit: rand(9, 16), ang: rand(0, Math.PI * 2), spd: rand(1.1, 1.7) * dir, free: now + 120, alpha: 0.95,
        joined: false, dead: false,
      });
      for (let i = 0; i < SATELLITES; i++) {
        const a = rand(0, Math.PI * 2);
        parts.push({
          dot, x: cx, y: cy, vx: Math.cos(a) * rand(1, 2.5), vy: Math.sin(a) * rand(1, 2.5) - 1, r: rand(0.8, 1.3),
          core: false, orbit: rand(16, 28), ang: rand(0, Math.PI * 2), spd: rand(0.6, 1.3) * -dir,
          free: now + 200 + i * 80, alpha: rand(0.4, 0.65), joined: true, dead: false,
        });
      }
      start();
    };

    /** Swarm → heading. The dot reappears in the text when its core lands. */
    const sendHome = (dot: Dot) => {
      dot.state = "returning";
      start();
    };

    // Decide, for every dot, whether it belongs in its heading or in the swarm.
    let checkQueued = 0;
    const check = () => {
      checkQueued = 0;
      for (const dot of dots.values()) {
        if (!dot.el.isConnected) continue;
        const top = dot.el.getBoundingClientRect().top;
        const ok = readable(dot.el);
        if (dot.state !== "swarm" && ok && top < h * COLLECT_LINE) collect(dot);
        else if (dot.state === "swarm" && (top > h * RETURN_LINE || !ok)) sendHome(dot);
      }
    };
    const onScroll = () => {
      if (!checkQueued) checkQueued = requestAnimationFrame(check);
    };

    // Dots appear/disappear with routes and language changes: keep the registry in sync.
    const scan = () => {
      const found = Array.from(document.querySelectorAll<HTMLElement>("[data-magnet-dot]"));
      for (const [el, dot] of dots) {
        if (!found.includes(el)) {
          dots.delete(el);
          parts.forEach((p) => p.dot === dot && (p.dead = true));
        }
      }
      found.forEach((el, i) => {
        const dot = dots.get(el);
        if (dot) dot.note = i;
        else dots.set(el, { el, note: i, state: "home" });
      });
      check();
    };
    let scanQueued = 0;
    const mo = new MutationObserver(() => {
      if (!scanQueued) scanQueued = window.setTimeout(() => ((scanQueued = 0), scan()), 150);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });

    // The footer takes the swarm home.
    const footerIo = new IntersectionObserver(([e]) => (home = e.isIntersecting && e.intersectionRatio >= 0.3), {
      threshold: [0, 0.3, 0.6],
    });
    const watchFooter = () => {
      const f = document.getElementById("contact");
      if (f) footerIo.observe(f);
    };

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const step = Math.min(3, (now - last) / 16.667);
      const dt = step / 60;
      last = now;
      if (frames++ % 45 === 0) readAccent();

      let bx = anchor.x;
      let by = anchor.y;
      const homeEl = home ? document.querySelector<HTMLElement>("[data-magnet-home]") : null;
      const atHome = Boolean(homeEl && homeEl.getBoundingClientRect().width);
      if (atHome && homeEl) ({ x: bx, y: by } = dotCenter(homeEl));

      // Where each returning dot's heading is right now (it scrolls with the page).
      const targets = new Map<Dot, { x: number; y: number }>();
      for (const p of parts) if (p.dot.state === "returning" && !targets.has(p.dot)) targets.set(p.dot, dotCenter(p.dot.el));

      const swarmSize = parts.reduce((n, p) => n + (p.dot.state === "swarm" ? 1 : 0), 0);
      const spread = 1 + Math.sqrt(swarmSize) * 0.03;
      const damp = Math.pow(0.86, step);
      let near = 0;
      let ci = 0;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = accent;

      for (const p of parts) {
        const back = p.dot.state === "returning";
        if (back) {
          // Fly straight home, a little quicker than joining; the satellite fades on the way.
          const t = targets.get(p.dot)!;
          const k = 0.08 * step;
          p.vx += (t.x - p.x) * k;
          p.vy += (t.y - p.y) * k;
          if (!p.core) p.alpha *= Math.pow(0.92, step);
          if (p.core && Math.hypot(t.x - p.x, t.y - p.y) < 3) {
            // Landed: the period is text again.
            showInHeading(p.dot, true);
            p.dot.state = "home";
            homecoming(p.dot.note);
            parts.forEach((q) => q.dot === p.dot && (q.dead = true));
            continue;
          }
        } else if (now >= p.free) {
          p.ang += p.spd * dt * (atHome ? 0.45 : 1);
          // At home: cores pile into the footer's period, satellites become a slow halo around it.
          const orbit = atHome ? (p.core ? Math.min(10, 1.5 + ci * 0.9) : p.orbit * 1.6) : p.orbit * spread;
          const tx = bx + Math.cos(p.ang) * orbit;
          const ty = by + Math.sin(p.ang) * orbit * 0.82;
          const k = (p.core ? 0.06 : 0.035) * step;
          p.vx += (tx - p.x) * k;
          p.vy += (ty - p.y) * k;
        }
        if (p.dead) p.alpha *= Math.pow(0.8, step);
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * step;
        p.y += p.vy * step;
        if (p.core && !back) ci++;

        // Sound: incoming dots shimmer as they approach the orbit, then chime when they join.
        if (p.core && !back && !p.joined && !atHome) {
          const d = Math.hypot(p.x - bx, p.y - by);
          if (d < NEAR) near = Math.max(near, 1 - d / NEAR);
          if (d < JOIN) {
            p.joined = true;
            chime(p.dot.note);
          }
        }

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // A landed dot's particles vanish at once (the period is text again); orphans fade out.
      parts = parts.filter((p) => !(p.dead && (p.dot.state === "home" || p.alpha < 0.02)));
      setShimmer(near);

      // Landing chord once the swarm's cores have gathered on the footer's period.
      const cores = parts.filter((q) => q.core && q.dot.state === "swarm");
      if (atHome && !landed && cores.length && cores.every((q) => Math.hypot(q.x - bx, q.y - by) < 18)) {
        landed = true;
        landing();
      }
      if (!atHome) landed = false;

      if (parts.length) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      anchor.x = e.clientX;
      anchor.y = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      anchor.x = t.clientX;
      anchor.y = t.clientY;
    };
    const onVisibility = () => !document.hidden && start();

    const disarmAudio = armAudio();
    resize();
    readAccent();
    scan();
    watchFooter();
    const footerRetry = window.setTimeout(watchFooter, 1000);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(checkQueued);
      disarmAudio();
      setShimmer(0);
      window.clearTimeout(scanQueued);
      window.clearTimeout(footerRetry);
      footerIo.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30 h-full w-full" aria-hidden="true" />;
}
