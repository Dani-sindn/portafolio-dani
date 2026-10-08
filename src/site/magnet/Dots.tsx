/**
 * Magnet dots: the final periods of section headings. As the visitor scrolls past a section its
 * dot detaches, flies to the cursor and orbits it (see MagnetField). The footer's period is the
 * "home" dot where every collected particle finally lands.
 */
export function MagnetDot({ home = false }: { home?: boolean }) {
  return home ? <span data-magnet-home="">.</span> : <span data-magnet-dot="">.</span>;
}

/** Renders `text` with its trailing period as a magnet dot (no-op if it doesn't end with one). */
export function dotted(text: string) {
  return text.endsWith(".") ? (
    <>
      {text.slice(0, -1)}
      <MagnetDot />
    </>
  ) : (
    text
  );
}
