import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import portrait1 from "@/assets/hero-portrait.webp";
import portrait2 from "@/assets/hero-2.webp";
import portrait3 from "@/assets/hero-3.webp";
import portrait4 from "@/assets/hero-4.webp";
import { hexToRgb, usePalette } from "./palette";
import { useLang } from "./i18n";

interface Slide {
  src: string;
  /** Luminance (0–255) below which pixels become empty space. Raise it for photos with a grey backdrop. */
  cutoff?: number;
}

/** Carousel slides. Add an image here and the particles will morph into it. */
const SLIDES: Slide[] = [
  { src: portrait2 },
  { src: portrait3 },
  { src: portrait4 },
  // Hidden for now: very dark backdrop, reads poorly as particles.
  // { src: portrait1 },
];

const AUTOPLAY_MS = 8000;

const smoothstep = (a: number, b: number, v: number) => {
  const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** Share of the sampled particles shown for a density slider value (0–1). */
const densityFraction = (d: number) => 0.12 + 0.88 * d;

/** Radius of the "idea space" circle opened at the end of the scroll, as a share of min(w, h). */
// Uses the same media query as the overlay's md: breakpoint so canvas and CSS circles match.
const circleRadius = (w: number, h: number) =>
  Math.min(w, h) * (window.matchMedia("(min-width: 768px)").matches ? 0.26 : 0.36);

interface Target {
  x: Float32Array;
  y: Float32Array;
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
  a: Float32Array; // 1 = visible, 0 = spare particle (fades out)
  light: Uint8Array;
  count: number;
  size: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Samples an image (object-fit: cover) into particle home positions + colors. */
function sampleImage(img: HTMLImageElement, w: number, h: number, maxCount: number, cutoff = 20) {
  // Remap so the cutoff becomes black and the remaining tones keep their full range.
  const gain = 255 / (255 - cutoff);
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  // Start dense, then widen spacing until the visible count fits the budget.
  let spacing = w < 768 ? 2 : 1.6;
  for (let attempt = 0; ; attempt++) {
    const sw = Math.max(1, Math.floor(dw / spacing));
    const sh = Math.max(1, Math.floor(dh / spacing));
    const tmp = document.createElement("canvas");
    tmp.width = sw;
    tmp.height = sh;
    const ctx = tmp.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, sw, sh);
    const data = ctx.getImageData(0, 0, sw, sh).data;

    const xs: number[] = [], ys: number[] = [], rs: number[] = [], gs: number[] = [], bs: number[] = [], ls: number[] = [];
    for (let py = 0; py < sh; py++) {
      for (let px = 0; px < sw; px++) {
        const k = (py * sw + px) * 4;
        const lum = (data[k] + data[k + 1] + data[k + 2]) / 3;
        if (lum < cutoff) continue; // near-black / backdrop: empty space
        xs.push(dx + px * spacing + (Math.random() - 0.5) * spacing * 0.4);
        ys.push(dy + py * spacing + (Math.random() - 0.5) * spacing * 0.4);
        rs.push(Math.max(0, data[k] - cutoff) * gain);
        gs.push(Math.max(0, data[k + 1] - cutoff) * gain);
        bs.push(Math.max(0, data[k + 2] - cutoff) * gain);
        ls.push((lum - cutoff) * gain > 95 ? 1 : 0);
      }
    }
    if (xs.length <= maxCount || attempt >= 5) return { xs, ys, rs, gs, bs, ls, spacing };
    spacing *= Math.sqrt(xs.length / maxCount) * 1.02;
  }
}

/**
 * Interactive particle carousel.
 * - Particles are always alive: they breathe around their home position.
 * - The cursor (or finger) pushes them away; a soft spring brings them back.
 * - Changing slide morphs the same particles into the next image.
 * - Scrolling scatters them into a floating, accent-tinted cloud.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { palette } = usePalette();
  const t = useLang().t.hero;
  const accentRef = useRef(hexToRgb(palette.accent));

  const [slide, setSlide] = useState(0);
  const slideRef = useRef(0);
  const kickRef = useRef(false);
  const [density, setDensity] = useState(0.5);
  const [round, setRound] = useState(true);
  const roundRef = useRef(true);
  const densityRef = useRef(0.5);
  const [counts, setCounts] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const progressRef = useRef(0);

  useEffect(() => {
    accentRef.current = hexToRgb(palette.accent);
  }, [palette.accent]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  useEffect(() => {
    densityRef.current = density;
  }, [density]);

  const go = useCallback((dir: number) => {
    setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (slideRef.current === slide) return;
    slideRef.current = slide;
    kickRef.current = true;
  }, [slide]);

  // Autoplay countdown: ticks only while the visitor is at the top of the page (barely scrolled)
  // and the tab is visible. Leaving the top resets it; any slide change restarts it.
  const [remaining, setRemaining] = useState(AUTOPLAY_MS);
  const [holding, setHolding] = useState(false);
  useEffect(() => {
    if (SLIDES.length < 2 || reduced) return;
    const TICK = 100;
    let left = AUTOPLAY_MS;
    setRemaining(left);
    const id = window.setInterval(() => {
      const hold = progressRef.current >= 0.04 || document.hidden;
      setHolding(hold);
      if (hold) {
        left = AUTOPLAY_MS;
        setRemaining(left);
        return;
      }
      left -= TICK;
      setRemaining(Math.ceil(left / 1000) * 1000); // only re-render when the shown second changes
      if (left <= 0) go(1);
    }, TICK);
    return () => window.clearInterval(id);
  }, [go, slide, reduced]);

  // Scroll progress drives CSS (copy fade) and the scatter amount.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const track = rect.height - window.innerHeight;
      const p = track > 0 ? Math.min(1, Math.max(0, -rect.top / track)) : 0;
      progressRef.current = p;
      section.style.setProperty("--p", p.toFixed(4));
      section.style.setProperty("--e", smoothstep(0.55, 0.9, p).toFixed(4));
      section.style.setProperty("--copy", (1 - smoothstep(0.42, 0.62, p)).toFixed(4));
      section.dataset.open = String(p > 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let disposed = false;
    let images: HTMLImageElement[] = [];
    let targets: Target[] = [];
    let N = 0;
    let x = new Float32Array(0), y = new Float32Array(0), vx = new Float32Array(0), vy = new Float32Array(0);
    let cr = new Float32Array(0), cg = new Float32Array(0), cb = new Float32Array(0), ca = new Float32Array(0);
    let rx = new Float32Array(0), ry = new Float32Array(0), ph = new Float32Array(0), fr = new Float32Array(0);
    let size = 2;
    let w = 0, h = 0, dpr = 1;
    let image: ImageData | null = null;
    let buf: Uint32Array | null = null;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let time = 0;

    const mouse = { x: -9999, y: -9999, active: false };

    const build = () => {
      if (!images.length) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const mobile = w < 768;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      image = ctx.createImageData(canvas.width, canvas.height);
      buf = new Uint32Array(image.data.buffer);

      // Particle budget: the physics runs every frame, so keep it phone-friendly.
      // Sampled once at full density; the slider only fades particles in/out.
      const budget = mobile ? 24000 : 80000;
      const samples = images.map((img, i) => sampleImage(img, w, h, budget, SLIDES[i].cutoff));
      N = Math.max(...samples.map((s) => s.xs.length));

      // Every slide gets exactly N targets; slides with fewer samples fade the extras out.
      targets = samples.map((s) => {
        const n = s.xs.length;
        const order = Array.from({ length: n }, (_, i) => i);
        for (let i = n - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          [order[i], order[j]] = [order[j], order[i]];
        }
        const tg: Target = {
          x: new Float32Array(N), y: new Float32Array(N),
          r: new Uint8Array(N), g: new Uint8Array(N), b: new Uint8Array(N),
          a: new Float32Array(N), light: new Uint8Array(N), count: n, size: s.spacing * 1.1,
        };
        for (let i = 0; i < N; i++) {
          const src = order[i % n];
          tg.x[i] = s.xs[src];
          tg.y[i] = s.ys[src];
          tg.r[i] = s.rs[src];
          tg.g[i] = s.gs[src];
          tg.b[i] = s.bs[src];
          tg.light[i] = s.ls[src];
          tg.a[i] = i < n ? 1 : 0;
        }
        return tg;
      });

      x = new Float32Array(N); y = new Float32Array(N);
      vx = new Float32Array(N); vy = new Float32Array(N);
      cr = new Float32Array(N); cg = new Float32Array(N); cb = new Float32Array(N); ca = new Float32Array(N);
      rx = new Float32Array(N); ry = new Float32Array(N); ph = new Float32Array(N); fr = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        // Intro: start as a loose cloud around the center, then assemble.
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.max(w, h) * 0.6;
        x[i] = w / 2 + Math.cos(ang) * dist;
        y[i] = h / 2 + Math.sin(ang) * dist;
        rx[i] = Math.random() * 2 - 1;
        ry[i] = Math.random() * 2 - 1;
        ph[i] = Math.random() * Math.PI * 2;
        fr[i] = 0.4 + Math.random() * 0.9;
      }
      size = (targets[slideRef.current]?.size ?? 2) / Math.sqrt(densityFraction(densityRef.current));
      setCounts(targets.map((tg) => tg.count));
      setReady(true);
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !visible || !buf || !image) return;
      const step = Math.min(3, (now - last) / 16.667);
      last = now;
      time += step / 60;

      const tg = targets[slideRef.current];
      if (!tg) return;

      if (kickRef.current) {
        kickRef.current = false;
        for (let i = 0; i < N; i++) {
          vx[i] += (Math.random() - 0.5) * 12;
          vy[i] += (Math.random() - 0.5) * 12;
        }
      }

      // Density: fewer visible particles get proportionally bigger, both eased.
      const frac = densityFraction(densityRef.current);
      const visibleCount = tg.count * frac;
      const targetSize = tg.size * Math.min(2.6, 1 / Math.sqrt(frac));
      size += (targetSize - size) * (1 - Math.pow(0.94, step));
      const p = progressRef.current;
      const p2 = p * p;
      const [ar, ag, ab] = accentRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const DX = w * 0.55;
      const DY = h * 0.9;
      const amp = 0.8 + p * 24;
      const K = 0.02 * step;
      const damp = Math.pow(0.88, step);
      const lerpC = 1 - Math.pow(0.93, step);
      const R = w < 768 ? 70 : 120;
      const R2 = R * R;
      const FORCE = 4.5 * step;
      const mActive = mouse.active;
      const e = smoothstep(0.55, 0.9, progressRef.current);
      const rc = e > 0 ? circleRadius(w, h) * e : 0;
      const rc2 = rc * rc;
      const ccx = w / 2, ccy = h / 2;
      const mx = mouse.x, my = mouse.y;
      const round = roundRef.current;
      const s = Math.max(1, Math.round(size * dpr));
      const rad = s / 2, rad2 = rad * rad;
      const tx = tg.x, ty = tg.y, tr = tg.r, tgc = tg.g, tbc = tg.b, ta = tg.a, tl = tg.light;

      buf.fill(0xff000000); // opaque black

      for (let i = 0; i < N; i++) {
        const want = i < visibleCount ? ta[i] : 0;
        ca[i] += (want - ca[i]) * lerpC * 0.45;

        // Home: image position, scattered upward by scroll, breathing over time.
        const tt = time * fr[i] + ph[i];
        const hx = tx[i] + rx[i] * DX * p2 + Math.sin(tt) * amp;
        const hy = ty[i] + (ry[i] - 0.8) * DY * p2 + Math.cos(tt * 0.8) * amp;

        let ax = (hx - x[i]) * K;
        let ay = (hy - y[i]) * K;

        if (mActive) {
          const ddx = x[i] - mx;
          const ddy = y[i] - my;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = 1 - d / R;
            const push = f * f * FORCE;
            ax += (ddx / d) * push;
            ay += (ddy / d) * push;
          }
        }

        vx[i] = (vx[i] + ax) * damp;
        vy[i] = (vy[i] + ay) * damp;
        x[i] += vx[i] * step;
        y[i] += vy[i] * step;

        // Idea space: keep a perfect circle clear by projecting particles onto its edge.
        if (rc > 1) {
          const cdx = x[i] - ccx;
          const cdy = y[i] - ccy;
          const cd2 = cdx * cdx + cdy * cdy;
          if (cd2 < rc2) {
            const cd = Math.sqrt(cd2) + 0.001;
            x[i] = ccx + (cdx / cd) * rc;
            y[i] = ccy + (cdy / cd) * rc;
            vx[i] *= 0.6;
            vy[i] *= 0.6;
          }
        }

        // Color: follow the slide, and tint bright particles with the accent as they scatter.
        const mix = tl[i] ? p : p * 0.35;
        cr[i] += (tr[i] + (ar - tr[i]) * mix - cr[i]) * lerpC;
        cg[i] += (tgc[i] + (ag - tgc[i]) * mix - cg[i]) * lerpC;
        cb[i] += (tbc[i] + (ab - tbc[i]) * mix - cb[i]) * lerpC;

        const a = ca[i] * (1 - p * 0.35 * (1 - tl[i]));
        if (a < 0.02) continue;

        // Premultiply against black (canvas is opaque).
        const col = 0xff000000 | (((cb[i] * a) | 0) << 16) | (((cg[i] * a) | 0) << 8) | ((cr[i] * a) | 0);
        const X = (x[i] * dpr - rad) | 0;
        const Y = (y[i] * dpr - rad) | 0;
        if (X >= W || Y >= H || X + s <= 0 || Y + s <= 0) continue;

        if (s <= 2 || !round) {
          const y0 = Math.max(0, Y), y1 = Math.min(H, Y + s);
          const x0 = Math.max(0, X), x1 = Math.min(W, X + s);
          for (let yy = y0; yy < y1; yy++) {
            const row = yy * W;
            for (let xx = x0; xx < x1; xx++) buf[row + xx] = col;
          }
        } else {
          for (let yy = 0; yy < s; yy++) {
            const py = Y + yy;
            if (py < 0 || py >= H) continue;
            const ddy = yy + 0.5 - rad;
            const row = py * W;
            for (let xx = 0; xx < s; xx++) {
              const ddx = xx + 0.5 - rad;
              if (ddx * ddx + ddy * ddy > rad2) continue;
              const px = X + xx;
              if (px >= 0 && px < W) buf[row + px] = col;
            }
          }
        }
      }
      ctx.putImageData(image, 0, 0);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !disposed) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    // Pointer: mouse anywhere over the stage; touch via touchmove so page scroll still works.
    const toLocal = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = cx - r.left;
      mouse.y = cy - r.top;
      mouse.active = mouse.y >= 0 && mouse.y <= r.height;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse") toLocal(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const tch = e.touches[0];
      if (tch) toLocal(tch.clientX, tch.clientY);
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return; // ignore mobile URL-bar height changes
      lastW = window.innerWidth;
      build();
    };

    Promise.all(SLIDES.map((sl) => loadImage(sl.src))).then((imgs) => {
      if (disposed) return;
      images = imgs;
      build();
      start();
    });

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="hero group/hero relative" style={{ height: reduced ? "100svh" : "260svh" }}>
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black [container-type:size]"
      >
        {reduced ? (
          SLIDES.map(({ src }, i) => (
            <img
              key={src}
              src={src}
              alt={i === slide ? t.portraitAlt : ""}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: i === slide ? 1 : 0 }}
            />
          ))
        ) : (
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t.portraitAlt}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {/* Accent glow that grows as the cloud scatters — adds depth */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background: "radial-gradient(60% 80% at 50% 100%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)",
            opacity: "calc(var(--p, 0) * 1.3 - 0.2)",
          }}
        />

        {/* Idea space: the circle the particles are pushed out of (same radius as the canvas physics). */}
        {!reduced && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full [--rk:0.72] md:[--rk:0.52]"
            style={{
              width: "calc(min(100cqw, 100cqh) * var(--rk) * var(--e, 0))",
              height: "calc(min(100cqw, 100cqh) * var(--rk) * var(--e, 0))",
              boxShadow: "inset 0 0 0 1px rgb(255 255 255 / calc(var(--e, 0) * 0.14))",
            }}
          >
            <p
              className="display whitespace-nowrap text-center italic leading-none text-white/90"
              style={{
                // Sized from the circle's full diameter so it always sits well inside the ring.
                fontSize: "clamp(1rem, calc(min(100cqw, 100cqh) * var(--rk) * 0.075), 1.9rem)",
                opacity: "clamp(0, calc((var(--e, 0) - 0.6) * 3), 1)",
                transform: "scale(calc(0.7 + clamp(0, calc((var(--e, 0) - 0.6) * 3), 1) * 0.3))",
              }}
            >
              {t.ideaSpace}
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8 sm:pb-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div
              style={{
                opacity: "var(--copy, 1)",
                transform: "translateY(calc((1 - var(--copy, 1)) * -24px))",
                filter: "blur(calc((1 - var(--copy, 1)) * 6px))",
              }}
            >
              <p className="label mb-3 text-white/70">{t.role} · {t.location}</p>
              <h1 className="display text-[clamp(3.5rem,13vw,11rem)] leading-[0.85] text-white">
                Dani <em className="text-[var(--accent)]">Cruz</em>
              </h1>
              <p
                className="mt-4 max-w-md text-lg text-white/85 sm:text-xl"
                style={{
                  opacity: "clamp(0, calc(var(--p, 0) * 4.5 - 0.4), 1)",
                  transform: "translateY(calc((1 - clamp(0, calc(var(--p, 0) * 4.5 - 0.4), 1)) * 12px))",
                }}
              >
                {t.tagline}
              </p>
            </div>

            <div className="glass pointer-events-auto w-full max-w-[22rem] rounded-2xl p-4 text-sm max-md:opacity-[var(--copy,1)] max-md:group-data-[open=true]/hero:pointer-events-none md:w-auto md:min-w-[19rem]">
              {SLIDES.length > 1 && (
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <button type="button" onClick={() => go(-1)} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white" aria-label={t.prev}>
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-2" role="tablist" aria-label={t.slides}>
                    {SLIDES.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === slide}
                        aria-label={`${i + 1} / ${SLIDES.length}`}
                        onClick={() => setSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-8 bg-[var(--accent)]" : "w-3 bg-white/30 hover:bg-white/60"}`}
                      />
                    ))}
                    <span
                      className={`label ml-1 w-6 text-right tabular-nums transition-colors ${holding ? "text-white/30" : "text-white/55"}`}
                      aria-label={t.nextIn.replace("{s}", String(Math.max(1, Math.ceil(remaining / 1000))))}
                    >
                      {Math.max(1, Math.ceil(remaining / 1000))}s
                    </span>
                  </div>
                  <button type="button" onClick={() => go(1)} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white" aria-label={t.next}>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
              {!reduced && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="display text-2xl italic text-[var(--accent-2)]">{t.tryIt}</span>
                    <span className="label tabular-nums text-white/60">{(((counts[slide] ?? 0) * densityFraction(density)) / 1000).toFixed(1)}k {t.particles}</span>
                  </div>
                  <label className="mt-3 block">
                    <span className="label text-white/60">{t.density}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={density}
                      onChange={(e) => setDensity(Number(e.target.value))}
                      className="range mt-2 w-full"
                      aria-label={t.density}
                    />
                  </label>
                  <label className="mt-3 flex cursor-pointer items-center gap-2 text-white/80">
                    <input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} className="accent-[var(--accent)]" />
                    {t.round}
                  </label>
                </>
              )}
            </div>
          </div>
          {!reduced && (
            <p className="label mt-6 text-center text-white/50" style={{ opacity: "calc(1 - var(--p, 0) * 6)" }}>
              {t.scroll}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
