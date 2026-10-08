/**
 * Tiny synthesized sound layer for the magnet dots (Web Audio, no files).
 * - shimmer: an airy, barely-there tone that swells as a dot nears the cursor's orbit
 * - chime: a soft bell when a dot joins (each one a step up a pentatonic scale)
 * - landing: a short arpeggio when the swarm settles in the footer
 * Browsers only allow audio after a user gesture, so the context starts on the first
 * pointer/key/touch. The visitor can mute it (persisted).
 */

const STORAGE_KEY = "dc-sound";
/** Overall level. Deliberately low: these are accents, not music. */
const MASTER = 0.05;
/** Hard ceiling after the limiter, so nothing can ever approach full scale on any speaker. */
const CEILING = 0.5;
// C major pentatonic, mid register (Hz): warm, never piercing.
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
/** At most this many bell voices sound at once; extra triggers are skipped. */
const MAX_VOICES = 6;
/** Minimum gap between two chimes (s). */
const MIN_GAP = 0.12;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverbIn: GainNode | null = null;
let activeVoices = 0;
let lastChime = 0;
let shimmer: { a: OscillatorNode; b: OscillatorNode; gain: GainNode } | null = null;
let enabled = readEnabled();
const listeners = new Set<(on: boolean) => void>();

function readEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

/**
 * Signal chain: voices → master (volume) → soft lowpass → limiter → ceiling → speakers.
 * The "space" is a single, gently decaying echo (loop gain 0.3, well below 1) sent back into
 * the master, so it can never build up.
 */
function buildGraph(ac: AudioContext) {
  master = ac.createGain();
  master.gain.value = enabled ? MASTER : 0;

  const soften = ac.createBiquadFilter();
  soften.type = "lowpass";
  soften.frequency.value = 2400; // no harsh highs

  // Safety limiter only: it engages near full scale. (A low threshold would add Web Audio's
  // automatic makeup gain and make quiet sounds louder — measured: -24 dB raised peaks by 10 dB.)
  const limiter = ac.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.25;

  const ceiling = ac.createGain();
  ceiling.gain.value = CEILING;

  master.connect(soften);
  soften.connect(limiter);
  limiter.connect(ceiling);
  ceiling.connect(ac.destination);

  reverbIn = ac.createGain();
  reverbIn.gain.value = 0.25;
  const delay = ac.createDelay(1);
  delay.delayTime.value = 0.28;
  const damp = ac.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 1600;
  const feedback = ac.createGain();
  feedback.gain.value = 0.3;
  reverbIn.connect(delay);
  delay.connect(damp);
  damp.connect(feedback);
  feedback.connect(delay);
  damp.connect(master);
}

/** Call once at startup: arms the audio context on the first user gesture. */
export function armAudio() {
  const start = () => {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      buildGraph(ctx);
    }
    if (ctx.state === "suspended") void ctx.resume();
  };
  const opts = { passive: true } as const;
  window.addEventListener("pointerdown", start, opts);
  window.addEventListener("keydown", start);
  window.addEventListener("touchstart", start, opts);
  return () => {
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
    window.removeEventListener("touchstart", start);
  };
}

const live = () => (enabled && ctx && master && reverbIn && ctx.state === "running" ? ctx : null);

function voice(ac: AudioContext, freq: number, peak: number, at: number, decay: number) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  // Gentle 40 ms attack (no click) and a long, soft tail.
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  osc.connect(g);
  g.connect(master!);
  g.connect(reverbIn!);
  osc.start(at);
  osc.stop(at + decay + 0.05);
  activeVoices++;
  osc.onended = () => {
    activeVoices--;
    g.disconnect();
  };
}

/** Soft bell for the n-th dot that joins. */
export function chime(n: number, delay = 0) {
  const ac = live();
  if (!ac) return;
  const t = ac.currentTime + delay;
  if (activeVoices >= MAX_VOICES || t - lastChime < MIN_GAP) return;
  lastChime = t;
  const f = SCALE[n % SCALE.length];
  voice(ac, f, 0.35, t, 1.6);
  voice(ac, f * 2, 0.06, t, 0.9); // faint airy partial
}

/**
 * Homecoming: when a dot flies back to its heading. Same note as its chime (so going up replays
 * the melody downward), but softer and warmer, with its lower octave underneath.
 */
export function homecoming(n: number) {
  const ac = live();
  if (!ac) return;
  const t = ac.currentTime;
  if (activeVoices >= MAX_VOICES || t - lastChime < MIN_GAP) return;
  lastChime = t;
  const f = SCALE[n % SCALE.length];
  voice(ac, f, 0.2, t, 1.3);
  voice(ac, f / 2, 0.1, t, 1.5);
}

/** Proximity shimmer: 0 = silent, 1 = right at the orbit. Cheap to call every frame. */
export function setShimmer(proximity: number) {
  const ac = live();
  if (!ac) return;
  // Very faint: a breath more than a tone.
  const level = Math.max(0, Math.min(1, proximity)) ** 2 * 0.012;
  if (!shimmer && level > 0.001) {
    const gain = ac.createGain();
    gain.gain.value = 0;
    const a = ac.createOscillator();
    const b = ac.createOscillator();
    a.type = b.type = "sine";
    a.frequency.value = 784;
    b.frequency.value = 784 * 1.006; // slow beating = shimmer
    a.connect(gain);
    b.connect(gain);
    gain.connect(reverbIn!);
    a.start();
    b.start();
    shimmer = { a, b, gain };
  }
  if (shimmer) {
    shimmer.gain.gain.setTargetAtTime(level, ac.currentTime, 0.08);
    // Pitch leans upward as it gets closer.
    shimmer.a.frequency.setTargetAtTime(660 + proximity * 220, ac.currentTime, 0.1);
    shimmer.b.frequency.setTargetAtTime((660 + proximity * 220) * 1.006, ac.currentTime, 0.1);
    if (level <= 0.001) {
      const s = shimmer;
      shimmer = null;
      s.gain.gain.setTargetAtTime(0, ac.currentTime, 0.05);
      s.a.stop(ac.currentTime + 0.4);
      s.b.stop(ac.currentTime + 0.4);
    }
  }
}

/** Short, quiet ascending arpeggio when the swarm lands in the footer. */
export function landing() {
  if (!live()) return;
  [0, 2, 4].forEach((step, i) => chime(step, i * 0.18));
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (ctx && master) master.gain.setTargetAtTime(on ? MASTER : 0, ctx.currentTime, 0.05);
  if (!on) setShimmer(0);
  listeners.forEach((fn) => fn(on));
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
