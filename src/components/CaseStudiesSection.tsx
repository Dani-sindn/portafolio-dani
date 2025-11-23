import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ImageWithFallback } from "./ui/image-with-fallback";

interface CaseStudy {
  title: string;
  problem: string;
  solution: string;
  impact: string;
  imageUrl: string;
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    title: "E-commerce Redesign",
    problem: "Complex checkout flow causing 60% cart abandonment",
    solution: "Redesigned checkout with single-page flow, smart defaults, and progressive disclosure",
    impact: "Cart abandonment reduced to 28%. Conversion rate increased by 42%.",
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80",
    tags: ["UX Design", "Conversion Optimization", "User Research"]
  },
  {
    title: "AI Design System",
    problem: "Manual design process couldn't scale with product velocity",
    solution: "Built automated design system using generative AI for component variants and documentation",
    impact: "Design time reduced by 65%. Consistency across 200+ screens.",
    imageUrl: "https://images.unsplash.com/photo-1510832758362-af875829efcf?w=1200&q=80",
    tags: ["Design Systems", "AI Automation", "Scalability"]
  },
  {
    title: "Brand Identity Refresh",
    problem: "Legacy brand didn't reflect modern product values",
    solution: "Complete visual identity overhaul: new typography, color system, photography direction",
    impact: "Brand recognition increased 3x. Press coverage in 15+ publications.",
    imageUrl: "https://images.unsplash.com/photo-1631643089475-7ce8302dface?w=1200&q=80",
    tags: ["Brand Identity", "Art Direction", "Visual Systems"]
  }
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-32 md:mb-40"
    >
      <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
        <div className="aspect-[16/10] overflow-hidden bg-zinc-900 rounded-sm">
          <ImageWithFallback
            src={study.imageUrl}
            alt={study.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
        <h3 className="text-white mb-8">{study.title}</h3>

        <div className="space-y-6 mb-8">
          <div>
            <p className="text-zinc-500 mb-2">The Problem</p>
            <p className="text-zinc-300 leading-relaxed">{study.problem}</p>
          </div>

          <div>
            <p className="text-zinc-500 mb-2">What I Did</p>
            <p className="text-zinc-300 leading-relaxed">{study.solution}</p>
          </div>

          <div>
            <p className="text-zinc-500 mb-2">Impact</p>
            <p className="text-white leading-relaxed">{study.impact}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function CaseStudiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-black py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 max-w-3xl"
        >
          <h2 className="text-white mb-6">Selected Work</h2>
          <p className="text-zinc-400 leading-relaxed">
            Real projects. Real impact. Focused on outcomes, not decoration.
          </p>
        </motion.div>

        <div>
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={index} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
