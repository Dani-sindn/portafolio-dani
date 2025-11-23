import { BrandSlider } from "@/components/features/BrandSlider";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Capability {
  title: string;
  description: string;
  details: string[];
}

const capabilities: Capability[] = [
  {
    title: "Creative Problem-Solving",
    description: "Design systems that bring clarity and structure to complex challenges.",
    details: ["Design Systems", "Information Architecture", "Structure & Clarity", "Strategic Thinking"]
  },
  {
    title: "Generative Design & Automation",
    description: "AI workflows, prompt engineering, and dataset construction for design at scale.",
    details: ["AI Workflows", "Prompt Systems", "Custom Datasets", "LORAs & Fine-tuning"]
  },
  {
    title: "UI & Product Design",
    description: "Crafting intuitive interfaces with thoughtful components and patterns.",
    details: ["Component Systems", "Layout Design", "Interaction Patterns", "User Flows"]
  },
  {
    title: "Art Direction & Vibe Coding",
    description: "Visual storytelling through photography, composition, and mood.",
    details: ["Photography", "Composition", "Visual Mood", "Editorial Design"]
  }
];

function CapabilityCard({ capability, index }: { capability: Capability; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-zinc-900/50 border border-zinc-800 p-10 md:p-12 rounded-sm hover:border-zinc-700 transition-colors duration-500"
    >
      <div className="mb-6">
        <h3 className="text-white mb-4">{capability.title}</h3>
        <p className="text-zinc-400 leading-relaxed">{capability.description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {capability.details.map((detail, i) => (
          <span
            key={i}
            className="px-4 py-2 bg-zinc-800/50 text-zinc-500 rounded-full border border-zinc-800"
          >
            {detail}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function CapabilitiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative z-10 w-full bg-black">
      {/* Gradient Overlay for smooth integration */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black -translate-y-full pointer-events-none" />

      {/* Visual Divider - Black space with gradient stroke */}
      <div className="w-full h-24 bg-black relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
      </div>

      {/* Brand Slider */}
      <BrandSlider />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32 md:pt-20 md:pb-40">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 max-w-3xl"
        >
          <h2 className="text-white mb-6">What I do</h2>
          <p className="text-zinc-400 leading-relaxed">
            I create purposeful design systems and visual experiences that merge creative thinking with technical execution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} capability={capability} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}