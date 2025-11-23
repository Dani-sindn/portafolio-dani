import { Hero } from "@/components/features/Hero";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { FinalCTA } from "./components/FinalCTA";
import heroImage from "@/assets/hero-portrait.png";

export default function App() {
  return (
    <div className="bg-black min-h-screen font-sans text-white selection:bg-white/20">
      {/* Hero Section with Particle Effect */}
      <Hero imageSrc={heroImage} />

      {/* Capabilities Overview with Brand Slider */}
      <CapabilitiesSection />

      {/* Final CTA / Footer */}
      <FinalCTA />
    </div>
  );
}
