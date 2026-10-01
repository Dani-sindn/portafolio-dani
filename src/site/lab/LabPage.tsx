import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { useLang } from "../i18n";
import { Link } from "../router";
import { experiments, type Experiment } from "./experiments";

function StatusPill({ status }: { status: Experiment["status"] }) {
  const t = useLang().t.lab;
  return (
    <span className="label inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-white/70">
      <span className={`h-1.5 w-1.5 rounded-full ${status === "live" ? "bg-[var(--accent)]" : "bg-white/40"}`} />
      {t.status[status]}
    </span>
  );
}

function LabIndex() {
  const { t } = useLang();
  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 sm:pt-40">
        <p className="label text-[var(--accent)]">( {t.lab.title} — {experiments.length} )</p>
        <h1 className="display mt-4 text-[clamp(4.5rem,18vw,14rem)] leading-[0.82] text-white">
          {t.lab.title}
          <em className="text-[var(--accent)]">.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/70">{t.lab.intro}</p>
      </header>

      <ul className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {experiments.map((exp, i) => {
          const copy = t.labs[exp.slug];
          return (
            <motion.li
              key={exp.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/lab/${exp.slug}`}
                className="group block h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] transition-colors hover:border-white/30"
              >
                <div
                  className="flex aspect-[16/10] items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ background: "radial-gradient(80% 80% at 50% 30%, color-mix(in srgb, var(--accent) 22%, var(--surface)), var(--surface))" }}
                >
                  {exp.thumb}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="label text-white/45">
                      {String(i + 1).padStart(2, "0")} · {exp.year}
                    </span>
                    <StatusPill status={exp.status} />
                  </div>
                  <h2 className="display mt-3 text-3xl text-white">{copy.title}</h2>
                  <p className="mt-2 text-white/65">{copy.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm text-[var(--accent)]">
                    {t.lab.open} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
        <li className="flex min-h-[12rem] items-center justify-center rounded-[28px] border border-dashed border-white/15 p-6 text-center text-white/45">
          {t.lab.soon}
        </li>
      </ul>
    </>
  );
}

function LabDetail({ exp }: { exp: Experiment }) {
  const { t } = useLang();
  const copy = t.labs[exp.slug];
  const idx = experiments.indexOf(exp);
  const next = experiments[(idx + 1) % experiments.length];
  const { Component } = exp;

  return (
    <article className="mx-auto max-w-7xl px-4 pt-28 sm:px-8 sm:pt-32">
      <Link href="/lab" className="label inline-flex items-center gap-2 text-white/60 hover:text-white">
        <ArrowLeft size={14} /> {t.lab.allExperiments}
      </Link>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={exp.status} />
            <span className="label text-white/45">{exp.tags.join(" · ")}</span>
          </div>
          <h1 className="display mt-4 text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-white">{copy.title}</h1>
        </div>
        <p className="max-w-sm text-lg text-white/65">{copy.blurb}</p>
      </div>

      <div className="lab-card mt-10">
        <Component />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="rounded-[28px] border border-white/10 p-6 sm:p-8">
          <p className="label text-[var(--accent)]">{t.lab.idea}</p>
          <p className="display mt-4 text-2xl leading-snug text-white sm:text-3xl">{copy.idea}</p>
        </section>
        <section className="rounded-[28px] border border-white/10 p-6 sm:p-8">
          <p className="label text-[var(--accent)]">{t.lab.how}</p>
          <p className="mt-4 text-white/70">{copy.how}</p>
        </section>
      </div>

      <Link
        href={`/lab/${next.slug}`}
        className="group mt-10 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 p-6 transition-colors hover:border-white/30 sm:p-8"
      >
        <span className="display text-3xl text-white sm:text-5xl">{t.labs[next.slug].title}</span>
        <ArrowUpRight className="shrink-0 text-[var(--accent)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={32} />
      </Link>
    </article>
  );
}

export function LabPage({ slug }: { slug?: string }) {
  const { t } = useLang();
  const exp = slug ? experiments.find((e) => e.slug === slug) : undefined;

  useEffect(() => {
    document.title = exp ? `${t.labs[exp.slug].title} — Lab · Dani Cruz` : "Lab · Dani Cruz";
    return () => {
      document.title = "Dani Cruz — Designer & solutions orchestrator";
    };
  }, [exp, t]);

  return <div className="min-h-screen bg-black pb-24">{exp ? <LabDetail exp={exp} /> : <LabIndex />}</div>;
}
