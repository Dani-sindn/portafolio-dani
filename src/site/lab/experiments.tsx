import type { ComponentType, ReactNode } from "react";
import type { Dict } from "../content";
import { PaletteLab } from "./PaletteLab";
import { TypeLab } from "./TypeLab";
import { DepthLab } from "./DepthLab";
import { Dither } from "./Dither";

/**
 * Lab registry. To add a mini app:
 *  1. Build the component in this folder.
 *  2. Add its texts under `labs.<slug>` in content.ts (en + es): title, blurb, idea, how.
 *  3. Add an entry here.
 */
export interface Experiment {
  slug: keyof Dict["labs"];
  status: "live" | "wip" | "idea";
  year: string;
  tags: string[];
  Component: ComponentType;
  /** Small CSS-only thumbnail shown on the lab grid. */
  thumb: ReactNode;
}

export const experiments: Experiment[] = [
  {
    slug: "type",
    status: "live",
    year: "2026",
    tags: ["Typography", "Variable fonts"],
    Component: TypeLab,
    thumb: (
      <span className="display text-[5.5rem] italic leading-none text-white">
        A<span className="font-sans font-black not-italic text-[var(--accent)]">a</span>
      </span>
    ),
  },
  {
    slug: "dither",
    status: "live",
    year: "2026",
    tags: ["Canvas", "Image"],
    Component: Dither,
    thumb: (
      <span
        className="h-24 w-24 rounded-xl"
        style={{
          backgroundImage:
            "repeating-conic-gradient(var(--accent) 0 25%, var(--surface) 0 50%), linear-gradient(var(--accent-2), var(--accent))",
          backgroundSize: "12px 12px, 100% 100%",
          backgroundBlendMode: "multiply",
        }}
      />
    ),
  },
  {
    slug: "palette",
    status: "live",
    year: "2026",
    tags: ["Color", "Design tokens"],
    Component: PaletteLab,
    thumb: (
      <span className="flex -space-x-5">
        {["var(--accent)", "var(--accent-2)", "#fff"].map((c) => (
          <span key={c} className="h-20 w-20 rounded-full border-4 border-black" style={{ background: c }} />
        ))}
      </span>
    ),
  },
  {
    slug: "depth",
    status: "live",
    year: "2026",
    tags: ["Interaction", "CSS"],
    Component: DepthLab,
    thumb: (
      <span className="relative h-24 w-24">
        <span className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl" style={{ background: "var(--accent-2)", opacity: 0.4 }} />
        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl" style={{ background: "var(--accent)" }} />
        <span className="absolute inset-0 rounded-xl border-2 border-white" />
      </span>
    ),
  },
];
