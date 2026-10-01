import { lazy, Suspense } from "react";
import { PaletteProvider } from "./site/palette";
import { LangProvider, LanguageModal } from "./site/i18n";
import { usePath } from "./site/router";
import { Hero } from "./site/Hero";
import { Manifesto } from "./site/Manifesto";
import { Inspiration } from "./site/Inspiration";
import { Capabilities } from "./site/Capabilities";
import { Featured } from "./site/Featured";
import { LabTeaser } from "./site/Playground";
import { Contact, Experience, Nav } from "./site/Chrome";
import { Booking } from "./site/Booking";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// The Lab is its own chunk: visitors who never open it don't download it.
// GSAP-powered and only shown after the hero, so it loads in the background.
const TalkButton = lazy(() => import("./site/TalkButton").then((m) => ({ default: m.TalkButton })));
const LabPage = lazy(() => import("./site/lab/LabPage").then((m) => ({ default: m.LabPage })));

function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Inspiration />
      <Capabilities />
      <Featured />
      <Experience />
      <LabTeaser />
      <Booking />
    </main>
  );
}

function Routes() {
  const path = usePath();
  const lab = path.match(/^\/lab(?:\/([\w-]+))?\/?$/);
  return lab ? (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LabPage slug={lab[1]} />
    </Suspense>
  ) : (
    <Home />
  );
}

export default function App() {
  return (
    <LangProvider>
      <PaletteProvider>
        <div id="top" className="min-h-screen bg-black text-white selection:bg-[var(--accent)] selection:text-black">
          <Nav />
          <Routes />
          <Contact />
          <Suspense fallback={null}>
            <TalkButton />
          </Suspense>
          <LanguageModal />
        </div>
        {/* Vercel Web Analytics (cookieless) + Speed Insights. They only report once enabled in the Vercel dashboard. */}
        <Analytics />
        <SpeedInsights />
      </PaletteProvider>
    </LangProvider>
  );
}
