import { useState } from "react";
import { Check, Shuffle } from "lucide-react";
import { palettes, randomPalette, usePalette } from "../palette";
import { useLang } from "../i18n";

export function PaletteLab() {
  const { palette, setPalette } = usePalette();
  const t = useLang().t.labs.palette;
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const swatches = [palette.accent, palette.accent2, palette.surface];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-md text-white/70">{t.hint}</p>
        <button type="button" onClick={() => setPalette(randomPalette())} className="btn btn-accent">
          <Shuffle size={16} /> {t.shuffle}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        {swatches.map((hex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => copy(hex)}
            className="relative flex aspect-[4/5] flex-col justify-end rounded-2xl border border-white/10 p-3 text-left transition-transform duration-300 hover:-translate-y-1 sm:aspect-[4/3]"
            style={{ background: hex }}
            aria-label={`${t.swatches[i]} ${hex}`}
          >
            <span className="rounded-lg bg-black/55 px-2 py-1 text-xs text-white backdrop-blur">
              <span className="block text-white/60">{t.swatches[i]}</span>
              <span className="font-mono">{copied === hex ? <Check size={12} className="inline" /> : hex}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {palettes.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPalette(p)}
            aria-pressed={palette.id === p.id}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${palette.id === p.id ? "border-white/60 text-white" : "border-white/15 text-white/60 hover:text-white"}`}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${p.accent} 50%, ${p.accent2} 50%)` }} />
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
