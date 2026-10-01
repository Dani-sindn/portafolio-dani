import { useMemo, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { ArrowUpRight, CalendarClock, Check } from "lucide-react";
import { profile } from "./content";
import { useLang } from "./i18n";

const TIMES = ["09:00", "11:00", "15:00", "17:00"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Next `n` weekdays starting tomorrow. */
function nextWeekdays(n: number) {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) days.push(new Date(d));
  }
  return days;
}

const chip = (active: boolean) =>
  `shrink-0 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
    active ? "border-transparent bg-[var(--accent)] text-black" : "border-white/15 text-white/75 hover:border-white/40"
  }`;

/**
 * Calendly-style request: pick a topic, a day and a time; it opens an email with everything
 * filled in (no backend). If `profile.bookingUrl` is set, it also links to the real calendar.
 */
export function Booking() {
  const { t, lang } = useLang();
  const b = t.booking;
  const days = useMemo(() => nextWeekdays(10), []);
  const fmt = useMemo(
    () => new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", { weekday: "short", day: "numeric", month: "short" }),
    [lang],
  );

  const [type, setType] = useState(b.types[0].id);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(TIMES[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = Boolean(profile.email);
  const typeTitle = b.types.find((x) => x.id === type)?.title ?? "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    const when = `${cap(fmt.format(days[day]))} · ${time} (GMT-5)`;
    const body = [`${typeTitle}`, when, "", message, "", `— ${name}`, email].join("\n");
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(`${b.subject}: ${typeTitle}`)}&body=${encodeURIComponent(body)}`;
    track("booking_request", { type, time });
    window.location.href = href;
    setSent(true);
  };

  return (
    <section id="agenda" className="relative bg-black px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="label text-[var(--accent)]">( {b.label} )</p>
          <h2 className="display mt-4 text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] text-white">
            {b.title} <em className="text-[var(--accent)]">{b.titleAccent}</em>
          </h2>
          <p className="mt-6 max-w-md text-lg text-white/70">{b.body}</p>

          <fieldset className="mt-10">
            <legend className="label mb-3 text-white/50">{b.typeLabel}</legend>
            <div className="grid gap-2">
              {b.types.map((tp) => (
                <button key={tp.id} type="button" onClick={() => setType(tp.id)} aria-pressed={type === tp.id} className={chip(type === tp.id)}>
                  <span className="block text-base font-medium">{tp.title}</span>
                  <span className={type === tp.id ? "text-black/70" : "text-white/50"}>{tp.body}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <form onSubmit={submit} className="lab-card min-w-0 self-start">
          <p className="label mb-3 text-white/50">{b.dayLabel}</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((d, i) => (
              <button key={d.toISOString()} type="button" onClick={() => setDay(i)} aria-pressed={day === i} className={`${chip(day === i)} min-w-[5.5rem] text-center`}>
                {cap(fmt.format(d))}
              </button>
            ))}
          </div>

          <p className="label mb-3 mt-6 text-white/50">{b.timeLabel}</p>
          <div className="grid grid-cols-4 gap-2">
            {TIMES.map((tm) => (
              <button key={tm} type="button" onClick={() => setTime(tm)} aria-pressed={time === tm} className={`${chip(time === tm)} text-center tabular-nums`}>
                {tm}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">{b.note}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={b.name} aria-label={b.name} className="field" />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={b.email} aria-label={b.email} className="field" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={b.message} aria-label={b.message} rows={3} className="field sm:col-span-2" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={!canSend} className="btn btn-accent disabled:cursor-not-allowed disabled:opacity-40">
              {sent ? <Check size={16} /> : <CalendarClock size={16} />} {b.submit}
            </button>
            {profile.bookingUrl && (
              <a href={profile.bookingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
                {b.directCta} <ArrowUpRight size={14} />
              </a>
            )}
          </div>
          {!canSend && !profile.bookingUrl && (
            <p className="mt-4 text-sm text-white/50">
              {b.unavailable}{" "}
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">
                LinkedIn ↗
              </a>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

