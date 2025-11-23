import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Database, Terminal, Sparkles, GitBranch } from "lucide-react";

interface WorkflowStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  tools: string[];
}

const workflowSteps: WorkflowStep[] = [
  {
    icon: <Database className="w-5 h-5" />,
    title: "Dataset Construction",
    description: "Curating and structuring training data for specific design needs",
    tools: ["Image curation", "Tagging systems", "Quality control"]
  },
  {
    icon: <Terminal className="w-5 h-5" />,
    title: "Prompt Engineering",
    description: "Building reusable prompt systems that generate consistent results",
    tools: ["Prompt templates", "Style guides", "Output control"]
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Generation & Refinement",
    description: "Iterative generation with human-in-the-loop quality control",
    tools: ["Batch generation", "A/B testing", "Manual curation"]
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Integration",
    description: "Connecting AI outputs into design systems and workflows",
    tools: ["Design tokens", "Component libraries", "Documentation"]
  }
];

function WorkflowStepCard({ step, index }: { step: WorkflowStep; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-zinc-900/30 border border-zinc-800 p-8 rounded-sm hover:border-zinc-700 transition-colors duration-500"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          {step.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-white mb-2">{step.title}</h4>
          <p className="text-zinc-400 leading-relaxed">{step.description}</p>
        </div>
      </div>

      <div className="pl-14">
        <div className="flex flex-wrap gap-2">
          {step.tools.map((tool, i) => (
            <span
              key={i}
              className="text-zinc-500 border-b border-zinc-800"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {index < workflowSteps.length - 1 && (
        <div className="absolute -bottom-8 left-12 flex items-center text-zinc-700">
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      )}
    </motion.div>
  );
}

export function AIWorkflowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-gradient-to-b from-zinc-950 to-black py-32 md:py-40">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 max-w-2xl"
        >
          <h2 className="text-white mb-6">AI as Workflow</h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            Not a magic trick. A structured process for augmenting creative output.
          </p>
          <p className="text-zinc-500 italic">
            The tools change. The thinking doesn't.
          </p>
        </motion.div>

        <div className="space-y-8">
          {workflowSteps.map((step, index) => (
            <WorkflowStepCard key={index} step={step} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 bg-zinc-900/20 border border-zinc-800 rounded-sm">
            <p className="text-white mb-2">10k+</p>
            <p className="text-zinc-500">Curated Images</p>
          </div>
          <div className="text-center p-6 bg-zinc-900/20 border border-zinc-800 rounded-sm">
            <p className="text-white mb-2">50+</p>
            <p className="text-zinc-500">Prompt Systems</p>
          </div>
          <div className="text-center p-6 bg-zinc-900/20 border border-zinc-800 rounded-sm">
            <p className="text-white mb-2">3x</p>
            <p className="text-zinc-500">Output Velocity</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
