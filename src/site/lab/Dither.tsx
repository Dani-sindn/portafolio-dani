import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/hero-4.webp";
import { hexToRgb, usePalette } from "../palette";
import { useLang } from "../i18n";

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export function Dither() {
  const t = useLang().t.labs.dither;
  const { palette } = usePalette();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [pixel, setPixel] = useState(6);
  const [contrast, setContrast] = useState(1.6);

  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = portrait;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    // Crop to a centered 4:5 frame around the subject.
    const ch = img.naturalHeight;
    const cw = ch * 0.8;
    const cx = (img.naturalWidth - cw) / 2;
    const w = Math.max(8, Math.round(640 / pixel));
    const h = Math.round(w / 0.8);

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(img, cx, 0, cw, ch, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const d = data.data;
    const ramp = [palette.surface, palette.accent, palette.accent2, "#FFFFFF"].map(hexToRgb);
    const levels = ramp.length - 1;

    // Auto-levels: the source photo is very dark, so stretch to its brightest pixel first.
    const lum = new Float32Array(w * h);
    let max = 0.01;
    for (let i = 0; i < lum.length; i++) {
      const k = i * 4;
      lum[i] = (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255;
      if (lum[i] > max) max = lum[i];
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const k = (y * w + x) * 4;
        let l = Math.pow(lum[y * w + x] / max, 0.55);
        l = Math.min(1, Math.max(0, (l - 0.5) * contrast + 0.42));
        const v = l * levels;
        const base = Math.floor(v);
        const idx = Math.min(levels, base + (v - base > BAYER[(y % 4) * 4 + (x % 4)] ? 1 : 0));
        const [r, g, b] = ramp[idx];
        d[k] = r;
        d[k + 1] = g;
        d[k + 2] = b;
        d[k + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);
  }, [img, pixel, contrast, palette]);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
      <canvas
        ref={canvasRef}
        className="mx-auto aspect-[4/5] w-full max-w-md rounded-2xl bg-[var(--surface)]"
        style={{ imageRendering: "pixelated" }}
        aria-label={t.title}
      />
      <div className="space-y-5">
        <label className="block">
          <span className="label flex justify-between text-white/60">
            {t.pixel} <span className="tabular-nums">{pixel}px</span>
          </span>
          <input type="range" min={2} max={16} step={1} value={pixel} onChange={(e) => setPixel(Number(e.target.value))} className="range mt-3 w-full" />
        </label>
        <label className="block">
          <span className="label flex justify-between text-white/60">
            {t.contrast} <span className="tabular-nums">{contrast.toFixed(1)}</span>
          </span>
          <input type="range" min={0.8} max={3} step={0.1} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="range mt-3 w-full" />
        </label>
      </div>
    </div>
  );
}
