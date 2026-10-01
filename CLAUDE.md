# CLAUDE.md

Personal portfolio for Dani Cruz (UX/UI designer, "diseñador y orquestador de soluciones", LATAM).
Vite + React 18 + TS + Tailwind 3. Deployed by Vercel on every push to `main`
(https://portfolio-dani-cruz.vercel.app). See README.md for structure and common tasks.

## Working agreements

- The owner talks in Spanish; reply in Spanish.
- `main` is production. Prefer a branch + Vercel preview for anything risky; push to `main`
  only when asked.
- Verify UI changes in the browser at desktop (≥1280) **and** phone (375×812) widths before
  calling them done. Mobile has its own layout rules (see Hero below).
- `npm run build` must pass (it runs `tsc` first).

## Conventions

- **All copy lives in `src/site/content.ts`**, typed from the `en` dictionary; `es` must match.
  Components read it through `useLang().t`. Never hard-code visible strings in components
  (exception: the RedAcopio mock UI is intentionally Spanish).
- Colors come from CSS variables `--accent`, `--accent-2`, `--surface` (set by `palette.tsx`).
  Use `var(--accent)` etc., never fixed hex values for themed elements.
- Typography: `.display` (Instrument Serif), `.label` (JetBrains Mono, uppercase), body is Inter Tight.
- Routing is a tiny History-API router (`router.tsx`); use its `<Link>` for internal links
  ("/", "/lab", "/lab/:slug", "/#section"). `vercel.json` rewrites `/lab/*` to the SPA.
- Heavy or late UI is lazy-loaded (`LabPage`, `TalkButton` with GSAP). Keep the main chunk lean.

## Hero (`src/site/Hero.tsx`) — the delicate part

- Hand-written canvas 2D particle system writing straight into an `ImageData` buffer (opaque
  canvas, premultiplied colors). Physics: spring to a "home" target + pointer repulsion +
  breathing noise; scroll progress `--p` scatters particles and opens the "idea space" circle
  (radius must match between `circleRadius()` and the CSS overlay).
- Slides morph with an eased, staggered float (`TRANS_DELAY`, `TRANS_MOVE`).
- Density slider only fades particles (sampled once at full budget) — don't resample on change.
- An auto-quality governor measures per-frame work and trims visible particles on slow devices.
- Phones (portrait, <768px): photo fills the top ~82%, per-slide `focusX`, top/bottom rows fade
  out (a hard edge used to turn into an accent-colored stripe), compact controls, start at 50%
  density, DPR capped at 1.5, and `.glass` has no backdrop-filter (it caused scroll lag).

## Pending / owner-provided data

- `profile.email` and `profile.bookingUrl` are empty: the agenda's submit stays disabled until set.
- Universidad El Bosque talk copy was drafted without details — confirm with the owner.
