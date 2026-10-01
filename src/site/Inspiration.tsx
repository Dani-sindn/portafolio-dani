import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useLang } from "./i18n";

const POST_URL = "https://www.instagram.com/p/C7XJ5DFvkyb/";
// Instagram's embed can't be themed, so we crop it to the media only.
// The post is square; the embed's white profile header above it is 54px tall.
const EMBED_HEADER_PX = 54;

/** "Why this site looks like this": the 2024 projection experiment that seeded the particles. */
export function Inspiration() {
  const t = useLang().t.inspiration;
  const ref = useRef<HTMLDivElement>(null);
  // Mount the Instagram iframe only when the section gets close — keeps first load light.
  const near = useInView(ref, { once: true, margin: "400px 0px" });

  return (
    <section className="relative bg-black px-4 py-20 sm:px-8 sm:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:gap-16"
      >
        <div>
          <p className="label text-[var(--accent)]">( {t.label} )</p>
          <h2 className="display mt-5 text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95] text-white">
            {t.title} <em className="text-[var(--accent-2)]">{t.titleAccent}</em>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">{t.body}</p>
        </div>
        <figure className="relative">
          {/* Depth: accent light pooling under the video */}
          <div
            className="pointer-events-none absolute inset-x-[8%] -bottom-6 top-[20%] rounded-full blur-3xl"
            style={{ background: "var(--accent)", opacity: 0.22 }}
          />
          <div className="relative aspect-square overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            {near ? (
              <iframe
                src={`${POST_URL}embed/`}
                title={t.videoTitle}
                loading="lazy"
                allow="encrypted-media; picture-in-picture"
                scrolling="no"
                className="absolute left-0 w-full border-0"
                style={{ top: -EMBED_HEADER_PX, height: `calc(100% + ${EMBED_HEADER_PX + 260}px)` }}
              />
            ) : (
              <div className="absolute inset-0 animate-pulse bg-white/[0.03]" />
            )}
          </div>
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm">
            <span className="label flex items-center gap-2 text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {t.meta}
            </span>
            <a href={POST_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white">
              Instagram <ArrowUpRight size={14} />
            </a>
          </figcaption>
        </figure>
      </motion.div>
    </section>
  );
}
