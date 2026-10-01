import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { track } from "@vercel/analytics";
import { MessageCircle } from "lucide-react";
import { useLang } from "./i18n";
import { Link, usePath } from "./router";

gsap.registerPlugin(useGSAP);

const SIZE = 56; // collapsed diameter (px)
const IDLE_MS = 1400; // how long it stays open after the page stops moving

/**
 * All the "when should the button show / open" rules in one place.
 * - visible: past the top of the home page (or anywhere on /lab), and not while the agenda,
 *   the footer or an overlay (menu, project sheet, language modal) is on screen.
 * - moving: the page scrolled within the last IDLE_MS.
 */
function useTalkState() {
  const path = usePath();
  const [visible, setVisible] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    let raf = 0;
    let idle = 0;
    const inView = (id: string) => {
      const r = document.getElementById(id)?.getBoundingClientRect();
      return r ? r.top < window.innerHeight * 0.85 && r.bottom > 0 : false;
    };
    const check = () => {
      raf = 0;
      const threshold = path === "/" ? window.innerHeight * 0.6 : 120;
      const overlayOpen = document.body.style.overflow === "hidden";
      setVisible(window.scrollY > threshold && !inView("agenda") && !inView("contact") && !overlayOpen);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
      setMoving(true);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setMoving(false), IDLE_MS);
    };
    // Overlays lock body scroll; watch that attribute so the button hides with them.
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(check);
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  return { visible, moving };
}

/**
 * "Let's talk" floating button, animated with GSAP.
 * A circle that pops in after the hero, stretches into a pill while the page moves (or on
 * hover/focus), leans toward the cursor (magnetic) and takes visitors to the agenda.
 */
export function TalkButton() {
  const { t } = useLang();
  const { visible, moving } = useTalkState();
  const [hover, setHover] = useState(false);
  const open = moving || hover;

  const root = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLAnchorElement>(null);
  const icon = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const openWidth = useRef(SIZE);
  const greeted = useRef(false);
  const reduced = useRef(false);

  // Measure the expanded width whenever the label text changes (language switch).
  useLayoutEffect(() => {
    // Label has -ml-1 and pr-5: icon slot + label box − 4px overlap.
    if (label.current) openWidth.current = SIZE + label.current.offsetWidth - 4;
    if (open && pill.current) gsap.set(pill.current, { width: openWidth.current });
  }, [t.cta.label, open]);

  const { contextSafe } = useGSAP(
    () => {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(root.current, { autoAlpha: 0, y: 24, scale: 0.7 });
      gsap.set(pill.current, { width: SIZE });
      gsap.set(label.current, { autoAlpha: 0, x: -8 });
    },
    { scope: root },
  );

  // Show / hide.
  useGSAP(
    () => {
      const d = reduced.current ? 0 : 1;
      if (visible) {
        gsap.to(root.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 * d, ease: "back.out(1.8)", overwrite: "auto" });
        if (!greeted.current && d) {
          // One small wave the first time it appears in a visit.
          greeted.current = true;
          gsap.fromTo(icon.current, { rotate: 0 }, { rotate: 16, duration: 0.12, repeat: 5, yoyo: true, ease: "sine.inOut", delay: 0.5 });
        }
      } else {
        gsap.to(root.current, { autoAlpha: 0, y: 24, scale: 0.7, duration: 0.35 * d, ease: "power2.in", overwrite: "auto" });
      }
    },
    { dependencies: [visible], scope: root },
  );

  // Circle ⇄ pill.
  useGSAP(
    () => {
      const d = reduced.current ? 0 : 1;
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      if (open) {
        tl.to(pill.current, { width: openWidth.current, duration: 0.55 * d, ease: "expo.out" })
          .to(label.current, { autoAlpha: 1, x: 0, duration: 0.3 * d, ease: "power2.out" }, 0.08 * d)
          .fromTo(icon.current, { rotate: -20 }, { rotate: 0, duration: 0.5 * d, ease: "back.out(3)" }, 0);
      } else {
        tl.to(label.current, { autoAlpha: 0, x: -8, duration: 0.18 * d, ease: "power2.in" })
          .to(pill.current, { width: SIZE, duration: 0.45 * d, ease: "expo.inOut" }, 0.05 * d);
      }
    },
    { dependencies: [open], scope: root },
  );

  // Magnetic pull toward the cursor (mouse only).
  const onMove = contextSafe((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduced.current || !pill.current) return;
    const r = pill.current.getBoundingClientRect();
    gsap.to(pill.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.22,
      y: (e.clientY - (r.top + r.height / 2)) * 0.32,
      duration: 0.4,
      ease: "power3.out",
    });
  });
  const onLeave = contextSafe(() => {
    setHover(false);
    gsap.to(pill.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  });
  const onDown = contextSafe(() => gsap.to(pill.current, { scale: 0.94, duration: 0.12 }));
  const onUp = contextSafe(() => gsap.to(pill.current, { scale: 1, duration: 0.4, ease: "back.out(3)" }));

  return (
    <div
      ref={root}
      className="invisible fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 sm:right-6"
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={onLeave}
    >
      <Link
        ref={pill}
        href="/#agenda"
        aria-label={t.cta.aria}
        onClick={() => track("cta_click")}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onPointerDown={onDown}
        onPointerUp={onUp}
        className="flex h-14 items-center overflow-hidden rounded-full bg-[var(--accent)] text-black shadow-[0_12px_40px_-8px_color-mix(in_srgb,var(--accent)_70%,transparent)] outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ width: SIZE }}
      >
        <span ref={icon} className="flex h-14 w-14 shrink-0 items-center justify-center">
          <MessageCircle size={22} strokeWidth={2.2} />
        </span>
        <span ref={label} className="-ml-1 whitespace-nowrap pr-5 text-sm font-semibold">
          {t.cta.label}
        </span>
      </Link>
    </div>
  );
}
