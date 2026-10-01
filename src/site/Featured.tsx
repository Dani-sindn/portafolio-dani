import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight, BadgeCheck, X } from "lucide-react";
import type { WorkItem } from "./content";
import { useLang } from "./i18n";
import { Link } from "./router";

/* ---------- Generative covers (no photos needed; they follow the active palette) ---------- */

/** Moves a cover layer with the card's pointer position (--dx/--dy set on the card). */
const depth = (px: number) => ({
  transform: `translate3d(calc(var(--dx, 0) * ${px}px), calc(var(--dy, 0) * ${px}px), 0)`,
  transition: "transform 0.3s ease-out",
});

function ZaloCover() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -right-10 -top-10 h-2/3 w-2/3 rounded-full blur-3xl" style={{ background: "var(--accent)", opacity: 0.35, ...depth(-10) }} />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" style={depth(8)} aria-hidden="true">
        <path d="M70 215 C 150 40, 260 40, 330 110" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeDasharray="6 8" className="animate-[dash_6s_linear_infinite]" />
        <circle cx="70" cy="215" r="7" fill="var(--accent)" />
        <circle cx="330" cy="110" r="7" fill="var(--accent)" />
        <circle cx="70" cy="215" r="18" fill="none" stroke="var(--accent)" strokeOpacity="0.4" className="origin-[70px_215px] animate-[ping_2.4s_ease-out_infinite]" />
      </svg>
      <span className="display absolute bottom-[12%] left-[8%] text-[clamp(3rem,7vw,5rem)] leading-none text-white" style={depth(18)}>MX</span>
      <span className="display absolute right-[8%] top-[10%] text-[clamp(3rem,7vw,5rem)] italic leading-none text-[var(--accent)]" style={depth(26)}>DO</span>
    </div>
  );
}

function ElBosqueCover() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${30 + i * 18}%`,
            aspectRatio: "1",
            borderColor: `color-mix(in srgb, var(--accent) ${70 - i * 15}%, transparent)`,
            animation: `pulse-ring 3.2s ease-in-out ${i * 0.35}s infinite`,
            ...depth(6 + i * 6),
          }}
        />
      ))}
      <span className="h-4 w-4 rounded-full bg-[var(--accent-2)]" style={depth(30)} />
      <span className="label absolute bottom-[10%] text-white/60" style={depth(14)}>Creación Digital</span>
    </div>
  );
}

const pins = [
  { x: 24, y: 34 }, { x: 58, y: 26 }, { x: 44, y: 56 }, { x: 72, y: 62 }, { x: 30, y: 74 },
];

function RedAcopioCover() {
  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden="true" style={depth(-6)}>
        <defs>
          <pattern id="work-grid" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path d="M26 0H0V26" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#work-grid)" />
      </svg>
      {pins.map((p, i) => (
        <span
          key={i}
          className="absolute flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-full bg-[var(--accent)] px-2 py-1 text-[10px] font-medium text-black"
          style={{ left: `${p.x}%`, top: `${p.y}%`, ...depth(10 + i * 4) }}
        >
          <BadgeCheck size={11} /> {String(i + 1).padStart(2, "0")}
        </span>
      ))}
    </div>
  );
}

function MoreCover() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]"
          style={{
            left: `${(i * 37) % 90 + 5}%`,
            top: `${(i * 53) % 80 + 10}%`,
            opacity: 0.35 + ((i * 13) % 6) / 10,
            animation: `float-dot ${4 + (i % 4)}s ease-in-out ${i * 0.2}s infinite alternate`,
            ...depth(8 + (i % 5) * 6),
          }}
        />
      ))}
      <span className="display text-[clamp(7rem,16vw,11rem)] leading-none text-[var(--accent)]" style={depth(24)}>+</span>
    </div>
  );
}

const covers: Record<WorkItem["id"], () => ReactNode> = {
  zalo: ZaloCover,
  elbosque: ElBosqueCover,
  redacopio: RedAcopioCover,
  more: MoreCover,
};

function Cover({ id, className = "" }: { id: WorkItem["id"]; className?: string }) {
  const C = covers[id];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: "radial-gradient(90% 90% at 30% 20%, color-mix(in srgb, var(--accent) 18%, var(--surface)), var(--surface) 70%)" }}
    >
      <C />
    </div>
  );
}

/* ---------- Card + detail ---------- */

function Card({ item, index, total, onOpen, openLabel }: { item: WorkItem; index: number; total: number; onOpen: () => void; openLabel: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--dx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--dy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const reset = () => {
    ref.current?.style.setProperty("--dx", "0");
    ref.current?.style.setProperty("--dy", "0");
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onPointerMove={move}
      onPointerLeave={reset}
      className="group flex h-full w-[82vw] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#070707] text-left transition-[border-color,transform] duration-500 hover:border-white/30 sm:w-[26rem] md:w-[30rem]"
      style={{
        transform: "perspective(1200px) rotateX(calc(var(--dy, 0) * -3deg)) rotateY(calc(var(--dx, 0) * 4deg))",
      }}
    >
      <Cover id={item.id} className="min-h-0 flex-1" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="label text-[var(--accent)]">{item.kicker}</span>
          <span className="label shrink-0 text-white/40">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <h3 className="display mt-3 text-[clamp(1.9rem,3vw,2.6rem)] leading-[1] text-white">{item.title}</h3>
        <p className="mt-3 line-clamp-2 text-white/65">{item.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-white/70 transition-colors group-hover:text-[var(--accent)]">
          {openLabel} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

function Detail({ item, onClose, closeLabel }: { item: WorkItem; onClose: () => void; closeLabel: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-detail-title"
    >
      <motion.article
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#070707] sm:rounded-[28px]"
      >
        <Cover id={item.id} className="aspect-[16/9]" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
          aria-label={closeLabel}
        >
          <X size={18} />
        </button>
        <div className="p-6 sm:p-10">
          <p className="label text-[var(--accent)]">
            {item.kicker}
            {item.year ? ` · ${item.year}` : ""}
          </p>
          <h3 id="work-detail-title" className="display mt-3 text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] text-white">
            {item.title}
          </h3>
          {item.body.map((p) => (
            <p key={p} className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
              {p}
            </p>
          ))}
          <ul className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70">
                {tag}
              </li>
            ))}
          </ul>
          {item.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {item.links.map((l, i) =>
                l.href.startsWith("/") ? (
                  <Link key={l.href} href={l.href} onClick={onClose} className={i === 0 ? "btn btn-accent" : "btn"}>
                    {l.label} <ArrowUpRight size={16} />
                  </Link>
                ) : (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={i === 0 ? "btn btn-accent" : "btn"}>
                    {l.label} <ArrowUpRight size={16} />
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

/* ---------- Section ---------- */

function usePinnedGallery() {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return pinned;
}

/**
 * Work gallery. On desktop the section pins and vertical scroll slides the cards sideways;
 * on phones it's a native swipe carousel. Cards open a detail sheet.
 */
export function Featured() {
  const t = useLang().t.work;
  const [open, setOpen] = useState<WorkItem | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const pinned = usePinnedGallery();

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, t.items.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  const header = (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:px-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="label text-[var(--accent)]">( {t.label} )</p>
        <h2 className="display mt-4 text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[0.92] text-white">
          {t.title} <em className="text-[var(--accent-2)]">{t.titleAccent}</em>
        </h2>
      </div>
      <p className="label text-white/45">{pinned ? t.hint : t.hintTouch}</p>
    </div>
  );

  const cards = t.items.map((item, i) => (
    <Card key={item.id} item={item} index={i} total={t.items.length} onOpen={() => setOpen(item)} openLabel={t.open} />
  ));

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-black"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      {pinned ? (
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-10 overflow-hidden pt-20">
          {header}
          <motion.div ref={trackRef} style={{ x }} className="flex h-[min(60svh,560px)] w-max gap-6 px-8 will-change-transform lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {cards}
          </motion.div>
          <div className="mx-auto h-px w-full max-w-7xl px-8">
            <div className="h-px w-full bg-white/10">
              <motion.div className="h-px bg-[var(--accent)]" style={{ width: bar }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24">
          {header}
          <div
            ref={trackRef}
            className="mt-10 flex h-[min(68svh,560px)] snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {cards}
          </div>
        </div>
      )}

      <AnimatePresence>{open && <Detail key={open.id} item={open} onClose={close} closeLabel={t.close} />}</AnimatePresence>
    </section>
  );
}
