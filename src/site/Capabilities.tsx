import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import type { Capability } from "./content";
import { useLang } from "./i18n";

// Each card gets a deeper mix of the accent — the stack reads as layers of depth.
const tints = [10, 26, 100];

function Card({ cap, i, total, progress }: { cap: Capability; i: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - i) * 0.045;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  const solid = i === total - 1;

  return (
    <div className="sticky flex h-[100svh] items-start justify-center px-4 sm:px-8" style={{ top: 0, paddingTop: `calc(14svh + ${i * 22}px)` }}>
      <motion.article
        style={{
          scale,
          transformOrigin: "top center",
          background: `color-mix(in srgb, var(--accent) ${solid ? 100 : (tints[i] ?? 20)}%, var(--surface))`,
        }}
        className={`relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 p-6 shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.8)] sm:p-10 md:p-14 ${solid ? "text-black" : "text-white"}`}
      >
        <div className="flex items-start justify-between gap-6">
          <span className={`label ${solid ? "text-black/60" : "text-white/50"}`}>{cap.index} / 0{total}</span>
          <span className="display text-[clamp(4rem,12vw,9rem)] leading-none opacity-20">{cap.index}</span>
        </div>
        <h3 className="display mt-2 max-w-3xl text-[clamp(2rem,4.6vw,3.8rem)] leading-[0.98]">{cap.title}</h3>
        <p className={`mt-5 max-w-xl text-base sm:text-lg ${solid ? "text-black/75" : "text-white/75"}`}>{cap.body}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {cap.tags.map((t) => (
            <li key={t} className={`rounded-full border px-3 py-1.5 text-sm ${solid ? "border-black/20" : "border-white/15 text-white/80"}`}>
              {t}
            </li>
          ))}
        </ul>
      </motion.article>
    </div>
  );
}

/** Stacked deck: each capability pins and the previous one recedes behind it. */
export function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { t } = useLang();
  const capabilities = t.capabilities.items;

  return (
    <section ref={ref} id="capabilities" className="relative bg-black">
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-8">
        <p className="label text-[var(--accent)]">( {t.capabilities.label} )</p>
        <h2 className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-white">
          {t.capabilities.title} <em className="text-[var(--accent-2)]">{t.capabilities.titleAccent}</em>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">{t.capabilities.intro}</p>
      </div>
      {capabilities.map((cap, i) => (
        <Card key={cap.index} cap={cap} i={i} total={capabilities.length} progress={scrollYProgress} />
      ))}
    </section>
  );
}
