import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Layers, Target, Zap, RefreshCw } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  example?: string;
}

const steps: Step[] = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Intention",
    description: "Every design decision starts with purpose. What problem are we solving, and for whom?",
    example: "Define the core user need"
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Structure",
    description: "Build systems, not solutions. Create frameworks that scale and adapt.",
    example: "Design tokens → Components → Patterns"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Clarity",
    description: "Remove noise. Simplify complexity. Make the interface invisible.",
    example: "Less is always more"
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Iteration",
    description: "AI as co-designer. Rapid prototyping through prompts, datasets, and refinement.",
    example: "Prompt → Generate → Refine → Evolve"
  }
];

function ProcessStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="flex items-start gap-6 md:gap-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
          {step.icon}
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-white mb-3">{step.title}</h3>
          <p className="text-zinc-400 leading-relaxed mb-4">{step.description}</p>
          {step.example && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
              <ArrowRight className="w-4 h-4 text-zinc-600" />
              <span className="text-zinc-500">{step.example}</span>
            </div>
          )}
        </div>
      </div>

      {index < steps.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-zinc-800 to-transparent" />
      )}
    </motion.div>
  );
}

export function HowIThinkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-gradient-to-b from-black to-zinc-950 py-32 md:py-40">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-white mb-6">How I think</h2>
          <p className="text-zinc-400 leading-relaxed">
            A prompt-driven approach to design. Process over decoration. Systems over pixels.
          </p>
        </motion.div>

        <div className="space-y-16 md:space-y-20">
          {steps.map((step, index) => (
            <ProcessStep key={index} step={step} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <p className="text-zinc-600 italic">
            "Design is not just what it looks like. Design is how it works." — and how it's built.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
