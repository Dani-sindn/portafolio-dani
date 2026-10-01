import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, Menu, X } from "lucide-react";
import { profile } from "./content";
import { palettes, usePalette } from "./palette";
import { useLang } from "./i18n";
import { Link, navigate, usePath } from "./router";

export function Nav() {
  const { palette, cycle } = usePalette();
  const { t, lang, setLang } = useLang();
  const path = usePath();
  const onLab = path.startsWith("/lab");
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation and with Escape; lock page scroll while it's open.
  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const links = [
    { href: "/#about", label: t.nav.about },
    { href: "/#work", label: t.nav.work },
    { href: "/lab", label: t.nav.lab, active: onLab },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-8 sm:pt-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full py-2 pl-4 pr-2 text-sm">
        <Link href="/" className="display text-lg italic text-white">DC</Link>

        <div className="hidden items-center gap-6 text-white/70 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={l.active ? "text-[var(--accent)]" : "hover:text-white"}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex rounded-full bg-white/10 p-0.5" role="group" aria-label="Language">
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`label rounded-full px-2.5 py-1.5 transition-colors ${lang === l ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={cycle}
            className="flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-2 text-white/85 hover:bg-white/15"
            aria-label={`${t.nav.palette} (${palette.name})`}
          >
            <span className="flex -space-x-1">
              {[palette.accent, palette.accent2].map((c, i) => (
                <span key={i} className="h-3.5 w-3.5 rounded-full ring-2 ring-black" style={{ background: c }} />
              ))}
            </span>
            <span className="label hidden sm:inline">{palettes.some((p) => p.id === palette.id) ? palette.name : "Custom"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 -z-10 flex flex-col justify-end bg-black/90 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-2">
              {[...links, { href: "/#agenda", label: t.nav.agenda, active: false }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={(e) => {
                      // Unlock scrolling before jumping, otherwise the anchor scroll is swallowed.
                      e.preventDefault();
                      setMenuOpen(false);
                      requestAnimationFrame(() => requestAnimationFrame(() => navigate(l.href)));
                    }}
                    className={`display flex items-baseline justify-between border-b border-white/10 py-3 text-5xl ${l.active ? "italic text-[var(--accent)]" : "text-white"}`}
                  >
                    {l.label}
                    <span className="label text-white/35">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Experience() {
  const { t } = useLang();
  const jobs = t.experience.jobs;
  if (jobs.length === 0) return null;
  return (
    <section className="relative bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label text-[var(--accent)]">( {t.experience.label} )</p>
        <ol className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {jobs.map((job) => (
            <li key={`${job.company}-${job.period}`} className="group grid gap-2 py-8 md:grid-cols-[10rem_1fr_1fr] md:gap-8">
              <span className="label pt-2 text-white/50">{job.period}</span>
              <div>
                <h3 className="display text-3xl text-white transition-colors group-hover:text-[var(--accent)] sm:text-4xl">{job.company}</h3>
                <p className="mt-1 text-white/60">{job.role}</p>
              </div>
              <p className="text-white/70 md:pt-2">{job.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-6 md:grid-cols-[10rem_1fr] md:gap-8">
          <span className="label pt-1 text-white/50">{t.experience.alsoLabel}</span>
          <div>
            <ul className="space-y-3">
              {t.experience.also.map((item) => (
                <li key={item} className="flex gap-3 text-white/75">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="label mt-6 text-white/45">{t.experience.education}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useLang();
  const { links, email } = profile;
  const social = [
    { href: links.github, label: "GitHub", Icon: Github },
    { href: links.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: links.instagram, label: "Instagram", Icon: Instagram },
  ].filter((l) => l.href);

  return (
    <footer id="contact" className="relative overflow-hidden bg-black pb-10 pt-32">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{ background: "radial-gradient(70% 60% at 50% 100%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label text-[var(--accent)]">( {t.contact.label} )</p>
        <h2 className="display mt-4 text-[clamp(3.2rem,12vw,10rem)] leading-[0.86] text-white">
          {t.contact.title1} <br />
          <em className="text-[var(--accent)]">{t.contact.titleAccent}</em> {t.contact.title2}
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {email && (
            <a href={`mailto:${email}`} className="btn btn-accent">
              <Mail size={16} /> {email}
            </a>
          )}
          {social.map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="btn">
              <Icon size={16} /> {label} <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
        <div className="mt-24 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name} · {t.hero.location}
          </span>
          <span>{t.contact.footer}</span>
        </div>
      </div>
    </footer>
  );
}
