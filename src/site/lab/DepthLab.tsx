import { useRef, type PointerEvent } from "react";
import { useLang } from "../i18n";

export function DepthLab() {
  const t = useLang().t.labs.depth;
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--dx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--dy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const reset = () => {
    ref.current?.style.setProperty("--dx", "0");
    ref.current?.style.setProperty("--dy", "0");
  };

  const layer = (depth: number) => ({
    transform: `translate3d(calc(var(--dx, 0) * ${depth}px), calc(var(--dy, 0) * ${depth}px), 0)`,
  });

  return (
    <div>
      <p className="label text-white/50">{t.hint}</p>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={reset}
        onPointerUp={reset}
        className="relative mx-auto mt-4 aspect-square max-w-xl touch-none overflow-hidden rounded-2xl bg-[var(--surface)]"
        style={{
          transform: "perspective(900px) rotateX(calc(var(--dy, 0) * -8deg)) rotateY(calc(var(--dx, 0) * 8deg))",
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="absolute inset-0 transition-transform duration-200 ease-out" style={layer(-14)}>
          <div className="absolute -left-8 top-8 h-2/3 w-2/3 rounded-full blur-2xl" style={{ background: "var(--accent-2)", opacity: 0.35 }} />
        </div>
        <div className="absolute inset-0 transition-transform duration-200 ease-out" style={layer(22)}>
          <div className="absolute bottom-10 right-8 h-1/2 w-1/2 rounded-full" style={{ background: "var(--accent)" }} />
        </div>
        <div className="absolute inset-0 transition-transform duration-200 ease-out" style={layer(44)}>
          <div className="absolute left-6 top-6 h-16 w-16 rounded-xl border-2 border-white/80" />
        </div>
        <div className="absolute inset-0 flex items-end p-6 transition-transform duration-200 ease-out" style={layer(66)}>
          <span className="display text-6xl italic text-white mix-blend-difference">{t.word}</span>
        </div>
      </div>
    </div>
  );
}
