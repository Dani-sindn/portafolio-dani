import { PaletteProvider } from "./site/palette";
import { LangProvider, LanguageModal } from "./site/i18n";
import { usePath } from "./site/router";
import { Hero } from "./site/Hero";
import { Manifesto } from "./site/Manifesto";
import { Inspiration } from "./site/Inspiration";
import { Capabilities } from "./site/Capabilities";
import { Featured } from "./site/Featured";
import { LabTeaser } from "./site/Playground";
import { LabPage } from "./site/lab/LabPage";
import { Contact, Experience, Nav } from "./site/Chrome";

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
    </main>
  );
}

function Routes() {
  const path = usePath();
  const lab = path.match(/^\/lab(?:\/([\w-]+))?\/?$/);
  return lab ? <LabPage slug={lab[1]} /> : <Home />;
}

export default function App() {
  return (
    <LangProvider>
      <PaletteProvider>
        <div id="top" className="min-h-screen bg-black text-white selection:bg-[var(--accent)] selection:text-black">
          <Nav />
          <Routes />
          <Contact />
          <LanguageModal />
        </div>
      </PaletteProvider>
    </LangProvider>
  );
}
