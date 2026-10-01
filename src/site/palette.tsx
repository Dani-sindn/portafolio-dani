import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface Palette {
  id: string;
  name: string;
  /** Main accent: particles, highlights, CTAs. */
  accent: string;
  /** Secondary accent for gradients and depth. */
  accent2: string;
  /** Tinted dark surface used for raised cards. */
  surface: string;
}

export const palettes: Palette[] = [
  { id: "cobalt", name: "Cobalt", accent: "#3D8BFF", accent2: "#A1D3FF", surface: "#0B1220" },
  { id: "ember", name: "Ember", accent: "#FF5A1F", accent2: "#FFC53D", surface: "#1A0E09" },
  { id: "acid", name: "Acid", accent: "#C6FF3D", accent2: "#7B61FF", surface: "#10140A" },
  { id: "bloom", name: "Bloom", accent: "#FF4FA3", accent2: "#6EE7F9", surface: "#1A0B14" },
];

interface PaletteState {
  palette: Palette;
  setPalette: (p: Palette) => void;
  cycle: () => void;
}

const Ctx = createContext<PaletteState | null>(null);

const STORAGE_KEY = "dc-palette";

function readStored(): Palette {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Palette;
      if (parsed?.accent && parsed?.accent2 && parsed?.surface) return parsed;
    }
  } catch {
    /* storage unavailable — fall back to default */
  }
  return palettes[0];
}

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>(readStored);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--accent", palette.accent);
    root.setProperty("--accent-2", palette.accent2);
    root.setProperty("--surface", palette.surface);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", palette.surface);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(palette));
    } catch {
      /* ignore */
    }
  }, [palette]);

  const setPalette = useCallback((p: Palette) => setPaletteState(p), []);
  const cycle = useCallback(() => {
    setPaletteState((cur) => {
      const i = palettes.findIndex((p) => p.id === cur.id);
      return palettes[(i + 1) % palettes.length];
    });
  }, []);

  const value = useMemo(() => ({ palette, setPalette, cycle }), [palette, setPalette, cycle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePalette must be used inside PaletteProvider");
  return ctx;
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** HSL → hex, h in [0,360), s/l in [0,1]. */
export function hsl(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

/** Generates a random harmonious palette (accent, accent2, surface). */
export function randomPalette(): Palette {
  const h = Math.floor(Math.random() * 360);
  const schemes = [150, 180, 210, -60, 120];
  const offset = schemes[Math.floor(Math.random() * schemes.length)];
  const h2 = (h + offset + 360) % 360;
  return {
    id: "custom",
    name: "Custom",
    accent: hsl(h, 0.85 + Math.random() * 0.15, 0.55 + Math.random() * 0.08),
    accent2: hsl(h2, 0.8, 0.72),
    surface: hsl(h, 0.35, 0.06),
  };
}
