import { useState } from "react";
import { useLang } from "../i18n";

export function TypeLab() {
  const t = useLang().t.labs.type;
  const [text, setText] = useState(t.placeholder);
  const [weight, setWeight] = useState(700);
  const [size, setSize] = useState(1);
  const [serif, setSerif] = useState(false);

  return (
    <div>
      <div className="flex min-h-[10rem] items-center overflow-hidden rounded-2xl bg-[var(--surface)] px-4 sm:min-h-[16rem] sm:px-8">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 24))}
          aria-label={t.title}
          className={`w-full bg-transparent leading-none text-white outline-none ${serif ? "display italic" : ""}`}
          style={{
            fontSize: `calc(clamp(3rem, 10vw, 8rem) * ${size})`,
            ...(serif ? {} : { fontWeight: weight, letterSpacing: `${(500 - weight) / 9000}em` }),
          }}
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label flex justify-between text-white/60">
            {t.weight} <span className="tabular-nums">{serif ? "—" : weight}</span>
          </span>
          <input
            type="range"
            min={100}
            max={900}
            step={10}
            value={weight}
            disabled={serif}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="range mt-3 w-full disabled:opacity-30"
          />
        </label>
        <label className="block">
          <span className="label flex justify-between text-white/60">
            {t.size} <span className="tabular-nums">{Math.round(size * 100)}%</span>
          </span>
          <input
            type="range"
            min={0.5}
            max={1.4}
            step={0.05}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="range mt-3 w-full"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { id: false, label: "Inter Tight" },
          { id: true, label: "Instrument Serif" },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => setSerif(o.id)}
            aria-pressed={serif === o.id}
            className={`rounded-full border px-3 py-1.5 text-sm ${serif === o.id ? "border-[var(--accent)] text-white" : "border-white/15 text-white/60"} ${o.id ? "display italic" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
