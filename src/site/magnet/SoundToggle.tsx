import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "../i18n";
import { isSoundEnabled, onSoundChange, setSoundEnabled } from "./sound";

/** Mute / unmute the magnet-dot sounds. Remembers the choice. */
export function SoundToggle() {
  const { t } = useLang();
  const [on, setOn] = useState(isSoundEnabled);
  useEffect(() => {
    const off = onSoundChange(setOn);
    return () => {
      off();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label={on ? t.nav.soundOff : t.nav.soundOn}
      title={on ? t.nav.soundOff : t.nav.soundOn}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/15 ${on ? "text-white/85" : "text-white/40"}`}
    >
      {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
}
