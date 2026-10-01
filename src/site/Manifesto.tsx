import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useLang } from "./i18n";

function Word({ word, range, progress, accent }: { word: string; range: [number, number]; progress: MotionValue<number>; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "display italic text-[var(--accent)]" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/** Pinned text whose words light up one by one as you scroll. Paragraphs are separated by a blank line. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { t } = useLang();
  const paragraphs = t.manifesto.text.split("\n\n").map((p) => p.split(" "));
  const total = paragraphs.reduce((n, p) => n + p.length, 0);
  const accents = new Set(t.manifesto.accents);
  let index = 0;

  return (
    <section ref={ref} id="about" className="relative h-[260svh] bg-black">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div key={t.manifesto.text} className="mx-auto max-w-5xl px-4 sm:px-8">
          <p className="label mb-6 text-[var(--accent)]">( {t.manifesto.label} )</p>
          {paragraphs.map((words, pi) => (
            <p
              key={pi}
              className={
                pi === 0
                  ? "text-[clamp(1.9rem,5.2vw,4rem)] font-medium leading-[1.08] tracking-tight text-white"
                  : "mt-6 max-w-3xl text-[clamp(1.2rem,2.6vw,2rem)] leading-[1.25] tracking-tight text-white/90"
              }
            >
              {words.map((w) => {
                const start = (index++ / total) * 0.85;
                return <Word key={index} word={w} progress={scrollYProgress} range={[start, start + 0.85 / total + 0.04]} accent={accents.has(w)} />;
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
