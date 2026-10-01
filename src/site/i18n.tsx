import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dictionaries, type Dict, type Lang } from "./content";

const STORAGE_KEY = "dc-lang";

interface LangState {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  /** True until the visitor has picked a language once. */
  needsChoice: boolean;
}

const Ctx = createContext<LangState | null>(null);

function readStored(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "en" || v === "es" ? v : null;
  } catch {
    return null;
  }
}

function browserLang(): Lang {
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(readStored);
  const [lang, setLangState] = useState<Lang>(stored ?? browserLang());
  const [needsChoice, setNeedsChoice] = useState(stored === null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setNeedsChoice(false);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang, needsChoice }), [lang, setLang, needsChoice]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}

/** First-visit language picker. Shows both languages at once so it reads for everyone. */
export function LanguageModal() {
  const { needsChoice, setLang, lang } = useLang();
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!needsChoice) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLang(lang);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [needsChoice, setLang, lang]);

  const options: { id: Lang; label: string; hint: string }[] = [
    { id: "es", label: "Español", hint: dictionaries.es.langModal.title },
    { id: "en", label: "English", hint: dictionaries.en.langModal.title },
  ];
  // Put the browser's language first.
  if (lang === "en") options.reverse();

  return (
    <AnimatePresence>
      {needsChoice && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-md sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/15 bg-[var(--surface)] p-6 sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
              style={{ background: "var(--accent)", opacity: 0.35 }}
            />
            <p className="label text-[var(--accent)]">Dani Cruz</p>
            <h2 id="lang-title" className="display mt-3 text-4xl leading-[1] text-white sm:text-5xl">
              {options[0].hint}
              <br />
              <em className="text-white/45">{options[1].hint}</em>
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {options.map((o, i) => (
                <button
                  key={o.id}
                  ref={i === 0 ? firstRef : undefined}
                  type="button"
                  onClick={() => setLang(o.id)}
                  className={`group rounded-2xl border p-4 text-left transition-colors ${i === 0 ? "border-transparent bg-[var(--accent)] text-black" : "border-white/20 text-white hover:border-white/50"}`}
                >
                  <span className="label opacity-60">{o.id.toUpperCase()}</span>
                  <span className="display mt-1 block text-3xl">{o.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-sm text-white/50">
              {dictionaries[options[0].id].langModal.body}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
