import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import type { Step } from "./content";
import { useLang } from "./i18n";

// Demo points shown inside the phone mockup (illustrative, not real locations).
const pins = [
  { x: 22, y: 30, ok: true }, { x: 64, y: 22, ok: false }, { x: 48, y: 48, ok: true },
  { x: 78, y: 58, ok: false }, { x: 30, y: 66, ok: true }, { x: 58, y: 78, ok: false },
  { x: 14, y: 50, ok: false }, { x: 76, y: 36, ok: true },
];

const points = [
  { name: "Punto 01 · Usaquén", need: "Agua · Urgente", tone: "urgent", crowd: "Abierto", ago: "hace 3 min" },
  { name: "Punto 02 · Toberín", need: "Mantas · Normal", tone: "normal", crowd: "Lleno", ago: "hace 12 min" },
  { name: "Punto 03 · Suba", need: "Ropa · Ya no recibe", tone: "closed", crowd: "Abierto", ago: "hace 1 h" },
];

const toneClass: Record<string, string> = {
  urgent: "bg-[var(--accent)] text-black",
  normal: "bg-white/15 text-white",
  closed: "bg-white/5 text-white/40 line-through",
};

function PhoneScreen({ step }: { step: number }) {
  if (step <= 1) {
    return (
      <div className="relative h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]">
        {/* faux street grid */}
        <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <path d="M28 0H0V28" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {pins.map((p, i) => {
          const hidden = step === 1 && !p.ok;
          return (
            <motion.div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.4 : step === 1 ? 1.15 : 1 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${step === 1 ? "bg-[var(--accent)] text-black" : "bg-white/20 text-white"}`}>
                {step === 1 ? <BadgeCheck size={11} /> : <MapPin size={11} />}
                {step === 1 ? "Verificado" : "?"}
              </div>
            </motion.div>
          );
        })}
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/70 p-3 text-[11px] text-white/80 backdrop-blur">
          {step === 0 ? "12 puntos sin verificar · info de redes sociales" : "4 puntos autorizados por la alcaldía"}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex h-full flex-col gap-2 p-3">
        <p className="label px-1 pt-1 text-white/50">Cerca de ti</p>
        {points.map((pt, i) => (
          <motion.div
            key={pt.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-white">{pt.name}</span>
              <span className="text-[10px] text-white/40">{pt.ago}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${toneClass[pt.tone]}`}>{pt.need}</span>
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/70">{pt.crowd}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4">
      {["Público", "Coordinador", "Admin"].map((role, i) => (
        <motion.div
          key={role}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl p-3"
          style={{ background: `color-mix(in srgb, var(--accent) ${20 + i * 30}%, #111)` }}
        >
          <p className={`text-sm font-semibold ${i === 2 ? "text-black" : "text-white"}`}>{role}</p>
          <p className={`text-[11px] ${i === 2 ? "text-black/70" : "text-white/60"}`}>
            {["Ve puntos y necesidades", "Actualiza su punto en vivo", "Verifica y asigna"][i]}
          </p>
        </motion.div>
      ))}
      <div className="mt-2 rounded-xl border border-dashed border-white/20 p-3 text-center text-[11px] text-white/60">
        git clone → tu zona → deploy
      </div>
    </div>
  );
}

function StepBlock({ step, i, onActive }: { step: Step; i: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);

  return (
    <div ref={ref} className="flex min-h-[80svh] items-end pb-[6svh] md:min-h-[90svh] md:items-center md:pb-0">
      <div className={`glass rounded-2xl p-6 transition-opacity duration-500 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none ${inView ? "opacity-100" : "md:opacity-30"}`}>
        <p className="label text-[var(--accent)]">0{i + 1} — {step.kicker}</p>
        <h3 className="display mt-3 text-[clamp(2rem,4.5vw,3.6rem)] leading-[0.98] text-white">{step.title}</h3>
        <p className="mt-4 max-w-md text-base text-white/75 sm:text-lg">{step.body}</p>
      </div>
    </div>
  );
}

/** Featured case study told as a scroll story: text steps drive the phone. */
export function Featured() {
  const [active, setActive] = useState(0);
  const featured = useLang().t.featured;

  return (
    <section id="work" className="relative bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label text-[var(--accent)]">( {featured.label} — {featured.year} )</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display text-[clamp(3rem,10vw,8rem)] leading-[0.88] text-white">{featured.name}</h2>
          <div className="max-w-sm">
            <p className="text-white/75">{featured.summary}</p>
            <p className="label mt-3 text-white/45">{featured.role.join(" · ")}</p>
            <a href={featured.url} target="_blank" rel="noreferrer" className="btn mt-5">
              {featured.cta} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="relative mt-10 grid gap-0 md:grid-cols-2 md:gap-16">
          {/* Phone: sticky. On mobile it pins near the top and the steps scroll over it. */}
          <div className="sticky top-16 z-0 flex h-[54svh] items-center justify-center md:order-2 md:top-0 md:h-[100svh]">
            <div
              className="relative aspect-[9/19] h-full max-h-[640px] rounded-[2.4rem] border border-white/15 bg-[#0a0a0a] p-2 shadow-2xl"
              style={{ boxShadow: "0 40px 120px -30px color-mix(in srgb, var(--accent) 55%, transparent)" }}
            >
              <div className="relative h-full overflow-hidden rounded-[2rem] bg-[#050505]">
                <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[11px] text-white/70">
                  <span className="font-semibold">RedAcopio</span>
                  <span className="label">Norte · Bogotá</span>
                </div>
                <div className="relative h-[calc(100%-2rem)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active <= 1 ? "map" : active}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <PhoneScreen step={active} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 md:order-1">
            {featured.steps.map((s, i) => (
              <StepBlock key={s.kicker} step={s} i={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
