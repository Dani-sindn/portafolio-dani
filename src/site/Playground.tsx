import { ArrowUpRight } from "lucide-react";
import { useLang } from "./i18n";
import { Link } from "./router";
import { experiments } from "./lab/experiments";

/** Home teaser for the Lab: a strip of experiment thumbnails linking to /lab. */
export function LabTeaser() {
  const { t } = useLang();
  return (
    <section id="lab" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label text-[var(--accent)]">( {t.labTeaser.label} )</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-white">
            {t.labTeaser.title} <em className="text-[var(--accent-2)]">{t.labTeaser.titleAccent}</em>
          </h2>
          <div className="max-w-sm">
            <p className="text-white/65">{t.labTeaser.body}</p>
            <Link href="/lab" className="btn btn-accent mt-5">
              {t.labTeaser.cta} <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {experiments.map((exp) => (
            <li key={exp.slug} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <Link
                href={`/lab/${exp.slug}`}
                className="group block overflow-hidden rounded-[24px] border border-white/10 transition-colors hover:border-white/30"
              >
                <div
                  className="flex aspect-square items-center justify-center transition-transform duration-500 group-hover:scale-105"
                  style={{ background: "radial-gradient(80% 80% at 50% 30%, color-mix(in srgb, var(--accent) 22%, var(--surface)), var(--surface))" }}
                >
                  {exp.thumb}
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <span className="display text-xl text-white">{t.labs[exp.slug].title}</span>
                  <ArrowUpRight size={16} className="shrink-0 text-[var(--accent)]" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
